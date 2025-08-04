import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';

import { getThemeClasses } from '../../utils/themes';
import { loadPosUserAll } from '../../api/userLoginApi';
import { Modal } from '../../components/Modals';
import SearchForm from './SearchForm';
import DataTable from './DataTable';

const UserGroups = ({ currentTheme }) => {
  const [activeModal, setActiveModal] = useState(null);

  const [userList, setUserList] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [showSearchForm, setShowSearchForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [filteredSales, setFilteredSales] = useState([])
  const [searchCriteria, setSearchCriteria] = useState({
    UserName: '',
    Name: ''
  });

  const handleSearch = () => {
    let filtered = [...currentUsers];

    if (searchCriteria.UserName.trim()) {
      console.log('condition1:', searchCriteria.UserName)
      filtered = filtered.filter(item => 
        item.UserName.toLowerCase().includes(searchCriteria.UserName.toLowerCase())
      );
    }

    if (searchCriteria.Name) {
      console.log('condition2:', searchCriteria.UserName)
      filtered = filtered.filter(item => 
        item.Name === searchCriteria.Name
      );
    }
    setFilteredSales(filtered);
  };

  const resetSearch = () => {
    setSearchCriteria({
      UserName: '',
      Name: ''
    });
    setFilteredSales(currentUsers);
  };

  const initLoadData = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await loadPosUserAll()
      if(data) {
        setUserList(data)
      }else{
        setActiveModal({
          type: 'error',
          title: 'ไม่สามารถแสดงข้อมูลได้',
          message: error || 'กรุณาลองใหม่อีกครั้ง',
          actions: [
            {
              label: 'ตกลง',
              onClick: () => setActiveModal(null)
            }
          ]
        });
      }
    } catch (error) {
      setActiveModal({
        type: 'error',
        title: 'ไม่สามารถแสดงข้อมูลได้',
        message: error || 'กรุณาลองใหม่อีกครั้ง',
        actions: [
          {
            label: 'ตกลง',
            onClick: () => setActiveModal(null)
          }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  }

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentUsers = userList.slice(indexOfFirstItem, indexOfLastItem)

  const totalPages = Math.ceil(userList.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }
    return pageNumbers
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>กำหนดรหัสกลุ่มผู้ใช้งาน</h1>
        </div>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className={`text-lg ${getThemeClasses('textSecondary', currentTheme)}`}>กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>กำหนดรหัสกลุ่มผู้ใช้งาน</h1>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button 
            onClick={() => setShowSearchForm(!showSearchForm)}
            className={`text-white px-4 py-2 rounded-lg font-medium bg-gray-500 hover:bg-gray-600 hover:shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out flex items-center`}
          >
            <Search className="w-4 h-4 mr-2" />
            {showSearchForm ? 'ซ่อนการค้นหา' : 'ค้นหา'}
          </button>
        </div>
      </div>

      {showSearchForm && (
        <SearchForm
          getThemeClasses={getThemeClasses}
          currentTheme={currentTheme}
          searchCriteria={searchCriteria}
          setSearchCriteria={setSearchCriteria}
          filteredSales={filteredSales}
          draftSale={currentUsers}
          resetSearch={resetSearch}
          handleSearch={handleSearch}
        />
      )}
      
      <DataTable
        getThemeClasses={getThemeClasses}
        currentTheme={currentTheme}
        filteredSales={filteredSales}
        searchCriteria={searchCriteria}
        resetSearch={resetSearch}
      />

      {totalPages > 1 && (
        <div className={`px-6 py-3 border-t ${getThemeClasses('cardBorder', currentTheme)}`}>
          <div className="flex items-center justify-between">
            {/* ข้อมูลการแสดงผล */}
            <div className={`text-sm ${getThemeClasses('textMuted', currentTheme)}`}>
              แสดง {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, userList.length)} จาก {userList.length} รายการ
            </div>
            
            {/* ปุ่ม Pagination */}
            <div className="flex items-center space-x-2">
              {/* ปุ่มย้อนกลับ */}
              <button
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === 1
                    ? `${getThemeClasses('textMuted', currentTheme)} cursor-not-allowed`
                    : `${getThemeClasses('textPrimary', currentTheme)} hover:${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`
                }`}
              >
                ก่อนหน้า
              </button>

              {/* หมายเลขหน้า */}
              {getPageNumbers().map((pageNumber) => (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === pageNumber
                      ? `bg-blue-500 text-white`
                      : `${getThemeClasses('textPrimary', currentTheme)} hover:${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              {/* ปุ่มถัดไป */}
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-md text-sm ${
                  currentPage === totalPages
                    ? `${getThemeClasses('textMuted', currentTheme)} cursor-not-allowed`
                    : `${getThemeClasses('textPrimary', currentTheme)} hover:${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`
                }`}
              >
                ถัดไป
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal && (
        <Modal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          type={activeModal.type}
          title={activeModal.title}
          message={activeModal.message}
          confirmText={activeModal.confirmText}
          cancelText={activeModal.cancelText}
          showCancel={activeModal.showCancel}
          onConfirm={() => {
            setActiveModal(null)
          }}
        />
      )}
    </div>
  );
};

export default UserGroups;