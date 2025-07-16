import { 
  X,
  Calendar,
  Upload,
  CheckCircle,
  AlertTriangle,
  Clock} from 'lucide-react';
import moment from 'moment';
import { getThemeClasses } from '../../utils/themes';

const POSTModal = ({ currentTheme, postStatus, filteredSales, currentProcessingItem, handleConfirmPost, setShowPostModal, postProgress, processedItems }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div 
            className={`${getThemeClasses('cardBg', currentTheme)} rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto ${getThemeClasses('transition', currentTheme)} transform animate-scale-in`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* POST Modal Header */}
            <div className={`sticky top-0 ${getThemeClasses('cardBg', currentTheme)} p-6 border-b ${getThemeClasses('cardBorder', currentTheme)} rounded-t-xl`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center`}>
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
                      POST ตัดสต๊อก
                    </h3>
                    <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                      ประมวลผลรายการขายและตัดสต๊อกสินค้า
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPostModal(false)}
                  disabled={postStatus === 'processing'}
                  className={`p-2 rounded-lg ${getThemeClasses('sidebarHover', currentTheme)} ${getThemeClasses('transition', currentTheme)} ${getThemeClasses('textMuted', currentTheme)} hover:${getThemeClasses('textSecondary', currentTheme)} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Current Date */}
              <div className={`p-4 rounded-lg ${currentTheme === 'dark' ? 'bg-green-900 bg-opacity-20' : 'bg-green-50'} border ${currentTheme === 'dark' ? 'border-green-700' : 'border-green-200'}`}>
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-green-600" />
                  <div>
                    <h4 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>
                      วันที่ประมวลผล
                    </h4>
                    <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                      {moment().format('วันddddที่ D MMMM YYYY เวลา HH:mm:ss')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Summary Information */}
              {postStatus === 'idle' && (
                <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
                  <h4 className={`text-lg font-semibold mb-4 ${getThemeClasses('textPrimary', currentTheme)}`}>
                    ข้อมูลที่จะดำเนินการ
                  </h4>
                  
                  {(() => {
                    const tempSales = filteredSales.filter(sale => sale.post_status === 'N' || sale.post_status === 'D');
                    const totalItems = tempSales.reduce((sum, sale) => sum + (sale.total_item || 0), 0);
                    
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="text-center p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                          <div className="text-2xl font-bold text-blue-600">{tempSales.length}</div>
                          <div className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>รายการขาย</div>
                        </div>
                        <div className="text-center p-4 rounded-lg border-2 border-green-200 dark:border-green-700">
                          <div className="text-2xl font-bold text-green-600">{totalItems}</div>
                          <div className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>รายการสินค้า</div>
                        </div>
                        <div className="text-center p-4 rounded-lg border-2 border-purple-200 dark:border-purple-700">
                          <div className="text-2xl font-bold text-purple-600">{tempSales.length > 0 ? tempSales[0].branch_code || 'หลายสาขา' : '-'}</div>
                          <div className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>สาขา</div>
                        </div>
                      </div>
                    );
                  })()}

                  <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-yellow-900 bg-opacity-20' : 'bg-yellow-50'} border-l-4 border-yellow-400`}>
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <p className={`text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                          คำเตือน
                        </p>
                        <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                          การ POST จะตัดสต๊อกสินค้าและไม่สามารถยกเลิกได้ กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนดำเนินการ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing Section */}
              {postStatus === 'processing' && (
                <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
                  <h4 className={`text-lg font-semibold mb-4 ${getThemeClasses('textPrimary', currentTheme)} flex items-center`}>
                    <Clock className="w-5 h-5 mr-2 animate-spin" />
                    กำลังประมวลผล...
                  </h4>
                  
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className={getThemeClasses('textSecondary', currentTheme)}>ความคืบหน้า</span>
                      <span className={getThemeClasses('textSecondary', currentTheme)}>{Math.round(postProgress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700">
                      <div 
                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${postProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Current Processing Item */}
                  {currentProcessingItem && (
                    <div className={`p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-blue-900 bg-opacity-20' : 'bg-blue-50'} border ${currentTheme === 'dark' ? 'border-blue-700' : 'border-blue-200'}`}>
                      <div className="flex items-center space-x-3">
                        <div className="animate-pulse">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        </div>
                        <div>
                          <p className={`text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                            กำลังประมวลผล: {currentProcessingItem.billno}
                          </p>
                          <p className={`text-xs ${getThemeClasses('textSecondary', currentTheme)}`}>
                            {currentProcessingItem.total_item} รายการสินค้า
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Processed Items List */}
                  {processedItems.length > 0 && (
                    <div className="mt-4 max-h-60 overflow-y-auto">
                      <h5 className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                        รายการที่ประมวลผลแล้ว
                      </h5>
                      <div className="space-y-2">
                        {processedItems.map((item, index) => (
                          <div key={index} className={`p-2 rounded-lg ${item.success ? 'bg-green-50 dark:bg-green-900 dark:bg-opacity-20' : 'bg-red-50 dark:bg-red-900 dark:bg-opacity-20'} border ${item.success ? 'border-green-200 dark:border-green-700' : 'border-red-200 dark:border-red-700'}`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {item.success ? (
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                ) : (
                                  <X className="w-4 h-4 text-red-600" />
                                )}
                                <span className={`text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                                  {item.billno}
                                </span>
                              </div>
                              <span className={`text-xs ${item.success ? 'text-green-600' : 'text-red-600'}`}>
                                {item.message}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Completed Section */}
              {postStatus === 'completed' && (
                <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h4 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)} mb-2`}>
                      การ POST เสร็จสิ้น
                    </h4>
                    <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)} mb-4`}>
                      ประมวลผลเสร็จเรียบร้อยแล้ว เวลา {moment().format('HH:mm:ss')}
                    </p>

                    {/* Results Summary */}
                    {(() => {
                      const successCount = processedItems.filter(item => item.success).length;
                      const errorCount = processedItems.filter(item => !item.success).length;
                      
                      return (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div className="text-center p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                            <div className="text-lg font-bold text-green-600">{successCount}</div>
                            <div className={`text-xs ${getThemeClasses('textSecondary', currentTheme)}`}>สำเร็จ</div>
                          </div>
                          <div className="text-center p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700">
                            <div className="text-lg font-bold text-red-600">{errorCount}</div>
                            <div className={`text-xs ${getThemeClasses('textSecondary', currentTheme)}`}>ผิดพลาด</div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {/* Error Section */}
              {postStatus === 'error' && (
                <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border border-red-200 dark:border-red-700`}>
                  <div className="text-center">
                    <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h4 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)} mb-2`}>
                      เกิดข้อผิดพลาด
                    </h4>
                    <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                      ไม่สามารถประมวลผลได้ กรุณาลองใหม่อีกครั้ง
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className={`sticky bottom-0 ${getThemeClasses('cardBg', currentTheme)} p-6 border-t ${getThemeClasses('cardBorder', currentTheme)} rounded-b-xl`}>
              <div className="flex justify-end space-x-3">
                {postStatus === 'idle' && (
                  <>
                    <button
                      onClick={() => setShowPostModal(false)}
                      className={`px-6 py-2 border rounded-lg font-medium ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-md flex items-center`}
                    >
                      <X className="w-4 h-4 mr-2" />
                      ยกเลิก
                    </button>
                    <button
                      onClick={handleConfirmPost}
                      disabled={filteredSales.filter(sale => sale.post_status === 'N' || sale.post_status === 'D').length === 0}
                      className={`px-6 py-2 text-white rounded-lg font-medium bg-green-500 hover:bg-green-600 ${getThemeClasses('transition', currentTheme)} hover:shadow-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      เริ่มการ POST
                    </button>
                  </>
                )}
                
                {postStatus === 'processing' && (
                  <button
                    disabled
                    className={`px-6 py-2 text-white rounded-lg font-medium bg-blue-500 opacity-50 cursor-not-allowed flex items-center`}
                  >
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    กำลังประมวลผล...
                  </button>
                )}
                
                {(postStatus === 'completed' || postStatus === 'error') && (
                  <button
                    onClick={() => setShowPostModal(false)}
                    className={`px-6 py-2 border rounded-lg font-medium ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-md flex items-center`}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    ปิด
                  </button>
                )}
              </div>
            </div>
          </div>

          <div 
            className="absolute inset-0 -z-10"
            onClick={() => postStatus !== 'processing' && setShowPostModal(false)}
          />
        </div>
  );
}

export default POSTModal
