import { CommentDetails } from './comment-details';

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
  comments: CommentDetails[];
  review: string;
  liked: boolean;
  likedBy: number[];
}
