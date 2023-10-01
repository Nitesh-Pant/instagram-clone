import React, { useState, useContext } from 'react'
import { useNavigate, Link } from "react-router-dom";
import {localhost} from './api'
import { context } from '../App';


export const Signup = () => {
    const {darkMode} = useContext(context)

    const styles = {
        or: {
            color: darkMode? 'white' : 'black',
        },
        account: {
            color: darkMode? 'white' : 'black',
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
    const [avatar, setAvatar] = useState(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [bio, setBio] = useState(null)
    
    const [errorMessage, setErrorMessage] = useState('')
    const [isError, setIsError] = useState(false)


    const [stepOne, setStepOne] = useState(true)
    const [stepTwo, setStepTwo] = useState(false)
    const [stepThree, setStepThree] = useState(false)




  const instagramIcon = '../icon/instagram-text-icon.png';
  const navigate = useNavigate();


  const usernameCheck = async (e) => {
    const uname = e.target.value;
    setUsername(e.target.value)
    const data = {'username': uname}
    
    if(uname.length > 3){
        const response = await fetch(`${localhost}/signup/step1`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        console.log(uname);
        console.log(result);

        if(result.msg == "Username already taken"){
            setErrorMessage(result.msg)
            setIsError(true)
        }
        else{
            setIsError(false)
        }
    }
    else{
        setIsError(false)
    }
  }

  const handleUsername = async (e) => {
    console.log({'username': username})
    e.preventDefault();
    setStepOne(false)
    setStepTwo(true)
  }

  const handlePassword = async (e) => {
    console.log({'password': password})
    e.preventDefault();
    if(password.length > 7){
        setStepTwo(false)
        setStepThree(true)
    }
  }

  const handleSubmit = async (e) => {
    console.log({'username': username, 'password': password, 'bio': bio, 'avatarLink': avatar})
    e.preventDefault();
    const data = {'username': username, 'password': password, 'bio': bio, 'avatarLink': avatar}
    
    const response = await fetch(`${localhost}/signup/step2`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const result = await response.json();
    console.log(result);
    if(result.msg == 'User signed up successfully'){
        setStepThree(false)
        navigate("/Login");
    }
    else{
        console.log('testttt')
    }
  }

  return (
    <div>
        <div style={styles.instaLogo}>
            <img src={instagramIcon} alt="new" style={styles.logo}/>
        </div>
        <div>
            {stepOne ? 
                (<form onSubmit={e => { handleUsername(e) }}>
                    <input type="text" id="username" placeholder="username" name="username" onChange={usernameCheck} required style={styles.input}/><br></br>
                    {isError && <div style={{color: 'red', fontSize: '15px', marginBottom: '0px'}}> {errorMessage} </div>}<br></br>
                    <button style={styles.login} disabled={username.length < 4 && isError == false}>Continue</button>
                </form>) :
                <></>
            }
            {stepTwo ?
                (<form onSubmit={e => { handlePassword(e) }}>
                    <input type="password" id="password" placeholder="password" name="password" onChange={e => setPassword(e.target.value)} required style={styles.input}/><br></br>
                    <div className="invalid-feedback">
                        Please provide a valid city.
                    </div>
                    <button style={styles.login} disabled={username.length < 4}>Continue</button>
                </form>):
                <></>
            }
            {stepThree ?
                (<form onSubmit={e => { handleSubmit(e) }}>
                    <input type="text" id="avatar" placeholder="avatar link" name="avatar" onChange={e => setAvatar(e.target.value)} style={styles.input}/><br></br>
                    <input type="text" id="bio" placeholder="bio" name="bio" onChange={e => setBio(e.target.value)} style={styles.input}/><br></br>
                    <button style={styles.login}>Signup</button>
                </form>):
                <></>
            }
            <p style={styles.or}>or</p>
            <p style={styles.account}>Already have an account? <Link to="/login">Login</Link></p>
        </div>
        
    </div>
  )
}

export default Signup;