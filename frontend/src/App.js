// pages
import HomePage from './pages/HomePage';
import InputPage from './pages/InputPage';
import PredictionPage from './pages/PredictionPage';

//images
import logo from './assets/Logo.png';
import { ReactComponent as Github } from './assets/githublogo.svg';
import { ReactComponent as Linkedin } from './assets/linkedinlogo.svg';
import { ReactComponent as Instagram } from './assets/instagramlogo.svg';

// react router components: main router in index.js
import { Routes, Route, useNavigate } from 'react-router-dom';

function App() {

  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/');
  } 

  return (
    <div className="bg-primary min-h-screen text-light font-inter font-light">
      <header className="fixed top-0, left-0 z-[9999]">
        <button className="justify-left h-12 w-12 rounded-xl m-4 p-1 bg-secondary hover:bg-accent transition duration-200 ease-in-out" onClick={handleClick}>
          <img className="hover:animate-oneSpin" src={logo} alt="NextPlay logo"></img>
        </button>
      </header>
      <div className="flex items-center justify-center text-center mb-40">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/input" element={<InputPage />} />
          <Route path="/prediction" element={<PredictionPage />} />
        </Routes>
      </div>
      <div className="flex items-center justify-center w-screen h-[200px] bg-secondary">
        <a className="w-8 h-8 m-4" href="https://github.com/JustinTran67" target="_blank" rel="noopener noreferrer"><Github className="fill-primary hover:fill-nbared transition duration-200 ease-in-out" /></a>
        <a className="w-8 h-8 m-4" href="https://www.linkedin.com/in/justin-tran-902938355/" target="_blank" rel="noopener noreferrer"><Linkedin className="fill-primary hover:fill-nbared transition duration-200 ease-in-out" /></a>
        <a className="w-8 h-8 m-4" href="https://www.instagram.com/justin.t.tran/" target="_blank" rel="noopener noreferrer"><Instagram className="fill-primary hover:fill-nbared transition duration-200 ease-in-out"/></a>
      </div>
    </div>
  );
}

export default App;