"use client";

import { Board } from "@/components/game/Board";
import { useSocket } from "@/components/providers/SocketProvider";
import { BoardMode, ActionType, PhaseOrder, PresetType, RevealPermission } from "@/lib/types";

export default function AdminPage() {
    const { sendAction, gameState } = useSocket();

    return (
        <main className="min-h-screen p-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Controller</h1>
                <div className="flex gap-2">
                    <select
                        value={gameState?.revealPermission}
                        onChange={(e) => {
                            sendAction({
                                type: ActionType.SET_REVEAL_PERMISSION,
                                payload: {
                                    permission: Number(e.target.value),
                                },
                            });
                        }}
                        className="px-4 py-2 bg-gray-700 text-white rounded"
                    >
                        <option value={RevealPermission.Admin}>Admin Reveal</option>
                        <option value={RevealPermission.Player}>Player Reveal</option>
                    </select>
                    <select
                        value={gameState?.preset || "random"}
                        onChange={(e) =>
                            sendAction({
                                type: ActionType.SET_PRESET,
                                payload: {
                                    preset: e.target.value as PresetType,
                                },
                            })
                        }
                        className="px-4 py-2 bg-gray-700 text-white rounded"
                        disabled={gameState?.phase !== PhaseOrder.Waiting}
                    >
                        <option value="random">Random Pool</option>
                        <option value="tests">Test Pool</option>
                        <option value="top_16">Top 16</option>
                        <option value="top_8">Top 8</option>
                        <option value="quarter_finals">Quarter Finals</option>
                        <option value="semi_finals">Semi Finals</option>
                        <option value="finals">Finals</option>
                    </select>
                    <button
                        onClick={() => {
                                if(gameState?.phase === PhaseOrder.Revealing) {
                                    // Reveal all songs if currently in revealing phase
                                    for(const song of gameState.songs) {
                                        if(!gameState.revealedSongs.includes(song.songId)) {
                                            sendAction({ type: ActionType.REVEAL_SONG, payload: { songId: song.songId } });
                                        }
                                    }

                                    return;
                                }
                                sendAction({ type: ActionType.START_GAME })
                            }
                        }
                        className="px-4 py-2 bg-green-600 text-white rounded"
                        disabled={gameState?.phase !== PhaseOrder.Waiting && gameState?.phase !== PhaseOrder.Revealing}
                    >
                        {(() => {
                            switch(gameState?.phase) {
                                case PhaseOrder.Waiting:
                                    return "Start Game";
                                default:
                                    return "Start Revealing";
                            }
                        })()}
                    </button>
                    {gameState?.phase === PhaseOrder.RPS && (
                        <>
                            <button
                                onClick={() =>
                                    sendAction({
                                        type: ActionType.SET_RPS_WINNER,
                                        payload: { winner: "player1" },
                                    })
                                }
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                            >
                                Player 1 Won RPS
                            </button>
                            <button
                                onClick={() =>
                                    sendAction({
                                        type: ActionType.SET_RPS_WINNER,
                                        payload: { winner: "player2" },
                                    })
                                }
                                className="px-4 py-2 bg-purple-600 text-white rounded"
                            >
                                Player 2 Won RPS
                            </button>
                        </>
                    )}
                    <button
                        onClick={() => sendAction({ type: ActionType.RESET })}
                        className="px-4 py-2 bg-red-600 text-white rounded"
                    >
                        Reset
                    </button>
                </div>
            </div>
            {gameState && (
                <div className="mb-4 p-4 bg-gray-800 rounded">
                    <p className="text-white">
                        Phase:{" "}
                        <span className="font-bold">{gameState.phase}</span>
                    </p>
                    <p className="text-white">
                        Preset:{" "}
                        <span className="font-bold">{gameState.preset}</span>
                    </p>
                    {gameState.rpsWinner && (
                        <p className="text-white">
                            RPS Winner:{" "}
                            <span className="font-bold">
                                {gameState.rpsWinner}
                            </span>
                        </p>
                    )}
                    {gameState.protectedSong && (
                        <p className="text-white">
                            Protected by:{" "}
                            <span className="font-bold">
                                {gameState.protectedBy}
                            </span>
                        </p>
                    )}
                </div>
            )}
            <Board mode={BoardMode.Admin} />
        </main>
    );
}