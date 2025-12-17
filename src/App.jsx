import React, { useState, useEffect } from 'react';
import { Heart, Settings } from 'lucide-react';
import LiveCounter from './components/LiveCounter';
import Timeline from './components/Timeline';
import WhyYouList from './components/WhyYouList';
import BucketList from './components/BucketList';
import TimeCapsule from './components/TimeCapsule';
import MusicPlayer from './components/MusicPlayer';
import LandingPage from './components/LandingPage';
import AdminPanel from './components/AdminPanel';
import Chat from './components/Chat';
import Recipes from './components/RecipesList.jsx';
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit, getDocs, deleteDoc, where } from 'firebase/firestore';

const DEFAULT_PLAYLIST = [
  {
    url: "https://www.youtube.com/watch?v=JWLWczFtCag",
    title: "Bizim Şarkımız"
  }
];

const DEFAULT_REASONS = [
  "Çünkü gülüşün yanımdayken içimi sakinleştiriyor.",
  "Dünyanın sesi biraz kısılıyor.",
  "Çünkü yanında mutlu olmaya çaba harcamıyorum.",
  "Çünkü karakterine hayranım. Sadece bana değil, hayata nasıl davrandığını seviyorum.",
  "Çünkü seni tanıdıkça biten bir merak değil, artan bir bağ hissediyorum.",
  "Çünkü seninle konuşmak sessizlik kadar rahat, kahkaha kadar canlı.",
];

const DEFAULT_BUCKET_LIST = [
  { id: 1, text: "Seninle, her köşesini kendi zevkimize göre döşediğimiz, kapısından girdiğimizde sadece 'huzur' ve 'biz' kokan o evde yaşlanmak.", completed: false },
  { id: 2, text: "Yıllar sonra saçlarımıza aklar düştüğünde bile, şu anki gibi el ele sahilde yürümek ve 'Ne güzel yaşadık be!' diyebilmek.", completed: false },
  { id: 3, text: "Pazar kahvaltılarının saatlerce sürdüğü, demli çay eşliğinde hayattan konuştuğumuz, acele etmediğimiz o geniş sofraları kurmak.", completed: false },
  { id: 4, text: "Türkiye'nin görmediğimiz her şehrini, her antik kentini karış karış seninle gezmek; her şehirde yeni bir anı biriktirmek.", completed: false },
  { id: 5, text: "Hasta olduğunda sana çorba yapan, yorulduğunda kahveni getiren kişinin ömrümün sonuna kadar ben olması.", completed: false },
];

const DEFAULT_TIME_CAPSULE = {
  unlockDate: "2024-12-31",
  messageForHer: `Sevgilim,

Bu mektubu okuyorsan, birlikte bir yılı daha geride bırakmışız demektir. 
Umarım şu an yan yanayızdır ve bu satırları gülümseyerek okuyoruzdur.
Seni o gün ne kadar seviyorsam, bugün daha çok seviyorum.

Sonsuza dek seninle...`,
  messageForHim: `Canım,

Seninle geçen her gün benim için bir hediye.
Gelecekteki bize not: Umarım hala birbirinize böyle aşkla bakıyorsunuzdur.
Seni çok seviyorum.

Daima senin...`
};

