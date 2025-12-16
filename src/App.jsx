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
import { db } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';

const DEFAULT_PLAYLIST = [
  {
    url: "https://www.youtube.com/watch?v=JWLWczFtCag",
    title: "Bizim Şarkımız"
  }
];

const DEFAULT_REASONS = [
  "Gülüşünle dünyamı aydınlatman",
  "Her sabah seninle uyanma hayali",
  "Beni olduğum gibi sevmen",
  "Zor zamanlarımda yanımda olman",
  "Birlikte kurduğumuz hayaller",
  "Sesini duyduğumda hissettiğim mutluluk",
];

const DEFAULT_BUCKET_LIST = [
  { id: 1, text: "Kapadokya'da balon turu yapmak", completed: false },
  { id: 2, text: "Birlikte yemek kursuna gitmek", completed: false },
  { id: 3, text: "Kuzey Işıklarını izlemek", completed: false },
  { id: 4, text: "Kendi evimizi dekore etmek", completed: false },
  { id: 5, text: "Paris'te Eyfel Kulesi önünde fotoğraf çekilmek", completed: false },
  { id: 6, text: "Bir barınaktan köpek sahiplenmek", completed: false },
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

  const handleLogin = (type, user = null) => {
    setUserType(type);
    if (user) setCurrentUser(user);
  };

  // Firestore Real-time Listener
  useEffect(() => {
    if (userType === 'couple') {
      const q = query(
        collection(db, "messages"),
        orderBy("timestamp", "asc"),
        limit(100)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setChatMessages(msgs);
      });

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
    return <LandingPage onLogin={setUserType} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-rose-500/30">
      <header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-rose-500">
            <Heart className="w-6 h-6 fill-current animate-pulse" />
            <span className="font-bold text-xl tracking-tight">Bizim Hikayemiz</span>
          </div>

          {userType === 'couple' && (
            <button
              onClick={() => setShowAdmin(true)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 pt-24 pb-12 space-y-20">
        <section className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-rose-400 to-purple-500 text-transparent bg-clip-text">
            Sonsuza Dek
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Seninle geçen her saniye, ömrümün en güzel anı.
          </p>
        </section>

        <LiveCounter startDate="2023-01-01" />

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
      </main>

      <MusicPlayer playlist={playlist} />

      {userType === 'couple' && (
        <Chat messages={chatMessages} onSendMessage={handleSendMessage} currentUser={currentUser} />
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
      />

      <footer className="py-8 text-center text-slate-500 text-sm">
        <p>Seni Seviyorum &hearts;</p>
      </footer>
    </div>
  );
}

export default App;
