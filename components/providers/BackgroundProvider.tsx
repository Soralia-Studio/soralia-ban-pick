"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "./SocketProvider";

interface BackgroundContextType {
    currentBackgroundIndex: number;
    backgroundList: string[];
    hiddenCardImage: string;
    changeBackground: (index: number) => void;
    nextBackground: () => void;
}

const THEME_PRESETS = [
    {
        background: "assets/background/kaleidoscopebg_white_1080p.mp4",
        hiddenCard: "/assets/card/hidden-song.png",
    },
    {
        background: "assets/background/kaleidoscopebg_black_1080p.mp4",
        hiddenCard: "/assets/card/final-song.png",
    },
] as const;

const BACKGROUNDS = THEME_PRESETS.map((theme) => theme.background);

const BackgroundContext = createContext<BackgroundContextType>({
    currentBackgroundIndex: 0,
    backgroundList: BACKGROUNDS,
    hiddenCardImage: THEME_PRESETS[0].hiddenCard,
    changeBackground: () => {},
    nextBackground: () => {},
});

export const useBackground = () => useContext(BackgroundContext);

export const BackgroundProvider = ({ children }: { children: React.ReactNode }) => {
    const { gameState } = useSocket();
    const [currentThemeIndex, setCurrentThemeIndex] = useState(0);

    useEffect(() => {
        const nextThemeIndex = gameState?.themeIndex;
        if (typeof nextThemeIndex !== "number") return;
        if (nextThemeIndex < 0 || nextThemeIndex >= THEME_PRESETS.length) return;

        setCurrentThemeIndex(nextThemeIndex);
    }, [gameState?.themeIndex]);

    const changeBackground = (index: number) => {
        if (index >= 0 && index < THEME_PRESETS.length) {
            setCurrentThemeIndex(index);
        }
    };

    const nextBackground = () => {
        setCurrentThemeIndex((prev) => (prev + 1) % THEME_PRESETS.length);
    };

    const activeTheme = THEME_PRESETS[currentThemeIndex] ?? THEME_PRESETS[0];

    return (
        <BackgroundContext.Provider
            value={{
                currentBackgroundIndex: currentThemeIndex,
                backgroundList: BACKGROUNDS,
                hiddenCardImage: activeTheme.hiddenCard,
                changeBackground,
                nextBackground,
            }}
        >
            {children}
        </BackgroundContext.Provider>
    );
};
