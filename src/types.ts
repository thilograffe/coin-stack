export interface Player {
  id: string;
  name: string;
  balance: number;
}

export interface Transaction {
  id: string;
  timestamp: Date;
  receivers: Player[];
  payers: Player[];
  amountPerReceiver: number;
  description?: string;
}

export interface GameState {
  players: Player[];
  transactions: Transaction[];
  currentRound: number;
}

export interface RoundTransaction {
  receivers: string[]; // Player IDs (1-3 people)
  amountPerReceiver: number;
  description?: string;
}

export interface PlayerDebt {
  fromPlayerId: string;
  toPlayerId: string;
  amount: number;
}
