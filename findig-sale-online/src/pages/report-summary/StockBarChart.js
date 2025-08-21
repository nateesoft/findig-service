import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const StockBarChart = ({ data, productCode }) => {
  // ฟังก์ชันสำหรับพิมพ์กราฟ
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>กราฟแท่งคงเหลือสินค้า</title>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Sarabun', Arial, sans-serif; margin: 20px; }
          h1 { text-align: center; margin-bottom: 20px; font-size: 18px; }
        </style>
      </head>
      <body>
        <h1>กราฟแท่งคงเหลือสินค้า</h1>
        <div>กรุณาใช้ฟีเจอร์ Print ของ Browser เพื่อพิมพ์กราฟนี้</div>
      </body>
      </html>
    `;
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  // ฟังก์ชันสำหรับ export Excel
  const handleExportExcel = () => {
    const headers = ['วันที่', 'คงเหลือ', 'ประเภท', 'สาขา', 'จำนวน'];
    const csvContent = [
      headers.join(','),
      ...chartData.map(item => [
        item.date,
        item.remain,
        item.action,
        item.branch,
        item.qty
      ].join(','))
    ].join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `กราฟแท่งคงเหลือสินค้า_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  // กรองข้อมูลตามรหัสสินค้า (ถ้ามี)
  const filtered = productCode
    ? data.filter(item => item.S_PCode === productCode)
    : data;

  // ฟังก์ชันสุ่มสี hex
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // จำกัดตัวอย่าง 3-5 รายการล่าสุด พร้อมสุ่มสีแต่ละรายการ
  const chartData = filtered
    .sort((a, b) => new Date(a.S_Date) - new Date(b.S_Date))
    .slice(-5)
    .map(item => ({
      date: moment(item.S_Date).format('DD/MM/YYYY'),
      remain: item.StockRemain,
      action: item.S_Rem,
      branch: item.S_Bran,
      qty: item.S_Que,
      color: getRandomColor(),
    }));

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'คงเหลือ', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value, name, props) => [`${value}`, name === 'remain' ? 'คงเหลือ' : name]} />
          <Legend />
          {chartData.map((entry, idx) => (
            <Bar
              key={idx}
              dataKey="remain"
              name={`คงเหลือ (${entry.date})`}
              fill={entry.color}
              barSize={30}
              data={[entry]}
              xAxisId={0}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockBarChart;
