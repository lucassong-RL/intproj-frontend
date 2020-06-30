import React from 'react'
import styled from 'styled-components'
import Questions from './Questions'
import Players from '../components/Players'
import {Button } from 'react-bootstrap'

export default function Game(props) {
  return (
    <GridWrapper>
        <Col>
          <h1> {props.header} </h1>
          {props.description && <p> {props.description} </p>}
          {props.gameId && 
          <h5> you are in room 
              <Button id="copy"> <b>{props.gameId} </b> </Button> 
          </h5>
          }
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

