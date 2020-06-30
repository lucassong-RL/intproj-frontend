import React, {useEffect, useState, useRef} from "react";
import { FormControl, Button } from "react-bootstrap";
import "./App.css";
//import Routes from './Routes';
import Questions from './containers/Questions';
import styled from 'styled-components';
import Players from './components/Players';

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

  function renderStages(gameState) {
    switch(gameState) {
      case 'submit': return ( 
        <>
            <h1> whats your question, {nickname} ?</h1>
            <h3> you are in room <Button id="copy" onClick={() => copyToClipboard()}> <b>{gameId} </b> </Button> </h3>
        <Players players={players}/>
            <FormControl size="lg" type="text" id="ask" placeholder="ask a question" onChange={e => setQuestion(e.target.value)}/> 
             <Button onClick={() => handleQuestionSubmit()}> submit </Button> 
        </>
      );
      case 'waitsubmit': return (
        <> waiting for all players to submit a question {admin && <Button id="forcestart" > start </Button> }</>
      )
      case 'waitanswer': return (<> current answerer is: {currAnswerer} </>);
      case 'answer': return (<> {currQuestion} <Button id="finishans" onClick={finishQuestion}> finished answering </Button> </>)
      case 'pickquestion': return(
        <> 
          questions to choose from 
          <Questions questions={potentialQs} handleQSelection={e => handleQSelection(e)}/> 
        </>
      );
      case 'pickplayer': return(<> {potentialAns.map(data => <Button onClick={(e) => pickNextUser(e.target.innerText)}>{data}</Button>)} </>);
      default: return (<> uh oh, you've broken the game. please refresh and rejoin </>);
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
          case "newPlayer": setPlayers(data.users)
            break;
          // returns all people that can still play
          case "pickAnswerer":  setPotentialAns(data.options) 
            break;
          // returns all questions that can still be answered
          case "pickQuestion":  
            const qs = data.questionIDs
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
        
        console.log("message from", e)
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

  function handleGenerate() {
    if (nickname !== "") {
      const roundId = makeid(5)
      setId(roundId)
      setAdmin(true)
      ws.current.send(JSON.stringify({"action": "updateUserInfo", "roundID": `${roundId}`, "username": `${nickname}`}))        
      
      setGenerateGame(true)
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
  
  if (!startGame) return (!generateGame ? (
    <div className="App container">
        <LobbyWrapper>
          <h1> personal trivia </h1> {nickname && 
            <h2> welcome {nickname} </h2>
          }
        <NickNameWrapper>
          <FormControl size="lg" type="text" id="nickname" placeholder="nickname" onChange={e => setNickname(e.target.value)}/>
        </NickNameWrapper>
         <NewGameWrapper>
            <h3>
              start new game 
            </h3> 
            <div>
              <Button id="newgame" onClick={() => handleGenerate()}>start new game </Button>
            </div>
         </NewGameWrapper>
          <JoinGameWrapper>
            <h3>
             join game
            </h3>
          <FormControl size="lg" type="text" id="roomcode" placeholder="room code" onChange={(e) => setId(e.target.value)}/>
            <div>
              <Button id="joingame" onClick={() => handleJoinGame()}> start </Button>
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
        <Players players={players}/>
        <div>
         <Button id="startgame" onClick={()=>setGameStart(true)}> lets go </Button>
        </div> 
     </LobbyWrapper>
   </div>
 ));

  else return (
    <div className='App container'>
      <LobbyWrapper>
      {admin && <AdminHeader> game admin </AdminHeader>}
          {renderStages(gameState)}
      </LobbyWrapper>
    </div>
  );
}

const AdminHeader = styled.div`
    text-align: right;
    opacity: 0.6;
    font-size: 14px;
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
