export interface BlogDetails {
    id: number;
    overview: string;
    poster_path: string;
    release_date: string;
    title: string;
    vote_count: number;
    newUrl: boolean;
    author: string;
    visibility: string;
    // Liste des utilisateurs ayant accès au blog restreint
    restrictedUsers: string[];
  }