import { useTransactionStore } from '../store/useTransactionStore';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
} from "recharts";

const LineChartTransaction = () => {
    const { transactions } = useTransactionStore();
    const getChartData = () => {
        const parseDate = (d: string) => {
            const [day, month, year] = d.split("-");
            return new Date(`${year}-${month}-${day}`);
        };

        // Step 1: group by date
        const map: Record<string, number> = {};

        transactions.forEach((t) => {
            const amount =
                t.type.toLowerCase() === "expense" ? -t.amount : t.amount;

            if (!map[t.date]) {
                map[t.date] = 0;
            }

            map[t.date] += amount;
        });

        // Step 2: sort dates
        const sortedDates = Object.keys(map).sort(
            (a, b) => parseDate(a).getTime() - parseDate(b).getTime()
        );

        // Step 3: running balance
        let balance = 0;

        return sortedDates.map((date, index) => {
            balance += map[date];

            return {
                date,
                balance,
                index,
            };
        });
    };

    const data = getChartData();

    return (
        <div className="p-5 bg-(--bg-card) border border-(--border-color) rounded-2xl shadow-lg">

            <h2 className="text-2xl text-white font-semibold mb-4">Balance Trend</h2>

            <div className="w-full h-75">
                {data.length === 0 ? (
                    <p className="text-gray-400 text-center mt-10">
                        No data to show
                    </p>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>

                            <CartesianGrid stroke="#334155" strokeDasharray="3 3" />

                            <XAxis
                                dataKey="date"
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                                tickFormatter={(d) => {
                                    const [day, month] = d.split("-");
                                    return `${day}/${month}`;
                                }}
                            />

                            <YAxis
                                tick={{ fill: "#94a3b8", fontSize: 12 }}
                                tickFormatter={(value) => `₹${value}`}
                            />

                            <Tooltip content={<CustomTooltip />} />

                            <Line
                                type="monotone"
                                dataKey="balance"
                                stroke="#38bdf8"
                                strokeWidth={3}
                                isAnimationActive
                                animationDuration={800}
                                dot={false}
                                activeDot={{
                                    r: 6,
                                    strokeWidth: 2,
                                    fill: "#6366f1",
                                }}
                            />

                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}

export default LineChartTransaction;


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;

        return (
            <div
                className="bg-(--bg-card) border border-(--border-color) px-3 py-2 rounded-lg shadow-lg"
            >
                <p className="text-white font-semibold">₹ {data.balance}</p>
            </div>
        );
    }

    return null;
};