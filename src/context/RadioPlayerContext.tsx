import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const STREAM_URL = "https://stream.zeno.fm/phybdd3ph98uv";
const META_URL = "https://api.zeno.fm/mounts/metadata/subscribe/phybdd3ph98uv";

export type RadioStatus = "idle" | "connecting" | "playing" | "error";

interface RadioPlayerContextValue {
  artist: string;
  title: string;
  status: RadioStatus;
  streamUrl: string;
  volume: number;
  isPlaying: boolean;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  setVolume: (value: number) => void;
}

const RadioPlayerContext = createContext<RadioPlayerContextValue | null>(null);

const toTitleCase = (value: string) =>
  value
    .replace(/^\d+\.\s*/, "")
    .replace(/^Track\s*\d+\s*-\s*/i, "")
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export const RadioPlayerProvider = ({ children }: { children: ReactNode }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [status, setStatus] = useState<RadioStatus>("idle");
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState("Radio Catolica");
  const [volume, setVolumeState] = useState(0.8);

  useEffect(() => {
    const audio = new Audio(STREAM_URL);

    audio.preload = "metadata";
    audio.crossOrigin = "anonymous";
    audio.volume = 0.8;
    audioRef.current = audio;

    const onPlaying = () => setStatus("playing");
    const onWaiting = () => setStatus("connecting");
    const onError = () => setStatus("error");
    const onPause = () =>
      setStatus((currentStatus) =>
        currentStatus === "playing" || currentStatus === "connecting"
          ? "idle"
          : currentStatus,
      );

    audio.addEventListener("playing", onPlaying);
    audio.addEventListener("waiting", onWaiting);
    audio.addEventListener("error", onError);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.pause();
      audio.removeEventListener("playing", onPlaying);
      audio.removeEventListener("waiting", onWaiting);
      audio.removeEventListener("error", onError);
      audio.removeEventListener("pause", onPause);
      audio.src = "";
      audioRef.current = null;
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    const meta = new EventSource(META_URL);

    meta.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data?.streamTitle) {
          const parts = String(data.streamTitle).split(" - ");

          if (parts.length > 1) {
            setArtist(toTitleCase(parts[0]));
            setTitle(toTitleCase(parts.slice(1).join(" - ")));
          } else {
            setArtist("");
            setTitle(toTitleCase(data.streamTitle));
          }
        }
      } catch (error) {
        console.error("Metadata error:", error);
      }
    };

    return () => meta.close();
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (status === "playing") return;

    setStatus("connecting");

    try {
      if (audio.networkState === HTMLMediaElement.NETWORK_EMPTY) {
        audio.load();
      }

      await audio.play();
    } catch (error) {
      console.error("Error al reproducir:", error);
      setStatus("error");
    }
  }, [status]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setStatus("idle");
  }, []);

  const toggle = useCallback(async () => {
    if (status === "playing" || status === "connecting") {
      pause();
      return;
    }

    await play();
  }, [pause, play, status]);

  const setVolume = useCallback((value: number) => {
    setVolumeState(Math.min(1, Math.max(0, value)));
  }, []);

  const value = useMemo<RadioPlayerContextValue>(
    () => ({
      artist,
      title,
      status,
      streamUrl: STREAM_URL,
      volume,
      isPlaying: status === "playing" || status === "connecting",
      play,
      pause,
      toggle,
      setVolume,
    }),
    [artist, pause, play, setVolume, status, title, toggle, volume],
  );

  return (
    <RadioPlayerContext.Provider value={value}>
      {children}
    </RadioPlayerContext.Provider>
  );
};

export const useRadioPlayer = () => {
  const context = useContext(RadioPlayerContext);

  if (!context) {
    throw new Error("useRadioPlayer debe usarse dentro de RadioPlayerProvider");
  }

  return context;
};
