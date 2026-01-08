import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { SHANXI_CITIES } from './data';
import { CityData } from './types';

// UI 颜色常量
const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];

// 全局动画配置
const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [selectedCity, setSelectedCity] = useState<CityData>(SHANXI_CITIES[0]);
  const [activeTab, setActiveTab] = useState<'trend' | 'structure'>('trend');
  const [selectedCulture, setSelectedCulture] = useState<{icon: string, title: string, detail: string} | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  // 模拟载入进度与初始化
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const cityDistributionData = useMemo(() => {
    return SHANXI_CITIES.map(city => ({
      name: city.name,
      value: city.gdp2023,
      region: city.region
    }));
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (data.breakdown) {
        return (
          <div className="bg-white/95 p-4 border border-gray-100 shadow-2xl rounded-2xl backdrop-blur-xl ring-1 ring-black/5">
            <p className="font-bold text-gray-900 mb-2 text-lg border-b border-gray-100 pb-2">{`${label}年 GDP: ${data.gdp.toFixed(2)} 亿`}</p>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between items-center gap-8">
                <span className="flex items-center gap-2 font-semibold text-blue-600">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span> 科技创新
                </span>
                <span className="text-gray-700 font-mono font-bold">{data.breakdown.tech}%</span>
              </div>
              <div className="flex justify-between items-center gap-8">
                <span className="flex items-center gap-2 font-semibold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span> 能源工业
                </span>
                <span className="text-gray-700 font-mono font-bold">{data.breakdown.energy}%</span>
              </div>
              <div className="flex justify-between items-center gap-8">
                <span className="flex items-center gap-2 font-semibold text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse"></span> 房产基建
                </span>
                <span className="text-gray-700 font-mono font-bold">{data.breakdown.realEstate}%</span>
              </div>
            </div>
          </div>
        );
      }
      return (
        <div className="bg-white/90 p-3 border border-gray-100 shadow-xl rounded-xl font-bold text-gray-800 backdrop-blur-md">
          <p className="text-sm">{`${data.name}: ${data.value.toFixed(2)} 亿`}</p>
        </div>
      );
    }
    return null;
  };

  const cultureItems = [
    { 
      icon: "🎭", 
      title: "文旅融合示范", 
      detail: "深耕大唐不夜城、西安城墙等超级IP，通过沉浸式演艺带动千亿级文旅产业链。2023年旅游收入同比增长显著。" 
    },
    { 
      icon: "🏛️", 
      title: "数字文保科技", 
      detail: "利用VR/AR、高精度三维扫描技术，实现秦始皇陵、敦煌数字丝路工程，科技守护中华文明瑰宝。" 
    },
    { 
      icon: "🎨", 
      title: "非遗产业化", 
      detail: "整合秦腔、凤翔泥塑、安塞腰鼓等国家级非遗资源，打造现代化文创产品出口基地，文化出海步履稳健。" 
    }
  ];

  const navLinks = [
    { name: '首页', id: 'home' },
    { name: '经济看板', id: 'data' },
    { name: '文化底蕴', id: 'culture' },
    { name: '战略优势', id: 'advantages' },
    { name: '愿景展望', id: 'vision' },
  ];

  return (
    <div className="min-h-screen">
      {/* 载入动画层 */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1, ease: "easeInOut" } }}
            className="fixed inset-0 z-[200] bg-slate-900 flex flex-col items-center justify-center overflow-hidden"
          >
            {/* 背景科技纹理 */}
            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative z-10 flex flex-col items-center"
            >
              <div className="text-blue-500 mb-8">
                <svg className="w-24 h-24 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              
              <h2 className="text-3xl font-black text-white tracking-[0.5em] mb-4">三秦之窗</h2>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mb-10">正在同步全省经济数据资产...</p>
              
              <div className="w-64 h-1.5 bg-slate-800 rounded-full overflow-hidden relative shadow-inner">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${loadingProgress}%` }}
                  className="h-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.8)]"
                />
              </div>
              <div className="mt-4 text-blue-400 font-mono font-bold text-sm">
                {loadingProgress}%
              </div>
            </motion.div>
            
            {/* 装饰性动画圆环 */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute w-[600px] h-[600px] border border-blue-500/10 rounded-full"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute w-[400px] h-[400px] border border-blue-500/5 rounded-full"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 顶部导航栏 */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4 ${
          isScrolled ? 'bg-white/80 backdrop-blur-xl shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div 
            className={`text-xl font-black tracking-tighter cursor-pointer transition-colors ${isScrolled ? 'text-blue-600' : 'text-white'}`}
            onClick={() => scrollToSection('home')}
          >
            SHAANXI <span className={isScrolled ? 'text-slate-900' : 'text-blue-400'}>DATA</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollToSection(link.id)}
                className={`text-sm font-black uppercase tracking-widest transition-all hover:scale-110 active:scale-95 ${
                  isScrolled ? 'text-slate-600 hover:text-blue-600' : 'text-white/80 hover:text-white'
                }`}
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="md:hidden">
            <button className={`p-2 rounded-xl ${isScrolled ? 'bg-blue-50 text-blue-600' : 'bg-white/10 text-white'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </div>
        </div>
      </motion.nav>

      {/* 封面板块：政府建筑天际线背景 */}
      <section id="home" className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* 背景开场动画 */}
        <motion.div 
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.45)), url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070')`,
          }}
        />
        
        {/* 覆盖层纹理 */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center z-10">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={!isLoading ? "visible" : "hidden"}
            className="w-full flex flex-col items-center"
          >
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 30, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 }
              }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-6xl md:text-9xl font-black mb-10 tracking-tighter text-white select-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
            >
              三秦之脊 · 经济大省
            </motion.h1>

            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
              transition={{ duration: 1, delay: 0.4 }}
              className="text-xl md:text-3xl max-w-4xl mx-auto font-medium opacity-90 leading-relaxed drop-shadow-2xl tracking-[0.15em] italic"
            >
              陕西省 GDP 十年演进全景数据可视化大屏
            </motion.p>
          </motion.div>
        </div>

        {/* 底部引导箭头 - 独立定位 */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center z-20">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={!isLoading ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 100, delay: 1.2 }}
            className="relative"
          >
            <div className="absolute -inset-8 bg-white/10 blur-3xl rounded-full"></div>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="cursor-pointer relative z-10 group"
              onClick={() => scrollToSection('data')}
            >
              <svg className="w-10 h-10 text-white filter drop-shadow-[0_0_10px_rgba(255,255,255,0.4)] group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 数据大屏核心区域 */}
      <motion.section 
        id="data"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
        variants={sectionVariants}
        className="py-24 bg-[#f8fafc]"
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="mb-20 text-center">
            <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">GDP 核心指标看板</h2>
            <div className="inline-flex p-1.5 bg-slate-200/50 backdrop-blur rounded-2xl">
              <button 
                onClick={() => setActiveTab('trend')}
                className={`px-10 py-3 rounded-xl transition-all duration-500 text-sm font-bold tracking-widest ${activeTab === 'trend' ? 'bg-white text-blue-600 shadow-xl scale-105' : 'text-slate-500 hover:text-slate-800'}`}
              >
                增长趋势分析
              </button>
              <button 
                onClick={() => setActiveTab('structure')}
                className={`px-10 py-3 rounded-xl transition-all duration-500 text-sm font-bold tracking-widest ${activeTab === 'structure' ? 'bg-white text-blue-600 shadow-xl scale-105' : 'text-slate-500 hover:text-slate-800'}`}
              >
                全省结构分布
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <motion.div variants={staggerContainer} className="lg:col-span-1 space-y-4">
              <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] mb-6 pl-2">区域城市检索</h3>
              {SHANXI_CITIES.map((city) => (
                <motion.button
                  key={city.name}
                  variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                  whileHover={{ x: 8 }}
                  onClick={() => setSelectedCity(city)}
                  className={`w-full text-left p-6 rounded-[2rem] transition-all duration-300 border-2 ${
                    selectedCity.name === city.name 
                      ? 'border-blue-600 bg-blue-600 text-white shadow-2xl shadow-blue-200' 
                      : 'border-transparent bg-white text-slate-600 shadow-sm hover:shadow-lg'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-black text-xl">{city.name}</span>
                    <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase ${selectedCity.name === city.name ? 'bg-blue-500 border-blue-400' : 'bg-slate-100 text-slate-400 border-transparent'} border`}>
                      {city.region === 'North' ? '陕北' : city.region === 'Central' ? '关中' : '陕南'}
                    </span>
                  </div>
                </motion.button>
              ))}
            </motion.div>

            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {activeTab === 'trend' ? (
                  <motion.div 
                    key="trend" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 p-10 md:p-14 border border-slate-100 h-full"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                      <div>
                        <h4 className="font-black text-4xl text-slate-900 mb-3">{selectedCity.name}</h4>
                        <p className="text-slate-400 font-medium tracking-wide italic">2014 - 2023 年度生产总值走势分析</p>
                      </div>
                      <div className="px-8 py-4 bg-blue-50 rounded-3xl border border-blue-100 text-center">
                        <span className="text-blue-700 font-black text-3xl">{selectedCity.gdp2023.toFixed(2)} <small className="text-xs font-bold uppercase">CNY 亿</small></span>
                        <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] mt-1">2023 现价估算</p>
                      </div>
                    </div>
                    <div className="h-[480px] overflow-hidden">
                      <motion.div 
                        key={`${selectedCity.name}-trend-revealer`}
                        initial={{ clipPath: 'inset(0 100% 0 0)' }}
                        whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="h-full"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={selectedCity.history}>
                            <defs>
                              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} dy={15} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 700}} />
                            <Tooltip content={<CustomTooltip />} cursor={{stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '6 6'}} />
                            <Area 
                              type="monotone" 
                              dataKey="gdp" 
                              stroke="#2563eb" 
                              strokeWidth={6} 
                              fill="url(#areaGrad)" 
                              isAnimationActive={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="pie" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
                    className="bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200/60 p-10 md:p-14 border border-slate-100 h-full"
                  >
                    <div className="text-center mb-12">
                      <h4 className="text-3xl font-black text-slate-900 mb-2">全省经济贡献版图</h4>
                      <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">陕西省各市 2023 年度 GDP 权重分布</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                      <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={cityDistributionData}
                              cx="50%" cy="50%"
                              innerRadius={100} outerRadius={150}
                              paddingAngle={8} dataKey="value"
                              animationDuration={2500}
                            >
                              {cityDistributionData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-6">
                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 group hover:bg-blue-600 transition-all duration-700 shadow-sm hover:shadow-blue-200">
                          <h5 className="font-black text-slate-800 mb-2 group-hover:text-white transition-colors">关中地区 (核心引擎)</h5>
                          <p className="text-sm text-slate-500 group-hover:text-blue-50 transition-colors font-medium">西安作为中心，辐射咸阳、宝鸡，贡献了全省绝大部分的科技、金融与高端制造产值。</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 group hover:bg-emerald-600 transition-all duration-700 shadow-sm hover:shadow-emerald-200">
                          <h5 className="font-black text-slate-800 mb-2 group-hover:text-white transition-colors">陕北地区 (能源支柱)</h5>
                          <p className="text-sm text-slate-500 group-hover:text-blue-50 transition-colors font-medium">榆林与延安以强大的化石能源与现代煤化工产业，为全省乃至全国提供稳定的资源保障。</p>
                        </div>
                        <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200 group hover:bg-amber-600 transition-all duration-700 shadow-sm hover:shadow-amber-200">
                          <h5 className="font-black text-slate-800 mb-2 group-hover:text-white transition-colors">陕南地区 (绿色走廊)</h5>
                          <p className="text-sm text-slate-500 group-hover:text-amber-50 transition-colors font-medium">依托秦岭生态屏障，汉中、安康在循环经济、富硒食品及生态旅游上展现出强劲潜力。</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 文化板块 */}
      <motion.section
        id="culture"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={sectionVariants}
        className="py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <span className="text-blue-600 font-black tracking-[0.5em] text-xs uppercase mb-4 block">Cultural Heritage</span>
          <h2 className="text-4xl font-black text-slate-900 mb-16 tracking-tight text-center">厚植文化底蕴 · 赋能数字未来</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cultureItems.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedCulture(item)}
                className="group cursor-pointer p-12 bg-slate-50 rounded-[3rem] border border-slate-100 transition-all duration-500 hover:bg-blue-600 hover:shadow-2xl hover:shadow-blue-200"
              >
                <div className="text-6xl mb-6 transition-transform duration-500 group-hover:scale-110">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black text-slate-800 group-hover:text-white transition-colors mb-4">{item.title}</h3>
                <div className="mt-4 flex justify-center">
                  <div className="w-10 h-1 bg-blue-500 group-hover:bg-white rounded-full transition-colors"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 文化详情弹窗 */}
        <AnimatePresence>
          {selectedCulture && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedCulture(null)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[110] cursor-pointer"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white p-10 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] z-[111] border border-slate-100"
              >
                <button 
                  onClick={() => setSelectedCulture(null)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all"
                >
                  ✕
                </button>
                <div className="text-7xl mb-8 text-center">{selectedCulture.icon}</div>
                <h4 className="text-2xl font-black text-slate-900 mb-6 text-center">{selectedCulture.title}</h4>
                <p className="text-slate-600 leading-relaxed font-medium text-center italic">
                  “{selectedCulture.detail}”
                </p>
                <div className="mt-10 flex justify-center">
                  <button 
                    onClick={() => setSelectedCulture(null)}
                    className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                  >
                    了解完毕
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.section>

      {/* 优势介绍板块 */}
      <motion.section 
        id="advantages"
        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={sectionVariants}
        className="py-32 bg-slate-900 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 -skew-x-12 transform origin-top pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <span className="text-blue-500 font-black tracking-[0.5em] text-xs uppercase mb-6 block">Strategic Superiority</span>
              <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter leading-none italic">
                三秦腾飞的 <br/><span className="text-blue-500">核心密码</span>
              </h2>
              <div className="space-y-12">
                <div className="flex gap-8 group">
                  <div className="shrink-0 w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-4xl group-hover:bg-blue-600 transition-all duration-500 group-hover:-translate-y-2 shadow-xl group-hover:shadow-blue-600/30">
                    🏛️
                  </div>
                  <div>
                    <h4 className="text-2xl font-black mb-4 group-hover:text-blue-400 transition-colors">政策优势：红利持续释放</h4>
                    <p className="text-slate-400 leading-relaxed font-medium">深度融入“一带一路”大格局，秦创原创新驱动平台正式起势。作为国家级自贸试验区，陕西享有西部大开发3.0战略的全链条政策扶持。</p>
                  </div>
                </div>
                <div className="flex gap-8 group">
                  <div className="shrink-0 w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center text-4xl group-hover:bg-blue-600 transition-all duration-500 group-hover:-translate-y-2 shadow-xl group-hover:shadow-blue-600/30">
                    🌍
                  </div>
                  <div>
                    <h4 className="text-2xl font-black mb-4 group-hover:text-blue-400 transition-colors">地理优势：内陆开放枢纽</h4>
                    <p className="text-slate-400 leading-relaxed font-medium">地处中国几何中心，承东启西、连接南北。西安国际港务区是全球最大的内陆港，中欧班列“长安号”年运行量稳居全国前列。</p>
                  </div>
                </div>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}
              className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl group"
            >
              <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover transition-all duration-[3s] group-hover:scale-110 opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent p-12 flex flex-col justify-end">
                <span className="text-blue-500 font-black text-xs uppercase tracking-widest mb-2">Innovation Driven</span>
                <h5 className="text-3xl font-black">秦创原：打造科技创新高地</h5>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* 2025总结与2026愿景板块 */}
      <motion.section
        id="vision"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        variants={sectionVariants}
        className="py-32 bg-white relative overflow-hidden"
      >
        <div className="max-w-5xl mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="mb-16"
          >
            <span className="text-blue-600 font-black tracking-[0.5em] text-sm uppercase mb-6 block">Chronicle & Vision</span>
            <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter">
              2025：韧性跨越 <br/>
              <span className="text-slate-300">2026：聚势启新</span>
            </h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full mb-12"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 text-left">
            <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100">
              <h4 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm italic">25</span>
                年度圆满收官
              </h4>
              <p className="text-slate-600 leading-relaxed font-medium">
                2025年，陕西在高质量发展的征途上写下了浓墨重彩的一笔。科技创新与能源转型“双轮驱动”成效显著，全省GDP增速持续稳健，秦创原生态体系全面爆发，成为西部乃至全国的科创新引擎。
              </p>
            </div>
            <div className="p-10 bg-blue-600 rounded-[2.5rem] shadow-2xl shadow-blue-200">
              <h4 className="text-2xl font-black text-white mb-6 flex items-center gap-4">
                <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white text-sm italic">26</span>
                新篇即将开启
              </h4>
              <p className="text-blue-50 leading-relaxed font-medium">
                站在2026年的门槛，陕西将继续深化内陆改革开放，以更开放的姿态融入全球产业链。数字化转型将深入千行百业，三秦大地正积蓄更强的势能，准备迎接属于这片厚土的高光时刻。
              </p>
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-20 pt-12 border-t border-slate-100"
          >
            <p className="text-3xl font-black text-slate-900 italic tracking-tighter">
              “ 往昔已展千重锦，<span className="text-blue-600">明朝更进百尺竿</span> ”
            </p>
            <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">— 开启三秦经济新纪元 —</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-slate-50 py-20 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-black text-slate-900 mb-8 tracking-tighter">陕西经济数字化看板</div>
          <div className="flex flex-wrap justify-center gap-10 mb-12 text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-blue-600 transition-colors">统计局官网</a>
            <a href="#" className="hover:text-blue-600 transition-colors">数据开放平台</a>
            <a href="#" className="hover:text-blue-600 transition-colors">关于本系统</a>
          </div>
          <p className="text-slate-300 text-[10px] italic">© 2024 Shaanxi Data Intelligence. 数据仅供学习演示用途。实际数据请查阅年度统计公报。</p>
        </div>
      </footer>
    </div>
  );
};

export default App;