export interface Person {
  id: string;
  name: string;
  paid: number;
}

export function splitBill(people: Person[]) {
  if (people.length === 0) return [];
  
  const total = people.reduce((sum, p) => sum + p.paid, 0);
  const share = total / people.length;

  const balances = people.map(p => ({
    name: p.name,
    balance: parseFloat((p.paid - share).toFixed(2))
  }));

  const creditors = balances.filter(p => p.balance > 0).sort((a, b) => b.balance - a.balance);
  const debtors = balances.filter(p => p.balance < 0).sort((a, b) => a.balance - b.balance);

  const transactions: { from: string; to: string; amount: number }[] = [];
  let i = 0, j = 0;

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];
    const amount = Math.min(creditor.balance, -debtor.balance);

    transactions.push({
      from: debtor.name,
      to: creditor.name,
      amount: parseFloat(amount.toFixed(2))
    });

    creditor.balance -= amount;
    debtor.balance += amount;

    if (Math.abs(creditor.balance) < 0.01) i++;
    if (Math.abs(debtor.balance) < 0.01) j++;
  }

  return transactions;
}