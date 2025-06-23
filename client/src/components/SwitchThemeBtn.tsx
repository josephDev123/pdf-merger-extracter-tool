import { ThemeContext } from "@/context/theme";
import { Sun, Moon } from "lucide-react";
import { useContext, useEffect, useState } from "react";

export default function SwitchTheme() {
  // useContext(ThemeContext)
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const currentTheme = localStorage.getItem("theme") || "light";
    setTheme(currentTheme as "light" | "dark");
    document.documentElement.classList.add(currentTheme);
  }, []);

  return (
    <button
      type="button"
      onClick={() => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);

        if (newTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }}
      className="inline-flex gap-2"
    >
      {theme == "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
