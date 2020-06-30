import React, {useEffect, useState, useRef} from "react";
import { FormControl, Button } from "react-bootstrap";
import "./App.css";
import Questions from './containers/Questions';
import styled from 'styled-components';
import Players from './components/Players';
import Game from './containers/Game';

export default function App() {
  const [gameId, setId] = useState("");
  const [startGame, setGameStart] = useState(false) // players have all joined, start game 
  const [nickname, setNickname] = useState('')
  const [question, setQuestion] = useState('')
  const [generateGame, setGenerateGame] = useState(false)
  const [potentialAns, setPotentialAns] = useState([])
  const [potentialQs, setPotentialQs] = useState([])
  const [currAnswerer, setCurrAnswerer] = useState("")
  const [currQuestion, setCurrQuestion] = useState("")
  const [currQuestionID, setCurrQuestionID] = useState("")
  const [gameState, setGameState] = useState("submit")
  const [admin, setAdmin] = useState(false)
  const [players, setPlayers] = useState([])
  const [myTurn, setMyTurn] = useState(false)
  const [newQs, setNewQs] = useState("")
  const [readyToStart, setReadyToStart] = useState(false)

  function renderStages(gameState) {
    switch(gameState) {
      case 'submit': return ( 
        <Game header="What's Your Question?"
            gameId={gameId}
            handleQuestionSubmit={()=>handleQuestionSubmit()}
            setQuestion={setQuestion}
            players={players}
        />
      );
      case 'waitsubmit': return (
        <Game header={readyToStart ? "All Questions are in" : "Waiting for Players to Submit Questions"}
            description={readyToStart ? "The game is afoot" : "*cue jeopardy theme song*"}
            gameId={gameId}
            startRound={() => startRound()}
            admin={admin}
            players={players}
            newQs={newQs}
            showQs={true}
            readyStart={readyToStart}
        />
      );
      case 'waitanswer': return (
          <Game header={currAnswerer + " is picking a question!"}
              description="doo be doo"
              gameId={gameId}
              players={players}
          />
      ); 
      case 'answer': return (
        <Game header={myTurn ? "Answer on Zoom for Everyone!" : currAnswerer + " has chosen!"}
            description={myTurn ? "Be honest... ;)" : "Pay attention to the Zoom for their answer!"}
            gameId={gameId}
            question={currQuestion}
            myTurn={myTurn}
            finishQuestion={finishQuestion}
            // answerer={currAnswerer}
            players={players}
        />
      ); 
      case 'pickquestion': return(
        <Game header="Choose a Question"
            description="no peeking!"
            gameId={gameId}
            questions={potentialQs}
            handleSelection={e=> handleQSelection(e)}
            players={players}
        />
      );
      case 'pickplayer': return(
        <Game header="Hot Potato"
            description="Choose a player to Answer next"
            gameId={gameId}
            potentialAns={potentialAns}
            pickNextUser={pickNextUser}
            players={players}
        />
      );
      default: return (
        <Game header={"uh oh, you've broken the game. Please refresh and rejoin room " + gameId}
        />
      );
    }
  }

  const ws = useRef(null)
  useEffect(() => {
    ws.current = new WebSocket("wss://g4lpvfv7x5.execute-api.us-east-2.amazonaws.com/dev")
    try {
      ws.current.onmessage = (e) => {
        const data = JSON.parse(e.data)
        const messageType = data.type
        switch(messageType) {
          case "newPlayer": 
            setPlayers(data.users)
            break;
          // returns all people that can still play
          case "newQuestion": 
            console.log("new question" ,data)
            setNewQs(data.question)
            if (data.numQuestions == data.numPlayers){
              setReadyToStart(true);
            }
            break;
          case "pickAnswerer":  
            setPotentialAns(data.options) 
            setMyTurn(false)
            break;
          // returns all questions that can still be answered
          case "pickQuestion":  
            const qs = data.questionIDs
            setMyTurn(true)
            setPotentialQs(qs)
            setGameState("pickquestion")
            break;
          
          // returns whoever has been selected to answer next
          case "nextAnswerer": 
            setCurrAnswerer(data.answerer)
            setGameState("waitanswer")
            break;
          // returns the question to be answered now
          case "question": 
            setCurrQuestion(data.question)
            setGameState("answer")
            break;
          default: 
        }
        console.log("messsage", e)
      }
      ws.current.onerror = (e) => {
        console.log("error: ", e)
      }
      ws.current.onopen = e => {
        console.log("connected: ", e)
      }
    }
    catch(e) {console.log("error: ", e) }
  }, []);

  useEffect(() => { 
    if (currQuestionID !== "") {
       ws.current.send(JSON.stringify({"action": "askQuestion", "questionID": `${currQuestionID}`}))
    }
  }, [currQuestionID])

  useEffect(() => () => {ws.current.close()}, [ws])

  function startRound() {
    ws.current.send(JSON.stringify({"action": "startGame"}))
  }

  function handleGenerate() {
    if (nickname !== "") {
      const roundId = makeid(5)
      setId(roundId)
      setAdmin(true)
      ws.current.send(JSON.stringify({"action": "updateUserInfo", "roundID": `${roundId}`, "username": `${nickname}`}))        
      
      setGameStart(true)
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
        ws.current.send(JSON.stringify({"action": "updateUserInfo", "roundID": `${gameId}`, "username": `${nickname}`})) 

       ws.current.send(JSON.stringify({"action": "getPotentialAnswerers"} ))
      // need to push nickname, connect to real-time and store connection id in state
      // need to store roundin in connection id to query others users
    }

    else {
        alert("Please enter a nickname")
    }
  }

  function handleQuestionSubmit() {
    ws.current.send(JSON.stringify({"action": "createQuestion", "question": `${question}`}))
    setGameState("waitsubmit")
  }

  function handleQSelection(questionID) {
    setCurrQuestionID(questionID) 
  }

  function finishQuestion() {
    ws.current.send(JSON.stringify({"action": "getPotentialAnswerers"}))
    setGameState("pickplayer")
  }

  function pickNextUser(user) {
    ws.current.send(JSON.stringify({"action": "setAnswerer", "answerer": `${user}`}))  
    console.log("picked", user)
  }


// UTILITY FUNCTIONS // 
  function makeid(length) {
     var result           = '';
     var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
     var charactersLength = characters.length;
     for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
     }
     return result;
  }

  function copyToClipboard() {
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute('value', gameId);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy); 
  };
