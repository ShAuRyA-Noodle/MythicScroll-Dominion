"use client";

import { useEffect, useRef, useState } from "react";
import { products } from "@/data/products";

interface ScrollEngineProps {
    activeProductIndex: number;
    progress: number; // 0 to 1 strictly for the current product
}

// Global cache to avoid re-fetching or holding duplicate image objects
const imageCache: Record<string, HTMLImageElement> = {};
const loadedTracker: Record<string, boolean> = {};

export default function ScrollEngine({ activeProductIndex, progress }: ScrollEngineProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const requestRef = useRef<number>(0);
    const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });

    // Which frame we should theoretically be on right now
    const targetFrame = useRef(1);
    // Which frame we are actively rendering (used for smooth interpolation if needed, but for scroll tied, direct is often better to avoid lag)
    // Let's stick to direct mapping to avoid scroll-lag, as strict scroll-mapping is usually preferred for precise kinetic sync.
    const currentFrameRef = useRef(1);

    const activeProduct = products[activeProductIndex];

    const getImagePath = (productIndex: number, frame: number) => {
        const p = products[productIndex];
        // frames are 1-indexed and padded to 3 digits (e.g., ezgif-frame-001.png)
        const paddedFrame = frame.toString().padStart(3, "0");
        return `${p.sequencePath}/ezgif-frame-${paddedFrame}.png`;
    };

    const preloadImages = (productIndex: number) => {
        if (loadedTracker[productIndex]) return;
        const p = products[productIndex];
        for (let i = 1; i <= p.frameCount; i++) {
            const path = getImagePath(productIndex, i);
            if (!imageCache[path]) {
                const img = new Image();
                img.src = path;
                imageCache[path] = img;
            }
        }
        loadedTracker[productIndex] = true;
    };

    // 1. Initial preload and resize listener
    useEffect(() => {
        setWindowSize({ w: window.innerWidth, h: window.innerHeight });

        const handleResize = () => {
            setWindowSize({ w: window.innerWidth, h: window.innerHeight });
        };

        window.addEventListener("resize", handleResize);

        // Preload current and next immediately
        preloadImages(activeProductIndex);
        if (activeProductIndex < products.length - 1) {
            requestIdleCallback(() => preloadImages(activeProductIndex + 1));
        }

        return () => window.removeEventListener("resize", handleResize);
    }, [activeProductIndex]);

    // 2. Setup Canvas Context
    useEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        contextRef.current = canvas.getContext("2d", { alpha: false }); // alpha: false can improve performance
    }, [windowSize]);

    // 3. Render Loop utilizing requestAnimationFrame
    useEffect(() => {
        // Math to determine the current frame based on 0-1 progress
        // If progress is exactly 1, frame is frameCount
        const exactFrame = Math.max(1, Math.min(activeProduct.frameCount, Math.floor(progress * activeProduct.frameCount) + 1));
        targetFrame.current = exactFrame;

        const render = () => {
            if (!contextRef.current || !canvasRef.current) return;

            // We only render if the frame changed or if we need to force a redraw
            if (currentFrameRef.current !== targetFrame.current) {
                currentFrameRef.current = targetFrame.current;
                const path = getImagePath(activeProductIndex, currentFrameRef.current);
                let img = imageCache[path];

                // If image is not in cache, create it (fallback)
                if (!img) {
                    img = new Image();
                    img.src = path;
                    imageCache[path] = img;
                }

                if (img.complete) {
                    drawCenteredImage(contextRef.current, canvasRef.current, img);
                } else {
                    // If it's not loaded yet, wait for it
                    img.onload = () => {
                        // Only draw if we are still on this frame, preventing old frames from overriding newer ones
                        if (currentFrameRef.current === parseInt(path.split('-').pop() || "1")) {
                            drawCenteredImage(contextRef.current!, canvasRef.current!, img);
                        }
                    };
                }
            }

            requestRef.current = requestAnimationFrame(render);
        };

        requestRef.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [progress, activeProductIndex, windowSize]);

    // First draw when component mounts or index switches
    useEffect(() => {
        currentFrameRef.current = -1; // force an immediate redraw of frame 1
    }, [activeProductIndex]);


    const drawCenteredImage = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) => {
        // "cover" algorithm for the canvas
        const canvasRatio = canvas.width / canvas.height;
        const imgRatio = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = canvas.width;
            drawHeight = canvas.width / imgRatio;
            offsetX = 0;
            offsetY = (canvas.height - drawHeight) / 2;
        } else {
            drawWidth = canvas.height * imgRatio;
            drawHeight = canvas.height;
            offsetX = (canvas.width - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.fillStyle = "#000000"; // Deep black background
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    return (
        <div className="fixed inset-0 w-full h-screen z-0 bg-black pointer-events-none">
            <canvas ref={canvasRef} className="block w-full h-full object-cover" />
            {/* Volumetric ambient overlay gradient representing the aura of the current flavor */}
            <div
                className="absolute inset-0 transition-colors duration-1000 ease-out mix-blend-screen opacity-30"
                style={{
                    background: `radial-gradient(circle at center, ${activeProduct.color} 0%, transparent 70%)`
                }}
            />
            {/* Noise overlay for metallic/industrial feel */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        </div>
    );
}
