"use client";

import { createContext, useContext, type ReactNode } from "react";

const ExperienceReadyContext = createContext(false);

export function ExperienceReadyProvider({
  ready,
  children,
}: {
  ready: boolean;
  children: ReactNode;
}) {
  return (
    <ExperienceReadyContext.Provider value={ready}>
      {children}
    </ExperienceReadyContext.Provider>
  );
}

export function useExperienceReady() {
  return useContext(ExperienceReadyContext);
}
