import { useState, useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import styles from './snake.module.scss';

const SnakeGame = memo(({ onWin }) => {
  const [cellSize, setCellSize] = useState(getCellSize());
  const [boardSize, setBoardSize] = useState(getBoardSize(cellSize));
  const [snake, setSnake] = useState([
    [0, 0],
    [cellSize, 0],
  ]);
  const [food, setFood] = useState(getRandomCoordinates(boardSize, cellSize));
  const [obstacles, setObstacles] = useState(generateObstacles(5, boardSize, cellSize));
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);

  const gameLoop = useRef(null);
  const lastFrameTime = useRef(0);

  useEffect(() => {
    const handleResize = () => {
      const newCellSize = getCellSize();
      const newBoardSize = getBoardSize(newCellSize);
      setCellSize(newCellSize);
      setBoardSize(newBoardSize);
      setFood(getRandomCoordinates(newBoardSize, newCellSize));
      setObstacles(generateObstacles(6, newBoardSize, newCellSize));
      setSnake([
        [0, 0],
        [newCellSize, 0],
      ]);
      setDirection('RIGHT');
      setGameOver(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.keyCode) {
        case 38:
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 40:
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 37:
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 39:
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [direction]);

  useEffect(() => {
    const moveSnake = (timestamp) => {
      if (!lastFrameTime.current) lastFrameTime.current = timestamp;
      const progress = timestamp - lastFrameTime.current;

      if (progress > 100) {
        let dots = [...snake];
        let head = dots[dots.length - 1];

        switch (direction) {
          case 'RIGHT':
            head = [head[0] + cellSize, head[1]];
            break;
          case 'LEFT':
            head = [head[0] - cellSize, head[1]];
            break;
          case 'DOWN':
            head = [head[0], head[1] + cellSize];
            break;
          case 'UP':
            head = [head[0], head[1] - cellSize];
            break;
          default:
            break;
        }

        dots.push(head);
        dots.shift();
        setSnake(dots);

        if (checkCollision(head, boardSize, obstacles)) {
          gameOverHandler();
        }

        if (checkIfEat(head, food)) {
          setFood(getRandomCoordinates(boardSize, cellSize));
          setObstacles(generateObstacles(Math.ceil(snake.length / 0.5), boardSize, cellSize));
          enlargeSnake(dots);
        }

        lastFrameTime.current = timestamp;
      }

      if (!gameOver) {
        gameLoop.current = requestAnimationFrame(moveSnake);
      }
    };

    if (!gameOver) {
      gameLoop.current = requestAnimationFrame(moveSnake);
      return () => cancelAnimationFrame(gameLoop.current);
    }
  }, [snake, direction, gameOver, cellSize, boardSize, food, obstacles]);

  const checkCollision = (head, boardSize, obstacles) => {
    for (let i = 0; i < snake.length - 1; i++) {
      if (head[0] === snake[i][0] && head[1] === snake[i][1]) {
        return true;
      }
    }

    if (head[0] >= boardSize || head[0] < 0 || head[1] >= boardSize || head[1] < 0) {
      return true;
    }

    for (let i = 0; i < obstacles.length; i++) {
      if (head[0] === obstacles[i][0] && head[1] === obstacles[i][1]) {
        return true;
      }
    }

    return false;
  };

  const checkIfEat = (head, food) => {
    if (head[0] === food[0] && head[1] === food[1]) {
      return true;
    }
    return false;
  };

  const enlargeSnake = (dots) => {
    let newSnake = [...dots];
    newSnake.unshift([]);
    setSnake(newSnake);
  };

  const gameOverHandler = () => {
    onWin(snake.length - 2)
    setGameOver(true);
  };

  const restartGame = () => {
    setSnake([
      [0, 0],
      [cellSize, 0],
    ]);
    setFood(getRandomCoordinates(boardSize, cellSize));
    setObstacles(generateObstacles(5, boardSize, cellSize));
    setDirection('RIGHT');
    setGameOver(false);
  };

  return (
    <div className={styles.gameContainer}>
      <p>Score: {snake.length - 2}</p>
      <div
        className={styles.gameBoard}
        style={{ width: boardSize, height: boardSize }}
      >
        {snake.map((dot, i) => (
          <div
            className={styles.snakeDot}
            key={i}
            style={{ left: `${dot[0]}px`, top: `${dot[1]}px`, width: cellSize, height: cellSize }}
          />
        ))}
        <div
          className={styles.foodDot}
          style={{ left: `${food[0]}px`, top: `${food[1]}px`, width: cellSize, height: cellSize }}
        />
        {obstacles.map((obstacle, i) => (
          <div
            className={styles.obstacleDot}
            key={i}
            style={{ left: `${obstacle[0]}px`, top: `${obstacle[1]}px`, width: cellSize, height: cellSize }}
          />
        ))}
      </div>
      {gameOver && <h2 className={styles.gameOver}>Game Over!</h2>}
      <button onClick={restartGame}>
        {gameOver ? 'Restart Game' : 'Start Game'}
      </button>
    </div>
  );
})

SnakeGame.propTypes = {
  onWin: PropTypes.func
};
SnakeGame.displayName = 'SnakeGame';

const getCellSize = () => {
  const width = window.innerWidth;
  if (width < 500) {
    return Math.floor(width / 16);
  } else {
    return 16;
  }
};

const getBoardSize = (cellSize) => {
  const width = window.innerWidth;
  if (width < 500) {
    return Math.floor(width / cellSize) * cellSize;
  } else {
    return 400;
  }
};

const getRandomCoordinates = (boardSize, cellSize) => {
  let min = 1;
  let maxX = (boardSize / cellSize) - 1;
  let maxY = (boardSize / cellSize) - 1;
  let x = Math.floor(Math.random() * (maxX - min + 1) + min) * cellSize;
  let y = Math.floor(Math.random() * (maxY - min + 1) + min) * cellSize;
  return [x, y];
};

const generateObstacles = (numObstacles, boardSize, cellSize) => {
  let obstacles = [];
  for (let i = 0; i < numObstacles; i++) {
    obstacles.push(getRandomCoordinates(boardSize, cellSize));
  }
  return obstacles;
};

export default SnakeGame;
