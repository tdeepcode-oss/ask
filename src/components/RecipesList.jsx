import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Clock, Flame, Plus, X, Search, Utensils, Trash2, ChevronRight, BookOpen } from 'lucide-react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';

const CATEGORIES = [
    { id: 'all', label: 'Tümü', icon: BookOpen },
    { id: 'main', label: 'Ana Yemek', icon: Utensils },
    { id: 'dessert', label: 'Tatlı', icon: ChefHat },
    { id: 'snack', label: 'Atıştırmalık', icon: Flame },
    { id: 'breakfast', label: 'Kahvaltı', icon: Clock },
];

const DIFFICULTIES = [
    { id: 'easy', label: 'Kolay', color: 'text-green-400' },
    { id: 'medium', label: 'Orta', color: 'text-yellow-400' },
    { id: 'hard', label: 'Zor', color: 'text-red-400' },
];

const Recipes = ({ userType }) => {
    const [recipes, setRecipes] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [newRecipe, setNewRecipe] = useState({
        title: '',
        description: '',
        image: '',
        category: 'main',
        time: '',
        difficulty: 'medium',
        ingredients: '',
        steps: ''
    });

    // Fetch Recipes
    useEffect(() => {
        const q = query(collection(db, "recipes"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRecipes(data);
        });
        return () => unsubscribe();
    }, []);

    const handleAddRecipe = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, "recipes"), {
                ...newRecipe,
                ingredients: newRecipe.ingredients.split('\n').filter(i => i.trim()),
                steps: newRecipe.steps.split('\n').filter(s => s.trim()),
                createdAt: new Date().toISOString()
            });
            setIsAdding(false);
            setNewRecipe({
                title: '', description: '', image: '', category: 'main',
                time: '', difficulty: 'medium', ingredients: '', steps: ''
            });
        } catch (error) {
            console.error("Error adding recipe:", error);
        }
    };

    const handleDeleteRecipe = async (id) => {
        if (window.confirm('Bu tarifi silmek istediğine emin misin?')) {
            await deleteDoc(doc(db, "recipes", id));
            if (selectedRecipe?.id === id) setSelectedRecipe(null);
        }
    };

    const filteredRecipes = recipes.filter(recipe => {
        const matchesCategory = activeCategory === 'all' || recipe.category === activeCategory;
        const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <section className="py-20 px-4 container mx-auto">
            <div className="flex flex-col items-center mb-12 text-center">
                <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-4 ring-4 ring-rose-500/20">
                    <ChefHat className="w-8 h-8 text-rose-500" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-rose-400 to-orange-400 text-transparent bg-clip-text mb-4">
                    Mutfak Sırları
                </h2>
                <p className="text-slate-400 max-w-2xl">
                    Birlikte yapacağımız, tadına doyamayacağımız en özel tarifler burada.
                </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between bg-slate-900/50 p-4 rounded-2xl border border-white/5 backdrop-blur-sm">
                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                    {CATEGORIES.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${activeCategory === cat.id
                                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/25'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            <cat.icon className="w-4 h-4" />
                            {cat.label}
                        </button>
                    ))}
                </div>

                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Tarif ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-rose-500 transition-colors"
                        />
                    </div>
                    {userType === 'couple' && (
                        <button
                            onClick={() => setIsAdding(true)}
                            className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-rose-500/20"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden md:inline">Yeni Tarif</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredRecipes.map((recipe) => (
                        <motion.div
                            key={recipe.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            onClick={() => setSelectedRecipe(recipe)}
                            className="group bg-slate-900 border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                <img
                                    src={recipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800&auto=format&fit=crop"}
                                    alt={recipe.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                    <div>
                                        <span className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1 block">
                                            {CATEGORIES.find(c => c.id === recipe.category)?.label}
                                        </span>
                                        <h3 className="text-xl font-bold text-white group-hover:text-rose-400 transition-colors">
                                            {recipe.title}
                                        </h3>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 flex items-center justify-between text-sm text-slate-400">
                                <div className="flex items-center gap-4">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" /> {recipe.time}
                                    </span>
                                    <span className={`flex items-center gap-1 ${DIFFICULTIES.find(d => d.id === recipe.difficulty)?.color}`}>
                                        <Flame className="w-4 h-4" /> {DIFFICULTIES.find(d => d.id === recipe.difficulty)?.label}
                                    </span>
                                </div>
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-rose-500" />
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedRecipe && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            className="w-full max-w-4xl bg-slate-900 border border-white/10 rounded-3xl overflow-hidden max-h-[90vh] flex flex-col md:flex-row shadow-2xl"
                        >
                            <div className="md:w-1/2 relative h-64 md:h-auto">
                                <img
                                    src={selectedRecipe.image || "https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=800&auto=format&fit=crop"}
                                    alt={selectedRecipe.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:hidden" />
                                <button
                                    onClick={() => setSelectedRecipe(null)}
                                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-rose-500 transition-colors md:hidden"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="md:w-1/2 p-8 overflow-y-auto relative">
                                <button
                                    onClick={() => setSelectedRecipe(null)}
                                    className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block"
                                >
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>

                                <div className="mb-6">
                                    <span className="text-rose-500 text-sm font-bold tracking-wider uppercase">
                                        {CATEGORIES.find(c => c.id === selectedRecipe.category)?.label}
                                    </span>
                                    <h2 className="text-3xl font-bold text-white mt-2 mb-4">{selectedRecipe.title}</h2>
                                    <p className="text-slate-400 leading-relaxed">{selectedRecipe.description}</p>
                                </div>

                                <div className="flex gap-6 mb-8 pb-8 border-b border-white/10">
                                    <div className="text-center">
                                        <span className="block text-slate-500 text-xs uppercase tracking-wider mb-1">Süre</span>
                                        <span className="text-white font-bold flex items-center gap-2">
                                            <Clock className="w-4 h-4 text-rose-500" /> {selectedRecipe.time}
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <span className="block text-slate-500 text-xs uppercase tracking-wider mb-1">Zorluk</span>
                                        <span className={`font-bold flex items-center gap-2 ${DIFFICULTIES.find(d => d.id === selectedRecipe.difficulty)?.color}`}>
                                            <Flame className="w-4 h-4" /> {DIFFICULTIES.find(d => d.id === selectedRecipe.difficulty)?.label}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <Utensils className="w-5 h-5 text-rose-500" /> Malzemeler
                                        </h3>
                                        <ul className="space-y-3">
                                            {selectedRecipe.ingredients.map((ing, i) => (
                                                <li key={i} className="flex items-start gap-3 text-slate-300">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2" />
                                                    {ing}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                            <ChefHat className="w-5 h-5 text-rose-500" /> Hazırlanışı
                                        </h3>
                                        <div className="space-y-6">
                                            {selectedRecipe.steps.map((step, i) => (
                                                <div key={i} className="flex gap-4">
                                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-rose-500 font-bold text-sm">
                                                        {i + 1}
                                                    </span>
                                                    <p className="text-slate-300 pt-1 leading-relaxed">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {userType === 'couple' && (
                                    <div className="mt-12 pt-8 border-t border-white/10">
                                        <button
                                            onClick={() => handleDeleteRecipe(selectedRecipe.id)}
                                            className="w-full py-3 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Trash2 className="w-4 h-4" /> Tarifi Sil
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Modal */}
            <AnimatePresence>
                {isAdding && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-white">Yeni Tarif Ekle</h2>
                                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X className="w-6 h-6 text-slate-400" />
                                </button>
                            </div>

                            <form onSubmit={handleAddRecipe} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Tarif Adı</label>
                                        <input
                                            required
                                            type="text"
                                            value={newRecipe.title}
                                            onChange={e => setNewRecipe({ ...newRecipe, title: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Kategori</label>
                                        <select
                                            value={newRecipe.category}
                                            onChange={e => setNewRecipe({ ...newRecipe, category: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none"
                                        >
                                            {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                                                <option key={c.id} value={c.id}>{c.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Görsel URL (İsteğe bağlı)</label>
                                    <input
                                        type="url"
                                        value={newRecipe.image}
                                        onChange={e => setNewRecipe({ ...newRecipe, image: e.target.value })}
                                        placeholder="https://..."
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Kısa Açıklama</label>
                                    <textarea
                                        required
                                        rows={2}
                                        value={newRecipe.description}
                                        onChange={e => setNewRecipe({ ...newRecipe, description: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Hazırlama Süresi</label>
                                        <input
                                            required
                                            type="text"
                                            placeholder="Örn: 45 dk"
                                            value={newRecipe.time}
                                            onChange={e => setNewRecipe({ ...newRecipe, time: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Zorluk</label>
                                        <select
                                            value={newRecipe.difficulty}
                                            onChange={e => setNewRecipe({ ...newRecipe, difficulty: e.target.value })}
                                            className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none"
                                        >
                                            {DIFFICULTIES.map(d => (
                                                <option key={d.id} value={d.id}>{d.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Malzemeler (Her satıra bir tane)</label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="2 yumurta&#10;1 su bardağı süt&#10;..."
                                        value={newRecipe.ingredients}
                                        onChange={e => setNewRecipe({ ...newRecipe, ingredients: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Hazırlanışı (Her satıra bir adım)</label>
                                    <textarea
                                        required
                                        rows={5}
                                        placeholder="Fırını 180 dereceye ısıtın.&#10;Yumurtaları çırpın.&#10;..."
                                        value={newRecipe.steps}
                                        onChange={e => setNewRecipe({ ...newRecipe, steps: e.target.value })}
                                        className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-rose-500 outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl transition-colors shadow-lg shadow-rose-500/20"
                                >
                                    Tarifi Kaydet
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Recipes;
