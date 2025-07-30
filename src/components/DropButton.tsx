import React from 'react';
import {PlayerColor} from '@/components/PlayerToken';

const DropButton = ({ onClick, columnNumber, currentPlayer }:{
  onClick: (columnNumber: number) => void,
  columnNumber: number,
  currentPlayer: PlayerColor,
}) => {
  return (
    <button
      onClick={() => onClick(columnNumber)}
      style={{
        border: `2px solid ${currentPlayer === PlayerColor.RED ? '#cc0000' : '#fdb300'}`,
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '20px',
        height: '50px',
        textAlign: 'center',
        width: '100px',
      }}
    >
      Drop
    </button>
  )
}

export default DropButton;
