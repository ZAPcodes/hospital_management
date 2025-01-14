import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import DietCharts from './pages/DietCharts';
import Meals from './pages/Meals';
import Deliveries from './pages/Deliveries';
import PantryStaff from './pages/PantryStaff';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          closeOnClick
          pauseOnHover
        />
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route 
                path="dashboard" 
                element={
                  <ProtectedRoute roles={['admin', 'manager', 'delivery', 'pantry']}>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="patients" 
                element={
                  <ProtectedRoute roles={['admin', 'manager']}>
                    <Patients />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="diet-charts" 
                element={
                  <ProtectedRoute roles={['admin', 'manager', 'pantry']}>
                    <DietCharts />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="meals" 
                element={
                  <ProtectedRoute roles={['admin', 'manager', 'pantry']}>
                    <Meals />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="deliveries" 
                element={
                  <ProtectedRoute roles={['admin', 'delivery']}>
                    <Deliveries />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="pantry-staff" 
                element={
                  <ProtectedRoute roles={['admin', 'pantry']}>
                    <PantryStaff />
                  </ProtectedRoute>
                } 
              />
            </Route>
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;

