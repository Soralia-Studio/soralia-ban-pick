import React from "react";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { BackgroundProvider } from "@/components/providers/BackgroundProvider";

export default function PlayerLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <BackgroundProvider>
            <SocketProvider role="player">
                {children}
            </SocketProvider>
        </BackgroundProvider>
    )
}