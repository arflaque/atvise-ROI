import { Navigate, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { ROIStateProvider } from './hooks/useROIState';

const ContextTab = lazy(() => import('./components/tabs/ContextTab'));
const ModulesTab = lazy(() => import('./components/tabs/ModulesTab'));
const ResultsTab = lazy(() => import('./components/tabs/ResultsTab'));
const ReportTab = lazy(() => import('./components/tabs/ReportTab'));

export default function App() {
  return (
    <ROIStateProvider>
      <AppLayout>
        <Suspense fallback={<TabLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/context" replace />} />
            <Route path="/context" element={<ContextTab />} />
            <Route path="/modules" element={<ModulesTab />} />
            <Route path="/results" element={<ResultsTab />} />
            <Route path="/report" element={<ReportTab />} />
            <Route path="*" element={<Navigate to="/context" replace />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </ROIStateProvider>
  );
}

function TabLoader() {
  return (
    <div className="flex h-[60vh] items-center justify-center text-text-secondary">
      <div className="flex items-center gap-3">
        <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
        <span className="font-label text-label">LOADING</span>
      </div>
    </div>
  );
}
