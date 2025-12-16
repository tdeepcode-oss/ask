import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Music, Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, ListMusic } from 'lucide-react';

const MusicPlayer = ({ playlist = [] }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const playerRef = useRef(null);

    // Helper to extract video ID
    const getYouTubeId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    useEffect(() => {
        // Load YouTube IFrame API
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }

        window.onYouTubeIframeAPIReady = () => {
            initializePlayer();
        };

        if (window.YT && window.YT.Player) {
            initializePlayer();
        }

        return () => {
            window.onYouTubeIframeAPIReady = null;
        };
    }, []);

    // Effect to handle playlist changes or index changes
    useEffect(() => {
        if (!playlist || playlist.length === 0) return;

        // Ensure index is valid
        if (currentSongIndex >= playlist.length) {
            setCurrentSongIndex(0);
            return;
        }

        // Try to initialize if not already done
        if (!playerRef.current && window.YT && window.YT.Player) {
            initializePlayer();
            return; // initializePlayer will handle loading the video
        }

        const song = playlist[currentSongIndex];
        const videoId = getYouTubeId(song.url || song); // Handle both object and string for safety
        if (playerRef.current && playerRef.current.loadVideoById && videoId) {
            playerRef.current.loadVideoById(videoId);
        }
    }, [currentSongIndex, playlist]);

    const initializePlayer = () => {
        if (playlist.length === 0) return;
        const song = playlist[currentSongIndex];
        const videoId = getYouTubeId(song.url || song);
        if (!videoId) return;

        if (playerRef.current) return; // Already initialized

        playerRef.current = new window.YT.Player('youtube-player', {
            height: '1',
            width: '1',
            videoId: videoId,
            playerVars: {
                'playsinline': 1,
                'controls': 0,
                'disablekb': 1,
                'fs': 0,
                'iv_load_policy': 3, // Hide annotations
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': onPlayerStateChange,
                'onError': onPlayerError
            }
        });
    };

    const onPlayerReady = (event) => {
        console.log("Player Ready");
        event.target.setVolume(50);
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
        } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false);
        } else if (event.data === window.YT.PlayerState.ENDED) {
            playNext();
        }
    };

    const onPlayerError = (event) => {
        console.error("YouTube Player Error:", event.data);
        // Try next song on error
        playNext();
    };

    const playNext = () => {
        if (playlist.length <= 1) {
            if (playerRef.current && playerRef.current.playVideo) {
                playerRef.current.seekTo(0);
                playerRef.current.playVideo();
            }
            return;
        }
        setCurrentSongIndex((prev) => (prev + 1) % playlist.length);
    };

    const playPrev = () => {
        if (playlist.length <= 1) {
            if (playerRef.current && playerRef.current.seekTo) {
                playerRef.current.seekTo(0);
            }
            return;
        }
        setCurrentSongIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    };

    const togglePlay = () => {
        if (!playerRef.current) return;

        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const toggleMute = () => {
        if (!playerRef.current) return;

        if (isMuted) {
            playerRef.current.unMute();
            setIsMuted(false);
        } else {
            playerRef.current.mute();
            setIsMuted(true);
        }
    };

    const [showPlaylist, setShowPlaylist] = useState(false);

    // ... (existing code)

    const togglePlaylist = () => {
        setShowPlaylist(!showPlaylist);
    };

    const selectSong = (index) => {
        setCurrentSongIndex(index);
        setShowPlaylist(false);
    };

    if (playlist.length === 0) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
            {/* Hidden Container for YouTube API */}
            <div className="fixed top-0 left-0 w-1 h-1 opacity-0 pointer-events-none -z-50 overflow-hidden">
                <div id="youtube-player"></div>
            </div>

            {/* Playlist Popup */}
            <AnimatePresence>
                {showPlaylist && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-2xl p-4 w-64 shadow-2xl mb-2 max-h-60 overflow-y-auto"
                    >
                        <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                            <ListMusic className="w-4 h-4 text-rose-500" />
                            Müzik Listesi
                        </h3>
                        <div className="space-y-2">
                            {playlist.map((song, index) => (
                                <button
                                    key={index}
                                    onClick={() => selectSong(index)}
                                    className={`w-full text-left p-2 rounded-lg text-xs transition-colors truncate flex items-center gap-2
                                        ${currentSongIndex === index
                                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                            : 'hover:bg-white/5 text-slate-400 hover:text-white'
                                        }
                                    `}
                                >
                                    <span className="w-4 text-center opacity-50">{index + 1}.</span>
                                    <span className="truncate flex-1">
                                        {song.title || (song.url ? `Şarkı ${index + 1}` : song)}
                                    </span>
                                    {currentSongIndex === index && isPlaying && (
                                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex items-center gap-2 p-3 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full shadow-lg shadow-rose-500/20">
                <button
                    onClick={togglePlaylist}
                    className={`w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 ${isPlaying ? 'animate-spin-slow' : ''}`}
                >
                    <Music className="w-5 h-5 text-white" />
                </button>

                <div className="flex items-center gap-2 px-2">
                    <button
                        onClick={playPrev}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        disabled={playlist.length <= 1}
                    >
                        <SkipBack className={`w-5 h-5 ${playlist.length <= 1 ? 'text-slate-600' : 'text-white'}`} />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                    </button>

                    <button
                        onClick={playNext}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        disabled={playlist.length <= 1}
                    >
                        <SkipForward className={`w-5 h-5 ${playlist.length <= 1 ? 'text-slate-600' : 'text-white'}`} />
                    </button>

                    <div className="w-px h-6 bg-white/10 mx-1"></div>

                    <button
                        onClick={toggleMute}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        {isMuted ? <VolumeX className="w-5 h-5 text-slate-400" /> : <Volume2 className="w-5 h-5 text-white" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MusicPlayer;
