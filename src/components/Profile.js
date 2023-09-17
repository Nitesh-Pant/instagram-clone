import React, { useEffect, useState, useContext, createContext } from 'react';
import Foot from './Foot'
import { useLocation } from 'react-router-dom';
import { context } from '../App';

const profileStyles = {
  
  avatar: {
    width: '125px',
    border: '2px solid black',
    height: '125px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginTop: '6px'
  },
  username: {
    marginTop: '10px',
    color: 'black',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '2px'
  },
  
  stats: {
    display: 'flex',
    color: 'black',
    justifyContent: 'space-around',
    width: '50%',
    marginTop: '20px',
    marginLeft: '40px',
  },
  statItem: {
    textAlign: 'center',
    marginLeft: '60px'
  },
  hamburger: {
    width: '20px',
    height: '20px',
    marginTop: '5px'
  },
  navBar: {
    background: 'grey',
    color: 'white',
    width: '100px',
    borderRadius: '5px',
    fontSize: '12px',
    position: 'fixed',
    display: 'inline-block',
    margin: '30px 0px 0px 330px'
  },
  navList: {
    listStyle: 'none',
    padding: 0,
  },
  navItem: {
    marginBottom: '5px',
  },
};

function Profile() {

    const location = useLocation();
    const { darkMode, toggleDarkMode } = useContext(context);


    const [user, setUser] = useState({} | null)
    const [posts, setPosts] = useState([] | null)

    const [showNavBar, setShowNavBar] = useState(false);


    const toggleNavBar = () => {
      setShowNavBar(!showNavBar);
    };
    const darkModeChange = () => {
      console.log('dark mode is: ', darkMode)
      toggleDarkMode()
    };

    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => {
      setIsPopupOpen(true);
    };

    const closePopup = () => {
      setIsPopupOpen(false);
    };


    useEffect(() => {
        fetch("http://localhost:3001/profile/me/" + location.state.id + "/" + location.state.currentUserId)
        .then(response => response.json() )
        .then(data => setUser(data))
        .catch(error => console.error(error));
        console.log(user)
        console.log('currentId ',  location.state.currentUserId)
    },[location.state.id])

    useEffect(() => {
        fetch("http://localhost:3001/profile/" + location.state.id)
        .then(response => response.json() )
        .then(data => setPosts(data))
        .catch(error => console.error(error));
        console.log(posts)
    },[user])

    const changeFollowStatus = async () => {
      const response = await fetch('http://localhost:3001/follow/' + location.state.id + "/" + location.state.currentUserId, {
            method: 'Put',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        setUser({...user, follow: !user.follow});
    }

  const hamburgerIcon = '../icon/hamburger.png'


  return (
    <div>
      <div style={{'color': 'black', display: 'flex', justifyContent: 'space-between', 'margin': '5px'}}>{user.username} <img src={hamburgerIcon} style={profileStyles.hamburger} onClick={() => toggleNavBar()}/>
      {showNavBar && (
        <div style={profileStyles.navBar}>
          <ul style={profileStyles.navList}>
            <li onClick={()=> darkModeChange()}>Dark Mode</li>
          </ul>
        </div>
      )}
      {/* Rest of your component */}</div>
      <div style={{display: 'flex', border: '2px solid blue'}}>
        <img
            src={user.avatarLink}
            alt="Profile Avatar"
            style={profileStyles.avatar}
          />
          <div style={{border: '2px solid red'}}>
            <h3 style={profileStyles.username}>{user.username}</h3>
            <p style={{color: 'black', fontSize: '8px'}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
          </div>
          </div>

          <div>
          <div style={{ display: 'flex', justifyContent: 'center', border: '2px solid black', height: 'auto'}}>
            <div style={{ width: '50px', height: '50px',  margin: '0 25px', color: 'black', width: '100px', border: '2px solid red'}}>
              <span>{user.postCount}</span><br></br>
              <span>Posts</span>
            </div>
            <div style={{ width: '50px', height: '50px',  margin: '0 25px', color: 'black', width: '100px', border: '2px solid red'}}>
                <span>200</span><br></br>
                <span>Followers</span>
            </div>
            <div style={{ width: '50px', height: '50px',  margin: '0 25px', color: 'black', width: '100px', border: '2px solid red'}}>
              <span>300</span><br></br>
              <span>Following</span>
            </div>
          </div>


          {
            location.state.id == location.state.currentUserId ? (
              <button style={{backgroundColor: "#458eff", width: '100%', height: '30px', borderRadius: '75px'}}onClick={openPopup}>Edit Profile</button>
            ) : (
            <button onClick={() => changeFollowStatus()} style={{backgroundColor: "#458eff", width: '100%', height: '30px', borderRadius: '75px'}}>
                {user.follow === 0 ? 'Follow' : 'Unfollow'}
              </button>
            )
          }

          {isPopupOpen && (
          <div
            style={{
              position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '999',
            }}
          >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '5px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              maxWidth: '500px',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                cursor: 'pointer',
                color: 'black'
              }}
              onClick={closePopup}
            >
              &times;
            </span>
            <h2 style={{color: 'black'}}>Edit Profile</h2>
            <p style={{color: 'black'}}>Change username, bio, avatar</p>
          </div>
          </div>
)}
          
      </div>
        
      <div>
        <h3  style={{ color: 'black', border: '2px solid red', marginBottom: '3px'}}>Photos</h3>
        <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap'}}>
          {/* Replace the image URLs with your actual photos */}
          {posts &&
          posts.map((post, index)=> (
              <img src={post.imageLink} alt="Posted Photo" style={{width: '132px', height: '122px', margin: '5px'}}/>
          ))}
        </div>
      </div>
      
      <Foot />
    </div>
  );
}

export default Profile;