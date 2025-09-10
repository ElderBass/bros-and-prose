export interface Book {
    id: string;
    title: string;
    author: string;
    totalPages: number;
    goodreadsRating: string;
    yearPublished: number;
    imageSrc: string;
}

export interface BooksState {
    currentBook: Book;
    pastBooks: Book[];
    futureBooks: Book[];
}

export interface BookResult {
    author_key: string[];
    author_name: string[];
    cover_edition_key: string;
    cover_i: number;
    ebook_access: string;
    edition_count: number;
    first_publish_year: number;
    has_fulltext: boolean;
    ia: string[];
    key: string;
    language: string[];
    lending_edition_s: string;
    lending_identifier_s: string;
    public_scan_b: boolean;
    title: string;
}
