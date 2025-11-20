import React from 'react';
import { SalaryConfig, AppState } from '../types';

interface ControlsProps {
  config: SalaryConfig;
  setConfig: React.Dispatch<React.SetStateAction<SalaryConfig>>;
  appState: AppState;
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  lowMotion: boolean;
  setLowMotion: (val: boolean) => void;
}

export const Controls: React.FC<ControlsProps> = ({
  config,
  setConfig,
  appState,
  setAppState,
  lowMotion,
  setLowMotion
}) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setConfig(prev => ({ ...prev, amount: isNaN(val) ? 0 : val }));
  };

  const togglePause = () => {
    setAppState(prev => prev === AppState.RUNNING ? AppState.PAUSED : AppState.RUNNING);
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-lg border border-slate-700 rounded-2xl p-4 shadow-2xl flex flex-col gap-4 w-full max-w-md mx-auto transition-all hover:border-purple-500/50">
      
      {/* Top Row: Inputs */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-400 uppercase font-bold">月薪 (RMB)</label>
          <div className="relative">
             <span className="absolute left-3 top-2 text-slate-400">¥</span>
             <input 
              type="number" 
              value={config.amount}
              onChange={handleAmountChange}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 pl-7 pr-2 focus:outline-none focus:border-purple-500 text-white font-mono"
            />
          </div>
        </div>
        
        <div className="flex flex-col gap-1">
           <label className="text-xs text-slate-400 uppercase font-bold">选择月份</label>
           <input 
              type="month" 
              value={config.customMonth}
              onChange={(e) => setConfig(prev => ({ ...prev, customMonth: e.target.value }))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg py-2 px-3 focus:outline-none focus:border-purple-500 text-white font-mono appearance-none"
            />
        </div>
      </div>

      {/* Bottom Row: Actions */}
      <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-700/50">
        
        <button 
          onClick={togglePause}
          className={`
            flex-1 py-2 px-4 rounded-lg font-bold text-sm transition-all active:scale-95
            ${appState === AppState.RUNNING 
              ? 'bg-slate-700 hover:bg-slate-600 text-slate-200' 
              : 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]'}
          `}
        >
          {appState === AppState.RUNNING ? '暂 停' : '继 续'}
        </button>

        <button
          onClick={() => setLowMotion(!lowMotion)}
          className={`
             p-2 rounded-lg transition-colors text-xs font-mono flex flex-col items-center gap-1
             ${lowMotion ? 'text-green-400 bg-green-400/10' : 'text-slate-500 hover:text-slate-300'}
          `}
          title="开启/关闭低动态模式"
        >
          <span>低动态模式</span>
          <div className={`w-8 h-4 rounded-full relative ${lowMotion ? 'bg-green-500' : 'bg-slate-600'}`}>
            <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${lowMotion ? 'left-4.5' : 'left-0.5'}`}></div>
          </div>
        </button>

      </div>
    </div>
  );
};