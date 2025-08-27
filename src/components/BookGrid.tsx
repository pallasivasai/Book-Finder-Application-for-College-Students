import React from 'react';
import BookCard from './BookCard';
import { Book } from '../utils/api';

interface BookGridProps {
  books: Book[];
  favorites: Set<string>;
  onToggleFavorite: (bookId: string) => void;
}

const BookGrid: React.FC<BookGridProps> = ({ books, favorites, onToggleFavorite }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book) => (
        <BookCard
          key={book.key}
          book={book}
          isFavorite={favorites.has(book.key)}
          onToggleFavorite={() => onToggleFavorite(book.key)}
        />
      ))}
    </div>
  );
};

export default BookGrid;