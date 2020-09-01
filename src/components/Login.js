import React from 'react';
import '../css/Login.css';

export default class Login extends React.Component {
  render(){
    let buttonName;
    if(this.props.loggedIn){
      buttonName = 'Welcome '+this.props.username+'!';
    }else buttonName = 'Login to save your notes!';
    const loginButton = <button type = "button" className = "login-button"
     onClick = { this.props.login } > {buttonName} </button>
    return (<span className="login">{loginButton}</span>);
  }
}