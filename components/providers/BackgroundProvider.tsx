"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface BackgroundContextType {
    currentBackgroundIndex: number;
    backgroundList: string[];
    hiddenCardImage: string;
    changeBackground: (index: number) => void;
    nextBackground: () => void;
}

const BackgroundContext = createContext<BackgroundContextType>({
    currentBackgroundIndex: 0,
    backgroundList: [],
    hiddenCardImage: "/assets/card/hidden-song.png",
    changeBackground: () => {},
    nextBackground: () => {},
});

export const useBackground = () => useContext(BackgroundContext);

const BACKGROUNDS = [
    "assets/background/kaleidoscopebg_white_1080p.mp4",
    "assets/background/kaleidoscopebg_black_1080p.mp4",
];

const HIDDEN_CARDS = [
    "/assets/card/hidden-song.png",
    "/assets/card/final-song.png",
];

export const BackgroundProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentBackgroundIndex, setCurrentBackgroundIndex] = useState(0);
    const [currentHiddenCardIndex, setCurrentHiddenCardIndex] = useState(0);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.key === "1") {
                setCurrentBackgroundIndex(0);
                setCurrentHiddenCardIndex(0);
            }

            if (event.key === "2") {
                setCurrentBackgroundIndex(1);
                setCurrentHiddenCardIndex(1);
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, []);

    const changeBackground = (index: number) => {
        if (index >= 0 && index < BACKGROUNDS.length) {
            setCurrentBackgroundIndex(index);
        }
    };

    const nextBackground = () => {
        setCurrentBackgroundIndex((prev) => (prev + 1) % BACKGROUNDS.length);
    };

    return (
        <BackgroundContext.Provider
            value={{
                currentBackgroundIndex,
                backgroundList: BACKGROUNDS,
                hiddenCardImage: HIDDEN_CARDS[currentHiddenCardIndex],
                changeBackground,
                nextBackground,
            }}
        >
            {children}
        </BackgroundContext.Provider>
    );
};
