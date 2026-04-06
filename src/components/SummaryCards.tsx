import { useTransactionStore } from "../store/useTransactionStore";

const SummaryCards = () => {
  const { transactions } = useTransactionStore();
  
  const income = transactions
  .filter(t => t.type === "income")
  .reduce((sum, t) => sum + t.amount, 0);

const expenses = transactions
  .filter(t => t.type === "expense")
  .reduce((sum, t) => sum + t.amount, 0);

const balance = income - expenses;

return (
    <div className="mt-4 p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* Balance */}
      <div className="p-5 rounded-2xl bg-linear-to-br from-blue-300 to-blue-100 shadow-md">
        <h2 className="text-sm text-gray-600">Total Balance</h2>
        <p className="text-3xl font-semibold text-gray-800">₹{balance.toLocaleString("en-IN")}</p>
      </div>

      {/* Income */}
      <div className="p-5 rounded-2xl bg-linear-to-br from-green-300 to-green-100 shadow-md">
        <h2 className="text-sm text-gray-600">Income</h2>
        <p className="text-3xl font-semibold text-gray-800">₹{income.toLocaleString("en-IN")}</p>
      </div>

      {/* Expenses */}
      <div className="p-5 rounded-2xl bg-linear-to-br from-red-300 to-red-100 shadow-md">
        <h2 className="text-sm text-gray-600">Expenses</h2>
        <p className="text-3xl font-semibold text-gray-800">₹{expenses.toLocaleString("en-IN")}</p>
      </div>

    </div>
  );
}

export default SummaryCards