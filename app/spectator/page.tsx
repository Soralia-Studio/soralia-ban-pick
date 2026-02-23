import { Board } from "@/components/game/Board";
import { BoardMode } from "@/lib/types";

export default function SpectatorPage() {
    return (
        <main className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-8">Spectator View</h1>
            <Board mode={BoardMode.Spectator} />
        </main>
    );
}