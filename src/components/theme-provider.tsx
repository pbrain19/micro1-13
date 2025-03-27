"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "pet-tracker-theme",
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = false,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);

  // Initialize theme from localStorage when component mounts on client
  useEffect(() => {
    const storedTheme =
      typeof window !== "undefined"
        ? (localStorage.getItem(storageKey) as Theme)
        : null;

    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, [storageKey, defaultTheme]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = window.document.documentElement;

    // Handle transition
    if (disableTransitionOnChange) {
      root.classList.add("no-transition");

      // Force a reflow
      window.getComputedStyle(root).getPropertyValue("opacity");
    }

    // Remove existing classes
    root.classList.remove("light", "dark");

    // Add the appropriate class based on the theme
    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }

    // Clean up transitions
    if (disableTransitionOnChange) {
      // Again, force a reflow
      window.getComputedStyle(root).getPropertyValue("opacity");

      root.classList.remove("no-transition");
    }
  }, [theme, enableSystem, disableTransitionOnChange, attribute]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey, theme);
      }
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
