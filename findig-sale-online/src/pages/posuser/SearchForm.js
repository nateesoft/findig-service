import { Search, RefreshCw } from "lucide-react"

const SearchForm = ({
  getThemeClasses,
  currentTheme,
  searchCriteria,
  setSearchCriteria,
  filteredSales,
  draftSale,
  resetSearch,
  handleSearch
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
              รหัสผู้ใช้
            </label>
            <input
              type="text"
              value={searchCriteria.UserName}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  UserName: e.target.value
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses(
                "input",
                currentTheme
              )}`}
              placeholder="ค้นหารหัสผู้ใช้"
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${getThemeClasses(
                "textSecondary",
                currentTheme
              )} mb-2`}
            >
              ชื่อ-นามสกุล
            </label>
            <input
              type="text"
              value={searchCriteria.Name}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  Name: e.target.value
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses(
                "input",
                currentTheme
              )}`}
              placeholder="ค้นหาชื่อ-นามสกุล"
            />
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
