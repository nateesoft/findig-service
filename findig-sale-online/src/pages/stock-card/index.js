import { useState, useEffect, useContext } from 'react';
import { Search } from 'lucide-react';

import { getThemeClasses } from '../../utils/themes';
import { AppContext } from '../../contexts';
import { searchData } from '../../api/stcardApi';
import SearchForm from './SearchForm';
import DataTable from './DataTable';
import StockBarChart from './StockBarChart';
import { Modal } from '../../components/Modals';
import { loadAllBranch } from '../../api/branchApi';
import { loadAllGroupfile } from '../../api/groupfileApi';

const Sales = () => {
  const [activeModal, setActiveModal] = useState(null);
  const [branchFile, setBranchFile] = useState([])
  const [groupFile, setGroupFile] = useState([])

  const { appData } = useContext(AppContext)
  const { currentTheme, branchCode } = appData

  // Mock data สำหรับความเคลื่อนไหวสินค้า
  const mockStockMovements = [
    {
      S_Bran: 'สาขากรุงเทพ',
      S_Date: '2025-08-01',
      S_PCode: 'P001',
      PDesc: 'น้ำดื่ม 500ml',
      GroupName: 'เครื่องดื่ม',
      S_Stk: 'คลังหลัก',
      S_Que: 120,
      S_Rem: 'รับเข้า',
      StockRemain: 80,
    },
    {
      S_Bran: 'สาขาเชียงใหม่',
      S_Date: '2025-08-05',
      S_PCode: 'P002',
      PDesc: 'ขนมปัง',
      GroupName: 'เบเกอรี่',
      S_Stk: 'คลังรอง',
      S_Que: 50,
      S_Rem: 'รับเข้า',
      StockRemain: 50,
    },
    {
      S_Bran: 'สาขากรุงเทพ',
      S_Date: '2025-08-10',
      S_PCode: 'P001',
      PDesc: 'น้ำดื่ม 500ml',
      GroupName: 'เครื่องดื่ม',
      S_Stk: 'คลังหลัก',
      S_Que: -40,
      S_Rem: 'ขายออก',
      StockRemain: 40,
    },
  ];

  const [filteredSales, setFilteredSales] = useState(mockStockMovements)
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
    S_User: '',
    Data_Sync: '',
    S_Stk: '',
    S_PCode: ''
  });

  const handleSearch = async () => {
    try {
      setIsLoading(true)
      const { data, error } = await searchData(searchCriteria)
      if(data){
        setFilteredSales(data);
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
      S_User: '',
      Data_Sync: '',
      S_Stk: '',
      S_PCode: ''
    });
    setFilteredSales(filteredSales);
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
        <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>รายงานความเคลื่อนไหว</h1>
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

      {/* กราฟแท่งคงเหลือสินค้า */}
      <div className="mt-8">
        <h2 className={`text-xl font-bold mb-4 ${getThemeClasses('textPrimary', currentTheme)}`}>กราฟแท่งคงเหลือสินค้า (ตัวอย่าง 3-5 รายการล่าสุด)</h2>
        <StockBarChart data={filteredSales} productCode={''} />
      </div>

      <DataTable
        getThemeClasses={getThemeClasses}
        currentTheme={currentTheme}
        filteredSales={filteredSales}
        searchCriteria={searchCriteria}
        resetSearch={resetSearch}
        isLoading={isLoading}
        showStockRemain={true} // ส่ง prop เพื่อบอกให้แสดงคงเหลือล่าสุด
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