"use client"

import React from 'react';

export enum PlayerColor {
  RED = 'red',
  YELLOW = 'yellow'
}

interface PlayerTokenProps {
  player: PlayerColor;
  opacity?: number;
  size?: number | string;
}

/**
 * Token created using Afinity Design App. (Similar to Adobe Illustrator)
 * @param player
 * @param opacity
 * @param size
 * @constructor
 */
const PlayerToken = ({player, opacity=1.0, size=100}: PlayerTokenProps) => {
  const playerColor = player === 'yellow' ? '#bc8e0d' : '#cc0000';
  const playerColor2 = player === 'yellow' ? '#5d4505' : '#640000';
  return (
    <svg
      width={typeof size === 'number' ? `${size}px` : size}
      height={typeof size === 'number' ? `${size}px` : size}
      opacity={opacity}
      viewBox="0 0 256 256">
    <circle
      cx="129.5"
      cy="127.5"
      r="121.5"
      fill={playerColor}
      stroke="black"
      strokeWidth="2px"/>
    <g transform="matrix(0.797929,0,0,0.797929,26.1683,26.2641)">
      <circle
        cx="129.5"
        cy="127.5"
        r="121.5"
        fill={playerColor2}
        stroke="black"
        strokeWidth="2px"/>
    </g>
</svg>
  )
}

export default PlayerToken;
