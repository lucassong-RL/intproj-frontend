import React from 'react'
import styled from 'styled-components'
 
function randomColor() {
  let colors = ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"];
  return colors[Math.floor(Math.random() * colors.length)];
}

export default function Players(props) {

  const players = props.players
  return (
    <LobbyWrapper>
    
      <HeaderWrapper style={{borderBottom: "1px solid #DADEDF", paddingBottom: "0.5rem"}}> <b> Players in Lobby </b> </HeaderWrapper>
      <PlayerWrapper>
      {players.length > 0 ? players.map(user => <Player style={{color: randomColor()}}> {user} </Player>) : <> None </>}
      </PlayerWrapper>
    </LobbyWrapper>
  );
}

const HeaderWrapper = styled.h4`
    color: ${randomColor}; 
    -webkit-text-stroke-width: 0.2px;
    -webkit-text-stroke-color: black;
`

const LobbyWrapper = styled.div`
    background-color: ${randomColor}; 
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
`
