import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';
import Splash from './pages/Splash';
import Login from './pages/Login';
import MapView from './pages/MapView';
// StationDetail removido daqui
import Payment from './pages/Payment';
import PaymentStatus from './pages/PaymentStatus';
import ChargingStatus from './pages/ChargingStatus';
import Success from './pages/Success';
import { isAuthenticated } from './services/auth';
// Importar o novo componente
import InstallModal from './components/InstallModal';

/**
 * Main App component with routing
 */
function App(): JSX.Element {
  useEffect(() => {
    // Register service worker for PWA
    const updateSW = registerSW({
      onNeedRefresh(): void {
        // Optionally show a notification to the user
        console.info('New content available, please refresh.');
      },
      onOfflineReady(): void {
        console.info('App ready to work offline');
      },
    });

    // Check for updates periodically
    setInterval(
      () => {
        void updateSW(true);
      },
      60 * 60 * 1000,
    ); // Check every hour
  }, []);

  return (
    <>
      {/* O Modal de Instalação fica aqui, globalmente acessível */}
      <InstallModal />

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
        {/* Rota /station/:id removida */}
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
    </>
  );
}

/**
 * Protected route component - redirects to login if not authenticated
 */
function ProtectedRoute({ children }: { children: React.ReactNode }): JSX.Element {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default App;
