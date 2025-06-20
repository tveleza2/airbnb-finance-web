// This file exports TypeScript types and interfaces used throughout the application.

export interface User {
    id: number;
    name: string;
    email: string;
}

export interface Post {
    id: number;
    title: string;
    content: string;
    authorId: number;
}

export type Nullable<T> = T | null;