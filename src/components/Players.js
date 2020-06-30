import React from 'react'
import styled from 'styled-components'
 
function randomColor() {
  let colors = ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function randomColor2() {
  let colors=["#ADD9EB", "#BDEFEA", "#EAD6A2", "#E7C4A6", "#E5B0A2"]
  return colors[Math.floor(Math.random() * colors.length)];
}


export default function Players(props) {
  const players = props.players
  return (
    <LobbyWrapper>
      <HeaderWrapper> <b> Players </b> </HeaderWrapper>
      <PlayerWrapper>
      {players.length > 0 ? players.map(user => <Player style={{color: randomColor()}}> {user} </Player>) : <> None </>}
      </PlayerWrapper>
    </LobbyWrapper>
  );
}

const HeaderWrapper = styled.p`
    font-size: 16px;
    color: ${randomColor}; 
    -webkit-text-stroke-width: 0.2px;
    -webkit-text-stroke-color: black;
`

const LobbyWrapper = styled.div`
    background-color: ${randomColor2}; 
    opacity: 1;
    margin: 1rem 0rem;
    border-radius: 1rem;
    width: 100%;
    padding: 1rem;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
    transition: all 0.3s cubic-bezier(.25,.8,.25,1);

    &:hover {
        box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    }
    
`
const PlayerWrapper = styled.div`
    -webkit-text-stroke-width: 0.2px;
    -webkit-text-stroke-color: black;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    font-weight: 600;
`
const Player = styled.div`
    padding: 1em;
<<<<<<< HEAD
`
=======
`
>>>>>>> 9cfda0dcce9a70b59c77057d45cbb838f9868641
