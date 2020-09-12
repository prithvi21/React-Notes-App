import React from 'react';
import '../css/LoginPopup.css';

export default class LoginPopup extends React.Component {
  
  // validate =  async () => {
  //   const bool =  await this.props.validateUsername().then(res => {
  //     return res;
  //   });
  //   console.log(bool);
  //   if(bool){
  //     document.getElementsByClassName('validation-message')[0].textContent = 'Username taken';
  //     document.getElementsByClassName('login-submit')[0].style.opacity = 0.5;
  //   }  else {
  //       document.getElementsByClassName('validation-message')[0].textContent = '';
  //     } 
  //   //Button disabled until valid username  
  //   document.getElementsByClassName('login-submit')[0].disabled = bool;  
  // }

  render(){
    let buttonName;
    if(this.props.isSignup) {
      buttonName = "CREATE ACCOUNT";
    }  
    else {
      buttonName = "LOGIN";
    } 
    const name = <input type="text" id="name" name="name" placeholder="Enter your name" onChange={this.props.handleChange} />

    const username = <input type="text" name="username" placeholder="ENTER USERNAME" onChange={this.props.handleChange}
     ref={this.props.usernameRef}/>

    const password = <input type="password" name="password" placeholder="ENTER PASSWORD" onChange={this.props.handleChange} />

    const loginButton = <button type="submit" className="login-submit" onClick={this.props.loginRequest}>{buttonName}</button>;

    const closePopup = <button type="text" className="close-button"
      onClick={this.props.handlePopup}></button>;

    const signup = <button type="button" className="login-submit" onClick={this.props.signup}>Don't have an account? Sign up!</button> 
      
    const popup = (
      <div>
        {this.props.isSignup && name}  
        <br /><br />
        {username}
        <p className="validation-message"></p>
        {password}
        <br /><br />
        {loginButton}
        <br /> <br />
        {!this.props.isSignup && signup}
        {closePopup}
      </div>
    );
    
    return (this.props.showPopup) 
    ?(
      <div className="login-popup">
        {popup}
      </div>
    ) :  (null); 
  }


}