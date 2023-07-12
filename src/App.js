import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Header from './components/common/header/Header';
import Footer from './components/common/footer/Footer';
import SignUp from './components/features/SignUp';
import Login from './components/features/Login';
// import Home from './components/features/Home';

function App() {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
          {/* <Route path="/stats" element={<Home />} /> */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
