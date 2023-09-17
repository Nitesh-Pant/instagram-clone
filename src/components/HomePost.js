import React, {useState} from 'react'
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
            fontSize: '25px',
            marginBottom: '0px',
            border: '2px solid black'
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
            height: '20px',
            border: '2px solid black'
        },
        reactionIcon: {
            marginLeft: '10px',
            height: '25px'
        },
      };

      function profile(userId){
        const local = localStorage.getItem('store');
        navigate('/Profile', {
            state: {id: userId, currentUserId: local}
        })
    }

    const [isLiked, setIsLiked] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [comment, setComment] = useState(null);


    const handleDoubleClick = ()=> {
        console.log('likked')
        setIsLiked(!isLiked);
    }
    const showComment = () => {
        console.log('comment')
        setShowForm(!showForm);
    }

    const handleSubmit = (e) => {
        e.preventDefault(e);
        const data = {userId: '123', postId: '123', comment: 'comment test'}
        console.log(data)
    }

      const heartIcon = '../icon/heart.png';
      const heartedIcon = '../icon/hearted.png';
      const chatIcon = '../icon/chat.png';
      const snedIcon = '../icon/send.png';
      
    return (
        <div>
            <div style={styles.fullBox}>
                <div style={styles.main} onClick={()=> profile(props.id)}>
                    <img src={props.avatar} alt="new" style={styles.imageProfile}/>
                    <h3 style={styles.uname}>{props.username}</h3>
                </div>
                <div style={{border:'2px solid green'}}>
                    <img src={props.img} alt="new" style={styles.imgstyle} onDoubleClick={()=> handleDoubleClick()}/>                
                </div>
                <div style={styles.reaction}>
                    <img src={ isLiked? heartedIcon: heartIcon} alt="new" style={styles.reactionIcon} onClick={()=> setIsLiked(!isLiked)}/>
                    <img src={chatIcon} alt="new" style={styles.reactionIcon} onClick={()=> showComment()}/>
                    <img src={snedIcon} alt="new" style={styles.reactionIcon}/>
                </div>
                <br></br><span style={{color: 'black', fontSize: '12px',float: 'left', marginLeft: '20px', border: '2px solid red'}}>Liked by 5 person</span>
                {showForm && (
                    <form style={{margin: '25px 0px 0px 10px', padding: '10px', border: '1px solid #ccc', backgroundColor: '#f9f9f9'}}  onSubmit={e => { handleSubmit(e) }}>
                        <input type="text" style={{ margin: '5px 5px 5px 0px', width: '80%', padding: '5px', display: 'inline-block'}} placeholder='Add Comment...' value={comment}
              onChange={(e) => setComment(e.target.value)}/>
                        <button type="submit" style={{marginTop: '10px', backgroundColor: "#458eff", width: '50px', height: '30px', color: 'white'}}>Post</button>
                    </form>
                )}
                
                <p style={styles.cap}>
                    <b style={{fontSize: '18px'}}>{props.username}</b>
                    <p style={{ fontSize: '13px', marginTop: '0px', textAlign: 'left'}}>{props.caption.length < 50 ? props.caption : props.caption.slice(0, 50) + '...'}</p>
                </p>
                <span style={{color: 'black', fontSize: '12px',float: 'left', marginLeft: '20px'}}>View all 5 commnet</span>
            </div>
        
            <Foot/>
        </div>
        
    )
}

export default HomePost;