import React, {useContext} from 'react'
import { useNavigate } from "react-router-dom";
import { context } from '../App';


export const Foot = () => {
    const navigate = useNavigate();
    const { darkMode } = useContext(context)

    const styles = {
        main: {
            display: 'flex',
            margin: '0px 0px 10px 0px',
            alignItems: 'center',
            width: 'auto',
            position: 'fixed',
            bottom: -10,
           // border: '2px solid red',
            backgroundColor: darkMode? '#333' : 'white',
            justifyContent: 'space-between',

        },
        homeIcon: {
            height: '25px',
            //float: 'left',
            margin: '5px 25px 5px 25px',
            display: 'flex',
            justifyContent: 'space-between',
        }
    }

    function home() {
        navigate('/Footer')
    }
    function add() {
        navigate('/AddPost')
    }
    function profile() {
        const local = localStorage.getItem('store');
        navigate('/Profile', {
            state: { id: local, currentUserId: local }
        })
    }
    function search() {
        navigate('/Search')
    }


    const homeIcon = '../icon/home.png'
    const homeWhiteIcon = '../icon/homeWhite.png'
    const searchIcon = '../icon/search.png';
    const searchWhiteIcon = '../icon/searchWhite.png';
    const addIcon = '../icon/add.png';
    const addWhiteIcon = '../icon/addWhite.png';
    const reelsIcon = '../icon/video.png';
    const reelsWhiteIcon = '../icon/reelsWhite.png';
    const profileIcon = '../icon/user.png';

    return (
        <div>
            <div style={styles.main}>
                <img src={darkMode? homeWhiteIcon: homeIcon} alt="new" onClick={() => home()} style={styles.homeIcon} />
                <img src={darkMode? searchWhiteIcon : searchIcon} alt="new" onClick={() => search()} style={styles.homeIcon} />
                <img src={darkMode? addWhiteIcon: addIcon} alt="new" onClick={() => add()} style={styles.homeIcon} />
                <img src={darkMode? reelsWhiteIcon : reelsIcon} alt="new" style={styles.homeIcon} />
                <img src={profileIcon} alt="new" onClick={() => profile()} style={styles.homeIcon} />
            </div>
        </div>
    )
}

export default Foot;