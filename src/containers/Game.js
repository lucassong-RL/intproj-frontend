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
        <Col>
          <h1> {props.header} </h1>
          {props.description && <p> {props.description} </p>}
          {props.gameId && 
          <h5> you are in room 
              <Button id="copy" onClick={() => copyToClipboard()}> <b>{props.gameId} </b> </Button> 
          </h5>
          }
          {props.showQs && <div> this just in: <b>{props.newQs}</b> </div>}
          {props.setQuestion && <FormControl size="lg" type="text" id="ask" placeholder="ask a question" onChange={e => props.setQuestion(e.target.value)}/>}
          {props.handleQuestionSubmit && <Button onClick={() => props.handleQuestionSubmit()}> submit </Button>}
          {(props.admin===true) && <Button onClick={props.startRound}>start the answerin!</Button>}
          {props.question && <h3> current question: {props.question} </h3>}
          {props.myTurn && 
              <>
              <div> <b> you are answering! </b></div>
              <Button id="finishans" onClick={props.finishQuestion}> finish answering </Button>
              </>
          }
          {(props.answerer && !props.myTurn) && <p> current answerer: {props.answerer} </p>}
          {props.questions && <Questions questions={props.questions} handleQSelection={e => props.handleSelection(e)}/>}
          {props.potentialAns && props.potentialAns.map(data => <Button onClick={(e) => props.pickNextUser(e.target.innerText)}>{data}</Button>)}
        </Col>
        <Col>
            <Players players={props.players}/>
        </Col>
    </GridWrapper>
  )
}

const GridWrapper = styled.div`
    display: grid !important;
`

const Col = styled.div`
    grid-column: 1/2 !important;
`

