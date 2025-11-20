export interface SalaryConfig {
  amount: number;
  currency: string;
  customMonth: string; // YYYY-MM
}

export interface TimeData {
  totalMs: number;
  elapsedMs: number;
  percentage: number;
}

export enum AppState {
  RUNNING = 'RUNNING',
  PAUSED = 'PAUSED',
}