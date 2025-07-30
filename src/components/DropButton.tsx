import React from 'react';
import PlayerToken, {PlayerColor} from '@/components/PlayerToken';

const DropButton = ({ onClick, columnNumber, currentPlayer }:{
  onClick: (columnNumber: number) => void,
  columnNumber: number,
  currentPlayer: PlayerColor,
}) => {
  return (
    <button
      onClick={() => onClick(columnNumber)}
      style={{
        backgroundColor: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: '20px',
        height: '60px',
        position: 'relative',
        textAlign: 'center',
        width: '100px',
      }}
      className="drop-button"
    >

      <style jsx>{`
        .drop-button:hover svg {
          opacity: 1 !important;
        }
        
        .drop-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: white;
          opacity: 0;
          transition: opacity 0.4s ease-in-out;
        }
        
        .drop-button:hover .drop-text {
          opacity: 1;
        }
      `}</style>
      <div style={{position: 'relative', width: '100%', height: '100%'}}>
        <PlayerToken player={currentPlayer} size={60} opacity={0.5} />
        <span className="drop-text">Drop</span>
      </div>
    </button>
  )
}

export default DropButton;
