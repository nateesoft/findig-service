import {
  Calendar,
  FileText,
  Search,
  Filter,
  RefreshCw
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
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
              value={searchCriteria.billno}
              onChange={(e) =>
                setSearchCriteria({ ...searchCriteria, billno: e.target.value })
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
              value={searchCriteria.document_date_start}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  document_date_start: e.target.value
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
              value={searchCriteria.document_date_end}
              onChange={(e) =>
                setSearchCriteria({ ...searchCriteria, document_date_end: e.target.value })
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
            <select
              value={searchCriteria.branch_code}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  branch_code: e.target.value
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses(
                "input",
                currentTheme
              )}`}
            >
              <option value="">ทุกสาขา</option>
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
              รหัสพนักงาน
            </label>
            <input
              type="text"
              value={searchCriteria.emp_code}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  emp_code: e.target.value
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
              สถานะ POST
            </label>
            <select
              value={searchCriteria.post_status}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  post_status: e.target.value
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses(
                "input",
                currentTheme
              )}`}
            >
              <option value="">ทุกสถานะ</option>
              <option value="N">WAIT</option>
              <option value="Y">POSTED</option>
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchForm
