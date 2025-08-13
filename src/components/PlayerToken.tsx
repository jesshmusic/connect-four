'use client';

import React from 'react';

export enum PlayerColor {
  RED = 'red',
  YELLOW = 'yellow',
}

interface PlayerTokenProps {
  player: PlayerColor;
  size?: number | string;
  opacity?: number;
  isDropping?: boolean;
  dropRows?: number;
}

const PlayerToken = ({
  player,
  size = 100,
  opacity = 1,
  isDropping = false,
  dropRows,
}: PlayerTokenProps) => {
  const playerColor = player === PlayerColor.YELLOW ? '#bc8e0d' : '#cc0000';
  const playerColor2 = player === PlayerColor.YELLOW ? '#5d4505' : '#640000';
  const px = typeof size === 'number' ? `${size}px` : size;

  return (
    <>
      <div
        className={isDropping ? 'cf-drop' : undefined}
        style={
          {
            width: px,
            height: px,
            '--rows': dropRows ? dropRows : 0,
          } as React.CSSProperties
        }
      >
        <svg width={px} height={px} opacity={opacity} viewBox="0 0 256 256">
          <circle
            cx="129.5"
            cy="127.5"
            r="121.5"
            fill={playerColor}
            stroke="black"
            strokeWidth="2px"
          />
          <g transform="matrix(0.797929,0,0,0.797929,26.1683,26.2641)">
            <circle
              cx="129.5"
              cy="127.5"
              r="121.5"
              fill={playerColor2}
              stroke="black"
              strokeWidth="2px"
            />
          </g>
        </svg>
      </div>

      <style jsx>{`
        @keyframes cf-drop {
          from {
            transform: translateY(calc(-100% * var(--rows)));
          }
          to {
            transform: translateY(0);
          }
        }

        .cf-drop {
          animation: cf-drop 0.8s cubic-bezier(0.25, 0.8, 0.5, 1) forwards;
        }
      `}</style>
    </>
  );
};

export default PlayerToken;
