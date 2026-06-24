import { createContext } from "react";

export type RadioStatus = "idle" | "connecting" | "playing" | "error";

export interface RadioPlayerContextValue {
  artist: string;
  title: string;
  artworkUrl: string;
  playerImageUrl: string;
  defaultTitle: string;
  defaultSubtitle: string;
  status: RadioStatus;
  streamUrl: string;
  volume: number;
  isPlaying: boolean;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  setVolume: (value: number) => void;
}

export const RadioPlayerContext =
  createContext<RadioPlayerContextValue | null>(null);
