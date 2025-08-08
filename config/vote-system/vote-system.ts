export interface IVoteSystem {
  voteSystem: [string | number][];
}

export const VoteSystemOptions: { [key: string]: any } = {
  ["modified-fibonacci"]: {
    voteSystem: ["☕", "?", 0.5, 1, 2, 3, 5, 8, 13, 21],
  },
  ["fibonacci"]: {
    voteSystem: ["☕", "?", 0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89],
  },
};
