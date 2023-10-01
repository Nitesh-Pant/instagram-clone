import React, {useContext} from 'react'
import { HomePost } from './HomePost'
import Foot from './Foot';
import { context } from '../App';


const Footer = () => {

    const { darkMode } = useContext(context);


  const styles = {
    section: {
      width: '100px',
      height: '30px',
      margin: '10px',
    },
    wrapper: {
      width: '27px',
      height: '25px',
      margin: '10px',
      marginLeft: '80px'
    },
    header: {
    //  border: '2px solid red',
      display: 'flex',
      position: 'sticky',
      top: 0,
      backgroundColor: darkMode? '#333': 'white',
      justifyContent: 'space-between',
    },
    postDiv: {
    //  border: '5px solid yellow',
    }
  };

  const instagramURL = '../icon/instagram-text-icon.png';
  const instagramWhiteURL = '../icon/instagramWhite.png';

  const heartURL = '../icon/heart.png';
  const heartWhiteURL = '../icon/heartWhite.png';


  return (
    <div>
      <div style={styles.header}>
        <img src={darkMode? instagramWhiteURL: instagramURL} alt="Instagram Icon" style={styles.section} />
        <img src={darkMode? heartWhiteURL: heartURL} alt="Heart Icon" style={styles.wrapper} />
      </div>
      <div style={styles.postDiv}>
        <HomePost />
        <Foot />
      </div>
    </div>
  )
}
export default Footer;