export class Vote {
  id: number;
  voteTitle: string;
  voteDesc: string;
  voteOptions: Array<VoteOption> = [];
  totalVoteCount: number;
}

export class VoteOption {
  optionName: string;
  voteCount: number;
}
