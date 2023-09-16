import React from 'react'
import Foot from './Foot'
import { useNavigate } from "react-router-dom";


export const HomePost = (props) => {
    const navigate = useNavigate();

    const styles = {
        uname: {
          color: 'black',
          marginLeft: '10px',
          alignItem: 'center'
        },
        cap: {
            color: 'black',
            display: 'flex',
            marginLeft: '10px',
            fontWeight: 'normal',
            padding: '5px',
            fontSize: '25px'
        },
        imgstyle: {
            width: '410px',
            objectFit: 'contain',
            padding: '7px',
        },
        imageProfile: {
            borderRadius: '50%',
            width: '8%',
            height: '40px',
            marginLeft: '10px',
        },
        main:{
            display: 'flex',
            alignItems: 'center',
            height: '30px',
            padding: '7px',
            border: '2px solid yellow'
        },
        fullBox: {
            border: '10px solid blue'
        },
        reaction: {
            display: 'flex',
            float: 'left',
            marginLeft: '15px',
            width: '100px',
            height: '20px'
        },
        reactionIcon: {
            marginLeft: '10px'
        }
      };

      function profile(userId){
        const local = localStorage.getItem('store');
        navigate('/Profile', {
            state: {id: userId, currentUserId: local}
        })
    }

      const heartIcon = '../icon/heart.png';
      const heartedIcon = '../icon/heart(1).png';
      const chatIcon = '../icon/chat.png';
      const snedIcon = '../icon/send.png';
      
    return (
        <div>
            <div style={styles.fullBox}>
                <div style={styles.main} onClick={()=> profile(props.id)}>
                    <img src={props.avatar} alt="new" style={styles.imageProfile}/>
                    <h3 style={styles.uname}>{props.username}</h3>
                </div>
                <div>
                    <img src={props.img} alt="new" style={styles.imgstyle}/>
                </div>
                <div style={styles.reaction}>
                    <img src={heartIcon} alt="new" style={styles.reactionIcon}/>
                    <img src={chatIcon} alt="new" style={styles.reactionIcon}/>
                    <img src={snedIcon} alt="new" style={styles.reactionIcon}/>
                </div>
                <p style={styles.cap}>
                    <b style={{fontSize: '20px'}}>{props.username}</b>
                    <p style={{ fontSize: '15px', marginTop: '0px', textAlign: 'left'}}>{props.caption.length < 50 ? props.caption : props.caption.slice(0, 50) + '...'}</p>
                </p>
            </div>
        
            <Foot/>
        </div>
        
    )
}

export default HomePost;