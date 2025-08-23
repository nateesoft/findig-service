import {
  Calendar,
  FileText,
  Search,
  Filter,
  RefreshCw
} from "lucide-react"

import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

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
  // ฟังก์ชันช่วยแปลง string เป็น Date และ Date เป็น string dd/MM/yyyy
  function parseDate(str) {
    if (!str) return null;
    const parts = str.split("/");
    if (parts.length === 3) {
      // dd/MM/yyyy
      return new Date(parts[2], parts[1] - 1, parts[0]);
    }
    // fallback: yyyy-mm-dd
    const dashParts = str.split("-");
    if (dashParts.length === 3) {
      return new Date(dashParts[0], dashParts[1] - 1, dashParts[2]);
    }
    return null;
  }

  function formatDate(date) {
    if (!date) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  return (
    <div
      className={`${getThemeClasses(
        "cardBg",
        currentTheme
      )} rounded-lg shadow-sm border ${getThemeClasses(
        "cardBorder",
        currentTheme
      )} animate-fade-in`}
      style={{ zIndex: 1, position: "relative" }}
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
            <DatePicker
              selected={searchCriteria.document_date_start ? parseDate(searchCriteria.document_date_start) : null}
              onChange={date =>
                setSearchCriteria({
                  ...searchCriteria,
                  document_date_start: date ? formatDate(date) : ""
                })
              }
              dateFormat="dd/MM/yyyy"
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses("input", currentTheme)}`}
              placeholderText="เลือกวันที่เริ่มต้น"
              autoComplete="off"
              isClearable
              wrapperClassName="w-full"
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
            <DatePicker
              selected={searchCriteria.document_date_end ? parseDate(searchCriteria.document_date_end) : null}
              onChange={date =>
                setSearchCriteria({
                  ...searchCriteria,
                  document_date_end: date ? formatDate(date) : ""
                })
              }
              dateFormat="dd/MM/yyyy"
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses("input", currentTheme)}`}
              placeholderText="เลือกวันที่สิ้นสุด"
              autoComplete="off"
              isClearable
              wrapperClassName="w-full"
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
