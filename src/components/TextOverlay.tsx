"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { products } from "@/data/products";

interface TextOverlayProps {
    activeProductIndex: number;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
    exit: {
        opacity: 0,
        transition: { staggerChildren: -0.05, staggerDirection: -1 }
    }
};

const itemVariants: Variants = {
    hidden: { y: 40, opacity: 0, scale: 0.95 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: { type: "spring", stiffness: 100, damping: 20 }
    },
    exit: {
        y: -40,
        opacity: 0,
        transition: { ease: "easeInOut", duration: 0.3 }
    }
};

export default function TextOverlay({ activeProductIndex }: TextOverlayProps) {
    const product = products[activeProductIndex];

    return (
        <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-center px-8 md:px-24">
            <AnimatePresence mode="wait">
                <motion.div
                    key={product.id}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="max-w-4xl"
                >
                    <motion.h2
                        variants={itemVariants}
                        className="text-xl md:text-2xl font-bold tracking-widest uppercase mb-4"
                        style={{ color: product.color }}
                    >
                        {product.name}
                    </motion.h2>

                    <motion.h1
                        variants={itemVariants}
                        className="font-display text-5xl md:text-8xl lg:text-9xl font-black uppercase leading-none tracking-tighter mb-6 text-white drop-shadow-2xl"
                    >
                        {/* Split tagline into words for more impact manually or line break if it's long */}
                        {product.tagline.split(' ').map((word, i) => (
                            <span key={i} className="block">{word}</span>
                        ))}
                    </motion.h1>

                    <motion.p
                        variants={itemVariants}
                        className="text-lg md:text-xl font-light max-w-lg text-neutral-300 leading-relaxed drop-shadow-md"
                    >
                        {product.description}
                    </motion.p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
