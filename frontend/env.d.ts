/// <reference types="vite/client" />

declare module "turndown" {
    export default class TurndownService {
        constructor(options?: { headingStyle?: string });
        turndown(html: string | HTMLElement): string;
    }
}
