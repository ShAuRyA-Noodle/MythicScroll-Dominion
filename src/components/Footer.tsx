export default function Footer() {
    return (
        <footer className="relative z-20 w-full min-h-[50vh] bg-black border-t border-neutral-900 text-white flex flex-col justify-center items-center py-24 px-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-monster-green/5 to-transparent pointer-events-none" />
            <h2 className="text-4xl md:text-8xl font-display font-black uppercase tracking-tighter mb-8 text-center drop-shadow-[0_0_30px_rgba(144,255,0,0.2)]">
                Unleash the Beast
            </h2>
            <p className="text-neutral-500 max-w-md text-center mb-12 text-sm">
                © {new Date().getFullYear()} Monster Energy Company. All Rights Reserved. Kinetic design concept. High-performance scrollytelling.
            </p>
        </footer>
    );
}
