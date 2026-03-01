import React from "react";
import { SocketProvider } from "@/components/providers/SocketProvider";

export default function PlayerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SocketProvider role="player">
            {children}
        </SocketProvider>
    )
}