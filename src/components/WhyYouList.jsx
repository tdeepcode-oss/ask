import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const WhyYouList = ({ reasons }) => {
    return (
        <section className="container mx-auto px-4 py-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-rose-400 to-purple-500 text-transparent bg-clip-text">
                Neden Sen?
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reasons.map((reason, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05, rotate: 1 }}
                        className="p-6 bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-xl hover:border-rose-500/50 hover:bg-rose-500/10 transition-all cursor-default group"
                    >
                        <div className="flex items-start gap-4">
                            <Heart className="w-6 h-6 text-rose-500 flex-shrink-0 mt-1 group-hover:fill-current transition-all" />
                            <p className="text-lg text-slate-200 font-medium">
                                {reason}
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default WhyYouList;
