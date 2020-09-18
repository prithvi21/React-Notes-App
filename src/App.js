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
    this.refsList = React.createRef();
    this.refsList.current = [];
    console.log(this.URL);
    this.state = {
      notesList : [],
      noteEditable : [],//values of true or false of each note index
      addNoteClicked : false,
      showInputBox : false,
      showPopup : false,
      signup : false,
      loggedIn : false,
      name : null,
      username : null,
      password : null,
      userID : null,
      currentNote : null
    };
  }

  

  createUserRequest = async () => {
    console.log('create');
    const endpoint = this.URL + "/create";
    const res = await fetch(endpoint, {
      method : 'POST',
      headers : {
        'Content-type' : 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body : JSON.stringify({
        name      : this.state.name,
        username  : this.state.username,
        password  : this.state.password
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
          'X-Requested-With': 'XMLHttpRequest'
        },
        body : JSON.stringify({
          username  : this.state.username,
          password  : this.state.password
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
    console.log('signup');
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
   if(this.state.currentNote === ''){
    alert("Note can't be empty");
     event.preventDefault();
     return;
   }
   if(this.state.loggedIn){
    this.setState({
      notesList : this.state.notesList.concat(this.state.currentNote),
      showInputBox : false
    },this.updateDatabase);
   } else {
       this.setState({
         notesList : this.state.notesList.concat(this.state.currentNote),
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
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
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
    },this.getNotes);
    else {
      alert('Wrong Username/Password');
    }
    // this.getNotes();
    // return body;
  }


  updateDatabase = async () => {
    const userID = this.state.userID;
    const endpoint = `${this.URL}/api/notes/${userID}`;
    // const noteKey = 'Notes for ID:' + userID;
    const res = await fetch(endpoint, {
      method : 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body : JSON.stringify({
        notes : this.state.notesList
      })
    });
    let body = await res.text();
    console.log(body);

  }

  handleEdit = (noteID) => {
    const a = this.state.noteEditable;
    a[noteID] = true;
    this.setState({
      noteEditable : a
    })
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
    const a = this.state.noteEditable;
    a[noteID] = false;
    this.setState({
      noteEditable : a
    })
    //replacing the note with the edited note and updating state
    const newNotesList = this.state.notesList;
    // const newNote = document.getElementById(id).textContent; // working but not ideal
    const newNote = this.refsList.current[noteID].innerText;
    console.log(this.state.currentNote);
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

  handlePopup = () => {
    this.setState({
      showPopup : ! this.state.showPopup,
      signup : false
    })
  }

  handleLogout = async () => {
    const endpoint = this.URL + "/logout";
    const res = await fetch(endpoint, {
      method : 'POST',
      headers : {
        'X-Requested-With': 'XMLHttpRequest'
      }
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
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
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
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      const body = await res.json();
      var usernamesList = [];
      for(let i=0; i < body.length; i++){
        usernamesList.push(body[i].username);
      }
      // VALIDATION
      return (usernamesList.includes(this.state.username)) ? Promise.resolve(true) : Promise.resolve(false);
    }
    // return (1+1 ==2) ? Promise.resolve(true) : Promise.resolve(false);
  }


  handleChange = async event => {
    console.log(event.target.name);
    /**
     * event.target.name is either name, username,password or currentNote
     */
    this.setState({
      [event.target.name] : event.target.value
    });
  }

  closeAddNote = () => {
    console.log('ok');
    this.setState({
      showInputBox : false
    });
  }

  

  render(){
    return (
      <div>
          < Header />
          < LoginPopup showPopup = { this.state.showPopup } handlePopup = { this.handlePopup }
           signupClicked = { this.signup } isSignup = { this.state.signup } loginRequest = { this.loginRequest }
            validateUsername = { this.validateUsername } handleChange = { this.handleChange } />
          < Login  handlePopup = { this.handlePopup } isLoggedIn = { this.state.loggedIn } />
          < NewNote addNoteClicked = { this.handleAdd } />
          < InputBox handleCreate = { this.handleCreate } showInputBox = { this.state.showInputBox }
           handleChange = {this.handleChange} closeAddNote = { this.closeAddNote } />
          < Display notesList = { this.state.notesList } isEditable = { this.state.noteEditable }
           edit = { this.handleEdit } delete = { this.handleDelete } save = { this.saveAfterEdit } refsList = { this.refsList } />
          < User isLoggedIn = { this.state.loggedIn } handleLogout = { this.handleLogout } />
        </div>
    )
     
  }
}



export default App;


// "build": "GENERATE_SOURCEMAP=false react-scripts build",
// "winBuild": "set \"GENERATE_SOURCEMAP=false\" && react-scripts build",