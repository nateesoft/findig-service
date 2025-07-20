
import { useState, useEffect } from 'react';
import moment from 'moment';

import { getThemeClasses } from '../utils/themes';
import { loadDraftSaleDashboard } from '../api/saleApi';

const Dashboard = ({ currentTheme }) => {
  const [lastDraftSale, setLastDraftSale] = useState([])

  const initLoadLastDraftSale = async () => {
    try {
      const { data, error } = await loadDraftSaleDashboard()
      if(data) {
        setLastDraftSale(data)
      }else{
        alert(error || 'ไม่สามารถโหลดข้อมูลได้')
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
    }
  }
  
  useEffect(()=> {
    initLoadLastDraftSale()
  }, [])
  
  return (
    <div className="space-y-6">
      {/* Recent Sales */}
      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)}`}>
        <div className={`p-6 border-b ${getThemeClasses('cardBorder', currentTheme)}`}>
          <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>ข้อมูลบันทึกล่าสุด (10 รายการ)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={getThemeClasses('tableHeader', currentTheme)}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  เลขที่ใบเสร็จ
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  วันที่สร้างเอกสาร
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  จำนวนสินค้า
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  พนักงานทำรายการ
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  สาขา
                </th>
              </tr>
            </thead>
            <tbody className={`${getThemeClasses('cardBg', currentTheme)} divide-y ${getThemeClasses('tableBorder', currentTheme)}`}>
              {lastDraftSale && lastDraftSale.map((sale, index) => (
                <tr key={sale.billno} className={getThemeClasses('tableRow', currentTheme)}>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {sale.billno}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {moment(sale.document_date).format("DD/MM/YYYY HH:mm:ss")}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                    {sale.total_item}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {sale.emp_code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {sale.branch_code}
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