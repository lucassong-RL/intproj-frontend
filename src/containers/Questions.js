import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { onError } from "../libs/errorLib";
import config from "../config";
import {Button} from "react-bootstrap";
import styled from "styled-components"

const questions = [
  {id: '4', question: 'question 1'}, 
  {id: '5', question: 'question 2'},
  {id: '6', question: 'question 1'}, 
  {id: '7', question: 'question 1'}, 
  {id: '8', question: 'question 1'}
]

export default function Question(props) {

  return (
    <div className="questions">
      {props.questions.map(data => 
        <Button style={{margin: "15px"}}>
          <QuestionCard>
            {data.question}
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

