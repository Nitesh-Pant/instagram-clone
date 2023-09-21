import React, { useState, useEffect } from 'react'
import Foot from './Foot'
import { useNavigate } from "react-router-dom";


export const HomePost = () => {
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
            width: '100%',
            objectFit: 'contain',
            padding: '2px',
        },
        imageProfile: {
            borderRadius: '50%',
            width: '8%',
            height: '40px',
            marginLeft: '10px',
        },
        main: {
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
            border: '2px solid black',
            //position: 'relative'
        },
        reactionIcon: {
            marginLeft: '10px',
            height: '25px'
        },
        avatar: {
            width: '50px',
            border: '2px solid black',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover',
            margin: '10px',
            display: 'inline'
        },
        username: {
            display: 'inline',
            fontWeight: 'bold',
            marginTop: '0px'
        },
        commentList: {
            color: 'black',
            border: '2px solid red',
            display: 'flex',
            alignItems: 'center',
            border: '2px solid red',
            marginBottom: '10px',
            padding: '5px',
            backgroundColor: '#FAF9F6',
            maxHeight: '40px',
        },
        userDetails: {
            display: 'flex',
            alignItems: 'center',
            marginRight: '10px', // Add spacing between avatar and username if needed
        },
        postDiv: {
            padding: '0px',
            marginBottom: '20px',
            border: '7px solid green'
        },
        commentClose: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer',
            color: 'black',
            transition: '0.5s ease'
        },
        commentHeader: {
            color: 'black',
            width: '100%',
            marginTop: '0px',
            position: 'absoulte',
            color: 'blue'
        }
    };

    function profile(userId) {
        const local = localStorage.getItem('store');
        navigate('/Profile', {
            state: { id: userId, currentUserId: local }
        })
    }

    const [showForm, setShowForm] = useState(false);
    const [currentPost, setCurrentPost] = useState(0);


    const [userComment, setUserComment] = useState(null);
    const [comments, setComments] = useState([]);



    const handleDoubleClick = async (postId) => {
        console.log('postId: ', postId)

        const local = localStorage.getItem('store')
        console.log('logegdinId: ', local)

        const response = await fetch('http://localhost:3001/like/' + postId + "/" + local, {
             method: 'PUT',
             headers: {
                 'Content-Type': 'application/json'
             }
         });
         const result = await response.json();
         console.log(result);
    }

    const showComment = async (postId) => {
        console.log('comment', postId)
        setCurrentPost(postId)

        const response = await fetch('http://localhost:3001/comments/' + postId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        setComments(result)
        console.log(result);
        setShowForm(true);
    }

    const closePopup = () => {
        setShowForm(!showForm);
    }

    function handleClick(userId) {
        const local = localStorage.getItem('store');
        navigate('/Profile', {
            state: { id: userId, currentUserId: local }
        })
    }

    const handleSubmit = async (e, postId) => {
        e.preventDefault(e);
        const local = localStorage.getItem('store')
        const data = { userId: local, postId: postId, comment: userComment }
        console.log(data)
        const response = await fetch("http://localhost:3001/comment/", {
            method: 'Post',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        console.log(result);
        if (result.msg == 'Successful') showComment(postId)
    }

    const heartIcon = '../icon/heart.png';
    const heartedIcon = '../icon/hearted.png';
    const chatIcon = '../icon/chat.png';
    const snedIcon = '../icon/send.png';

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const local = localStorage.getItem('store');

        fetch("http://localhost:3001/posts/" + local)
            .then(response => response.json())
            .then(data => setPosts(data))
    }, [])


    return (
        <div>
            <div style={styles.fullBox}>
                {posts &&
                    posts.map((post, index) => (
                        <>
                            <div key={index} style={styles.postDiv}>

                                {/* post header*/}
                                <div style={styles.main} onClick={() => profile(post.userId)}>
                                    <img src={post.avatar} alt="new" style={styles.imageProfile} />
                                    <h3 style={styles.uname}>{post.username}</h3>
                                </div>

                                {/* post-image*/}
                                <div style={{ border: '5px solid red' }}>
                                    <img src={post.imageLink} alt="new" style={styles.imgstyle} onDoubleClick={() => handleDoubleClick(post.postId)} />
                                </div>

                                {/* post reactions*/}
                                <div style={styles.reaction}>
                                    <img src={post.isLiked ? heartedIcon : heartIcon} alt="new" style={styles.reactionIcon} onClick={() => handleDoubleClick(post.postId)} />
                                    <img src={chatIcon} alt="new" style={styles.reactionIcon} onClick={() => showComment(post.postId)} />
                                    <img src={snedIcon} alt="new" style={styles.reactionIcon} />

                                </div>

                                {/* post like count*/}
                                <br></br><span style={{ color: 'black', fontSize: '12px', float: 'left', marginLeft: '20px', border: '2px solid red' }}>Liked by {post.likeCount} person</span>

                                {/* show/post comments*/}
                                {
                                    showForm && (
                                        <div
                                            style={{
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
                                            }}
                                        >
                                            <div
                                                style={{
                                                    backgroundColor: '#fff',
                                                    padding: '20px',
                                                    borderRadius: '5px',
                                                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
                                                    transform: showForm ? 'translateY(0)' : 'translateY(100%)', // Slide up animation
                                                    transition: 'transform 0.5s ease',
                                                    top: '14%',
                                                    position: 'relative',
                                                    width: '360px',
                                                    maxWidth: '700px',
                                                    height: '400px',
                                                    transition: '0.5s ease'
                                                }}
                                            >
                                                <span style={styles.commentClose} onClick={closePopup}>
                                                    &times;
                                                </span>
                                                <h2 style={styles.commentHeader}>Comment</h2>
                                                {
                                                    comments &&
                                                    comments.map((comment, index) => (
                                                        <div style={styles.commentList} key={index}>
                                                            <div style={styles.userDetails}>
                                                                <img src={comment.avatarLink} style={styles.avatar} alt='avatar' onClick={() => handleClick(comment.userId)} />
                                                                <span style={styles.username} onClick={() => handleClick(comment.userId)}>{comment.username} </span>
                                                            </div>
                                                            <p style={{ color: 'black' }}>{comment.comment}</p>
                                                        </div>
                                                    ))
                                                }

                                                {/* post comment */}
                                                <form style={{ margin: '25px 0px 0px 10px', padding: '5px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }} onSubmit={e => { handleSubmit(e, currentPost) }}>
                                                    <input type="text" style={{ margin: '5px 5px 5px 0px', width: '70%', padding: '5px', display: 'inline-block' }} placeholder='Add Comment...' value={userComment} onChange={(e) => setUserComment(e.target.value)} />
                                                    <button type="submit" style={{ marginTop: '10px', backgroundColor: "#458eff", width: '50px', height: '30px', color: 'white' }}>Post</button>
                                                </form>
                                            </div>
                                        </div>
                                    )}

                                {/* post caption*/}
                                <p style={styles.cap}>
                                    <b style={{ fontSize: '18px' }}>{post.username}</b>
                                    <p style={{ fontSize: '13px', marginTop: '0px', textAlign: 'left' }}>{post.caption.length < 50 ? post.caption : post.caption.slice(0, 50) + '...'}</p>
                                </p>

                                {/* post comment count*/}
                                <span style={{ color: 'black', fontSize: '12px', float: 'left', marginLeft: '20px' }} onClick={() => showComment(post.postId)}>View all {post.commentCount} comment</span>
                            </div >

                        </>

                    ))
                }

            </div>

            <Foot />
        </div>

    )
}

export default HomePost;