export interface Review {
    id: number;
    book: {
        name: string;
        author: string;
    };
    rating: number;
    reviewComment: string;
}
