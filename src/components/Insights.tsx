import { useTransactionStore } from "../store/useTransactionStore";

const Insights = () => {
  const { transactions } = useTransactionStore();

  let totalIncome = 0;
  let totalExpense = 0;
  const categoryMap: Record<string, number> = {};

  transactions.forEach((t) => {
    if (t.type.toLowerCase() === "expense") {
      totalExpense += t.amount;

      if (!categoryMap[t.category]) {
        categoryMap[t.category] = 0;
      }
      categoryMap[t.category] += t.amount;
    } else {
      totalIncome += t.amount;
    }
  });

  // Find highest spending category
  let highestCategory = "";
  let highestAmount = 0;

  Object.entries(categoryMap).forEach(([cat, amt]) => {
    if (amt > highestAmount) {
      highestAmount = amt;
      highestCategory = cat;
    }
  });

  const balance = totalIncome - totalExpense;

  return (
    <div className="p-5 bg-(--bg-card) border border-(--border-color) rounded-2xl shadow-lg">

      <h3 className="text-2xl text-white font-semibold mb-4">Insights</h3>

      <div className="grid grid-cols-1 gap-4">

        {/* Highest Category */}
        <div className="flex justify-between items-center p-4 rounded-xl bg-linear-to-r from-yellow-500/10 to-yellow-700/10 border border-yellow-500/20">
          <span className="text-gray-300">
            Highest Spending Category
            <span className="block text-white font-semibold mt-1">
              {highestCategory || "N/A"}
            </span>
          </span>

          <span className="text-xl font-semibold text-yellow-400">
            ₹{highestAmount}
          </span>
        </div>

        {/* Balance */}
        <div className="flex justify-between items-center p-4 rounded-xl bg-linear-to-r from-blue-500/10 to-blue-700/10 border border-blue-500/20">
          <span className="text-gray-300">
            Current Balance
            <span className="block text-white font-semibold mt-1">
              Net Balance
            </span>
          </span>

          <span className={`text-xl font-semibold ${balance >= 0 ? "text-green-400" : "text-red-400"
            }`}>
            ₹{balance}
          </span>
        </div>

        {/* Total Expense */}
        <div className="flex justify-between items-center p-4 rounded-xl bg-linear-to-r from-red-500/10 to-red-700/10 border border-red-500/20">
          <span className="text-gray-300">
            Total Expenses
          </span>

          <span className="text-xl font-semibold text-red-400">
            ₹{totalExpense}
          </span>
        </div>

      </div>
    </div>
  );
};

export default Insights;