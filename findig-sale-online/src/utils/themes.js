// src/utils/themes.js
export const themes = {
  light: {
    name: 'ธีมสว่าง',
    primary: 'blue',
    background: 'white',
    sidebar: 'white',
    text: 'gray-900',
    border: 'gray-200',
    accent: 'blue-500',
    gradient: 'from-blue-400 to-blue-600'
  },
  dark: {
    name: 'ธีมมืด',
    primary: 'gray',
    background: 'gray-900',
    sidebar: 'gray-800',
    text: 'white',
    border: 'gray-700',
    accent: 'blue-400',
    gradient: 'from-gray-700 to-gray-900'
  },
  red: {
    name: 'ธีมแดง',
    primary: 'red',
    background: 'white',
    sidebar: 'red-50',
    text: 'gray-900',
    border: 'red-200',
    accent: 'red-500',
    gradient: 'from-red-400 to-red-600'
  },
  green: {
    name: 'ธีมเขียว',
    primary: 'green',
    background: 'white',
    sidebar: 'green-50',
    text: 'gray-900',
    border: 'green-200',
    accent: 'green-500',
    gradient: 'from-green-400 to-green-600'
  },
  blue: {
    name: 'ธีมน้ำเงิน',
    primary: 'blue',
    background: 'blue-50',
    sidebar: 'blue-100',
    text: 'gray-900',
    border: 'blue-200',
    accent: 'blue-600',
    gradient: 'from-blue-500 to-blue-700'
  },
  pink: {
    name: 'ธีมชมพู',
    primary: 'pink',
    background: 'pink-50',
    sidebar: 'pink-100',
    text: 'gray-900',
    border: 'pink-200',
    accent: 'pink-500',
    gradient: 'from-pink-400 to-pink-600'
  },
  purple: {
    name: 'ธีมม่วง',
    primary: 'purple',
    background: 'purple-50',
    sidebar: 'purple-100',
    text: 'gray-900',
    border: 'purple-200',
    accent: 'purple-500',
    gradient: 'from-purple-400 to-purple-600'
  },
  orange: {
    name: 'ธีมส้ม',
    primary: 'orange',
    background: 'orange-50',
    sidebar: 'orange-100',
    text: 'gray-900',
    border: 'orange-200',
    accent: 'orange-500',
    gradient: 'from-orange-400 to-orange-600'
  },
  teal: {
    name: 'ธีมเขียวอมฟ้า',
    primary: 'teal',
    background: 'teal-50',
    sidebar: 'teal-100',
    text: 'gray-900',
    border: 'teal-200',
    accent: 'teal-500',
    gradient: 'from-teal-400 to-teal-600'
  },
  contrast: {
    name: 'ธีมคอนทราสต์สูง',
    primary: 'black',
    background: 'white',
    sidebar: 'black',
    text: 'black',
    border: 'black',
    accent: 'black',
    gradient: 'from-black to-gray-800'
  },
  sunset: {
    name: 'ธีมพระอาทิตย์ตก',
    primary: 'orange',
    background: 'gradient-to-br from-orange-100 to-pink-100',
    sidebar: 'gradient-to-b from-orange-200 to-pink-200',
    text: 'gray-900',
    border: 'orange-300',
    accent: 'orange-600',
    gradient: 'from-orange-500 via-red-500 to-pink-500'
  },
  ocean: {
    name: 'ธีมมหาสมุทร',
    primary: 'cyan',
    background: 'gradient-to-br from-cyan-100 to-blue-100',
    sidebar: 'gradient-to-b from-cyan-200 to-blue-200',
    text: 'gray-900',
    border: 'cyan-300',
    accent: 'cyan-600',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500'
  }
};

