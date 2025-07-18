import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// Predefined Julia set constants for interesting patterns
const juliaConstants = [
  { cRe: -0.7, cIm: 0.27015 },
  { cRe: 0.285, cIm: 0.01 },
  { cRe: -0.4, cIm: 0.6 },
  { cRe: -0.8, cIm: 0.156 },
  { cRe: 0.0, cIm: 1.0 },
];

export default function ConductanceFractal() {
  const [fractalState, setFractalState] = useState({
    type: "mandelbrot",
    seed: Math.random(),
    baseHue: Math.random() * 360,
    mandelbrotZoom: 300,
    mandelbrotPanX: 2,
    mandelbrotPanY: 1.5,
    juliaCRe: -0.7,
    juliaCIm: 0.27015,
    juliaZoom: 2.5,
    lsystemIterations: 4,
    lsystemAngle: Math.PI / 6,
    sierpinskiDepth: 5,
    kochDepth: 3,
    kochAngle: Math.PI / 3,
  });
  const [terminalText, setTerminalText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fractalCanvasRef = useRef(null);

  const terminalLines = [
    "> Initializing fractal simulation...",
    "> Mapping complex patterns...",
    "> Self-similar structures emerging...",
  ];

  // Terminal text animation
  useEffect(() => {
    let currentLine = 0;
    let charIndex = 0;
    let currentText = "";
    const typeText = () => {
      if (currentLine < terminalLines.length) {
        if (charIndex < terminalLines[currentLine].length) {
          currentText += terminalLines[currentLine][charIndex];
          setTerminalText(currentText);
          charIndex++;
          setTimeout(typeText, 50);
        } else {
          currentText += "\n";
          setTerminalText(currentText);
          currentLine++;
          charIndex = 0;
          setTimeout(typeText, 500);
        }
      }
    };
    typeText();
  }, []);

  // Generate color palette based on base hue
  const generateColorPalette = (baseHue) => {
    return [
      `hsl(${baseHue}, 80%, 60%)`,
      `hsl(${(baseHue + 120) % 360}, 80%, 60%)`,
      `hsl(${(baseHue + 240) % 360}, 80%, 60%)`,
      `hsl(${(baseHue + 30) % 360}, 80%, 60%)`,
      `hsl(${(baseHue - 30) % 360}, 80%, 60%)`,
    ];
  };

  // Fractal generation with panning
  useEffect(() => {
    const canvas = fractalCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const width = canvas.width;
    const height = canvas.height;

    const { type, seed, baseHue } = fractalState;
    const colorPalette = generateColorPalette(baseHue);

    if (type === "mandelbrot") {
      const { mandelbrotZoom, mandelbrotPanX, mandelbrotPanY } = fractalState;
      const maxIter = 100;
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let zx = (x - width / 2) / mandelbrotZoom - mandelbrotPanX;
          let zy = (y - height / 2) / mandelbrotZoom - mandelbrotPanY;
          let cX = zx;
          let cY = zy;
          let iter = 0;
          while (zx * zx + zy * zy < 4 && iter < maxIter) {
            const tmp = zx * zx - zy * zy + cX;
            zy = 2 * zx * zy + cY;
            zx = tmp;
            iter++;
          }
          const hue = (iter / maxIter) * 360;
          ctx.fillStyle = iter === maxIter ? "#0a0a1a" : `hsl(${hue}, 100%, 50%)`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    } else if (type === "julia") {
      const { juliaCRe, juliaCIm, juliaZoom } = fractalState;
      const maxIter = 100;
      const moveX = 0;
      const moveY = 0;
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          let zx = 1.5 * (x - width / 2) / (0.5 * juliaZoom * width) + moveX;
          let zy = (y - height / 2) / (0.5 * juliaZoom * height) + moveY;
          let iter = 0;
          while (zx * zx + zy * zy < 4 && iter < maxIter) {
            const tmp = zx * zx - zy * zy + juliaCRe;
            zy = 2.0 * zx * zy + juliaCIm;
            zx = tmp;
            iter++;
          }
          const hue = (iter / maxIter) * 360;
          ctx.fillStyle = iter === maxIter ? "#0a0a1a" : `hsl(${hue}, 100%, 50%)`;
          ctx.fillRect(x, y, 1, 1);
        }
      }
    } else if (type === "lsystem") {
      const { lsystemIterations, lsystemAngle } = fractalState;
      const len = height / 4;
      ctx.clearRect(0, 0, width, height);
      const axiom = "F";
      const rules = {
        F: `F[+F]F[-F]F${seed > 0.5 ? "[+F][-F]" : "[+F]"}`,
      };
      let sentence = axiom;
      for (let i = 0; i < lsystemIterations; i++) {
        let nextSentence = "";
        for (let char of sentence) {
          nextSentence += rules[char] || char;
        }
        sentence = nextSentence;
      }
      const numInstances = 3;
      for (let i = 0; i < numInstances; i++) {
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate((i * 2 * Math.PI) / numInstances);
        ctx.translate(0, -height / 4);
        ctx.scale(1, -1);
        ctx.beginPath();
        ctx.strokeStyle = colorPalette[i % colorPalette.length];
        ctx.lineWidth = 2;
        let currentLen = len;
        const stack = [];
        for (let char of sentence) {
          if (char === "F") {
            ctx.moveTo(0, 0);
            ctx.lineTo(0, currentLen * (0.9 + Math.random() * 0.2));
            ctx.translate(0, currentLen);
          } else if (char === "+") {
            ctx.rotate(lsystemAngle);
          } else if (char === "-") {
            ctx.rotate(-lsystemAngle);
          } else if (char === "[") {
            stack.push({ matrix: ctx.getTransform(), len: currentLen });
            currentLen *= 0.75;
          } else if (char === "]") {
            const state = stack.pop();
            ctx.setTransform(state.matrix);
            currentLen = state.len;
          }
        }
        ctx.stroke();
        ctx.restore();
      }
    } else if (type === "sierpinski") {
      const { sierpinskiDepth } = fractalState;
      const size = 0.8 * Math.min(width, height) * (0.9 + Math.random() * 0.2);
      const heightTriangle = (size * Math.sqrt(3)) / 2;
      const centerX = width / 2;
      const centerY = height / 2;
      const drawTriangle = (x1, y1, x2, y2, x3, y3, depth) => {
        if (depth <= 0) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.lineTo(x3, y3);
          ctx.closePath();
          const colorIndex = Math.floor((depth / sierpinskiDepth) * colorPalette.length);
          ctx.fillStyle = colorPalette[colorIndex];
          ctx.fill();
          return;
        }
        const mid1X = (x1 + x2) / 2;
        const mid1Y = (y1 + y2) / 2;
        const mid2X = (x2 + x3) / 2;
        const mid2Y = (y2 + y3) / 2;
        const mid3X = (x1 + x3) / 2;
        const mid3Y = (y1 + y3) / 2;
        drawTriangle(x1, y1, mid1X, mid1Y, mid3X, mid3Y, depth - 1);
        drawTriangle(mid1X, mid1Y, x2, y2, mid2X, mid2Y, depth - 1);
        drawTriangle(mid3X, mid3Y, mid2X, mid2Y, x3, y3, depth - 1);
      };
      ctx.clearRect(0, 0, width, height);
      drawTriangle(
        centerX - size / 2,
        centerY - heightTriangle / 2,
        centerX + size / 2,
        centerY - heightTriangle / 2,
        centerX,
        centerY + heightTriangle / 2,
        sierpinskiDepth
      );
    } else if (type === "koch") {
      const { kochDepth, kochAngle } = fractalState;
      const size = 0.7 * Math.min(width, height);
      const heightTriangle = (size * Math.sqrt(3)) / 2;
      const startX = (width - size) / 2;
      const startY = (height + heightTriangle / 3) / 2;
      const drawLine = (x1, y1, x2, y2, depth) => {
        if (depth === 0) {
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
          return;
        }
        const dx = (x2 - x1) / 3;
        const dy = (y2 - y1) / 3;
        const x3 = x1 + dx;
        const y3 = y1 + dy;
        const x5 = x1 + 2 * dx;
        const y5 = y1 + 2 * dy;
        const angle = Math.atan2(y5 - y3, x5 - x3) - kochAngle;
        const length = Math.sqrt(dx * dx + dy * dy);
        const x4 = x3 + Math.cos(angle) * length;
        const y4 = y3 + Math.sin(angle) * length;
        drawLine(x1, y1, x3, y3, depth - 1);
        drawLine(x3, y3, x4, y4, depth - 1);
        drawLine(x4, y4, x5, y5, depth - 1);
        drawLine(x5, y5, x2, y2, depth - 1);
      };
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      ctx.lineWidth = 2;
      drawLine(startX, startY, startX + size, startY, kochDepth);
      drawLine(startX + size, startY, startX + size / 2, startY - heightTriangle, kochDepth);
      drawLine(startX + size / 2, startY - heightTriangle, startX, startY, kochDepth);
    }
    setIsLoading(false);
  }, [fractalState]);

  // Panning for scrollability
  const handleWheel = (e) => {
    e.preventDefault();
    setFractalState((prev) => {
      if (prev.type === "mandelbrot") {
        return {
          ...prev,
          mandelbrotPanX: prev.mandelbrotPanX + e.deltaX * 0.01,
          mandelbrotPanY: prev.mandelbrotPanY + e.deltaY * 0.01,
        };
      }
      return prev;
    });
  };

  const handleRandomize = () => {
    setIsLoading(true);
    const types = ["mandelbrot", "julia", "lsystem", "sierpinski", "koch"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    let newParams = {};
    switch (randomType) {
      case "mandelbrot":
        newParams = {
          mandelbrotZoom: 200 + Math.random() * 800,
          mandelbrotPanX: -2 + Math.random() * 4,
          mandelbrotPanY: -2 + Math.random() * 4,
        };
        break;
      case "julia":
        const randomJulia = juliaConstants[Math.floor(Math.random() * juliaConstants.length)];
        newParams = {
          juliaCRe: randomJulia.cRe,
          juliaCIm: randomJulia.cIm,
          juliaZoom: 1.5 + Math.random() * 2.0,
        };
        break;
      case "lsystem":
        newParams = {
          lsystemIterations: 4 + Math.floor(Math.random() * 3),
          lsystemAngle: Math.PI / 12 + Math.random() * (Math.PI / 3 - Math.PI / 12),
        };
        break;
      case "sierpinski":
        newParams = {
          sierpinskiDepth: 5 + Math.floor(Math.random() * 4),
        };
        break;
      case "koch":
        newParams = {
          kochDepth: 3 + Math.floor(Math.random() * 3),
          kochAngle: Math.PI / 6 + Math.random() * (Math.PI / 3 - Math.PI / 6),
        };
        break;
    }
    const baseHue = Math.random() * 360;
    const seed = Math.random();
    setFractalState((prev) => ({
      ...prev,
      type: randomType,
      seed,
      baseHue,
      ...newParams,
    }));
  };

  useEffect(() => {
    handleRandomize();
  }, []);

  return (
    <>
      <style>
        {`
          * {
            box-sizing: border-box;
          }
          body {
            margin: 0;
            font-family: monospace;
            background-color: #010116;
            color: #eee;
          }
          .header-container {
            position: relative;
            min-height: 100vh;
            height: auto;
            display: flex;
            flex-direction: column;
            padding: 1rem;
            background: radial-gradient(circle at center, rgba(0, 0, 0, 0.8) 0%, #000010 100%);
          }
          .rainbow-lightning {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              45deg,
              red,
              orange,
              yellow,
              green,
              blue,
              indigo,
              violet,
              indigo,
              blue,
              green,
              yellow,
              orange,
              red
            );
            background-size: 400% 400%;
            animation: rainbowLightning 10s ease infinite;
            opacity: 0.3;
            z-index: 0;
            filter: blur(10px);
          }
          @keyframes rainbowLightning {
            0% { background-position: 0% 0%; }
            50% { background-position: 100% 100%; }
            100% { background-position: 0% 0%; }
          }
          .overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
            z-index: 2;
            background: radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 70%);
            padding: 1.5rem;
            border-radius: 10px;
          }
          .overlay h1 {
            font-size: 2rem;
            margin: 0;
            color: #fff;
            text-shadow: 2px 2px 4px #000;
          }
          .overlay p {
            font-size: 1rem;
            margin: 0.5rem 0 0;
            color: #ddd;
            text-shadow: 1px 1px 2px #000;
          }
          .fractal-section {
            position: relative;
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            user-select: none;
          }
          .fractal-canvas {
            border-radius: 8px;
            max-width: 100%;
            max-height: 100vh;
            box-shadow: 0 0 15px rgba(0, 255, 255, 0.2);
            background-color: #000;
            image-rendering: pixelated;
            z-index: 1;
          }
          .terminal {
            position: absolute;
            bottom: 1rem;
            left: 1rem;
            right: 1rem;
            z-index: 10;
            background: rgba(0, 20, 40, 0.7);
            border-radius: 8px;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            width: calc(100% - 2rem);
            max-width: 400px;
            font-family: monospace;
            white-space: pre-wrap;
            color: #0ff;
            box-shadow: 0 0 20px #0ff;
            font-size: 0.9rem;
            line-height: 1.4;
          }
          .terminal-button-container {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          .terminal button {
            background: #0077aa;
            border: none;
            color: white;
            padding: 0.4rem 0.8rem;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: background 0.3s;
          }
          .terminal button:hover {
            background: #0099cc;
          }
          .terminal button:active {
            background: #005577;
          }
          .spinner {
            display: ${isLoading ? 'inline-block' : 'none'};
            width: 1rem;
            height: 1rem;
            border: 2px solid #0ff;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-left: 0.5rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @media (max-width: 600px) {
            .terminal {
              font-size: 0.8rem;
              padding: 0.8rem;
              max-width: 100%;
            }
            .terminal button {
              font-size: 0.8rem;
              padding: 0.3rem 0.6rem;
            }
            .overlay h1 {
              font-size: 1.5rem;
            }
            .overlay p {
              font-size: 0.9rem;
            }
            .overlay {
              padding: 1rem;
            }
          }
          @media (max-width: 400px) {
            .terminal {
              font-size: 0.7rem;
            }
            .terminal button {
              font-size: 0.7rem;
              padding: 0.25rem 0.5rem;
            }
          }
        `}
      </style>
      <motion.div
        className="header-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="rainbow-lightning" />
        <motion.div className="overlay" initial={{ opacity: 1 }}>
          <h1>An Overthinker's Almanac</h1>
          <p>Discover the gruel and sometimes beautiful qualities of existence</p>
        </motion.div>
        <section className="fractal-section">
          <canvas
            className="fractal-canvas"
            ref={fractalCanvasRef}
            width={window.innerWidth}
            height={window.innerHeight}
            onWheel={handleWheel}
          />
          <div className="terminal">
            <div className="terminal-button-container">
              <button onClick={handleRandomize}>Randomize</button>
              <div className="spinner"></div>
            </div>
            <pre>{terminalText}</pre>
          </div>
        </section>
      </motion.div>
    </>
  );
}