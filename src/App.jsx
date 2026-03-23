import { useEffect, useState } from "react";

const gridSize = 20;
const initialSnake = [[10, 10]];

export default function App() {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowUp") setDirection("UP");
      if (e.key === "ArrowDown") setDirection("DOWN");
      if (e.key === "ArrowLeft") setDirection("LEFT");
      if (e.key === "ArrowRight") setDirection("RIGHT");
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(() => {
      moveSnake();
    }, 200);

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
      setGameOver(true);
      return;
    }

    // Self collision
    for (let segment of newSnake) {
      if (segment[0] === head[0] && segment[1] === head[1]) {
        setGameOver(true);
        return;
      }
    }

    newSnake.unshift(head);

    // Eat food
    if (head[0] === food[0] && head[1] === food[1]) {
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
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Snake Game 🐍</h1>
      <button onClick={restart}>Restart</button>

      {gameOver && <h2>Game Over 💀</h2>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 20px)`,
          justifyContent: "center",
          marginTop: "20px",
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
                border: "1px solid #ddd",
                background: isSnake
                  ? "green"
                  : isFood
                  ? "red"
                  : "white",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}