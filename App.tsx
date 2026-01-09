import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area, Sector
} from 'recharts';
import { SHANXI_CITIES } from './data';
import { CityData } from './types';

// UI 颜色常量
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

// 板块动画配置
const sectionVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.98 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.22, 1, 0.36, 1],
      staggerChildren: 0.15
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6 }
  }
};

// 渲染饼图活跃扇区的自定义函数
const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

  return (
    <g style={{ outline: 'none' }}>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ outline: 'none' }}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 12}
        outerRadius={outerRadius + 15}
        fill={fill}
        style={{ outline: 'none' }}
      />
      <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#334155" style={{ fontSize: '14px', fontWeight: 'bold' }}>
        {payload.name}
      </text>
      <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#94a3b8" style={{ fontSize: '12px' }}>
        {(percent * 100).toFixed(2)}%
      </text>
    </g>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('数据资产同步中...');
  const [selectedCity, setSelectedCity] = useState<CityData>(SHANXI_CITIES[0]);
  const [activeTab, setActiveTab] = useState<'trend' | 'structure'>('trend');
  const [pieAnimationKey, setPieAnimationKey] = useState(0);
  const [activePieIndex, setActivePieIndex] = useState(0);
  const [selectedCulture, setSelectedCulture] = useState<{icon: string, title: string, detail: string} | null>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const isScrolling = useRef(false);
  const sectionsCount = 6;

  // 动画“后台预热”逻辑：
  // 在加载条达到100%后，自动切换 activeTab 多次，让浏览器计算 Recharts 和 Layout 的几何属性
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 80);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (loadingProgress === 100) {
      const runWarmup = async () => {
        setLoadingStatus('优化渲染引擎布局...');
        
        // 第一次循环：切换至结构分布并返回
        await new Promise(r => setTimeout(r, 400));
        setActiveTab('structure');
        setLoadingStatus('预加载空间版图缓存 (1/2)...');
        
        await new Promise(r => setTimeout(r, 600));
        setActiveTab('trend');
        setLoadingStatus('校准趋势曲线模型...');
        
        // 第二次循环：重复执行以确保稳定渲染
        await new Promise(r => setTimeout(r, 400));
        setActiveTab('structure');
        setLoadingStatus('预加载空间版图缓存 (2/2)...');
        
        await new Promise(r => setTimeout(r, 600));
        setActiveTab('trend');
        setLoadingStatus('全场景优化完成');
        
        await new Promise(r => setTimeout(r, 500));
        setIsLoading(false);
      };
      
      runWarmup();
    }
  }, [loadingProgress]);

  const navLinks = [
    { name: '首页', id: 'home', index: 0 },
    { name: '经济看板', id: 'data', index: 1 },
    { name: '文化底蕴', id: 'culture', index: 2 },
    { name: '战略优势', id: 'advantages', index: 3 },
    { name: '愿景展望', id: 'vision', index: 4 },
    { name: '关于', id: 'footer', index: 5 },
  ];

  const scrollToIndex = useCallback((index: number) => {
    if (isScrolling.current) return;
    isScrolling.current = true;
    
    setActiveIndex(index);
    const element = document.getElementById(navLinks[index].id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }

    setTimeout(() => {
      isScrolling.current = false;
    }, 1200);
  }, [navLinks]);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (isScrolling.current || isLoading) return;
    e.preventDefault();

    if (e.deltaY > 0) {
      if (activeIndex < sectionsCount - 1) scrollToIndex(activeIndex + 1);
    } else if (e.deltaY < 0) {
      if (activeIndex > 0) scrollToIndex(activeIndex - 1);
    }
  }, [activeIndex, isLoading, scrollToIndex]);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => { touchStartY = e.touches[0].clientY; };
    const handleTouchMove = (e: TouchEvent) => {
      if (isScrolling.current || isLoading) return;
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;
      if (Math.abs(deltaY) > 50) {
        if (deltaY > 0 && activeIndex < sectionsCount - 1) scrollToIndex(activeIndex + 1);
        else if (deltaY < 0 && activeIndex > 0) scrollToIndex(activeIndex - 1);
      }
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [handleWheel, activeIndex, isLoading, scrollToIndex]);

  const cityDistributionData = useMemo(() => {
    return SHANXI_CITIES.map(city => ({
      name: city.name,
      value: city.gdp2023,
      region: city.region
    }));
  }, []);

  const onPieClick = (_: any, index: number) => { setActivePieIndex(index); };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 p-4 border border-gray-100 shadow-2xl rounded-2xl backdrop-blur-xl">
          <p className="font-bold text-gray-900 mb-2 border-b border-gray-100 pb-1">{label || data.name} GDP</p>
          <p className="text-blue-600 font-bold">{data.gdp ? data.gdp.toFixed(2) : data.value.toFixed(2)} 亿</p>
        </div>
      );
    }
    return null;
  };

  const cultureItems = [
    { icon: "🎭", title: "文旅融合示范", detail: "深耕大唐不夜城、西安城墙等超级IP，通过沉浸式演艺带动千亿级文旅产业链。" },
    { icon: "🏛️", title: "数字文保科技", detail: "利用VR/AR、高精度三维扫描技术，科技守护中华文明瑰宝。" },
    { icon: "🎨", title: "非遗产业化", detail: "整合秦腔、凤翔泥塑等资源，打造现代化文创产品出口基地。" }
  ];

  return (
    <div className="fixed inset-0 overflow-hidden bg-slate-900 selection:bg-blue-500 selection:text-white">
      {/* 载入动画层 */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center"
          >
            <div className="text-blue-500 mb-8 scale-150">
              <svg className="w-16 h-16 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-white tracking-[0.3em] mb-2 uppercase">三秦数字资产平台</h2>
            <p className="text-blue-400 text-[10px] font-bold tracking-[0.5em] mb-10 opacity-70">{loadingStatus}</p>
            <div className="w-48 h-1 bg-slate-800 rounded-full overflow-hidden relative">
              <motion.div initial={{ width: 0 }} animate={{ width: `${loadingProgress}%` }} className="h-full bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,1)]" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 侧边导航指示器 */}
      <div className="fixed right-10 top-1/2 -translate-y-1/2 z-[110] flex flex-col gap-5">
        {navLinks.map((link) => (
          <button key={link.id} onClick={() => scrollToIndex(link.index)} className="group flex items-center justify-end gap-3">
            <span className={`text-[10px] font-bold uppercase tracking-widest transition-all duration-300 opacity-0 group-hover:opacity-100 ${activeIndex === link.index ? 'text-blue-500' : 'text-slate-400'}`}>
              {link.name}
            </span>
            <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 border-2 ${
              activeIndex === link.index ? 'bg-blue-500 border-blue-500 scale-150 shadow-[0_0_12px_rgba(59,130,246,0.6)]' : 'bg-transparent border-slate-500'
            }`} />
          </button>
        ))}
      </div>

      {/* 顶部状态栏 */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 px-8 py-6 ${
          activeIndex > 0 ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className={`text-2xl font-black tracking-tighter cursor-pointer transition-colors ${activeIndex > 0 ? 'text-blue-600' : 'text-white'}`} onClick={() => scrollToIndex(0)}>
            SHAANXI <span className={activeIndex > 0 ? 'text-slate-900' : 'text-blue-400'}>ECONOMY</span>
          </div>
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => scrollToIndex(link.index)} className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                activeIndex === link.index ? (activeIndex > 0 ? 'text-blue-600 scale-110' : 'text-white scale-110') : (activeIndex > 0 ? 'text-slate-400 hover:text-blue-600' : 'text-white/50 hover:text-white')
              }`}>
                {link.name}
              </button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* 容器滚动区域 */}
      {/* 即使在加载时也渲染主内容，但通过 opacity 控制，以支持后台预热 */}
      <div className={`h-full w-full transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        
        {/* 首页 (0) */}
        <section id="home" className="h-screen w-full flex flex-col items-center justify-center relative bg-slate-900">
          <motion.div initial={{ scale: 1.1, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 2 }} className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.5)), url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070')` }} />
          <AnimatePresence mode="wait">
            {activeIndex === 0 && (
              <motion.div key="home-content" initial="hidden" animate="visible" exit="hidden" variants={sectionVariants} className="relative z-10 text-center text-white px-6 flex flex-col items-center">
                <motion.h1 variants={itemVariants} className="text-7xl md:text-9xl font-black mb-8 tracking-tighter">三秦之脊</motion.h1>
                <motion.p variants={itemVariants} className="text-xl md:text-2xl max-w-3xl font-light tracking-[0.2em] opacity-80 mx-auto border-t border-white/20 pt-8 mb-12">陕西省 GDP 十年演进全景数据可视化</motion.p>
                <motion.div variants={itemVariants} className="mt-4">
                  <motion.div animate={{ y: [0, 16] }} transition={{ duration: 1.8, repeat: Infinity, repeatType: "mirror" }} className="cursor-pointer group flex flex-col items-center" onClick={() => scrollToIndex(1)}>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] mb-4">下滑探索</span>
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M19 9l-7 7-7-7" /></svg>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 数据看板 (1) */}
        <section id="data" className="h-screen w-full flex flex-col justify-center bg-[#f8fafc]">
          <AnimatePresence mode="wait">
            {/* 后台预热期间 activeIndex 始终渲染 */}
            {(activeIndex === 1 || isLoading) && (
              <motion.div key="data-content" initial="hidden" animate="visible" exit="hidden" variants={sectionVariants} className="max-w-7xl mx-auto px-8 w-full">
                <motion.div variants={itemVariants} className="mb-10 text-center">
                  <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">GDP 核心指标看板</h2>
                  <div className="inline-flex p-1 bg-slate-200/50 rounded-xl relative z-20">
                    <button onClick={(e) => {e.stopPropagation(); setActiveTab('trend')}} className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'trend' ? 'bg-white text-blue-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}>趋势分析</button>
                    <button onClick={(e) => {e.stopPropagation(); setActiveTab('structure'); setPieAnimationKey(k => k + 1)}} className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'structure' ? 'bg-white text-blue-600 shadow-md scale-105' : 'text-slate-500 hover:text-slate-700'}`}>结构分布</button>
                  </div>
                </motion.div>
                
                <LayoutGroup>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start relative min-h-[540px]">
                    <AnimatePresence mode="popLayout">
                      {activeTab === 'trend' && (
                        <motion.div 
                          key="city-list" 
                          layout
                          initial={{ opacity: 0, x: -20 }} 
                          animate={{ opacity: 1, x: 0 }} 
                          exit={{ opacity: 0, x: -20 }} 
                          className="lg:col-span-1 space-y-2 max-h-[540px] overflow-y-auto pr-2 custom-scrollbar bg-[#f8fafc] z-10"
                        >
                          {SHANXI_CITIES.map((city) => (
                            <button key={city.name} onClick={(e) => {e.stopPropagation(); setSelectedCity(city)}} className={`w-full text-left p-4 rounded-xl transition-all border-2 ${selectedCity.name === city.name ? 'border-blue-500 bg-blue-500 text-white shadow-lg' : 'border-transparent bg-white hover:bg-slate-50'}`}>
                              <span className="font-bold text-sm">{city.name}</span>
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div 
                      layout 
                      transition={{ type: "tween", ease: [0.4, 0, 0.2, 1], duration: 0.7 }} 
                      className={`bg-white rounded-[2rem] p-10 shadow-xl h-[540px] flex flex-col relative overflow-hidden transition-[grid-column] duration-700 ${activeTab === 'trend' ? 'lg:col-span-3' : 'lg:col-span-4'}`}
                    >
                      <div className="flex-1 relative w-full h-full">
                        <AnimatePresence mode="popLayout" initial={false}>
                          {activeTab === 'trend' ? (
                            <motion.div 
                              key="trend-content-fixed" 
                              initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }} 
                              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
                              exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }} 
                              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                              className="absolute inset-0 flex flex-col w-full h-full"
                            >
                              <h4 className="font-black text-xl mb-8 text-slate-800 shrink-0">{selectedCity.name} 历年生产总值 (亿元)</h4>
                              <div className="flex-grow min-h-0 w-full h-full">
                                <ResponsiveContainer width="100%" height="100%" debounce={50}>
                                  <AreaChart data={selectedCity.history} margin={{ bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="gdp" stroke="#3b82f6" fill="url(#colorGdp)" strokeWidth={3} animationDuration={1000} />
                                    <defs><linearGradient id="colorGdp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient></defs>
                                  </AreaChart>
                                </ResponsiveContainer>
                              </div>
                            </motion.div>
                          ) : (
                            <motion.div 
                              key={`pie-structure-fixed-${pieAnimationKey}`} 
                              initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }} 
                              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} 
                              exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                              className="absolute inset-0 flex flex-col w-full h-full"
                            >
                              <h4 className="font-black text-xl mb-4 text-center text-slate-800 shrink-0">全省经济空间版图</h4>
                              <div className="relative flex-grow flex items-center justify-center min-h-0 w-full h-full">
                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                                  <div className="relative flex flex-col items-center justify-center w-40 h-40">
                                    <AnimatePresence mode="popLayout">
                                      {activePieIndex !== -1 ? (
                                        <motion.div 
                                          key={`val-v2-opt-fixed-${activePieIndex}`} 
                                          className="flex flex-col items-center" 
                                          initial={{ opacity: 0, scale: 0.9, y: 5 }} 
                                          animate={{ opacity: 1, scale: 1, y: 0 }} 
                                          exit={{ opacity: 0, scale: 0.9, y: -5 }} 
                                          transition={{ duration: 0.3, ease: "easeOut" }}
                                        >
                                          <span className="text-4xl font-black text-blue-600 drop-shadow-md leading-tight">{cityDistributionData[activePieIndex]?.value.toFixed(0)}</span>
                                          <span className="text-[12px] text-slate-400 font-bold tracking-[0.3em] uppercase mt-1">亿元</span>
                                        </motion.div>
                                      ) : (
                                        <motion.div 
                                          key="placeholder-v2-opt-fixed" 
                                          initial={{ opacity: 0 }} 
                                          animate={{ opacity: 1 }} 
                                          className="flex items-center justify-center"
                                        >
                                          <span className="text-[12px] text-blue-500/60 font-black tracking-[0.4em] uppercase animate-pulse">点击选择城市</span>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                </div>
                                <ResponsiveContainer width="100%" height="100%" debounce={50}>
                                  <PieChart>
                                    <Pie 
                                      activeIndex={activePieIndex} 
                                      activeShape={renderActiveShape} 
                                      data={cityDistributionData} 
                                      innerRadius={80} 
                                      outerRadius={125} 
                                      dataKey="value" 
                                      paddingAngle={5} 
                                      cx="50%" 
                                      cy="50%" 
                                      onClick={onPieClick} 
                                      stroke="none" 
                                      style={{ outline: 'none' }}
                                      animationDuration={1200}
                                      animationBegin={200}
                                      animationEasing="ease-in-out"
                                    >
                                      {cityDistributionData.map((_, index) => (
                                        <Cell 
                                          key={index} 
                                          fill={COLORS[index % COLORS.length]} 
                                          style={{ 
                                            cursor: 'pointer', 
                                            outline: 'none', 
                                            filter: activePieIndex === index ? 'drop-shadow(0px 15px 25px rgba(0,0,0,0.1))' : 'none', 
                                            transition: 'filter 0.5s ease' 
                                          }} 
                                        />
                                      ))}
                                    </Pie>
                                  </PieChart>
                                </ResponsiveContainer>
                              </div>
                              <div className="text-center mt-4 opacity-30 text-[10px] font-black tracking-[0.4em] uppercase shrink-0">鼠标点击扇区查看详情</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </div>
                </LayoutGroup>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 文化板块 (2) */}
        <section id="culture" className="h-screen w-full flex flex-col justify-center bg-white">
          <AnimatePresence mode="wait">
            {activeIndex === 2 && (
              <motion.div key="culture-content" initial="hidden" animate="visible" exit="hidden" variants={sectionVariants} className="max-w-7xl mx-auto px-8 text-center w-full">
                <motion.h2 variants={itemVariants} className="text-4xl font-black text-slate-900 mb-16">厚植文化底蕴 · 赋能数字未来</motion.h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  {cultureItems.map((item, idx) => (
                    <motion.div key={idx} variants={itemVariants} onClick={() => setSelectedCulture(item)} className="group cursor-pointer p-12 bg-slate-50 rounded-[2.5rem] border border-slate-100 transition-all hover:bg-blue-600 hover:text-white hover:scale-105">
                      <div className="text-6xl mb-8">{item.icon}</div>
                      <h3 className="text-xl font-black mb-4">{item.title}</h3>
                      <div className="w-8 h-1 bg-blue-500 group-hover:bg-white mx-auto rounded-full" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 战略优势 (3) */}
        <section id="advantages" className="h-screen w-full flex flex-col justify-center bg-slate-900 text-white">
          <AnimatePresence mode="wait">
            {activeIndex === 3 && (
              <motion.div key="advantages-content" initial="hidden" animate="visible" exit="hidden" variants={sectionVariants} className="max-w-7xl mx-auto px-8 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <div>
                    <motion.h2 variants={itemVariants} className="text-5xl font-black mb-12 tracking-tighter">腾飞的 <span className="text-blue-500 italic">核心密码</span></motion.h2>
                    <div className="space-y-12">
                      <motion.div variants={itemVariants} className="flex gap-8">
                        <div className="shrink-0 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">🏛️</div>
                        <div>
                          <h4 className="text-2xl font-black mb-2 text-blue-400">政策优势</h4>
                          <p className="text-slate-400 text-base leading-relaxed">秦创原创新驱动平台正式起势，西部大开发战略持续赋能，开放型经济迈上新台阶。</p>
                        </div>
                      </motion.div>
                      <motion.div variants={itemVariants} className="flex gap-8">
                        <div className="shrink-0 w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-3xl">🌍</div>
                        <div>
                          <h4 className="text-2xl font-black mb-2 text-blue-400">地理优势</h4>
                          <p className="text-slate-400 text-base leading-relaxed">地处中国几何中心，西安国际港务区作为内陆港枢纽，链接全球贸易网。</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  <motion.div variants={itemVariants} className="rounded-[3rem] overflow-hidden shadow-2xl aspect-square max-h-[500px] border-8 border-white/5"><img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Advantage" /></motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 愿景展望 (4) */}
        <section id="vision" className="h-screen w-full flex flex-col justify-center bg-white">
          <AnimatePresence mode="wait">
            {activeIndex === 4 && (
              <motion.div key="vision-content" initial="hidden" animate="visible" exit="hidden" variants={sectionVariants} className="max-w-5xl mx-auto px-8 text-center w-full">
                <motion.h2 variants={itemVariants} className="text-5xl md:text-6xl font-black mb-16 tracking-tighter text-slate-900">时代合奏 · 续写辉煌</motion.h2>
                <div className="flex flex-col md:flex-row gap-10 items-stretch mb-20">
                  <div className="flex-1 p-10 bg-slate-50 rounded-[3rem] border border-slate-100 text-left relative overflow-hidden group">
                    <p className="text-slate-600 leading-relaxed font-medium">2025年，陕西在多重挑战下展现出强大的经济韧性，秦创原驱动引擎火力全开，高质量发展迈出坚实步伐。</p>
                  </div>
                  <div className="flex-1 p-10 bg-blue-600 rounded-[3rem] text-left text-white relative shadow-2xl">
                    <p className="text-blue-50 leading-relaxed font-medium">迈入2026年，三秦大地将蓄势聚能，深化产业升级与区域协同，开启从经济大省向经济强省跨越的新篇章。</p>
                  </div>
                </div>
                <motion.p variants={itemVariants} className="text-2xl font-black text-blue-600 italic tracking-[0.3em] opacity-80">“ 往昔已展千重锦，明朝更进百尺竿 ”</motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* 页脚 (5) */}
        <footer id="footer" className="h-screen w-full flex flex-col items-center justify-center bg-slate-50 border-t relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeIndex === 5 && (
              <motion.div key="footer-content" initial="hidden" animate="visible" exit="hidden" variants={sectionVariants} className="max-w-7xl mx-auto px-8 text-center text-slate-400">
                <motion.div variants={itemVariants} className="text-5xl font-black text-slate-900 mb-10 tracking-tighter">陕西经济数字化看板</motion.div>
                <motion.div variants={itemVariants} className="w-24 h-1.5 bg-blue-600 mx-auto mb-12 rounded-full" />
                <motion.p variants={itemVariants} className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed mb-16 italic">聚焦三秦大地，用数据感知脉动，以科技预见未来。</motion.p>
                <motion.p variants={itemVariants} className="text-[10px] font-mono tracking-[0.5em] uppercase opacity-50">© 2024 Shaanxi Data Intelligence. All Rights Reserved.</motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </footer>
      </div>

      <AnimatePresence>
        {selectedCulture && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedCulture(null)} className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 30 }} className="relative w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-2xl z-10 text-center">
              <div className="text-7xl mb-8">{selectedCulture.icon}</div>
              <h4 className="text-2xl font-black text-slate-900 mb-6">{selectedCulture.title}</h4>
              <p className="text-slate-600 leading-relaxed italic mb-10 text-base">{selectedCulture.detail}</p>
              <button onClick={() => setSelectedCulture(null)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200">返回看板</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
