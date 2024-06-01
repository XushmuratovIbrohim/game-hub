/* eslint-disable */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSwipeable } from 'react-swipeable';
import styles from './snake.module.scss';

const SnakeGame = ({ onWin }) => {
  const [cellSize, setCellSize] = useState(20);
  const [boardSize, setBoardSize] = useState(320);
  const [snake, setSnake] = useState([
    [0, 0],
    [20, 0],
  ]);
  const [food, setFood] = useState(getRandomCoordinates(320, 20));
  const [obstacles, setObstacles] = useState(generateObstacles(5, 320, 20));
  const [direction, setDirection] = useState('RIGHT');
  const [gameOver, setGameOver] = useState(false);

  const gameLoop = useRef(null);
  const lastFrameTime = useRef(0);

  const handleResize = useCallback(() => {
    const newBoardSize = getAdaptiveBoardSize();
    const newCellSize = getCellSize(newBoardSize);
    setCellSize(newCellSize);
    setBoardSize(newBoardSize);
    setFood(getRandomCoordinates(newBoardSize, newCellSize));
    setObstacles(generateObstacles(5, newBoardSize, newCellSize));
    setSnake([
      [0, 0],
      [newCellSize, 0],
    ]);
    setDirection('RIGHT');
    setGameOver(false);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial setup
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  const handleKeyDown = useCallback((e) => {
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
  }, [direction]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const moveSnake = useCallback((timestamp) => {
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
  }, [snake, direction, gameOver, cellSize, boardSize, food, obstacles]);

  useEffect(() => {
    if (!gameOver) {
      gameLoop.current = requestAnimationFrame(moveSnake);
      return () => cancelAnimationFrame(gameLoop.current);
    }
  }, [moveSnake, gameOver]);

  const checkCollision = useCallback((head, boardSize, obstacles) => {
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
  }, [snake]);

  const checkIfEat = useCallback((head, food) => {
    if (head[0] === food[0] && head[1] === food[1]) {
      return true;
    }
    return false;
  }, []);

  const enlargeSnake = useCallback((dots) => {
    let newSnake = [...dots];
    newSnake.unshift([]);
    setSnake(newSnake);
  }, []);

  const gameOverHandler = useCallback(() => {
    onWin(snake.length - 2)
    setGameOver(true);
  }, []);

  const restartGame = useCallback(() => {
    setSnake([
      [0, 0],
      [cellSize, 0],
    ]);
    setFood(getRandomCoordinates(boardSize, cellSize));
    setObstacles(generateObstacles(5, boardSize, cellSize));
    setDirection('RIGHT');
    setGameOver(false);
  }, [cellSize, boardSize]);

  const memoizedSnake = useMemo(() => snake.map((dot, i) => (
    <SnakeDot key={i} dot={dot} cellSize={cellSize} />
  )), [snake, cellSize]);

  const memoizedObstacles = useMemo(() => obstacles.map((obstacle, i) => (
    <ObstacleDot key={i} obstacle={obstacle} cellSize={cellSize} />
  )), [obstacles, cellSize]);

  const swipeHandlers = useSwipeable({
    onSwipedUp: () => { if (direction !== 'DOWN') setDirection('UP'); },
    onSwipedDown: () => { if (direction !== 'UP') setDirection('DOWN'); },
    onSwipedLeft: () => { if (direction !== 'RIGHT') setDirection('LEFT'); },
    onSwipedRight: () => { if (direction !== 'LEFT') setDirection('RIGHT'); },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className={styles.gameContainer}>
      <h1>score: {snake.length - 2}</h1>
      <div
        {...swipeHandlers}
        className={styles.gameBoard}
        style={{ width: boardSize, height: boardSize }}
      >
        {memoizedSnake}
        <FoodDot food={food} cellSize={cellSize} />
        {memoizedObstacles}
      </div>
      {gameOver && <h2 className={styles.gameOver}>Game Over!</h2>}
      <button onClick={restartGame}>
        {gameOver ? 'Restart Game' : 'Start Game'}
      </button>
    </div>
  );
};

const SnakeDot = React.memo(({ dot, cellSize }) => {
  return (
    <div
      className={styles.snakeDot}
      style={{ left: `${dot[0]}px`, top: `${dot[1]}px`, width: cellSize, height: cellSize }}
    />
  );
});

SnakeDot.displayName = 'SnakeDot';

const FoodDot = React.memo(({ food, cellSize }) => {
  return (
    <div
      className={styles.foodDot}
      style={{ left: `${food[0]}px`, top: `${food[1]}px`, width: cellSize, height: cellSize }}
    />
  );
});

FoodDot.displayName = 'FoodDot';

const ObstacleDot = React.memo(({ obstacle, cellSize }) => {
  return (
    <div
      className={styles.obstacleDot}
      style={{ left: `${obstacle[0]}px`, top: `${obstacle[1]}px`, width: cellSize, height: cellSize }}
    />
  );
});

ObstacleDot.displayName = 'ObstacleDot';

const getCellSize = (boardSize) => {
  return Math.floor(boardSize / 20); // Adjust cell size based on board size
};

const getAdaptiveBoardSize = () => {
  const width = window.innerWidth;
  return Math.max(320, Math.min(500, width * 0.8)); // Board size between 320px and 500px
};

const getRandomCoordinates = (boardSize, cellSize) => {
  const x = Math.floor((Math.random() * boardSize) / cellSize) * cellSize;
  const y = Math.floor((Math.random() * boardSize) / cellSize) * cellSize;
  return [x, y];
};

const generateObstacles = (count, boardSize, cellSize) => {
  const obstacles = [];
  for (let i = 0; i < count; i++) {
    obstacles.push(getRandomCoordinates(boardSize, cellSize));
  }
  return obstacles;
};

export default SnakeGame;
