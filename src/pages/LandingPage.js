import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Fractals from "./fractals";
import Navbar from "../components/Navbar";

export default function MentallyIllBlogLanding() {
  const [showPopup, setShowPopup] = useState(false);
  const [colorScheme, setColorScheme] = useState("default");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");
  const [fractalSeed, setFractalSeed] = useState(Math.random());
  const [soundPlaying, setSoundPlaying] = useState(false);
  const [gridState, setGridState] = useState(Array(25).fill(false));
  const [gridEntropy, setGridEntropy] = useState(0);
  const [starEntropy, setStarEntropy] = useState(0);
  const [scrambleText, setScrambleText] = useState("");
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [currentThoughtIndex, setCurrentThoughtIndex] = useState(0);
  const [popupText, setPopupText] = useState("");
  const starCanvasRef = useRef(null);

  const brainRegions = [
    {
      id: "frontal",
      name: "Frontal Lobe",
      position: { x: 100, y: 100 },
      topics: ["Science", "Philosophy"],
      thoughts: ["Unraveling cosmic laws", "Questioning existence", "Logic fractures"],
    },
    {
      id: "parietal",
      name: "Parietal Lobe",
      position: { x: 100, y: 200 },
      topics: ["Spirituality", "Elevated States"],
      thoughts: ["Seeking divine truth", "Soaring beyond reality", "Ethereal whispers"],
    },
    {
      id: "occipital",
      name: "Occipital Lobe",
      position: { x: 100, y: 300 },
      topics: ["Drugs", "Visual Experiences"],
      thoughts: ["Chemical visions", "Warped perceptions", "Hallucinatory storms"],
    },
    {
      id: "temporal",
      name: "Temporal Lobe",
      position: { x: 200, y: 200 },
      topics: ["Depression", "Mood Swings"],
      thoughts: ["Dark voids of despair", "Emotional chaos", "Silent screams"],
    },
    {
      id: "hypothalamus",
      name: "Hypothalamus",
      position: { x: 150, y: 150 },
      topics: ["God", "Meaning"],
      thoughts: ["Divine wrestling", "Searching for purpose", "Cosmic void"],
    },
  ];

  const popupThoughts = [
    "The universe is conspiring against me.",
    "God whispers in the static of my mind.",
    "Science is just madness with numbers.",
    "Am I the shadow or the light?",
    "The void stares back, always.",
    "Colors bleed where thoughts collide.",
    "Reality is a drug I can't quit.",
    "Meaning slips through my fingers like sand.",
    "My brain is a cathedral of chaos.",
    "Every thought is a scream in silence.",
  ];

  // Popup text animation
  useEffect(() => {
    let interval;
    const triggerPopup = () => {
      if (Math.random() > 0.8) {
        setShowPopup(true);
        const thought = popupThoughts[Math.floor(Math.random() * popupThoughts.length)];
        let charIndex = 0;
        setPopupText("");
        interval = setInterval(() => {
          if (charIndex < thought.length) {
            setPopupText((prev) => prev + thought[charIndex]);
            charIndex++;
          } else {
            clearInterval(interval);
            setTimeout(() => setShowPopup(false), 2000);
          }
        }, 50);
      }
    };
    const popupInterval = setInterval(triggerPopup, 5000);
    return () => {
      clearInterval(popupInterval);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const thoughtInterval = setInterval(() => {
      setCurrentThoughtIndex((prev) => (prev + 1) % brainRegions[0].thoughts.length);
    }, 2000);
    return () => clearInterval(thoughtInterval);
  }, []);

  useEffect(() => {
    const canvas = starCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const stars = Array.from({ length: 10 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      hue: Math.random() * 360,
    }));

    const drawStar = (x, y, r, color) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          x + r * Math.cos((Math.PI * 2 * i) / 5 - Math.PI / 2),
          y + r * Math.sin((Math.PI * 2 * i) / 5 - Math.PI / 2)
        );
        ctx.lineTo(
          x + (r / 2) * Math.cos((Math.PI * (2 * i + 1)) / 5 - Math.PI / 2),
          y + (r / 2) * Math.sin((Math.PI * (2 * i + 1)) / 5 - Math.PI / 2)
        );
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        drawStar(star.x, star.y, 20, `hsl(${star.hue}, 80%, 60%)`);
      });
    };

    const calculateStarEntropy = () => {
      const gridSize = 10;
      const cellWidth = canvas.width / gridSize;
      const cellHeight = canvas.height / gridSize;
      const grid = Array(gridSize * gridSize).fill(0);

      stars.forEach((star) => {
        const cellX = Math.floor(star.x / cellWidth);
        const cellY = Math.floor(star.y / cellHeight);
        const cellIndex = cellY * gridSize + cellX;
        if (cellIndex >= 0 && cellIndex < grid.length) {
          grid[cellIndex]++;
        }
      });

      const probabilities = grid
        .filter((count) => count > 0)
        .map((count) => count / stars.length);
      const entropy = probabilities.length > 0
        ? -probabilities.reduce((sum, p) => sum - p * Math.log2(p), 0)
        : 0;
      setStarEntropy(entropy.toFixed(4));
    };

    draw();
    calculateStarEntropy();

    const handleClick = () => {
      const newStars = Array.from({ length: 10 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        hue: Math.random() * 360,
      }));
      stars.splice(0, stars.length, ...newStars);
      draw();
      calculateStarEntropy();
    };

    canvas.addEventListener("click", handleClick);
    return () => canvas.removeEventListener("click", handleClick);
  }, [fractalSeed]);

  const calculateGridEntropy = (grid) => {
    const pOn = grid.filter((state) => state).length / grid.length;
    const pOff = 1 - pOn;
    if (pOn === 0 || pOff === 0) return 0;
    return -(pOn * Math.log2(pOn) + pOff * Math.log2(pOff)).toFixed(4);
  };

  const playRandomSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.type = ["sine", "square", "triangle", "sawtooth"][Math.floor(Math.random() * 4)];
    oscillator.frequency.value = Math.random() * 1000 + 200;
    gainNode.gain.value = 0.1;
    oscillator.start();
    setSoundPlaying(true);
    setTimeout(() => {
      oscillator.stop();
      setSoundPlaying(false);
    }, 500);
  };

  const toggleGridCell = (index) => {
    setGridState((prev) => {
      const newGrid = prev.map((state, i) => (i === index ? !state : state));
      setGridEntropy(calculateGridEntropy(newGrid));
      return newGrid;
    });
  };

  const handleRegionClick = (index) => {
    const section = document.getElementById(`section-${index}`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
    <Navbar />
      <style>
        {`
          @keyframes glitch {
            0% { text-shadow: 2px 2px #ff4d4d, -2px -2px #4dffff; }
            50% { text-shadow: -2px -2px #ff4d4d, 2px 2px #4dffff; }
            100% { text-shadow: 2px 2px #ff4d4d, -2px -2px #4dffff; }
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 0.7; }
          }
          .glitch { animation: glitch 0.5s infinite; }
          .hexagon { clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); }
          .brain-path { transition: stroke 0.3s, stroke-width 0.3s; }
          .brain-path:hover { stroke: #39ff14; stroke-width: 3; }
          .distorted-text { font-family: 'Courier New', Courier, monospace; letter-spacing: 2px; transform: skewX(-10deg); text-shadow: 1px 1px #ff4d4d, -1px -1px #4dffff; }
          .terminal-font { font-family: 'Courier New', Courier, monospace; }
          .solfeggio-pulse { animation: pulse 3s infinite; }
          .unified-gradient { background: linear-gradient(to bottom, #2a1a5e, #3c2f8a, #143d14); }
        `}
      </style>
      <div className="min-h-screen terminal-font text-white">
        <Fractals />
        <section className="py-16 px-8 unified-gradient z-10">
          <div className="max-w-4xl mx-auto bg-[#3c2f8a] p-8 rounded shadow">
            <h2 className="text-3xl font-bold text-white">Featured Post</h2>
            <p className="mt-4 text-gray-300 glitch">"In the depths of my mind, brilliance and madness dance together..."</p>
            <div className="mt-4 text-sm text-gray-400">#Mixed | July 17, 2025</div>
          </div>
        </section>
        <section className="py-20 px-8 unified-gradient z-10">
          <h2 className="text-4xl font-bold text-center mb-10">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`bg-[#3c2f8a] p-6 rounded shadow hover:shadow-lg transition transform ${i % 2 === 0 ? "rotate-2" : "-rotate-2"
                  } ${i === 1 ? "border-4 border-[#39ff14]" : ""} ${i === 2 ? "bg-[#2a1a5e]" : ""}`}
              >
                <img
                  src={`https://via.placeholder.com/300x200?text=Post+${i}`}
                  alt={`Post ${i}`}
                  className="w-full h-48 object-cover rounded"
                />
                <h3 className="text-xl font-bold mt-4 text-white">Post Title {i}</h3>
                <p className="mt-2 text-gray-300">A brief excerpt from the post...</p>
              </div>
            ))}
          </div>
        </section>
        <section className="py-20 px-8 unified-gradient z-10">
          <h2 className="text-4xl font-bold text-center text-[#2a1a5e] mb-10 glitch">Brain Map</h2>
          <div className="flex flex-col md:flex-row items-start justify-center">
            <div className="relative w-full md:w-1/2">
              <img src="brain.png" alt="Brain" className="w-full h-auto" />
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 400 600">
                <line key="frontal-line" x1="0" y1="150" x2="800" y2="10" stroke="black" strokeWidth="2" className="brain-path" />
                <line key="parietal-line" x1="250" y1="150" x2="800" y2="190" stroke="black" strokeWidth="2" className="brain-path" />
                <line key="occipital-line" x1="450" y1="300" x2="800" y2="230" stroke="black" strokeWidth="2" className="brain-path" />
                <line key="temporal-line" x1="100" y1="350" x2="800" y2="380" stroke="black" strokeWidth="2" className="brain-path" />
                <line key="hypothalamus-line" x1="120" y1="360" x2="800" y2="520" stroke="black" strokeWidth="2" className="brain-path" />
              </svg>
            </div>
            <div className="w-full md:w-1/2 mt-8 md:mt-0 md:pl-8">
              {brainRegions.map((region, index) => (
                <div key={region.id} id={`section-${index}`} className="mb-8 p-4 bg-[#3c2f8a] rounded shadow">
                  <h3 className="text-xl font-bold text-white mb-2">{region.name}</h3>
                  <p className="text-gray-300 distorted-text">{region.thoughts[currentThoughtIndex]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-20 px-8 unified-gradient z-10">
          <h2 className="text-4xl font-bold text-center mb-10 glitch">Randomized Sound Generator</h2>
          <div className="text-center">
            <button
              className="px-6 py-3 bg-[#39ff14] text-black rounded hover:bg-[#2ecc10] disabled:bg-gray-500"
              onClick={playRandomSound}
              disabled={soundPlaying}
            >
              {soundPlaying ? "Sound Playing..." : "Trigger Glitch Sound"}
            </button>
          </div>
        </section>
        <section className="py-20 px-8 unified-gradient z-10">
          <h2 className="text-4xl font-bold text-center mb-10 glitch">Interactive Chaos Grid & Rotating Star Field</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <div className="flex flex-col items-center">
              <div className="grid grid-cols-5 gap-2 max-w-2xl mx-auto">
                {gridState.map((state, i) => (
                  <div
                    key={i}
                    className={`w-16 h-16 hexagon ${state ? "bg-[#ff4d4d]" : "bg-[#4dffff]"}`}
                    onClick={() => toggleGridCell(i)}
                  />
                ))}
              </div>
              <p className="mt-4 text-gray-300">Grid Entropy: {gridEntropy}</p>
            </div>
            <div className="flex flex-col items-center">
              <canvas ref={starCanvasRef} width="600" height="400" className="border border-[#39ff14]" />
              <button
                className="mt-4 px-4 py-2 bg-[#39ff14] text-black rounded hover:bg-[#2ecc10]"
                onClick={() => setFractalSeed(Math.random())}
              >
                Regenerate Stars
              </button>
              <p className="mt-4 text-gray-300">Star Field Entropy: {starEntropy}</p>
            </div>
          </div>
        </section>
        <section className="py-16 px-8 unified-gradient z-10">
          <h2 className="text-3xl font-bold text-center text-[#2a1a5e] mb-8">Categories</h2>
          <div className="flex justify-center space-x-4">
            {["Technology", "Philosophy", "Art", "Science", "Random"].map((category) => (
              <button
                key={category}
                className="px-4 py-2 bg-[#39ff14] text-black rounded hover:bg-[#2ecc10]"
              >
                {category}
              </button>
            ))}
          </div>
        </section>
        <section className="py-20 px-8 unified-gradient z-10">
          <div className="max-w-4xl mx-auto flex items-center">
            <img
              src="https://via.placeholder.com/150?text=Author"
              alt="Author"
              className="w-48 h-48 rounded-full mr-8 filter grayscale"
            />
            <div>
              <h2 className="text-3xl font-bold text-[#2a1a5e]">About the Author</h2>
              <p className="mt-4 text-gray-300">
                I am a genius trapped in a mind that doesn't always cooperate. This blog is my outlet, my canvas, my therapy.
              </p>
            </div>
          </div>
        </section>
        <footer className="py-10 unified-gradient text-white text-center z-10">
          <p>© 2025 Mentally Ill Genius Blog. All rights reserved.</p>
        </footer>
        {showPopup && (
          <div className="fixed top-4 left-4 bg-[#4dffff] text-black p-2 rounded shadow-lg z-50 max-w-xs text-sm">
            <p className="terminal-font">{popupText}</p>
          </div>
        )}
      </div>
    </>
  );
}