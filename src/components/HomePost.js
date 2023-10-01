import React, { useState, useEffect, useContext } from 'react'
import Foot from './Foot'
import { useNavigate } from "react-router-dom";
import { localhost } from './api';
import { context } from '../App';

export const HomePost = () => {
    const { darkMode } = useContext(context)
    const navigate = useNavigate();

    const styles = {
        uname: {
            color: darkMode ? 'white' : 'black',
            marginLeft: '10px',
            alignItem: 'center'
        },
        cap: {
            color: darkMode ? 'white' : 'black',
            display: 'flex',
            marginLeft: '5px',
            fontWeight: 'normal',
            padding: '5px',
            fontSize: '25px',
            marginBottom: '0px',
         //   border: '2px solid black'
        },
        imgstyle: {
            width: '100%',
            objectFit: 'contain',
            padding: '2px',
        },
        videostyle: {
            width: '100%',
            objectFit: 'contain',
            padding: '2px',
        },
        imageProfile: {
            borderRadius: '50%',
            width: '10%',
            height: '35px',
            marginLeft: '10px',
            border: darkMode ? '2px solid white' : '2px solid black',
        },
        main: {
            display: 'flex',
            alignItems: 'center',
            height: '45px',
            padding: '7px',
        //    border: '2px solid yellow'
        },
        fullBox: {
         //   border: '10px solid blue',
            overflow: 'auto',
            height: '720px'
        },
        reaction: {
            display: 'flex',
            float: 'left',
        //    border: '2px solid black',
            justifyContent: 'center'
        },
        reactionIcon: {
            marginLeft: '10px',
            height: '25px'
        },
        avatar: {
            width: '45px',
            border: darkMode ? '2px solid white' : '2px solid black',
            height: '45px',
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
            color: darkMode ? 'white' : 'black',
        //    border: '2px solid red',
            display: 'flex',
            alignItems: 'center',
        //    border: '2px solid red',
            marginBottom: '5px',
            backgroundColor: darkMode ? "#333" : "#fff", //'#FAF9F6',
            maxHeight: '50px',
        },
        userDetails: {
            display: 'flex',
            alignItems: 'center',
            margin: '5px 10px', // Add spacing between avatar and username if needed
        },
        postDiv: {
            padding: '0px',
            marginBottom: '5px',
         //   border: '7px solid green',
        },
        commentClose: {
            position: 'absolute',
            top: '10px',
            right: '10px',
            cursor: 'pointer',
            color: darkMode ? 'white' : 'black',
            transition: '0.5s ease'
        },
        commentHeader: {
            color: darkMode ? 'white' : 'black',
            width: '100%',
            marginTop: '0px',
            position: 'absoulte',
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

        const response = await fetch(`${localhost}/like/${postId}/${local}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        console.log(result);

        const updatedPosts = posts.map((post) => {
            if (post.postId === postId) {
                // Toggle isLiked property for the specific post
                return {
                    ...post,
                    isLiked: !post.isLiked,
                };
            }
            return post;
        });
    
        setPosts(updatedPosts);
    }

    const showComment = async (postId) => {
        console.log('comment', postId)
        setCurrentPost(postId)

        const response = await fetch(`${localhost}/comments/${postId}`, {
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
        setUserComment('')
        const local = localStorage.getItem('store')
        const data = { userId: local, postId: postId, comment: userComment }
        console.log(data)
        const response = await fetch(`${localhost}/comment/`, {
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
    const heartWhiteIcon = '../icon/heartWhite.png';
    const heartedIcon = '../icon/hearted.png';
    const chatIcon = '../icon/chat.png';
    const chatWhiteIcon = '../icon/commentWhite.png';
    const sendIcon = '../icon/send.png';
    const sendWhiteIcon = '../icon/sendWhite.png';

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const local = localStorage.getItem('store');

        fetch(`${localhost}/posts/${local}`)
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
                                <div style={{ /*border: '5px solid red'*/ }}>
                                    {post.type === 'video' ?
                                        <video style={styles.videostyle} alt="Posted Video" controls>
                                            <source src={`${localhost}/${post.postLink}`} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video> :
                                        <img src={`${localhost}/${post.postLink}`} alt="new" style={styles.imgstyle} onDoubleClick={() => handleDoubleClick(post.postId)} />
                                    }
                                </div>

                                {/* post reactions*/}
                                <div style={styles.reaction}>
                                    <img src={post.isLiked ? heartedIcon : darkMode ? heartWhiteIcon : heartIcon} alt="new" style={styles.reactionIcon} onClick={() => handleDoubleClick(post.postId)} />
                                    <img src={darkMode ? chatWhiteIcon : chatIcon} alt="new" style={styles.reactionIcon} onClick={() => showComment(post.postId)} />
                                    <img src={darkMode ? sendWhiteIcon : sendIcon} alt="new" style={styles.reactionIcon} />

                                </div>

                                {/* post like count*/}
                                <br></br><span style={{ color: darkMode ? 'white' : 'black', fontSize: '12px', marginLeft: '5px', display: 'block', textAlign: 'left',/* border: '2px solid red',*/ padding: '2px' }}>Liked by {post.likeCount} person</span>

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
                                                    backgroundColor: darkMode ? '#333' : '#fff',
                                                    padding: '20px',
                                                    borderRadius: '5px',
                                                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
                                                    top: '14%',
                                                    position: 'relative',
                                                    width: 'auto',
                                                    maxWidth: '700px',
                                                    height: '520px',
                                                    transition: '0.5s ease',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <span style={styles.commentClose} onClick={closePopup}>
                                                    &times;
                                                </span>
                                                <h2 style={styles.commentHeader}>Comment</h2>
                                                <div
                                                    style={{
                                                        flex: '1',
                                                        overflowY: 'auto',
                                                    }}
                                                >
                                                    {
                                                        comments &&
                                                        comments.map((comment, index) => (
                                                            <div style={styles.commentList} key={index}>
                                                                <div style={styles.userDetails}>
                                                                    <img src={comment.avatarLink} style={styles.avatar} alt='avatar' onClick={() => handleClick(comment.userId)} />
                                                                    <span style={styles.username} onClick={() => handleClick(comment.userId)}>{comment.username} </span>
                                                                </div>
                                                                <p style={{ color: darkMode ? 'white' : 'black', margin: 'auto auto auto 0px', fontSize: '14px' }}>{comment.comment}</p>
                                                            </div>
                                                        ))
                                                    }
                                                </div>

                                                {/* post comment */}
                                                <form style={{ padding: '5px', border: '1px solid #ccc', backgroundColor: darkMode ? '#333' : 'white' /*darkMode? '#f9f9f9' : '#fff'*/, display: 'flex', justifyContent: 'space-between', }} onSubmit={e => { handleSubmit(e, currentPost) }}>
                                                    <input type="text" style={{ margin: '5px 5px 5px 0px', width: '70%', padding: '5px', display: 'inline-block' }} placeholder='Add Comment...' value={userComment} onChange={(e) => setUserComment(e.target.value)} />
                                                    <button type="submit" className="btn btn-primary">Post</button>
                                                </form>
                                            </div>
                                        </div>
                                    )}

                                {/* post caption*/}
                                <p style={styles.cap}>
                                    <b style={{ fontSize: '18px',/* border: '2px solid red',*/ height: '30px', marginRight: '5px' }}>{post.username}</b>
                                    <p style={{ fontSize: '13px', marginTop: '0px', textAlign: 'left', /*border: '2px solid black'*/ }}>{post.caption.length < 50 ? post.caption : post.caption.slice(0, 50) + '...'}</p>
                                </p>

                                {/* post comment count*/}
                                <span style={{ color: darkMode ? 'white' : 'black', fontSize: '12px', marginLeft: '5px', display: 'block', textAlign: 'left',/* border: '2px solid red',*/ padding: '2px' }} onClick={() => showComment(post.postId)}>View all {post.commentCount} comment</span>
                            </div >

                        </>

                    ))
                }

            </div >

            <Foot />
        </div >

    )
}

export default HomePost;







{/*
import React, { useState, useEffect, useContext } from 'react';
import Foot from './Foot';
import { useNavigate } from 'react-router-dom';
import { localhost } from './api';
import { context } from '../App';

export const HomePost = () => {
  const { darkMode } = useContext(context);
  const navigate = useNavigate();

  const styles = {
    postContainer: {
      border: darkMode ? '1px solid #333' : '1px solid #ccc',
      marginBottom: '20px',
      backgroundColor: darkMode ? '#333' : '#fff',
      borderRadius: '8px',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
    },
    postHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      borderBottom: darkMode ? '1px solid #444' : '1px solid #ccc',
    },
    postHeaderAvatar: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      marginRight: '10px',
      cursor: 'pointer',
    },
    postHeaderUsername: {
      fontWeight: 'bold',
      fontSize: '14px',
      color: darkMode ? 'white' : 'black',
      cursor: 'pointer',
    },
    postContent: {
      padding: '10px',
    },
    postImage: {
      width: '100%',
      height: 'auto',
      borderRadius: '8px',
      cursor: 'pointer',
    },
    postReactions: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px',
      borderTop: darkMode ? '1px solid #444' : '1px solid #ccc',
    },
    postReactionIcon: {
      width: '24px',
      height: '24px',
      marginRight: '10px',
      cursor: 'pointer',
    },
    postCaption: {
      fontSize: '14px',
      color: darkMode ? 'white' : 'black',
      margin: '5px 0',
    },
    postCommentCount: {
      fontSize: '12px',
      color: darkMode ? 'white' : 'black',
      cursor: 'pointer',
    },
  };

  const navigateToProfile = (userId) => {
    const local = localStorage.getItem('store');
    navigate('/Profile', {
      state: { id: userId, currentUserId: local },
    });
  };

  const handleDoubleClick = async (postId) => {
    const local = localStorage.getItem('store');
    const response = await fetch(`${localhost}/like/${postId}/${local}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();

    const updatedPosts = posts.map((post) => {
      if (post.postId === postId) {
        return {
          ...post,
          isLiked: !post.isLiked,
        };
      }
      return post;
    });

    setPosts(updatedPosts);
  };

  const showComment = async (postId) => {
    setCurrentPost(postId);

    const response = await fetch(`${localhost}/comments/${postId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    setComments(result);
    setShowForm(true);
  };

  const closePopup = () => {
    setShowForm(!showForm);
  };

  function handleClick(userId) {
    const local = localStorage.getItem('store');
    navigate('/Profile', {
      state: { id: userId, currentUserId: local },
    });
  }

  const handleSubmit = async (e, postId) => {
    e.preventDefault(e);
    setUserComment('');
    const local = localStorage.getItem('store');
    const data = { userId: local, postId: postId, comment: userComment };
    const response = await fetch(`${localhost}/comment/`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    if (result.msg === 'Successful') showComment(postId);
  };

  const heartIcon = '../icon/heart.png';
  const heartWhiteIcon = '../icon/heartWhite.png';
  const heartedIcon = '../icon/hearted.png';
  const chatIcon = '../icon/chat.png';
  const chatWhiteIcon = '../icon/commentWhite.png';
  const sendIcon = '../icon/send.png';
  const sendWhiteIcon = '../icon/sendWhite.png';

  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentPost, setCurrentPost] = useState(0);
  const [userComment, setUserComment] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const local = localStorage.getItem('store');

    fetch(`${localhost}/posts/${local}`)
      .then((response) => response.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <div>
      <div style={styles.fullBox}>
        {posts &&
          posts.map((post, index) => (
            <div key={index} style={styles.postContainer}>
              <div style={styles.postHeader}>
                <img
                  src={post.avatar}
                  alt="Avatar"
                  style={styles.postHeaderAvatar}
                  onClick={() => navigateToProfile(post.userId)}
                />
                <span
                  style={styles.postHeaderUsername}
                  onClick={() => navigateToProfile(post.userId)}
                >
                  {post.username}
                </span>
              </div>
              <div style={styles.postContent}>
                {post.type === 'video' ? (
                  <video
                    style={styles.postImage}
                    alt="Posted Video"
                    controls
                  >
                    <source
                      src={`${localhost}/${post.postLink}`}
                      type="video/mp4"
                    />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    src={`${localhost}/${post.postLink}`}
                    alt="Posted Photo"
                    style={styles.postImage}
                    onDoubleClick={() => handleDoubleClick(post.postId)}
                  />
                )}
              </div>
              <div style={styles.postReactions}>
                <div>
                  <img
                    src={
                      post.isLiked
                        ? heartedIcon
                        : darkMode
                        ? heartWhiteIcon
                        : heartIcon
                    }
                    alt="Like"
                    style={styles.postReactionIcon}
                    onClick={() => handleDoubleClick(post.postId)}
                  />
                  <img
                    src={darkMode ? chatWhiteIcon : chatIcon}
                    alt="Comment"
                    style={styles.postReactionIcon}
                    onClick={() => showComment(post.postId)}
                  />
                  <img
                    src={darkMode ? sendWhiteIcon : sendIcon}
                    alt="Send"
                    style={styles.postReactionIcon}
                  />
                </div>
                <span style={styles.postCommentCount}>
                  View all {post.commentCount} comments
                </span>
              </div>
              <p style={styles.postCaption}>
                <b>{post.username}</b>{' '}
                {post.caption.length < 50
                  ? post.caption
                  : post.caption.slice(0, 50) + '...'}
              </p>
            </div>
          ))}
      </div>
      <Foot />
    </div>
  );
};

export default HomePost;
*/}