import  { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Plus, 
  ExternalLink, 
  Copy, 
  Check, 
  Trash2, 
  Moon, 
  Sun, 
  Bookmark, 
   
  Sparkles, 
  LayoutGrid, 
  List, 
  X,
  Globe,
 
} from 'lucide-react';

// Αρχικά δείγματα συνδέσμων (Sample Data)
const INITIAL_BOOKMARKS = [
  {
    id: '1',
    title: 'Google',
    url: 'https://www.google.com',
    description: 'Η πιο δημοφιλής μηχανή αναζήτησης στον κόσμο για εύρεση πληροφοριών.',
    category: 'Εργαλεία',
    createdAt: Date.now() - 100000000
  },
  {
    id: '2',
    title: 'Wikipedia (Ελληνικά)',
    url: 'https://el.wikipedia.org',
    description: 'Η ελεύθερη διαδικτυακή εγκυκλοπαίδεια με εκατομμύρια άρθρα στα ελληνικά.',
    category: 'Εκπαίδευση',
    createdAt: Date.now() - 90000000
  },
  {
    id: '3',
    title: 'GitHub',
    url: 'https://github.com',
    description: 'Πλατφόρμα φιλοξενίας κώδικα και συνεργασίας για προγραμματιστές.',
    category: 'Τεχνολογία',
    createdAt: Date.now() - 80000000
  },
  {
    id: '4',
    title: 'Η Καθημερινή',
    url: 'https://www.kathimerini.gr',
    description: 'Ειδησεογραφικός ιστότοπος με συνεχή ενημέρωση για την Ελλάδα και τον κόσμο.',
    category: 'Ειδήσεις',
    createdAt: Date.now() - 70000000
  },
  {
    id: '5',
    title: 'YouTube',
    url: 'https://www.youtube.com',
    description: 'Δημοφιλής πλατφόρμα κοινοποίησης και παρακολούθησης βίντεο.',
    category: 'Ψυχαγωγία',
    createdAt: Date.now() - 60000000
  },
  {
    id: '6',
    title: 'MDN Web Docs',
    url: 'https://developer.mozilla.org',
    description: 'Πηγές τεκμηρίωσης για τεχνολογίες ιστού (HTML, CSS, JavaScript).',
    category: 'Τεχνολογία',
    createdAt: Date.now() - 50000000
  },
  {
    id: '7',
    title: 'Coursera',
    url: 'https://www.coursera.org',
    description: 'Διαδικτυακά μαθήματα από κορυφαία πανεπιστήμια και εταιρείες.',
    category: 'Εκπαίδευση',
    createdAt: Date.now() - 40000000
  },
  {
    id: '8',
    title: 'Canva',
    url: 'https://www.canva.com',
    description: 'Εργαλείο γραφιστικού σχεδιασμού για δημιουργία παρουσιάσεων και γραφικών.',
    category: 'Εργαλεία',
    createdAt: Date.now() - 30000000
  }
];

const CATEGORIES = ['Όλα', 'Τεχνολογία', 'Εργαλεία', 'Εκπαίδευση', 'Ειδήσεις', 'Ψυχαγωγία', 'Άλλο'];

