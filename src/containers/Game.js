import React from 'react'
import styled from 'styled-components'
import Questions from './Questions'
import Players from '../components/Players'
import { Button, FormControl } from 'react-bootstrap'


export default function Game(props) {

  function copyToClipboard() {
    var dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute('value', props.gameId);
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }
  return (
    <GridWrapper>
        <Col style={{flexGrow: 1}}>
          <h1> {props.header} </h1>
          {props.description && <p> {props.description} </p>}
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
            <h5> You are in room &nbsp;
                <Button id="copy" onClick={() => copyToClipboard()}> <b>{props.gameId} </b> </Button> 
            </h5>
            }
        </Col>
    </GridWrapper>
  )
}

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
