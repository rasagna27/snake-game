import { useEffect, useState } from "react";

const gridSize = 20;
const initialSnake = [[10, 10]];

const eatSound = new Audio("https://www.soundjay.com/buttons/sounds/button-4.mp3");
const gameOverSound = new Audio("https://www.soundjay.com/buttons/sounds/button-10.mp3");

export default function App() {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(200);

  // Prevent reverse movement
  const changeDirection = (newDir) => {
    if (
      (direction === "UP" && newDir === "DOWN") ||
      (direction === "DOWN" && newDir === "UP") ||
      (direction === "LEFT" && newDir === "RIGHT") ||
      (direction === "RIGHT" && newDir === "LEFT")
    ) return;

    setDirection(newDir);
  };

  // Keyboard control
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp") changeDirection("UP");
      if (e.key === "ArrowDown") changeDirection("DOWN");
      if (e.key === "ArrowLeft") changeDirection("LEFT");
      if (e.key === "ArrowRight") changeDirection("RIGHT");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [direction]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      moveSnake();
    }, speed);

    return () => clearInterval(interval);
  });

  const moveSnake = () => {
    let newSnake = [...snake];
    let head = [...newSnake[0]];

    if (direction === "UP") head[1] -= 1;
    if (direction === "DOWN") head[1] += 1;
    if (direction === "LEFT") head[0] -= 1;
    if (direction === "RIGHT") head[0] += 1;

    // Wall collision
    if (
      head[0] < 0 ||
      head[0] >= gridSize ||
      head[1] < 0 ||
      head[1] >= gridSize
    ) {
      gameOverSound.play();
      setGameOver(true);
      return;
    }

    // Self collision
    for (let segment of newSnake) {
      if (segment[0] === head[0] && segment[1] === head[1]) {
        gameOverSound.play();
        setGameOver(true);
        return;
      }
    }

    newSnake.unshift(head);

    // Eat food
    if (head[0] === food[0] && head[1] === food[1]) {
      eatSound.play();
      setScore((s) => s + 10);
      setSpeed((prev) => Math.max(prev - 5, 80)); // speed up

      setFood([
        Math.floor(Math.random() * gridSize),
        Math.floor(Math.random() * gridSize),
      ]);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const restart = () => {
    setSnake(initialSnake);
    setFood([5, 5]);
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
    setSpeed(200);
  };

  return (
    <div
      style={{
        textAlign: "center",
        background: "black",
        color: "lime",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "monospace"
      }}
    >
      <h1>🐍 Snake Game</h1>
      <h2>Score: {score}</h2>

      <button
        onClick={restart}
        style={{
          padding: "10px",
          background: "lime",
          border: "none",
          cursor: "pointer"
        }}
      >
        Restart
      </button>

      {gameOver && <h2 style={{ color: "red" }}>Game Over 💀</h2>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 20px)`,
          justifyContent: "center",
          marginTop: "20px",
          boxShadow: "0 0 20px lime"
        }}
      >
        {[...Array(gridSize * gridSize)].map((_, i) => {
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);

          const isSnake = snake.some(
            ([sx, sy]) => sx === x && sy === y
          );
          const isFood = food[0] === x && food[1] === y;

          return (
            <div
              key={i}
              style={{
                width: "20px",
                height: "20px",
                background: isSnake
                  ? "lime"
                  : isFood
                  ? "red"
                  : "black",
                border: "1px solid #222"
              }}
            />
          );
        })}
      </div>
    </div>
  );
}