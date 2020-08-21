import React from 'react';
import '../css/Display.css';

export default class Display extends React.Component {

  render(){
    const notesList = this.props.notesList;
    const displayNotes = notesList.map( (note) =>
      <div className="display">
        <p>{note}</p>
        <button type="button" class="edit-button" onClick={this.props.edit}>Edit</button>
        <button type="button" class="delete-button" onClick={this.props.delete}>Delete</button>
      </div> );

    return <div>{displayNotes}</div>;
  }
}