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
      notesList : ['Default note'],
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
  //  document.getElementsByClassName("input")[0].style.visibility = "hidden";
  }

  handleEdit = (note_id) => {
    const id = 'note-' + note_id;
    document.getElementById(id).contentEditable = 'true';
  }


  handleDelete = (note_id) => {
    const id = 'display-' + note_id;
    console.log(note_id);
    document.getElementById(id).style.display = 'none';
  }

  render(){
    return (this.state.buttonClicked) 
      ?(
        <div>
          <Header />
          <NewNote handleClick = {this.handleAdd}/>
          <InputBox handleClick = {this.handleCreate} />
          <Display notesList = {this.state.notesList}
           edit = {this.handleEdit} delete = {this.handleDelete} />
        </div>)
      : (<div>
          <Header />
          <NewNote handleClick = {this.handleAdd}/>
         </div>);  
     
  }
}



export default App;
