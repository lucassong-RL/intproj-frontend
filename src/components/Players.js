import React from 'react'
import styled from 'styled-components'
 
export default function Players(props) {
  function randomColor() {
    let colors = ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  const players = props.players
  return (
    <LobbyWrapper>
      <h4 style={{borderBottom: "1px solid #DADEDF", paddingBottom: "0.5rem"}}> <b> Players in Lobby </b> </h4>
      <PlayerWrapper>
      {players.length > 0 ? players.map(user => <Player style={{color: randomColor()}}> {user} </Player>) : <> None </>}
      </PlayerWrapper>
    </LobbyWrapper>
  );
}

const LobbyWrapper = styled.div`
    border: 3px solid #2A9D8F;
    margin: 1rem 0rem;
    border-radius: 1rem;
    width: 100%;
    padding: 1rem;
    text-align: center;
`
const PlayerWrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    font-weight: 600;
`
const Player = styled.div`
    padding: 1em;
`