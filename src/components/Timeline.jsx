import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart } from 'lucide-react';

const timelineData = [
    {
        date: '14 Şubat 2023',
        title: 'İlk Tanışma',
        description: 'Hayatımın değiştiği o büyülü gün. Göz göze geldiğimiz ilk an.',
        icon: Calendar,
    },
    {
        date: '1 Mart 2023',
        title: 'İlk Buluşma',
        description: 'O kahve dükkanında saatlerce konuştuğumuz, zamanın nasıl geçtiğini anlamadığımız gün.',
        icon: Heart,
    },
    {
        date: '15 Haziran 2023',
        title: 'İlk Tatilimiz',
        description: 'Denizin mavisi, güneşin sıcaklığı ve senin gülüşün. Unutulmaz anılar.',
        icon: Calendar,
    },
    // Add more milestones here
];

const TimelineItem = ({ item, index }) => {
    const isEven = index % 2 === 0;

    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className={`flex items-center justify-between w-full mb-8 ${isEven ? 'flex-row-reverse' : ''
                }`}
        >
            <div className="w-5/12" />

            <div className="z-20 flex items-center justify-center w-8 h-8 bg-rose-500 rounded-full shadow-lg shadow-rose-500/50 ring-4 ring-slate-900">
                <item.icon className="w-4 h-4 text-white" />
            </div>

            <div className="w-5/12">
                <div className="p-6 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl hover:border-rose-500/30 transition-colors">
                    <span className="text-sm font-mono text-rose-400">{item.date}</span>
                    <h3 className="text-xl font-bold text-white mt-1 mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        {item.description}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

const Timeline = () => {
    return (
        <div className="relative container mx-auto px-4 py-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-rose-400 to-purple-500 text-transparent bg-clip-text">
                Bizim Hikayemiz
            </h2>

            <div className="relative flex flex-col items-center">
                {/* Vertical Line */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-rose-500/0 via-rose-500/50 to-rose-500/0" />

                {timelineData.map((item, index) => (
                    <TimelineItem key={index} item={item} index={index} />
                ))}
            </div>
        </div>
    );
};

export default Timeline;
