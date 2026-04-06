import { useState } from "react";
import { useTransactionStore } from "../store/useTransactionStore";
import type { Transaction } from "../types";
import toast from "react-hot-toast";
import { IoIosArrowDown } from "react-icons/io";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddTransaction = () => {

    const CATEGORY_COLORS = [
        "#f87171", // red
        "#fb923c", // orange
        "#facc15", // yellow
        "#4ade80", // green
        "#60a5fa", // blue
        "#a78bfa", // purple
        "#f472b6", // pink
    ];

    const { addTransaction, categories, addCategory } = useTransactionStore();

    const defaultTransaction: Transaction = {
        id: 0,
        amount: 0,
        category: "",
        type: "expense",
        date: new Date().toISOString().split("T")[0],
    };

    const [newTransaction, setNewTransaction] = useState<Transaction>(defaultTransaction);
    const [showModal, setShowModal] = useState(false);
    const [newCatName, setNewCatName] = useState("");
    const [newCatColor, setNewCatColor] = useState(CATEGORY_COLORS[0]);
    const [openType, setOpenType] = useState(false);
    const [openCategory, setOpenCategory] = useState(false);

    const handleAdd = () => {
        if (!newTransaction.amount || !newTransaction.category || !newTransaction.date) {
            toast.error('Please fill in all fields',
                {
                    style: {
                        borderRadius: '10px',
                        background: '#333',
                        color: '#fff',
                    },
                }
            );
            return;
        }

        addTransaction({
            ...newTransaction,
            id: Date.now(),
        });

        setNewTransaction(defaultTransaction);
        toast.success('Transaction added successfully!',
            {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            }
        );
    };

    // const handleCategoryChange = (value: string) => {
    //     if (value === "add_new") {
    //         setShowModal(true);
    //     } else {
    //         setNewTransaction({
    //             ...newTransaction,
    //             category: value,
    //         });
    //     }
    // };

    return (
        <div className="mb-6 p-5 rounded-xl border border-(--border-color) bg-(--bg-card) shadow-lg">
            <h3 className="text-2xl text-white font-semibold mb-3 text-center">Add Transaction</h3>

            <div className="w-3/4 mx-auto flex flex-wrap justify-center items-center gap-2">
                <div className="flex items-center w-40 bg-(--bg-main) border border-(--border-color) rounded-lg focus-within:ring-2 focus-within:ring-blue-500">

                    <span className="px-2 text-gray-400">₹</span>

                    <input
                        type="text"
                        placeholder="Amount"
                        value={newTransaction.amount}
                        onChange={(e) =>
                            setNewTransaction({
                                ...newTransaction,
                                amount: Number(e.target.value),
                            })
                        }
                        className="w-full bg-transparent text-white py-2 pr-3 outline-none"
                    />
                </div>

                <div className="relative w-48">
                    <button
                        onClick={() => setOpenCategory(!openCategory)}
                        className="w-full bg-(--bg-main) border border-(--border-color) text-white rounded-lg px-4 py-2 flex justify-between items-center"
                    >
                        <span>
                            {newTransaction.category || "Select category"}
                        </span>
                        <IoIosArrowDown
                            className={`transition-transform ${openCategory ? "rotate-180" : ""
                                }`}
                        />
                    </button>

                    {openCategory && (
                        <div className="absolute mt-2 w-full bg-(--bg-card) border border-(--border-color) rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto text-white">

                            {/* Categories */}
                            {categories
                                .filter((c) => c.type === newTransaction.type)
                                .map((cat) => (
                                    <div
                                        key={cat.name}
                                        onClick={() => {
                                            setNewTransaction({
                                                ...newTransaction,
                                                category: cat.name,
                                            });
                                            setOpenCategory(false);
                                        }}
                                        className="px-4 py-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2"
                                    >
                                        {/* Color dot */}
                                        <span
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: cat.color }}
                                        />
                                        {cat.name}
                                    </div>
                                ))}

                            {/* Add new */}
                            <div
                                onClick={() => {
                                    setShowModal(true);
                                    setOpenCategory(false);
                                }}
                                className="px-4 py-2 hover:bg-gray-700 cursor-pointer text-blue-400"
                            >
                                + Add New Category
                            </div>
                        </div>
                    )}
                </div>


                {/* Choose Type */}
                <div className="relative w-40">
                    <button
                        onClick={() => setOpenType(!openType)}
                        className="w-full bg-(--bg-main) border border-(--border-color) text-white rounded-lg px-4 py-2 flex justify-between items-center"
                    >
                        <span className="capitalize">{newTransaction.type}</span>
                        <IoIosArrowDown className={`transition-transform ${openType ? "rotate-180" : ""}`} />
                    </button>

                    {openType && (
                        <div className="absolute mt-2 w-full bg-(--bg-card) border border-(--border-color) rounded-lg shadow-lg z-50 text-white">
                            {["income", "expense"].map((type) => (
                                <div
                                    key={type}
                                    onClick={() => {
                                        setNewTransaction({
                                            ...newTransaction,
                                            type: type as "income" | "expense",
                                            category: "",
                                        });
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

                <DatePicker
                    selected={newTransaction.date ? new Date(newTransaction.date) : null}
                    onChange={(date: Date | null) => {
                        if (date) {
                            setNewTransaction({
                                ...newTransaction,
                                date: date.toISOString().split("T")[0],
                            })
                        }

                    }
                    }
                    maxDate={new Date()}
                    placeholderText="Select date"
                    className="bg-(--bg-main) text-white border border-(--border-color) px-3 py-2 rounded-lg"
                />

                <button
                    onClick={handleAdd}
                    className="bg-blue-600 hover:bg-blue-500 hover:cursor-pointer text-white px-5 py-2 rounded-lg font-medium"
                >
                    Add
                </button>

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
                        <div className="bg-(--bg-card) p-5 rounded-xl border border-(--border-color) w-80">

                            <h4 className="text-lg font-semibold mb-3">Add Category</h4>

                            <input
                                placeholder="Category name"
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                className="w-full bg-(--bg-main) text-white border border-(--border-color) px-3 py-2 rounded-lg mb-3"
                            />

                            <div className="flex gap-2 mb-4 justify-center">
                                {CATEGORY_COLORS.map((color) => (
                                    <div
                                        key={color}
                                        onClick={() => setNewCatColor(color)}
                                        className={`w-6 h-6 rounded-full cursor-pointer border-2 transition-all duration-200 ${newCatColor === color ? "border-white scale-105" : "border-transparent"
                                            }`}
                                        style={{
                                            backgroundColor: color,
                                            boxShadow: newCatColor === color
                                                ? `0 0 8px 1px ${color}`
                                                : "none"
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-3 py-1 rounded bg-gray-600 hover:bg-gray-500 hover:cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={() => {
                                        const type = newTransaction.type.toLowerCase();

                                        addCategory({
                                            name: newCatName,
                                            color: type === "income" ? "#22c55e" : newCatColor,
                                            type: type as "income" | "expense",
                                        });

                                        setNewTransaction({
                                            ...newTransaction,
                                            category: newCatName,
                                        });

                                        setShowModal(false);
                                        setNewCatName("");
                                    }}
                                    className="px-3 py-1 rounded bg-blue-500 hover:bg-blue-400 hover:cursor-pointer"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddTransaction;