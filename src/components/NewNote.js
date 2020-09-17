import React from 'react';
import '../css/NewNote.css'

export default class NewNote extends React.Component {


  render(){
    const newNote = <button className="add-button" onClick = { this.props.addNoteClicked } > Add a note + </button>
    return (
      <span className="main">
        {newNote}
      </span>
    );
  }

}