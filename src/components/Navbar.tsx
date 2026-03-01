"use client";

import { motion } from "framer-motion";

export default function Navbar() {
    return (
        <motion.nav
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center py-6 px-8 md:px-24 mix-blend-difference"
        >
            <a href="https://www.monsterenergy.com/" target="_blank" rel="noopener noreferrer" className="text-2xl font-display font-black tracking-tighter uppercase text-white hover:opacity-80 transition-opacity">
                MONSTER<span className="text-monster-green">®</span>
            </a>

            <div className="hidden md:flex space-x-8 text-sm font-bold tracking-widest uppercase text-white">
                <a href="https://www.monsterenergy.com/en-us/energy-drinks/zero-sugar/" target="_blank" rel="noopener noreferrer" className="hover:text-monster-white transition-colors duration-300">Ultra</a>
                <a href="https://www.monsterenergy.com/en-us/energy-drinks/juice-monster/mango-loco/" target="_blank" rel="noopener noreferrer" className="hover:text-monster-blue transition-colors duration-300">Mango Loco</a>
                <a href="https://www.monsterenergy.com/en-us/energy-drinks/" target="_blank" rel="noopener noreferrer" className="hover:text-monster-green transition-colors duration-300">Original</a>
            </div>

            <a href="https://www.monsterenergy.com/en-us/products/" target="_blank" rel="noopener noreferrer" className="text-sm font-bold tracking-widest uppercase border border-white/20 px-6 py-2 rounded-full hover:bg-white hover:text-black transition-all duration-300 text-white">
                Buy Now
            </a>
        </motion.nav>
    );
}
