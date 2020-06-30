import React, {useState} from 'react'
import styled from 'styled-components'
import Questions from './Questions'
import Players from '../components/Players'
import { Button, FormControl } from 'react-bootstrap'


export default function Game(props) {
    const [showCopy, setShowCopy] = useState(false)

  function copyToClipboard() {
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute('value', props.gameId);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
    setShowCopy(true)
    setTimeout(() => {
      setShowCopy(false)
    }, 3000);
  }

  function toggleShowCopy(){ setShowCopy(!showCopy)}

  return (
    <GridWrapper>
        {showCopy && 
        <Copied>
            Copied to clipboard!
        </Copied>}
        <Col style={{flexGrow: 1}}>
          <h1> {props.header} </h1>
          {props.description && <b> {props.description} </b>}
          {props.showQs && <div> This just in: <b>{props.newQs}</b> </div>}
          {props.setQuestion && <FormControl size="lg" type="text" id="ask" placeholder="Ask a question" onChange={e => props.setQuestion(e.target.value)}/>}
          {props.handleQuestionSubmit && <Button onClick={() => props.handleQuestionSubmit()}> submit </Button>}
          {(props.admin===true && props.readyStart) && <Button onClick={props.startRound}>Start the answerin!</Button>}
          {props.question && <h3> Question: {props.question} </h3>}
          {props.myTurn && 
              <>
              <div> <b> You are answering! </b></div>
              <Button id="finishans" onClick={props.finishQuestion}> Finish Answering </Button>
              </>
          }
          {(props.answerer && !props.myTurn) && <p> Current Answerer: {props.answerer} </p>}
          {props.questions && <Questions questions={props.questions} handleQSelection={e => props.handleSelection(e)}/>}
          {props.potentialAns && props.potentialAns.map(data => <Button onClick={(e) => props.pickNextUser(e.target.innerText)}>{data}</Button>)}
        </Col>
        <Col style={{maxWidth: "30%"}}>
            <Players players={props.players}/>
            {props.gameId && 
            <RoomWrapper> You are in room 
                <RoomID id="copy" onClick={() => copyToClipboard()}> <b>{props.gameId} 📋</b> </RoomID> 
            </RoomWrapper>
            }
        </Col>
    </GridWrapper>
  )
}

const RoomID = styled.span`
  margin: 5px;
  padding: 5px;
  font-size: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  transition: all 0.3s cubic-bezier(.25,.8,.25,1); 
  border-radius: 10px;
  cursor: pointer;
  white-space: pre;
  &:hover {
    transform: scale(1.2);
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
  }
`

const Copied = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    background-color: white;
    padding: 10px;
    margin: 15px;
    border-radius: 5px;
    box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
`

const RoomWrapper = styled.div`
    margin-top: 20px;
    font-size: 18px;
    width: auto;
`

const GridWrapper = styled.div`
    display: flex;
    justify-content: space-between
`

const Col = styled.div`
    min-width: 30%;
    text-align: left;
    padding: 1rem;
`

const RightCol = styled.div`
    margin-left: 2rem;
    float: left;
    width: 50%;
`
