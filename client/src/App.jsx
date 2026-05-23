import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';

// Dashboard Imports
import DashboardLayout from './components/Layout/Dashboard/DashboardLayout';
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import MyPrescriptions from './pages/patient/MyPrescriptions';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorAppointments from './pages/doctor/DoctorAppointments';
import MyPatients from './pages/doctor/MyPatients';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageDoctors from './pages/admin/ManageDoctors';
import ManagePatients from './pages/admin/ManagePatients';

// Wrapper to conditionally render Navbar based on path
const Layout = ({ children }) => {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/register', '/patient/dashboard', '/doctor/dashboard', '/admin/dashboard']; // Dashboards have their own sidebars
  // We can refine this logic to simply check if the path starts with /patient, /doctor, /admin
  const isDashboard = ['/patient', '/doctor', '/admin'].some(path => location.pathname.startsWith(path));
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <>
      {/* Show Main Navbar only if NOT a dashboard page and NOT an auth page */}
      {!isDashboard && !isAuthPage && <Navbar />} 
      {children}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Patient Routes */}
          <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
            <Route path="/patient" element={<DashboardLayout />}>
              <Route path="dashboard" element={<PatientDashboard />} />
              <Route path="book-appointment" element={<BookAppointment />} />
              <Route path="appointments" element={<MyAppointments />} />
              <Route path="prescriptions" element={<MyPrescriptions />} />
            </Route>
          </Route>

          {/* Protected Doctor Routes */}
          <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
             <Route path="/doctor" element={<DashboardLayout />}>
                <Route path="dashboard" element={<DoctorDashboard />} />
                <Route path="appointments" element={<DoctorAppointments />} />
                <Route path="patients" element={<MyPatients />} />
             </Route>
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
             <Route path="/admin" element={<DashboardLayout />}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="doctors" element={<ManageDoctors />} />
                <Route path="patients" element={<ManagePatients />} />
             </Route>
          </Route>
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;
