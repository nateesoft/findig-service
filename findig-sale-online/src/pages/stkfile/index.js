import { useState, useEffect, useContext, useRef } from 'react';
import { Search } from 'lucide-react';

import { getThemeClasses } from '../../utils/themes';
import { AppContext } from '../../contexts';
import { loadStfileInfo, loadStfileViewDetail } from '../../api/stkfileApi';
import ReviewModal from './ReviewModal';
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
  const [modalMode, setModalMode] = useState('create'); // 'create', 'edit', 'review'
  const [currentSaleData, setCurrentSaleData] = useState(null);
  
  // Search criteria state
  const [searchCriteria, setSearchCriteria] = useState({
    Branch: '',
    BPCode: '',
    BStk: '',
    SendToPOS: ''
  });

  // Product search states
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [selectedProductIndex, setSelectedProductIndex] = useState(-1);
  
  // Refs
  const autocompleteRef = useRef(null);

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

  const handleReviewSale = async (productCode) => {
    try {
      const { data, error } = await loadStfileViewDetail({ productCode });
      if (data) {
        setCurrentSaleData(data);
        setModalMode('review');
        setShowReviewModal(true);
      } else {
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
        message: error || 'เกิดข้อผิดพลาดในการโหลดข้อมูล',
        actions: [
          {
            label: 'ตกลง',
            onClick: () => setActiveModal(null)
          }
        ]
      });
    }
  };

  const initLoadData = async () => {
    const { data, error } = await loadStfileInfo({
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
  }
  
  const handleSearch = () => {
    let filtered = [...draftSale];

    if (searchCriteria.Branch.trim()) {
      filtered = filtered.filter(item => 
        item.Branch.toLowerCase().includes(searchCriteria.Branch.toLowerCase())
      );
    }

    if (searchCriteria.BPCode) {
      filtered = filtered.filter(item => 
        item.BPCode === searchCriteria.BPCode
      );
    }

    if (searchCriteria.BStk.trim()) {
      filtered = filtered.filter(item => 
        item.BStk.toLowerCase().includes(searchCriteria.BStk.toLowerCase())
      );
    }

    if (searchCriteria.SendToPOS) {
      filtered = filtered.filter(item => 
        item.SendToPOS === searchCriteria.SendToPOS
      );
    }

    setFilteredSales(filtered);
  };

  const resetSearch = () => {
    setSearchCriteria({
      Branch: '',
      BPCode: '',
      BStk: '',
      SendToPOS: ''
    });
    setFilteredSales(draftSale);
  };

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>ข้อมูลตาราง STKFILE</h1>
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