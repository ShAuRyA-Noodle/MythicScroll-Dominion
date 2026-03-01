"use client";

import { useEffect, useRef, useState } from "react";
import { products } from "@/data/products";

interface ScrollEngineProps {
    activeProductIndex: number;
    progress: number; // 0 to 1 strictly for the current product
}

// Global cache object mapping product indices to image arrays
const imageCache: Record<number, Record<number, HTMLImageElement>> = {};
// Track what has been loaded to avoid redundant requests
const loadedTracker: Record<number, boolean> = {};

export default function ScrollEngine({ activeProductIndex, progress }: ScrollEngineProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const requestRef = useRef<number>(0);
    const [windowSize, setWindowSize] = useState({ w: 0, h: 0 });

    const targetFrame = useRef(1);
    const currentFrameRef = useRef(1);

    const activeProduct = products[activeProductIndex];

    const getImagePath = (productIndex: number, frame: number) => {
        const p = products[productIndex];
        const paddedFrame = frame.toString().padStart(3, "0");
        return `${p.sequencePath}/ezgif-frame-${paddedFrame}.png`;
    };

    // Refactored Preloader: Aggressive Memory Management
    const preloadImages = (productIndex: number) => {
        if (loadedTracker[productIndex]) return;

        const p = products[productIndex];
        if (!imageCache[productIndex]) imageCache[productIndex] = {};

        // To save memory on mobile (720 frames is too much), only keep the current and *immediate adjacent* products loaded.
        Object.keys(imageCache).forEach(key => {
            const index = parseInt(key);
            if (Math.abs(index - activeProductIndex) > 1) {
                // aggressively clear old products from memory
                imageCache[index] = {};
                loadedTracker[index] = false;
            }
        });

        for (let i = 1; i <= p.frameCount; i++) {
            if (!imageCache[productIndex][i]) {
                const img = new Image();
                img.src = getImagePath(productIndex, i);
                imageCache[productIndex][i] = img;
            }
        }
        loadedTracker[productIndex] = true;
    };

    // 1. Initial preload and resize listener (with dvh fix)
    useEffect(() => {
        const handleResize = () => {
            // Using innerHeight specifically as it handles mobile address bar collapsing better than 100vh
            setWindowSize({ w: window.innerWidth, h: window.innerHeight });
        };
        handleResize(); // trigger on mount

        window.addEventListener("resize", handleResize);

        preloadImages(activeProductIndex);

        // Lazy load the adjacent frames using requestIdleCallback if available
        const lazyLoadNext = () => {
            if (activeProductIndex < products.length - 1) preloadImages(activeProductIndex + 1);
            if (activeProductIndex > 0) preloadImages(activeProductIndex - 1);
        };

        if ('requestIdleCallback' in window) {
            requestIdleCallback(lazyLoadNext);
        } else {
            setTimeout(lazyLoadNext, 500); // Safari fallback
        }

        return () => window.removeEventListener("resize", handleResize);
    }, [activeProductIndex]);

    // 2. Setup Canvas Context with devicePixelRatio for Retina/High-DPI Mobile Screens
    useEffect(() => {
        if (!canvasRef.current || windowSize.w === 0) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;

        // Scale canvas backing store logic
        canvas.width = windowSize.w * dpr;
        canvas.height = windowSize.h * dpr;

        // Scale CSS display logic
        canvas.style.width = `${windowSize.w}px`;
        canvas.style.height = `${windowSize.h}px`;

        // Normalize coordinate system to use css pixels
        ctx.scale(dpr, dpr);
        contextRef.current = ctx;

        // Force a redraw when resizing happens
        currentFrameRef.current = -1;
    }, [windowSize]);

    // 3. Render Loop utilizing requestAnimationFrame
    useEffect(() => {
        // We use Math.round on mobile to reduce frame jumping and calculate fewer intermediate paints
        // If on extremely weak mobile connection/device, we could cut frame count further here.
        const exactFrame = Math.max(1, Math.min(activeProduct.frameCount, Math.round(progress * activeProduct.frameCount) + 1));
        targetFrame.current = exactFrame;

        const render = () => {
            if (!contextRef.current || !canvasRef.current) return;

            if (currentFrameRef.current !== targetFrame.current) {
                currentFrameRef.current = targetFrame.current;

                let img = imageCache[activeProductIndex]?.[currentFrameRef.current];

                // Fallback creation if aggressive memory manager purged it
                if (!img) {
                    img = new Image();
                    img.src = getImagePath(activeProductIndex, currentFrameRef.current);
                    if (!imageCache[activeProductIndex]) imageCache[activeProductIndex] = {};
                    imageCache[activeProductIndex][currentFrameRef.current] = img;
                }

                if (img.complete) {
                    drawCenteredImage(contextRef.current, canvasRef.current, img);
                } else {
                    img.onload = () => {
                        if (currentFrameRef.current === parseInt(img.src.split('-').pop() || "1")) {
                            drawCenteredImage(contextRef.current!, canvasRef.current!, img);
                        }
                    };
                }
            }
            requestRef.current = requestAnimationFrame(render);
        };

        requestRef.current = requestAnimationFrame(render);
        return () => cancelAnimationFrame(requestRef.current);
    }, [progress, activeProductIndex, windowSize, activeProduct.frameCount]);

    const drawCenteredImage = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, img: HTMLImageElement) => {
        // devicePixelRatio affects layout math
        const dpr = window.devicePixelRatio || 1;
        const cssWidth = canvas.width / dpr;
        const cssHeight = canvas.height / dpr;

        const canvasRatio = cssWidth / cssHeight;
        const imgRatio = img.width / img.height;

        let drawWidth, drawHeight, offsetX, offsetY;

        if (canvasRatio > imgRatio) {
            drawWidth = cssWidth;
            drawHeight = cssWidth / imgRatio;
            offsetX = 0;
            offsetY = (cssHeight - drawHeight) / 2;
        } else {
            drawWidth = cssHeight * imgRatio;
            drawHeight = cssHeight;
            offsetX = (cssWidth - drawWidth) / 2;
            offsetY = 0;
        }

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, cssWidth, cssHeight);
        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    return (
        // Replaced h-screen with h-[100dvh] for mobile safari bottom bar jumping
        <div className="fixed inset-0 w-full h-[100dvh] z-0 bg-black pointer-events-none">
            <canvas ref={canvasRef} className="block w-full h-full object-cover" />
            <div
                className="absolute inset-0 transition-colors duration-1000 ease-out mix-blend-screen opacity-30"
                style={{
                    background: `radial-gradient(circle at center, ${activeProduct.color} 0%, transparent 70%)`
                }}
            />
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
        </div>
    );
}
