import React, { useEffect, useState, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import Foot from './Foot'
import { localhost } from './api';
import { context } from '../App';

function AddPost() {
  const navigate = useNavigate();
  const { darkMode } = useContext(context)

  const styles = {
    addButton: {
      width: '300px',
      height: '40px',
      bottom: 50,
      margin: '10px'
    },
    main: {
      display: 'flex',
      height: '60px',
      margin: '10px',
     // border: '2px solid blue'
    },
    heading: {
      color: darkMode ? 'white' : 'black',
      margin: '10px',
      marginLeft: '90px',
      paddingTop: '4px'
    },
    input: {
      flex: 1,
      width: '350px',
      padding: '20px',
      margin: '10px',
      height: '15px',
      textAlign: 'center',
      borderTopStyle: 'none',
      borderRightStyle: 'none',
      borderLeftStyle: 'none',
    },
    btn: {
     // border: '2px soild red'
    },
    mid: {
    //  border: '5px solid black',
      position: 'absolute',
      maxWidth: '70vh',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      padding: '10px'
    },
  }
  const backIcon = '../icon/back.png';
  const backWhiteIcon = '../icon/backWhite.png';
  const cameraIcon = '../icon/camera.png';
  const cameraWhiteIcon = '../icon/cameraWhite.png';
  const reelsIcon = '../icon/reels.png'
  const reelsWhiteIcon = '../icon/reelsWhite.png'


  function back() {
    navigate('/Footer')
  }
  const [post, setPost] = useState(null);
  const [caption, setCaption] = useState(null)
  const [mode, setMode] = useState('image');

  const changeMode = () =>{
    if(mode === 'image') setMode('video')
    else if(mode === 'video') setMode('image')

  }

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setPost(selectedImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to send the multipart form data
    const local = localStorage.getItem('store')
    console.log(local)
    const formData = new FormData();
    if(mode === 'image') formData.append('image', post);
    if(mode === 'video') formData.append('video', post);
    formData.append('userId', local);
    formData.append('caption', caption);
    formData.append('type', mode);

    try {
      let response
      if(mode === 'image'){
        response = await fetch(`${localhost}/upload/image`, {
          method: 'POST',
          body: formData,
        });
      }
      else{
        response = await fetch(`${localhost}/upload/video`, {
          method: 'POST',
          body: formData,
        });
      }  
      console.log(response)
      const data = await response.json();
      console.log(data)
      if (data.message === 'User data and image uploaded successfully.') {
        navigate('/Footer');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <div style={styles.main}>
        <img src={darkMode? backWhiteIcon: backIcon} style={styles.btn} onClick={() => back()} />
        <p style={styles.heading}>New Post</p>
      </div>
      {console.log(mode)}
      
      <div style={styles.mid}>
        <form onSubmit={e => { handleSubmit(e) }}>
          <img src={mode === 'image'? (darkMode? cameraWhiteIcon: cameraIcon) : (darkMode? reelsWhiteIcon: reelsIcon)} alt="image" width="48" height="48" onClick={()=> changeMode()} />
          <input type="file" src={cameraIcon} id="postLink" alt="image" name="postLink" width="48" height="48" onChange={handleImageChange} required />

          <input type="text" id="caption" placeholder='Add Caption' name="caption" onChange={e => setCaption(e.target.value)} style={styles.input} /><br></br>
          <button className="btn btn-primary" style={styles.addButton}>Post</button>
        </form>
      </div>

      <Foot />
    </div>
  )
}

export default AddPost



{/**
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Foot from './Foot';
import { localhost } from './api';

function AddPost() {
  const navigate = useNavigate();

  const styles = {
    container: {
      backgroundColor: '#f9f9f9',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    header: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '20px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    fileInput: {
      display: 'none',
    },
    modeToggle: {
      display: 'flex',
      alignItems: 'center',
      margin: '10px',
    },
    modeIcon: {
      width: '48px',
      height: '48px',
      marginRight: '10px',
      cursor: 'pointer',
    },
    captionInput: {
      width: '100%',
      padding: '10px',
      marginBottom: '20px',
      border: '2px solid #ccc',
      borderRadius: '8px',
      fontSize: '16px',
    },
    postButton: {
      width: '300px',
      height: '40px',
      borderRadius: '75px',
      fontSize: '18px',
      backgroundColor: '#007bff',
      color: 'white',
      cursor: 'pointer',
    },
  };

  const [post, setPost] = useState(null);
  const [caption, setCaption] = useState('');
  const [mode, setMode] = useState('image');

  const changeMode = () => {
    setMode(mode === 'image' ? 'video' : 'image');
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setPost(selectedImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (mode === 'image') formData.append('image', post);
    if (mode === 'video') formData.append('video', post);

    try {
      const response = await fetch(
        mode === 'image' ? `${localhost}/upload/image` : `${localhost}/upload/video`,
        {
          method: 'POST',
          body: formData,
        }
      );
      const data = await response.json();

      if (data.message === 'User data and image uploaded successfully.') {
        navigate('/Footer');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>New Post</h2>
      <form style={styles.form} onSubmit={(e) => handleSubmit(e)}>
        <div style={styles.modeToggle}>
          <img
            src={mode === 'image' ? '/path-to-your-image-icon.png' : '/path-to-your-video-icon.png'}
            alt={mode === 'image' ? 'Image' : 'Video'}
            style={styles.modeIcon}
            onClick={() => changeMode()}
          />
          <input
            type="file"
            id="postLink"
            name="postLink"
            style={styles.fileInput}
            onChange={handleImageChange}
            required
          />
        </div>
        <input
          type="text"
          id="caption"
          placeholder="Add Caption"
          name="caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          style={styles.captionInput}
        />
        <button type="submit" style={styles.postButton}>
          Post
        </button>
      </form>
      <Foot />
    </div>
  );
}

export default AddPost;
 */}