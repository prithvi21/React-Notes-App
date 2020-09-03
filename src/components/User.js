import React from 'react';
import '../css/User.css';

export default class User extends React.Component {


  render(){
    if(this.props.loggedIn){
      return (
        <div className="dropdown">
          <button title="Account Settings"className="user-settings">
            <div className="dropdown-content">
              <button type="button" onClick = {this.props.logout}> Logout</button>
              <button type="button">Edit Profile</button>
            </div>
          </button>
        </div>
      )
    } else {
      return (null);
    }

  }
}