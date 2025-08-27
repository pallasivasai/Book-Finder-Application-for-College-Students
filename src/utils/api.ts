export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  edition_count?: number;
  cover_i?: number;
  subject?: string[];
  ratings_average?: number;
  isbn?: string[];
  publisher?: string[];
  language?: string[];
  has_fulltext?: boolean;
}

export interface SearchParams {
  title?: string;
  author?: string;
  subject?: string;
  isbn?: string;
  publishYear?: string;
  language?: string;
  hasFulltext?: boolean;
}

export interface SearchResult {
  books: Book[];
  totalResults: number;
}

const BASE_URL = 'https://openlibrary.org/search.json';

export const searchBooks = async (
  params: SearchParams,
  page: number = 1
): Promise<SearchResult> => {
  const searchParams = new URLSearchParams();

  // Add search query
  if (params.title) searchParams.append('title', params.title);
  if (params.author) searchParams.append('author', params.author);
  if (params.subject) searchParams.append('subject', params.subject);
  if (params.isbn) searchParams.append('isbn', params.isbn);

  // Add filters
  if (params.publishYear) {
    searchParams.append('first_publish_year', params.publishYear);
  }
  if (params.language) {
    searchParams.append('language', params.language);
  }
  if (params.hasFulltext) {
    searchParams.append('has_fulltext', 'true');
  }

  // Pagination
  const limit = 20;
  const offset = (page - 1) * limit;
  searchParams.append('limit', limit.toString());
  searchParams.append('offset', offset.toString());

  // Additional parameters for better results
  searchParams.append('fields', 'key,title,author_name,first_publish_year,edition_count,cover_i,subject,ratings_average,isbn,publisher,language,has_fulltext');

  const url = `${BASE_URL}?${searchParams.toString()}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Search failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.docs) {
      throw new Error('Invalid response format from Open Library API');
    }

    const books: Book[] = data.docs.map((doc: any) => ({
      key: doc.key,
      title: doc.title || 'Unknown Title',
      author_name: doc.author_name || undefined,
      first_publish_year: doc.first_publish_year || undefined,
      edition_count: doc.edition_count || undefined,
      cover_i: doc.cover_i || undefined,
      subject: doc.subject || undefined,
      ratings_average: doc.ratings_average || undefined,
      isbn: doc.isbn || undefined,
      publisher: doc.publisher || undefined,
      language: doc.language || undefined,
      has_fulltext: doc.has_fulltext || false,
    }));

    return {
      books,
      totalResults: data.numFound || 0,
    };
  } catch (error) {
    console.error('Search error:', error);
    
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('An unexpected error occurred while searching for books');
    }
  }
};