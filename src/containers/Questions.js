import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { onError } from "../libs/errorLib";
import config from "../config";
import {Button} from "react-bootstrap";
import styled from "styled-components"
import COLORS from "../libs/colors"


export default function Question({qIDs, pickQuestion, ...props}) {

  function random_color() {
    return '#' +  Math.random().toString(16).substr(-6);
  }
  
  return (
    <div className="questions" style={{display: "flex", justifyContent: "space-around"}}>
      {qIDs.map(data => 
        <Button onClick={()=>pickQuestion(data)}>
          <QuestionCard style={{backgroundColor: random_color()}}/>
        </Button> )}
    </div>
  );
}

const QuestionCard = styled.div`
    min-height: 100px;
    min-width: 100px;
    padding: 50px;
`

