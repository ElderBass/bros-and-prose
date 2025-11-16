import type { UserInfo } from "./user";

export type PalaverType =
    | "discussion_note"
    | "progress_note"
    | "recommendation"
    | "misc";

export interface ItemTypeButtonProp {
    type: PalaverType;
    label: string;
}

export interface PalaverEntry {
    id: string;
    type: PalaverType;
    text: string;
    createdAt: string;
    userInfo: UserInfo;
    bookId?: string;
    recommendation?: {
        title: string;
        author: string;
        tags?: string[];
        link?: string;
    };
}
