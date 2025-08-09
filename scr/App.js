import React, { useState, useEffect } from 'react';
import axios from 'axios';

// =============================================================================
// ===== BAGIAN 1: API WRAPPER                                             =====
// =============================================================================
// Kelas ini bertanggung jawab untuk semua komunikasi dengan API anime.
class Nakanime {
    constructor() {
        this.client = axios.create({
            baseURL: 'https://anime.nakanime.my.id/api/anime',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'User-Agent': 'okhttp/4.9.2'
            }
        });
    }

    async getList(order = 'latest', page = 1) {
        const { data } = await this.client.get('/all', { params: { order, page } });
        return data;
    }

    async search(query) {
        if (!query) throw new Error('Query is required');
        const { data } = await this.client.get('/search', { params: { keyword: query } });
        return data;
    }

    async getDetail(slug) {
        if (!slug) throw new Error('Slug is required');
        const { data } = await this.client.get('/', { params: { name: slug } });
        return data;
    }
    
    async getEpisode(slug) {
        if (!slug) throw new Error('Episode slug is required');
        const { data } = await this.client.get(`/data/`, { params: { slug } });
        return data;
    }
}

const nakanimeApi = new Nakanime();


// =============================================================================
// ===== BAGIAN 2: KOMPONEN-KOMPONEN UI                                    =====
// =============================================================================
// Ini adalah "blok bangunan" kecil yang bisa digunakan di banyak tempat.

const Loader = () => (
    <div className="flex justify-center items-center h-full py-20">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-500"></div>
    </div>
);

const ErrorMessage = ({ message }) => (
    <div className="text-center py-10 px-4 container mx-auto">
        <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
            <strong className="font-bold">Oops! Terjadi Kesalahan: </strong>
            <span className="block sm:inline">{message}</span>
        </div>
    </div>
);

const AnimeCard = ({ anime, onViewDetail }) => (
    <div 
        className="bg-gray-800/50 rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/40 transform hover:-translate-y-2 transition-all duration-300 cursor-pointer group"
        onClick={() => onViewDetail(anime.slug)}
    >
        <div className="relative">
            <img 
                src={anime.thumbnail}
                alt={anime.title} 
                className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/300x400/1a1a2e/ffffff?text=Error' }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="text-white font-bold text-md leading-tight group-hover:text-purple-400 transition-colors duration-300 truncate">{anime.title}</h3>
                <span className="text-xs font-semibold bg-purple-600 text-white px-2 py-0.5 rounded-full mt-2 inline-block">{anime.type}</span>
            </div>
        </div>
    </div>
);

const Hero = ({ anime, onViewDetail }) => {
    if (!anime) {
        return (
            <div className="h-[50vh] bg-gray-900 flex items-center justify-center">
                <p className="text-gray-500">Memuat anime unggulan...</p>
            </div>
        );
    }

    return (
        <div className="relative h-[60vh] md:h-[70vh] w-full text-white overflow-hidden">
            <img 
                src={anime.thumbnail} 
                alt={anime.title} 
                className="absolute inset-0 w-full h-full object-cover object-center filter blur-sm scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#101018] via-[#101018]/70 to-transparent"></div>
            <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-16 md:pb-24">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-wider" style={{ textShadow: '0 0 15px rgba(0,0,0,0.7)' }}>{anime.title}</h1>
                <p className="max-w-xl mt-4 text-gray-300">{anime.status} &bull; {anime.type}</p>
                <button 
                    onClick={() => onViewDetail(anime.slug)}
                    className="mt-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 w-fit shadow-lg shadow-purple-500/20"
                >
                    Lihat Detail
                </button>
            </div>
        </div>
    );
};