// UTILITY FUNCTIONS // 
  
  if (!startGame) return (
    <div className="App container">
        <LobbyWrapper>
          <h1> Personal Trivia </h1> 
          <hr></hr>
          {nickname && 
            <h2> Welcome {nickname} </h2>
          }
          {!nickname && 
            <h2> Enter nickname to get started: {nickname} </h2>
          }
        <NickNameWrapper>
          <FormControl size="lg" type="text" id="nickname" placeholder="Nickname" onChange={e => setNickname(e.target.value)}/>
        </NickNameWrapper>
         <NewGameWrapper>
            <div>
              <Button id="newgame" size="lg" onClick={() => handleGenerate()}>Start New Game </Button>
            </div>
         </NewGameWrapper>
          <JoinGameWrapper>
            <h3>
             -OR-
            </h3>
            <h3>
             Join Game
            </h3>
          <FormControl size="lg" type="text" id="roomcode" placeholder="Room Code" onChange={(e) => setId(e.target.value)}/>
            <div>
              <Button id="joingame" onClick={() => handleJoinGame()}> Join Game </Button>
            </div>
          </JoinGameWrapper>
        </LobbyWrapper>
    </div> 
  )

  else return (
    <div className='App container'>
      <LobbyWrapper>
        <PlayerHeader>
           {nickname}
        </PlayerHeader>
      {admin && <AdminHeader> game admin </AdminHeader>}
          {renderStages(gameState)}
      </LobbyWrapper>
    </div>
  );
}

const PlayerHeader = styled.div`
    text-align: right;
    opacity: 0.6
    font-size: 14px;
    font-weight: 400;
`

const AdminHeader = styled.div`
    text-align: right;
    opacity: 0.6;
    font-size: 10px;
    font-weight: bold;
`

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
