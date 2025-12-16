import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Clock, Heart } from 'lucide-react';

const TimeCapsule = ({ unlockDate, messageForHer, messageForHim }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const target = new Date(unlockDate).getTime();
            const distance = target - now;

            if (distance < 0) {
                setIsOpen(true);
                setTimeLeft('Zamanı Geldi!');
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

            setTimeLeft(`${days} gün ${hours} saat ${minutes} dakika`);
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 60000);

        return () => clearInterval(timer);
    }, [unlockDate]);

    const CapsuleCard = ({ title, message, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className={`
                relative p-8 rounded-2xl border text-center transition-all duration-500 flex-1
                ${isOpen
                    ? 'bg-slate-900/50 border-rose-500/30'
                    : 'bg-slate-900/80 border-slate-700'
                }
            `}
        >
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center border-4 border-slate-950
                    ${isOpen ? 'bg-rose-500' : 'bg-slate-700'}
                `}>
                    {isOpen ? <Unlock className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-slate-400" />}
                </div>
            </div>

            <h3 className="mt-4 text-xl font-bold text-white mb-2">{title}</h3>

            <div className="min-h-[150px] flex items-center justify-center">
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-slate-300 italic whitespace-pre-wrap font-serif leading-relaxed"
                    >
                        {message}
                    </motion.div>
                ) : (
                    <div className="space-y-3">
                        <Clock className="w-8 h-8 text-slate-600 mx-auto" />
                        <p className="text-slate-500 font-medium">
                            {timeLeft}
                        </p>
                        <p className="text-xs text-slate-600 uppercase tracking-widest">
                            Kilitli
                        </p>
                    </div>
                )}
            </div>
        </motion.div>
    );

    return (
        <section className="py-20 relative">
            <div className="container mx-auto px-4 max-w-5xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                        <Clock className="w-8 h-8 text-rose-500" />
                        Zaman Kapsülü
                    </h2>
                    <p className="text-slate-400">
                        Gelecekteki bize notlar...
                    </p>
                </motion.div>

                <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                    <CapsuleCard
                        title="Benim Mektubum (Ona)"
                        message={messageForHer}
                        delay={0.2}
                    />
                    <CapsuleCard
                        title="Onun Mektubu (Bana)"
                        message={messageForHim}
                        delay={0.4}
                    />
                </div>
            </div>
        </section>
    );
};

export default TimeCapsule;
