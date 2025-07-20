import { 
  Plus, 
  Edit,
  X,
  Calendar,
  FileText,
  Trash2,
  Search} from 'lucide-react';

const CreateEditModal = ({
    getThemeClasses,
    currentTheme,
    modalMode,
    saleHeader,
    setSaleHeader,
    saleItems,
    currentItem,
    setCurrentItem,
    productSearchTerm,
    filteredProducts,
    showAutocomplete,
    selectedProductIndex,
    barcodeInputRef,
    autocompleteRef,
    handleBarcodeChange,
    handleBarcodeKeyDown,
    openProductSearchModal,
    selectProduct,
    addItemToSale,
    editSaleItem,
    removeItemFromSale,
    setShowSaleModal,
    resetNewSaleForm,
    handleNewSaleSubmit
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div
        className={`${getThemeClasses(
          "cardBg",
          currentTheme
        )} rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto ${getThemeClasses(
          "transition",
          currentTheme
        )} transform animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`sticky top-0 ${getThemeClasses(
            "cardBg",
            currentTheme
          )} p-6 border-b ${getThemeClasses(
            "cardBorder",
            currentTheme
          )} rounded-t-xl`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 bg-gradient-to-r ${
                  modalMode === "edit"
                    ? "from-yellow-500 to-yellow-600"
                    : "from-blue-500 to-blue-600"
                } rounded-lg flex items-center justify-center`}
              >
                {modalMode === "edit" ? (
                  <Edit className="w-6 h-6 text-white" />
                ) : (
                  <FileText className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3
                  className={`text-xl font-bold ${getThemeClasses(
                    "textPrimary",
                    currentTheme
                  )}`}
                >
                  {modalMode === "edit"
                    ? "แก้ไขข้อมูลการขาย"
                    : "เพิ่มข้อมูลการขาย"}
                </h3>
                <p
                  className={`text-sm ${getThemeClasses(
                    "textSecondary",
                    currentTheme
                  )}`}
                >
                  {modalMode === "edit"
                    ? "แก้ไขข้อมูลการขายที่มีอยู่"
                    : "กรอกข้อมูลการขายใหม่ (รองรับหลายรายการ)"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowSaleModal(false)}
              className={`p-2 rounded-lg ${getThemeClasses(
                "sidebarHover",
                currentTheme
              )} ${getThemeClasses(
                "transition",
                currentTheme
              )} ${getThemeClasses(
                "textMuted",
                currentTheme
              )} hover:${getThemeClasses("textSecondary", currentTheme)}`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div
            className={`p-4 rounded-lg ${
              currentTheme === "dark"
                ? "bg-blue-900 bg-opacity-20"
                : "bg-blue-50"
            } border ${
              currentTheme === "dark" ? "border-blue-700" : "border-blue-200"
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label
                  className={`block text-sm font-medium ${getThemeClasses(
                    "textSecondary",
                    currentTheme
                  )} mb-2`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  เลขที่ใบเสร็จ
                </label>
                <input
                  type="text"
                  value={saleHeader.billNo}
                  onChange={(e) =>
                    setSaleHeader({ ...saleHeader, billNo: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses(
                    "input",
                    currentTheme
                  )}`}
                  placeholder="เลขที่เอกสาร"
                  autoFocus
                  disabled={modalMode === "edit"}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${getThemeClasses(
                    "textSecondary",
                    currentTheme
                  )} mb-2`}
                >
                  <Calendar className="w-4 h-4 inline mr-2" />
                  วันที่
                </label>
                <input
                  type="date"
                  value={saleHeader.createDate}
                  onChange={(e) =>
                    setSaleHeader({ ...saleHeader, createDate: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses(
                    "input",
                    currentTheme
                  )}`}
                />
              </div>
              <div>
                <label
                  className={`block text-sm font-medium ${getThemeClasses(
                    "textSecondary",
                    currentTheme
                  )} mb-2`}
                >
                  รหัสสาขา
                </label>
                <input
                  type="text"
                  value={saleHeader.branchCode}
                  onChange={(e) =>
                    setSaleHeader({ ...saleHeader, branchCode: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses(
                    "input",
                    currentTheme
                  )}`}
                  placeholder="รหัสสาขา"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Enhanced Product Input Section */}
          <div
            className={`p-4 rounded-lg ${getThemeClasses(
              "cardBg",
              currentTheme
            )} border ${getThemeClasses("cardBorder", currentTheme)}`}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <label
                  className={`block text-sm font-medium ${getThemeClasses(
                    "textSecondary",
                    currentTheme
                  )} mb-2`}
                >
                  รหัสบาร์โค้ด
                </label>
                <div className="relative" ref={autocompleteRef}>
                  <input
                    ref={barcodeInputRef}
                    type="text"
                    value={productSearchTerm}
                    onChange={handleBarcodeChange}
                    onKeyDown={handleBarcodeKeyDown}
                    className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses(
                      "input",
                      currentTheme
                    )} pr-10`}
                    placeholder="สแกนหรือพิมพ์บาร์โค้ด"
                  />
                  <button
                    onClick={openProductSearchModal}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded ${getThemeClasses(
                      "textMuted",
                      currentTheme
                    )} hover:${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )} ${getThemeClasses("transition", currentTheme)}`}
                    title="ค้นหาสินค้า"
                  >
                    <Search className="w-4 h-4" />
                  </button>

                  {showAutocomplete && filteredProducts.length > 0 && (
                    <div
                      className={`w-full mt-1 ${getThemeClasses(
                        "cardBg",
                        currentTheme
                      )} border ${getThemeClasses(
                        "cardBorder",
                        currentTheme
                      )} rounded-lg shadow-lg max-h-72 overflow-y-auto`}
                    >
                      {filteredProducts.map((product, index) => (
                        <div
                          key={product.PCode}
                          onClick={() => selectProduct(product)}
                          className={`p-3 cursor-pointer ${getThemeClasses(
                            "transition",
                            currentTheme
                          )} ${
                            index === selectedProductIndex
                              ? "bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20"
                              : "hover:bg-gray-200 dark:hover:bg-gray-200"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p
                                className={`font-medium break-words ${getThemeClasses(
                                  "textPrimary",
                                  currentTheme
                                )}`}
                              >
                                {product.PCode} - {product.PDesc}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${getThemeClasses(
                    "textSecondary",
                    currentTheme
                  )} mb-2`}
                >
                  ชื่อสินค้า
                </label>
                <input
                  type="text"
                  value={currentItem.productName}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      productName: e.target.value
                    })
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses(
                    "input",
                    currentTheme
                  )}`}
                  placeholder="ชื่อสินค้า"
                />
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${getThemeClasses(
                    "textSecondary",
                    currentTheme
                  )} mb-2`}
                >
                  คลังสินค้า
                </label>
                <select
                  value={currentItem.stock}
                  onChange={(e) =>
                    setCurrentItem({ ...currentItem, stock: e.target.value })
                  }
                  className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses(
                    "input",
                    currentTheme
                  )}`}
                >
                  <option value=""></option>
                  <option value="A1">คลังสินค้าหลัก</option>
                </select>
              </div>

              <div>
                <label
                  className={`block text-sm font-medium ${getThemeClasses(
                    "textSecondary",
                    currentTheme
                  )} mb-2`}
                >
                  จำนวน
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={currentItem.qty}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        qty: parseFloat(e.target.value) || 0
                      })
                    }
                    className={`flex-1 px-3 py-2 border rounded-lg ${getThemeClasses(
                      "input",
                      currentTheme
                    )}`}
                    placeholder="0"
                  />
                  <button
                    onClick={addItemToSale}
                    disabled={
                      !currentItem.barcode ||
                      !currentItem.productName ||
                      !currentItem.stock ||
                      currentItem.qty <= 0
                    }
                    className={`px-4 py-2 text-white rounded-lg font-medium ${getThemeClasses(
                      "primaryBtn",
                      currentTheme
                    )} ${getThemeClasses(
                      "transition",
                      currentTheme
                    )} hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center`}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {saleItems.length > 0 && (
            <div
              className={`p-4 rounded-lg ${getThemeClasses(
                "cardBg",
                currentTheme
              )} border ${getThemeClasses("cardBorder", currentTheme)}`}
            >
              <h4
                className={`text-lg font-semibold mb-4 ${getThemeClasses(
                  "textPrimary",
                  currentTheme
                )}`}
              >
                รายการสินค้า ({saleItems.length} รายการ)
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead
                    className={getThemeClasses("tableHeader", currentTheme)}
                  >
                    <tr>
                      <th
                        className={`px-4 py-2 text-left text-xs font-medium ${getThemeClasses(
                          "textMuted",
                          currentTheme
                        )} uppercase tracking-wider`}
                      >
                        รหัสบาร์โค้ด
                      </th>
                      <th
                        className={`px-4 py-2 text-left text-xs font-medium ${getThemeClasses(
                          "textMuted",
                          currentTheme
                        )} uppercase tracking-wider`}
                      >
                        ชื่อสินค้า
                      </th>
                      <th
                        className={`px-4 py-2 text-center text-xs font-medium ${getThemeClasses(
                          "textMuted",
                          currentTheme
                        )} uppercase tracking-wider`}
                      >
                        คลัง
                      </th>
                      <th
                        className={`px-4 py-2 text-right text-xs font-medium ${getThemeClasses(
                          "textMuted",
                          currentTheme
                        )} uppercase tracking-wider`}
                      >
                        จำนวน
                      </th>
                      <th
                        className={`px-4 py-2 text-center text-xs font-medium ${getThemeClasses(
                          "textMuted",
                          currentTheme
                        )} uppercase tracking-wider`}
                      >
                        จัดการ
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`${getThemeClasses(
                      "cardBg",
                      currentTheme
                    )} divide-y ${getThemeClasses(
                      "tableBorder",
                      currentTheme
                    )}`}
                  >
                    {saleItems.map((item) => (
                      <tr
                        key={item.id}
                        className={getThemeClasses("tableRow", currentTheme)}
                      >
                        <td
                          className={`px-4 py-3 text-sm ${getThemeClasses(
                            "textPrimary",
                            currentTheme
                          )}`}
                        >
                          {item.barcode}
                        </td>
                        <td
                          className={`px-4 py-3 text-sm ${getThemeClasses(
                            "textPrimary",
                            currentTheme
                          )}`}
                        >
                          {item.productName}
                        </td>
                        <td
                          className={`px-4 py-3 text-center text-sm ${getThemeClasses(
                            "textSecondary",
                            currentTheme
                          )}`}
                        >
                          {item.stock}
                        </td>
                        <td
                          className={`px-4 py-3 text-right text-sm ${getThemeClasses(
                            "textSecondary",
                            currentTheme
                          )}`}
                        >
                          {item.qty}
                        </td>
                        <td className={`px-4 py-3 text-center text-sm`}>
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => editSaleItem(item.id)}
                              className={`p-1 rounded ${getThemeClasses(
                                "textSecondary",
                                currentTheme
                              )} hover:${getThemeClasses(
                                "textPrimary",
                                currentTheme
                              )} ${getThemeClasses(
                                "transition",
                                currentTheme
                              )}`}
                              title="แก้ไข"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeItemFromSale(item.id)}
                              className={`p-1 rounded text-red-500 hover:text-red-700 ${getThemeClasses(
                                "transition",
                                currentTheme
                              )}`}
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

              <div
                className={`mt-4 p-3 rounded-lg ${
                  currentTheme === "dark" ? "bg-gray-800" : "bg-gray-50"
                } border-t ${getThemeClasses("cardBorder", currentTheme)}`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm font-medium ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    สรุปรายการ
                  </span>
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${getThemeClasses(
                        "textPrimary",
                        currentTheme
                      )}`}
                    >
                      รวม {saleItems.reduce((sum, item) => sum + item.qty, 0)}{" "}
                      ชิ้น
                    </div>
                    <div
                      className={`text-sm ${getThemeClasses(
                        "textSecondary",
                        currentTheme
                      )}`}
                    >
                      {saleItems.length} รายการ
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          className={`sticky bottom-0 ${getThemeClasses(
            "cardBg",
            currentTheme
          )} p-6 border-t ${getThemeClasses(
            "cardBorder",
            currentTheme
          )} rounded-b-xl`}
        >
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={() => setShowSaleModal(false)}
              className={`px-6 py-2 border rounded-lg font-medium ${getThemeClasses(
                "secondaryBtn",
                currentTheme
              )} ${getThemeClasses(
                "transition",
                currentTheme
              )} hover:shadow-md flex items-center justify-center`}
            >
              <X className="w-4 h-4 mr-2" />
              ยกเลิก
            </button>
            <button
              onClick={() => {
                resetNewSaleForm()
              }}
              className={`mt-4 sm:mt-0 px-4 py-2 rounded-lg font-medium ${getThemeClasses(
                "secondaryBtn",
                currentTheme
              )} ${getThemeClasses(
                "transition",
                currentTheme
              )} hover:shadow-md flex items-center justify-center`}
            >
              <FileText className="w-4 h-4 mr-2" />
              ล้างข้อมูล
            </button>
            <button
              onClick={handleNewSaleSubmit}
              disabled={!saleHeader.billNo || saleItems.length === 0}
              className={`px-6 py-2 text-white rounded-lg font-medium ${getThemeClasses(
                "primaryBtn",
                currentTheme
              )} ${getThemeClasses(
                "transition",
                currentTheme
              )} hover:shadow-lg transform hover:scale-105 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
            >
              {modalMode === "edit" ? (
                <Edit className="w-4 h-4 mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              {modalMode === "edit" ? "อัปเดตข้อมูล" : "ยืนยันข้อมูล"}
            </button>
          </div>
        </div>
      </div>

      <div
        className="absolute inset-0 -z-10"
        onClick={() => setShowSaleModal(false)}
      />
    </div>
  )
}

export default CreateEditModal
