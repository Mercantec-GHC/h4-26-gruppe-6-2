import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    AsyncStorage.getItem("theme").then((value) => {
      if (value === "dark" || value === "light") {
        setTheme(value);
      }
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return { theme, toggleTheme };
}
