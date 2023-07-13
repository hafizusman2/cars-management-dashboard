import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from 'react-router-dom';
import Header from './components/common/header/Header';
import Footer from './components/common/footer/Footer';
import SignUp from './components/features/SignUp';
import Login from './components/features/Login';
import Home from './components/features/Home';
import NotFound from './pages/NotFound';
import Dashboard from './components/features/Dashboard';
import ProtectedRoutes from './components/common/ProtectedRoutes';
import { useState, useEffect } from 'react';
import { isAuthenticated } from './api/auth';

function App() {
  const [currentLocation, setCurrentLocation] = useState('Dashboard');
  const [authenticated, setAuthenticated] = useState(false);
  const checkAuthentication = async () => {
    try {
      const checkAuthentication = await isAuthenticated();
      setAuthenticated(checkAuthentication);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  const handleLogout = () => {
    setAuthenticated(false); // Set authentication status to false after logout
  };
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              authenticated ? (
                <Navigate to="/stats" replace />
              ) : (
                <Login onLogin={checkAuthentication} />
              )
            }
          />
          <Route
            path="/register"
            element={
              authenticated ? <Navigate to="/stats" replace /> : <SignUp />
            }
          />
          <Route element={<ProtectedRoutes authenticated={authenticated} />}>
            <Route
              path="/stats/"
              element={
                <Home
                  currentLocation={currentLocation}
                  onLogout={handleLogout}
                />
              }
            >
              <Route
                path="/stats/"
                element={<Dashboard setCurrentLocation={setCurrentLocation} />}
              />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
