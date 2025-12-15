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
    dateCompleted?: string;
}

export interface BookInfo {
    title: string;
    author: string;
    id: string;
    tags?: string[];
}

export interface BooksState {
    mostVotedFutureBookId: string;
    currentBook: Book;
    pastBooks: Book[];
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
    subtitle?: string;
}

export interface IBookSearchResult {
    key: string;
    title: string;
    author: string;
    yearPublished: number;
    imageSrc: string;
}

export interface FutureBook {
    id: string;
    title: string;
    author: string;
    yearPublished: number;
    imageSrc: string;
    pages?: number;
    tags?: string[];
    description?: string;
    votes: string[];
}

export interface ArchivedBooksEntry {
    selectorId: string;
    archivedBooks: FutureBook[];
    archivedAt: string;
}

export interface FutureBookSelectorRequest {
    selectorId: string;
}

export type Shelf = "currentlyReading" | "wantToRead" | "haveRead";

export interface BookshelfBook {
    id: string;
    title: string;
    author: string;
    imageSrc: string;
    description: string;
    yearPublished: number;
    pages?: number;
    tags?: string[];
}

export interface GoogleBooksResult {
    kind: string;
    id: string;
    etag?: string;
    selfLink?: string;
    volumeInfo: GoogleBooksVolumeInfo;
    saleInfo?: GoogleBooksSaleInfo;
    accessInfo?: GoogleBooksAccessInfo;
    searchInfo?: GoogleBooksSearchInfo;
}

export interface GoogleBooksVolumeInfo {
    title?: string;
    subtitle?: string;
    authors?: string[];
    publisher?: string;
    publishedDate?: string;
    description?: string;
    industryIdentifiers?: GoogleBooksIndustryIdentifier[];
    readingModes?: GoogleBooksReadingModes;
    pageCount?: number;
    printType?: string;
    categories?: string[];
    averageRating?: number;
    ratingsCount?: number;
    maturityRating?: string;
    allowAnonLogging?: boolean;
    contentVersion?: string;
    panelizationSummary?: GoogleBooksPanelizationSummary;
    imageLinks?: GoogleBooksImageLinks;
    language?: string;
    previewLink?: string;
    infoLink?: string;
    canonicalVolumeLink?: string;
}

export interface GoogleBooksIndustryIdentifier {
    type: string;
    identifier: string;
}

export interface GoogleBooksReadingModes {
    text?: boolean;
    image?: boolean;
}

export interface GoogleBooksPanelizationSummary {
    containsEpubBubbles?: boolean;
    containsImageBubbles?: boolean;
}

export interface GoogleBooksImageLinks {
    smallThumbnail?: string;
    thumbnail?: string;
}

export interface GoogleBooksSaleInfo {
    country?: string;
    saleability?: string;
    isEbook?: boolean;
}

export interface GoogleBooksAccessInfo {
    country?: string;
    viewability?: string;
    embeddable?: boolean;
    publicDomain?: boolean;
    textToSpeechPermission?: string;
    epub?: { isAvailable?: boolean };
    pdf?: { isAvailable?: boolean };
    webReaderLink?: string;
    accessViewStatus?: string;
    quoteSharingAllowed?: boolean;
}

export interface GoogleBooksSearchInfo {
    textSnippet?: string;
}
