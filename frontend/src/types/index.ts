export type Collection = {
  _id: string;
  name: string;
  emoji: string;
  paperIds: string[];
};

export type Paper = {
  _id: string;
  title: string;
  author: string;
  tags?: string[];
  fileUrl: string;
  summary?: string;
  summaries?: Array<{ summary: string }>;
  collectionId: string;
};

export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export type User = {
  _id: string;
  fullname: string;
  username: string;
  password: string;
};

export type UserLoginPayload = {
  username: string;
  password: string;
};
