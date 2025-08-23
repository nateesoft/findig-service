import { Search, RefreshCw, X } from "lucide-react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import Select from "react-select"

const SearchForm = ({
  getThemeClasses,
  currentTheme,
  searchCriteria,
  setSearchCriteria,
  filteredSales,
  resetSearch,
  handleSearch,
  handleCancelSearch,
  isLoading,
  branchFile,
  groupFile
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
          วันที่เริ่มต้น
        </label>
        <DatePicker
          selected={searchCriteria.Date_Start ? parseDate(searchCriteria.Date_Start) : null}
          onChange={date =>
            setSearchCriteria({
              ...searchCriteria,
              Date_Start: date ? formatDate(date) : ""
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
          วันที่สิ้นสุด
        </label>
        <DatePicker
          selected={searchCriteria.Date_End ? parseDate(searchCriteria.Date_End) : null}
          onChange={date =>
            setSearchCriteria({
              ...searchCriteria,
              Date_End: date ? formatDate(date) : ""
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
              กลุ่มสินค้า
            </label>
            <Select
              options={[
                { value: "", label: "ทุกกลุ่มสินค้า" },
                ...(groupFile ? groupFile.map(item => ({
                  value: item.GroupCode,
                  label: `${item.GroupCode}-${item.PGroup}`
                })) : [])
              ]}
              value={(() => {
                if (searchCriteria.GroupCode === "") return { value: "", label: "ทุกกลุ่มสินค้า" };
                const found = groupFile?.find(item => item.GroupCode === searchCriteria.GroupCode);
                return found ? { value: found.GroupCode, label: `${found.GroupCode}-${found.PGroup}` } : null;
              })()}
              onChange={option =>
                setSearchCriteria({
                  ...searchCriteria,
                  GroupCode: option ? option.value : ""
                })
              }
              isClearable
              placeholder="ทุกกลุ่มสินค้า"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  minHeight: '40px',
                  borderColor: getThemeClasses("input", currentTheme),
                  boxShadow: 'none',
                  fontSize: '1rem'
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 20
                })
              }}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${getThemeClasses(
                "textSecondary",
                currentTheme
              )} mb-2`}
            >
              รหัสสินค้า
            </label>
            <input
              type="text"
              value={searchCriteria.BPCode}
              onChange={(e) =>
                setSearchCriteria({
                  ...searchCriteria,
                  BPCode: e.target.value
                })
              }
              className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses(
                "input",
                currentTheme
              )}`}
              placeholder="ค้นหารหัสสินค้า"
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
            <Select
              options={[{ value: "", label: "ทุกคลัง" }, { value: "A1", label: "คลังสินค้าหลัก" }]}
              value={(() => {
                if (searchCriteria.BStk === "") return { value: "", label: "ทุกคลัง" };
                if (searchCriteria.BStk === "A1") return { value: "A1", label: "คลังสินค้าหลัก" };
                return null;
              })()}
              onChange={option =>
                setSearchCriteria({
                  ...searchCriteria,
                  BStk: option ? option.value : ""
                })
              }
              isClearable
              placeholder="ทุกคลัง"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  minHeight: '40px',
                  borderColor: getThemeClasses("input", currentTheme),
                  boxShadow: 'none',
                  fontSize: '1rem'
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 20
                })
              }}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${getThemeClasses(
                "textSecondary",
                currentTheme
              )} mb-2`}
            >
              สาขาเริ่มต้น
            </label>
            <Select
              options={branchFile?.map(item => ({
                value: item.Code,
                label: `${item.Code}-${item.Name}`
              }))}
              value={branchFile?.find(item => item.Code === searchCriteria.Branch_Start) ? {
                value: searchCriteria.Branch_Start,
                label: `${searchCriteria.Branch_Start}-${branchFile.find(item => item.Code === searchCriteria.Branch_Start)?.Name}`
              } : null}
              onChange={option =>
                setSearchCriteria({
                  ...searchCriteria,
                  Branch_Start: option ? option.value : ""
                })
              }
              isClearable
              placeholder="ทุกสาขา"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  minHeight: '40px',
                  borderColor: getThemeClasses("input", currentTheme),
                  boxShadow: 'none',
                  fontSize: '1rem'
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 20
                })
              }}
            />
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${getThemeClasses(
                "textSecondary",
                currentTheme
              )} mb-2`}
            >
              สาขาสิ้นสุด
            </label>
            <Select
              options={branchFile?.map(item => ({
                value: item.Code,
                label: `${item.Code}-${item.Name}`
              }))}
              value={branchFile?.find(item => item.Code === searchCriteria.Branch_End) ? {
                value: searchCriteria.Branch_End,
                label: `${searchCriteria.Branch_End}-${branchFile.find(item => item.Code === searchCriteria.Branch_End)?.Name}`
              } : null}
              onChange={option =>
                setSearchCriteria({
                  ...searchCriteria,
                  Branch_End: option ? option.value : ""
                })
              }
              isClearable
              placeholder="ทุกสาขา"
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  borderRadius: '0.5rem',
                  minHeight: '40px',
                  borderColor: getThemeClasses("input", currentTheme),
                  boxShadow: 'none',
                  fontSize: '1rem'
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 20
                })
              }}
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
            พบข้อมูล {filteredSales.length} รายการ
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
