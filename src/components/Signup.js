import React, { useState } from 'react'
import { useNavigate, Link } from "react-router-dom";

export const Signup = () => {
    const styles = {
        or: {
            color: 'black'
        },
        account: {
            color: 'black'
        },
        instaLogo: {
            marginTop: '160px',
        },
        logo: {
            width: '250px',
            height: '70px'
        },
        input: {
            width: '350px',
            height: '50px',
            textAlign: 'center',
            borderTopStyle: 'none',
            borderRightStyle: 'none',
            borderLeftStyle: 'none',
        },
        login: {
            backgroundColor: 'lightblue',
            width: '350px',
            height: '40px',
            color: 'white',
            marginTop: '12px'
        },
    }
    const [avatar, setAvatar] = useState('' | null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

  const instagramIcon = '../icon/instagram-text-icon.png';
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    console.log({'avatarLink': avatar, 'username': username, 'password': password})
    e.preventDefault();
    const data = {'avatarLink': avatar, 'username': username, 'password': password}
    
    const response = await fetch('http://localhost:3001/signup', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    console.log(result);
    if(result.msg == 'User signed up successfully'){
        navigate("/Login");
    }
  }

  return (
    <div>
        <div style={styles.instaLogo}>
            <img src={instagramIcon} alt="new" style={styles.logo}/>
        </div>
        <div>
            <form onSubmit={e => { handleSubmit(e) }}>
                <input type="text" id="avatar" placeholder="avatar link" name="avatar" onChange={e => setAvatar(e.target.value)} style={styles.input}/><br></br>
                <input type="text" id="username" placeholder="username" name="username" onChange={e => setUsername(e.target.value)} style={styles.input}/><br></br>
                <input type="password" id="password" placeholder="password" name="password" onChange={e => setPassword(e.target.value)} style={styles.input}/><br></br>
                <button style={styles.login}>Signup</button>
            </form>
            <p style={styles.or}>or</p>
            <p style={styles.account}>Already have an account? <Link to="/login">Login</Link></p>
        </div>
        
    </div>
  )
}

export default Signup;