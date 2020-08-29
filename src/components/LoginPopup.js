import React from 'react';
import '../css/LoginPopup.css';

export default class LoginPopup extends React.Component {


  render(){
    const username = <input type="text" name="username" placeholder="ENTER USERNAME" required/>
    const password = <input type="password" name="password" placeholder="ENTER PASSWORD" required/>
    const loginButton = <button type="submit" className="login-submit">LOGIN</button>;
    const closePopup = <button type="text" className="close-button"
     onClick={this.props.handlePopup}></button>;
    const signup = <button type="button" className="login-submit">Don't have an account? Sign up!</button>  
    return (this.props.showPopup) 
    ?(
      <div class="login-popup">
        <form action="http://localhost:8080/auth" method="POST">
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