"use client";

import { Board } from "@/components/game/Board";
import { BoardMode } from "@/lib/types";
import { useBackground } from "@/components/providers/BackgroundProvider";

export default function SpectatorPage() {
    const { backgroundList, currentBackgroundIndex } = useBackground();
    const currentBackground = backgroundList[currentBackgroundIndex];

    return (
        <main className="min-h-screen p-8">
            <video
                key={currentBackground}
                autoPlay
                muted
                loop
                className="absolute inset-0 w-full h-full object-cover -z-10"
            >
                <source src={currentBackground} type="video/mp4" />
            </video>

            <div className="absolute inset-0 bg-black/20 -z-10"></div>
            
            {/*<h1 className="text-3xl font-bold mb-8">Spectator View</h1>*/}
            <Board mode={BoardMode.Spectator} />
        </main>
    );
}