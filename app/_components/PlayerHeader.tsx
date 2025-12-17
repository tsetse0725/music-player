type Props = {
  title: string;
  artist: string;
};

export default function PlayerHeader({ title, artist }: Props) {
  return (
    <>
      <p className="text-xs tracking-[0.25em] text-slate-400">
        NOW PLAYING
      </p>
      <h2 className="text-2xl font-bold mt-1">{title}</h2>
      <p className="text-sm text-slate-400">{artist}</p>
    </>
  );
}
