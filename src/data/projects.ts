export type ProjectVisual = "lopt" | "context0" | "atlas" | "chimera";

export type Project = {
  id: string;
  index: string;
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  repo: string;
  demo?: string;
  visual: ProjectVisual;
};

/**
 * Verified against github.com/y4sh-codes on 9 November 2026.
 * Atlas and Chimera were identified from the public repository list:
 * - Atlas: "Argo Data Visualization Platform" (TypeScript)
 * - Chimera: "Clean-label backdoors targeting Flow-Matching Diffusion Transformers"
 *
 * Edit this file to update the gallery. No project copy lives inside the
 * animation components.
 */
export const projects: Project[] = [
  {
    id: "lopt",
    index: "01",
    name: "Lopt",
    tagline: "Multimodal deepfake detection.",
    description:
      "A multimodal deepfake classification framework that pairs Vision Transformers for image analysis with TimeSformer for video, exposed through a FastAPI backend and a React interface.",
    tech: ["Python", "PyTorch", "Vision Transformers", "TimeSformer", "FastAPI"],
    repo: "https://github.com/y4sh-codes/Lopt",
    demo: "https://lopt-eight.vercel.app/",
    visual: "lopt",
  },
  {
    id: "context0",
    index: "02",
    name: "Context0",
    tagline: "Decentralised memory for AI agents.",
    description:
      "A decentralised memory-sharing protocol for AI agents, pairing an Arweave-native vector database with an MCP server and a Next.js dashboard for persistent, user-owned context.",
    tech: ["TypeScript", "Next.js", "Arweave", "HNSW", "MCP"],
    repo: "https://github.com/y4sh-codes/context0",
    demo: "https://context0-liard.vercel.app/",
    visual: "context0",
  },
  {
    id: "atlas",
    index: "03",
    name: "Atlas",
    tagline: "Argo ocean data, made legible.",
    description:
      "An Argo float data visualisation platform developed for INCOIS under Smart India Hackathon, combining interactive ocean maps, parameter profiles and an AI query layer for marine data.",
    tech: ["Next.js", "TypeScript", "Leaflet", "D3", "Qdrant", "PostgreSQL"],
    repo: "https://github.com/y4sh-codes/Atlas",
    visual: "atlas",
  },
  {
    id: "chimera",
    index: "04",
    name: "Chimera",
    tagline: "Clean-label backdoors in DiTs.",
    description:
      "A research project introducing Flow-Anchor Poisoning, a clean-label backdoor attack targeting flow-matching diffusion transformers such as FLUX.1 and Stable Diffusion 3.",
    tech: ["Python", "PyTorch", "Diffusion Transformers", "Flow Matching", "Jupyter"],
    repo: "https://github.com/y4sh-codes/Chimera",
    visual: "chimera",
  },
];
