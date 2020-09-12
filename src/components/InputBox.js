import React from 'react';
import '../css/InputBox.css'

export default class InputBox extends React.Component {


  render(){
    const input = <input type="text" name = "currentNote" placeholder="Enter a note" id="inputNote"
     onChange = {this.props.handleChange}/>;
    const submit = <button type="button" className="create-note-button" 
    onClick={this.props.handleClick}> Create Note </button>;

    return (this.props.show)
     ? ( <span className="input-box">
           {input}
           {submit}
         </span>)
     : (null);
  }
}





