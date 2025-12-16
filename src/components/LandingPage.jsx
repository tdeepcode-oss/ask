import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Lock, User } from 'lucide-react';

const LandingPage = ({ onLogin }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    const handleCoupleLogin = (e) => {
        e.preventDefault();
        console.log("Login attempt with password:", password);
        if (password === "1071") {
            console.log("Logging in as HER");
            onLogin('couple', 'her');
        } else if (password === "2021") {
            console.log("Logging in as HIM");
            onLogin('couple', 'him');
        } else {
            setError(true);
            setTimeout(() => setError(false), 1000);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 max-w-md w-full bg-slate-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-2xl shadow-2xl"
            >
                <div className="flex justify-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3">
                        <Heart className="w-8 h-8 text-white fill-current" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-center text-white mb-2">Hoş Geldiniz</h1>
                <p className="text-slate-400 text-center mb-8">Lütfen giriş türünü seçin</p>

                <AnimatePresence mode="wait">
                    {!showPassword ? (
                        <motion.div
                            key="buttons"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="space-y-4"
                        >
                            <button
                                onClick={() => setShowPassword(true)}
                                className="w-full group relative p-4 bg-slate-800/50 hover:bg-rose-500/10 border border-white/10 hover:border-rose-500/50 rounded-xl transition-all duration-300 flex items-center gap-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center group-hover:bg-rose-500 group-hover:text-white transition-colors">
                                    <Heart className="w-5 h-5 text-rose-500 group-hover:text-white" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold text-white">Biziz</h3>
                                    <p className="text-sm text-slate-400">Giriş yapmak için tıklayın</p>
                                </div>
                            </button>

                            <button
                                onClick={() => onLogin('guest')}
                                className="w-full group relative p-4 bg-slate-800/50 hover:bg-purple-500/10 border border-white/10 hover:border-purple-500/50 rounded-xl transition-all duration-300 flex items-center gap-4"
                            >
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
                                    <User className="w-5 h-5 text-purple-500 group-hover:text-white" />
                                </div>
                                <div className="text-left">
                                    <h3 className="text-lg font-semibold text-white">Misafir</h3>
                                    <p className="text-sm text-slate-400">Siteyi görüntülemek için tıklayın</p>
                                </div>
                            </button>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="password"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            onSubmit={handleCoupleLogin}
                            className="space-y-4"
                        >
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Şifre (Tanışma Yılı)"
                                    className={`w-full bg-slate-950/50 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500 transition-colors`}
                                    autoFocus
                                />
                                <Lock className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-500" />
                            </div>

                            {error && (
                                <p className="text-red-500 text-sm text-center">Hatalı şifre, tekrar deneyin.</p>
                            )}

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(false)}
                                    className="px-4 py-3 rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 transition-colors"
                                >
                                    Geri
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-rose-500 to-purple-600 text-white font-semibold rounded-xl py-3 hover:opacity-90 transition-opacity"
                                >
                                    Giriş Yap
                                </button>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default LandingPage;
