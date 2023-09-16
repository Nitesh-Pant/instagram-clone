import React from 'react'
import { useNavigate } from "react-router-dom";


export const Foot = () => {
    const navigate = useNavigate();

    const styles = {
        main: {
            display: 'flex',
            margin: '10px',
            marginLeft: '0px',
            maxWidth: '70vh',
            minWidth: '70vh',
            position: 'fixed',
            bottom: -10,
            border: '2px solid red',
            textAlign: 'center',
            backgroundColor: 'white'
        },
        homeIcon: {
            height: '25px',
            
      float: 'left',
            margin: '5px',
            marginLeft: '30px',
            marginRight: '30px'
        }
    }

    function home(){
        navigate('/Footer')
    }
    function add(){
        navigate('/AddPost')
    }
    function profile(){
        const local = localStorage.getItem('store');
        navigate('/Profile', {
            state: {id: local, currentUserId: local}
        })
    }
    function search(){
        navigate('/Search')
    }


    const homeIcon = '../icon/home.png'
    const searchIcon = '../icon/search.png';
    const addIcon = '../icon/add.png';
    const heartIcon = '../icon/heart.png';
    const profileIcon = '../icon/user.png';

  return (
    <div>
        <div style={styles.main}>
            <img src={homeIcon} alt="new" onClick={() => home()} style={styles.homeIcon}/>
            <img src={searchIcon} alt="new" onClick={() => search()} style={styles.homeIcon}/>
            <img src={addIcon} alt="new" onClick={() => add()} style={styles.homeIcon}/>
            <img src={heartIcon} alt="new" style={styles.homeIcon}/>
            <img src={profileIcon} alt="new" onClick={() => profile()} style={styles.homeIcon}/>
        </div>
    </div>
  )
}

export default Foot;