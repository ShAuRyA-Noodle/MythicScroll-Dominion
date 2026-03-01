export type Flavor = "ultra" | "original" | "mango-loco";

export interface ProductData {
    id: Flavor;
    name: string;
    tagline: string;
    description: string;
    color: string;
    frameCount: number;
    sequencePath: string; // The folder or base path for images
}

export const products: ProductData[] = [
    {
        id: "ultra",
        name: "Monster Ultra",
        tagline: "Frozen Lightning Precision",
        description: "Zero sugar. Pure aggressive energy. A lighter tasting, less sweet, citrusy, sparkling refreshment.",
        color: "var(--color-monster-white)",
        frameCount: 240,
        sequencePath: "/Monster_01",
    },
    {
        id: "mango-loco",
        name: "Mango Loco",
        tagline: "Neon Festival Detonation",
        description: "A heavenly blend of exotic juices to attract even the most stubborn spirits.",
        color: "var(--color-monster-blue)",
        frameCount: 240,
        sequencePath: "/Monster_02",
    },
    {
        id: "original",
        name: "Monster Energy",
        tagline: "Nuclear Reactor Chaos",
        description: "The original green monster. Tear into a can of the meanest energy drink on the planet.",
        color: "var(--color-monster-green)",
        frameCount: 240,
        sequencePath: "/Monster_03",
    },
];
