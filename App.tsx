import React, { useState } from 'react';
import { SalaryTicker } from './components/SalaryTicker';
import { ParticleBackground } from './components/ParticleBackground';
import { Controls } from './components/Controls';
import { AppState, SalaryConfig } from './types';

const App: React.FC = () => {
  const [config, setConfig] = useState<SalaryConfig>({
    amount: 10000, // Adjusted default to a common RMB amount
    currency: '¥',
    customMonth: new Date().toISOString().slice(0, 7), // Current YYYY-MM
  });

  const [appState, setAppState] = useState<AppState>(AppState.RUNNING);
  const [lowMotion, setLowMotion] = useState<boolean>(false);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 text-white selection:bg-purple-500 selection:text-white">
      {/* Background Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 opacity-90"></div>
        {!lowMotion && <ParticleBackground />}
        {/* Radial overlay for vignette effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none"></div>
      </div>

      {/* Main Content Layer */}
      <main className="relative z-10 flex flex-col items-center justify-center h-full w-full px-4">
        <SalaryTicker 
          config={config} 
          appState={appState} 
          lowMotion={lowMotion} 
        />
      </main>

      {/* Controls Layer - Sticky Bottom/Side */}
      <aside className="absolute bottom-0 left-0 right-0 z-20 p-6 flex justify-center transition-transform duration-300 hover:translate-y-0 translate-y-[calc(100%-4rem)] sm:translate-y-0 backdrop-blur-md sm:backdrop-blur-none bg-black/20 sm:bg-transparent border-t border-white/10 sm:border-none">
        <Controls 
          config={config} 
          setConfig={setConfig} 
          appState={appState}
          setAppState={setAppState}
          lowMotion={lowMotion}
          setLowMotion={setLowMotion}
        />
      </aside>
      
      <div className="absolute top-4 right-4 z-20 opacity-50 text-xs text-white/50 pointer-events-none font-mono">
        SalaryFlow v1.0 (CN)
      </div>
    </div>
  );
};

export default App;