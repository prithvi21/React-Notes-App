import React from 'react';
import '../css/Login.css';

export default class Login extends React.Component {
  render(){

    const loginButton = <button type = "button" className = "login-button"
    onClick = { this.props.login } > Login to save your notes! </button>
    if(!this.props.loggedIn){
      return (<span className="login">{loginButton}</span>);
    } else {
      return (null);
    }  
  }
}