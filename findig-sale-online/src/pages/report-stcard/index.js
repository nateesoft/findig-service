import { useState, useEffect, useContext } from 'react';
import { Search } from 'lucide-react';

import { getThemeClasses } from '../../utils/themes';
import { AppContext } from '../../contexts';
import { searchData } from '../../api/stcardApi';
import SearchForm from './SearchForm';
import DataTable from './DataTable';
import { Modal } from '../../components/Modals';
import { loadAllBranch } from '../../api/branchApi';
import { loadAllGroupfile } from '../../api/groupfileApi';

const Sales = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [branchFile, setBranchFile] = useState([])
  const [groupFile, setGroupFile] = useState([])

  const { appData } = useContext(AppContext)
  const { currentTheme, branchCode } = appData

  const [filteredSales, setFilteredSales] = useState([])
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Search criteria state
  const [searchCriteria, setSearchCriteria] = useState({
    S_No: '',
    S_Date_Start: '',
    S_Date_End: '',
    S_Bran: branchCode || '',
    S_Bran_End: '',
    S_User: '',
    S_Rem: '',
    S_Stk: '',
    S_PCode: '',
    GroupCode: ''
  });

  const handleSearch = async () => {
    try {
      setIsLoading(true)
      
      // สร้างเกณฑ์การค้นหาสำหรับ API โดยไม่รวม S_Bran_End และ GroupCode
      const apiSearchCriteria = {
        S_No: searchCriteria.S_No,
        S_Date_Start: searchCriteria.S_Date_Start,
        S_Date_End: searchCriteria.S_Date_End,
        S_Bran: searchCriteria.S_Bran,
        S_User: searchCriteria.S_User,
        S_Rem: searchCriteria.S_Rem,
        S_Stk: searchCriteria.S_Stk,
        S_PCode: searchCriteria.S_PCode
      }
      
      const { data, error } = await searchData(apiSearchCriteria)
      if(data){
        // กรองข้อมูลเพิ่มเติมสำหรับ S_Bran_End และ GroupCode
        let filteredData = data;
        
        // กรองด้วยรหัสสาขาสิ้นสุด
        if (searchCriteria.S_Bran_End) {
          filteredData = filteredData.filter(item => 
            item.S_Bran <= searchCriteria.S_Bran_End
          );
        }
        
        // กรองด้วยกลุ่มสินค้า
        if (searchCriteria.GroupCode) {
          filteredData = filteredData.filter(item => 
            item.GroupCode === searchCriteria.GroupCode
          );
        }
        
        // กรองข้อมูลโดยเปรียบเทียบเฉพาะวันที่ ไม่รวมเวลา
        if (searchCriteria.S_Date_Start) {
          const startDate = new Date(searchCriteria.S_Date_Start);
          filteredData = filteredData.filter(item => {
            const itemDate = new Date(item.S_Date);
            return itemDate.toDateString() >= startDate.toDateString();
          });
        }
        
        if (searchCriteria.S_Date_End) {
          const endDate = new Date(searchCriteria.S_Date_End);
          filteredData = filteredData.filter(item => {
            const itemDate = new Date(item.S_Date);
            return itemDate.toDateString() <= endDate.toDateString();
          });
        }
        
        setFilteredSales(filteredData);
      }

      if(error){
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
    } finally {
      setIsLoading(false)
    }
  };

  // ล้างการค้นหา
  const resetSearch = () => {
    setSearchCriteria({
      S_No: '',
      S_Date_Start: '',
      S_Date_End: '',
      S_Bran: '',
      S_Bran_End: '',
      S_User: '',
      S_Rem: '',
      S_Stk: '',
      S_PCode: '',
      GroupCode: ''
    });
    setFilteredSales([]);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showSaleModal || showReviewModal || showPostModal) {
        if (e.key === 'Escape') {
          setShowSaleModal(false);
          setShowReviewModal(false);
          setShowPostModal(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSaleModal, showReviewModal, showPostModal]);

  useEffect(()=> {
    const initLoadAllbranch = async () => {
      const { data, error } = await loadAllBranch()
      if(data) {
        setBranchFile(data)
      }
      if(error) {
        setActiveModal({
          type: 'error',
          title: 'แสดงข้อมูลสาขาทั้งหมด',
          message: error || 'พบปัญหาในการแสดงรายการสาขาทั้งหมด',
          actions: [
            {
              label: 'ตกลง',
              onClick: () => setActiveModal(null)
            }
          ]
        });
      }
    }
    const initLoadAllGroupfile = async () => {
      const { data, error } = await loadAllGroupfile()
      if(data) {
        setGroupFile(data)
      }
      if(error) {
        setActiveModal({
          type: 'error',
          title: 'แสดงข้อมูลสาขาทั้งหมด',
          message: error || 'พบปัญหาในการแสดงรายการสาขาทั้งหมด',
          actions: [
            {
              label: 'ตกลง',
              onClick: () => setActiveModal(null)
            }
          ]
        });
      }
    }
    initLoadAllbranch()
    initLoadAllGroupfile()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>รายงานความเคลื่อนไหวสินค้า</h1>
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
          resetSearch={resetSearch}
          handleSearch={handleSearch}
          branchFile={branchFile}
          groupFile={groupFile}
        />
      )}

      <DataTable
        getThemeClasses={getThemeClasses}
        currentTheme={currentTheme}
        filteredSales={filteredSales}
        searchCriteria={searchCriteria}
        resetSearch={resetSearch}
        isLoading={isLoading}
      />

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

export default Sales;