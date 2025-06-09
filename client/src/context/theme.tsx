import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

// Define the context shape
interface IThemeContext {
  theme: "dark" | "light";
  setTheme: Dispatch<SetStateAction<"dark" | "light">>;
}

// Create the context
export const ThemeContext = createContext<IThemeContext>({
  theme: "light",
  setTheme: () => {}, // no-op fallback
});

// Create the provider component
export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
