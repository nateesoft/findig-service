import React, { useState, useEffect } from 'react';
import { X, Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

const Modal = ({ 
  isOpen, 
  onClose, 
  type = 'info', 
  title, 
  message, 
  confirmText = 'ตกลง',
  cancelText = 'ยกเลิก',
  onConfirm,
  showCancel = false 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  const getModalConfig = () => {
    switch (type) {
      case 'error':
        return {
          icon: AlertCircle,
          iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
          iconColor: 'text-white',
          headerBg: 'bg-gradient-to-r from-red-50 to-red-100/50',
          borderAccent: 'border-t-red-500',
          buttonPrimary: 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25',
          titleColor: 'text-red-900',
          glowColor: 'shadow-red-500/20'
        };
      case 'warning':
        return {
          icon: AlertTriangle,
          iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
          iconColor: 'text-white',
          headerBg: 'bg-gradient-to-r from-amber-50 to-orange-100/50',
          borderAccent: 'border-t-amber-500',
          buttonPrimary: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25',
          titleColor: 'text-amber-900',
          glowColor: 'shadow-amber-500/20'
        };
      case 'success':
        return {
          icon: CheckCircle,
          iconBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
          iconColor: 'text-white',
          headerBg: 'bg-gradient-to-r from-emerald-50 to-green-100/50',
          borderAccent: 'border-t-emerald-500',
          buttonPrimary: 'bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg shadow-emerald-500/25',
          titleColor: 'text-emerald-900',
          glowColor: 'shadow-emerald-500/20'
        };
      default: // info
        return {
          icon: Info,
          iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
          iconColor: 'text-white',
          headerBg: 'bg-gradient-to-r from-blue-50 to-indigo-100/50',
          borderAccent: 'border-t-blue-500',
          buttonPrimary: 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/25',
          titleColor: 'text-blue-900',
          glowColor: 'shadow-blue-500/20'
        };
    }
  };

  const config = getModalConfig();
  const IconComponent = config.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      <div className={`relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl ${config.glowColor} border border-white/20 transform transition-all duration-300 ${
        isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-4'
      }`}>
        
        <div className={`h-1 ${config.borderAccent} rounded-t-2xl`} />
        
        <div className={`px-6 py-5 ${config.headerBg} rounded-t-2xl border-b border-gray-100/50`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-12 h-12 ${config.iconBg} rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-105`}>
                <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
              </div>
              <div>
                <h3 className={`text-xl font-bold ${config.titleColor} leading-tight`}>
                  {title}
                </h3>
                <div className={`w-8 h-0.5 ${config.iconBg} rounded-full mt-2`} />
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-1.5 transition-all duration-200 hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-gray-700 leading-relaxed text-[15px]">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 bg-gray-50/50 rounded-b-2xl border-t border-gray-100/50">
          <div className="flex justify-end space-x-3">
            {showCancel && (
              <button
                onClick={onClose}
                className="px-6 py-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium shadow-sm hover:shadow hover:scale-[1.02]"
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={onConfirm || onClose}
              className={`px-6 py-2.5 text-white rounded-xl transition-all duration-200 font-medium hover:scale-[1.02] ${config.buttonPrimary}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ModalDemo = () => {
  const [activeModal, setActiveModal] = useState(null);

  const modals = [
    {
      type: 'info',
      title: 'ข้อมูลสำคัญ',
      message: 'นี่คือข้อความแจ้งข้อมูลทั่วไป เพื่อให้ผู้ใช้ทราบเกี่ยวกับการทำงานของระบบ การอัพเดทนี้จะช่วยปรับปรุงประสิทธิภาพของแอปพลิเคชัน'
    },
    {
      type: 'warning',
      title: 'คำเตือนสำคัญ',
      message: 'กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนดำเนินการต่อ การกระทำนี้อาจส่งผลกระทบต่อข้อมูลของคุณ และไม่สามารถย้อนกลับได้'
    },
    {
      type: 'error',
      title: 'เกิดข้อผิดพลาด',
      message: 'ไม่สามารถดำเนินการได้ในขณะนี้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง หรือติดต่อทีมสนับสนุนหากปัญหายังคงมีอยู่'
    },
    {
      type: 'success',
      title: 'ดำเนินการสำเร็จ',
      message: 'ยินดีด้วย! การดำเนินการเสร็จสิ้นแล้ว ข้อมูลของคุณได้รับการบันทึกและซิงค์เรียบร้อยแล้ว คุณสามารถดำเนินการขั้นตอนถัดไปได้'
    }
  ];

  const cardColors = {
    info: 'from-blue-500 to-indigo-600',
    warning: 'from-amber-500 to-orange-500', 
    error: 'from-red-500 to-red-600',
    success: 'from-emerald-500 to-green-600'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-indigo-50/50" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
      
      <div className="relative p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
              Modern Modal Components
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              สวยงาม ทันสมัย และใช้งานง่าย พร้อมเอฟเฟกต์พิเศษที่น่าประทับใจ
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {modals.map((modal, index) => (
              <div
                key={index}
                onClick={() => setActiveModal(modal)}
                className="group cursor-pointer"
              >
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-white/50 hover:scale-[1.02] hover:-translate-y-1">
                  <div className={`h-2 bg-gradient-to-r ${cardColors[modal.type]}`} />
                  
                  <div className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${cardColors[modal.type]} rounded-xl flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      {modal.type === 'info' && <Info className="w-6 h-6 text-white" />}
                      {modal.type === 'warning' && <AlertTriangle className="w-6 h-6 text-white" />}
                      {modal.type === 'error' && <AlertCircle className="w-6 h-6 text-white" />}
                      {modal.type === 'success' && <CheckCircle className="w-6 h-6 text-white" />}
                    </div>
                    
                    <h3 className="font-bold text-slate-800 mb-2 text-lg">
                      {modal.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      Modal แบบ {modal.type} พร้อมการออกแบบที่ทันสมัย
                    </p>
                    
                    <div className="flex items-center text-slate-500 text-xs font-medium">
                      <span className="mr-2">คลิกเพื่อดูตัวอย่าง</span>
                      <div className="w-4 h-4 rounded-full bg-slate-200 group-hover:bg-slate-300 transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/50">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg mr-3" />
              ตัวอย่างการใช้งานพิเศษ
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setActiveModal({
                  type: 'warning',
                  title: 'ยืนยันการลบข้อมูล',
                  message: 'คุณแน่ใจหรือไม่ที่จะลบข้อมูลนี้? การกระทำนี้ไม่สามารถย้อนกลับได้ ข้อมูลทั้งหมดจะถูกลบออกจากระบบอย่างถาวร',
                  showCancel: true,
                  confirmText: 'ลบข้อมูล',
                  cancelText: 'ยกเลิก'
                })}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg shadow-red-500/25 hover:scale-[1.02]"
              >
                🗑️ ลบข้อมูล (แสดงปุ่มยกเลิก)
              </button>
              
              <button
                onClick={() => setActiveModal({
                  type: 'success',
                  title: 'อัพโหลดสำเร็จ',
                  message: 'ไฟล์ของคุณได้รับการอัพโหลดเรียบร้อยแล้ว ระบบกำลังประมวลผลข้อมูล และจะส่งการแจ้งเตือนเมื่อเสร็จสิ้น',
                  confirmText: 'เยี่ยมเลย!'
                })}
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 font-medium shadow-lg shadow-emerald-500/25 hover:scale-[1.02]"
              >
                ✅ อัพโหลดไฟล์
              </button>
            </div>
          </div>

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
                setActiveModal(null);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalDemo;
