import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const LiveCounter = ({ startDate }) => {
    const [timeElapsed, setTimeElapsed] = useState({
        years: 0,
        months: 0,
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTime = () => {
            const start = new Date(startDate);
            const now = new Date();
            const diff = now - start;

            const seconds = Math.floor((diff / 1000) % 60);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 30);
            const months = Math.floor((diff / (1000 * 60 * 60 * 24 * 30)) % 12);
            const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

            setTimeElapsed({ years, months, days, hours, minutes, seconds });
        };

        const timer = setInterval(calculateTime, 1000);
        calculateTime(); // Initial call

        return () => clearInterval(timer);
    }, [startDate]);

    const TimeUnit = ({ value, label }) => (
        <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 min-w-[80px] md:min-w-[100px]">
            <span className="text-3xl md:text-4xl font-bold text-rose-400 font-mono">
                {value.toString().padStart(2, '0')}
            </span>
            <span className="text-xs md:text-sm text-slate-400 uppercase tracking-wider mt-1">
                {label}
            </span>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center space-y-8"
        >
            <h2 className="text-2xl md:text-3xl font-semibold text-center">
                Seni ne kadar süredir seviyorum?
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <TimeUnit value={timeElapsed.years} label="Yıl" />
                <TimeUnit value={timeElapsed.months} label="Ay" />
                <TimeUnit value={timeElapsed.days} label="Gün" />
                <TimeUnit value={timeElapsed.hours} label="Saat" />
                <TimeUnit value={timeElapsed.minutes} label="Dakika" />
                <TimeUnit value={timeElapsed.seconds} label="Saniye" />
            </div>
        </motion.div>
    );
};

export default LiveCounter;
