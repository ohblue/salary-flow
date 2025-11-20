import React, { useEffect, useRef, useCallback } from 'react';
import { SalaryConfig, AppState } from '../types';

interface SalaryTickerProps {
  config: SalaryConfig;
  appState: AppState;
  lowMotion: boolean;
}

export const SalaryTicker: React.FC<SalaryTickerProps> = ({ config, appState, lowMotion }) => {
  const integerRef = useRef<HTMLSpanElement>(null);
  const decimalRef = useRef<HTMLSpanElement>(null);
  const percentageRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const requestRef = useRef<number | null>(null);

  // Calculate time constants for the selected month
  const getMonthData = useCallback(() => {
    const [year, month] = config.customMonth.split('-').map(Number);
    const startDate = new Date(year, month - 1, 1, 0, 0, 0).getTime();
    // Day 0 of next month is last day of current month
    const endDate = new Date(year, month, 1, 0, 0, 0).getTime(); 
    return { startDate, endDate, totalMs: endDate - startDate };
  }, [config.customMonth]);

  const updateDisplay = useCallback(() => {
    if (appState === AppState.PAUSED) return;

    const now = Date.now();
    const { startDate, totalMs } = getMonthData();
    
    // Calculate earnings
    let elapsed = now - startDate;
    // Clamp values
    if (elapsed < 0) elapsed = 0;
    if (elapsed > totalMs) elapsed = totalMs;

    const ratio = elapsed / totalMs;
    const currentEarned = config.amount * ratio;
    
    // Format numbers with zh-CN locale for correct commas
    // Increased to 6 decimal places for high-speed visual impact
    const formatted = currentEarned.toLocaleString('zh-CN', {
      minimumFractionDigits: 6,
      maximumFractionDigits: 6,
      useGrouping: true,
    });

    // Split for visual styling (integers big, decimals small)
    const [intPart, decPart] = formatted.split('.');

    // Direct DOM manipulation for performance (bypassing React render cycle)
    if (integerRef.current) integerRef.current.textContent = intPart;
    if (decimalRef.current) decimalRef.current.textContent = `.${decPart}`; // Show all 6 decimals
    
    // Update percentage bar/text
    if (percentageRef.current) {
      const monthName = new Date(startDate).toLocaleString('zh-CN', { month: 'long', year: 'numeric' });
      percentageRef.current.textContent = `${monthName} 进度: ${(ratio * 100).toFixed(7)}%`;
    }
    
    // Animation frame loop
    requestRef.current = requestAnimationFrame(updateDisplay);
  }, [appState, config.amount, getMonthData]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateDisplay);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [updateDisplay]);

  // Visual pulse effect trigger on "big" number changes (simulated)
  useEffect(() => {
    if (lowMotion) return;
    const interval = setInterval(() => {
      if (appState === AppState.RUNNING && containerRef.current) {
         // Subtle scale bounce
         containerRef.current.style.transform = 'scale(1.02)';
         setTimeout(() => {
            if(containerRef.current) containerRef.current.style.transform = 'scale(1)';
         }, 100);
      }
    }, 2000); // Pulse every 2 seconds
    return () => clearInterval(interval);
  }, [lowMotion, appState]);

  return (
    <div className="flex flex-col items-center justify-center text-center w-full max-w-7xl mx-auto">
       <div className="mb-4 text-purple-300/70 font-mono text-sm sm:text-lg tracking-widest uppercase">
         本月已赚取
       </div>

       <div 
         ref={containerRef}
         className={`relative font-black tabular-nums tracking-tighter transition-transform duration-100 ease-out select-none
           ${lowMotion ? '' : 'animate-glow drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]'}
         `}
       >
          <div className="flex items-baseline justify-center flex-wrap line-height-none">
            <span className="text-4xl sm:text-6xl lg:text-8xl text-purple-400 mr-2 sm:mr-4 self-start font-bold opacity-80">
              {config.currency}
            </span>
            
            {/* Massive Integer Part */}
            <span 
              ref={integerRef} 
              className="text-massive bg-clip-text text-transparent bg-gradient-to-b from-white to-purple-200 leading-none"
            >
              0
            </span>
            
            {/* Smaller Decimal Part (6 digits) */}
            <span 
              ref={decimalRef} 
              className="text-3xl sm:text-5xl lg:text-7xl text-purple-300/80 font-mono text-left w-auto ml-1"
            >
              .000000
            </span>
          </div>
       </div>

       {/* Progress Info */}
       <div 
         ref={percentageRef}
         className="mt-8 font-mono text-purple-200/50 text-xs sm:text-sm md:text-base"
       >
         计算中...
       </div>
    </div>
  );
};