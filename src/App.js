import React from 'react';
import './App.css';
import Header from './components/Header';
import NewNote from './components/NewNote';
import Display from './components/Display';
import InputBox from './components/InputBox';
// import './css/InputBox.css'


class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      notesList : [],
      buttonClicked : false
    };
  }

  handleAdd = () => {
    this.setState({
      buttonClicked : true
    })
    console.log('button clicked');
  }

  handleCreate = () => {
   const inputField =  document.getElementById('inputNote');
   this.setState({
     notesList : this.state.notesList.concat(inputField.value)
   });
   inputField.value = ''; 
  }

  handleEdit = (note_id) => {
    const id = 'note-' + note_id;
    const save_id = 'save-' + note_id;
    document.getElementById(id).contentEditable = 'true';
    document.getElementById(save_id).style.display = 'initial';//show save button once edit clicked
  }


  handleDelete = (note_id) => {
    const id = 'display-' + note_id;
    document.getElementById(id).style.display = 'none';

    //delete the note and update state
    const newNotesList = this.state.notesList;
    newNotesList.splice(note_id,1);
    console.log('after deletion:'+newNotesList.toString());
    this.setState({
      notesList : newNotesList
    })
  }

  saveAfterEdit = (note_id) => {
    const id = 'note-' + note_id;
    const save_id = 'save-' + note_id;
    document.getElementById(id).contentEditable = 'false';
    document.getElementById(save_id).style.display = 'none';//hide save button after save clicked

    //replacing the note with the edited note and updating state
    const newNotesList = this.state.notesList;
    const newNote = document.getElementById(id).textContent;
    newNotesList.splice(note_id,note_id,newNote);
    console.log('after edit:'+newNotesList.toString());
    this.setState({
      notesList : newNotesList
    })
  }

  render(){
    return (this.state.buttonClicked) 
      ?(
        <div>
          <Header />
          <NewNote handleClick = {this.handleAdd}/>
          <InputBox handleClick = {this.handleCreate} />
          <Display notesList = {this.state.notesList}
           edit = {this.handleEdit} delete = {this.handleDelete} save = {this.saveAfterEdit} />
        </div>)
      : (<div>
          <Header />
          <NewNote handleClick = {this.handleAdd}/>
         </div>);  
     
  }
}



export default App;
