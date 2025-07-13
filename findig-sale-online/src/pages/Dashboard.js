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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>ยอดขายรวม</p>
              <p className={`text-3xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
                ฿{totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12.5%
              </p>
            </div>
            <div className={`w-12 h-12 bg-${themes[currentTheme].accent} rounded-lg flex items-center justify-center`}>
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>จำนวนออเดอร์</p>
              <p className={`text-3xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>{totalOrders}</p>
              <p className="text-sm text-green-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                +8.2%
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>ค่าเฉลี่ยต่อออเดอร์</p>
              <p className={`text-3xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
                ฿{Math.round(avgOrderValue).toLocaleString()}
              </p>
              <p className="text-sm text-red-600 flex items-center mt-1">
                <TrendingUp className="w-4 h-4 mr-1 rotate-180" />
                -2.1%
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>สินค้าคงเหลือ</p>
              <p className={`text-3xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
                {mockProducts.reduce((sum, p) => sum + p.stock, 0)}
              </p>
              <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)} flex items-center mt-1`}>
                <Package className="w-4 h-4 mr-1" />
                {mockProducts.length} รายการ
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
          <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)} mb-4`}>ยอดขายรายเดือน</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`฿${value.toLocaleString()}`, 'ยอดขาย']} />
              <Line type="monotone" dataKey="revenue" stroke={`#${themes[currentTheme].accent.replace('-', '')}`} strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
          <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)} mb-4`}>สัดส่วนตามหมวดหมู่</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({name, value}) => `${name}: ${value}%`}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Sales */}
      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)}`}>
        <div className={`p-6 border-b ${getThemeClasses('cardBorder', currentTheme)}`}>
          <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>ยอดขายล่าสุด</h3>
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