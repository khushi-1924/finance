import TransactionTable from './TransactionTable'
import type { Role } from "../types";
import Charts from './PieCharts';
import LineChartTransaction from './LineChartTransaction';
import Insights from './Insights';

type Props = {
  role: Role;
}

const TransactionBlock = ({ role }: Props) => {
  return (
    <div className="space-y-6">

      {/* Top Section */}
      <div className="w-full p-5 flex flex-col items-center lg:flex-row gap-6 bg-(--bg-card) border border-(--border-color) rounded-2xl shadow-lg">

        {/* Table */}
        <div className="w-full lg:w-2/3">
          <TransactionTable role={role} />
        </div>

        {/* Pie Chart */}
        <div className="w-full lg:w-1/3">
          <Charts />
        </div>

      </div>

      {/* Line Chart */}
      <div className="p-5 bg-(--bg-card) border border-(--border-color) rounded-2xl shadow-lg">
        <LineChartTransaction />
      </div>

      {/* Insights */}
      <div className="p-5 bg-(--bg-card) border border-(--border-color) rounded-2xl shadow-lg">
        <Insights />
      </div>

    </div>
  );
};

export default TransactionBlock
