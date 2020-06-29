import React from "react";
import { Button } from "react-bootstrap";
// import "./PlayerButton.css";

export default function PlayerButton({
  playerName,
  handleClick,
  className = "",
  ...props
}) {
  return (
    <Button
      className={`LoaderButton ${className}`}
      onClick={handleClick}
      {...props}
    >
      {props.children}
    </Button>
  )
}