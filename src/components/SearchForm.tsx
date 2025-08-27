import React, { useState, useRef } from 'react';
import { Search, Filter, X, Calendar, Globe, BookOpen } from 'lucide-react';
import { SearchParams } from '../utils/api';

interface SearchFormProps {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState<'title' | 'author' | 'subject' | 'isbn'>('title');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    publishYear: '',
    language: '',
    hasFulltext: false,
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    const searchParams: SearchParams = {
      [searchType]: query.trim(),
      ...filters,
    };

    onSearch(searchParams);
  };

  const clearFilters = () => {
    setFilters({
      publishYear: '',
      language: '',
      hasFulltext: false,
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    typeof value === 'boolean' ? value : value !== ''
  );

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <form onSubmit={handleSubmit} className="p-6">
        {/* Main Search */}
        <div className="space-y-4">
          {/* Search Type Selector */}
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'title', label: 'Title', icon: BookOpen },
              { value: 'author', label: 'Author', icon: Search },
              { value: 'subject', label: 'Subject', icon: Filter },
              { value: 'isbn', label: 'ISBN', icon: Search },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSearchType(value as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  searchType === value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search by ${searchType}...`}
              className="block w-full pl-12 pr-4 py-4 text-lg border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 transition-colors duration-200"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={!query.trim() || loading}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-5 w-5" />
                  <span>Search Books</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center space-x-2 ${
                showFilters || hasActiveFilters
                  ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500'
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-slate-500'
              }`}
            >
              <Filter className="h-5 w-5" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-white text-purple-600 rounded-full px-2 py-0.5 text-xs font-bold">
                  Active
                </span>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t border-slate-200 p-6 bg-slate-50">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Advanced Filters</h3>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-sm text-slate-600 hover:text-slate-900 flex items-center space-x-1"
                >
                  <X className="h-4 w-4" />
                  <span>Clear all</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Publication Year */}
              <div>
                <label htmlFor="publishYear" className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Publication Year</span>
                </label>
                <input
                  id="publishYear"
                  type="number"
                  value={filters.publishYear}
                  onChange={(e) => setFilters(prev => ({ ...prev, publishYear: e.target.value }))}
                  placeholder="e.g., 2020"
                  className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Language */}
              <div>
                <label htmlFor="language" className="flex items-center space-x-2 text-sm font-medium text-slate-700 mb-2">
                  <Globe className="h-4 w-4" />
                  <span>Language</span>
                </label>
                <select
                  id="language"
                  value={filters.language}
                  onChange={(e) => setFilters(prev => ({ ...prev, language: e.target.value }))}
                  className="block w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Any language</option>
                  <option value="eng">English</option>
                  <option value="spa">Spanish</option>
                  <option value="fre">French</option>
                  <option value="ger">German</option>
                  <option value="ita">Italian</option>
                  <option value="por">Portuguese</option>
                  <option value="rus">Russian</option>
                  <option value="chi">Chinese</option>
                  <option value="jpn">Japanese</option>
                </select>
              </div>

              {/* Has Full Text */}
              <div>
                <label className="flex items-center space-x-3 text-sm font-medium text-slate-700 mt-6">
                  <input
                    type="checkbox"
                    checked={filters.hasFulltext}
                    onChange={(e) => setFilters(prev => ({ ...prev, hasFulltext: e.target.checked }))}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span>Has full text available</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;