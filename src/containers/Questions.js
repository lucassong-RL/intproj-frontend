import React from "react";
import {Button} from "react-bootstrap";
import styled from "styled-components"

export default function Question(props) {
  return (
    <div className="questions">
      {props.questions && props.questions.map(data => 
        <Button id={data} style={{margin: "15px"}} onClick={e=> props.handleQSelection(e.target.parentElement.id)}>
          <QuestionCard>
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

