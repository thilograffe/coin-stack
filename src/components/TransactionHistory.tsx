import type { Transaction } from "../types";

interface TransactionHistoryProps {
  transactions: Transaction[];
  onClose: () => void;
}

const TransactionHistory = ({ transactions, onClose }: TransactionHistoryProps) => {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  };

  const formatAmount = (amount: number) => {
    return `${amount.toFixed(2)}€`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal fade-in">
        <div className="flex justify-between items-center mb-4">
          <h2>Transaction History</h2>
          <button onClick={onClose} className="btn-secondary btn-sm" type="button">
            ✕
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray">No transactions yet</p>
            <p className="text-sm text-gray mt-2">
              Add your first money transaction to get started
            </p>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <div className="space-y-3">
              {transactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="transaction-item border rounded-lg p-3"
                  style={{
                    backgroundColor: "var(--background)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="text-sm text-gray">
                        {formatDate(transaction.timestamp)}
                      </div>
                      <div className="font-semibold text-lg">
                        {formatAmount(transaction.amountPerPayer)} Strafe
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray">
                        Round #{transactions.length - index}
                      </div>
                    </div>
                  </div>

                  <div className="grid-2 gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-red mb-1">Paid for it:</h4>
                      <ul className="text-sm">
                        {transaction.payers.map((payer) => (
                          <li key={payer.id} className="text-red">
                            • {payer.name} (
                            {formatAmount(
                              transaction.payers.length === 1
                                ? transaction.totalPaid
                                : transaction.amountPerPayer,
                            )}
                            )
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-green mb-1">Received:</h4>
                      <ul className="text-sm">
                        {transaction.receivers.map((receiver) => {
                          return (
                            <li key={receiver.id} className="text-green">
                              • {receiver.name} ({formatAmount(transaction.amountPerReceiver)})
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {transactions.length > 0 && (
          <div
            className="mt-4 pt-3 border-t"
            style={{
              borderColor: "var(--border)",
            }}
          >
            <div className="text-center">
              <p className="text-sm text-gray">Total transactions: {transactions.length}</p>
              <p className="text-sm text-gray">
                Total money moved:{" "}
                {formatAmount(transactions.reduce((sum, t) => sum + t.totalPaid, 0))}
              </p>
            </div>
          </div>
        )}

        <div className="mt-4">
          <button onClick={onClose} className="btn-primary w-full">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
