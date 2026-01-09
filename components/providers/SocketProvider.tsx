"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { GameState, GameAction, SocketEvent } from "@/lib/types";

interface SocketContextType {
    socketInstance: Socket | null;
    isConnected: boolean;
    gameState: GameState | null;
    sendAction: (action: GameAction) => void;
}

const SocketContext = createContext<SocketContextType>({
    socketInstance: null,
    isConnected: false,
    gameState: null,
    sendAction: () => {},
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [gameState, setGameState] = useState<GameState | null>(null);
    const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

    useEffect(() => {
        const socket = io();

        socket.on<SocketEvent>("connect", () => {
            setIsConnected(true);
        });

        socket.on<SocketEvent>("disconnect", () => {
            setIsConnected(false);
        });

        socket.on<SocketEvent>("game_state_update", (state: GameState) => {
            setGameState(state);
        });

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSocketInstance(socket);
        return () => {
            socket.disconnect();
        };
    }, []);

    const sendAction = (action: GameAction) => {
        socketInstance?.emit<SocketEvent>("game_action", action);
    };

    return (
        <SocketContext.Provider
            value={{
                socketInstance,
                isConnected,
                gameState,
                sendAction,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};
