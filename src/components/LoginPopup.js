import React from 'react';
import '../css/LoginPopup.css';

export default class LoginPopup extends React.Component {

  render(){
    let URL,buttonName;
    if(this.props.isSignup) {
      URL = "http://localhost:8080/create"
      buttonName = "CREATE ACCOUNT";
    }  
    else {
      URL = "http://localhost:8080/auth";
      buttonName = "LOGIN";
    } 
    const name = <input type="text" id="name" name="name" placeholder="Enter your name" />

    const username = <input type="text" name="username" placeholder="ENTER USERNAME"/>

    const password = <input type="password" name="password" placeholder="ENTER PASSWORD"/>

    const loginButton = <button type="submit" className="login-submit" onClick={this.props.a}>{buttonName}</button>;

    const closePopup = <button type="text" className="close-button"
     onClick={this.props.handlePopup}></button>;

    const signup = <button type="button" className="login-submit" onClick={this.props.signup}>Don't have an account? Sign up!</button>  
   
    return (this.props.showPopup) 
    ?(
      <div className="login-popup">
        {/* <iframe name="dummyframe" id="dummyframe" style={{display: 'none'}}></iframe> */}
        {/* <form action={URL} method="POST"> */}
        <div>
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
        </div>
        {/* </form> */}
      </div>
    ) :  null 
  
  }
}