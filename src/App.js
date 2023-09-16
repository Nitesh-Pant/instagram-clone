import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login'
import Signup from './components/Signup';
import Footer from './components/Footer';
import AddPost from './components/AddPost';
import Profile from './components/Profile';
import Search from './components/Search';


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className='container'>
          <Routes>
              <Route exact path="/Footer" element={<Footer />} />
              <Route exact path="/Signup" element={<Signup />} />
              <Route exact path="/Login" element={<Login />} />
              <Route exact path="/AddPost" element={<AddPost />} />
              <Route exact path="/Profile" element={<Profile />} />
              <Route exact path='/Search' element={<Search/>} />
          </Routes>
        </div>
      </header>
    </div>
  );
}

export default App;