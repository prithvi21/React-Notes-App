import React from 'react';
import '../css/InputBox.css'

export default class InputBox extends React.Component {


  render(){
    const input = <input type="text" name = "currentNote" placeholder="Enter a note" id="inputNote"
     onChange = {this.props.handleChange}/>;
    const submit = <button type="button" className="create-note-button" 
    onClick={this.props.handleCreate}> Create Note </button>;
    const close = <button type="text" className="close-new-note-button"
      onClick={this.props.closeAddNote}></button>;

    return (this.props.showInputBox)
     ? ( <span className="input-box">
           {input}
           {submit}
           {close}
         </span>)
     : (null);
  }
}





