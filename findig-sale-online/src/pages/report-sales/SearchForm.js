import {
  Calendar,
  FileText,
  Search,
  Filter,
  RefreshCw,
  X
} from "lucide-react"

const SearchForm = ({
  getThemeClasses,
  currentTheme,
  searchCriteria,
  setSearchCriteria,
  filteredSales,
  draftSale,
  resetSearch,
  handleSearch,
  handleCancelSearch,
  isLoading,
  branchFile
}) => {
  return (
    <div
      className={`${getThemeClasses(
        "cardBg",
        currentTheme
      )} rounded-lg shadow-sm border ${getThemeClasses(
        "cardBorder",
        currentTheme
      )} animate-fade-in`}
    >
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
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
              value={searchCriteria.billNo}
              onChange={(e) =>
                setSearchCriteria({ ...searchCriteria, billNo: e.target.value })
              }
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses(
                "input",
                currentTheme
              )}`}
              placeholder="ค้นหาเลขที่ใบเสร็จ"
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
              วันที่เริ่มต้น
            </label>
            <input
              type="date"
              value={searchCriteria.dateFrom}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  dateFrom: e.target.value
                })
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
              <Calendar className="w-4 h-4 inline mr-2" />
              วันที่สิ้นสุด
            </label>
            <input
              type="date"
              value={searchCriteria.dateTo}
              onChange={(e) =>
                setSearchCriteria({ ...searchCriteria, dateTo: e.target.value })
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
              รหัสพนักงาน
            </label>
            <input
              type="text"
              value={searchCriteria.empCode}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  empCode: e.target.value
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses(
                "input",
                currentTheme
              )}`}
              placeholder="ค้นหารหัสพนักงาน"
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${getThemeClasses(
                "textSecondary",
                currentTheme
              )} mb-2`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              สาขาเริ่มต้น
            </label>
            <select
              value={searchCriteria.branch_code_Start}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  branch_code_Start: e.target.value
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses(
                "input",
                currentTheme
              )}`}
            >
              <option value="">เลือกสาขาเริ่มต้น</option>
              {branchFile && branchFile.map(item=>
                <option key={item.Code} value={item.Code}>{item.Code}-{item.Name}</option>
              )}
            </select>
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${getThemeClasses(
                "textSecondary",
                currentTheme
              )} mb-2`}
            >
              <Filter className="w-4 h-4 inline mr-2" />
              สาขาสิ้นสุด
            </label>
            <select
              value={searchCriteria.branch_code_End}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  branchCodbranch_code_EndeTo: e.target.value
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses(
                "input",
                currentTheme
              )}`}
            >
              <option value="">เลือกสาขาสิ้นสุด</option>
              {branchFile && branchFile.map(item=>
                <option key={item.Code} value={item.Code}>{item.Code}-{item.Name}</option>
              )}
            </select>
          </div>
        </div>

        {/* Search Actions */}
        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div
            className={`text-sm ${getThemeClasses(
              "textMuted",
              currentTheme
            )} flex items-center`}
          >
            พบข้อมูล {filteredSales.length} รายการ จากทั้งหมด {draftSale.length}{" "}
            รายการ
          </div>
          <div className="flex space-x-2">
            <button
              onClick={resetSearch}
              className={`px-4 py-2 border rounded-lg font-medium ${getThemeClasses(
                "secondaryBtn",
                currentTheme
              )} ${getThemeClasses(
                "transition",
                currentTheme
              )} hover:shadow-md flex items-center`}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              ล้างการค้นหา
            </button>
            {isLoading ? (
              <button
                onClick={handleCancelSearch}
                className={`px-4 py-2 text-white rounded-lg font-medium bg-red-500 hover:bg-red-600 ${getThemeClasses(
                  "transition",
                  currentTheme
                )} hover:shadow-lg flex items-center`}
              >
                <X className="w-4 h-4 mr-2" />
                หยุดค้นหา
              </button>
            ) : (
              <button
                onClick={handleSearch}
                className={`px-4 py-2 text-white rounded-lg font-medium bg-blue-500 hover:bg-blue-600 ${getThemeClasses(
                  "transition",
                  currentTheme
                )} hover:shadow-lg flex items-center`}
              >
                <Search className="w-4 h-4 mr-2" />
                ค้นหา
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchForm
