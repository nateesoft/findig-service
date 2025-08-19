
import { useState, useEffect } from 'react';
import moment from 'moment';

import { getThemeClasses } from '../utils/themes';
import { loadDraftSaleDashboard } from '../api/saleApi';
import { Modal } from '../components/Modals';

const Dashboard = ({ currentTheme }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [lastDraftSale, setLastDraftSale] = useState([])

  const initLoadLastDraftSale = async () => {
    try {
      const { data, error } = await loadDraftSaleDashboard()
      if(data) {
        setLastDraftSale(data)
      }else{
        setActiveModal({
          type: 'error',
          title: 'ไม่สามารถแสดงข้อมูลได้',
          message: error || 'กรุณาลองใหม่อีกครั้ง',
          actions: [
            {
              label: 'ตกลง',
              onClick: () => setActiveModal(null)
            }
          ]
        });
      }
    } catch (error) {
      setActiveModal({
        type: 'error',
        title: 'ไม่สามารถแสดงข้อมูลได้',
        message: error || 'กรุณาลองใหม่อีกครั้ง',
        actions: [
          {
            label: 'ตกลง',
            onClick: () => setActiveModal(null)
          }
        ]
      });
    }
  }
  
  useEffect(()=> {
    initLoadLastDraftSale()
  }, [])
  
  return (
  <div className={`space-y-6 min-h-screen pb-10 ${getThemeClasses('mainBg', currentTheme)}`}> 
      {/* Recent Sales */}
      <div className={`relative rounded-xl border ${getThemeClasses('cardBorder', currentTheme)} overflow-hidden ${getThemeClasses('cardBg', currentTheme)}`} style={{boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.10)'}}>
        <div className="relative">
          <div className={`p-6 border-b ${getThemeClasses('cardBorder', currentTheme)}`}> 
          <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>ข้อมูลบันทึกล่าสุด (10 รายการ)</h3>
        </div>
  <div className="overflow-x-auto relative">
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
                {lastDraftSale && lastDraftSale.length > 0 ? (
                  lastDraftSale.map((sale, index) => (
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">ไม่พบข้อมูล</td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
        </div>
      </div>

      {activeModal && (
        <Modal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          type={activeModal.type}
          title={activeModal.title}
          message={activeModal.message}
          confirmText={activeModal.confirmText}
          cancelText={activeModal.cancelText}
          showCancel={activeModal.showCancel}
          onConfirm={() => {
            setActiveModal(null)
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;