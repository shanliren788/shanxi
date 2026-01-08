
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { SHANXI_CITIES } from './data';
import { CityData } from './types';

// Constants for UI
const COLORS = ['#1d4ed8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899'];
const REGIONS = [
  { id: 'Central', name: '关中地区' },
  { id: 'North', name: '陕北地区' },
  { id: 'South', name: '陕南地区' }
];

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const App: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<CityData>(SHANXI_CITIES[0]);
  const [activeTab, setActiveTab] = useState<'trend' | 'structure'>('trend');

  const cityDistributionData = useMemo(() => {
    return SHANXI_CITIES.map(city => ({
      name: city.name,
      value: city.gdp2023,
      region: city.region
    }));
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      if (data.breakdown) {
        return (
          <div className="bg-white/95 p-4 border border-gray-200 shadow-2xl rounded-xl backdrop-blur-md">
            <p className="font-bold text-gray-900 mb-2 text-lg border-b pb-1">{`${label}年 GDP: ${data.gdp.toFixed(2)} 亿`}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center gap-6">
                <span className="flex items-center gap-2 font-semibold text-blue-600">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span> 科技创新
                </span>
                <span className="text-gray-700 font-mono">{data.breakdown.tech}%</span>
              </div>
              <div className="flex justify-between items-center gap-6">
                <span className="flex items-center gap-2 font-semibold text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> 能源工业
                </span>
                <span className="text-gray-700 font-mono">{data.breakdown.energy}%</span>
              </div>
              <div className="flex justify-between items-center gap-6">
                <span className="flex items-center gap-2 font-semibold text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span> 房产基建
                </span>
                <span className="text-gray-700 font-mono">{data.breakdown.realEstate}%</span>
              </div>
            </div>
            <p className="mt-3 text-[10px] text-gray-400 uppercase tracking-widest italic border-t pt-2">Source: Shaanxi Statistics Bureau</p>
          </div>
        );
      }
      return (
        <div className="bg-white/90 p-3 border border-gray-100 shadow-xl rounded-lg font-bold text-gray-800">
          <p className="text-sm">{`${data.name}: ${data.value.toFixed(2)} 亿`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      {/* Header / Hero Section - Modern Urban/Data Theme */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ scale: 1.1, filter: 'brightness(0.7)' }}
          animate={{ scale: 1, filter: 'brightness(0.8)' }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.4) 100%), url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070')`,
          }}
        />
        {/* Subtle animated grid overlay for "Data" feel */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <h1 
              className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-blue-400"
              style={{ textShadow: '0 4px 12px rgba(0,0,0,0.6), 0 0 30px rgba(59,130,246,0.4)' }}
            >
              三秦之脊 · 经济大省
            </h1>
            <p className="text-xl md:text-3xl max-w-3xl font-medium opacity-90 leading-relaxed mb-10 drop-shadow-xl tracking-wide">
              陕西省 GDP 十年演进全景数据看板
            </p>
            <div className="h-1.5 w-40 bg-blue-500 mx-auto rounded-full mb-10 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="animate-bounce mt-8"
          >
            <svg className="w-10 h-10 text-blue-400 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </div>
      </section>

      {/* Main Dashboard Section with Repeatable Scroll Animations */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.15 }}
        variants={sectionVariants}
        className="py-20 md:py-32"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-4xl font-black text-gray-900 mb-6 tracking-tight">GDP 宏观数据洞察</h2>
            <div className="inline-flex p-1 bg-gray-100 rounded-2xl shadow-inner">
              <button 
                onClick={() => setActiveTab('trend')}
                className={`px-8 py-3 rounded-xl transition-all duration-500 text-sm font-bold uppercase tracking-wider ${activeTab === 'trend' ? 'bg-white text-blue-600 shadow-md scale-105' : 'text-gray-500 hover:text-gray-800'}`}
              >
                增长趋势图表
              </button>
              <button 
                onClick={() => setActiveTab('structure')}
                className={`px-8 py-3 rounded-xl transition-all duration-500 text-sm font-bold uppercase tracking-wider ${activeTab === 'structure' ? 'bg-white text-blue-600 shadow-md scale-105' : 'text-gray-500 hover:text-gray-800'}`}
              >
                各市贡献占比
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
            {/* Sidebar with staggered city list */}
            <motion.div 
              variants={staggerContainer}
              className="lg:col-span-1 space-y-4"
            >
              <h3 className="text-xs font-black text-blue-600 uppercase tracking-[0.3em] mb-4 pl-2">城市导航面板</h3>
              {SHANXI_CITIES.map((city) => (
                <motion.button
                  key={city.name}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    visible: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedCity(city)}
                  className={`w-full text-left p-5 rounded-3xl transition-all duration-300 border-2 ${
                    selectedCity.name === city.name 
                      ? 'border-blue-600 bg-blue-600 text-white shadow-xl shadow-blue-200' 
                      : 'border-white bg-white text-gray-600 shadow-sm hover:shadow-md'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-black text-lg">{city.name}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${selectedCity.name === city.name ? 'border-blue-400 bg-blue-500' : 'border-gray-200 bg-gray-50'}`}>
                      {city.region === 'North' ? '陕北' : city.region === 'Central' ? '关中' : '陕南'}
                    </span>
                  </div>
                  <p className={`text-xs opacity-80 line-clamp-1 font-medium ${selectedCity.name === city.name ? 'text-blue-50' : 'text-gray-400'}`}>{city.description}</p>
                </motion.button>
              ))}
            </motion.div>

            {/* Content Area with dynamic switching */}
            <div className="lg:col-span-3">
              <AnimatePresence mode="wait">
                {activeTab === 'trend' ? (
                  <motion.div 
                    key="trend-view"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.6 }}
                    className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 p-8 md:p-12 h-full border border-gray-100"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                      <div>
                        <h4 className="font-black text-3xl text-gray-900 mb-2">{selectedCity.name}</h4>
                        <p className="text-gray-400 text-sm font-medium">地区生产总值(GDP) · 2014-2023 年度分析</p>
                      </div>
                      <div className="px-5 py-2 bg-blue-50 rounded-2xl border border-blue-100">
                        <span className="text-blue-700 font-black text-xl">{selectedCity.gdp2023.toFixed(2)} <small className="text-xs font-bold">亿</small></span>
                        <p className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">2023 预估总额</p>
                      </div>
                    </div>
                    <div className="h-[450px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={selectedCity.history}>
                          <defs>
                            <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis 
                            dataKey="year" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9ca3af', fontSize: 13, fontWeight: 600}} 
                            dy={15} 
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#9ca3af', fontSize: 13, fontWeight: 600}} 
                          />
                          <Tooltip content={<CustomTooltip />} cursor={{stroke: '#2563eb', strokeWidth: 2, strokeDasharray: '5 5'}} />
                          <Area 
                            type="monotone" 
                            dataKey="gdp" 
                            stroke="#2563eb" 
                            strokeWidth={5}
                            fill="url(#mainGradient)"
                            animationDuration={2500}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="pie-view"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 p-8 md:p-12 h-full border border-gray-100"
                  >
                    <div className="mb-10 text-center">
                      <h4 className="text-3xl font-black text-gray-900 tracking-tight">各城市 GDP 贡献占比</h4>
                      <p className="text-sm text-gray-400 mt-2 font-medium italic">2023年各市经济总量分布比重</p>
                    </div>
                    
                    <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                      <div className="h-[380px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={cityDistributionData}
                              cx="50%"
                              cy="50%"
                              innerRadius={90}
                              outerRadius={140}
                              paddingAngle={6}
                              dataKey="value"
                              animationDuration={2000}
                            >
                              {cityDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="space-y-6">
                        <div className="p-6 rounded-[1.5rem] bg-blue-50/70 border border-blue-100 group hover:bg-blue-600 transition-all duration-500">
                          <h5 className="font-black text-blue-700 flex items-center gap-3 mb-3 group-hover:text-white">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 group-hover:bg-white"></span> 关中城市群
                          </h5>
                          <p className="text-sm text-blue-800/70 leading-relaxed font-medium group-hover:text-white/80">
                            作为核心引擎，西安及其周边城市形成了半导体、汽车及高端装备制造的万亿级产业带。
                          </p>
                        </div>
                        <div className="p-6 rounded-[1.5rem] bg-emerald-50/70 border border-emerald-100 group hover:bg-emerald-600 transition-all duration-500">
                          <h5 className="font-black text-emerald-700 flex items-center gap-3 mb-3 group-hover:text-white">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 group-hover:bg-white"></span> 陕北能化带
                          </h5>
                          <p className="text-sm text-emerald-800/70 leading-relaxed font-medium group-hover:text-white/80">
                            榆林、延安依托煤气电热一体化，是我国重要的能源安全保障基地。
                          </p>
                        </div>
                        <div className="p-6 rounded-[1.5rem] bg-amber-50/70 border border-amber-100 group hover:bg-amber-600 transition-all duration-500">
                          <h5 className="font-black text-amber-700 flex items-center gap-3 mb-3 group-hover:text-white">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-600 group-hover:bg-white"></span> 陕南绿色走廊
                          </h5>
                          <p className="text-sm text-amber-800/70 leading-relaxed font-medium group-hover:text-white/80">
                            坚持生态优先，汉中、安康在富硒农业、中药材及高端康养领域独具优势。
                          </p>
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

      {/* Regional Strategy Staggered Grid */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={sectionVariants}
        className="py-24 md:py-32 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-6">三足鼎立 · 协同共进</h2>
            <p className="text-gray-400 font-medium text-lg">各具特色的区域发展格局，助力全省经济跨越式发展</p>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
          >
            {[
              { 
                title: '陕北地区 (能量源)', 
                desc: '榆林、延安是我国能源工业的重镇。从传统煤化工向现代煤化工转变，实现资源的高效清洁利用。',
                icon: '⚡',
                color: 'bg-emerald-600',
                shadow: 'shadow-emerald-100'
              },
              { 
                title: '关中地区 (智造芯)', 
                desc: '西安都市圈为核心，聚焦硬科技、航空航天、生命健康等战略性新兴产业，引领全省科技成果转化。',
                icon: '🚀',
                color: 'bg-blue-600',
                shadow: 'shadow-blue-100'
              },
              { 
                title: '陕南地区 (生态金)', 
                desc: '汉中、安康、商洛在守好秦岭生态红线的同时，大力发展绿色有机循环经济与全域旅游。',
                icon: '🌿',
                color: 'bg-amber-500',
                shadow: 'shadow-amber-100'
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -10 }}
                className={`group bg-white p-10 rounded-[2.5rem] shadow-xl ${item.shadow} border border-gray-50 transition-all duration-500 relative overflow-hidden`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 ${item.color} opacity-[0.03] rounded-bl-full`}></div>
                <div className={`${item.color} w-16 h-16 rounded-[1.25rem] flex items-center justify-center text-3xl mb-8 text-white shadow-lg`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black mb-6">{item.title}</h3>
                <p className="text-gray-500 leading-relaxed font-medium mb-8">
                  {item.desc}
                </p>
                <div className="flex items-center text-sm font-black text-gray-400 group-hover:text-blue-600 transition-colors">
                  战略解读 <span className="ml-2 group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Strategic Advantages Section - Detailed descriptions */}
      <motion.section 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        variants={sectionVariants}
        id="advantages" 
        className="py-32 bg-slate-950 text-white relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-2/3 h-full bg-blue-600/5 -skew-x-12 transform origin-top pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -70 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: false }}
            >
              <span className="text-blue-500 font-black tracking-[0.4em] text-xs uppercase mb-6 block border-l-4 border-blue-600 pl-4">Core Strengths</span>
              <h2 className="text-5xl md:text-7xl font-black mb-10 tracking-tighter leading-none">
                为什么是 <span className="text-blue-500">陕西</span>？
              </h2>
              <p className="text-gray-400 text-xl mb-14 leading-relaxed font-light opacity-80">
                作为“丝绸之路”的起点，陕西在国家“西部大开发”与“内陆改革开放”中占据核心枢纽地位。
              </p>

              <div className="space-y-12">
                {[
                  { icon: '🏛️', title: '政策优势：红利加速释放', text: '秦创原创新驱动平台、西部大开发3.0战略支持。作为自由贸易试验区，享有全链条政策红利。' },
                  { icon: '🌍', title: '地理优势：黄金枢纽地带', text: '中国陆运与空运的几何中心。中欧班列“长安号”运行量稳居全国第一梯队。' },
                  { icon: '⚡', title: '科研人才：智力资源密集', text: '拥有西安交大等百余所院校，在航空航天、光电子芯片等领域具有领先的成果转化能力。' }
                ].map((adv, i) => (
                  <div key={i} className="flex gap-8 group">
                    <div className="shrink-0 w-16 h-16 bg-white/5 border border-white/10 rounded-[1.25rem] flex items-center justify-center text-3xl transition-all duration-500 group-hover:bg-blue-600 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-blue-600/30">
                      {adv.icon}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black mb-4 transition-colors group-hover:text-blue-400">{adv.title}</h4>
                      <p className="text-gray-400 text-sm leading-relaxed font-medium">
                        {adv.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: 2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1 }}
              viewport={{ once: false }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[3.5rem] overflow-hidden border border-white/10 group shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1512591290618-904e04936827?auto=format&fit=crop&q=80&w=1200" 
                  alt="Ancient and Modern Shaanxi" 
                  className="w-full h-full object-cover transition-all duration-[2s] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-12">
                  <div>
                    <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-xs">Innovation Hub</span>
                    <h5 className="text-3xl font-black mt-3">秦创原创新平台</h5>
                    <p className="text-gray-400 text-sm mt-4 font-medium opacity-80 leading-relaxed">
                      打破科技成果转化“最后一公里”，构建具有全球竞争力的创新生态体系。
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600 rounded-[2rem] -z-10 blur-3xl opacity-50"></div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-gray-100 py-16 border-t border-gray-200"
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-black text-gray-900 mb-6 tracking-tighter italic">陕西经济数字化看板</div>
          <div className="flex flex-wrap justify-center gap-8 mb-10 text-gray-400 text-sm font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600 transition-colors">统计局官网</a>
            <a href="#" className="hover:text-blue-600 transition-colors">数据开放平台</a>
            <a href="#" className="hover:text-blue-600 transition-colors">一带一路专题</a>
            <a href="#" className="hover:text-blue-600 transition-colors">秦创原动态</a>
          </div>
          <p className="text-gray-400 text-xs mb-4">© 2024 Shaanxi Economic Data Analysis. Designed for Strategic Insights.</p>
          <p className="text-[10px] text-gray-300 italic max-w-xl mx-auto">
            注意：本演示系统展示的数据包含基于历史公开数据的分析与预测。实际经济运行情况请以陕西省政府办公厅及统计局发布的年度统计公报为准。
          </p>
        </div>
      </motion.footer>
    </div>
  );
};

export default App;
