import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Foot from './Foot';
import {localhost} from './api'

function FollowersFollowing() {
    const styles = {
        container: {
            margin: '20px',
            backgroundColor: '#CDCDCD',
        },
        tabs: {
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '20px',
            backgroundColor: "lightGrey"
        },
        tabButton: {
            padding: '10px 20px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
        },
        userList: {
            display: 'flex',
            alignItems: 'center',
           // border: '2px solid red',
            marginBottom: '10px',
            padding: '5px',
            backgroundColor: '#FAF9F6',
        },
        avatar: {
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: '10px',
        },
        username: {
            fontWeight: 'bold',
            color: 'black'
        },
    };

    const location = useLocation();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState(location.state.tab);
    const [users, setUsers] = useState(null);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    function goToProfile(userId) {
        const local = localStorage.getItem('store');
        navigate('/Profile', {
            state: { id: userId, currentUserId: local }
        })
    }

    useEffect(() => {
        fetch(`${localhost}/follow/${location.state.id}?type=${activeTab}`, {
            method: 'GET',
            headers: {
                'authorization': localStorage.getItem('token'),
            },
        })
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error(error));
    }, [activeTab]);

    return (
        <><div style={styles.container}>
            <div style={styles.tabs}>
                <button

                    style={{ ...styles.tabButton, fontWeight: activeTab === 'followers' ? 'bold' : 'normal', boxShadow: activeTab === 'followers' ? '10px 5px 5px teal': null }}
                    onClick={() => handleTabClick('followers')}
                >
                    Followers
                </button>
                <button
                    style={{ ...styles.tabButton, fontWeight: activeTab === 'following' ? 'bold' : 'normal', boxShadow: activeTab === 'following' ? '10px 5px 5px teal': null }}
                    onClick={() => handleTabClick('following')}
                >
                    Following
                </button>
            </div>

            <div>
                {users &&
                    users.map((user, index) => (
                        <div key={index} style={styles.userList} onClick={() => goToProfile(user.id)}>
                            <img src={user.avatarLink} style={styles.avatar} alt='avatar' />
                            <span style={styles.username}>{user.username}</span>
                        </div>
                    ))
                }
            </div>


        </div>
            <Foot />
        </>
    );
}

export default FollowersFollowing;
