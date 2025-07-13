import React from 'react';
import { Download, FileText, Package, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getThemeClasses } from '../utils/themes';
import { mockProducts, mockSalesData } from '../data/mockData';

const InventoryReport = ({ currentTheme }) => {
  const inventoryData = mockProducts.map(product => ({
    ...product,
    movement: Math.floor(Math.random() * 20) - 10, // สุ่มการเคลื่อนไหวสินค้า
    lastRestock: `${Math.floor(Math.random() * 30) + 1}/06/2024`,
    minStock: Math.floor(Math.random() * 10) + 5
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>รายงานสินค้าคงคลัง</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className={`text-white px-4 py-2 rounded-lg font-medium bg-green-500 hover:bg-green-600 transition-colors flex items-center`}>
            <Download className="w-4 h-4 mr-2" />
            ส่งออก Excel
          </button>
          <button className={`text-white px-4 py-2 rounded-lg font-medium ${getThemeClasses('primaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} flex items-center`}>
            <FileText className="w-4 h-4 mr-2" />
            พิมพ์รายงาน
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>สินค้าทั้งหมด</p>
              <p className={`text-3xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>{mockProducts.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>มูลค่าคงคลัง</p>
              <p className={`text-3xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
                ฿{mockProducts.reduce((sum, p) => sum + (p.price * p.stock), 0).toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>

        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>สินค้าใกล้หมด</p>
              <p className={`text-3xl font-bold text-red-600`}>
                {mockProducts.filter(p => p.stock <= 20).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white rotate-180" />
            </div>
          </div>
        </div>

        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>หมวดหมู่</p>
              <p className={`text-3xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
                {new Set(mockProducts.map(p => p.category)).size}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
        <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)} mb-4`}>การเคลื่อนไหวสินค้า (7 วันที่ผ่านมา)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockSalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" fill="#3B82F6" name="จำนวนออเดอร์" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)}`}>
        <div className={`p-6 border-b ${getThemeClasses('cardBorder', currentTheme)}`}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>รายละเอียดสินค้าคงคลัง</h3>
            <div className="mt-4 sm:mt-0 flex space-x-2">
              <select className={`px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)} text-sm`}>
                <option>ทุกหมวดหมู่</option>
                <option>อิเล็กทรอนิกส์</option>
                <option>เสื้อผ้า</option>
              </select>
              <select className={`px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)} text-sm`}>
                <option>ทุกสถานะ</option>
                <option>ปกติ</option>
                <option>ใกล้หมด</option>
                <option>หมด</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={getThemeClasses('tableHeader', currentTheme)}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  รหัสสินค้า
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  ชื่อสินค้า
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  คงเหลือ
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  ขั้นต่ำ
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  มูลค่า
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  การเคลื่อนไหว
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  วันที่เติมล่าสุด
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  สถานะ
                </th>
              </tr>
            </thead>
            <tbody className={`${getThemeClasses('cardBg', currentTheme)} divide-y ${getThemeClasses('tableBorder', currentTheme)}`}>
              {inventoryData.map((item) => (
                <tr key={item.id} className={getThemeClasses('tableRow', currentTheme)}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {item.code}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {item.name}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    <span className={`font-medium ${
                      item.stock <= item.minStock ? 'text-red-600' : getThemeClasses('textPrimary', currentTheme)
                    }`}>
                      {item.stock}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                    {item.minStock}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    ฿{(item.price * item.stock).toLocaleString()}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm`}>
                    <span className={`flex items-center ${
                      item.movement > 0 ? 'text-green-600' : 
                      item.movement < 0 ? 'text-red-600' : getThemeClasses('textSecondary', currentTheme)
                    }`}>
                      {item.movement > 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : item.movement < 0 ? (
                        <TrendingUp className="w-3 h-3 mr-1 rotate-180" />
                      ) : null}
                      {Math.abs(item.movement)}
                    </span>
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                    {item.lastRestock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.stock <= 0 
                        ? getThemeClasses('danger', currentTheme)
                        : item.stock <= item.minStock
                        ? getThemeClasses('warning', currentTheme)
                        : getThemeClasses('success', currentTheme)
                    }`}>
                      {item.stock <= 0 ? 'หมด' : 
                       item.stock <= item.minStock ? 'ใกล้หมด' : 'ปกติ'}
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

export default InventoryReport;
