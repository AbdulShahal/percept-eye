import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-16 h-8 rounded-full transition-all duration-300 overflow-hidden group"
      style={{
        background: theme === "dark"
          ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
          : "linear-gradient(135deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.02) 100%)",
        border: theme === "dark"
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(0,0,0,0.08)"
      }}
    >
      <div
        className="absolute top-1 w-6 h-6 rounded-full transition-all duration-300 flex items-center justify-center"
        style={{
          left: theme === "dark" ? "4px" : "calc(100% - 28px)",
          background: theme === "dark"
            ? "linear-gradient(135deg, #3C8262 0%, #2d6249 100%)"
            : "linear-gradient(135deg, #3C8262 0%, #52a67d 100%)",
          boxShadow: theme === "dark"
            ? "0 0 20px rgba(60, 130, 98, 0.4), 0 2px 8px rgba(0,0,0,0.3)"
            : "0 0 12px rgba(60, 130, 98, 0.2), 0 2px 4px rgba(0,0,0,0.1)"
        }}
      >
        {theme === "dark" ? (
          <Moon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        ) : (
          <Sun className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        )}
      </div>
    </button>
  );
}
