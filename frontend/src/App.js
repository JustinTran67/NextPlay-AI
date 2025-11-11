// pages
import HomePage from './pages/HomePage';
import InputPage from './pages/InputPage';
import PredictionPage from './pages/PredictionPage';

//images
import logo from './assets/Logo.png';

// react router components: main router in index.js
import { Routes, Route, useNavigate } from 'react-router-dom';

function App() {

  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/');
  } 

  return (
    <div className="bg-primary min-h-screen text-light">
      <header className="">
        <button className="justify-left h-12 w-12 rounded-xl m-4 p-1 bg-secondary hover:bg-accent transition duration-200 ease-in-out" onClick={handleClick}><img src={logo} alt="NextPlay AI logo"></img></button>
      </header>
      <div className="flex items-center justify-center text-center">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/input" element={<InputPage />} />
          <Route path="/prediction" element={<PredictionPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;