import React from "react";
import Svg, {
  Ellipse,
  Polygon,
  Circle,
  Line,
  Rect,
  Defs,
  RadialGradient,
  Stop,
  LinearGradient,
  G,
  Path,
} from "react-native-svg";

export interface GameObject {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface SharkProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function Shark({ x, y, width: w, height: h }: SharkProps) {
  const cx = x + w * 0.35;
  const cy = y + h * 0.5;
  const rx = w * 0.42;
  const ry = h * 0.3;

  return (
    <G>
      {/* Glow effect */}
      <Ellipse
        cx={cx}
        cy={cy}
        rx={rx + 6}
        ry={ry + 6}
        fill="#00c8ff"
        opacity={0.18}
      />

      {/* Body */}
      <Ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="#0094cc" />

      {/* Top gradient highlight */}
      <Ellipse
        cx={cx}
        cy={cy - ry * 0.3}
        rx={rx * 0.7}
        ry={ry * 0.4}
        fill="#00e0ff"
        opacity={0.5}
      />

      {/* Dorsal fin */}
      <Polygon
        points={`
          ${x + w * 0.38},${y + h * 0.22}
          ${x + w * 0.52},${y}
          ${x + w * 0.62},${y + h * 0.22}
        `}
        fill="#00d4f0"
      />

      {/* Tail fin */}
      <Polygon
        points={`
          ${x + w * 0.73},${y + h * 0.38}
          ${x + w},${y + h * 0.08}
          ${x + w},${y + h * 0.52}
          ${x + w * 0.86},${y + h * 0.42}
          ${x + w},${y + h * 0.72}
          ${x + w * 0.73},${y + h * 0.65}
        `}
        fill="#00d4f0"
      />

      {/* Pectoral fin */}
      <Polygon
        points={`
          ${x + w * 0.3},${y + h * 0.62}
          ${x + w * 0.45},${y + h * 0.88}
          ${x + w * 0.55},${y + h * 0.62}
        `}
        fill="#0094cc"
      />

      {/* Eye white */}
      <Circle cx={x + w * 0.2} cy={y + h * 0.42} r={5} fill="white" />
      {/* Pupil */}
      <Circle cx={x + w * 0.21} cy={y + h * 0.42} r={2.5} fill="#001a33" />
      {/* Eye shine */}
      <Circle cx={x + w * 0.19} cy={y + h * 0.4} r={1} fill="white" />

      {/* Mouth */}
      <Path
        d={`M ${x + w * 0.04} ${y + h * 0.56} Q ${x + w * 0.11} ${y + h * 0.62} ${x + w * 0.2} ${y + h * 0.58}`}
        stroke="white"
        strokeWidth={1.5}
        fill="none"
      />
      {/* Teeth */}
      <Polygon
        points={`
          ${x + w * 0.07},${y + h * 0.58}
          ${x + w * 0.09},${y + h * 0.68}
          ${x + w * 0.11},${y + h * 0.58}
        `}
        fill="white"
      />
      <Polygon
        points={`
          ${x + w * 0.13},${y + h * 0.57}
          ${x + w * 0.15},${y + h * 0.67}
          ${x + w * 0.17},${y + h * 0.57}
        `}
        fill="white"
      />

      {/* Neon outline glow */}
      <Ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="none"
        stroke="#00ffff"
        strokeWidth={1.5}
        opacity={0.6}
      />
    </G>
  );
}

interface ObstacleProps {
  obs: GameObject;
}

export function ObstacleSpike({ obs }: ObstacleProps) {
  const mx = obs.x + obs.width / 2;
  return (
    <G>
      {/* Glow */}
      <Polygon
        points={`
          ${obs.x - 4},${obs.y + obs.height}
          ${mx},${obs.y - 4}
          ${obs.x + obs.width + 4},${obs.y + obs.height}
        `}
        fill="#ff2244"
        opacity={0.3}
      />
      {/* Spike */}
      <Polygon
        points={`
          ${obs.x},${obs.y + obs.height}
          ${mx},${obs.y}
          ${obs.x + obs.width},${obs.y + obs.height}
        `}
        fill="#cc0022"
      />
      {/* Highlight edge */}
      <Line
        x1={obs.x}
        y1={obs.y + obs.height}
        x2={mx}
        y2={obs.y}
        stroke="#ff4466"
        strokeWidth={1.5}
      />
    </G>
  );
}

interface CoinProps {
  coin: GameObject;
  bobOffset: number;
}

export function GoldCoin({ coin, bobOffset }: CoinProps) {
  const cx = coin.x + coin.width / 2;
  const cy = coin.y + coin.height / 2 + bobOffset;
  const r = coin.width / 2;

  return (
    <G>
      {/* Glow */}
      <Circle cx={cx} cy={cy} r={r + 5} fill="#ffd700" opacity={0.2} />
      {/* Coin body */}
      <Circle cx={cx} cy={cy} r={r} fill="#ffaa00" />
      {/* Shine */}
      <Ellipse
        cx={cx - r * 0.2}
        cy={cy - r * 0.2}
        rx={r * 0.5}
        ry={r * 0.35}
        fill="#ffe566"
        opacity={0.8}
      />
      {/* Rim */}
      <Circle cx={cx} cy={cy} r={r} fill="none" stroke="#cc8800" strokeWidth={1.5} />
    </G>
  );
}

interface GroundProps {
  width: number;
  height: number;
  groundY: number;
  scrollX: number;
}

export function Ground({ width, height, groundY, scrollX }: GroundProps) {
  const gridSpacing = 60;
  const lines = [];
  const offsetX = scrollX % gridSpacing;

  for (let i = -1; i < Math.ceil(width / gridSpacing) + 2; i++) {
    const gx = i * gridSpacing - offsetX;
    lines.push(
      <Line
        key={`vl${i}`}
        x1={gx}
        y1={groundY}
        x2={gx}
        y2={height}
        stroke="#005588"
        strokeWidth={0.5}
        opacity={0.6}
      />
    );
  }

  for (let gy = groundY; gy < height; gy += 30) {
    lines.push(
      <Line
        key={`hl${gy}`}
        x1={0}
        y1={gy}
        x2={width}
        y2={gy}
        stroke="#005588"
        strokeWidth={0.5}
        opacity={0.6}
      />
    );
  }

  return (
    <G>
      {/* Ground fill */}
      <Rect x={0} y={groundY} width={width} height={height - groundY} fill="#02090f" />
      {/* Grid lines */}
      {lines}
      {/* Neon ground line */}
      <Rect x={0} y={groundY} width={width} height={2} fill="#00c8ff" opacity={0.9} />
      {/* Ground glow */}
      <Rect x={0} y={groundY - 4} width={width} height={6} fill="#00c8ff" opacity={0.15} />
    </G>
  );
}

interface BackgroundProps {
  width: number;
  height: number;
  groundY: number;
  scrollX: number;
}

const STAR_DATA = [
  { bx: 50, y: 60, r: 1 },
  { bx: 120, y: 30, r: 1.5 },
  { bx: 200, y: 90, r: 1 },
  { bx: 280, y: 50, r: 1 },
  { bx: 330, y: 110, r: 1.5 },
  { bx: 80, y: 150, r: 1 },
  { bx: 250, y: 190, r: 1 },
  { bx: 170, y: 170, r: 1.5 },
  { bx: 310, y: 170, r: 1 },
  { bx: 40, y: 210, r: 1 },
  { bx: 360, y: 70, r: 1 },
  { bx: 140, y: 230, r: 1.5 },
];

const BUBBLE_DATA = [
  { bx: 90, y: 270, r: 8 },
  { bx: 200, y: 220, r: 5 },
  { bx: 310, y: 250, r: 10 },
  { bx: 150, y: 290, r: 6 },
  { bx: 260, y: 310, r: 4 },
];

export function Background({ width, height, groundY, scrollX }: BackgroundProps) {
  return (
    <G>
      {/* Sky gradient approximation */}
      <Rect x={0} y={0} width={width} height={groundY * 0.4} fill="#030818" />
      <Rect x={0} y={groundY * 0.4} width={width} height={groundY * 0.6} fill="#03050f" />

      {/* Stars */}
      {STAR_DATA.map((s, i) => {
        const px = ((s.bx - (scrollX * 0.05) % width) + width * 2) % width;
        return (
          <Circle
            key={`star${i}`}
            cx={px}
            cy={s.y}
            r={s.r}
            fill="white"
            opacity={0.7}
          />
        );
      })}

      {/* Bubbles */}
      {BUBBLE_DATA.map((b, i) => {
        const px = ((b.bx - (scrollX * 0.12) % width) + width * 2) % width;
        return (
          <Circle
            key={`bubble${i}`}
            cx={px}
            cy={b.y}
            r={b.r}
            fill="none"
            stroke="#004455"
            strokeWidth={1}
            opacity={0.5}
          />
        );
      })}
    </G>
  );
}
