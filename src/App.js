import React, {useEffect, useState} from "react";
import { Link, useHistory} from "react-router-dom";
import { FormControl, FormGroup, Form, Button, Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from './Routes';
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { onError } from "./libs/errorLib";
import styled from 'styled-components';

export default function App() {
  const history = useHistory();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [gameId, setId] = useState("");
  const [startGame, setGameStart] = useState(false) // players have all joined, start game 
  const [nickname, setNickname] = useState('')
  const [question, setQuestion] = useState('')
  const [generateGame, setGenerateGame] = useState(false)

  function makeid(length) {
     var result           = '';
     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }

  function handleGenerate() {
    if (nickname !== "") {
      setId(makeid(5))
      setGenerateGame(true)
    }
    else {
        alert("Please enter a nickname")
    }
  }

  function handleJoinGame() {
    if (nickname !== "") {
        setGameStart(true)
    }

    else {
        alert("Please enter a nickname")
    }
  }

async function handleLogout() {
    await Auth.signOut();
    userHasAuthenticated(false);
    history.push("/login");
  }

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      await Auth.currentSession();
      userHasAuthenticated(true);
    }
    catch(e) {
      if (e !== 'No current user') {
        onError(e); 
      }
    }

    setIsAuthenticating(false);
  }

  if (!startGame) return (!generateGame ? (
    <div className="App container">
        <LobbyWrapper>
          <h1> personal trivia </h1> {nickname && 
            <h2> welcome {nickname} </h2>
          }
        <NickNameWrapper>
          <FormControl size="lg" type="text" placeholder="nickname" onChange={e => setNickname(e.target.value)}/>
        </NickNameWrapper>
         <NewGameWrapper>
            <h3>
              start new game 
            </h3> 
            <div>
              <Button onClick={() => handleGenerate()}>start new game </Button>
            </div>
         </NewGameWrapper>
          <JoinGameWrapper>
            <h3>
             join game
            </h3>
          <FormControl size="lg" type="text" placeholder="room code" onChange={(e) => setId(e.target.value)}/>
            <div>
              <Button onClick={() => handleJoinGame()}> start </Button>
            </div>
          </JoinGameWrapper>
        </LobbyWrapper>
    </div> 
  )
 : (
   <div className='App container'>
     <LobbyWrapper>
       <h3> {nickname}, your room id is {gameId} </h3>
        <div>
         <Button onClick={()=>setGameStart(true)}> lets go </Button>
        </div> 
     </LobbyWrapper>
   </div>
 ));
  else return (
    <div className="App container">
      <h1> ask your question {nickname} </h1>
      <h3> you are in room {gameId} </h3>
      <FormControl size="lg" type="text" placeholder="ask a question" onChange={e => setQuestion(e.target.value)}/> 
       <Button onClick={() => console.log("time to ans qs")}> submit </Button> 
    </div> 
  );
}
const LobbyWrapper = styled.div`
    margin: auto;
    width: 60vw;
`

const NewGameWrapper = styled.div`
    margin: 15px;
`

const NickNameWrapper = styled.div`
    margin: 15px;
`

const JoinGameWrapper = styled.div`
    margin: 15px;
`
