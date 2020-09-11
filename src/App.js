import React from 'react';
import './App.css';
import Header from './components/Header';
import NewNote from './components/NewNote';
import Display from './components/Display';
import InputBox from './components/InputBox';
import Login from './components/Login';
import LoginPopup from './components/LoginPopup';
import User from './components/User';

class App extends React.Component {

  constructor(props){
    super(props);
    this.URL = 'https://reactnote-app.herokuapp.com';
    console.log(this.URL);
    this.state = {
      notesList : [],
      addNoteClicked : false,
      showInputBox : false,
      showPopup : false,
      signup : false,
      loggedIn : false,
      username : null,
      userID : null
    };
  }

  createUserRequest = async () => {
    const endpoint = this.URL + "/create";
    const res = await fetch(endpoint, {
      method : 'POST',
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify({
        name     : document.getElementsByName('name')[0].value,
        username : document.getElementsByName('username')[0].value,
        password : document.getElementsByName('password')[0].value
      })
    });
    const body = await res.text();
    console.log(body);
    this.setState({
      showPopup : false
    })
}

  loginRequest = async () => {
    if (!this.state.signup) {
      console.log('login request');
      const endpoint = this.URL + "/auth";
      const res = await
      fetch(endpoint, {
        method: 'POST',
        headers : {
          'Content-type' : 'application/json',
          'APIKEY' : 'abc'
        },
        body : JSON.stringify({
          username : document.getElementsByName('username')[0].value,
          password : document.getElementsByName('password')[0].value
        }
      )
      });
      let body = await res.text();
      console.log(body);
      this.getUsername();
    } else {
        this.createUserRequest();
    }
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
      addNoteClicked : true,
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
   if(this.state.loggedIn){
    this.setState({
      notesList : this.state.notesList.concat(noteData),
      showInputBox : false
    },this.updateDatabase);
  } else {
    this.setState({
      notesList : this.state.notesList.concat(noteData),
      showInputBox : false
    });
  }
  }

  getUsername = async () => {
    const endpoint = this.URL + "/auth";
    const res = await fetch(endpoint, {
      method: 'GET',
      // credentials: 'include',
      headers: { 'Content-Type': 'text/plain',
      'Accept': 'application/json'
     }
    });
    let body = await res.text();
    console.log(res.status);
    console.log(body);
    body = JSON.parse(body);
    //if login successful
    if(body.loggedIn) this.setState({
      loggedIn : body.loggedIn,
      username : body.username,
      userID :   body.userID,
      showPopup : false
    })
    else {
      alert('Wrong Username/Password');
    }
    this.getNotes();
    // return body;
  }


  updateDatabase = async () => {
    const userID = this.state.userID;
    const endpoint = `${this.URL}/api/notes/${userID}`;
    // const noteKey = 'Notes for ID:' + userID;
    const res = await fetch(endpoint, {
      method : 'POST',
      headers: {'Content-Type': 'application/json'},
      body : JSON.stringify({
        notes : this.state.notesList
      })
    });
    let body = await res.text();
    console.log(body);

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

    if (this.state.loggedIn) {
      this.setState({
        notesList : newNotesList
      }, this.updateDatabase)
    } else {
        this.setState({
          notesList : newNotesList
        });
      }
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
    if (this.state.loggedIn) {
      this.setState({
        notesList : newNotesList
      }, this.updateDatabase)
    } else {
        this.setState({
          notesList : newNotesList
        });
      }
  }

  handleLogin = () => {
    console.log('login clicked');
    this.setState({
      showPopup : ! this.state.showPopup,
      signup : false
    })
  }

  handleLogout = async () => {
    const endpoint = this.URL + "/logout";
    const res = await fetch(endpoint, {
      method : 'POST'
    });
    if(res.status === 200)
     this.setState({
      loggedIn : false,
      username : null,
      userID   : null,
      notesList : []
    });
  }

  getNotes = async () => {
    console.log('func');
    const userID = this.state.userID;
    // const userID = 1;
    const endpoint = `${this.URL}/notes/${userID}`;
    const res = await fetch(endpoint, {
      method: 'GET',
      headers: { 
        'Content-Type': 'text/plain',
        'Accept': 'application/json'
     }
    })
    const body = await res.json();
    var newNotesList = [];
    for(let i=0; i < body.length; i++){
      newNotesList.push(body[i].note);
    }
    this.setState({
      notesList : newNotesList
    })
  }

  /**
   * CHECK IF USERNAME IS AVAILABLE WHEN SIGNING UP
   */
  validateUsername =  async () => {
    if(this.state.signup) {
      const endpoint = `${this.URL}/validateUsername`;
      const res = await fetch(endpoint, {
        method : 'GET',
        headers : {
          'Content-Type': 'text/plain',
          'Accept': 'application/json'
        }
      });
      const body = await res.json();
      var usernamesList = [];
      for(let i=0; i < body.length; i++){
        usernamesList.push(body[i].username);
      }
      console.log(usernamesList);
    }
  }

  

  render(){
    return (
      <div>
          <Header />
          <LoginPopup showPopup = {this.state.showPopup} handlePopup = {this.handleLogin}
           signup = {this.signup} isSignup = {this.state.signup} loginRequest = {this.loginRequest}
            validateUsername = {this.validateUsername}/>
          <Login login = {this.handleLogin} loggedIn = {this.state.loggedIn}
           username = {this.state.username}/>
          <NewNote handleClick = {this.handleAdd}/>
          <InputBox handleClick = {this.handleCreate} show = {this.state.showInputBox} />
          <Display notesList = {this.state.notesList}
           edit = {this.handleEdit} delete = {this.handleDelete} save = {this.saveAfterEdit} />
          <User loggedIn = {this.state.loggedIn} logout = {this.handleLogout} />
        </div>
    )
     
  }
}



export default App;


// "build": "GENERATE_SOURCEMAP=false react-scripts build",
// "winBuild": "set \"GENERATE_SOURCEMAP=false\" && react-scripts build",