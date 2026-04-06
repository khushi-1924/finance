import { useState } from "react";
import type { Transaction, Role } from "../types";
import { formatDate } from "../helper/formatDate";
import { useTransactionStore } from "../store/useTransactionStore";
import { IoIosArrowDown } from "react-icons/io";

type Props = {
    role: Role;
}

const TransactionTable = ({ role }: Props) => {
    const {
        transactions,
        addTransaction,
        deleteTransaction,
        updateTransaction
    } = useTransactionStore();

    const defaultTransaction: Transaction = {
        id: 100,
        amount: 0,
        category: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
    };
    const [newTransaction, setNewTransaction] = useState(defaultTransaction);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState("all"); // all | income | expense
    const [sortBy, setSortBy] = useState("date"); // date | amount
    const [openType, setOpenType] = useState(false);
    const [openSort, setOpenSort] = useState(false);


    const handleSubmit = () => {
        if (editingId !== null) {
            updateTransaction({ ...newTransaction, id: editingId });
        } else {
            addTransaction({ ...newTransaction, id: Date.now() });
        }

        setNewTransaction(defaultTransaction);
        setEditingId(null);
        setShowForm(false);
    };

    const handleEdit = (transaction: Transaction) => {
        setNewTransaction(transaction);
        setEditingId(transaction.id);
        setShowForm(true);
    };

    const processedTransactions = transactions
        // Filter by type
        .filter((t) => {
            if (typeFilter === "all") return true;
            return t.type.toLowerCase() === typeFilter;
        })

        // Search by category
        .filter((t) =>
            t.category.toLowerCase().includes(search.toLowerCase())
        )

        // Sort
        .sort((a, b) => {
            if (sortBy === "amount") {
                return b.amount - a.amount;
            } else {
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            }
        });

    return (
        <div>
            <div className="flex flex-wrap gap-3 mb-5 items-center">

                {/* Search */}
                <input
                    type="text"
                    placeholder="Search category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-(--bg-main) text-white border border-(--border-color) px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* Filter */}
                <div className="relative w-40">
                    <button
                        onClick={() => setOpenType(!openType)}
                        className="w-full bg-(--bg-main) border border-(--border-color) text-white rounded-lg px-4 py-2 flex justify-between items-center"
                    >
                        <span className="capitalize">{typeFilter}</span>
                        <IoIosArrowDown className={`transition-transform ${openType ? "rotate-180" : ""}`} />
                    </button>

                    {openType && (
                        <div className="absolute mt-2 w-full bg-(--bg-card) border border-(--border-color) rounded-lg shadow-lg z-50">
                            {["all", "income", "expense"].map((type) => (
                                <div
                                    key={type}
                                    onClick={() => {
                                        setTypeFilter(type);
                                        setOpenType(false);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer capitalize"
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sort */}
                <div className="relative w-40">
                    <button
                        onClick={() => setOpenSort(!openSort)}
                        className="w-full bg-(--bg-main) border border-(--border-color) text-white rounded-lg px-4 py-2 flex justify-between items-center"
                    >
                        <span className="capitalize">{sortBy}</span>
                        <IoIosArrowDown className={`transition-transform ${openSort ? "rotate-180" : ""}`} />
                    </button>

                    {openSort && (
                        <div className="absolute mt-2 w-full bg-(--bg-card) border border-(--border-color) rounded-lg shadow-lg z-50">
                            {["date", "amount"].map((type) => (
                                <div
                                    key={type}
                                    onClick={() => {
                                        setSortBy(type);
                                        setOpenSort(false);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer capitalize"
                                >
                                    {type}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
            <div className="flex flex-row items-center justify-between px-5 mb-5">
                <h2 className="text-2xl font-semibold mb-4 text-white">Transaction Details</h2>
            </div>

            <div className="w-3/4 mx-auto bg-(--bg-card) border border-(--border-color) rounded-2xl shadow-lg p-4">
                <table className="table w-full text-left text-white">
                    <thead className="text-gray-400 text-sm uppercase border-b border-(--border-color)">
                        <tr className="border-b transition text-center">
                            <th className="py-2">Date</th>
                            <th className="py-2">Amount</th>
                            <th className="py-2">Category</th>
                            <th className="py-2">Type</th>
                            {role === "admin" && <th className="py-2">Actions</th>}
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-(--border-color) text-center">
                        {processedTransactions.map((t) => (
                            <tr key={t.id} className="hover:bg-[#1e293b] transition">
                                <td className="py-2">{formatDate(t.date)}</td>
                                <td className="py-2">
                                    <span className={`font-semibold ${t.type === "income" ? "text-green-400" : "text-red-400"
                                        }`}>
                                        ₹{t.amount}
                                    </span>
                                </td>

                                <td className="py-2">{t.category}</td>

                                <td className="capitalize py-2">{t.type}</td>

                                {role === "admin" && (
                                    <td className="py-2">
                                        <button
                                            onClick={() => handleEdit(t)}
                                            className="text-blue-400 hover:text-blue-300 mr-3"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() => deleteTransaction(t.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showForm && (
                <div className="mt-6 p-5 bg-(--bg-card) border border-(--border-color) rounded-xl">
                    <h3 className="text-lg font-semibold mb-4">
                        {editingId ? "Edit Transaction" : "Add Transaction"}
                    </h3>

                    <div className="flex flex-wrap gap-3 items-center">

                        {/* Amount */}
                        <div className="flex items-center bg-(--bg-main) border border-(--border-color) rounded-lg">
                            <span className="px-3 text-gray-400">₹</span>
                            <input
                                type="text"
                                value={newTransaction.amount}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/[^0-9]/g, "");
                                    setNewTransaction({
                                        ...newTransaction,
                                        amount: Number(value),
                                    });
                                }}
                                className="bg-transparent text-white py-2 pr-3 outline-none"
                            />
                        </div>

                        {/* Category */}
                        <input
                            type="text"
                            placeholder="Category"
                            value={newTransaction.category}
                            onChange={(e) =>
                                setNewTransaction({
                                    ...newTransaction,
                                    category: e.target.value,
                                })
                            }
                            className="bg-(--bg-main) text-white border border-(--border-color) px-3 py-2 rounded-lg"
                        />

                        {/* Type */}
                        <select
                            value={newTransaction.type}
                            onChange={(e) =>
                                setNewTransaction({
                                    ...newTransaction,
                                    type: e.target.value as "expense" | "income",
                                })
                            }
                            className="bg-(--bg-main) text-white border border-(--border-color) px-3 py-2 rounded-lg"
                        >
                            <option value="expense">Expense</option>
                            <option value="income">Income</option>
                        </select>

                        {/* Date */}
                        <input
                            type="date"
                            value={newTransaction.date}
                            onChange={(e) =>
                                setNewTransaction({
                                    ...newTransaction,
                                    date: e.target.value,
                                })
                            }
                            className="bg-(--bg-main) text-white border border-(--border-color) px-3 py-2 rounded-lg"
                        />

                        {/* Buttons */}
                        <button
                            onClick={handleSubmit}
                            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
                        >
                            {editingId ? "Update" : "Add"}
                        </button>

                        <button
                            onClick={() => {
                                setShowForm(false);
                                setEditingId(null);
                            }}
                            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {processedTransactions.length === 0 && (
                <p style={{ textAlign: "center", marginTop: "10px" }}>
                    No transactions found
                </p>
            )}
        </div>
    )
}

export default TransactionTable
