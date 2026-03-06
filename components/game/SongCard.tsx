"use client";

import { Card } from "../ui/Card";
import { Song, PlayerSide } from "@/lib/types";
import Image from "next/image";
import { useBackground } from "../providers/BackgroundProvider";

interface SongCardProps {
    song: Song;
    isBanned: boolean;
    isPicked: boolean;
    isProtected: boolean;
    isRevealed: boolean;
    protectedBy: PlayerSide;
    onClick: () => void;
}

const getFrameImage = (diff: string, type: string) => {
    const isDx = type.toUpperCase() === 'DX';
    const typeStr = isDx ? 'dx' : 'std';
    const diffLower = diff.toLowerCase();
    
    let diffName = 'master'; 
    
    if (diffLower.includes('remaster')) {
        diffName = 'remas'; 
    } else if (diffLower.includes('master')) {
        diffName = 'master';
    } else if (diffLower.includes('expert')) {
        diffName = 'expert';
    }
    return `/assets/frame/${diffName}-${typeStr}.png`;
};

const FRAME_JACKET_WINDOW_STYLE = {
    left: "7.67%",
    top: "5.5%",
    width: "85%",
    height: "63%",
} as const;

const FRAME_DIFFICULTY_STYLE = {
    left: "8%",
    top: "74%",
    width: "84%",
} as const;

const FRAME_TITLE_STYLE = {
    left: "6%",
    bottom: "3.6%",
    width: "88%",
} as const;

export const SongCard = ({
    song,
    isBanned,
    isPicked,
    isProtected,
    isRevealed,
    protectedBy,
    onClick,
}: SongCardProps) => {
    const { hiddenCardImage } = useBackground();
    
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
            className={`relative rounded-lg overflow-hidden ${statusClass} transition-all duration-500`}
            onClick={onClick}
        >
            {/* Hidden State Overlay */}
            {!isRevealed && (
               <div className="absolute inset-0 z-40 flex items-center justify-center cursor-pointer">
                    <Image
                        key={hiddenCardImage}
                        src={hiddenCardImage}
                        alt="Hidden Song"
                        className="object-cover w-full h-full scale-[1.02]"
                        fill
                        unoptimized
                    />
                </div>
            )}

            {/* image */}
            <div className="relative w-full aspect-[3/4] overflow-hidden">
                {isRevealed && sheet ? (
                    <>
                        <div
                            className="absolute z-0 overflow-hidden" 
                            style={FRAME_JACKET_WINDOW_STYLE}
                        >
                            <Image
                                src={`https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover/${song.imageName}`}
                                alt={song.title}
                                fill
                                unoptimized
                                sizes="(max-width: 768px) 36vw, 18vw"
                                className="object-cover"
                            />
                        </div>

                        <Image
                            src={getFrameImage(sheet.difficulty, sheet.type)}
                            alt="difficulty frame"
                            fill
                            sizes="(max-width: 768px) 45vw, 22vw"
                            className="absolute inset-0 object-cover z-10 pointer-events-none"
                        />

                        <div
                            className="absolute z-20 text-center pointer-events-none"
                            style={FRAME_DIFFICULTY_STYLE}
                        >
                            <span className="text-white font-black tracking-wide uppercase text-[clamp(14px,1.3vw,24px)] [text-shadow:1px_1px_0_#0F3674]">
                                {difficultyLabel}
                            </span>
                        </div>

                        <div
                            className="absolute z-20 text-center pointer-events-none px-1"
                            style={FRAME_TITLE_STYLE}
                        >
                            <span className="block text-white font-bold text-xs truncate">
                                {song.title}
                            </span>
                        </div>
                    </>
                ) : (
                    <Image
                        src={`https://dp4p6x0xfi5o9.cloudfront.net/maimai/img/cover/${song.imageName}`}
                        alt={song.title}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 45vw, 22vw"
                        className="absolute inset-0 w-full h-full object-cover z-10"
                    />
                )}
            </div>

            {/* status */}
            {isProtected && (
                <div className="absolute top-2 right-2 z-30">
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
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl z-30">
                    <span className="text-red-500 font-black text-4xl border-4 border-red-500 px-4 py-2 rounded-lg bg-white/10">
                        BANNED
                    </span>
                </div>
            )}
            {isPicked && (
                <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center rounded-xl z-30">
                    <span className="text-white font-black text-4xl drop-shadow-lg">
                        PICKED
                    </span>
                </div>
            )}
        </Card>
    );
};