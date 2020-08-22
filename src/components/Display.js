import React from 'react';
import '../css/Display.css';

export default class Display extends React.Component {

  render(){
    const notesList = this.props.notesList;
    const displayNotes = notesList.map( (note,note_id) =>
      <div id={ 'display-' + note_id } className="display">
        <p id={ 'note-' + note_id }>{note}</p>
        <button type="button" className="edit-button" onClick={()=>this.props.edit(note_id)}>Edit</button>
        <button type="button" className="delete-button" onClick={()=>this.props.delete(note_id)}>Delete</button>
      </div> );

    return <div>{displayNotes}</div>;
  }
}