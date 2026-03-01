import React from "react";
import { SocketProvider } from "@/components/providers/SocketProvider";

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <SocketProvider role="admin">
            {children}
        </SocketProvider>
    )
}