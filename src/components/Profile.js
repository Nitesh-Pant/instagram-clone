import React, { useEffect, useState, useContext } from 'react';
import Foot from './Foot'
import { useNavigate, useLocation } from 'react-router-dom';
import PopUp from './PopUp';
import { localhost } from './api';
import { context } from '../App';

function Profile() {

  const location = useLocation();
  const { darkMode } = useContext(context)
  const navigate = useNavigate();

  const profileStyles = {

    avatar: {
      width: '120px',
      border: darkMode ? '2px solid white' : '2px solid black',
      height: '120px',
      borderRadius: '50%',
      objectFit: 'cover',
      margin: '4px 2px 4px 2px'
    },
    username: {
      margin: '10px 0px 2px 0px',
      color: darkMode ? 'white' : 'black',
      fontSize: '24px',
      fontWeight: 'bold'
    },

    stats: {
      display: 'flex',
      color: darkMode ? 'white' : 'black',
      justifyContent: 'space-around',
      width: '50%',
      margin: '20px 30px 0px 0px',
    },
    statItem: {
      textAlign: 'center',
      marginLeft: '20px'
    },
    hamburger: {
      width: '20px',
      height: '20px',
      margin: '10px 5px 5px 5px'
    },
    headerName: {
    //  border: '2px solid red',
      display: 'flex',
      justifyContent: 'space-between',
    },
    section: {
      height: '30px',
      margin: '3px',
    },
  };
  const photosContainerStyles = {
    maxHeight: '400px', // Set the maximum height for the photos section
    overflow: 'auto', // Enable scrolling if content exceeds the maximum height
  };

  const photosStyles = {
    h3: {
      color: darkMode ? 'white' : 'black',
     // border: '2px solid red',
      marginBottom: '3px'
    },
    photoDiv: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap'
    }
  };

  const [user, setUser] = useState({} | null)
  const [posts, setPosts] = useState([] | null)

  const [popupMenu, setPopupMenu] = useState(null);
  const [showPopUpMenu, setShowPopUpMenu] = useState(false);


  const openPopup = (menu) => {
    setPopupMenu(menu);
    setShowPopUpMenu(true)
  };
  const closePopup = () => {
    setShowPopUpMenu(false)
  };

  function followFollowingPage(val) {
    navigate("/FollowersFollowing", {
      state: { id: location.state.id, tab: val }
    })
  }


  useEffect(() => {
    fetch(`${localhost}/profile/me/${location.state.id}/${location.state.currentUserId}`, {
      method: 'Get',
      headers: {
        'authorization': localStorage.getItem('token')
      }
    })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error(error));
    console.log(user)
    console.log('currentId ', location.state.currentUserId)
  }, [location.state.id])

  useEffect(() => {
    fetch(`${localhost}/profile/${location.state.id}`)
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error(error));
    console.log(posts)
  }, [user])

  const changeFollowStatus = async () => {
    const response = await fetch(`${localhost}/follow/${location.state.id}/${location.state.currentUserId}`, {
      method: 'Put',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    setUser({ ...user, follow: !user.follow });
  }

  const hamburgerIcon = '../icon/hamburger.png'
  const hamburgerWhiteIcon = '../icon/hamburgerWhite.png'

  return (
    <div>
      {/* hamberburger menu*/}
      <div style={profileStyles.headerName}>
        <span style={profileStyles.section}>{user.username}</span>
        <img src={darkMode ? hamburgerWhiteIcon : hamburgerIcon} style={profileStyles.hamburger} onClick={() => openPopup('settings')} />
      </div>

      {/* profile pic, username, bio tab */}
      <div style={{ display: 'flex', /*border: '2px solid blue'*/ }}>
        <img src={user.avatarLink} alt="Profile Avatar" style={profileStyles.avatar} />
        <div style={{/* border: '2px solid red', */width: '250px' }}>
          <h3 style={profileStyles.username}>{user.username}</h3>
          <p style={{ color: darkMode ? 'white' : 'black', fontSize: '9px' }}>{user.bio}</p>
        </div>
      </div>

      {/* number of post, followers, following */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', /*border: '2px solid black'*/ }}>
          <div style={{ width: 'auto', height: '60px', margin: '0 25px', color: darkMode ? 'white' : 'black', /*border: '2px solid red'*/ }}>
            <span>{user.postCount}</span><br></br>
            <span>Posts</span>
          </div>
          <div style={{ width: 'auto', height: '60px', margin: '0 25px', color: darkMode ? 'white' : 'black', /*border: '2px solid red' */}} onClick={() => followFollowingPage('followers')}>
            <span>{user.followers}</span><br></br>
            <span>Followers</span>
          </div>
          <div style={{ width: 'auto', height: '60px', margin: '0 25px', color: darkMode ? 'white' : 'black', /*border: '2px solid red' */}} onClick={() => followFollowingPage('following')}>
            <span>{user.following}</span><br></br>
            <span>Following</span>
          </div>
        </div>

        {/* edit button/ follow button/ unfollow button*/}
        {
          location.state.id == location.state.currentUserId ? (
            <button class="btn btn-primary" style={{ width: '90%', height: '35px', margin: '5px 0px', borderRadius: '75px', textAlign: 'center', lineHeight: '10px' }} onClick={() => openPopup('editProfile')}>Edit Profile</button>
          ) : (
            <button onClick={() => changeFollowStatus()} class="btn btn-primary" style={{ width: '100%', height: '30px', borderRadius: '75px' }}>
              {user.follow === 0 ? 'Follow' : 'Unfollow'}
            </button>
          )
        }
      </div>

      {/* setting menu*/}
      {
        showPopUpMenu ?
          <PopUp popupType={popupMenu} onCloseMenu={closePopup} /> : <></>
      }

      {/* photos div*/}
      <h3 style={photosStyles.h3}>Photos</h3>
      <div style={photosContainerStyles}>
        <div style={photosStyles.photoDiv}>
          {posts &&
            posts.map((post, index) => (
              <div key={index}>
                {post.type === "video" ? (
                  <video width={'132px'} height={'222px'} style={{ margin: '5px' }} alt="Posted Video" controls>
                    <source src={`${localhost}/${post.postLink}`} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={`${localhost}/${post.postLink}`}
                    alt="Posted Photo"
                    style={{ width: '132px', height: '122px', margin: '5px' }}
                  />
                )}
              </div>
            ))}
        </div>
      </div>

      <Foot />
    </div>
  );
}

export default Profile;


{/**
import React, { useEffect, useState, useContext } from 'react';
import Foot from './Foot';
import { useNavigate, useLocation } from 'react-router-dom';
import PopUp from './PopUp';
import { localhost } from './api';
import { context } from '../App';

function Profile() {
  const location = useLocation();
  const { darkMode } = useContext(context);
  const navigate = useNavigate();

  const profileStyles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: '16px',
    },
    avatar: {
      width: '120px',
      height: '120px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: darkMode ? '2px solid white' : '2px solid black',
    },
    username: {
      margin: '10px 0px 2px 0px',
      color: darkMode ? 'white' : 'black',
      fontSize: '24px',
      fontWeight: 'bold',
    },
    bio: {
      color: darkMode ? 'white' : 'black',
      fontSize: '14px',
      textAlign: 'center',
      maxWidth: '300px',
    },
    stats: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '16px',
      marginTop: '20px',
    },
    statItem: {
      textAlign: 'center',
    },
    button: {
      width: '100%',
      height: '30px',
      borderRadius: '4px',
      fontSize: '14px',
      fontWeight: 'bold',
      cursor: 'pointer',
      border: darkMode ? '1px solid white' : '1px solid black',
      backgroundColor: darkMode ? 'transparent' : '#0095f6',
      color: darkMode ? 'white' : 'white',
    },
    photosContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      maxWidth: '800px',
      margin: '16px auto',
      padding: '8px',
      gap: '8px',
    },
    photo: {
      width: 'calc(33.33% - 8px)',
      height: 'auto',
      objectFit: 'cover',
      borderRadius: '4px',
      cursor: 'pointer',
    },
    hamburger: {
        width: '20px',  // Adjust the width as needed
        height: '20px', // Adjust the height as needed
        margin: '10px 5px 5px 5px'
    },
  };

  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [popupMenu, setPopupMenu] = useState(null);
  const [showPopUpMenu, setShowPopUpMenu] = useState(false);

  const openPopup = (menu) => {
    setPopupMenu(menu);
    setShowPopUpMenu(true);
  };

  const closePopup = () => {
    setShowPopUpMenu(false);
  };

  function followFollowingPage(val) {
    navigate('/FollowersFollowing', {
      state: { id: location.state.id, tab: val },
    });
  }

  useEffect(() => {
    fetch(`${localhost}/profile/me/${location.state.id}/${location.state.currentUserId}`, {
      method: 'Get',
      headers: {
        'authorization': localStorage.getItem('token'),
      },
    })
      .then((response) => response.json())
      .then((data) => setUser(data))
      .catch((error) => console.error(error));
  }, [location.state.id]);

  useEffect(() => {
    fetch(`${localhost}/profile/${location.state.id}`)
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error(error));
  }, [user]);

  const changeFollowStatus = async () => {
    const response = await fetch(`${localhost}/follow/${location.state.id}/${location.state.currentUserId}`, {
      method: 'Put',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    setUser({ ...user, follow: !user.follow });
  };

  const hamburgerIcon = '../icon/hamburger.png';
  const hamburgerWhiteIcon = '../icon/hamburgerWhite.png';

  return (
    <div style={profileStyles.container}>
      <div style={profileStyles.header}>
        <span>{user.username}</span>
        <img src={darkMode ? hamburgerWhiteIcon : hamburgerIcon} style={profileStyles.hamburger} onClick={() => openPopup('settings')} />
      </div>
      <img src={user.avatarLink} alt="Profile Avatar" style={profileStyles.avatar} />
      <span style={profileStyles.username}>{user.username}</span>
      <p style={profileStyles.bio}>{user.bio}</p>
      <div style={profileStyles.stats}>
        <div style={profileStyles.statItem}>
          <span>{user.postCount}</span>
          <span>Posts</span>
        </div>
        <div style={profileStyles.statItem} onClick={() => followFollowingPage('followers')}>
          <span>{user.followers}</span>
          <span>Followers</span>
        </div>
        <div style={profileStyles.statItem} onClick={() => followFollowingPage('following')}>
          <span>{user.following}</span>
          <span>Following</span>
        </div>
      </div>
      {location.state.id !== location.state.currentUserId && (
        <button onClick={() => changeFollowStatus()} style={profileStyles.button}>
          {user.follow === 0 ? 'Follow' : 'Unfollow'}
        </button>
      )}
      {showPopUpMenu ? <PopUp popupType={popupMenu} onCloseMenu={closePopup} /> : <></>}
      <h3 style={profileStyles.h3}>Photos</h3>
      <div style={profileStyles.photosContainer}>
        {posts &&
          posts.map((post, index) => (
            <img
              key={index}
              src={`${localhost}/${post.postLink}`}
              alt="Posted Photo"
              style={profileStyles.photo}
            />
          ))}
      </div>
      <Foot />
    </div>
  );
}

export default Profile;
*/}