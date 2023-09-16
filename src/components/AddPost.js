import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import Foot from './Foot'

function AddPost() {
    const navigate = useNavigate();

    const styles = {
        addButton:{
            backgroundColor: '#0096FF',
            width: '300px',
            height: '40px',
            bottom: 50,
            margin: '10px'
        },
        main: {
            display: 'flex',
            height: '60px',
            margin: '10px',
            border: '2px solid blue'
        },
        heading: {
            color: 'black',
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
          border: '2px soild red'
        },
        mid: {
          border: '5px solid black',
          position: 'absolute',
          maxWidth: '70vh',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '10px'
        },
    }
      const backIcon = '../icon/back.png';

      function back(){
        navigate('/Footer')

      }

    const [imageLink, setImageLink] = useState('')
    const [caption, setCaption] = useState('')  
  
    const handleSubmit = async (e) => {
      console.log({'imageLink': imageLink, 'caption': caption})
      e.preventDefault();
      const local = localStorage.getItem('store');
      console.log(local)
      const data = {'userId': local, 'imageLink': imageLink, 'caption': caption}
      
      const response = await fetch('http://localhost:3001/addPost', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const result = await response.json();
      console.log(result);
      if(result.msg == 'Successful'){
          navigate("/Footer");
      }
    }

  return (
    <div>
        <div style={styles.main}>
            <img src={backIcon} style={styles.btn} onClick={()=> back()}/>
            <p style={styles.heading}>New Post</p>
        </div>
        {/*https://static.freeimages.com/assets/icons/expand.svg*/}
        <div style={styles.mid}>
            <form onSubmit={e => { handleSubmit(e) }}>
                <input type="text" id="imageLink" placeholder='Add Image Link' name="imageLink" onChange={e => setImageLink(e.target.value)} style={styles.input}/><br></br>
                <input type="text" id="caption" placeholder='Add Caption' name="caption" onChange={e => setCaption(e.target.value)} style={styles.input}/><br></br>
                <button style={styles.addButton}>Post</button>
            </form>
        </div>

        <Foot/>
    </div>
  )
}

export default AddPost