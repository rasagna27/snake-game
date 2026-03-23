import { useEffect, useState } from "react";

const gridSize = 20;
const initialSnake = [[10, 10]];

export default function App() {
  const [snake, setSnake] = useState(initialSnake);
  const [food, setFood] = useState([5, 5]);
  const [direction, setDirection] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("highScore")) || 0
  );

  // Keyboard control
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
    }, 150);

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
      endGame();
      return;
    }

    // Self collision
    for (let segment of newSnake) {
      if (segment[0] === head[0] && segment[1] === head[1]) {
        endGame();
        return;
      }
    }

    newSnake.unshift(head);

    // Eat food
    if (head[0] === food[0] && head[1] === food[1]) {
      setScore((s) => s + 10);

      setFood([
        Math.floor(Math.random() * gridSize),
        Math.floor(Math.random() * gridSize),
      ]);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const endGame = () => {
    setGameOver(true);

    if (score > highScore) {
      localStorage.setItem("highScore", score);
      setHighScore(score);
    }
  };

  const restart = () => {
    setSnake(initialSnake);
    setFood([5, 5]);
    setDirection("RIGHT");
    setGameOver(false);
    setScore(0);
  };

  return (
    <div
      style={{
        textAlign: "center",
        background: "radial-gradient(circle, #0f2027, #203a43, #000)",
        minHeight: "100vh",
        color: "white",
        padding: "20px",
        fontFamily: "monospace"
      }}
    >
      <h1 style={{ color: "lime", textShadow: "0 0 10px lime" }}>
        🐍 Snake Game
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "10px",
        }}
      >
        <h3>Score: {score}</h3>
        <h3>🏆 High: {highScore}</h3>
      </div>

      <button
        onClick={restart}
        style={{
          padding: "10px 20px",
          background: "lime",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold"
        }}
      >
        Restart
      </button>

      {gameOver && (
        <h2 style={{ color: "red", marginTop: "10px" }}>
          Game Over 💀
        </h2>
      )}

      {/* GAME BOARD */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 22px)`,
          justifyContent: "center",
          marginTop: "20px",
          boxShadow: "0 0 20px lime",
          padding: "5px",
          background: "#0cf063",
          borderRadius: "10px"
        }}
      >
        {[...Array(gridSize * gridSize)].map((_, i) => {
          const x = i % gridSize;
          const y = Math.floor(i / gridSize);

          const isSnake = snake.some(
            ([sx, sy]) => sx === x && sy === y
          );
          const isHead =
            snake[0][0] === x && snake[0][1] === y;

          const isFood = food[0] === x && food[1] === y;

          return (
            <div
              key={i}
              style={{
                width: "22px",
                height: "22px",
                background: isHead
                  ? "#00ffcc"
                  : isSnake
                  ? "lime"
                  : isFood
                  ? "red"
                  : "#111",
                borderRadius: isFood ? "50%" : "4px",
                boxShadow: isFood
                  ? "0 0 10px red"
                  : isSnake
                  ? "0 0 5px lime"
                  : "none",
                border: "1px solid #222"
              }}
            />
          );
        })}
      </div>
    </div>
  );
}