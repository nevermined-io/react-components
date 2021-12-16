import React from 'react';

export const NeverminedLogo = ({
  width = 115,
  height = 70,
  color = 'url(#nevermined_logo_gradient)',
}: {width?: number, height?: number, color?: string}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 115 70" fill="current" xmlns="http://www.w3.org/2000/svg">
      <path id="Union" fill-rule="evenodd" clip-rule="evenodd" d="M38.3223 69.5478L0 34.9521V0L38.3164 34.5904V0L76.6387 34.5957L114.251 0V34.9521L76.6387 69.5478L38.3223 34.9574V69.5478Z"
      fill={color}/>
      <defs>
        <linearGradient id="nevermined_logo_gradient" x1="0" y1="0" x2="116.586" y2="4.16323" gradientUnits="userSpaceOnUse">
          <stop stop-color="#7834F9"/>
          <stop offset="1" stop-color="#67CFF9"/>
        </linearGradient>
      </defs>
    </svg>
  )
};

export default NeverminedLogo;
