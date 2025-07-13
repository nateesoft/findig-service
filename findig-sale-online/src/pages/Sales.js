import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Eye, 
  Edit,
  X,
  Calendar,
  Upload,
  FileText,
  Trash2,
  ShoppingCart} from 'lucide-react';

import { getThemeClasses } from '../utils/themes';
import { mockSales } from '../data/mockData';

const Sales = ({ currentTheme}) => {
  const [showSaleModal, setShowSaleModal] = useState(false);
  
  const [saleHeader, setSaleHeader] = useState({
    saleNumber: '',
    date: new Date().toISOString().split('T')[0],
    branch: '001'
  });

  const [currentItem, setCurrentItem] = useState({
    barcode: '',
    productName: '',
    stock: 'A1',
    qty: 0
  });

  const [saleItems, setSaleItems] = useState([]);

  const resetNewSaleForm = () => {
    setSaleHeader({
      saleNumber: '',
      date: new Date().toISOString().split('T')[0],
      branch: '001'
    });
    setCurrentItem({
      barcode: '',
      productName: '',
      stock: 'A1',
      qty: 0
    });
    setSaleItems([]);
  };

  const resetCurrentItem = () => {
    setCurrentItem({
      barcode: '',
      productName: '',
      stock: 'A1',
      qty: 0
    });
  };

  const addItemToSale = () => {
    if (!currentItem.barcode || !currentItem.productName || currentItem.qty <= 0) {
      alert('กรุณากรอกข้อมูลสินค้าให้ครบถ้วน');
      return;
    }

    const newItem = {
      id: Date.now(), // simple ID generation
      ...currentItem,
      total: currentItem.qty // คำนวณยอดรวมได้ตามต้องการ
    };

    setSaleItems(prev => [...prev, newItem]);
    resetCurrentItem();
  };

  const removeItemFromSale = (itemId) => {
    setSaleItems(prev => prev.filter(item => item.id !== itemId));
  };

  const editSaleItem = (itemId) => {
    const itemToEdit = saleItems.find(item => item.id === itemId);
    if (itemToEdit) {
      setCurrentItem({
        barcode: itemToEdit.barcode,
        productName: itemToEdit.productName,
        stock: itemToEdit.stock,
        qty: itemToEdit.qty
      });
      removeItemFromSale(itemId);
    }
  };

  const handleNewSaleSubmit = () => {
    if (!saleHeader.saleNumber) {
      alert('กรุณาระบุข้อมูลเลขที่ใบเสร็จ');
      return;
    }

    if (saleItems.length === 0) {
      alert('กรุณาเพิ่มรายการสินค้าอย่างน้อย 1 รายการ');
      return;
    }

    const totalQty = saleItems.reduce((sum, item) => sum + item.qty, 0);
    
    alert(`บันทึกใบขายใหม่เรียบร้อย!\n` +
          `เลขที่: ${saleHeader.saleNumber}\n` +
          `วันที่: ${saleHeader.date}\n` +
          `สาขาทำรายการ: ${saleHeader.branch}\n` +
          `จำนวนรายการ: ${saleItems.length} รายการ\n` +
          `จำนวนสินค้ารวม: ${totalQty} ชิ้น`);
    
    setShowSaleModal(false);
    resetNewSaleForm();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showSaleModal) {
        if (e.key === 'Escape') {
          setShowSaleModal(false);
        } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
          if (currentItem.barcode && currentItem.productName && currentItem.qty > 0) {
            addItemToSale();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSaleModal, currentItem]);

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
                  วันที่ทำรายการ
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
                    {sale.empCode}
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

      {showSaleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div 
            className={`${getThemeClasses('cardBg', currentTheme)} rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto ${getThemeClasses('transition', currentTheme)} transform animate-scale-in`}
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
                      กรอกข้อมูลการขายใหม่ (รองรับหลายรายการ)
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

            <div className="p-6 space-y-6">
              <div className={`p-4 rounded-lg ${currentTheme === 'dark' ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'} border ${currentTheme === 'dark' ? 'border-blue-700' : 'border-blue-200'}`}>
                <h4 className={`text-lg font-semibold mb-4 ${getThemeClasses('textPrimary', currentTheme)}`}>
                  ข้อมูลหัวเอกสาร
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                      <FileText className="w-4 h-4 inline mr-2" />
                      เลขที่ใบเสร็จ
                    </label>
                    <input
                      type="text"
                      value={saleHeader.saleNumber}
                      onChange={(e) => setSaleHeader({...saleHeader, saleNumber: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                      placeholder="เลขที่เอกสาร"
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
                      value={saleHeader.date}
                      onChange={(e) => setSaleHeader({...saleHeader, date: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                      รหัสสาขา
                    </label>
                    <select
                      value={saleHeader.branch}
                      onChange={(e) => setSaleHeader({...saleHeader, branch: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                    >
                      <option value="">เลือกสาขา</option>
                      <option value="001">001 - สาขาทดสอบระบบ</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
                <h4 className={`text-lg font-semibold mb-4 ${getThemeClasses('textPrimary', currentTheme)} flex items-center`}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  เพิ่มรายการสินค้า
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                      รหัสบาร์โค้ด
                    </label>
                    <input
                      type="text"
                      value={currentItem.barcode}
                      onChange={(e) => setCurrentItem({...currentItem, barcode: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                      placeholder="สแกนหรือพิมพ์บาร์โค้ด"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                      ชื่อสินค้า
                    </label>
                    <input
                      type="text"
                      value={currentItem.productName}
                      onChange={(e) => setCurrentItem({...currentItem, productName: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                      placeholder="ชื่อสินค้า"
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                      คลังสินค้า
                    </label>
                    <select
                      value={currentItem.stock}
                      onChange={(e) => setCurrentItem({...currentItem, stock: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                    >
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                    </select>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                      จำนวน
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={currentItem.qty}
                        onChange={(e) => setCurrentItem({...currentItem, qty: parseFloat(e.target.value) || 0})}
                        className={`flex-1 px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
                        placeholder="0"
                      />
                      <button
                        onClick={addItemToSale}
                        disabled={!currentItem.barcode || !currentItem.productName || currentItem.qty <= 0}
                        className={`px-4 py-2 text-white rounded-lg font-medium ${getThemeClasses('primaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {saleItems.length > 0 && (
                <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
                  <h4 className={`text-lg font-semibold mb-4 ${getThemeClasses('textPrimary', currentTheme)}`}>
                    รายการสินค้า ({saleItems.length} รายการ)
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className={getThemeClasses('tableHeader', currentTheme)}>
                        <tr>
                          <th className={`px-4 py-2 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                            รหัสบาร์โค้ด
                          </th>
                          <th className={`px-4 py-2 text-left text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                            ชื่อสินค้า
                          </th>
                          <th className={`px-4 py-2 text-center text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                            คลัง
                          </th>
                          <th className={`px-4 py-2 text-right text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                            จำนวน
                          </th>
                          <th className={`px-4 py-2 text-center text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} uppercase tracking-wider`}>
                            จัดการ
                          </th>
                        </tr>
                      </thead>
                      <tbody className={`${getThemeClasses('cardBg', currentTheme)} divide-y ${getThemeClasses('tableBorder', currentTheme)}`}>
                        {saleItems.map((item, index) => (
                          <tr key={item.id} className={getThemeClasses('tableRow', currentTheme)}>
                            <td className={`px-4 py-3 text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                              {item.barcode}
                            </td>
                            <td className={`px-4 py-3 text-sm ${getThemeClasses('textPrimary', currentTheme)}`}>
                              {item.productName}
                            </td>
                            <td className={`px-4 py-3 text-center text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                              {item.stock}
                            </td>
                            <td className={`px-4 py-3 text-right text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                              {item.qty}
                            </td>
                            <td className={`px-4 py-3 text-center text-sm`}>
                              <div className="flex justify-center space-x-2">
                                <button
                                  onClick={() => editSaleItem(item.id)}
                                  className={`p-1 rounded ${getThemeClasses('textSecondary', currentTheme)} hover:${getThemeClasses('textPrimary', currentTheme)} ${getThemeClasses('transition', currentTheme)}`}
                                  title="แก้ไข"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => removeItemFromSale(item.id)}
                                  className={`p-1 rounded text-red-500 hover:text-red-700 ${getThemeClasses('transition', currentTheme)}`}
                                  title="ลบ"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className={`mt-4 p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border-t ${getThemeClasses('cardBorder', currentTheme)}`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>
                        สรุปรายการ
                      </span>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
                          รวม {saleItems.reduce((sum, item) => sum + item.qty, 0)} ชิ้น
                        </div>
                        <div className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                          {saleItems.length} รายการ
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

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
                  disabled={!saleHeader.saleNumber || saleItems.length === 0}
                  className={`px-6 py-2 text-white rounded-lg font-medium ${getThemeClasses('primaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-lg transform hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  ยืนยันข้อมูล ({saleItems.length} รายการ)
                </button>
              </div>
              
              <div className={`mt-4 text-xs ${getThemeClasses('textMuted', currentTheme)} text-center p-2 rounded ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex items-center justify-center space-x-4">
                  <span>💡 เคล็ดลับ:</span>
                  <span>กด Ctrl+Enter เพื่อเพิ่มรายการเร็ว</span>
                  <span>•</span>
                  <span>กด Esc เพื่อยกเลิก</span>
                </div>
              </div>
            </div>
          </div>

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