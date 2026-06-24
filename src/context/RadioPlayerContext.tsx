import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { DEFAULT_APP_CONFIG, getAppConfig } from "@/services/sheetsService";
import { RadioPlayerContext } from "./RadioPlayerCore";
import type { RadioPlayerContextValue, RadioStatus } from "./RadioPlayerCore";

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
  const [streamUrl, setStreamUrl] = useState(DEFAULT_APP_CONFIG.radio_stream_url);
  const [metadataUrl, setMetadataUrl] = useState(
    DEFAULT_APP_CONFIG.radio_metadata_url,
  );
  const [defaultTitle, setDefaultTitle] = useState(
    DEFAULT_APP_CONFIG.radio_default_title,
  );
  const [defaultSubtitle, setDefaultSubtitle] = useState(
    DEFAULT_APP_CONFIG.radio_default_subtitle,
  );
  const [playerImageUrl, setPlayerImageUrl] = useState(
    DEFAULT_APP_CONFIG.radio_player_image_url,
  );
  const [artist, setArtist] = useState("");
  const [title, setTitle] = useState(DEFAULT_APP_CONFIG.radio_default_title);
  const [artworkUrl, setArtworkUrl] = useState("");
  const [volume, setVolumeState] = useState(0.5);

  useEffect(() => {
    let mounted = true;

    getAppConfig()
      .then((config) => {
        if (!mounted) return;

        setStreamUrl(config.radio_stream_url);
        setMetadataUrl(config.radio_metadata_url);
        setDefaultTitle(config.radio_default_title);
        setDefaultSubtitle(config.radio_default_subtitle);
        setPlayerImageUrl(config.radio_player_image_url);
        setTitle((currentTitle) =>
          currentTitle === DEFAULT_APP_CONFIG.radio_default_title
            ? config.radio_default_title
            : currentTitle,
        );
      })
      .catch((error) => {
        console.error("Config error:", error);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const audio = new Audio(streamUrl);

    audio.preload = "metadata";
    audio.crossOrigin = "anonymous";
    audio.volume = 0.5;
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
  }, [streamUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) audio.volume = volume;
  }, [volume]);

  useEffect(() => {
    if (!metadataUrl) return;

    const meta = new EventSource(metadataUrl);

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
  }, [metadataUrl]);

  useEffect(() => {
    const controller = new AbortController();
    const query = [artist, title].filter(Boolean).join(" ").trim();

    if (!query || title === defaultTitle) {
      setArtworkUrl("");
      return () => controller.abort();
    }

    const timeout = window.setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          term: query,
          media: "music",
          entity: "song",
          limit: "1",
        });
        const response = await fetch(
          `https://itunes.apple.com/search?${params.toString()}`,
          { signal: controller.signal },
        );
        const data = (await response.json()) as {
          results?: Array<{
            artworkUrl100?: string;
            artistName?: string;
            trackName?: string;
          }>;
        };
        const match = data.results?.[0];
        const artwork = match?.artworkUrl100 ?? "";

        setArtworkUrl(artwork.replace("100x100bb", "600x600bb"));
        if (match?.trackName && title !== match.trackName) {
          setTitle(toTitleCase(match.trackName));
        }
        if (match?.artistName && artist !== match.artistName) {
          setArtist(toTitleCase(match.artistName));
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Artwork lookup error:", error);
          setArtworkUrl("");
        }
      }
    }, 450);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [artist, defaultTitle, title]);

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
      artworkUrl,
      playerImageUrl,
      defaultTitle,
      defaultSubtitle,
      status,
      streamUrl,
      volume,
      isPlaying: status === "playing" || status === "connecting",
      play,
      pause,
      toggle,
      setVolume,
    }),
    [
      artist,
      artworkUrl,
      defaultSubtitle,
      defaultTitle,
      pause,
      play,
      playerImageUrl,
      setVolume,
      status,
      streamUrl,
      title,
      toggle,
      volume,
    ],
  );

  return (
    <RadioPlayerContext.Provider value={value}>
      {children}
    </RadioPlayerContext.Provider>
  );
};
