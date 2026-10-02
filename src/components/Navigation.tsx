import React from 'react';
import { Sparkles, FlaskConical, Sun, Moon } from 'lucide-react';

interface NavigationProps {
  activeView: 'app' | 'discovery';
  setActiveView: (view: 'app' | 'discovery') => void;
  timeOfDayMode: 'auto' | 'morning' | 'evening';
  setTimeOfDayMode: (mode: 'auto' | 'morning' | 'evening') => void;
  onOpenCheckIn: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeView,
  setActiveView,
  timeOfDayMode,
  setTimeOfDayMode,
  onOpenCheckIn,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        {/* Zone 1: Single element brand wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('app')}
            className="flex items-center gap-2.5 text-left text-lg font-semibold tracking-tight text-white hover:text-indigo-300 transition-colors"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <FlaskConical className="h-4 w-4" />
            </div>
            <span>Sleep Lab</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links / View Switcher */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <div className="flex items-center rounded-lg bg-slate-900 p-1 border border-slate-800">
            <button
              onClick={() => setActiveView('app')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeView === 'app'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              App Experience
            </button>
            <button
              onClick={() => setActiveView('discovery')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeView === 'discovery'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
              <span>Discovery & 8 Interviews</span>
            </button>
          </div>
        </nav>

        {/* Zone 3: 1-2 Primary contextual actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Day / Evening context simulator */}
          <div className="hidden sm:flex items-center rounded-lg bg-slate-900 border border-slate-800 p-0.5">
            <button
              title="Simulate Morning reflection"
              onClick={() => setTimeOfDayMode(timeOfDayMode === 'morning' ? 'auto' : 'morning')}
              className={`flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors ${
                timeOfDayMode === 'morning' ? 'bg-amber-500/20 text-amber-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              title="Simulate Evening wind-down"
              onClick={() => setTimeOfDayMode(timeOfDayMode === 'evening' ? 'auto' : 'evening')}
              className={`flex h-7 w-7 items-center justify-center rounded-md text-xs transition-colors ${
                timeOfDayMode === 'evening' ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </div>

          <button
            onClick={onOpenCheckIn}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-indigo-500 active:scale-[0.98] transition-all whitespace-nowrap shadow-sm shadow-indigo-500/20"
          >
            <span>Morning Check-in</span>
            <span className="hidden md:inline text-[10px] text-indigo-200 font-mono">(&lt;30s)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
