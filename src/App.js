import React, {useEffect, useState, useRef} from "react";
import { Link, useHistory} from "react-router-dom";
import { FormControl, FormGroup, Form, Button, Nav, Navbar, NavItem } from "react-bootstrap";
import "./App.css";
import Routes from './Routes';
import Questions from './containers/Questions';
import { LinkContainer } from "react-router-bootstrap";
import { AppContext } from "./libs/contextLib";
import { Auth } from "aws-amplify";
import { onError } from "./libs/errorLib";
import styled from 'styled-components';
import Sockette from 'sockette';


//const ws = new Sockette('wss://g4lpvfv7x5.execute-api.us-east-2.amazonaws.com/dev', {
//timeout: 5e3,
//maxAttempts: 10,
//onopen: e => console.log('Connected!', e),
//onmessage: e => console.log('Received:', e),
//onreconnect: e => console.log('Reconnecting...', e),
//onmaximum: e => console.log('Stop Attempting!', e),
//onclose: e => console.log('Closed!', e),
//onerror: e => console.log('Error:', e)
//})
//



export default function App() {
  const history = useHistory();
  const [isAuthenticated, userHasAuthenticated] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [gameId, setId] = useState("");
  const [startGame, setGameStart] = useState(false) // players have all joined, start game 
  const [nickname, setNickname] = useState('')
  const [question, setQuestion] = useState('')
  const [submitQuestion, setSubmitQuestion] = useState(true)

  // state variables for ws
  const [generateGame, setGenerateGame] = useState(false)
  const [potentialAns, setPotentialAns] = useState([])
  const [potentialQs, setPotentialQs] = useState([])
  const [currAnswerer, setCurrAnswerer] = useState("")
  const [currQuestion, setCurrQuestion] = useState("")

  const ws = useRef(new WebSocket("wss://g4lpvfv7x5.execute-api.us-east-2.amazonaws.com/dev"))

  useEffect(() => {
    try {
      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data)
        const messageType = data.type
        // returns all people that can still play
        if(messageType === "pickAnswerer") { setPotentialAns(data.options)} 
        // returns all questions that can still be answered
        if(messageType === "pickQuestion") { setPotentialQs(data.question_ids)}
        // returns whoever has been selected to answer next
        if(messageType === "nextAnswerer") { setCurrAnswerer(data.answerer)}
        // returns the question to be answered now
        if(messageType === "question") {setCurrQuestion(data.question) }
        
        console.log("message from", e)
      }
      ws.current.onopen = e => {
        console.log("connected", e)
      }
    }
    catch(e) {console.log("error: ", e) }
  });

  useEffect(() => () => ws.current.close(), [ws])


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
     ws.current.send(JSON.stringify({"action": "getPotentialAnswerers"} ))
      // need to push nickname, connect to real-time and store connection id in state
      // also need to initialize roundid in connectionid
      // ** how are we going to show the other players that have joined the lobby? **
    }
    else {
        alert("Please enter a nickname")
    }
  }

  function handleJoinGame() {
    if (nickname !== "") {
        setGameStart(true)
        ws.current.send({"action": "setAnswerer", "answerer": "Chad"})
      // need to push nickname, connect to real-time and store connection id in state
      // need to store roundin in connection id to query others users
    }

    else {
        alert("Please enter a nickname")
    }
  }

  function copyToClipboard() {
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute('value', gameId);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy); 
  };

  function handleQuestionSubmit() {
    console.log("question", question) 
    const response = ws.current.send({"action": "sendQuestion", "question": {question}})
    setSubmitQuestion(false)
    console.log("question sent, response: ", response)
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
       <h3> {nickname}, your room id is <b>{gameId}</b> <span> <Button size="sm" onClick={() => copyToClipboard()}>Copy</Button> </span> </h3>
        <p> send to ur friends! </p>
        <div>
         <Button onClick={()=>setGameStart(true)}> lets go </Button>
        </div> 
     </LobbyWrapper>
   </div>
 ));
  else return (submitQuestion ? (
    <div className="App container">
      <h1> whats your question, {nickname} ?</h1>
      <h3> you are in room <Button onClick={() => copyToClipboard()}> <b>{gameId} </b> </Button> </h3>
      <FormControl size="lg" type="text" placeholder="ask a question" onChange={e => setQuestion(e.target.value)}/> 
       <Button onClick={() => handleQuestionSubmit()}> submit </Button> 
    </div> ) : 
    (
      <div className="App container">
        <LobbyWrapper>
          <Questions questions={potentialQs}/>
        </LobbyWrapper>
      </div> 
    )
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
