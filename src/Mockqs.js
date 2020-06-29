import React from "react";
import Question from "./containers/Questions";

export default function Mockqs(){
    const qIDs = ["asdf", "iasdf", "astew", "wqwer", "ytrw"];
    return(
        <div className = "q">
            <Question qIDs={qIDs} socket={(x)=> console.log(x)} />
        </div>
    );
}