import React from 'react';
import '../css/LoginPopup.css';

export default class LoginPopup extends React.Component {
  render(){
    const username = <input type="text" placeholder="ENTER USERNAME"/>
    const password = <input type="password" placeholder="ENTER PASSWORD"/>
    const loginButton = <button type="text" className="login-submit">LOGIN</button>;
    const closePopup = <button type="text" className="close-button"
     onClick={this.props.handlePopup}></button>;
    const signup = <button type="button" className="login-submit">Don't have an account? Sign up!</button>  
    return (this.props.showPopup) 
    ?(
      <div class="login-popup">
        {username}
        <br /><br />
        {password}
        <br /><br />
        {loginButton}
        <br /> <br />
        {signup}
        {closePopup}
      </div>
    ) :  null 
  
  }
}