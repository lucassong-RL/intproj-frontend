import React from "react";
import {Button} from "react-bootstrap";
import styled from "styled-components"

<<<<<<< HEAD
const questions = [
  {id: '4', question: 'question 1'}, 
  {id: '5', question: 'question 2'},
  {id: '6', question: 'question 1'}, 
  {id: '7', question: 'question 1'}, 
  {id: '8', question: 'question 1'}
]

export default function Question({qIDs, socket, ...props}) {

  
  return (
    <div className="questions">
      {qIDs.map(data => 
        <Button style={{margin: "15px"}} onClick={()=>socket(data)}>
          <QuestionCard>
            {}
=======
export default function Question(props) {
  return (
    <div className="questions">
      {props.questions && props.questions.map(data => 
        <Button id={data} style={{margin: "15px"}} onClick={e=> props.handleQSelection(e.target.parentElement.id)}>
          <QuestionCard>
>>>>>>> 69f132a8223c99ecb6404c480a4479ccb91c5704
          </QuestionCard>
        </Button> )}
    </div>
  );
}

const QuestionCard = styled.div`
    min-height: 100px;
    min-width: 100px;
    margin: 55px
    padding: 50px;
    
`

