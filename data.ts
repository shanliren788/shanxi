
import { CityData } from './types';

// Simplified realistic mock data for demonstration
export const SHANXI_CITIES: CityData[] = [
  {
    name: '西安市',
    region: 'Central',
    gdp2023: 12010.76,
    description: '国家中心城市，西北地区龙头，科技与文化中心。',
    history: Array.from({ length: 10 }, (_, i) => ({
      year: 2014 + i,
      gdp: 5400 + i * 650 + Math.random() * 200,
      breakdown: { energy: 10, tech: 60, realEstate: 30 }
    }))
  },
  {
    name: '榆林市',
    region: 'North',
    gdp2023: 7091.44,
    description: '中国能源矿产基地，资源型城市转型典范。',
    history: Array.from({ length: 10 }, (_, i) => ({
      year: 2014 + i,
      gdp: 3000 + i * 400 + Math.random() * 150,
      breakdown: { energy: 75, tech: 10, realEstate: 15 }
    }))
  },
  {
    name: '宝鸡市',
    region: 'Central',
    gdp2023: 2800.5,
    description: '关中-天水经济区副中心，先进制造业基地。',
    history: Array.from({ length: 10 }, (_, i) => ({
      year: 2014 + i,
      gdp: 1600 + i * 120 + Math.random() * 50,
      breakdown: { energy: 20, tech: 50, realEstate: 30 }
    }))
  },
  {
    name: '咸阳市',
    region: 'Central',
    gdp2023: 2900.2,
    description: '西安都市圈核心区，电子工业发达。',
    history: Array.from({ length: 10 }, (_, i) => ({
      year: 2014 + i,
      gdp: 1700 + i * 130 + Math.random() * 60,
      breakdown: { energy: 15, tech: 55, realEstate: 30 }
    }))
  },
  {
    name: '延安市',
    region: 'North',
    gdp2023: 2200.8,
    description: '红色革命圣地，石油天然气产业重要支撑。',
    history: Array.from({ length: 10 }, (_, i) => ({
      year: 2014 + i,
      gdp: 1200 + i * 100 + Math.random() * 40,
      breakdown: { energy: 70, tech: 10, realEstate: 20 }
    }))
  },
  {
    name: '汉中市',
    region: 'South',
    gdp2023: 2000.1,
    description: '陕南中心城市，生态环保与现代农业基地。',
    history: Array.from({ length: 10 }, (_, i) => ({
      year: 2014 + i,
      gdp: 1000 + i * 100 + Math.random() * 30,
      breakdown: { energy: 10, tech: 30, realEstate: 60 }
    }))
  },
  {
    name: '安康市',
    region: 'South',
    gdp2023: 1300.5,
    description: '汉江之滨，绿色循环产业先行者。',
    history: Array.from({ length: 10 }, (_, i) => ({
      year: 2014 + i,
      gdp: 700 + i * 60 + Math.random() * 20,
      breakdown: { energy: 5, tech: 35, realEstate: 60 }
    }))
  }
];
