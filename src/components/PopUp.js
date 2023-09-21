import React, { useContext } from 'react';
import { context } from '../App';
import { useNavigate } from 'react-router-dom';

function PopUp(props) {
    const { darkMode, toggleDarkMode } = useContext(context);
    const navigate = useNavigate()

    const styles = {
        mainDiv: {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'transparent',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '999',
        },
        secondDiv: {
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '5px',
            boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
            transition: 'transform 0.5s ease',
            top: '14%',
            position: 'relative',
            width: '360px',
            maxWidth: '700px',
            height: '400px',
            transition: '0.5s ease',
        },
        closeButton: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer',
            color: 'black',
            transition: '0.5s ease',
            border: '5px solid black',
        },
        heading: {
            color: 'black',
            width: '100%',
            marginTop: '0px',
            textAlign: 'center',
            fontSize: '24px',
        },
        listItem: {
            color: 'black',
            margin: '10px 0',
            border: '2px solid red',
            height: '50px',
            textAlign: 'center',
            lineHeight: '50px',
        },
        darkModeToggle: {
            width: '70px',
            height: '45px', 
            float: 'right',
        },
        submit: {
            backgroundColor: 'lightblue',
            width: '250px',
            height: '40px',
            color: 'white',
            marginTop: '12px'
        },
    };

    console.log({darkMode})

    function close() {
        console.log('clicking');
        console.log('props', props);
        props.onCloseMenu();
    }

    function logout(){
        localStorage.clear()
        navigate('/Login')
    }

    const lightURL = '../icon/light.png';
    const darkURL = '../icon/moon.png';

    return (
        <div>

            {props.popupType === 'settings' ? (
                // Settings menu
                <div style={styles.mainDiv}>
                    <div style={styles.secondDiv}>
                        <span style={styles.closeButton} onClick={() => close()}>
                            &times;
                        </span>
                        <h2 style={styles.heading}>Settings</h2>
            
                        <ul style={{listStyle: 'none'}}>
                            <li style={styles.listItem}>
                                Dark mode{' '}
                                <img
                                    src={darkMode ? darkURL : lightURL}
                                    style={styles.darkModeToggle}
                                    onClick={toggleDarkMode}
                                    alt="Dark Mode Toggle"
                                />
                            </li>
                            <li style={styles.listItem} onClick={()=> logout()}>Logout</li>
                        </ul>
                    </div>
                </div>
            ) : (
                // Edit profile menu
                <div style={styles.mainDiv}>
                    <div style={styles.secondDiv}>
                        <span style={styles.closeButton} onClick={() => close()}>
                            &times;
                        </span>
                        <h2 style={styles.heading}>Edit profile</h2>
                        <ul style={{listStyle: 'none'}}>
                            <li style={styles.listItem}><input type='text' name="username" placeholder='Enter Username' style={{width:"100%" ,height: "40px"}}/></li>
                            <li style={styles.listItem}><input type='text' name="username" placeholder='Avatar' style={{width:"100%" ,height: "40px"}}/></li>
                            <li style={styles.listItem}><textarea placeholder="Enter text..." rows={5} cols={30} style={{width:"100%"}}/></li>
                        </ul>
                        <button style={styles.submit}>Update</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PopUp;