function App() {
  const [userType, setUserType] = useState(null); // 'guest' | 'couple' | null
  const [currentUser, setCurrentUser] = useState(null); // 'him' | 'her' | null
  const [showAdmin, setShowAdmin] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'recipes'
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const notificationsEnabledRef = React.useRef(notificationsEnabled);

  useEffect(() => {
    notificationsEnabledRef.current = notificationsEnabled;
  }, [notificationsEnabled]);

  const handleLogin = (type, user = null) => {
    setUserType(type);
    if (user) setCurrentUser(user);
  };

  // Firestore Real-time Listener
  // Firestore Real-time Listener & Auto-Cleanup
  useEffect(() => {
    if (userType === 'couple') {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

      // 1. Query only recent messages
      const q = query(
        collection(db, "messages"),
        where("timestamp", ">", twentyFourHoursAgo),
        orderBy("timestamp", "asc"),
        limit(100)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChatMessages(msgs);

        // Notification Logic
        if (notificationsEnabledRef.current) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const data = change.doc.data();
              // Only notify if:
              // 1. It's a new message (not from initial load - though Firestore initial load adds them as 'added', 
              //    we can check if the timestamp is very recent or rely on the fact that we only want to notify for *incoming* messages).
              //    Actually, for initial load, we might get a burst. 
              //    Better check: Is the timestamp very recent (last 5 seconds)?
              // 2. Sender is NOT the current user.
              const isRecent = new Date(data.timestamp) > new Date(Date.now() - 60000); // 60 seconds window
              if (data.sender !== currentUser && isRecent) {
                // Play Sound
                const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
                audio.volume = 1.0; // Max volume
                audio.play().catch(e => console.error("Audio play failed:", e));

                if (Notification.permission === "granted") {
                  new Notification("Yeni Mesajın Var! 💌", {
                    body: data.text,
                    icon: "/pwa-192x192.png" // Optional: Add an icon if available, or remove
                  });
                }
              }
            }
          });
        }
      });

      // Request Notification Permission if enabled (though we'll handle this on toggle click mostly)
      if (notificationsEnabled && Notification.permission === "default") {
        Notification.requestPermission();
      }

      // 2. Background Cleanup Task (Fire and Forget)
      const cleanupOldMessages = async () => {
        try {
          const oldMsgQuery = query(
            collection(db, "messages"),
            where("timestamp", "<=", twentyFourHoursAgo)
          );
          const snapshot = await getDocs(oldMsgQuery);
          if (!snapshot.empty) {
            console.log(`Cleaning up ${snapshot.size} old messages...`);
            const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
            await Promise.all(deletePromises);
            console.log("Cleanup complete.");
          }
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      };

      cleanupOldMessages();

      return () => unsubscribe();
    }
  }, [userType]);

  const handleSendMessage = async (newMessage) => {
    try {
      await addDoc(collection(db, "messages"), {
        ...newMessage,
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      console.error("Error sending message: ", e);
    }
  };

  const handleClearChat = async () => {
    try {
      // Note: In a real app, we should use a batch delete or cloud function.
      // For this small scale, deleting one by one is acceptable or just relying on manual cleanup.
      // However, to be safe and simple, we will just warn the user or provide a simple implementation.
      // Since client-side delete of all docs is heavy, we'll just console log for now or implement a simple loop if requested.
      // Actually, let's implement a simple loop for the user's convenience since they have < 100 messages.
      const q = query(collection(db, "messages"));
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      alert("Sohbet geçmişi temizlendi!");
    } catch (e) {
      console.error("Error clearing chat: ", e);
      alert("Sohbet temizlenirken hata oluştu.");
    }
  };

  const [playlist, setPlaylist] = useState(() => {
    try {
      const saved = localStorage.getItem('playlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Backward compatibility: convert strings to objects
          return parsed.map(item =>
            typeof item === 'string' ? { url: item, title: 'İsimsiz Şarkı' } : item
          );
        }
      }
      return DEFAULT_PLAYLIST;
    } catch (e) {
      console.error("Error parsing playlist:", e);
      return DEFAULT_PLAYLIST;
    }
  });

  const [reasons, setReasons] = useState(() => {
    const saved = localStorage.getItem('reasons');
    return saved ? JSON.parse(saved) : DEFAULT_REASONS;
  });

  const [bucketList, setBucketList] = useState(() => {
    const saved = localStorage.getItem('bucketList');
    return saved ? JSON.parse(saved) : DEFAULT_BUCKET_LIST;
  });

  const [timeCapsule, setTimeCapsule] = useState(() => {
    const saved = localStorage.getItem('timeCapsule');
    return saved ? JSON.parse(saved) : DEFAULT_TIME_CAPSULE;
  });

  useEffect(() => {
    localStorage.setItem('playlist', JSON.stringify(playlist));
  }, [playlist]);

  useEffect(() => {
    localStorage.setItem('reasons', JSON.stringify(reasons));
  }, [reasons]);

  useEffect(() => {
    localStorage.setItem('bucketList', JSON.stringify(bucketList));
  }, [bucketList]);

  useEffect(() => {
    localStorage.setItem('timeCapsule', JSON.stringify(timeCapsule));
  }, [timeCapsule]);

  if (!userType) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-rose-500/30">
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 text-rose-500 cursor-pointer"
            onClick={() => setCurrentView('home')}
          >
            <Heart className="w-6 h-6 fill-current animate-pulse" />
            <span className="font-bold text-xl tracking-tight hidden md:inline">Bizim Hikayemiz</span>
            {/* DEBUG OVERLAY */}
            <div className="text-xs bg-black/50 p-1 rounded text-green-400 font-mono ml-4 hidden md:block">
              Debug: {currentUser || 'NULL'} ({userType})
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-xl border border-white/5">
              <button
                onClick={() => setCurrentView('home')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentView === 'home'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                Ana Sayfa
              </button>
              <button
                onClick={() => setCurrentView('recipes')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentView === 'recipes'
                  ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                Tarifler
              </button>
            </nav>

            {userType === 'couple' && (
              <button
                onClick={() => setShowAdmin(true)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12 space-y-20">
        {currentView === 'home' ? (
          <>
            <section className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-rose-400 to-purple-500 text-transparent bg-clip-text">
                Sonsuza Dek
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                Seninle geçen her saniye, ömrümün en güzel anı.
              </p>
            </section>

            <LiveCounter startDate="2022-09-14" />

            <Timeline />

            <WhyYouList reasons={reasons} />

            <BucketList items={bucketList} onToggle={(id) => {
              setBucketList(bucketList.map(item =>
                item.id === id ? { ...item, completed: !item.completed } : item
              ));
            }} />

            <TimeCapsule
              unlockDate={timeCapsule.unlockDate}
              messageForHer={timeCapsule.messageForHer}
              messageForHim={timeCapsule.messageForHim}
            />
          </>
        ) : (
          <Recipes userType={userType} />
        )}
      </main>

      <MusicPlayer playlist={playlist} />

      {userType === 'couple' && (
        <Chat
          messages={chatMessages}
          onSendMessage={handleSendMessage}
          currentUser={currentUser}
          notificationsEnabled={notificationsEnabled}
          onToggleNotifications={() => setNotificationsEnabled(!notificationsEnabled)}
        />
      )}

      <AdminPanel
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        currentPlaylist={playlist}
        onPlaylistChange={setPlaylist}
        currentReasons={reasons}
        onReasonsChange={setReasons}
        currentBucketList={bucketList}
        onBucketListChange={setBucketList}
        currentTimeCapsule={timeCapsule}
        onTimeCapsuleChange={setTimeCapsule}
        onClearChat={handleClearChat}
      />

      <footer className="py-8 text-center text-slate-500 text-sm">
        <p>Seni Seviyorum &hearts;</p>
      </footer>
    </div>
  );
}

// End of App component
export default App;
