import React, { useState, useEffect } from 'react'
import Foot from './Foot'
import { Navigate, useNavigate } from 'react-router-dom'

const Search = () => {
    const photosStyles = {
        photoDiv: {
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap'
        }
    };

    const [username, setUsername] = useState('')
    const [users, setUsers] = useState([])
    const [showImage, setShowImages] = useState(true)


    const navigate = useNavigate();

    const styles = {
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
            display: 'inline'
        },
        searchList: {
            maxHeight: '40px',
            paddingLeft: '50px',
            paddingRight: '50px',
        },
        userList: {
            color: 'black',
            border: '2px solid red',
            display: 'flex',
            alignItems: 'center',
            border: '2px solid red',
            marginBottom: '0px',
            padding: '5px',
            backgroundColor: '#FAF9F6',
            maxHeight: '40px',
        },
        input: {
            width: '90%',
            borderRadius: '75px',
            margin: '10px',
            height: '40px'
        }
    }

    function handleClick(userId) {
        const local = localStorage.getItem('store');
        navigate('/Profile', {
            state: { id: userId, currentUserId: local }
        })
    }

    function viewPost() {
        console.log('viewPost')
    }

    const typeSearch = async (e) => {
        setUsername(e.target.value)
        if (username.length > 2) {
            const response = await fetch('http://localhost:3001/search/?name=' + username, {
                method: 'GET',
                headers: {
                    'authorization': localStorage.getItem('token')
                }
            });
            const result = await response.json();
            console.log(result);
            setUsers(result)
            setShowImages(false)
        }
        else {
            setUsers([])
            setShowImages(true)

        }
    }

    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const local = localStorage.getItem('store');
        fetch("http://localhost:3001/search/posts/" + local)
            .then(response => response.json())
            .then(data => setPosts(data))
    }, [])

    return (
        <div>
            <input type='text' id='name' placeholder='Search' onChange={(e) => typeSearch(e)} style={styles.input} />
            <div style={styles.searchList}>
                {users &&
                    users.map((user, index) => (
                        <div style={styles.userList} onClick={() => handleClick(user.id)}>
                            <img src={user.avatarLink} style={styles.avatar} alt='avatar' />
                            <span style={styles.username}>{user.username}</span>
                        </div>
                    ))
                }
            </div>

            {/* photos div*/}
            {
                showImage ?
                    (<div>
                        <div style={photosStyles.photoDiv}>
                            {posts &&
                                posts.map((post, index) => (
                                    <img src={post.imageLink} alt="Posted Photo" style={{ width: '132px', height: '122px', margin: '5px' }} onClick={() => viewPost()} />
                                ))}
                        </div>
                    </div>) :
                    <></>
            }

            <Foot />
        </div>

    )
}

export default Search