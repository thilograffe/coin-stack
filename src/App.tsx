import { useState, useEffect } from "react";
import type { GameState, Player, Transaction, RoundTransaction } from "./types";
import { PlayerList, DebtOverview, TransactionForm, TransactionHistory } from "./components";
import "./App.css";

const initialPlayers: Player[] = [
  { id: "1", name: "Player 1", balance: 0 },
  { id: "2", name: "Player 2", balance: 0 },
  { id: "3", name: "Player 3", balance: 0 },
  { id: "4", name: "Player 4", balance: 0 },
];

function App() {
  const [gameState, setGameState] = useState<GameState>(() => {
    const saved = localStorage.getItem("coinStackGame");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as GameState & {
          transactions: Array<Omit<Transaction, "timestamp"> & { timestamp: string }>;
        };
        // Convert timestamp strings back to Date objects
        const convertedTransactions: Transaction[] = parsed.transactions.map((t) => ({
          ...t,
          timestamp: new Date(t.timestamp),
        }));
        return {
          ...parsed,
          transactions: convertedTransactions,
        };
      } catch (error) {
        console.error("Failed to load saved game:", error);
      }
    }

    return {
      players: initialPlayers,
      transactions: [],
      currentRound: 1,
    };
  });

  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Save game state to localStorage
  useEffect(() => {
    localStorage.setItem("coinStackGame", JSON.stringify(gameState));
  }, [gameState]);

  const updatePlayerName = (playerId: string, newName: string) => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((player) =>
        player.id === playerId ? { ...player, name: newName } : player,
      ),
    }));
  };

  const addTransaction = (transaction: RoundTransaction) => {
    const receivers = gameState.players.filter((p) => transaction.receivers.includes(p.id));
    const payers = gameState.players.filter((p) => !transaction.receivers.includes(p.id));

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      timestamp: new Date(),
      receivers: receivers,
      payers: payers,
      amountPerPayer: transaction.amountPerPayer,
      amountPerReceiver: transaction.amountPerReceiver,
      totalPaid: transaction.totalPaid,
    };

    const updatedPlayers = gameState.players.map((player) => {
      let balanceChange = 0;

      if (transaction.receivers.includes(player.id)) {
        // Player receives their share of the total paid amount
        balanceChange = transaction.amountPerReceiver;
      } else {
        // Player pays the fixed amount
        balanceChange =
          payers.length === 1
            ? -(3 * transaction.amountPerPayer)
            : -transaction.amountPerPayer;
      }

      return {
        ...player,
        balance: player.balance + balanceChange,
      };
    });

    setGameState((prev) => ({
      ...prev,
      players: updatedPlayers,
      transactions: [newTransaction, ...prev.transactions],
      currentRound: prev.currentRound + 1,
    }));

    setShowTransactionForm(false);
  };

  const resetGame = () => {
    if (
      window.confirm(
        "Bist du sicher, dass du das Spiel zurücksetzen möchtest? Diese Aktion kann nicht rückgängig gemacht werden.",
      )
    ) {
      setGameState({
        players: initialPlayers,
        transactions: [],
        currentRound: 1,
      });
      setShowTransactionForm(false);
      setShowHistory(false);
    }
  };

  const undoLastTransaction = () => {
    if (gameState.transactions.length === 0) return;

    if (
      window.confirm(
        "Bist du sicher, dass du die letzte Transaktion rückgängig machen möchtest?",
      )
    ) {
      const lastTransaction = gameState.transactions[0];
      const costPerPayer = lastTransaction.amountPerPayer;
      const amountPerReceiver = lastTransaction.amountPerReceiver;

      // Reverse the balance changes
      const updatedPlayers = gameState.players.map((player) => {
        let balanceChange = 0;

        if (lastTransaction.receivers.some((r) => r.id === player.id)) {
          // Reverse: Remove what was received
          balanceChange = -amountPerReceiver;
        } else if (lastTransaction.payers.some((p) => p.id === player.id)) {
          // Reverse: Add back what was paid
          balanceChange =
            lastTransaction.payers.length === 1 ? 3 * costPerPayer : costPerPayer;
        }

        return {
          ...player,
          balance: player.balance + balanceChange,
        };
      });

      setGameState((prev) => ({
        ...prev,
        players: updatedPlayers,
        transactions: prev.transactions.slice(1),
        currentRound: Math.max(1, prev.currentRound - 1),
      }));
    }
  };

  return (
    <div className="container">
      <header className="text-center mb-4">
        <h1>Coin Stack</h1>
        <p className="text-gray">Runde {gameState.currentRound}</p>
      </header>

      <DebtOverview players={gameState.players} />

      <PlayerList players={gameState.players} onUpdatePlayerName={updatePlayerName} />

      <div className="flex flex-col gap-3 mt-4">
        <button
          onClick={() => setShowTransactionForm(true)}
          className="btn-primary btn-lg w-full"
        >
          Transaktion hinzufügen
        </button>

        <div className="grid-2">
          <button
            onClick={() => setShowHistory(true)}
            className="btn-secondary"
            disabled={gameState.transactions.length === 0}
          >
            Historie ({gameState.transactions.length})
          </button>

          <button
            onClick={undoLastTransaction}
            className="btn-secondary"
            disabled={gameState.transactions.length === 0}
          >
            Letztes Spiel zurücknehmen
          </button>
        </div>

        <button onClick={resetGame} className="btn-danger btn-sm w-full">
          Ganzes Spiel zurücksetzen
        </button>
      </div>

      {showTransactionForm && (
        <TransactionForm
          players={gameState.players}
          onSubmit={addTransaction}
          onCancel={() => setShowTransactionForm(false)}
        />
      )}

      {showHistory && (
        <TransactionHistory
          transactions={gameState.transactions}
          onClose={() => setShowHistory(false)}
        />
      )}
    </div>
  );
}

export default App;
