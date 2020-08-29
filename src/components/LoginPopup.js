import React from 'react';
import '../css/LoginPopup.css';

export default class LoginPopup extends React.Component {


  render(){
    var buttonName;
    if(this.props.isSignup) {
      buttonName = 'CREATE ACCOUNT';
    } else {
      buttonName = 'LOGIN';
    }
    const name = <input type="text" id="name" name="name" placeholder="Enter your name" required />
    const username = <input type="text" name="username" placeholder="ENTER USERNAME" required/>
    const password = <input type="password" name="password" placeholder="ENTER PASSWORD" required/>
    const loginButton = <button type="submit" className="login-submit">{buttonName}</button>;
    const closePopup = <button type="text" className="close-button"
     onClick={this.props.handlePopup}></button>;
    const signup = <button type="button" className="login-submit" onClick={this.props.signup}>Don't have an account? Sign up!</button>  
    return (this.props.showPopup) 
    ?(
      <div class="login-popup">
        <form action="http://localhost:8080/auth" method="POST">
        {name}  
        <br /><br />
        {username}
        <br /><br />
        {password}
        <br /><br />
        {loginButton}
        <br /> <br />
        {signup}
        {closePopup}
        </form>
      </div>
    ) :  null 
  
  }
}