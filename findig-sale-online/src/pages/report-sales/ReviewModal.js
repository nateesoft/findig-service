import { 
  Eye, 
  X,
  ShoppingCart} from 'lucide-react';
import moment from 'moment';

const ReviewModal = ({
    getThemeClasses,
    currentTheme,
    currentSaleData,
    setShowReviewModal
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div 
            className={`${getThemeClasses('cardBg', currentTheme)} rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${getThemeClasses('transition', currentTheme)} transform animate-scale-in`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Review Modal Header */}
            <div className={`sticky top-0 ${getThemeClasses('cardBg', currentTheme)} p-6 border-b ${getThemeClasses('cardBorder', currentTheme)} rounded-t-xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center`}>
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
                      รายละเอียดการขาย
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className={`p-2 rounded-lg ${getThemeClasses('sidebarHover', currentTheme)} ${getThemeClasses('transition', currentTheme)} ${getThemeClasses('textMuted', currentTheme)} hover:${getThemeClasses('textSecondary', currentTheme)}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* ข้อมูลหัวเอกสาร */}
              <div className={`p-4 rounded-lg ${currentTheme === 'dark' ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'} border ${currentTheme === 'dark' ? 'border-blue-700' : 'border-blue-200'}`}>
                <h4 className={`text-lg font-semibold mb-4 ${getThemeClasses('textPrimary', currentTheme)}`}>
                  ข้อมูลหัวเอกสาร
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-1`}>
                      เลขที่ใบเสร็จ
                    </label>
                    <p className={`text-sm ${getThemeClasses('textPrimary', currentTheme)} font-medium`}>
                      {currentSaleData.billNo}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-1`}>
                      วันที่สร้างเอกสาร
                    </label>
                    <p className={`text-sm ${getThemeClasses('textPrimary', currentTheme)} font-medium`}>
                      {moment(currentSaleData.documentDate).format('DD/MM/YYYY HH:mm:ss')}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-1`}>
                      สาขา
                    </label>
                    <p className={`text-sm ${getThemeClasses('textPrimary', currentTheme)} font-medium`}>
                      {currentSaleData.branchCode}
                    </p>
                  </div>
                  <div>
                    <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-1`}>
                      พนักงาน
                    </label>
                    <p className={`text-sm ${getThemeClasses('textPrimary', currentTheme)} font-medium`}>
                      {currentSaleData.empCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* รายการสินค้า */}
              <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
                <h4 className={`text-lg font-semibold mb-4 ${getThemeClasses('textPrimary', currentTheme)} flex items-center`}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  รายการสินค้า ({currentSaleData.items?.length || 0} รายการ)
                </h4>
                
                {currentSaleData.items && currentSaleData.items.length > 0 ? (
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
                        </tr>
                      </thead>
                      <tbody className={`${getThemeClasses('cardBg', currentTheme)} divide-y ${getThemeClasses('tableBorder', currentTheme)}`}>
                        {currentSaleData.items.map((item, index) => (
                          <tr key={index} className={getThemeClasses('tableRow', currentTheme)}>
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className={`text-center py-4 ${getThemeClasses('textMuted', currentTheme)}`}>
                    ไม่มีรายการสินค้า
                  </p>
                )}

                {/* สรุปรายการ */}
                {currentSaleData.items && currentSaleData.items.length > 0 && (
                  <div className={`mt-4 p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'} border-t ${getThemeClasses('cardBorder', currentTheme)}`}>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>
                        สรุปรายการ
                      </span>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
                          รวม {currentSaleData.items.reduce((sum, item) => sum + (item.qty || 0), 0)} ชิ้น
                        </div>
                        <div className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                          {currentSaleData.items.length} รายการ
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className={`sticky bottom-0 ${getThemeClasses('cardBg', currentTheme)} p-6 border-t ${getThemeClasses('cardBorder', currentTheme)} rounded-b-xl`}>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowReviewModal(false)}
                  className={`px-6 py-2 border rounded-lg font-medium ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-md flex items-center`}
                >
                  <X className="w-4 h-4 mr-2" />
                  ปิด
                </button>
              </div>
            </div>
          </div>

          <div 
            className="absolute inset-0 -z-10"
            onClick={() => setShowReviewModal(false)}
          />
        </div>
    )
}

export default ReviewModal;