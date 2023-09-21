import React, { useEffect, useState, useContext, createContext } from 'react';
import Foot from './Foot'
import { useNavigate, useLocation } from 'react-router-dom';
import PopUp from './PopUp';

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
  headerName: {
    color: 'black',
    display: 'flex',
    justifyContent: 'space-between',
    margin: '5px'
  }
};

const photosStyles = {
  h3: {
    color: 'black',
    border: '2px solid red',
    marginBottom: '3px'
  },
  photoDiv: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap'
  }
};

function Profile() {

  const location = useLocation();
  const navigate = useNavigate();

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
      state: {id: location.state.id, tab: val}
    })
  }


  useEffect(() => {
    fetch("http://localhost:3001/profile/me/" + location.state.id + "/" + location.state.currentUserId, {
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
    fetch("http://localhost:3001/profile/" + location.state.id)
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error(error));
    console.log(posts)
  }, [user])

  const changeFollowStatus = async () => {
    const response = await fetch('http://localhost:3001/follow/' + location.state.id + "/" + location.state.currentUserId, {
      method: 'Put',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    setUser({ ...user, follow: !user.follow });
  }

  const hamburgerIcon = '../icon/hamburger.png'

  return (
    <div>
      {/* hamberburger menu*/}
      <div style={profileStyles.headerName}>{user.username} <img src={hamburgerIcon} style={profileStyles.hamburger} onClick={() => openPopup('settings')} />
      </div>

      {/* profile pic, username, bio tab */}
      <div style={{ display: 'flex', border: '2px solid blue' }}>
        <img src={user.avatarLink} alt="Profile Avatar" style={profileStyles.avatar} />
        <div style={{ border: '2px solid red', width: '295px' }}>
          <h3 style={profileStyles.username}>{user.username}</h3>
          <p style={{ color: 'black', fontSize: '8px' }}>{user.bio}</p>
        </div>
      </div>

      {/* number of post, followers, following */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'center', border: '2px solid black', height: 'auto' }}>
          <div style={{ width: '50px', height: '50px', margin: '0 25px', color: 'black', width: '100px', border: '2px solid red' }}>
            <span>{user.postCount}</span><br></br>
            <span>Posts</span>
          </div>
          <div style={{ width: '50px', height: '50px', margin: '0 25px', color: 'black', width: '100px', border: '2px solid red' }} onClick={()=> followFollowingPage('followers')}>
            <span>{user.followers}</span><br></br>
            <span>Followers</span>
          </div>
          <div style={{ width: '50px', height: '50px', margin: '0 25px', color: 'black', width: '100px', border: '2px solid red' }}  onClick={()=> followFollowingPage('following')}>
            <span>{user.following}</span><br></br>
            <span>Following</span>
          </div>
        </div>

        {/* edit button/ follow button/ unfollow button*/}
        {
          location.state.id == location.state.currentUserId ? (
            <button style={{ backgroundColor: "#458eff", width: '100%', height: '30px', borderRadius: '75px'}} onClick={() => openPopup('editProfile')}>Edit Profile</button>
          ) : (
            <button onClick={() => changeFollowStatus()} style={{ backgroundColor: "#458eff", width: '100%', height: '30px', borderRadius: '75px' }}>
              {user.follow === 0 ? 'Follow' : 'Unfollow'}
            </button>
          )
        }
      </div>

      {/* setting menu*/}
      {
        showPopUpMenu ?
          <PopUp popupType={popupMenu} onCloseMenu={closePopup}/> : <></>
      }

      {/* photos div*/}
      <div>
        <h3 style={photosStyles.h3}>Photos</h3>
        <div style={photosStyles.photoDiv}>
          {posts &&
            posts.map((post, index) => (
              <img src={post.imageLink} alt="Posted Photo" style={{ width: '132px', height: '122px', margin: '5px' }} />
            ))}
        </div>
      </div>

      <Foot />
    </div>
  );
}

export default Profile;