
import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';

const BucketList = ({ items, onToggle }) => {
    return (
        <section className="container mx-auto px-4 py-20">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-gradient-to-r from-rose-400 to-purple-500 text-transparent bg-clip-text">
                Gelecek Hayallerimiz
            </h2>

            <div className="max-w-2xl mx-auto space-y-4">
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => onToggle(item.id)}
                        className={`
              flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300
              ${item.completed
                                ? 'bg-rose-500/20 border-rose-500/50'
                                : 'bg-slate-900/50 border-white/10 hover:bg-slate-800/50'
                            }
              border backdrop-blur-sm
    `}
                    >
                        <div className={`
flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
              ${item.completed ? 'bg-rose-500 border-rose-500' : 'border-slate-400'}
`}>
                            {item.completed && <Check className="w-4 h-4 text-white" />}
                        </div>

                        <span className={`text-lg transition-colors ${item.completed ? 'text-slate-400 line-through' : 'text-slate-200'} `}>
                            {item.text}
                        </span>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};

export default BucketList;
