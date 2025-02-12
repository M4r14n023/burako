import React, { useState, useEffect } from 'react';
import { GameType } from '../types/game';
import { Trophy, Plus, AlertCircle } from 'lucide-react';
import ScoreModal from './ScoreModal';

type GameBoardProps = {
  game: GameType;
  onUpdateGame: (game: GameType) => void;
};

export default function GameBoard({ game, onUpdateGame }: GameBoardProps) {
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [showDistributionAlert, setShowDistributionAlert] = useState(true);

  const getWinningScore = () => game.mode === 'individual' ? 3000 : 6000;

  const calculateDistribution = () => {
    const totalTiles = 106;
    
    if (game.mode === 'individual') {
      const playerCount = game.players.length;
      
      // Distribución para modo individual
      let tableTilesPerPlayer: number;
      let deadTilesPerPlayer: number;
      let remainingTiles: number;
      
      switch(playerCount) {
        case 2:
          // 12 fichas para tablero y 11 para muerto por jugador = 46 fichas
          tableTilesPerPlayer = 12;
          deadTilesPerPlayer = 11;
          remainingTiles = 60; // 6 pilas de 10
          break;
        case 3:
          // 11 fichas para tablero y 11 para muerto por jugador = 44 fichas
          tableTilesPerPlayer = 11;
          deadTilesPerPlayer = 11;
          remainingTiles = 40; // 4 pilas de 10
          break;
        case 4:
          // 7 fichas para tablero y 7 para muerto por jugador = 56 fichas
          tableTilesPerPlayer = 7;
          deadTilesPerPlayer = 7;
          remainingTiles = 50; // 5 pilas de 10
          break;
        default:
          throw new Error('Número de jugadores no válido');
      }

      const usedTiles = (tableTilesPerPlayer + deadTilesPerPlayer) * playerCount;
      const stackCount = remainingTiles / 10;

      return {
        mode: 'individual',
        playerCount,
        tableTilesPerPlayer,
        deadTilesPerPlayer,
        remainingTiles,
        stackCount,
        totalDistributed: usedTiles
      };
    } else {
      // Modo equipos (siempre 2 equipos)
      const teamsCount = 2;
      const playersPerTeam = game.teams[0].players.length;
      const totalPlayers = playersPerTeam * teamsCount;
      
      // Distribución para modo equipos
      let tableTilesPerPlayer: number;
      let deadTilesPerTeam: number;
      let remainingTiles: number;
      
      switch(playersPerTeam) {
        case 2:
          // 10 fichas por jugador para tablero = 40 fichas
          // 8 fichas por equipo para muerto = 16 fichas
          tableTilesPerPlayer = 10;
          deadTilesPerTeam = 8;
          remainingTiles = 50; // 5 pilas de 10
          break;
        case 3:
          // 7 fichas por jugador para tablero = 42 fichas
          // 7 fichas por equipo para muerto = 14 fichas
          tableTilesPerPlayer = 7;
          deadTilesPerTeam = 7;
          remainingTiles = 50; // 5 pilas de 10
          break;
        default:
          throw new Error('Número de jugadores por equipo no válido');
      }

      const totalTableTiles = tableTilesPerPlayer * totalPlayers;
      const totalDeadTiles = deadTilesPerTeam * teamsCount;
      const usedTiles = totalTableTiles + totalDeadTiles;
      const stackCount = remainingTiles / 10;

      return {
        mode: 'team',
        teamsCount,
        playersPerTeam,
        tableTilesPerPlayer,
        deadTilesPerTeam,
        remainingTiles,
        stackCount,
        totalDistributed: usedTiles
      };
    }
  };

  const handleScoreSubmit = (scores: Record<string, any>) => {
    const updatedGame = { ...game };
    const winningScore = getWinningScore();

    if (game.mode === 'individual') {
      updatedGame.players = game.players.map(player => {
        if (scores[player.name]) {
          const newScore = player.score + scores[player.name].total;
          return {
            ...player,
            score: newScore,
            scoreHistory: [...player.scoreHistory, scores[player.name]],
            winner: newScore >= winningScore
          };
        }
        return player;
      });

      const winner = updatedGame.players.find(p => p.score >= winningScore);
      if (winner) {
        updatedGame.winner = winner.name;
      }
    } else {
      updatedGame.teams = game.teams.map(team => {
        if (scores[team.name]) {
          const newScore = team.score + scores[team.name].total;
          return {
            ...team,
            score: newScore,
            scoreHistory: [...team.scoreHistory, scores[team.name]],
            winner: newScore >= winningScore
          };
        }
        return team;
      });

      const winner = updatedGame.teams.find(t => t.score >= winningScore);
      if (winner) {
        updatedGame.winner = winner.name;
      }
    }

    updatedGame.currentRound += 1;
    onUpdateGame(updatedGame);
    setShowScoreModal(false);
  };

  const renderScore = (name: string, score: number, history: any[]) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
        <div className="text-2xl font-bold text-blue-600">{score} pts</div>
      </div>
      {history.map((round, index) => (
        <div key={`${name}-round-${index}`} className="text-sm text-gray-600 mt-2">
          <div className="grid grid-cols-2 gap-2">
            <div>Puntos de cierre: {round.closingPoints}</div>
            <div>Puntos de Muerto: {round.deadPoints}</div>
            <div>Puntos de 3 al 7: {round.points3to7}</div>
            <div>Puntos de 8 al 13: {round.points8to13}</div>
            <div>Puntos de 1: {round.points1}</div>
            <div>Puntos de 2: {round.points2}</div>
            <div>Puntos de Comodín: {round.jokerPoints}</div>
            <div>Puntos Restados: {round.subtractedPoints}</div>
            <div className="col-span-2 font-semibold">
              Total de la ronda: {round.total}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const distribution = calculateDistribution();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-6">
      <div className="max-w-4xl mx-auto">
        {showDistributionAlert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-8 h-8 text-blue-500" />
                <h2 className="text-2xl font-bold">Distribución de Fichas</h2>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <p className="font-medium">Total de fichas: 106</p>
                
                {distribution.mode === 'individual' ? (
                  <>
                    <div className="space-y-2">
                      <p>Jugadores: {distribution.playerCount}</p>
                      <p>Para cada jugador:</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>{distribution.tableTilesPerPlayer} fichas para el tablero</li>
                        <li>{distribution.deadTilesPerPlayer} fichas para el "muerto"</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <p>Equipos: {distribution.teamsCount}</p>
                      <p>Jugadores por equipo: {distribution.playersPerTeam}</p>
                      <p>Para cada jugador:</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>{distribution.tableTilesPerPlayer} fichas para el tablero</li>
                      </ul>
                      <p>Para cada equipo:</p>
                      <ul className="list-disc list-inside pl-4 space-y-1">
                        <li>{distribution.deadTilesPerTeam} fichas para el "muerto"</li>
                      </ul>
                    </div>
                  </>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="font-medium">Fichas en la mesa:</p>
                  <p>{distribution.stackCount} pilas de 10 fichas ({distribution.remainingTiles} fichas)</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Total distribuido: {distribution.totalDistributed + distribution.remainingTiles} fichas
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDistributionAlert(false)}
                className="mt-6 w-full bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-white">
            Ronda {game.currentRound}
          </h2>
          <button
            onClick={() => setShowScoreModal(true)}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Cierre de Juego
          </button>
        </div>

        <div className="space-y-6">
          {game.mode === 'individual' ? (
            game.players.map((player) => (
              <div key={player.name}>
                {renderScore(player.name, player.score, player.scoreHistory)}
              </div>
            ))
          ) : (
            game.teams.map((team) => (
              <div key={team.name}>
                {renderScore(team.name, team.score, team.scoreHistory)}
              </div>
            ))
          )}
        </div>

        {showScoreModal && (
          <ScoreModal
            game={game}
            onClose={() => setShowScoreModal(false)}
            onScoreSubmit={handleScoreSubmit}
          />
        )}

        {game.winner && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-xl p-8 text-center max-w-md mx-auto">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">¡Felicitaciones!</h2>
              <p className="text-lg text-gray-700">
                {game.winner} ha ganado la partida
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nueva Partida
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}