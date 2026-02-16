export type VoteType = 'best' | 'good';

export interface TvVoteRequest {
  vote_type: VoteType;
  session_id: string;
}

export interface TvVoteStats {
  best: number;
  good: number;
  total: number;
  best_percentage: number;
  good_percentage: number;
}

export interface TvVoteResponse {
  success: boolean;
  message?: string;
  stats: TvVoteStats;
}
