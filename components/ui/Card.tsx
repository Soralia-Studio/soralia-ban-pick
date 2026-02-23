"use client";

import { motion } from "framer-motion";
import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export const Card = ({ children, className = "", onClick }: CardProps) => {
    return (
        <motion.div
            whileTap={{ scale: 0.95 }}
            className={`cursor-pointer ${className}`}
            onClick={onClick}
        >
            {children}
        </motion.div>
    );
};