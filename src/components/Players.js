import React from 'react'
import styled from 'styled-components'
 
export default function Players(props) {
  const players = props.players
  return (
    <PlayerWrapper>
    <h4> <b> players in lobby </b> </h4>
    {players.length > 0 ? players.map(user => <div> {user} </div>) : <> none </>}
    </PlayerWrapper>
  );
}

const PlayerWrapper = styled.div`
    background-color: #f5f5f5;
    margin: 1rem 0rem;
    border-radius: 1rem;
    width: max-content;
    padding: 1rem;
`