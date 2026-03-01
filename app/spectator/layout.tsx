import React from "react";
import { SocketProvider } from "@/components/providers/SocketProvider";

export default function SpectatorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SocketProvider role="spectator">
            {children}
        </SocketProvider>
    )
}