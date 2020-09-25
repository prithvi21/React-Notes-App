import React from 'react';
import '../css/LoginPopup.css';

export default class LoginPopup extends React.Component {

  constructor(){
    super();
    this.state = {
      usernameTaken : false
    }
  }
  
  validate =  async () => {
    if (this.props.isSignup) {
      const usernameTaken =  await this.props.validateUsername().then(res => {
        return res;
      });
      console.log(usernameTaken);
      this.setState({
        usernameTaken : usernameTaken
      })
    }
  }

  render(){
    let buttonName;
    if(this.props.isSignup) {
      buttonName = "CREATE ACCOUNT";
    }  
    else {
      buttonName = "LOGIN";
    } 
    const name = <input type="text" id="name" name="name" placeholder="Enter your name" onChange={this.props.handleChange} required />

    const username = <input type="text" name="username" placeholder="ENTER USERNAME" 
    onChange={e => { this.props.handleChange(e); this.validate() } } ref={this.props.usernameRef} required/>

    const password = <input type="password" name="password" placeholder="ENTER PASSWORD" onChange={this.props.handleChange} required />

    const loginButton = <button type="submit" className="login-submit"
     onClick={!this.state.usernameTaken ? this.props.loginRequest : null}> {buttonName} </button>;

    const closePopup = <button type="text" className="close-button"
      onClick={this.props.handlePopup}></button>;

    const signup = <button type="button" className="login-submit" onClick = { this.props.signupClicked } >
      Don't have an account? Sign up! </button> 
      
    const popup = (
      <div>
        {this.props.isSignup && name}  
        <br /><br />
        {username}
        <p className="validation-message">{this.state.usernameTaken ? 'Username Taken' : ''}</p>
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