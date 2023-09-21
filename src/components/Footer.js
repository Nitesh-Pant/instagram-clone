import React from 'react'
import { HomePost } from './HomePost'
import Foot from './Foot';

const Footer = () => {

  const styles = {
    section: {
      width: '100px',
      height: '30px',
      float: 'left',
      margin: '10px',
    },
    wrapper: {
      width: '30px',
      height: '15px',
      float: 'right',
      margin: '10px',
      marginLeft: '80px'
    },
    header: {
      border: '2px solid red',
      height: '50px',
      width: '70vh',
      position: 'fixed',
      top: 0,
      backgroundColor: 'white'
    },
    pp: {
      color: 'red'
    },
    postDiv: {
      paddingTop: '50px',
      marginBottom: '50px',
    }
  };

  const instagramURL = '../icon/instagram-text-icon.png';
  const heartURL = '../icon/heart.png';


  return (
    <div>
      <div style={styles.header}>
        <img src={instagramURL} alt="Instagram Icon" style={styles.section} />
        <img src={heartURL} alt="Heart Icon" style={styles.wrapper} />
      </div>
      <div style={styles.postDiv}>
        <HomePost />
        <Foot />
      </div>
    </div>
  )
}
export default Footer;