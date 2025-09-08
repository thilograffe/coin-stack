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
  amountPerPayer: number;
  amountPerReceiver: number;
  totalPaid: number;
}

export interface GameState {
  players: Player[];
  transactions: Transaction[];
  currentRound: number;
}

export interface RoundTransaction {
  receivers: string[]; // Player IDs (1-3 people)
  amountPerPayer: number;
  amountPerReceiver: number;
  totalPaid: number;
}

export interface PlayerDebt {
  fromPlayerId: string;
  toPlayerId: string;
  amount: number;
}
