import React from 'react';
import '../css/Login.css';

export default class Login extends React.Component {
  render(){

    const loginButton = <button type = "button" className = "login-button"
    onClick = { this.props.handlePopup } > Login to save your notes! </button>
 
    return (!this.props.isLoggedIn) ? (<span className="login"> {loginButton} </span>) : (null);
  }
}