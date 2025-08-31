import { useState } from "react";
import type { Player } from "../types";

interface PlayerListProps {
  players: Player[];
  onUpdatePlayerName: (playerId: string, newName: string) => void;
}

const PlayerList = ({ players, onUpdatePlayerName }: PlayerListProps) => {
  const [editingPlayer, setEditingPlayer] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const startEditing = (player: Player) => {
    setEditingPlayer(player.id);
    setEditName(player.name);
  };

  const saveEdit = () => {
    if (editingPlayer && editName.trim()) {
      onUpdatePlayerName(editingPlayer, editName.trim());
    }
    setEditingPlayer(null);
    setEditName("");
  };

  const cancelEdit = () => {
    setEditingPlayer(null);
    setEditName("");
  };

  const formatBalance = (balance: number) => {
    return balance >= 0
      ? `+€${balance.toFixed(2)}`
      : `-€${Math.abs(balance).toFixed(2)}`;
  };

  return (
    <div className="card">
      <h2>Players</h2>
      <div className="grid-2 keep-columns">
        {players.map((player) => (
          <div key={player.id} className="player-card">
            {editingPlayer === player.id ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit();
                    if (e.key === "Escape") cancelEdit();
                  }}
                  className="w-full"
                  autoFocus
                  maxLength={20}
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveEdit}
                    className="btn-success btn-sm w-full"
                    disabled={!editName.trim()}
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="btn-secondary btn-sm w-full"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => startEditing(player)}
                className="cursor-pointer"
              >
                <h3 className="text-center mb-2">{player.name}</h3>
                <div
                  className={`balance-display ${
                    player.balance > 0
                      ? "balance-positive"
                      : player.balance < 0
                        ? "balance-negative"
                        : ""
                  }`}
                >
                  {formatBalance(player.balance)}
                </div>
                <p className="text-center text-sm text-gray mt-2">
                  Tap to edit name
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
