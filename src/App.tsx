import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';
import Splash from './pages/Splash';
import Login from './pages/Login';
import MapView from './pages/MapView';
import StationDetail from './pages/StationDetail';
import Payment from './pages/Payment';
import PaymentStatus from './pages/PaymentStatus';
import ChargingStatus from './pages/ChargingStatus';
import Success from './pages/Success';
import { isAuthenticated } from './services/auth';
import { usePWAInstall } from './hooks/usePWAInstall';

/**
 * Main App component with routing
 */
function App() {
  const { showInstallPrompt, installApp } = usePWAInstall();

  useEffect(() => {
    // Register service worker for PWA
    const updateSW = registerSW({
      onNeedRefresh() {
        // Optionally show a notification to the user
        console.log('New content available, please refresh.');
      },
      onOfflineReady() {
        console.log('App ready to work offline');
      },
    });

    // Check for updates periodically
    setInterval(() => {
      updateSW(true);
    }, 60 * 60 * 1000); // Check every hour
  }, []);

  // Auto-show install prompt when app loads (if not already installed)
  useEffect(() => {
    // Only show on first visit, not if already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    const hasSeenPrompt = sessionStorage.getItem('pwa-install-prompt-shown');

    if (!isInstalled && !hasSeenPrompt && showInstallPrompt) {
      // Small delay to ensure page is fully loaded and user sees the app
      const timer = setTimeout(() => {
        installApp().then(() => {
          sessionStorage.setItem('pwa-install-prompt-shown', 'true');
        }).catch(() => {
          // User dismissed, don't show again this session
          sessionStorage.setItem('pwa-install-prompt-shown', 'true');
        });
      }, 3000); // 3 seconds delay to let user see the app first
      return () => clearTimeout(timer);
    }
  }, [showInstallPrompt, installApp]);

  return (
    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <MapView />
          </ProtectedRoute>
        }
      />
      <Route
        path="/station/:id"
        element={
          <ProtectedRoute>
            <StationDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment/:stationId"
        element={
          <ProtectedRoute>
            <Payment />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-status"
        element={
          <ProtectedRoute>
            <PaymentStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/charging"
        element={
          <ProtectedRoute>
            <ChargingStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/success"
        element={
          <ProtectedRoute>
            <Success />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

/**
 * Protected route component - redirects to login if not authenticated
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default App;

