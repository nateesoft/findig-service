import { 
  Eye, 
  Edit,
  FileText} from 'lucide-react';
import moment from 'moment';

const SaleTable = ({
    getThemeClasses,
    currentTheme,
    filteredSales,
    handleReviewSale,
    handleEditSale,
    searchCriteria,
    resetSearch
}) => {
  return (
    <div
      className={`${getThemeClasses(
        "cardBg",
        currentTheme
      )} rounded-lg shadow-sm border ${getThemeClasses(
        "cardBorder",
        currentTheme
      )}`}
    >
      <div
        className={`p-6 border-b ${getThemeClasses(
          "cardBorder",
          currentTheme
        )}`}
      >
        <h3
          className={`text-lg font-semibold ${getThemeClasses(
            "textPrimary",
            currentTheme
          )}`}
        >
          ข้อมูลบันทึกข้อมูลการขาย
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className={getThemeClasses("tableHeader", currentTheme)}>
            <tr>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider`}
              >
                เลขที่ใบเสร็จ
              </th>
              <th
                className={`px-6 py-3 text-center text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider`}
              >
                วันที่สร้างเอกสาร
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider`}
              >
                จำนวนสินค้า
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider`}
              >
                พนักงานทำรายการ
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider`}
              >
                สาขา
              </th>
              <th
                className={`px-6 py-3 text-left text-xs font-medium ${getThemeClasses(
                  "textMuted",
                  currentTheme
                )} uppercase tracking-wider`}
              >
                สถานะ POST
              </th>
              <th
                className={`px-6 py-3 text-center text-xs font-medium ${getThemeClasses(
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
            )} divide-y ${getThemeClasses("tableBorder", currentTheme)}`}
          >
            {filteredSales.length > 0 ? (
              filteredSales.map((draft_sale) => (
                <tr
                  key={draft_sale.billno}
                  className={getThemeClasses("tableRow", currentTheme)}
                >
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.billno}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    {moment(draft_sale.document_date).format(
                      "DD/MM/YYYY HH:mm:ss"
                    )}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-right text-sm ${getThemeClasses(
                      "textSecondary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.total_item}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.emp_code}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    {draft_sale.branch_code}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm ${getThemeClasses(
                      "textPrimary",
                      currentTheme
                    )}`}
                  >
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        draft_sale.post_status === "P"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : draft_sale.post_status === "D"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {draft_sale.post_status}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center text-sm font-medium`}
                  >
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleReviewSale(draft_sale.id)}
                        className={`p-2 rounded-lg ${getThemeClasses(
                          "textSecondary",
                          currentTheme
                        )} hover:${getThemeClasses(
                          "textPrimary",
                          currentTheme
                        )} ${getThemeClasses(
                          "transition",
                          currentTheme
                        )} hover:bg-blue-50 dark:hover:bg-blue-900`}
                        title="ดูรายละเอียด"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleEditSale(draft_sale.id)}
                        className={`p-2 rounded-lg ${getThemeClasses(
                          "textMuted",
                          currentTheme
                        )} hover:${getThemeClasses(
                          "textSecondary",
                          currentTheme
                        )} ${getThemeClasses(
                          "transition",
                          currentTheme
                        )} hover:bg-yellow-50 dark:hover:bg-yellow-900`}
                        title="แก้ไข"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className={`px-6 py-8 text-center text-sm ${getThemeClasses(
                    "textMuted",
                    currentTheme
                  )}`}
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="w-12 h-12 text-gray-300" />
                    <p>ไม่พบข้อมูลการขายที่ตรงกับเงื่อนไขการค้นหา</p>
                    {Object.values(searchCriteria).some(
                      (value) => value.trim() !== ""
                    ) && (
                      <button
                        onClick={resetSearch}
                        className={`text-blue-500 hover:text-blue-700 text-sm underline`}
                      >
                        ล้างการค้นหาเพื่อดูข้อมูลทั้งหมด
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SaleTable
