import React from "react";
import {Button} from "react-bootstrap";
import styled from "styled-components"

const colors = ['#264653', '#2A9D8F', '#E9C46A', '#F4A261', '#E76F51']


function random_color() {return colors[Math.floor(Math.random() * colors.length)]}

export default function Question(props) {
  console.log(random_color())
  return (
    <div className="questions">
      {props.questions && props.questions.map(data => 
          <QuestionCard id={data}  onClick={e=> props.handleQSelection(e.target.parentElement.id)}>
          </QuestionCard>
      )}
    </div>
  );
}

const QuestionCard = styled.div`
    width: 100px;
    height: 100px;
    max-height: 100px;
    max-width: 100px;
    min-height: 100px;
    min-width: 100px;
    border-radius: 5px;
    margin: 15px;
    background-color: ${random_color};
    opacity: 0.5;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);

    &:hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }
`

