"use client";

import { Card } from "../ui/Card";
import { Song, PlayerSide } from "@/lib/types";
import Image from "next/image";

interface SongCardProps {
    song: Song;
    isBanned: boolean;
    isPicked: boolean;
    isProtected: boolean;
    isRevealed: boolean;
    protectedBy: PlayerSide;
    onClick: () => void;
}

export const SongCard = ({
    song,
    isBanned,
    isPicked,
    isProtected,
    isRevealed,
    protectedBy,
    onClick,
}: SongCardProps) => {
    let statusClass = "";
    if (isBanned) statusClass = "opacity-50 grayscale";
    if (isPicked) statusClass = "border-4 border-green-500";
    if (isProtected)
        statusClass =
            "border-4 border-yellow-500 shadow-lg shadow-yellow-500/50";

    // use master sheet for debugging
    const sheet =
        song.sheets.find((s) => s.difficulty === "master") || song.sheets[0];
    const difficultyLabel = sheet ? sheet.difficulty.toUpperCase() : "MASTER";

    return (
        <Card
            className={`relative p-1.5 bg-[#C8CDE2] rounded-lg border-2 border-[#0F3674] ${statusClass} transition-all duration-500`}
            onClick={onClick}
        >
            {/* Hidden State Overlay */}
            {!isRevealed && (
                <div className="absolute inset-0 z-30 bg-[#0F3674] rounded-lg flex items-center justify-center cursor-pointer hover:bg-[#1a4b96] transition-colors">
                    <div className="text-white text-4xl font-bold opacity-20">
                        ?
                    </div>
                </div>
            )}

            {/* image */}
            <div className="relative w-full aspect-square mb-1 rounded-sm overflow-hidden border border-[#0F3674] bg-white">
                <Image
                    src={`https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover/${song.imageName}`}
                    alt={song.title}
                    className="object-cover w-full h-full"
                    width={140}
                    height={140}
                />
            </div>

            {/* diff */}
            <div className="text-center -mt-0.5 mb-0.5 relative z-10">
                <span className="text-base font-black text-white tracking-wide uppercase text-shadow-[1px_1px_0_#0F3674]">
                    {difficultyLabel}
                </span>
            </div>

            {/* title */}
            <div className="bg-[#0F3674] text-white text-center py-1 px-1 font-bold truncate rounded-sm text-xs">
                {song.title}
            </div>

            {/* status */}
            {isProtected && (
                <div className="absolute top-2 right-2 z-20">
                    <div className="bg-yellow-500 rounded-full p-2 shadow-lg">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-white"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                    {protectedBy && (
                        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {protectedBy}
                        </div>
                    )}
                </div>
            )}
            {isBanned && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl z-20">
                    <span className="text-red-500 font-black text-4xl border-4 border-red-500 px-4 py-2 rounded-lg bg-white/10">
                        BANNED
                    </span>
                </div>
            )}
            {isPicked && (
                <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center rounded-xl z-20">
                    <span className="text-white font-black text-4xl drop-shadow-lg">
                        PICKED
                    </span>
                </div>
            )}
        </Card>
    );
};