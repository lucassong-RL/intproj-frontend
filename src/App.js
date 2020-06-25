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

  function makeid(length) {
     var result           = '';
     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
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

  return (!gameId ? (
    <div className="App container">
        <LobbyWrapper>
          <h1> personal trivia </h1> {nickname && 
            <h2> welcome {nickname} </h2>
          }
        <NickNameWrapper>
          <FormControl size="lg" type="text" placeholder="nickname" onChange={e => setNickname(e.target.value)}/>
        </NickNameWrapper>
         <NewGameWrapper>
            start new game 
            <div>
              <Button onClick={() => setId(makeid(5))}>start new game </Button>
            </div>
         </NewGameWrapper>
          <JoinGameWrapper>
             join game
          <FormControl size="lg" type="text" placeholder="room code"/>
          </JoinGameWrapper>
        </LobbyWrapper>
    </div> 
  )
 : (
   <>
    your room id is {gameId}
   <Button onClick={()=>setGameStart(true)}> lets go </Button>
   </>
 ));
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
