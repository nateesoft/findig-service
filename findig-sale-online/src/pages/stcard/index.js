import { useState, useEffect, useContext, useRef } from 'react';
import { Search } from 'lucide-react';

import { getThemeClasses } from '../../utils/themes';
import { AppContext } from '../../contexts';
import { loadStcardInfo, loadStcardViewDetail } from '../../api/stcardApi';
import ReviewModal from './ReviewModal';
import SearchForm from './SearchForm';
import SaleTable from './SaleTable';

const Sales = () => {
  const { appData } = useContext(AppContext)
  const { currentTheme, db } = appData

  const [draftSale, setDraftSale] = useState([])
  const [filteredSales, setFilteredSales] = useState([])
  const [showSaleModal, setShowSaleModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showSearchForm, setShowSearchForm] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'review'
  const [currentSaleData, setCurrentSaleData] = useState(null);
  
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

  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(-1);
  
  // Refs
  const autocompleteRef = useRef(null);

  const [currentItem, setCurrentItem] = useState({
    barcode: '',
    productName: '',
    stock: 'A1',
    qty: 0
  });

  // ปิด autocomplete เมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setShowAutocomplete(false);
        setSelectedProductIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ฟังก์ชันสำหรับ Review ข้อมูลการขาย
  const handleReviewSale = async (billno) => {
    try {
      // สมมติว่ามี API สำหรับโหลดรายละเอียด
      const { data, error } = await loadStcardViewDetail({ billNo: billno });
      if (data) {
        setCurrentSaleData(data);
        setModalMode('review');
        setShowReviewModal(true);
      } else {
        alert(error || 'ไม่สามารถโหลดข้อมูลได้');
      }
    } catch (error) {
      alert('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      console.error('Error loading sale detail:', error);
    }
  };

  const initLoadData = async () => {
    const { data, error } = await loadStcardInfo({
      branchCode: db
    })

    if(data) {
      setDraftSale(data)
    }else {
      alert(error);
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
  }, [showSaleModal, showReviewModal, showPostModal, currentItem]);

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
        handleReviewSale={handleReviewSale}
        searchCriteria={searchCriteria}
        resetSearch={resetSearch}
      />

      {showReviewModal && currentSaleData && (
        <ReviewModal 
          getThemeClasses={getThemeClasses}
          currentTheme={currentTheme}
          currentSaleData={currentSaleData}
          setShowReviewModal={setShowReviewModal}
        />
      )}
    </div>
  );
};

export default Sales;