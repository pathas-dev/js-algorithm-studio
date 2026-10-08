import { useId, type SVGProps } from 'react';

// Orthographic node geometry: the meridians turn, while values and edges stay fixed.
export default function PlanetMark({ cx = 0, cy = 0, r, fill = '#82968c', stroke = '#526b60', strokeWidth = 1, ...rest }: SVGProps<SVGCircleElement>) {
  const id = useId();
  const lightId = `${id}-light`;
  const radius = Number(r);
  return <g transform={`translate(${cx} ${cy})`} className="planet-mark" style={{ '--spin-period': `${8 + Math.min(radius, 24) / 6}s` } as React.CSSProperties}>
    <defs><clipPath id={id}><circle r={r} /></clipPath><radialGradient id={lightId} cx="30%" cy="24%" r="76%"><stop offset="0" stopColor="#fff6e6" stopOpacity=".22" /><stop offset=".45" stopColor="#fff6e6" stopOpacity="0" /><stop offset="1" stopColor="#0b1012" stopOpacity=".52" /></radialGradient></defs>
    <circle {...rest} r={r} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
    <g clipPath={`url(#${id})`} pointerEvents="none"><g className="planet-meridians" stroke="#0b1012" strokeWidth={Math.max(.5, radius / 18)} fill="none" opacity=".45">
      <ellipse rx={radius * .42} ry={radius} /><ellipse rx={radius} ry={radius * .35} />
      <path d={`M${-radius} ${radius * .4} Q0 ${radius * .85} ${radius} ${radius * .4} M${-radius} ${-radius * .4} Q0 ${-radius * .85} ${radius} ${-radius * .4}`} />
    </g></g>
    <circle r={r} fill={`url(#${lightId})`} pointerEvents="none" opacity={rest.opacity} />
    <circle r={radius + 3} fill="none" stroke={stroke === 'none' ? '#526b60' : stroke} strokeWidth=".5" opacity=".6" />
  </g>;
}
