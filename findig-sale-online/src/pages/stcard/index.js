import { useState, useEffect, useContext, useRef } from 'react';
import { Search } from 'lucide-react';

import { getThemeClasses } from '../../utils/themes';
import { AppContext } from '../../contexts';
import { loadStcardInfo, loadStcardViewDetail } from '../../api/stcardApi';
import ReviewModal from './ReviewModal';
import SearchForm from './SearchForm';
import SaleTable from './SaleTable';

// Mock data สำหรับสินค้า
const mockProducts = [
  { barcode: '1234567890123', name: 'เสื้อยืดสีขาว', stock: 'A1', price: 250, available: 50 },
  { barcode: '1234567890124', name: 'เสื้อยืดสีดำ', stock: 'A1', price: 250, available: 30 },
  { barcode: '1234567890125', name: 'กางเกงยีนส์', stock: 'A2', price: 890, available: 25 },
  { barcode: '1234567890126', name: 'รองเท้าผ้าใบ', stock: 'B1', price: 1200, available: 20 },
  { barcode: '1234567890127', name: 'กระเป๋าใส่เอกสาร', stock: 'A1', price: 350, available: 15 },
  { barcode: '1234567890128', name: 'หูฟัง Bluetooth', stock: 'B1', price: 1500, available: 10 },
  { barcode: '1234567890129', name: 'แก้วน้ำสแตนเลส', stock: 'A2', price: 180, available: 40 },
  { barcode: '1234567890130', name: 'พาวเวอร์แบงค์', stock: 'B1', price: 890, available: 35 },
  { barcode: '1234567890131', name: 'สายชาร์จ USB-C', stock: 'A1', price: 120, available: 60 },
  { barcode: '1234567890132', name: 'เคสโทรศัพท์', stock: 'A2', price: 200, available: 45 },
  { barcode: '1234567890133', name: 'ฟิล์มกันรอย', stock: 'B1', price: 80, available: 100 },
  { barcode: '1234567890134', name: 'ที่วางโทรศัพท์', stock: 'A1', price: 150, available: 25 }
];

const Sales = () => {
  const { appData } = useContext(AppContext)
  const { currentTheme, db, userInfo } = appData

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
    billNo: '',
    dateFrom: '',
    dateTo: '',
    branchCode: '',
    empCode: '',
    postStatus: ''
  });

  // Product search states
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
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

  // ฟังก์ชันค้นหาสินค้า
  const searchProducts = (term) => {
    if (!term) return [];
    const searchTerm = term.toLowerCase();
    return mockProducts.filter(product => 
      product.barcode.includes(searchTerm) || 
      product.name.toLowerCase().includes(searchTerm)
    ).slice(0, 10); // จำกัดผลลัพธ์ 10 รายการ
  };

  // Auto-complete logic
  useEffect(() => {
    if (productSearchTerm && productSearchTerm.length >= 2) {
      const filtered = searchProducts(productSearchTerm);
      setFilteredProducts(filtered);
      setShowAutocomplete(filtered.length > 0);
      setSelectedProductIndex(-1);
    } else {
      setFilteredProducts([]);
      setShowAutocomplete(false);
      setSelectedProductIndex(-1);
    }
  }, [productSearchTerm]);

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
  
  // ฟังก์ชันการค้นหา
  const handleSearch = () => {
    let filtered = [...draftSale];

    // ค้นหาตามเลขที่ใบเสร็จ
    if (searchCriteria.billNo.trim()) {
      filtered = filtered.filter(item => 
        item.billno.toLowerCase().includes(searchCriteria.billNo.toLowerCase())
      );
    }

    // ค้นหาตามช่วงวันที่
    if (searchCriteria.dateFrom) {
      filtered = filtered.filter(item => 
        new Date(item.document_date) >= new Date(searchCriteria.dateFrom)
      );
    }

    if (searchCriteria.dateTo) {
      filtered = filtered.filter(item => 
        new Date(item.document_date) <= new Date(searchCriteria.dateTo)
      );
    }

    // ค้นหาตามสาขา
    if (searchCriteria.branchCode) {
      filtered = filtered.filter(item => 
        item.branch_code === searchCriteria.branchCode
      );
    }

    // ค้นหาตามพนักงาน
    if (searchCriteria.empCode.trim()) {
      filtered = filtered.filter(item => 
        item.emp_code.toLowerCase().includes(searchCriteria.empCode.toLowerCase())
      );
    }

    // ค้นหาตามสถานะ POST
    if (searchCriteria.postStatus) {
      filtered = filtered.filter(item => 
        item.post_status === searchCriteria.postStatus
      );
    }

    setFilteredSales(filtered);
  };

  // ล้างการค้นหา
  const resetSearch = () => {
    setSearchCriteria({
      billNo: '',
      dateFrom: '',
      dateTo: '',
      branchCode: '',
      empCode: '',
      postStatus: ''
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

      {/* Search Form */}
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

      {/* Sales Table */}
      <SaleTable
        getThemeClasses={getThemeClasses}
        currentTheme={currentTheme}
        filteredSales={filteredSales}
        handleReviewSale={handleReviewSale}
        searchCriteria={searchCriteria}
        resetSearch={resetSearch}
      />

      {/* Review Modal */}
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