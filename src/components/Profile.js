import React, { useEffect, useState } from 'react';
import Foot from './Foot'
import { useLocation } from 'react-router-dom';

const profileStyles = {
  
  avatar: {
    width: '150px',
    border: '2px solid black',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
  },
  username: {
    marginTop: '10px',
    color: 'black',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: 'auto auto auto',
    padding: '10px',
    paddingTop: '0px'
  },
  gridItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid rgba(0, 0, 0, 0.8)',
    padding: '2px',
    fontSize: '30px',
    textAlign: 'center',
    width: '130px',
    height: '100px'
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
};


function Profile() {

    const location = useLocation();

    const [user, setUser] = useState({} | null)
    const [posts, setPosts] = useState([] | null)

    useEffect(() => {
        fetch("http://localhost:3001/profile/me/" + location.state.id + "/" + location.state.currentUserId)
        .then(response => response.json() )
        .then(data => setUser(data))
        .catch(error => console.error(error));
        console.log(user)
    },[])

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


  return (
    <div>
      <div>
        <img
            src={user.avatarLink}
            alt="Profile Avatar"
            style={profileStyles.avatar}
          />
          <h1 style={profileStyles.username}>{user.username}</h1>

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
            location.state.id !== location.state.currentUserId && (
              <button onClick={() => changeFollowStatus()}>
                {user.follow === 0 ? 'Follow' : 'Unfollow'}
              </button>)
          }
          
      </div>
        
      <div>
        <h3  style={{ color: 'black', border: '2px solid red',  marginBottom: '0px'}}>Photos</h3>
        <div style={profileStyles.gridContainer}>
          {/* Replace the image URLs with your actual photos */}
          {posts &&
          posts.map((post, index)=> (
              <img src={post.imageLink} alt="Posted Photo" style={profileStyles.gridItem} />
          ))}
        </div>
      </div>
      
      <Foot />
    </div>
  );
}

export default Profile;