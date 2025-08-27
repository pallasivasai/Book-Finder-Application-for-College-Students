import React, { useState } from 'react';
import { Heart, User, Calendar, BookOpen, ExternalLink, Star } from 'lucide-react';
import { Book } from '../utils/api';

interface BookCardProps {
  book: Book;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, isFavorite, onToggleFavorite }) => {
  const [imageError, setImageError] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const coverUrl = book.cover_i 
    ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
    : null;

  const openLibraryUrl = `https://openlibrary.org${book.key}`;

  const truncatedTitle = book.title.length > 50 
    ? book.title.substring(0, 50) + '...'
    : book.title;

  const getSubjects = () => {
    const subjects = book.subject || [];
    return subjects.slice(0, 3);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group">
      {/* Cover Image */}
      <div className="aspect-[3/4] bg-slate-100 relative overflow-hidden">
        {coverUrl && !imageError ? (
          <img
            src={coverUrl}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
            <BookOpen className="h-16 w-16 text-slate-400" />
          </div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={onToggleFavorite}
          className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-all duration-200 ${
            isFavorite
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-white text-slate-400 hover:text-red-500 hover:bg-slate-50'
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Rating Badge */}
        {book.ratings_average && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
            <Star className="h-3 w-3 fill-current" />
            <span>{book.ratings_average.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-semibold text-slate-900 mb-2 leading-tight">
          {expanded ? book.title : truncatedTitle}
          {book.title.length > 50 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="ml-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {expanded ? 'Less' : 'More'}
            </button>
          )}
        </h3>

        {/* Authors */}
        {book.author_name && book.author_name.length > 0 && (
          <div className="flex items-center space-x-1 text-sm text-slate-600 mb-3">
            <User className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">
              {book.author_name.slice(0, 2).join(', ')}
              {book.author_name.length > 2 && ` +${book.author_name.length - 2} more`}
            </span>
          </div>
        )}

        {/* Publication Info */}
        <div className="space-y-2 mb-4">
          {book.first_publish_year && (
            <div className="flex items-center space-x-2 text-sm text-slate-600">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>First published: {book.first_publish_year}</span>
            </div>
          )}
          
          {book.edition_count && (
            <div className="text-sm text-slate-600">
              <span className="font-medium">{book.edition_count}</span> edition{book.edition_count !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {/* Subjects */}
        {getSubjects().length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {getSubjects().map((subject, index) => (
                <span
                  key={index}
                  className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100">
          <a
            href={openLibraryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200"
          >
            <ExternalLink className="h-4 w-4" />
            <span>View on Open Library</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default BookCard;