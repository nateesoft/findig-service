import { useState, useEffect, useContext } from 'react';
import { Search } from 'lucide-react';

import { getThemeClasses } from '../../utils/themes';
import { AppContext } from '../../contexts';
import { loadStcardInfo } from '../../api/stcardApi';
import SearchForm from './SearchForm';
import SaleTable from './SaleTable';
import { Modal } from '../../components/Modals';

const Sales = () => {
  const [activeModal, setActiveModal] = useState(null);

  const { appData } = useContext(AppContext)
  const { currentTheme, branchCode } = appData

  const [draftSale, setDraftSale] = useState([])
  const [filteredSales, setFilteredSales] = useState([])
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Search criteria state
  const [searchCriteria, setSearchCriteria] = useState({
    S_No: '',
    S_Date_Start: '',
    S_Date_End: '',
    S_Bran: '',
    S_User: '',
    Data_Sync: '',
    S_Stk: '',
    S_PCode: ''
  });

  const initLoadData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await loadStcardInfo({
        branchCode: branchCode
      })

      if(data) {
        setDraftSale(data)
      }else {
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
      setIsLoading(false);
    }
  }
  
  const handleSearch = () => {
    let filtered = [...draftSale];

    if (searchCriteria.S_No.trim()) {
      filtered = filtered.filter(item => 
        (item.S_No || '').toString().toLowerCase().includes(searchCriteria.S_No.toLowerCase().trim())
      );
    }

    if (searchCriteria.S_Date_Start) {
      filtered = filtered.filter(item => 
        new Date(item.S_Date) >= new Date(searchCriteria.S_Date_Start)
      );
    }

    if (searchCriteria.S_Date_End) {
      filtered = filtered.filter(item => 
        new Date(item.S_Date) <= new Date(searchCriteria.S_Date_End)
      );
    }

    if (searchCriteria.S_Bran) {
      filtered = filtered.filter(item => 
        item.S_Bran === searchCriteria.S_Bran
      );
    }

    if (searchCriteria.S_User.trim()) {
      filtered = filtered.filter(item => 
        item.S_User.toLowerCase().includes(searchCriteria.S_User.toLowerCase())
      );
    }

    if (searchCriteria.Data_Sync) {
      filtered = filtered.filter(item => 
        item.Data_Sync === searchCriteria.Data_Sync
      );
    }

    if (searchCriteria.S_Stk) {
      filtered = filtered.filter(item => 
        item.S_Stk === searchCriteria.S_Stk
      );
    }

    if (searchCriteria.S_PCode) {
      filtered = filtered.filter(item => 
        item.S_PCode === searchCriteria.S_PCode
      );
    }

    setFilteredSales(filtered);
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
    setFilteredSales(draftSale);
  };

  // อัปเดต filteredSales เมื่อ draftSale เปลี่ยน
  useEffect(() => {
    setFilteredSales(draftSale);
  }, [draftSale]);

  useEffect(() => {
    initLoadData()
  }, [])

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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>ข้อมูลตาราง STCARD</h1>
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
        <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>ข้อมูลตาราง STCARD</h1>
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
          draftSale={draftSale}
          resetSearch={resetSearch}
          handleSearch={handleSearch}
        />
      )}

      <SaleTable
        getThemeClasses={getThemeClasses}
        currentTheme={currentTheme}
        filteredSales={filteredSales}
        searchCriteria={searchCriteria}
        resetSearch={resetSearch}
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