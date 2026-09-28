export interface UserSummary {
  id: number;
  username: string;
  displayName: string;
}

export interface Me extends UserSummary {
  email: string;
  bio: string | null;
  createdAt: string;
}

export interface Profile extends UserSummary {
  bio: string | null;
  createdAt: string;
  storyCount: number;
  branchCount: number;
}

export interface StorySummary {
  id: number;
  title: string;
  description: string;
  tags: string[];
  author: UserSummary;
  published: boolean;
  openToBranches: boolean;
  views: number;
  likeCount: number;
  chapterCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface StoryDetail extends StorySummary {
  contributorCount: number;
  commentCount: number;
  rootChapterId: number | null;
}

export interface ChapterNode {
  id: number;
  parentId: number | null;
  title: string;
  choiceLabel: string | null;
  depth: number;
  views: number;
  author: UserSummary;
  byStoryAuthor: boolean;
  createdAt: string;
}

export interface PathStep {
  id: number;
  title: string;
  choiceLabel: string | null;
}

export interface ChapterDetail {
  id: number;
  storyId: number;
  storyTitle: string;
  storyAuthor: UserSummary;
  storyPublished: boolean;
  storyOpenToBranches: boolean;
  parentId: number | null;
  title: string;
  choiceLabel: string | null;
  content: string;
  depth: number;
  views: number;
  author: UserSummary;
  byStoryAuthor: boolean;
  createdAt: string;
  updatedAt: string;
  path: PathStep[];
  choices: ChapterNode[];
}

export interface BranchActivity {
  id: number;
  title: string;
  choiceLabel: string | null;
  depth: number;
  excerpt: string;
  author: UserSummary;
  storyId: number;
  storyTitle: string;
  createdAt: string;
}

export interface CommentItem {
  id: number;
  content: string;
  author: UserSummary;
  createdAt: string;
  edited: boolean;
}

export interface TagCount {
  tag: string;
  count: number;
}

export interface Page<T> {
  items: T[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
}

export interface AuthResponse {
  token: string;
  user: Me;
}

export interface LikeState {
  liked: boolean;
  likeCount: number;
}
