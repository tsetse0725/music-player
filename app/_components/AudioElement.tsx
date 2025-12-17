import type { RefObject } from "react";

type Props = {
  audioRef: RefObject<HTMLAudioElement | null>;
  src: string;
  onLoaded: (duration: number) => void;
};

export default function AudioElement({ audioRef, src, onLoaded }: Props) {
  return (
    <audio
      key={src}
      ref={audioRef}
      src={src}
      preload="metadata"
      onLoadedMetadata={(e) => {
        const d = e.currentTarget.duration;
        if (Number.isFinite(d) && d > 0) onLoaded(d);
      }}
      onError={() => {
        console.log("Audio failed to load:", src);
      }}
    />
  );
}