export const getThemeClasses = (element, currentTheme) => {
  const theme = themes[currentTheme];
  
  const themeClasses = {
    // Main background
    mainBg: currentTheme === 'dark' ? 'bg-gray-900' : 
            currentTheme === 'sunset' ? 'bg-gradient-to-br from-orange-100 to-pink-100' :
            currentTheme === 'ocean' ? 'bg-gradient-to-br from-cyan-100 to-blue-100' :
            currentTheme === 'contrast' ? 'bg-white' :
            `bg-${theme.background}`,
    
    // Sidebar
    sidebarBg: currentTheme === 'dark' ? 'bg-gray-800' : 
               currentTheme === 'sunset' ? 'bg-gradient-to-b from-orange-200 to-pink-200' :
               currentTheme === 'ocean' ? 'bg-gradient-to-b from-cyan-200 to-blue-200' :
               currentTheme === 'contrast' ? 'bg-black' :
               `bg-${theme.sidebar}`,
    sidebarHeader: currentTheme === 'sunset' ? `bg-gradient-to-r ${theme.gradient}` :
                   currentTheme === 'ocean' ? `bg-gradient-to-r ${theme.gradient}` :
                   currentTheme === 'contrast' ? 'bg-black' :
                   `bg-${theme.accent}`,
    sidebarText: currentTheme === 'dark' ? 'text-gray-300' : 
                 currentTheme === 'contrast' ? 'text-white' :
                 'text-gray-700',
    sidebarHover: currentTheme === 'dark' ? 'hover:bg-gray-700' : 
                  currentTheme === 'contrast' ? 'hover:bg-gray-800' :
                  'hover:bg-gray-50 hover:bg-opacity-50',
    sidebarActive: currentTheme === 'dark' 
      ? 'bg-gray-700 text-blue-400 border-r-2 border-blue-400'
      : currentTheme === 'contrast'
      ? 'bg-gray-800 text-white border-r-2 border-white'
      : `bg-${theme.primary}-50 text-${theme.accent} border-r-2 border-${theme.accent}`,
    
    // Cards and panels
    cardBg: currentTheme === 'dark' ? 'bg-gray-800' : 
            currentTheme === 'contrast' ? 'bg-white border-2' :
            'bg-white bg-opacity-80 backdrop-blur-sm',
    cardBorder: currentTheme === 'contrast' ? 'border-black' : `border-${theme.border}`,
    cardText: currentTheme === 'dark' ? 'text-white' : 
              currentTheme === 'contrast' ? 'text-black font-semibold' :
              theme.text,
    
    // Buttons
    primaryBtn: currentTheme === 'sunset' ? `bg-gradient-to-r ${theme.gradient} hover:shadow-lg transform hover:scale-105` :
                currentTheme === 'ocean' ? `bg-gradient-to-r ${theme.gradient} hover:shadow-lg transform hover:scale-105` :
                currentTheme === 'contrast' ? 'bg-black text-white hover:bg-gray-800 border-2 border-black' :
                `bg-${theme.accent} hover:bg-${theme.primary}-600 hover:shadow-lg transform hover:scale-105`,
    secondaryBtn: currentTheme === 'dark' 
      ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
      : currentTheme === 'contrast'
      ? 'border-black text-black hover:bg-gray-100 border-2'
      : `border-${theme.border} text-${theme.text} hover:bg-gray-50`,
    
    // Inputs
    input: currentTheme === 'dark'
      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400'
      : currentTheme === 'contrast'
      ? 'border-black border-2 focus:border-black focus:ring-black text-black font-medium'
      : `border-${theme.border} focus:ring-2 focus:ring-${theme.primary}-500 focus:border-${theme.accent} transition-all`,
    
    // Tables
    tableHeader: currentTheme === 'dark' ? 'bg-gray-700' : 
                 currentTheme === 'contrast' ? 'bg-gray-100 border-b-2 border-black' :
                 `bg-${theme.primary}-50`,
    tableRow: currentTheme === 'dark' ? 'hover:bg-gray-700' : 
              currentTheme === 'contrast' ? 'hover:bg-gray-50 border-b border-gray-300' :
              'hover:bg-gray-50 hover:bg-opacity-50',
    tableBorder: currentTheme === 'dark' ? 'divide-gray-700' : 
                 currentTheme === 'contrast' ? 'divide-gray-400' :
                 'divide-gray-200',
    
    // Text colors
    textPrimary: currentTheme === 'dark' ? 'text-white' : 
                 currentTheme === 'contrast' ? 'text-black font-bold' :
                 'text-gray-900',
    textSecondary: currentTheme === 'dark' ? 'text-gray-300' : 
                   currentTheme === 'contrast' ? 'text-gray-800 font-medium' :
                   'text-gray-600',
    textMuted: currentTheme === 'dark' ? 'text-gray-400' : 
               currentTheme === 'contrast' ? 'text-gray-600' :
               'text-gray-500',
    
    // Status colors (enhanced with better contrast)
    success: currentTheme === 'contrast' ? 'bg-green-200 text-green-900 border border-green-900' : 'bg-green-100 text-green-800',
    warning: currentTheme === 'contrast' ? 'bg-yellow-200 text-yellow-900 border border-yellow-900' : 'bg-yellow-100 text-yellow-800',
    danger: currentTheme === 'contrast' ? 'bg-red-200 text-red-900 border border-red-900' : 'bg-red-100 text-red-800',
    info: currentTheme === 'contrast' ? 'bg-blue-200 text-blue-900 border border-blue-900' : 'bg-blue-100 text-blue-800',
    
    // Animations and transitions
    transition: 'transition-all duration-300 ease-in-out',
    hover: 'hover:shadow-md transform hover:scale-102',
    glow: currentTheme === 'sunset' ? 'shadow-orange-200' :
          currentTheme === 'ocean' ? 'shadow-cyan-200' :
          currentTheme === 'dark' ? 'shadow-gray-700' :
          `shadow-${theme.primary}-200`
  };

  return themeClasses[element] || '';
};