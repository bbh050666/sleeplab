import React from 'react';
import { Calendar, Compass, FlaskConical, User } from 'lucide-react';

export type AppTab = 'today' | 'insights' | 'experiments' | 'me';

interface BottomTabBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
  activeExperimentDaysCount?: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  activeTab,
  onTabChange,
  activeExperimentDaysCount = 0,
}) => {
  const tabs = [
    {
      id: 'today' as AppTab,
      label: 'Today',
      icon: Calendar,
      badge: null,
    },
    {
      id: 'insights' as AppTab,
      label: 'Insights',
      icon: Compass,
      badge: '4',
    },
    {
      id: 'experiments' as AppTab,
      label: 'Experiments',
      icon: FlaskConical,
      badge: activeExperimentDaysCount > 0 ? `${activeExperimentDaysCount}/7` : null,
    },
    {
      id: 'me' as AppTab,
      label: 'Me',
      icon: User,
      badge: null,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-800 bg-slate-950/90 backdrop-blur-lg">
      <div className="mx-auto grid max-w-md grid-cols-4 items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="group relative flex min-h-[44px] min-w-[44px] flex-col items-center justify-center py-1 transition-colors"
            >
              <div className="relative">
                <Icon
                  className={`h-5 w-5 transition-transform duration-150 ${
                    isActive
                      ? 'text-indigo-400 scale-105'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-3 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-indigo-500/20 px-1 text-[9px] font-mono font-semibold text-indigo-300 border border-indigo-500/40">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`mt-1 text-[11px] font-medium tracking-tight whitespace-nowrap ${
                  isActive ? 'text-indigo-300' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 h-0.5 w-6 rounded-full bg-indigo-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
