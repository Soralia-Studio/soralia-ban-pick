import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
            <h1 className="text-4xl font-bold mb-8">Soralia Ban Pick</h1>
            <div className="flex gap-4">
                <Link href="/admin" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    Admin Panel
                </Link>
                <Link href="/player" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
                    Player View
                </Link>
                <Link href="/spectator" className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
                    Spectator View
                </Link>
            </div>
        </main>
    );
}