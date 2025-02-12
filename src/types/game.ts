export type PlayerType = {
  name: string;
  score: number;
  scoreHistory: {
    closingPoints: number;
    deadPoints: number;
    points3to7: number;
    points8to13: number;
    points1: number;
    points2: number;
    jokerPoints: number;
    subtractedPoints: number;
    total: number;
  }[];
};

export type TeamType = {
  name: string;
  players: string[];
  score: number;
  scoreHistory: {
    closingPoints: number;
    deadPoints: number;
    points3to7: number;
    points8to13: number;
    points1: number;
    points2: number;
    jokerPoints: number;
    subtractedPoints: number;
    total: number;
  }[];
};

export type GameType = {
  mode: 'individual' | 'team' | null;
  players: PlayerType[];
  teams: TeamType[];
  currentRound: number;
  gameStarted: boolean;
  winner: string | null;
};