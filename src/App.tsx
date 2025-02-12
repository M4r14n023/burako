import React, { useState } from 'react';
import { GameType } from './types/game';
import GameSetup from './components/GameSetup';
import GameBoard from './components/GameBoard';

function App() {
  const [game, setGame] = useState<GameType>({
    mode: null,
    players: [],
    teams: [],
    currentRound: 0,
    gameStarted: false,
    winner: null
  });

  const handleStartGame = (gameConfig: Partial<GameType>) => {
    setGame(prev => ({ ...prev, ...gameConfig }));
  };

  const handleUpdateGame = (updatedGame: GameType) => {
    setGame(updatedGame);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!game.gameStarted ? (
        <GameSetup onStartGame={handleStartGame} />
      ) : (
        <GameBoard game={game} onUpdateGame={handleUpdateGame} />
      )}
    </div>
  );
}

export default App;