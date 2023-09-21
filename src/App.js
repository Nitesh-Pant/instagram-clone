import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './components/Login'
import Signup from './components/Signup';
import Footer from './components/Footer';
import AddPost from './components/AddPost';
import Profile from './components/Profile';
import Search from './components/Search';
import { useState, createContext, useContext } from "react";
import ViewPost from './components/ViewPost';
import PrivateComponent from './components/PrivateComponent';
import FollowersFollowing from './components/FollowersFollowing';


export const context = createContext();

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [containerMode, setContainerMode] = useState('containerLight')

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    console.log('mode is: ', darkMode)
    if(darkMode){
      setContainerMode('containerDark')
    }
    else{
      setContainerMode('containerLight')
    }
  };

  return (
    <context.Provider value={{ darkMode, toggleDarkMode }}>
      <div className="App">
        <header className="App-header">
          <div className={containerMode}>
          {console.log({containerMode})}
            <Routes>
              <Route element={<PrivateComponent />} >
                <Route exact path="/Footer" element={<Footer />} />
                <Route exact path="/AddPost" element={<AddPost />} />
                <Route exact path="/Profile" element={<Profile />} />
                <Route exact path='/Search' element={<Search />} />
                <Route exact path='/ViewPost' element={<ViewPost />} />
                <Route exact path="/FollowersFollowing" element={<FollowersFollowing/>}/>
              </Route>

              <Route exact path="/Login" element={<Login />} />
              <Route exact path="/Signup" element={<Signup />} />
            </Routes>
          </div>
        </header>
      </div>
    </context.Provider>
  );
}

export default App;