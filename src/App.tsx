/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SleepProvider, useSleep } from './context/SleepContext';
import { Navigation } from './components/Navigation';
import { BottomTabBar, AppTab } from './components/BottomTabBar';
import { TodayView } from './components/TodayView';
import { InsightsView } from './components/InsightsView';
import { ExperimentsView } from './components/ExperimentsView';
import { MeView } from './components/MeView';
import { DiscoveryHubModal } from './components/DiscoveryHubModal';
import { MorningReflectionModal } from './components/MorningReflectionModal';

function AppContent() {
  const { activeExperiment, startExperiment } = useSleep();
  const [activeTab, setActiveTab] = useState<AppTab>('today');
  const [activeView, setActiveView] = useState<'app' | 'discovery'>('app');
  const [timeOfDayMode, setTimeOfDayMode] = useState<'auto' | 'morning' | 'evening'>('auto');
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);

  const activeExpDaysCount = activeExperiment
    ? Object.values(activeExperiment.adherence).filter(Boolean).length
    : 0;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Bar Contract (Wordmark — View Switchers — Context Action) */}
      <Navigation
        activeView={activeView}
        setActiveView={setActiveView}
        timeOfDayMode={timeOfDayMode}
        setTimeOfDayMode={setTimeOfDayMode}
        onOpenCheckIn={() => setIsCheckInModalOpen(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 w-full mx-auto px-4 sm:px-6 pt-6 pb-20">
        {activeView === 'discovery' ? (
          <DiscoveryHubModal
            onClose={() => setActiveView('app')}
            onOpenMorningCheckin={() => setIsCheckInModalOpen(true)}
          />
        ) : (
          <>
            {activeTab === 'today' && (
              <TodayView
                timeOfDayMode={timeOfDayMode}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}
            {activeTab === 'insights' && (
              <InsightsView
                onStartExperiment={(templateId) => {
                  startExperiment(templateId);
                  setActiveTab('experiments');
                }}
              />
            )}
            {activeTab === 'experiments' && <ExperimentsView />}
            {activeTab === 'me' && <MeView />}
          </>
        )}
      </main>

      {/* Global Morning Check-in Modal */}
      <MorningReflectionModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
      />

      {/* Mobile-First / Touch-Friendly Bottom Tab Bar (Only in App View) */}
      {activeView === 'app' && (
        <BottomTabBar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          activeExperimentDaysCount={activeExpDaysCount}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <SleepProvider>
      <AppContent />
    </SleepProvider>
  );
}
