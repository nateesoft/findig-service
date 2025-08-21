import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import moment from 'moment';

const StockTimelineChart = ({ data, productCode }) => {
  // กรองข้อมูลตามรหัสสินค้า (ถ้ามี)
  const filtered = productCode
    ? data.filter(item => item.S_PCode === productCode)
    : data;

  // เตรียมข้อมูลสำหรับกราฟ
  const chartData = filtered.map(item => ({
    date: moment(item.S_Date).format('DD/MM/YYYY'),
    remain: item.StockRemain,
    action: item.S_Rem,
    branch: item.S_Bran,
    qty: item.S_Que,
  }));

  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis label={{ value: 'คงเหลือ', angle: -90, position: 'insideLeft' }} />
          <Tooltip formatter={(value, name, props) => [`${value}`, name === 'remain' ? 'คงเหลือ' : name]} />
          <Legend />
          <Line type="monotone" dataKey="remain" stroke="#8884d8" name="คงเหลือ" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockTimelineChart;
