export interface TVResult {
  best: number;
  good: number;
}

export interface MonitorSpec {
  size: number;
  res: string;
  resolution: string;
  ppi: number;
  notes: string;
  tags: string[];
}

export interface ProcessedMonitor extends MonitorSpec {
  ppiDiff: number;
  isAcceptable: boolean;
  isBest: boolean;
  displayName: string;
}

export interface MonitorCategory {
  name: { en: string; zh: string };
  monitors: ProcessedMonitor[];
}

export interface MonitorResult {
  idealPPI: number;
  categories: {
    standard: MonitorCategory;
    ultrawide: MonitorCategory;
    superwide: MonitorCategory;
  };
}

export type CategoryKey = 'standard' | 'ultrawide' | 'superwide';
export type FilterType = 'all' | 'gaming' | 'productivity';
export type UnitType = 'imperial' | 'metric';
