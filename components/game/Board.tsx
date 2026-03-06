"use client";

import React, { useEffect } from "react";
import { useSocket } from "../providers/SocketProvider";
import { SongCard } from "./SongCard";
import { BoardMode, ActionType, PhaseOrder  } from "@/lib/types";

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
    <div className="p-3">
      <h2 className="text-lg font-bold mb-2">
        Phase: {gameState.phase}
        {gameState.phase === PhaseOrder.Protecting && gameState.rpsWinner && (
          <span className="ml-2 text-sm text-blue-400">
            ({gameState.rpsWinner} selecting protected song)
          </span>
        )}
      </h2>

      <div className="grid grid-cols-4 gap-2 max-w-4xl mx-auto">
        {gameState.songs.map((song) => {
          let isBanned = false;
          let isPicked = false;
          const isProtected = gameState.protectedSong === song.songId;

          if(mode === BoardMode.Spectator) {
            // Spectators only see banned/picked/protected status after a phase is finished
            if(gameState.phase > PhaseOrder.Banning) {
              isBanned = gameState.bannedSongs.includes(song.songId);
            }
            if(gameState.phase > PhaseOrder.Picking) {
              isPicked = gameState.pickedSongs.includes(song.songId);
            }
          } else {
            // Admins and Players see real-time status
            isBanned = gameState.bannedSongs.includes(song.songId);
            isPicked = gameState.pickedSongs.includes(song.songId);
          }

          let isRevealed = false;

          if (mode === BoardMode.Admin) {

            switch (gameState.phase) {

              case PhaseOrder.Waiting:
                isRevealed = true;
                break;

              case PhaseOrder.RPS:
              case PhaseOrder.Protecting:
                isRevealed = false;
                break;

              case PhaseOrder.Revealing:
                isRevealed =
                  gameState.revealedSongs?.includes(song.songId) ?? false;
                break;
              default:
                isRevealed = true;
            }

          } else {

            switch (gameState.phase) {

              case PhaseOrder.Revealing:
                isRevealed =
                  gameState.revealedSongs?.includes(song.songId) ?? false;
                break;
              case PhaseOrder.Banning:
              case PhaseOrder.Picking:
              case PhaseOrder.Finished:
                isRevealed = true;
                break;

              default:
                isRevealed = false;
            }
          }

          if(isProtected && gameState.phase != PhaseOrder.Finished) {
            isRevealed = false;
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