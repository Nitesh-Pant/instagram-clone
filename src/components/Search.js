import React, { useState, useEffect } from 'react';
import Foot from './Foot';
import { Navigate, useNavigate } from 'react-router-dom';
import { localhost } from './api';

const Search = () => {
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);
    const [showImage, setShowImages] = useState(true);
    const navigate = useNavigate();

    const styles = {
        avatar: {
            width: '50px',
            border: '2px solid black',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover',
            margin: '10px',
            display: 'inline',
        },
        username: {
            display: 'inline',
        },
        searchList: {
            color: 'black',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '0px',
            padding: '5px',
            backgroundColor: '#FAF9F6',
            maxHeight: '55px',
        },
        input: {
            width: '90%',
            borderRadius: '75px',
            margin: '10px',
            height: '40px',
        },
        masonryGrid: {
            display: 'grid',
            //gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '16px',
        },
        masonryItem: {
            backgroundColor: '#f2f2f2',
            borderRadius: '8px',
            overflow: 'hidden',
            position: 'relative', // Added position relative
        },
        image: {
            width: '100%',
            height: 'auto',
            display: 'block',
        },
        video: {
            width: '100%',
            height: 'auto',
            display: 'block',
        },
        imageWrapper: {
            position: 'relative',
            paddingBottom: '75%', // 4:3 aspect ratio
        },
        searchBar: {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            backgroundColor: 'white',
            zIndex: '1',
        },
        searchContainer: {
            backgroundColor: 'white',
            zIndex: '1',
          },

        content: {
            paddingTop: '60px', // Adjust the top padding to account for the fixed search bar
        },
    };

    function handleClick(userId) {
        const local = localStorage.getItem('store');
        navigate('/Profile', {
            state: { id: userId, currentUserId: local },
        });
    }

    function viewPost() {
        console.log('viewPost');
    }

    const typeSearch = async (e) => {
        setUsername(e.target.value);
        if (username.length > 2) {
            const response = await fetch(`${localhost}/search/?name=${e.target.value}`, {
                method: 'GET',
                headers: {
                    authorization: localStorage.getItem('token'),
                },
            });
            const result = await response.json();
            console.log(result);
            setUsers(result);
            setShowImages(false);
        } else {
            setUsers([]);
            setShowImages(true);
        }
    };

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const local = localStorage.getItem('store');
        fetch(`${localhost}/search/posts/${local}`)
            .then((response) => response.json())
            .then((data) => setPosts(data));
    }, []);

    return (
        <div>
           <div style={styles.searchContainer}>
                <input type="text" id="name" placeholder="Search" onChange={(e) => typeSearch(e)} style={styles.input} />
                <div style={styles.searchList}>
                    {users &&
                        users.map((user, index) => (
                            <div style={styles.searchList} onClick={() => handleClick(user.id)} key={index}>
                                <img src={user.avatarLink} style={styles.avatar} alt="avatar" />
                                <span style={styles.username}>{user.username}</span>
                            </div>
                        ))}
                </div>
            </div>

            {/* photos and videos */}
            {
                showImage && (
                    <div style={styles.masonryGrid}>
                        {posts &&
                            posts.map((post, index) => (
                                <div style={styles.masonryItem} key={index}>
                                    {post.type === 'video' ? (
                                        <video style={styles.video} alt="Posted Video" controls>
                                            <source src={`${localhost}/${post.postLink}`} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <div style={styles.imageWrapper}>
                                            <img
                                                src={`${localhost}/${post.postLink}`}
                                                alt="Posted Photo"
                                                style={styles.image}
                                                onClick={() => viewPost()}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                )
            }

            <Foot />
        </div >
    );
};

export default Search;
