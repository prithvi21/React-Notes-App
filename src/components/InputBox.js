import React from 'react';
import '../css/InputBox.css'

export default class InputBox extends React.Component {


  render(){
    const input = <input type="text" placeholder="Enter a note" id="inputNote" />;
    const submit = <button type="button" className="create-note-button" 
    onClick={this.props.handleClick}> Create Note </button>;

    return (this.props.show)
     ? ( <span id="input-box">
           {input}
           {submit}
         </span>)
     : (null);
  }
}





