import React from 'react';
import { Plus, Search, Users, TrendingUp, Download, Eye, Edit, Trash2 } from 'lucide-react';
import { getThemeClasses } from '../utils/themes';
import { mockCustomers } from '../data/mockData';

const Customers = ({ currentTheme, searchTerm, setSearchTerm }) => {
  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>จัดการลูกค้า</h1>
        <button className={`mt-4 sm:mt-0 text-white px-4 py-2 rounded-lg font-medium ${getThemeClasses('primaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} flex items-center`}>
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มลูกค้าใหม่
        </button>
      </div>

      {/* Filters */}
      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${getThemeClasses('textMuted', currentTheme)} w-4 h-4`} />
            <input
              type="text"
              placeholder="ค้นหาลูกค้า..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
            />
          </div>
          <select className={`px-4 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}>
            <option>ประเภทลูกค้า</option>
            <option>ลูกค้าทั่วไป</option>
            <option>ลูกค้าขายส่ง</option>
            <option>ลูกค้า VIP</option>
          </select>
          <button className={`flex items-center justify-center px-4 py-2 border rounded-lg ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)}`}>
            <Download className="w-4 h-4 mr-2" />
            ส่งออกข้อมูล
          </button>
        </div>
      </div>

      {/* Customer Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>ลูกค้าทั้งหมด</p>
              <p className={`text-3xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>{mockCustomers.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>ลูกค้าใหม่เดือนนี้</p>
              <p className={`text-3xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>12</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>ลูกค้า VIP</p>
              <p className={`text-3xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>1</p>
            </div>
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)}`}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={getThemeClasses('tableHeader', currentTheme)}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  รหัสลูกค้า
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  ชื่อ-นามสกุล
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  เบอร์โทร
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  อีเมล
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  ประเภท
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  การดำเนินการ
                </th>
              </tr>
            </thead>
            <tbody className={`${getThemeClasses('cardBg', currentTheme)} divide-y ${getThemeClasses('tableBorder', currentTheme)}`}>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className={getThemeClasses('tableRow', currentTheme)}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {customer.code}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {customer.name}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                    {customer.phone}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                    {customer.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      customer.type === 'vip' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : customer.type === 'wholesale'
                        ? 'bg-blue-100 text-blue-800'
                        : currentTheme === 'dark' 
                        ? 'bg-gray-700 text-gray-300'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {customer.type === 'vip' ? 'VIP' : customer.type === 'wholesale' ? 'ขายส่ง' : 'ทั่วไป'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className={`${getThemeClasses('textSecondary', currentTheme)} hover:${getThemeClasses('textPrimary', currentTheme)} mr-3`}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className={`${getThemeClasses('textMuted', currentTheme)} hover:${getThemeClasses('textSecondary', currentTheme)} mr-3`}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default Customers;