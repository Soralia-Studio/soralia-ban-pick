import { Board } from "@/components/game/Board";
import { BoardMode } from "@/lib/types";

export default function PlayerPage() {
    return (
        <main className="min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-8">Player View</h1>
            <Board mode={BoardMode.Player} />
        </main>
    );
}