import React from 'react';
import './App.css';
import Header from './components/Header';
import NewNote from './components/NewNote';
import Display from './components/Display';
import InputBox from './components/InputBox';
import Login from './components/Login';
import LoginPopup from './components/LoginPopup';

class App extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      notesList : [],
      buttonClicked : false,
      showInputBox : false,
      showPopup : false,
      signup : false
    };
  }

  signup = () => {
    document.getElementsByClassName('login-submit')[1].style.display = 'none';
    document.getElementById('name').style.display = 'initial';
    this.setState({
      signup : true
    });
  }

  handleAdd = () => {
    this.setState({
      buttonClicked : true,
      showInputBox : true
    })
    console.log('button clicked');
  }

  handleCreate = (event) => {
   const inputField =  document.getElementById('inputNote');
   if(inputField.value === ''){
    alert("Note can't be empty");
     event.preventDefault();
     return;
   }
   const noteData = inputField.value;
   this.setState({
     notesList : this.state.notesList.concat(noteData),
     showInputBox : false
   },this.updateServer);
  }

  updateServer(){
    const userID = 0;// 0 for now, will add user login later
    const URL = 'http://localhost:8080/api/' + userID;
    const noteKey = 'Notes for ID:' + userID;
    fetch(URL, {
      method : 'POST',
      headers: {'Content-Type': 'application/json'},
      body : JSON.stringify({
        [noteKey] : this.state.notesList
      })
    }).then();
  }

  handleEdit = (noteID) => {
    const id = 'note-' + noteID;
    const save_id = 'save-' + noteID;
    document.getElementById(id).contentEditable = 'true';
    document.getElementById(save_id).style.display = 'initial';//show save button once edit clicked
  }


  handleDelete = (noteID) => {
    const id = 'display-' + noteID;
    console.log(id);

    //delete the note and update state
    const newNotesList = this.state.notesList;
    newNotesList.splice(noteID,1);
    this.setState({
      notesList : newNotesList
    },this.updateServer)
  }

  saveAfterEdit = (noteID) => {
    const id = 'note-' + noteID;
    const save_id = 'save-' + noteID;
    document.getElementById(id).contentEditable = 'false';
    document.getElementById(save_id).style.display = 'none';//hide save button after save clicked

    //replacing the note with the edited note and updating state
    const newNotesList = this.state.notesList;
    const newNote = document.getElementById(id).textContent;
    console.log(id);
    console.log(newNote);
    newNotesList.splice(noteID,1,newNote);
    console.log('after edit:'+newNotesList.toString());
    this.setState({
      notesList : newNotesList
    },this.updateServer)
  }

  handleLogin = () =>{
    console.log('login clicked');
    this.setState({
      showPopup : ! this.state.showPopup,
      signup : false
    })
  }

  render(){
    return (this.state.buttonClicked) 
      ?(
        <div>
          <Header />
          <Login login = {this.handleLogin} />
          <LoginPopup showPopup = {this.state.showPopup} handlePopup = {this.handleLogin} />
          <NewNote handleClick = {this.handleAdd}/>
          <InputBox handleClick = {this.handleCreate} show = {this.state.showInputBox} />
          <Display notesList = {this.state.notesList}
           edit = {this.handleEdit} delete = {this.handleDelete} save = {this.saveAfterEdit} />
        </div>)
      : (<div>
          <Header />
          <LoginPopup showPopup = {this.state.showPopup} handlePopup = {this.handleLogin}
           signup = {this.signup} isSignup = {this.state.signup} />
          <Login login = {this.handleLogin} />
          <NewNote handleClick = {this.handleAdd}/>
         </div>);  
     
  }
}



export default App;
