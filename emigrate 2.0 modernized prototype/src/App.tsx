/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { EmigrateProvider, useEmigrate } from './context/EmigrateContext';
import { Header } from './components/Header';
import { PortalTutorialModal } from './components/PortalTutorialModal';
import { HomeView } from './components/HomeView';
import { EmigrantForm } from './components/EmigrantForm';
import { EmployerForm } from './components/EmployerForm';
import { RecruitingAgentForm } from './components/RecruitingAgentForm';
import { ProjectExporterForm } from './components/ProjectExporterForm';
import { WelfareSchemesView } from './components/WelfareSchemesView';
import { DirectoryView } from './components/DirectoryView';
import { AlertsView } from './components/AlertsView';
import { PoeDashboard } from './components/PoeDashboard';
import { PgeDashboard } from './components/PgeDashboard';
import { MissionDashboard } from './components/MissionDashboard';
import { ResourcesView } from './components/ResourcesView';
import { ContractPassModal } from './components/ContractPassModal';
import { RaCertificateModal } from './components/Certificates/RaCertificateModal';
import { FeAttestationModal } from './components/Certificates/FeAttestationModal';
import { EmigrateMitra } from './components/EmigrateMitra';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { activeView, fontScale, darkMode } = useEmigrate();

  // Dynamic font scaling classes
  const fontClass =
    fontScale === 'sm' ? 'text-xs' : fontScale === 'lg' ? 'text-base' : 'text-sm';

  const renderActiveView = () => {
    switch (activeView) {
      case 'home':
        return <HomeView />;
      case 'emigrant':
        return <EmigrantForm />;
      case 'employer':
        return <EmployerForm />;
      case 'recruiting-agent':
        return <RecruitingAgentForm />;
      case 'project-exporter':
        return <ProjectExporterForm />;
      case 'resources':
        return <ResourcesView />;
      case 'welfare':
        return <WelfareSchemesView />;
      case 'directory':
        return <DirectoryView />;
      case 'alerts':
        return <AlertsView />;
      case 'poe-dashboard':
        return <PoeDashboard />;
      case 'pge-dashboard':
        return <PgeDashboard />;
      case 'mission-dashboard':
        return <MissionDashboard />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans selection:bg-amber-100 selection:text-navy-900 ${
        darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
      } ${fontClass}`}
    >
      {/* Institutional Header & Navigation */}
      <Header />

      {/* Main View Container */}
      <main className="flex-1 w-full">{renderActiveView()}</main>

      {/* Institutional Footer */}
      <Footer />

      {/* Persistent Global Modals & Interactive Overlays */}
      <PortalTutorialModal />
      <ContractPassModal />
      <RaCertificateModal />
      <FeAttestationModal />
      <EmigrateMitra />
    </div>
  );
};

export default function App() {
  return (
    <EmigrateProvider>
      <AppContent />
    </EmigrateProvider>
  );
}
