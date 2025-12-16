import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Heart } from 'lucide-react';

const generateTimeline = () => {
    const events = [
        {
            date: '12 Mart 2022',
            title: 'Tanışma Tarihi',
            description: 'Hikayemizin başladığı, yollarımızın kesiştiği o ilk gün.',
            icon: Calendar,
        },
        {
            date: '14 Eylül 2022',
            title: 'İlk "Seni Seviyorum"',
            description: 'Kalbimden dökülen o iki kelimenin, bizim sonsuzluğumuzun başlangıcı olduğu gün.',
            icon: Heart,
        },
        {
            date: '7 Aralık 2022',
            title: 'Seni İlk Gördüğüm Gün',
            description: 'Gözlerinin içine ilk baktığım ve orada kaybolduğum o an.',
            icon: Calendar,
        }
    ];

    const today = new Date();
    const currentYear = today.getFullYear();
    const startYear = 2023; // Anniversaries start from 2023

    for (let year = startYear; year <= currentYear + 1; year++) {
        // Tanışma Yıl Dönümü (12 Mart)
        const meetingAnniversary = new Date(year, 2, 12); // Month is 0-indexed (2 = March)
        if (meetingAnniversary <= today || year === currentYear) {
            events.push({
                date: `12 Mart ${year}`,
                title: `${year - 2022}. Tanışma Yıl Dönümü`,
                description: 'Seninle geçen her yıl, ömrüme ömür katıyor. İyi ki varsın.',
                icon: Calendar,
            });
        }

        // İlişki Yıl Dönümü (14 Eylül)
        const relationshipAnniversary = new Date(year, 8, 14); // 8 = September
        if (relationshipAnniversary <= today || year === currentYear) {
            events.push({
                date: `14 Eylül ${year}`,
                title: `${year - 2022}. İlişki Yıl Dönümü`,
                description: 'Aşkımızın büyüdüğü, kök saldığı bir yıl daha. Seni çok seviyorum.',
                icon: Heart,
            });
        }
    }

    return events.sort((a, b) => {
        // Helper to parse Turkish dates loosely for sorting
        const months = {
            'Ocak': 0, 'Şubat': 1, 'Mart': 2, 'Nisan': 3, 'Mayıs': 4, 'Haziran': 5,
            'Temmuz': 6, 'Ağustos': 7, 'Eylül': 8, 'Ekim': 9, 'Kasım': 10, 'Aralık': 11
        };
        const parseDate = (dateStr) => {
            const parts = dateStr.split(' ');
            const day = parseInt(parts[0]);
            const month = months[parts[1]];
            const year = parseInt(parts[2]);
            return new Date(year, month, day);
        };
        return parseDate(a.date) - parseDate(b.date);
    });
};

const timelineData = generateTimeline();

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
