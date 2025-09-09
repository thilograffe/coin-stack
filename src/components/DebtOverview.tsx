import type { Player, PlayerDebt } from "../types";

interface DebtOverviewProps {
  players: Player[];
}

const DebtOverview = ({ players }: DebtOverviewProps) => {
  const calculateDebts = (): PlayerDebt[] => {
    const debts: PlayerDebt[] = [];
    const balances = [...players];

    // Sort players by balance (most negative first, then most positive)
    balances.sort((a, b) => a.balance - b.balance);

    const debtors = balances.filter((p) => p.balance < 0).map((p) => ({ ...p }));
    const creditors = balances.filter((p) => p.balance > 0).map((p) => ({ ...p }));

    // Calculate minimum debts needed to settle all balances
    while (debtors.length > 0 && creditors.length > 0) {
      const debtor = debtors[0];
      const creditor = creditors[0];

      const debtAmount = Math.abs(debtor.balance);
      const creditAmount = creditor.balance;
      const settleAmount = Math.min(debtAmount, creditAmount);

      if (settleAmount > 0) {
        debts.push({
          fromPlayerId: debtor.id,
          toPlayerId: creditor.id,
          amount: settleAmount,
        });
      }

      debtor.balance += settleAmount;
      creditor.balance -= settleAmount;

      if (debtor.balance >= 0) {
        debtors.shift();
      }
      if (creditor.balance <= 0) {
        creditors.shift();
      }
    }

    return debts;
  };

  const formatAmount = (amount: number) => {
    return `€${amount.toFixed(2)}`;
  };

  const getPlayerName = (playerId: string) => {
    return players.find((p) => p.id === playerId)?.name || "Unknown";
  };

  const debts = calculateDebts();

  return (
    <div className="card">
      <h2>💰 Übersicht der Strafen</h2>
      {debts.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray">Keine offenen Strafen</p>
        </div>
      ) : (
        <div className="space-y-3">
          {debts.map((debt, index) => (
            <div
              key={`${debt.fromPlayerId}-${debt.toPlayerId}-${index}`}
              className="flex justify-between items-center p-3 rounded"
              style={{
                backgroundColor: "var(--background)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="font-semibold">{getPlayerName(debt.fromPlayerId)}</span>
                  <div className="text-sm text-gray">schuldet</div>
                </div>
                <div className="text-2xl">→</div>
                <div>
                  <span className="font-semibold">{getPlayerName(debt.toPlayerId)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-lg text-primary">
                  {formatAmount(debt.amount)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DebtOverview;
