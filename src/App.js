import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Header from './components/common/header/Header';
import Footer from './components/common/footer/Footer';
import SignUp from './components/features/SignUp';
// import Login from './components/features/Login';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route
            path="/"
            element={<h1>Welcome to the Car Management System</h1>}
            // element={<Login /}
          />
          <Route path="/register" element={<SignUp />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
