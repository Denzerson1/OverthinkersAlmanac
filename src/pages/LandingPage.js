import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Fractals from "./fractals";
import Navbar from "../components/Navbar";

export default function OverthinkersAlmanacLanding() {
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
  const [popupText, setPopupText] = useState("");
  const [thoughtIndices, setThoughtIndices] = useState(Array(5).fill(0));
  const starCanvasRef = useRef(null);

  const brainRegions = [
    {
      id: "frontal",
      name: "Frontal Lobe",
      position: { x: 100, y: 100 },
      topics: ["Cosmic Inquiry", "Existential Exploration"],
      thoughts: [
        "The Frontal Lobe is the epicenter of conscious thought, where we ponder the mysteries of the universe and our place within it. It is here that science and philosophy intertwine, allowing us to question, hypothesize, and ultimately expand our understanding of reality.",
        "In this lobe, the mind's capacity for overthinking becomes a tool for deep insight. By constantly challenging assumptions and exploring alternative perspectives, we uncover truths that lie hidden beneath the surface.",
        "The Frontal Lobe is where logic meets creativity, where rational thought gives way to intuitive leaps. It is the birthplace of innovation and the guardian of our intellectual curiosity."
      ],
    },
    {
      id: "parietal",
      name: "Parietal Lobe",
      position: { x: 100, y: 200 },
      topics: ["Spirituality", "Elevated States"],
      thoughts: [
        "The Parietal Lobe serves as the interface between the material and the spiritual. It allows us to perceive energies and presences that transcend the physical, guiding us towards higher states of consciousness and connection with the divine.",
        "In this region, we experience moments of transcendence, where the boundaries of self dissolve, and we become one with the universe. It is here that meditation and prayer find their neurological home.",
        "The Parietal Lobe whispers secrets of the cosmos, offering glimpses into realms unseen. It is the seat of intuition and psychic ability, where we can tap into collective knowledge and universal wisdom."
      ],
    },
    {
      id: "occipital",
      name: "Occipital Lobe",
      position: { x: 100, y: 300 },
      topics: ["Altered States", "Visionary Realms"],
      thoughts: [
        "The Occipital Lobe is the artist's palette of the brain, where colors, shapes, and patterns come to life. Through this lens, we not only see the world as it is but also as it could be, in all its infinite variations.",
        "Whether through the use of entheogens or deep meditative states, this lobe opens the door to alternate realities, allowing us to explore dimensions beyond our ordinary perception.",
        "In the Occipital Lobe, visions can be prophetic, artistic, or simply bizarre. It is where the mind's eye paints masterpieces that defy logic, inviting us to embrace the beauty of the irrational."
      ],
    },
    {
      id: "temporal",
      name: "Temporal Lobe",
      position: { x: 200, y: 200 },
      topics: ["Emotional Depth", "Shadow Work"],
      thoughts: [
        "The Temporal Lobe holds the archives of our emotional history, where joy and sorrow are stored side by side. It is through this lobe that we learn to navigate the complexities of our feelings, finding strength in vulnerability.",
        "Depression, when viewed through a spiritual lens, can be seen as a necessary descent into the underworld, a journey that ultimately leads to rebirth and renewal. The Temporal Lobe guides us through these dark nights of the soul.",
        "Mood swings are the brain's way of processing intense experiences, teaching us that life is a dance between light and shadow. In embracing our full emotional spectrum, we find authenticity and depth."
      ],
    },
    {
      id: "hypothalamus",
      name: "Hypothalamus",
      position: { x: 150, y: 150 },
      topics: ["Divine Connection", "Purpose Seeking"],
      thoughts: [
        "The Hypothalamus is the alchemist that transmutes our biological needs into spiritual quests. It reminds us that even our most basic instincts are part of a larger cosmic plan.",
        "In searching for God or meaning, we often look outward, but the Hypothalamus teaches us that the divine is also within, in the very chemistry of our bodies and the rhythms of our lives.",
        "This small but mighty structure governs our homeostasis, keeping us balanced between extremes. In its regulation, we find a metaphor for life's balance between chaos and order, between suffering and bliss."
      ],
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
    const canvas = starCanvasRef.current;
    const ctx = canvas.getContext("2d");
    const stars = Array.from({ length: 10 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      hue: 180 + Math.random() * 60, // Blues
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

      const totalStars = stars.length;
      const probabilities = grid
        .map((count) => (count > 0 ? count / totalStars : 0))
        .filter((p) => p > 0); // Only include non-zero probabilities
      const entropy = probabilities.length > 0
        ? -probabilities.reduce((sum, p) => sum + p * Math.log2(p), 0)
        : 0;
      setStarEntropy(entropy.toFixed(4));
    };

    draw();
    calculateStarEntropy();

    const handleClick = () => {
      const newStars = Array.from({ length: 10 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        hue: 180 + Math.random() * 60, // Blues
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
    setThoughtIndices((prev) =>
      prev.map((ti, i) => (i === index ? (ti + 1) % brainRegions[i].thoughts.length : ti))
    );
  };

  return (
    <>
      <Navbar />
      <style>
        {`
          @keyframes glitch {
            0% { text-shadow: 2px 2px #FF758F, -2px -2px #7FDBFF; }
            50% { text-shadow: -2px -2px #FF758F, 2px 2px #7FDBFF; }
            100% { text-shadow: 2px 2px #FF758F, -2px -2px #7FDBFF; }
          }
          @keyframes pulse {
            0% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 0.7; }
          }
          .glitch { animation: glitch 0.5s infinite; }
          .hexagon { clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%); }
          .brain-path { transition: stroke 0.3s, stroke-width 0.3s; stroke: #7FDBFF; }
          .brain-path:hover { stroke: #FF758F; stroke-width: 3; }
          .distorted-text { font-family: 'Courier New', Courier, monospace; letter-spacing: 2px; transform: skewX(-10deg); text-shadow: 1px 1px #FF758F, -1px -1px #7FDBFF; }
          .terminal-font { font-family: 'Courier New', Courier, monospace; }
          .solfeggio-pulse { animation: pulse 3s infinite; }
          .unified-gradient { background: linear-gradient(to bottom, #1A1A2E, #2D2D44); }
          .brain-region:hover {
            background-color: #FF758F;
            cursor: pointer;
          }
        `}
      </style>
      <div className="min-h-screen terminal-font text-white">
        <Fractals />
        <section className="py-16 px-8 unified-gradient z-10">
          <a href="/posts/featured-post" className="block">
            <div className="max-w-4xl mx-auto bg-[#2D2D44] p-8 rounded shadow">
              <h2 className="text-3xl font-bold text-white">Featured Post</h2>
              <p className="mt-4 text-gray-300 glitch">"In the depths of my mind, brilliance and madness dance together..."</p>
              <div className="mt-4 text-sm text-gray-400">#Mixed | July 17, 2025</div>
            </div>
          </a>
        </section>
        <section className="py-20 px-8 unified-gradient z-10">
          <h2 className="text-4xl font-bold text-center mb-10">Recent Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <a href={`/posts/post-${i}`} key={i} className="block">
                <div
                  className={`bg-[#2D2D44] p-6 rounded shadow hover:shadow-lg transition transform ${i % 2 === 0 ? "rotate-2" : "-rotate-2"
                    } ${i === 1 ? "border-4 border-[#7FDBFF]" : ""} ${i === 2 ? "bg-[#1A1A2E]" : ""}`}
                >
                  <img
                    src={`https://via.placeholder.com/300x200?text=Post+${i}`}
                    alt={`Post ${i}`}
                    className="w-full h-48 object-cover rounded"
                  />
                  <h3 className="text-xl font-bold mt-4 text-white">Post Title {i}</h3>
                  <p className="mt-2 text-gray-300">A brief excerpt from the post...</p>
                </div>
              </a>
            ))}
          </div>
        </section>
        <section className="py-20 px-8 unified-gradient z-10">
          <h2 className="text-4xl font-bold text-center text-white mb-10 glitch">Brain Map</h2>
          <div className="flex flex-col xl:flex-row items-center justify-center gap-8">
            <div className="relative w-full xl:w-1/2 max-w-3xl flex justify-center order-1 xl:order-0">
              <img src="brain.jpg" alt="Brain" className="max-w-full h-auto max-h-[50vh] object-contain" />
            </div>
            <div className="w-full xl:w-1/2 max-w-3xl order-2 xl:order-1">
              <p className="text-gray-400 mb-4 text-sm sm:text-base lg:text-sm xl:text-xs">Click on each region to cycle through its thoughts.</p>
              {brainRegions.map((region, index) => (
                <div
                  key={region.id}
                  id={`section-${index}`}
                  className="mb-8 p-4 bg-[#2D2D44] rounded shadow cursor-pointer hover:bg-[#3A3A55] transition-colors"
                  onClick={() => handleRegionClick(index)}
                >
                  <h3 className="font-bold text-white mb-2 text-lg sm:text-xl lg:text-lg xl:text-base">
                    {region.name}
                  </h3>
                  <p className="text-gray-300 distorted-text text-sm sm:text-base lg:text-sm xl:text-xs">{region.thoughts[thoughtIndices[index]]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="py-20 px-8 unified-gradient z-10">
          <div className="max-w-4xl mx-auto flex items-center relative">
            <div className="relative w-1/2">
              <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 400 600">
                <defs>
                  <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ff0000" />
                    <stop offset="16%" stopColor="#ff7f00" />
                    <stop offset="33%" stopColor="#ffff00" />
                    <stop offset="50%" stopColor="#00ff00" />
                    <stop offset="66%" stopColor="#0000ff" />
                    <stop offset="83%" stopColor="#4b0082" />
                    <stop offset="100%" stopColor="#8f00ff" />
                  </linearGradient>
                </defs>
                <path
                  d="M20,300 L30,280 L40,320 L50,290 L60,310 L70,280 L80,300 L90,320 L100,290 L110,310 L120,280 L130,300 L140,320 L150,290 L160,310 L170,280 L180,300 L190,320 L200,290"
                  stroke="url(#rainbow)"
                  strokeWidth="10"
                  fill="none"
                />
              </svg>
              <img
                src="https://via.placeholder.com/150?text=Author"
                alt="Author"
                className="w-48 h-48 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
              />
            </div>
            <div className="w-1/2 pl-8">
              <h2 className="text-3xl font-bold text-white">About the Author</h2>
              <p className="mt-4 text-gray-300">
                I am a genius trapped in a mind that doesn't always cooperate. This blog is my outlet, my canvas, my therapy.
              </p>
            </div>
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
                    className={`w-16 h-16 hexagon ${state ? "bg-[#FF758F]" : "bg-[#7FDBFF]"}`}
                    onClick={() => toggleGridCell(i)}
                  />
                ))}
              </div>
              <p className="mt-4 text-gray-300">Grid Entropy: {gridEntropy}</p>
            </div>
            <div className="flex flex-col items-center">
              <canvas ref={starCanvasRef} width="600" height="400" className="border border-[#7FDBFF]" />
              <button
                className="mt-4 px-4 py-2 bg-[#7FDBFF] text-[#1A1A2E] rounded hover:bg-[#2ecc10]"
                onClick={() => setFractalSeed(Math.random())}
              >
                Regenerate Stars
              </button>
              <p className="mt-4 text-gray-300">Star Field Entropy: {starEntropy}</p>
            </div>
          </div>
        </section>
        <section className="py-16 px-8 unified-gradient z-10">
          <h2 className="text-3xl font-bold text-center text-white mb-8">Categories</h2>
          <div className="flex justify-center space-x-4">
            {["Technology", "Philosophy", "Art", "Science", "Random"].map((category) => (
              <button
                key={category}
                className="px-4 py-2 bg-[#7FDBFF] text-[#1A1A2E] rounded hover:bg-[#2ecc10]"
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        <footer className="py-10 unified-gradient text-white text-center z-10 flex justify-between items-center px-8">
          <p>© 2025 Overthinkers Almanac. All rights reserved.</p>
          <button
            className="px-4 py-2 bg-[#7FDBFF] text-[#1A1A2E] rounded hover:bg-[#2ecc10] disabled:bg-gray-500"
            onClick={playRandomSound}
            disabled={soundPlaying}
          >
            {soundPlaying ? "Sound..." : "Sound"}
          </button>
        </footer>
        {showPopup && (
          <div className="fixed top-4 left-4 bg-[#7FDBFF] text-[#1A1A2E] p-2 rounded shadow-lg z-50 max-w-xs text-sm">
            <p className="terminal-font">{popupText}</p>
          </div>
        )}
      </div>
    </>
  );
}