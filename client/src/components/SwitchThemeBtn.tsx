import { ThemeContext } from "@/context/theme";
import { Sun, Moon } from "lucide-react";
import { useContext } from "react";

export default function SwitchTheme() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      type="button"
      //   theme === "light" ? "dark" : "light""
      onClick={() => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);

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
