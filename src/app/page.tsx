"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import ScrollEngine from "@/components/ScrollEngine";
import TextOverlay from "@/components/TextOverlay";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const [activeProductIndex, setActiveProductIndex] = useState(0);
  const [localProgress, setLocalProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const numProducts = products.length;
    // Cap `latest` strictly from 0 to 1
    const clamped = Math.max(0, Math.min(1, latest));

    // Each product takes up exactly 1/numProducts of the total scroll
    const rawIndex = clamped * numProducts;

    // Math.min handles the edge case where clamped === 1 exactly
    const index = Math.min(Math.floor(rawIndex), numProducts - 1);

    // Calculate progress (0 to 1) just within the current active product's scroll chunk
    const segmentSize = 1 / numProducts;
    const segmentStart = index * segmentSize;
    // Normalise to 0..1
    const fractionalProgress = (clamped - segmentStart) / segmentSize;

    if (index !== activeProductIndex) {
      setActiveProductIndex(index);
    }

    // Smooth the progress clamping
    setLocalProgress(Math.max(0, Math.min(1, fractionalProgress)));
  });

  return (
    <main className="bg-black text-white selection:bg-monster-green selection:text-black">
      <Navbar />

      <ScrollEngine activeProductIndex={activeProductIndex} progress={localProgress} />

      <TextOverlay activeProductIndex={activeProductIndex} />

      {/* Scrollable Container (3 products * 500vh = 1500vh) */}
      <div ref={containerRef} className="relative z-0">
        {products.map((product) => (
          <section
            key={product.id}
            id={product.id}
            className="h-[500vh] w-full"
          />
        ))}
      </div>

      <Footer />
    </main>
  );
}
