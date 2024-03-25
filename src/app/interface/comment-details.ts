import { UserDetails } from "./user-details";

export interface CommentDetails {
    user: UserDetails;
    message: string;
    date: string;
  }