import type { User } from "./user";

export interface Book {
    id: string;
    title: string;
    author: string;
    totalPages: number;
    goodreadsRating: string;
    yearPublished: number;
    imageSrc: string;
    completed: boolean;
    groupConsensus?: string;
    discussionComments: {
        [key: string]: Comment;
    };
}

export interface BooksState {
    currentBook: Book;
    pastBooks: Book[];
    futureBooks: FutureBook[];
}

export interface OpenLibraryBookResult {
    author_key: string[];
    author_name: string[];
    cover_edition_key: string;
    cover_i: number;
    ebook_access: string;
    edition_count: number;
    first_publish_year: number;
    has_fulltext: boolean;
    ia: string[];
    isbn?: string[];
    key: string;
    language: string[];
    lending_edition_s: string;
    lending_identifier_s: string;
    public_scan_b: boolean;
    title: string;
}

export interface IBookSearchResult {
    key: string;
    title: string;
    author: string;
    yearPublished: number;
    imageSrc: string;
}

export interface Comment {
    id: string;
    user: User;
    comment: string;
    createdAt: string;
}

export interface FutureBook {
    id: string;
    title: string;
    author: string;
    yearPublished: number;
    imageSrc: string;
    tags: string[];
    description: string;
    votes: string[];
}
