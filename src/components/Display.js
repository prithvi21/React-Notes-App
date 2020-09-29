import React from 'react';
import '../css/Display.css';

export default class Display extends React.Component {

  render(){
    const notesList = this.props.notesList;
    const displayNotes = notesList.map( (note,note_id) =>
      <div key = {note_id} className = "display">
        <p contentEditable = { this.props.isEditable[note_id] }
         ref = { node => this.props.refsList.current[note_id] = node } > {note} </p>
        { !this.props.isEditable[note_id] ? 
        <button type = "button" className = "edit-button"
         onClick ={ () => this.props.edit(note_id) }> Edit </button> : 
        <button type="button" id={ 'save-' + note_id } className = "save-button"
         onClick = { () => this.props.save(note_id) } > Save </button> }
         
        <button type="button" className="delete-button"
         onClick = { () => this.props.delete(note_id) } > Delete </button>
      </div> );
    return <div> {displayNotes} </div>;
  }
}