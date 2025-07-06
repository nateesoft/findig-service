import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { getThemeClasses } from '../utils/themes';
import { mockSalesData, mockProducts } from '../data/mockData';

const Reports = ({ currentTheme }) => {
  const [reportType, setReportType] = useState('sales');
  const [dateRange, setDateRange] = useState('thisMonth');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>รายงาน</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className={`text-white px-4 py-2 rounded-lg font-medium bg-green-500 hover:bg-green-600 transition-colors flex items-center`}>
            <Download className="w-4 h-4 mr-2" />
            ส่งออก Excel
          </button>
          <button className={`text-white px-4 py-2 rounded-lg font-medium bg-red-500 hover:bg-red-600 transition-colors flex items-center`}>
            <FileText className="w-4 h-4 mr-2" />
            ส่งออก PDF
          </button>
        </div>
      </div>

      {/* Report Filters */}
      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
              ประเภทรายงาน
            </label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            >
              <option value="sales">รายงานการขาย</option>
              <option value="products">รายงานสินค้า</option>
              <option value="customers">รายงานลูกค้า</option>
              <option value="inventory">รายงานสต็อก</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
              ช่วงเวลา
            </label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            >
              <option value="today">วันนี้</option>
              <option value="thisWeek">สัปดาห์นี้</option>
              <option value="thisMonth">เดือนนี้</option>
              <option value="thisYear">ปีนี้</option>
              <option value="custom">กำหนดเอง</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
              วันที่เริ่มต้น
            </label>
            <input
              type="date"
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            />
          </div>
          <div>
            <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
              วันที่สิ้นสุด
            </label>
            <input
              type="date"
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            />
          </div>
        </div>
      </div>

      {/* Sales Report */}
      {reportType === 'sales' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
              <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)} mb-4`}>ยอดขายรายวัน</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={mockSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`฿${value.toLocaleString()}`, 'ยอดขาย']} />
                  <Bar dataKey="revenue" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
              <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)} mb-4`}>จำนวนออเดอร์รายวัน</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} ออเดอร์`, 'จำนวน']} />
                  <Line type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)}`}>
            <div className={`p-6 border-b ${getThemeClasses('cardBorder', currentTheme)}`}>
              <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>สินค้าขายดี Top 10</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={getThemeClasses('tableHeader', currentTheme)}>
                  <tr>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                      อันดับ
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                      ชื่อสินค้า
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                      จำนวนขาย
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                      ยอดขาย
                    </th>
                    <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                      กำไร
                    </th>
                  </tr>
                </thead>
                <tbody className={`${getThemeClasses('cardBg', currentTheme)} divide-y ${getThemeClasses('tableBorder', currentTheme)}`}>
                  {mockProducts.slice(0, 5).map((product, index) => (
                    <tr key={product.id} className={getThemeClasses('tableRow', currentTheme)}>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                        {index + 1}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                        {product.name}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                        {Math.floor(Math.random() * 50) + 10} ชิ้น
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                        ฿{(product.price * (Math.floor(Math.random() * 50) + 10)).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        ฿{((product.price * 0.3) * (Math.floor(Math.random() * 50) + 10)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;