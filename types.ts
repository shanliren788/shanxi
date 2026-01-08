
export interface IndustryBreakdown {
  energy: number;
  tech: number;
  realEstate: number;
}

export interface YearData {
  year: number;
  gdp: number;
  breakdown: IndustryBreakdown;
}

export interface CityData {
  name: string;
  region: 'North' | 'Central' | 'South';
  gdp2023: number;
  history: YearData[];
  description: string;
}

export interface RegionSummary {
  name: string;
  cities: CityData[];
  totalGDP: number;
}
