import { useContext } from "react";
import { RadioPlayerContext } from "./RadioPlayerCore";

export const useRadioPlayer = () => {
  const context = useContext(RadioPlayerContext);

  if (!context) {
    throw new Error("useRadioPlayer debe usarse dentro de RadioPlayerProvider");
  }

  return context;
};
