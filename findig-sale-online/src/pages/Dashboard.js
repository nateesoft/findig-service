import React from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Eye 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

import { getThemeClasses, themes } from '../utils/themes';
import { mockSalesData, mockProducts, mockSales, categoryData } from '../data/mockData';

const Dashboard = ({ currentTheme }) => {
  const totalRevenue = mockSalesData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = mockSalesData.reduce((sum, item) => sum + item.orders, 0);
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>Dashboard</h1>
        <div className="mt-4 sm:mt-0">
          <select className={`px-4 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}>
            <option>ช่วงเวลา: 6 เดือนที่ผ่านมา</option>
            <option>เดือนนี้</option>
            <option>ปีนี้</option>
          </select>
        </div>
      </div>

      {/* Recent Sales */}
      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)}`}>
        <div className={`p-6 border-b ${getThemeClasses('cardBorder', currentTheme)}`}>
          <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>ข้อมูลบันทึกล่าสุด</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={getThemeClasses('tableHeader', currentTheme)}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  เลขที่ใบขาย
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  ลูกค้า
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  วันที่
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  ยอดรวม
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  สถานะ
                </th>
              </tr>
            </thead>
            <tbody className={`${getThemeClasses('cardBg', currentTheme)} divide-y ${getThemeClasses('tableBorder', currentTheme)}`}>
              {mockSales.slice(0, 5).map((sale) => (
                <tr key={sale.id} className={getThemeClasses('tableRow', currentTheme)}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {sale.saleNumber}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {sale.customer}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                    {sale.date}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    ฿{sale.total.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      sale.status === 'paid' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {sale.status === 'paid' ? 'ชำระแล้ว' : 'รอชำระ'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;