const Header = ({ onSearchSubmit, onNavigateHome }) => {
    return (
        <header className="bg-gray-900/60 backdrop-blur-lg sticky top-0 z-50 shadow-lg shadow-black/20">
            <nav className="container mx-auto px-4 py-4 flex justify-between items-center gap-4">
                <h1 
                    className="text-3xl font-black text-white cursor-pointer"
                    onClick={onNavigateHome}
                >
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Res</span>anime
                </h1>
                <form onSubmit={onSearchSubmit} className="w-full max-w-sm">
                    <input
                        type="search"
                        name="search"
                        placeholder="Cari anime favoritmu..."
                        className="w-full bg-gray-800/70 border border-gray-700 text-white px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                    />
                </form>
            </nav>
        </header>
    );
};

const InstagramIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>);
const TikTokIcon = () => (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>);

const Footer = () => {
    return (
        <footer className="bg-gray-900/50 border-t border-gray-800 mt-16">
            <div className="container mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                    <div className="md:w-1/2 mb-6 md:mb-0">
                        <h2 className="text-2xl font-black text-white">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">Res</span>anime
                        </h2>
                        <p className="mt-2 text-gray-400 max-w-md">
                            Resanime adalah platform untuk streaming anime terbaru dan terhebat. Dibangun oleh penggemar, untuk penggemar, kami bertujuan untuk memberikan pengalaman menonton yang sederhana, cepat, dan menyenangkan tanpa gangguan.
                        </p>
                    </div>
                    <div className="flex flex-col items-center md:items-end">
                        <p className="text-gray-400">Dikembangkan oleh <strong className="font-semibold text-white">renzy dev</strong></p>
                        <div className="flex space-x-4 mt-4">
                            <a href="https://www.instagram.com/renal_adnta" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                                <InstagramIcon />
                            </a>
                            <a href="https://www.tiktok.com/@renalopor0" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-400 transition-colors duration-300">
                                <TikTokIcon />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="text-center text-gray-600 mt-8 pt-6 border-t border-gray-800">
                    <p>&copy; {new Date().getFullYear()} Resanime. Build with react.js and API</p>
                </div>
            </div>
        </footer>
    );
};


// =============================================================================
// ===== BAGIAN 3: HALAMAN-HALAMAN APLIKASI                                =====
// =============================================================================
// Setiap komponen di sini mewakili satu "layar" atau "halaman" penuh.

