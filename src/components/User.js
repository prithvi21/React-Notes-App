import React from 'react';
import '../css/User.css';

export default class User extends React.Component {


  render(){
    if(this.props.loggedIn){
      return (<button title="Account Settings"className="user-settings">

      </button>)
    } else {
      return (null);
    }

  }
}