export default function App() {
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('app_bookmarks');
      return saved ? JSON.parse(saved) : INITIAL_BOOKMARKS;
    } catch (e) {
      console.error('Failed to load bookmarks from LocalStorage', e);
      return INITIAL_BOOKMARKS;
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('app_theme');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Όλα');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // New Bookmark Form State
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCategory, setNewCategory] = useState('Τεχνολογία');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    try {
      localStorage.setItem('app_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error('Failed to save bookmarks to LocalStorage', e);
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem('app_theme', JSON.stringify(darkMode));
    } catch (e) {
      console.error('Failed to save theme setting', e);
    }
  }, [darkMode]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleCopy = (e: React.MouseEvent, url: string, id: number | string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showToast('Το URL αντιγράφηκε στο πρόχειρο!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = (e: React.MouseEvent, id: number | string) => {
    e.stopPropagation();
    setBookmarks(prev => prev.filter(b => b.id !== id));
    showToast('Ο σύνδεσμος διαγράφηκε.');
  };

  const handleAddBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) return;

    let formattedUrl = newUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const newBookmark = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      url: formattedUrl,
      description: newDescription.trim() || 'Δεν υπάρχει περιγραφή.',
      category: newCategory,
      createdAt: Date.now()
    };

    setBookmarks([newBookmark, ...bookmarks]);
    setIsModalOpen(false);

    // Reset Form
    setNewTitle('');
    setNewUrl('');
    setNewCategory('Τεχνολογία');
    setNewDescription('');

    showToast('Ο σύνδεσμος προστέθηκε με επιτυχία!');
  };

  // Helper to extract favicon with fallback
  const getFaviconUrl = (domainUrl: string) => {
    try {
      const urlObj = new URL(domainUrl);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
    } catch {
      return null;
    }
  };

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(b => {
      const matchesCategory = selectedCategory === 'Όλα' || b.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch = 
        b.title.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.url.toLowerCase().includes(q);
      
      return matchesCategory && matchesSearch;
    });
  }, [bookmarks, selectedCategory, searchQuery]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-2xl animate-bounce">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <header className={`sticky top-0 z-30 border-b backdrop-blur-md ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl shadow-md text-white">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600 leading-tight">
                LinkHub
              </h1>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">Οργάνωση & Διαχείριση URLs</p>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Νέος Σύνδεσμος</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                darkMode 
                  ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
              title={darkMode ? 'Αλλαγή σε Φωτεινό Θέμα' : 'Αλλαγή σε Σκοτεινό Θέμα'}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Control Panel: Search & Filters */}
        <section className="space-y-6 mb-8">
          
          {/* Search Bar & View Mode Toggle */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Αναζήτηση βάσει τίτλου, περιγραφής ή URL..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all shadow-sm ${
                  darkMode 
                    ? 'bg-slate-800/80 border-slate-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-500' 
                    : 'bg-white border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 placeholder-slate-400'
                }`}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Grid/List View Switcher */}
            <div className={`flex items-center p-1 rounded-xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Προβολή Πλέγματος"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-indigo-600 text-white shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
                title="Προβολή Λίστας"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Badges / Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : darkMode
                      ? 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Bookmarks Display Section */}
        {filteredBookmarks.length === 0 ? (
          <div className={`text-center py-16 px-4 rounded-3xl border border-dashed ${
            darkMode ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-100/50 border-slate-300'
          }`}>
            <Globe className="w-12 h-12 mx-auto text-slate-400 mb-3 animate-pulse" />
            <h3 className="text-lg font-semibold mb-1">Δεν βρέθηκαν σύνδεσμοι</h3>
            <p className="text-sm text-slate-400 max-w-sm mx-auto mb-6">
              Δεν υπήρξε κάποιο αποτέλεσμα με τα κριτήρια που ορίσατε. Δοκιμάστε άλλη αναζήτηση ή προσθέστε έναν νέο σύνδεσμο.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors"
            >
              Προσθήκη Συνδέσμου
            </button>
          </div>
        ) : (
          <div className={
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5' 
              : 'space-y-3'
          }>
            {filteredBookmarks.map((bookmark) => {
              const favicon = getFaviconUrl(bookmark.url);

              return (
                <div
                  key={bookmark.id}
                  onClick={() => window.open(bookmark.url, '_blank', 'noopener,noreferrer')}
                  className={`group relative flex ${viewMode === 'grid' ? 'flex-col justify-between' : 'flex-row items-center justify-between'} p-5 rounded-2xl border transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl hover:-translate-y-1 ${
                    darkMode 
                      ? 'bg-slate-800/90 border-slate-700/80 hover:border-indigo-500/50 hover:bg-slate-800' 
                      : 'bg-white border-slate-200/80 hover:border-indigo-300 hover:bg-white'
                  }`}
                >
                  {/* Content Container */}
                  <div className={`flex ${viewMode === 'grid' ? 'flex-col' : 'flex-row items-center'} gap-3 w-full pr-16`}>
                    
                    {/* Header/Icon */}
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 p-2 shadow-inner ${
                        darkMode ? 'bg-slate-700' : 'bg-slate-100'
                      }`}>
                        {favicon ? (
                          <img 
                            src={favicon} 
                            alt={bookmark.title} 
                            className="w-6 h-6 object-contain rounded"
                         onError={(e) => {
  const target = e.currentTarget as HTMLImageElement;
  target.onerror = null;
  target.style.display = 'none';
  if (target.nextElementSibling) {
    (target.nextElementSibling as HTMLElement).style.display = 'block';
  }
}}
                          />
                        ) : null}
                        <Globe className="w-5 h-5 text-indigo-500 hidden" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="font-semibold text-base truncate group-hover:text-indigo-500 transition-colors">
                          {bookmark.title}
                        </h3>
                        <span className="inline-block text-xs font-medium text-slate-400 truncate max-w-[200px]">
                          {bookmark.url.replace(/^https?:\/\/(www\.)?/, '')}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    {viewMode === 'grid' && (
                      <p className={`text-xs mt-2 line-clamp-2 leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        {bookmark.description}
                      </p>
                    )}
                  </div>

                  {/* Bottom / Right Info & Actions */}
                  <div className={`flex items-center ${viewMode === 'grid' ? 'justify-between mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50' : 'gap-2'}`}>
                    
                    {/* Category Tag */}
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${
                      darkMode ? 'bg-indigo-950/60 text-indigo-300' : 'bg-indigo-50 text-indigo-600'
                    }`}>
                      {bookmark.category}
                    </span>

                    {/* Quick Action Buttons */}
                    <div className="flex items-center gap-1">
                      {/* Copy Link Button */}
                      <button
                        onClick={(e) => handleCopy(e, bookmark.url, bookmark.id)}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-slate-700 text-slate-400 hover:text-white' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                        }`}
                        title="Αντιγραφή URL"
                      >
                        {copiedId === bookmark.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDelete(e, bookmark.id)}
                        className={`p-2 rounded-lg transition-colors cursor-pointer ${
                          darkMode ? 'hover:bg-red-950/40 text-slate-400 hover:text-red-400' : 'hover:bg-red-50 text-slate-500 hover:text-red-600'
                        }`}
                        title="Διαγραφή Συνδέσμου"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Open Link Icon */}
                      <div className={`p-2 rounded-lg ${darkMode ? 'text-slate-500 group-hover:text-indigo-400' : 'text-slate-400 group-hover:text-indigo-600'}`}>
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal for Adding New Link */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className={`relative w-full max-w-md rounded-3xl p-6 shadow-2xl transition-all ${
            darkMode ? 'bg-slate-800 border border-slate-700 text-white' : 'bg-white text-slate-800'
          }`}>
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-950/80 rounded-xl text-indigo-600 dark:text-indigo-400">
                  <Bookmark className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold">Προσθήκη Νέου Συνδέσμου</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddBookmark} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">
                  Τίτλος <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="π.χ. Wikipedia"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                    darkMode ? 'bg-slate-700/50 border-slate-600 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://example.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                    darkMode ? 'bg-slate-700/50 border-slate-600 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">
                  Κατηγορία
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none ${
                    darkMode ? 'bg-slate-700/50 border-slate-600 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'
                  }`}
                >
                  {CATEGORIES.filter(c => c !== 'Όλα').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-500 dark:text-slate-400">
                  Περιγραφή
                </label>
                <textarea
                 rows={3}
                  placeholder="Σύντομη περιγραφή του ιστότοπου..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none resize-none ${
                    darkMode ? 'bg-slate-700/50 border-slate-600 focus:border-indigo-500' : 'bg-slate-50 border-slate-200 focus:border-indigo-500'
                  }`}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    darkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Ακύρωση
                </button>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md transition-all"
                >
                  Αποθήκευση
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}