import React from 'react';
import '../css/Login.css';

export default class Login extends React.Component {
  render(){

    const loginButton = <button type = "button" className = "login-button"
    onClick = { this.props.login } > Login to save your notes! </button>
 
    return (!this.props.loggedIn) ? (<span className="login"> {loginButton} </span>) : (null);
  }
}