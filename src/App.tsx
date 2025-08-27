import React, { useState, useCallback } from 'react';
import { Search, BookOpen, User, Tag, Calendar, Globe, Heart } from 'lucide-react';
import SearchForm from './components/SearchForm';
import BookGrid from './components/BookGrid';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { searchBooks, Book, SearchParams } from './utils/api';

function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const handleSearch = useCallback(async (params: SearchParams, page = 1) => {
    setLoading(true);
    setError(null);
    setCurrentPage(page);
    setSearchParams(params);

    try {
      const result = await searchBooks(params, page);
      setBooks(result.books);
      setTotalResults(result.totalResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setBooks([]);
      setTotalResults(0);
    } finally {
      setLoading(false);
    }
  }, []);

  const handlePageChange = useCallback(async (page: number) => {
    if (searchParams) {
      await handleSearch(searchParams, page);
    }
  }, [searchParams, handleSearch]);

  const toggleFavorite = useCallback((bookId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(bookId)) {
        newFavorites.delete(bookId);
      } else {
        newFavorites.add(bookId);
      }
      return newFavorites;
    });
  }, []);

  const totalPages = Math.ceil(totalResults / 20);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Book Finder</h1>
                <p className="text-slate-600">Discover your next great read</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-6 text-sm text-slate-600">
              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Smart Search</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>{favorites.size} Favorites</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Search Hints for New Users */}
        {books.length === 0 && !loading && !error && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">
              Ready to find your next book?
            </h2>
            <p className="text-slate-600 mb-8 max-w-2xl mx-auto">
              Search by title, author, subject, or ISBN. Use our advanced filters to narrow down results by publication year, language, and more.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <Search className="h-8 w-8 text-blue-600 mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">By Title</h3>
                <p className="text-sm text-slate-600">Search for books by their title</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <User className="h-8 w-8 text-purple-600 mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">By Author</h3>
                <p className="text-sm text-slate-600">Find books by your favorite authors</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <Tag className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">By Subject</h3>
                <p className="text-sm text-slate-600">Explore books by topic or genre</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <Calendar className="h-8 w-8 text-orange-600 mb-3" />
                <h3 className="font-semibold text-slate-900 mb-2">Advanced Filters</h3>
                <p className="text-sm text-slate-600">Filter by year, language, and more</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {error && <ErrorMessage message={error} />}

        {/* Results */}
        {books.length > 0 && !loading && (
          <div>
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">
                  Search Results
                </h2>
                <p className="text-slate-600 mt-1">
                  Found {totalResults.toLocaleString()} books • Page {currentPage} of {totalPages}
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <Heart className="h-4 w-4" />
                  <span>{favorites.size} favorites</span>
                </div>
              </div>
            </div>

            {/* Book Grid */}
            <BookGrid 
              books={books} 
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <nav className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          currentPage === pageNum
                            ? 'bg-blue-600 text-white'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-slate-600">
            <p>&copy; 2025 Book Finder. Powered by Open Library API.</p>
            <p className="mt-2 text-sm">Made for students, by developers who love books.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;