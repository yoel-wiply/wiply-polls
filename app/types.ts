export type Poll = Base & {
  title: string;
  options: string[];
  votes: number[];
  pollCloses: string
};

export type Base = {
  id?: string;
}

// export interface Options {
//   optionId: string;
//   text: string;
//   voteCount: number;
// }

// export interface Vote {
//   voteId: string;
//   userId: string;
//   optionId: string;
//   createdAt: string;
// }

// export interface PollsOptions {
//   title: string;
//   description: string;
//   createdAt: string;
// }
