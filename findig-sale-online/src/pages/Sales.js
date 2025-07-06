import { useState, useEffect } from 'react';
import { 
  Plus, 
  Eye, 
  Edit,
  X,
  Calendar,
  Upload,
  FileText} from 'lucide-react';
import { getThemeClasses } from '../utils/themes';
import { mockSales, mockCustomers } from '../data/mockData';

const Sales = ({ currentTheme}) => {
  const [showSaleModal, setShowSaleModal] = useState(false);
  
  // New Sale Modal Data
  const [newSaleData, setNewSaleData] = useState({
    saleNumber: '',
    date: new Date().toISOString().split('T')[0],
    barcode: '',
    productName: '',
    stock: 'A1',
    qty: 0,
    branch: '001'
  });

  // Reset new sale form
  const resetNewSaleForm = () => {
    setNewSaleData({
      saleNumber: '',
      date: new Date().toISOString().split('T')[0],
      barcode: '',
      productName: '',
      stock: '',
      qty: 0,
      branch: ''
    });
  };

  // Handle new sale form submission
  const handleNewSaleSubmit = () => {
    if (!newSaleData.saleNumber) {
      alert('กรุณาระบุข้อมูลเลขที่ใบเสร็จ');
      return;
    }

    console.log(newSaleData)
    
    // Simulate saving to database
    alert(`บันทึกใบขายใหม่เรียบร้อย!\n` +
          `เลขที่: ${newSaleData.saleNumber}\n` +
          `วันที่: ${newSaleData.date}\n` +
          `รหัสบาร์โค้ด: ${newSaleData?.barcode}\n` +
          `ชื่อสินค้า: ${newSaleData?.productName}\n` +
          `คลังสินค้า: ${newSaleData?.stock}\n` +
          `จำนวน: ${newSaleData?.qty}\n` +
          `สาขาทำรายการ: ${newSaleData?.branch}\n`);
    
    // Close modal and reset form
    setShowSaleModal(false);
    resetNewSaleForm();
  };

  // Keyboard shortcuts for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showSaleModal) {
        if (e.key === 'Escape') {
          setShowSaleModal(false);
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          if (newSaleData.customerId) {
            handleNewSaleSubmit();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSaleModal, newSaleData.customerId]);

  // Auto-generate sale number when modal opens
  useEffect(() => {
    if (showSaleModal && !newSaleData.saleNumber) {
      setNewSaleData(prev => ({
        ...prev
      }));
    }
  }, [showSaleModal]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>เมนูบันทึกการขาย</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className={`mt-4 sm:mt-0 text-white px-4 py-2 rounded-lg font-medium bg-green-500 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center`}>
            <Upload className="w-4 h-4 mr-2" />
            POST ตัดสต๊อก
          </button>
          <button 
            onClick={() => {
              resetNewSaleForm();
              setShowSaleModal(true);
            }}
            className={`mt-4 sm:mt-0 text-white px-4 py-2 rounded-lg font-medium ${getThemeClasses('primaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} flex items-center`}>
            <Plus className="w-4 h-4 mr-2" />
            เพิ่มข้อมูล
          </button>
        </div>
      </div>

      {/* Sales History */}
      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)}`}>
        <div className={`p-6 border-b ${getThemeClasses('cardBorder', currentTheme)}`}>
          <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>ข้อมูลบันทึกข้อมูลการขาย</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={getThemeClasses('tableHeader', currentTheme)}>
              <tr>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  เลขที่ใบเสร็จ
                </th>
                <th className={`px-6 py-3 text-center text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  วันที่
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  จำนวน
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  รหัสบาร์โค้ด
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  ชื่อสินค้า
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  คลังสินค้า
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  สาขา
                </th>
                <th className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                  สถานะ POST
                </th>
              </tr>
            </thead>
            <tbody className={`${getThemeClasses('cardBg', currentTheme)} divide-y ${getThemeClasses('tableBorder', currentTheme)}`}>
              {mockSales.map((sale) => (
                <tr key={sale.id} className={getThemeClasses('tableRow', currentTheme)}>
                  <td className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {sale.saleNumber}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {sale.date}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                    {sale.items}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {sale.productCode}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {sale.productName}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {sale.stock}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {sale.branch}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {sale.post}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium`}>
                    <button className={`${getThemeClasses('textSecondary', currentTheme)} hover:${getThemeClasses('textPrimary', currentTheme)} mr-3`}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className={`${getThemeClasses('textMuted', currentTheme)} hover:${getThemeClasses('textSecondary', currentTheme)}`}>
                      <Edit className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Sale Modal */}
      {showSaleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div 
            className={`${getThemeClasses('cardBg', currentTheme)} rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto ${getThemeClasses('transition', currentTheme)} transform animate-scale-in`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className={`sticky top-0 ${getThemeClasses('cardBg', currentTheme)} p-6 border-b ${getThemeClasses('cardBorder', currentTheme)} rounded-t-xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getThemeClasses('primaryBtn', currentTheme).includes('gradient') ? getThemeClasses('primaryBtn', currentTheme).split(' ').find(c => c.includes('gradient')) : `from-${currentTheme === 'dark' ? 'blue-500' : 'blue-400'} to-${currentTheme === 'dark' ? 'blue-600' : 'blue-600'}`} rounded-lg flex items-center justify-center`}>
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
                      เพิ่มข้อมูลการขาย
                    </h3>
                    <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                      กรอกข้อมูลการขายใหม่
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSaleModal(false)}
                  className={`p-2 rounded-lg ${getThemeClasses('sidebarHover', currentTheme)} ${getThemeClasses('transition', currentTheme)} ${getThemeClasses('textMuted', currentTheme)} hover:${getThemeClasses('textSecondary', currentTheme)}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Sale Info Section */}
              <div className={`p-4 rounded-lg ${currentTheme === 'dark' ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'} border ${currentTheme === 'dark' ? 'border-blue-700' : 'border-blue-200'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                      <FileText className="w-4 h-4 inline mr-2" />
                      เลขที่ใบเสร็จ
                    </label>
                    <input
                      type="text"
                      value={newSaleData.saleNumber}
                      onChange={(e) => setNewSaleData({...newSaleData, saleNumber: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                      placeholder=""
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                      <Calendar className="w-4 h-4 inline mr-2" />
                      วันที่
                    </label>
                    <input
                      type="date"
                      value={newSaleData.date}
                      onChange={(e) => setNewSaleData({...newSaleData, date: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                    />
                  </div>
                </div>
              </div>

              {/* Customer Info Display */}
              {newSaleData.customerId && (
                <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
                  {(() => {
                    const selectedCustomer = mockCustomers.find(c => c.id === parseInt(newSaleData.customerId));
                    return selectedCustomer ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className={`text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                            {selectedCustomer.name}
                          </p>
                          <p className={`text-xs ${getThemeClasses('textSecondary', currentTheme)}`}>
                            รหัส: {selectedCustomer.code}
                          </p>
                        </div>
                        <div>
                          <p className={`text-xs ${getThemeClasses('textSecondary', currentTheme)}`}>
                            โทร: {selectedCustomer.phone}
                          </p>
                          <p className={`text-xs ${getThemeClasses('textSecondary', currentTheme)}`}>
                            อีเมล: {selectedCustomer.email}
                          </p>
                        </div>
                      </div>
                    ) : null;
                  })()}
                </div>
              )}

              {/* Product Detail */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                    รหัสบาร์โค้ด
                  </label>
                  <input
                    type="text"
                    value={newSaleData.barcode}
                    onChange={(e) => setNewSaleData({...newSaleData, barcode: e.target.value || ""})}
                    className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                    placeholder=""
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                    ขื่อสินค้า
                  </label>
                  <input
                    type="text"
                    value={newSaleData.productName}
                    onChange={(e) => setNewSaleData({...newSaleData, productName: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                    placeholder=""
                  />
                </div>
              </div>
              {/* Payment and Discount */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Stock */}
                <div>
                  <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                    คลังสินค้า
                  </label>
                  <select
                    value={newSaleData.stock}
                    onChange={(e) => setNewSaleData({...newSaleData, stock: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                  >
                    <option value=""></option>
                    <option value="A1">A1</option>
                  </select>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                    จำนวน
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newSaleData.qty}
                    onChange={(e) => setNewSaleData({...newSaleData, qty: parseFloat(e.target.value)})}
                    className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Branch */}
              <div>
                <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                  รหัสสาขา
                </label>
                <select
                  value={newSaleData.branch}
                  onChange={(e) => setNewSaleData({...newSaleData, branch: e.target.value})}
                  className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                >
                  <option value=""></option>
                  <option value="001">001 - สาขาทดสอบระบบ</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`sticky bottom-0 ${getThemeClasses('cardBg', currentTheme)} p-6 border-t ${getThemeClasses('cardBorder', currentTheme)} rounded-b-xl`}>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => setShowSaleModal(false)}
                  className={`px-6 py-2 border rounded-lg font-medium ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-md flex items-center justify-center`}
                >
                  <X className="w-4 h-4 mr-2" />
                  ยกเลิก
                </button>
                <button
                  onClick={() => {
                    resetNewSaleForm();
                  }}
                  className={`mt-4 sm:mt-0 px-4 py-2 rounded-lg font-medium ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-md flex items-center justify-center`}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  ล้างข้อมูล
                </button>
                <button
                  onClick={handleNewSaleSubmit}
                  disabled={!newSaleData.saleNumber}
                  className={`px-6 py-2 text-white rounded-lg font-medium ${getThemeClasses('primaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-lg transform hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  ยืนยันข้อมูล
                </button>
              </div>
              
              {/* Quick Tips */}
              <div className={`mt-4 text-xs ${getThemeClasses('textMuted', currentTheme)} text-center p-2 rounded ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-center space-x-4">
                  <span>💡 เคล็ดลับ:</span>
                  <span>กด Ctrl+Enter เพื่อบันทึกเร็ว</span>
                  <span>•</span>
                  <span>กด Esc เพื่อยกเลิก</span>
                </div>
              </div>
            </div>
          </div>

          {/* Click outside to close */}
          <div 
            className="absolute inset-0 -z-10"
            onClick={() => setShowSaleModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default Sales;