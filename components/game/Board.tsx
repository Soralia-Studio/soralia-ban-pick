"use client";

import React from "react";
import { useSocket } from "../providers/SocketProvider";
import { SongCard } from "./SongCard";
import { BoardMode, ActionType, PhaseOrder } from "@/lib/types";

export const Board = ({ mode = BoardMode.Spectator }: { mode?: BoardMode }) => {
  const { gameState, sendAction } = useSocket();

  if (!gameState) return <div>Loading game state...</div>;

  const handleSongClick = (songId: string) => {
    if (mode === BoardMode.Admin || mode === BoardMode.Player) {
      if (
        gameState.phase === PhaseOrder.Waiting ||
        gameState.phase === PhaseOrder.Finished ||
        gameState.phase === PhaseOrder.RPS
      )
        return;

      let actionType: ActionType;
      if (gameState.phase === PhaseOrder.Revealing) {
        actionType = ActionType.REVEAL_SONG;
      } else if (gameState.phase === PhaseOrder.Protecting) {
        actionType = ActionType.PROTECT_SONG;
      } else if (gameState.phase === PhaseOrder.Banning) {
        actionType = ActionType.BAN_SONG;
      } else {
        actionType = ActionType.PICK_SONG;
      }

      sendAction({ type: actionType, payload: { songId } });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Phase: {gameState.phase}
        {gameState.phase === PhaseOrder.Protecting && gameState.rpsWinner && (
          <span className="ml-4 text-lg text-blue-400">
            ({gameState.rpsWinner} selecting protected song)
          </span>
        )}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {gameState.songs.map((song) => {
          const isBanned = gameState.bannedSongs.includes(song.songId);
          const isPicked = gameState.pickedSongs.includes(song.songId);
          const isProtected = gameState.protectedSong === song.songId;

          let isRevealed = true;
          if (mode === BoardMode.Admin) {
            if (gameState.phase === PhaseOrder.Revealing) {
              isRevealed =
                gameState.revealedSongs?.includes(song.songId) ?? false;
            } else {
              isRevealed = true;
            }
          } else {
            if (gameState.phase < PhaseOrder.Revealing) {
              isRevealed = false;
            } else if (gameState.phase === PhaseOrder.Revealing) {
              isRevealed =
                gameState.revealedSongs?.includes(song.songId) ?? false;
            } else {
              isRevealed = true;
            }
          }

          const protectedBy = isProtected ? gameState.protectedBy : null;

          return (
            <SongCard
              key={song.songId}
              song={song}
              isBanned={isBanned}
              isPicked={isPicked}
              isProtected={isProtected}
              isRevealed={isRevealed}
              protectedBy={protectedBy}
              onClick={() =>
                !isBanned &&
                !isPicked &&
                !isProtected &&
                handleSongClick(song.songId)
              }
            />
          );
        })}
      </div>
    </div>
  );
};