const HomePage = ({ onViewDetail }) => {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState('latest');
    const [heroAnime, setHeroAnime] = useState(null);

    useEffect(() => {
        const fetchAnime = async () => {
            if (page === 1) setLoading(true);
            setError(null);
            try {
                const data = await nakanimeApi.getList(order, page);
                if (page === 1) {
                    setAnimeList(data.data);
                    if (data.data && data.data.length > 0) {
                        setHeroAnime(data.data[0]);
                    }
                } else {
                    setAnimeList(prev => {
                        const existingSlugs = new Set(prev.map(p => p.slug));
                        const newData = data.data.filter(d => !existingSlugs.has(d.slug));
                        return [...prev, ...newData];
                    });
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAnime();
    }, [page, order]);

    const handleOrderChange = (newOrder) => {
        setOrder(newOrder);
        setPage(1);
        setAnimeList([]);
    };

    return (
        <div>
            <Hero anime={heroAnime} onViewDetail={onViewDetail} />
            
            <div className="container mx-auto px-4 mt-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-white">Jelajahi Anime</h2>
                    <div className="flex space-x-2">
                        {['latest', 'popular', 'rating'].map(o => (
                            <button 
                                key={o}
                                onClick={() => handleOrderChange(o)}
                                className={`px-4 py-2 text-xs md:text-sm rounded-full font-semibold transition-all duration-300 ${order === o ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
                            >
                                {o.charAt(0).toUpperCase() + o.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {error && !loading && <ErrorMessage message={error} />}
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {animeList.map((anime) => (
                        <AnimeCard key={anime.slug} anime={anime} onViewDetail={onViewDetail} />
                    ))}
                </div>

                {loading && <Loader />}

                {!loading && !error && animeList.length > 0 && (
                    <div className="text-center my-12">
                        <button 
                            onClick={() => setPage(p => p + 1)}
                            className="bg-gray-800 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300 disabled:bg-gray-600"
                            disabled={loading}
                        >
                            {loading ? 'Memuat...' : 'Muat Lebih Banyak'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const DetailPage = ({ slug, onWatchEpisode, onBack }) => {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await nakanimeApi.getDetail(slug);
                setDetail(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [slug]);

    if (loading) return <div className="min-h-screen"><Loader /></div>;
    if (error) return <ErrorMessage message={error} />;
    if (!detail) return null;

    return (
        <div className="relative min-h-screen">
            <div className="absolute inset-0 h-[60vh] overflow-hidden">
                <img src={detail.imgUrl} alt="" className="w-full h-full object-cover filter blur-xl opacity-30" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101018] to-[#101018]/50"></div>
            </div>

            <div className="relative z-10 container mx-auto px-4 py-8">
                <button onClick={onBack} className="mb-8 bg-white/10 hover:bg-white/20 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 backdrop-blur-sm">
                    &larr; Kembali
                </button>
                
                <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                    <div className="md:w-1/3 flex-shrink-0">
                        <img 
                            src={detail.imgUrl}
                            alt={detail.title} 
                            className="w-full rounded-lg shadow-2xl shadow-black/50 mb-6"
                            onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400x550/1a1a2e/ffffff?text=Error' }}
                        />
                        <div className="bg-gray-800/50 backdrop-blur-lg p-4 rounded-lg border border-gray-700">
                            <h3 className="text-lg font-bold text-white mb-3">Informasi</h3>
                            <ul className="space-y-2 text-sm text-gray-300">
                                {detail.info.map((info, index) => (
                                    <li key={index} className="flex justify-between border-b border-gray-700/50 pb-1">
                                        <span className="font-semibold text-gray-400">{info.split(':')[0]}:</span>
                                        <span>{info.split(':').slice(1).join(':').trim()}</span>
                                    </li>
                                ))}
                                <li className="flex justify-between">
                                    <span className="font-semibold text-gray-400">Rating:</span>
                                    <span className="font-bold text-yellow-400">⭐ {detail.rating}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="md:w-2/3">
                        <h1 className="text-4xl sm:text-5xl font-black text-white mb-2" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>{detail.title}</h1>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {detail.genre.map(g => (
                                <span key={g.slug} className="bg-purple-600/70 text-purple-200 text-xs font-semibold px-3 py-1 rounded-full">{g.name}</span>
                            ))}
                        </div>
                        
                        <h2 className="text-2xl font-bold text-white mt-8 mb-3">Sinopsis</h2>
                        <p className="text-gray-300 mb-8 whitespace-pre-wrap leading-relaxed">{detail.description}</p> 
                        
                        <h2 className="text-2xl font-bold text-white mt-8 mb-3">Episode</h2>
                        <div className="max-h-[400px] overflow-y-auto bg-gray-800/50 backdrop-blur-lg p-2 rounded-lg border border-gray-700">
                            <ul className="space-y-2 p-2">
                                {detail.episodes.map(ep => (
                                    <li 
                                        key={ep.slug} 
                                        onClick={() => onWatchEpisode(ep.slug)}
                                        className="p-4 bg-gray-700/50 rounded-md hover:bg-purple-600/50 cursor-pointer transition-all duration-200 text-white flex justify-between items-center"
                                    >
                                        <span className="font-semibold">{ep.title}</span>
                                        <span className="text-xs text-gray-400">{ep.date}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WatchPage = ({ episodeSlug, onBack, onWatchEpisode }) => {
    const [streamData, setStreamData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStream = async () => {
            setLoading(true);
            setError(null);
            setStreamData(null);
            try {
                const response = await nakanimeApi.getEpisode(episodeSlug);
                if (!response.data || !response.data.video_uri) {
                    throw new Error("Tidak ada link video yang tersedia dari API.");
                }
                setStreamData({ 
                    title: response.data.title, 
                    url: response.data.video_uri,
                    nextEpisodeSlug: response.data.next_eps,
                    prevEpisodeSlug: response.data.prev_eps,
                    animeSlug: response.data.slug
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchStream();
    }, [episodeSlug]);

    if (loading) return <div className="min-h-screen"><Loader /></div>;
    if (error) return <ErrorMessage message={error} />;
    if (!streamData) return null;

    return (
        <div className="container mx-auto p-4">
            <button onClick={() => onBack(streamData.animeSlug)} className="mb-4 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
                &larr; Kembali ke Detail
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">{streamData.title}</h1>
            <div className="aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden shadow-2xl shadow-black/50">
                <iframe 
                    src={streamData.url}
                    title="Anime Player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full"
                ></iframe>
            </div>
            <div className="flex justify-between items-center mt-6">
                {streamData.prevEpisodeSlug ? (
                    <button 
                        onClick={() => onWatchEpisode(streamData.prevEpisodeSlug)}
                        className="bg-gray-800 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
                    >
                        &larr; Eps Sebelumnya
                    </button>
                ) : (
                    <div></div>
                )}
                {streamData.nextEpisodeSlug ? (
                    <button 
                        onClick={() => onWatchEpisode(streamData.nextEpisodeSlug)}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 shadow-lg shadow-purple-500/20"
                    >
                        Eps Selanjutnya &rarr;
                    </button>
                ) : (
                    <div></div>
                )}
            </div>
        </div>
    );
};

const SearchResultsPage = ({ query, onViewDetail, onBack }) => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query) return;
        const performSearch = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await nakanimeApi.search(query);
                setResults(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        performSearch();
    }, [query]);
    
    if (loading) return <div className="min-h-screen"><Loader /></div>;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <button onClick={onBack} className="mb-6 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300">
                &larr; Kembali
            </button>
            <h1 className="text-3xl font-bold text-white mb-6">Hasil pencarian untuk: <span className="text-purple-400">"{query}"</span></h1>
            {results.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
                    {results.map((anime) => (
                        <AnimeCard key={anime.slug} anime={anime} onViewDetail={onViewDetail} />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-400 mt-16 text-lg">Tidak ada hasil untuk "{query}".</p>
            )}
        </div>
    );
};


// =============================================================================
// ===== BAGIAN 4: KOMPONEN APP UTAMA                                      =====
// =============================================================================
// Ini adalah "otak" aplikasi yang mengatur semuanya.
export default function App() {
    const [view, setView] = useState({ name: 'home' }); 

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const query = e.target.elements.search.value.trim();
        if (query) {
            setView({ name: 'search', query });
        }
    };

    const navigateToDetail = (slug) => {
        window.scrollTo(0, 0);
        setView({ name: 'detail', slug });
    };

    const navigateToWatch = (episodeSlug) => {
        window.scrollTo(0, 0);
        const currentAnimeSlug = view.name === 'detail' ? view.slug : view.animeSlug;
        setView({ name: 'watch', episodeSlug, animeSlug: currentAnimeSlug });
    };
    
    const navigateBack = (animeSlug) => {
        window.scrollTo(0, 0);
        if (view.name === 'watch' && animeSlug) {
            setView({ name: 'detail', slug: animeSlug });
        } else {
            setView({ name: 'home' });
        }
    };
    
    const navigateHome = () => {
        window.scrollTo(0, 0);
        setView({ name: 'home' });
    }

    const renderView = () => {
        switch (view.name) {
            case 'detail':
                return <DetailPage slug={view.slug} onWatchEpisode={navigateToWatch} onBack={navigateHome} />;
            case 'watch':
                return <WatchPage episodeSlug={view.episodeSlug} onBack={navigateBack} onWatchEpisode={navigateToWatch} />;
            case 'search':
                return <SearchResultsPage query={view.query} onViewDetail={navigateToDetail} onBack={navigateHome} />;
            case 'home':
            default:
                return <HomePage onViewDetail={navigateToDetail} />;
        }
    };

    return (
        <div className="bg-[#101018] text-gray-100 min-h-screen font-sans">
            <Header onSearchSubmit={handleSearchSubmit} onNavigateHome={navigateHome} />
            <main>
                {renderView()}
            </main>
            <Footer />
        </div>
    );
}
