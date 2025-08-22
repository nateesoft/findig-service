import { Search, RefreshCw } from "lucide-react"
import Select from "react-select"

const SearchForm = ({
  getThemeClasses,
  currentTheme,
  searchCriteria,
  setSearchCriteria,
  filteredSales,
  resetSearch,
  handleSearch,
  branchFile,
  groupFile
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
              กลุ่มสินค้า
            </label>
            <Select
              options={[
                { value: "", label: "ทุกกลุ่มสินค้า" },
                ...(groupFile ? groupFile.map(item => ({
                  value: item.GroupCode,
                  label: `${item.GroupCode}-${item.GroupName}`
                })) : [])
              ]}
              value={(() => {
                if (searchCriteria.GroupCode === "") return { value: "", label: "ทุกกลุ่มสินค้า" };
                const found = groupFile?.find(item => item.GroupCode === searchCriteria.GroupCode);
                return found ? { value: found.GroupCode, label: `${found.GroupCode}-${found.GroupName}` } : null;
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
            <Select
              options={[
                { value: "", label: "ทุกกลุ่มสินค้า" },
                ...(groupFile ? groupFile.map(item => ({
                  value: item.GroupCode,
                  label: `${item.GroupCode}-${item.GroupName}`
                })) : [])
              ]}
              value={(() => {
                if (searchCriteria.GroupCode === "") return { value: "", label: "ทุกกลุ่มสินค้า" };
                const found = groupFile?.find(item => item.GroupCode === searchCriteria.GroupCode);
                return found ? { value: found.GroupCode, label: `${found.GroupCode}-${found.GroupName}` } : null;
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
              คลังสินค้า
            </label>
            <Select
              options={[{ value: "", label: "ทุกคลัง" }, { value: "A1", label: "คลังสินค้าหลัก" }]}
              value={(() => {
                if (searchCriteria.S_Stk === "") return { value: "", label: "ทุกคลัง" };
                if (searchCriteria.S_Stk === "A1") return { value: "A1", label: "คลังสินค้าหลัก" };
                return null;
              })()}
              onChange={option =>
                setSearchCriteria({
                  ...searchCriteria,
                  S_Stk: option ? option.value : ""
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
              รหัสสาขาเริ่มต้น
            </label>
            <Select
              options={branchFile?.map(item => ({
                value: item.Code,
                label: `${item.Code}-${item.Name}`
              }))}
              value={branchFile?.find(item => item.Code === searchCriteria.S_Bran_Start) ? {
                value: searchCriteria.S_Bran_Start,
                label: `${searchCriteria.S_Bran_Start}-${branchFile.find(item => item.Code === searchCriteria.S_Bran_Start)?.Name}`
              } : null}
              onChange={option =>
                setSearchCriteria({
                  ...searchCriteria,
                  S_Bran_Start: option ? option.value : ""
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
              รหัสสาขาสิ้นสุด
            </label>
            <Select
              options={branchFile?.map(item => ({
                value: item.Code,
                label: `${item.Code}-${item.Name}`
              }))}
              value={branchFile?.find(item => item.Code === searchCriteria.S_Bran_End) ? {
                value: searchCriteria.S_Bran_End,
                label: `${searchCriteria.S_Bran_End}-${branchFile.find(item => item.Code === searchCriteria.S_Bran_End)?.Name}`
              } : null}
              onChange={option =>
                setSearchCriteria({
                  ...searchCriteria,
                  S_Bran_End: option ? option.value : ""
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
