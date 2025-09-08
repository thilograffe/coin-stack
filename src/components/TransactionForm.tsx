import { useState } from "react";
import type { Player, RoundTransaction } from "../types";

interface TransactionFormProps {
  players: Player[];
  onSubmit: (transaction: RoundTransaction) => void;
  onCancel: () => void;
}

const TransactionForm = ({ players, onSubmit, onCancel }: TransactionFormProps) => {
  const [amount, setAmount] = useState("");
  const [selectedReceivers, setSelectedReceivers] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const validateTransaction = (): string[] => {
    const newErrors: string[] = [];

    if (!amount || parseFloat(amount) <= 0) {
      newErrors.push("Amount must be greater than 0");
    }

    if (selectedReceivers.length === 0) {
      newErrors.push("Select at least 1 person to receive money");
    }

    if (selectedReceivers.length > 3) {
      newErrors.push("Maximum 3 people can receive money");
    }

    if (selectedReceivers.length === 4) {
      newErrors.push("At least 1 person must pay (not everyone can receive)");
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateTransaction();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Calculate new balances
    // Each payer pays the fixed amount, receivers split the total paid amount
    const totalPaid = calculateTotalPaid();
    const amountPerReceiver = totalPaid / selectedReceivers.length;

    const transaction: RoundTransaction = {
      receivers: selectedReceivers,
      amountPerPayer: parseFloat(amount),
      amountPerReceiver: amountPerReceiver,
      totalPaid: totalPaid,
    };

    onSubmit(transaction);
  };

  const calculateTotalPaid = () => {
    const costPerPayer = parseFloat(amount);
    const totalPaid =
      selectedReceivers.length === 3
        ? costPerPayer * 3
        : costPerPayer * (4 - selectedReceivers.length);
    return totalPaid;
  };

  const toggleReceiver = (playerId: string) => {
    setSelectedReceivers((prev) => {
      if (prev.includes(playerId)) {
        return prev.filter((id) => id !== playerId);
      } else if (prev.length < 3) {
        return [...prev, playerId];
      }
      return prev;
    });
    setErrors([]); // Clear errors when user makes changes
  };

  const isReceiver = (playerId: string) => {
    return selectedReceivers.includes(playerId);
  };

  const isPayer = (playerId: string) => {
    return !selectedReceivers.includes(playerId);
  };

  const canSelectAsReceiver = (playerId: string) => {
    return isReceiver(playerId) || selectedReceivers.length < 3;
  };

  const getPayersCount = () => {
    return 4 - selectedReceivers.length;
  };

  const getPayersNames = () => {
    return players
      .filter((p) => !selectedReceivers.includes(p.id))
      .map((p) => p.name)
      .join(", ");
  };

  return (
    <div className="modal-overlay">
      <div className="modal fade-in">
        <form onSubmit={handleSubmit}>
          <h2 className="mb-4">Strafe hinzufügen</h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">Strafe in €</label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                setErrors([]);
              }}
              placeholder="Enter amount each payer pays"
              className="w-full"
              autoFocus
            />
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-3">Wer bekommt Geld?</h3>
            <p className="text-sm text-gray mb-3">Wähle 1-3 Personen, die Geld erhalten.</p>

            <div className="grid-2 keep-columns">
              {players.map((player) => (
                <div
                  key={player.id}
                  className={`player-card ${
                    isReceiver(player.id)
                      ? "receiver"
                      : isPayer(player.id) && selectedReceivers.length > 0
                        ? "giver"
                        : ""
                  }`}
                >
                  <h4 className="font-semibold mb-2 text-center">{player.name}</h4>
                  <button
                    type="button"
                    onClick={() => toggleReceiver(player.id)}
                    disabled={!canSelectAsReceiver(player.id)}
                    className={`btn-sm w-full ${
                      isReceiver(player.id) ? "btn-success" : "btn-secondary"
                    }`}
                  >
                    {isReceiver(player.id)
                      ? "Erhält ✓"
                      : isPayer(player.id) && selectedReceivers.length > 0
                        ? "Zahlt"
                        : "Auswählen"}
                  </button>
                  {isPayer(player.id) && selectedReceivers.length > 0 && amount && (
                    <p className="text-xs text-center text-gray mt-1">
                      Zahlt{" "}
                      {(selectedReceivers.length === 3
                        ? 3
                        : 1 * parseFloat(amount || "0")
                      ).toFixed(2)}
                      €
                    </p>
                  )}
                  {isReceiver(player.id) &&
                    selectedReceivers.length > 0 &&
                    amount &&
                    getPayersCount() > 0 && (
                      <p className="text-xs text-center text-gray mt-1">
                        Bekommt {(calculateTotalPaid() / selectedReceivers.length).toFixed(2)}€
                      </p>
                    )}
                </div>
              ))}
            </div>

            {selectedReceivers.length > 0 && (
              <div
                className="mt-3 p-3 rounded"
                style={{
                  backgroundColor: "var(--background)",
                  border: "1px solid var(--border)",
                }}
              >
                <div className="text-sm">
                  <div className="mb-2">
                    <span className="font-semibold text-green">Receivers:</span>{" "}
                    {players
                      .filter((p) => selectedReceivers.includes(p.id))
                      .map((p) => p.name)
                      .join(", ")}
                  </div>
                  {getPayersCount() > 0 && (
                    <div>
                      <span className="font-semibold text-red">Payers:</span>{" "}
                      {getPayersNames()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {errors.length > 0 && (
            <div
              className="mb-4 p-3 rounded"
              style={{
                backgroundColor: "rgb(220 38 38 / 0.1)",
                border: "1px solid rgb(220 38 38 / 0.2)",
              }}
            >
              <ul className="text-sm text-red">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-3">
            <button type="button" onClick={onCancel} className="btn-secondary w-full">
              Cancel
            </button>
            <button type="submit" className="btn-primary w-full">
              Add Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
