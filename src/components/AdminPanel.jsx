import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Music, Heart, Plus, X, Save, List, Clock, MessageCircle } from 'lucide-react';

const AdminPanel = ({
  currentPlaylist,
  onPlaylistChange,
  currentReasons,
  onReasonsChange,
  currentBucketList,
  onBucketListChange,
  currentTimeCapsule,
  onTimeCapsuleChange,
  onClearChat,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState('music');
  // ... (rest of state)

  // ... (rest of handlers)

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10 bg-slate-900/50">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-rose-500" />
                <h2 className="text-xl font-bold text-white">Yönetim Paneli</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto">
              <TabButton id="music" icon={Music} label="Müzik Listesi" />
              <TabButton id="reasons" icon={Heart} label="Neden Sen?" />
              <TabButton id="bucket" icon={List} label="Hayaller" />
              <TabButton id="capsule" icon={Clock} label="Zaman Kapsülü" />
              <TabButton id="chat" icon={MessageCircle} label="Sohbet" />
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto flex-1">
              {activeTab === 'music' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Yeni Şarkı Ekle
                    </label>
                    <div className="flex flex-col gap-3">
                      <input
                        type="text"
                        value={newSongTitle}
                        onChange={(e) => setNewSongTitle(e.target.value)}
                        placeholder="Şarkı İsmi (Örn: Bizim Şarkımız)"
                        className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                      />
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={newSongUrl}
                          onChange={(e) => setNewSongUrl(e.target.value)}
                          placeholder="YouTube Linki (https://...)"
                          className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                        />
                        <button
                          onClick={handleAddSong}
                          disabled={!newSongUrl.trim() || !newSongTitle.trim()}
                          className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl font-medium transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Ekle
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                    {currentPlaylist.map((song, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-950/50 border border-white/5 rounded-lg group"
                      >
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-white font-medium truncate">{song.title}</span>
                          <span className="text-slate-500 text-xs truncate">{song.url}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveSong(index)}
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    {currentPlaylist.length === 0 && (
                      <p className="text-slate-500 text-center py-4">Henüz şarkı eklenmemiş.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'reasons' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddReason} className="flex gap-3">
                    <input
                      type="text"
                      value={newReason}
                      onChange={(e) => setNewReason(e.target.value)}
                      placeholder="Yeni bir neden ekle..."
                      className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!newReason.trim()}
                      className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Ekle
                    </button>
                  </form>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {currentReasons.map((reason, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-slate-950/50 border border-white/5 rounded-lg group"
                      >
                        <span className="text-slate-300">{reason}</span>
                        <button
                          onClick={() => handleRemoveReason(index)}
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'bucket' && (
                <div className="space-y-6">
                  <form onSubmit={handleAddBucketItem} className="flex gap-3">
                    <input
                      type="text"
                      value={newBucketItem}
                      onChange={(e) => setNewBucketItem(e.target.value)}
                      placeholder="Yeni bir hayal ekle..."
                      className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!newBucketItem.trim()}
                      className="bg-rose-500 hover:bg-rose-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Ekle
                    </button>
                  </form>

                  <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                    {currentBucketList.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-slate-950/50 border border-white/5 rounded-lg group"
                      >
                        <span className={`text-slate-300 ${item.completed ? 'line-through opacity-50' : ''}`}>
                          {item.text}
                        </span>
                        <button
                          onClick={() => handleRemoveBucketItem(item.id)}
                          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'capsule' && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-2">
                      Açılacağı Tarih
                    </label>
                    <input
                      type="date"
                      value={capsuleDate}
                      onChange={(e) => setCapsuleDate(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Benim Mektubum (Ona)
                      </label>
                      <textarea
                        value={capsuleMessageHer}
                        onChange={(e) => setCapsuleMessageHer(e.target.value)}
                        rows={10}
                        placeholder="Sevgilim..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Onun Mektubu (Bana)
                      </label>
                      <textarea
                        value={capsuleMessageHim}
                        onChange={(e) => setCapsuleMessageHim(e.target.value)}
                        rows={10}
                        placeholder="Canım..."
                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSaveCapsule}
                    className="w-full bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Değişiklikleri Kaydet
                  </button>
                </div>
              )}

              {activeTab === 'chat' && (
                <div className="space-y-6 flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-red-500/10 p-6 rounded-2xl border border-red-500/20 max-w-md">
                    <h3 className="text-red-500 font-bold text-lg mb-2">Dikkat Alanı</h3>
                    <p className="text-slate-400 mb-6">
                      Sohbet geçmişini temizlemek geri alınamaz. Tüm mesajlar silinecektir.
                      Eğer mesaj renklerinde hata görüyorsan bunu kullan.
                    </p>
                    <button
                      onClick={() => {
                        if (window.confirm("Tüm sohbet geçmişini silmek istediğine emin misin?")) {
                          onClearChat();
                        }
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors flex items-center gap-2 mx-auto"
                    >
                      <X className="w-4 h-4" />
                      Sohbet Geçmişini Temizle
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;
