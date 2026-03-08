import React from "react";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { BackgroundProvider } from "@/components/providers/BackgroundProvider";

export default function SpectatorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SocketProvider role="spectator">
            <BackgroundProvider>
                {children}
            </BackgroundProvider>
        </SocketProvider>
    )
}