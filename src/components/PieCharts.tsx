import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Sector,
    ResponsiveContainer
} from "recharts";

import { useTransactionStore } from "../store/useTransactionStore";
import { useState } from "react";

const PieCharts = () => {
    const COLORS = [
        "#ef4444",
        "#f97316",
        "#f59e0b",
        "#3b82f6",
        "#6366f1",
        "#a855f7",
        "#ec4899",
        "#14b8a6",
    ];
    const { transactions } = useTransactionStore();

    const [activeIndex, setActiveIndex] = useState(-1);

    const onPieEnter = (_: unknown, index: number) => {
        setActiveIndex(index);
    };
    const onPieLeave = () => {
        setActiveIndex(-1);
    };

    // Pie Chart Data (Expense by category)
    const categoryMap: Record<string, number> = {};
    let totalIncome = 0;
    let totalExpense = 0;

    // Process transactions
    transactions.forEach((t) => {
        if (t.type.toLowerCase() === "income") {
            totalIncome += t.amount;
        } else {
            totalExpense += t.amount;
            categoryMap[t.category] =
                (categoryMap[t.category] || 0) + t.amount;
        }
    });

    const pieData = [
        {
            name: "Income",
            value: totalIncome,
        },
        ...Object.keys(categoryMap).map((key) => ({
            name: key,
            value: categoryMap[key],
        })),
    ];

    if (pieData.length === 0 || totalIncome === 0 && totalExpense === 0) {
        return (
            <div className="p-5 bg-(--bg-card) border border-(--border-color) rounded-2xl text-center text-gray-400">
                No data to display
            </div>
        );
    }

    return (
        <div className="p-5 bg-(--bg-card) border border-(--border-color) rounded-2xl shadow-lg">

            {/* Pie Chart */}
            <div className="p-4">

                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={pieData}
                            dataKey="value"
                            outerRadius={100}
                            innerRadius={70}
                            activeShape={renderActiveShape}
                            onMouseEnter={onPieEnter}
                            onMouseLeave={onPieLeave}
                            cornerRadius={6}
                            isAnimationActive={true}
                            animationDuration={500}

                            style={{ cursor: "pointer" }}
                        >
                            {pieData.map((entry, index) => (
                                <Cell
                                    key={index}
                                    fill={
                                        entry.name === "Income"
                                            ? "#22c55e"
                                            : COLORS[index % COLORS.length] || "#ccc"
                                    }
                                />
                            ))}
                        </Pie>
                        <text
                            x="50%"
                            y="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="#f1f5f9"
                            style={{ fontSize: "18px", fontWeight: "600" }}
                        >
                            ₹{totalIncome - totalExpense}
                        </text>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "#1e293b",
                                border: "none",
                                borderRadius: "8px",
                                color: "#fff"
                            }}
                            labelStyle={{ color: "#9ca3af" }}
                            itemStyle={{ color: "#f9fafb" }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
};

export default PieCharts;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const {
        cx,
        cy,
        innerRadius,
        outerRadius,
        midAngle,
        startAngle,
        endAngle,
        fill,
    } = props;

    const offset = 10;
    const x = cx + offset * Math.cos(-midAngle * RADIAN);
    const y = cy + offset * Math.sin(-midAngle * RADIAN);

    return (
        <g>
            <Sector
                cx={x}
                cy={y}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 5} // slight scale effect
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
        </g>
    );
};