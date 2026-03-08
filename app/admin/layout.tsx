import React from "react";
import { SocketProvider } from "@/components/providers/SocketProvider";
import { BackgroundProvider } from "@/components/providers/BackgroundProvider";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SocketProvider role="admin">
            <BackgroundProvider>
                {children}
            </BackgroundProvider>
        </SocketProvider>
    )
}