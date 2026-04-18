import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PassengerDashboard from './pages/PassengerDashboard';
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
import AlertBanner from './components/Feedback/AlertBanner';
import ChatbotWidget from './components/Chatbot/ChatbotWidget';
import { Train, ShieldAlert } from 'lucide-react';
import { useAppContext } from './store/AppContext';

function App() {
  const { simulation } = useAppContext();
  
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-white flex flex-col relative overflow-hidden">
        {/* Global Feedback Elements */}
        {simulation.isEvacuationMode && (
          <div className="bg-danger text-white text-center py-2 font-bold animate-pulse">
            EMERGENCY EVACUATION IN PROGRESS. PLEASE FOLLOW EXIT SIGNS.
          </div>
        )}
        <AlertBanner />
        
        {/* Header */}
        <header className="glass-panel sticky top-0 z-40 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Train className="text-primary w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Dhanbad Smart Station
              </h1>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-safe"></span>
                </span>
                <span>Live System Active • {simulation.timeOfDay}</span>
              </div>
            </div>
          </div>
          
          <nav className="flex space-x-4 text-sm">
            <Link to="/" className="hover:text-primary transition-colors">Passenger View</Link>
            <Link to="/admin" className="hover:text-primary transition-colors flex items-center gap-1">
              <ShieldAlert className="w-4 h-4"/> Admin
            </Link>
          </nav>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <React.Suspense fallback={
            <div className="flex h-full items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          }>
            <Routes>
              <Route path="/" element={<PassengerDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </React.Suspense>
        </main>

        <ChatbotWidget />
      </div>
    </BrowserRouter>
  );
}

export default App;
