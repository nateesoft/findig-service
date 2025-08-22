import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const InventoryChart = ({ filteredSales, getThemeClasses, currentTheme }) => {
  
  // ฟังก์ชันสำหรับประมวลผลข้อมูลสำหรับกราฟ
  const processDataForChart = (data) => {
    if (!data || data.length === 0) return [];

    // จัดกลุ่มข้อมูลตามสาขา
    const groupedByBranch = data.reduce((acc, item) => {
      const branch = item.Branch || 'ไม่ระบุสาขา';
      if (!acc[branch]) {
        acc[branch] = [];
      }
      acc[branch].push(item);
      return acc;
    }, {});

    // สำหรับแต่ละสาขา เอาเฉพาะ 3 รายการแรกที่มี BQty24 มากที่สุด
    const chartData = Object.keys(groupedByBranch).map(branch => {
      const branchItems = groupedByBranch[branch]
        .filter(item => item.BQty24 && Number(item.BQty24) > 0) // กรองเอาเฉพาะรายการที่มีจำนวนคงเหลือ
        .sort((a, b) => Number(b.BQty24) - Number(a.BQty24)) // เรียงลำดับจากมากไปน้อย
        .slice(0, 3); // เอาเฉพาะ 3 รายการแรก

      const branchData = {
        branch: branch,
        totalItems: branchItems.length
      };

      // เพิ่มข้อมูลสินค้า 3 รายการแรก
      branchItems.forEach((item, index) => {
        branchData[`item${index + 1}_name`] = item.PDesc || item.BPCode || `สินค้า ${index + 1}`;
        branchData[`item${index + 1}_qty`] = Number(item.BQty24) || 0;
        branchData[`item${index + 1}_code`] = item.BPCode || '';
      });

      return branchData;
    }).filter(data => data.totalItems > 0); // กรองเอาเฉพาะสาขาที่มีข้อมูล

    return chartData;
  };

  const chartData = processDataForChart(filteredSales);

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${getThemeClasses('cardBg', currentTheme)} p-4 rounded-lg shadow-lg border ${getThemeClasses('cardBorder', currentTheme)}`}>
          <p className={`font-semibold ${getThemeClasses('textPrimary', currentTheme)} mb-2`}>
            สาขา: {label}
          </p>
          {payload.map((entry, index) => {
            const itemIndex = entry.dataKey.replace('item', '').replace('_qty', '');
            const itemName = entry.payload[`item${itemIndex}_name`];
            const itemCode = entry.payload[`item${itemIndex}_code`];
            
            return (
              <div key={index} className="mb-1">
                <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                  {itemName} ({itemCode})
                </p>
                <p className={`font-medium`} style={{ color: entry.color }}>
                  จำนวนคงเหลือ: {entry.value.toLocaleString()} หน่วย
                </p>
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  if (!chartData || chartData.length === 0) {
    return (
      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
        <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)} mb-4`}>
          กราฟแสดงสินค้าคงเหลือตามสาขา (Top 3 รายการ)
        </h3>
        <div className="flex items-center justify-center py-20">
          <p className={`text-lg ${getThemeClasses('textMuted', currentTheme)}`}>
            ไม่มีข้อมูลสำหรับแสดงกราฟ
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
      <div className={`pb-6 border-b ${getThemeClasses('cardBorder', currentTheme)}`}>
        <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>
          กราฟแสดงสินค้าคงเหลือตามสาขา (Top 3 รายการ)
        </h3>
        <p className={`text-sm ${getThemeClasses('textMuted', currentTheme)} mt-2`}>
          แสดงสินค้าที่มีจำนวนคงเหลือมากที่สุด 3 รายการแรกของแต่ละสาขา
        </p>
      </div>
      
      <div className="mt-6" style={{ height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 60
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={currentTheme === 'dark' ? '#374151' : '#e5e7eb'} />
            <XAxis 
              dataKey="branch" 
              tick={{ fontSize: 12, fill: currentTheme === 'dark' ? '#d1d5db' : '#374151' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: currentTheme === 'dark' ? '#d1d5db' : '#374151' }}
              label={{ 
                value: 'จำนวนคงเหลือ (หน่วย)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: currentTheme === 'dark' ? '#d1d5db' : '#374151' }
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ 
                color: currentTheme === 'dark' ? '#d1d5db' : '#374151',
                fontSize: '12px'
              }}
            />
            
            {/* สร้าง Bar สำหรับสินค้าแต่ละรายการ */}
            <Bar 
              dataKey="item1_qty" 
              name="สินค้าอันดับ 1" 
              fill="#3b82f6" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="item2_qty" 
              name="สินค้าอันดับ 2" 
              fill="#10b981" 
              radius={[2, 2, 0, 0]}
            />
            <Bar 
              dataKey="item3_qty" 
              name="สินค้าอันดับ 3" 
              fill="#f59e0b" 
              radius={[2, 2, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      {/* แสดงข้อมูลสรุป */}
      <div className={`mt-6 pt-4 border-t ${getThemeClasses('cardBorder', currentTheme)}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
            <p className={`text-sm ${getThemeClasses('textMuted', currentTheme)}`}>จำนวนสาขาทั้งหมด</p>
            <p className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
              {chartData.length}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
            <p className={`text-sm ${getThemeClasses('textMuted', currentTheme)}`}>รายการสินค้าทั้งหมด</p>
            <p className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
              {chartData.reduce((sum, branch) => sum + branch.totalItems, 0)}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
            <p className={`text-sm ${getThemeClasses('textMuted', currentTheme)}`}>จำนวนคงเหลือรวม</p>
            <p className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
              {chartData.reduce((sum, branch) => {
                return sum + (branch.item1_qty || 0) + (branch.item2_qty || 0) + (branch.item3_qty || 0);
              }, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryChart;