import clsx from "clsx";

type StickerMockProps = {
  name: string;
  stats?: string;
  team?: string;
  accent?: "yellow" | "green" | "blue";
};

const accentMap = {
  yellow: "from-[#FFDF00] to-[#f4c400]",
  green: "from-[#15B860] to-[#007a35]",
  blue: "from-[#3C7DFF] to-[#002776]",
};

export function StickerMock({
  name,
  stats = "10-6-1999 | 1,75m | 70 kg",
  team = "BRASIL FC",
  accent = "yellow",
}: StickerMockProps) {
  return (
    <div className="group relative w-full max-w-[242px]">
      <div className="absolute inset-x-5 bottom-0 h-10 translate-y-4 rounded-full bg-brasil-blue/20 blur-xl transition group-hover:bg-brasil-green/25" />
      <div className="sticker-shine relative aspect-[5/7] w-full overflow-hidden rounded-[18px] bg-brasil-cyan shadow-sticker ring-4 ring-white">
        <div className="absolute -left-9 top-1 select-none font-black leading-none text-[#005F00]/75">
          <div className="text-[12rem]">2</div>
          <div className="-mt-16 translate-x-20 text-[13rem]">6</div>
        </div>

        <div className="absolute right-5 top-5 text-right font-black leading-none text-white">
          <div className="text-4xl">26</div>
          <div className="text-xs tracking-normal">FIFA</div>
        </div>

        <div
          className={clsx(
            "absolute left-1/2 top-[17%] h-[50%] w-[72%] -translate-x-1/2 overflow-hidden rounded-[24px] bg-gradient-to-b shadow-lg shadow-brasil-blue/15",
            accentMap[accent],
          )}
        >
          <div className="absolute left-1/2 top-8 h-20 w-20 -translate-x-1/2 rounded-full bg-[#7b573e]" />
          <div className="absolute left-1/2 top-20 h-7 w-24 -translate-x-1/2 rounded-t-full bg-[#2a1a13]" />
          <div className="absolute left-1/2 top-24 h-32 w-44 -translate-x-1/2 rounded-t-[4rem] bg-white/92" />
          <div className="absolute left-1/2 top-[7.4rem] h-28 w-56 -translate-x-1/2 rounded-t-[4rem] bg-[#009C3B]" />
          <div className="absolute bottom-0 left-0 right-0 h-14 bg-black/10" />
        </div>

        <div className="absolute right-4 top-[55%] flex flex-col items-center gap-2">
          <div className="relative grid h-14 w-14 place-items-center rounded-full border-[5px] border-white bg-[#009C3B] shadow-lg">
            <span className="absolute h-6 w-9 rotate-[-12deg] bg-brasil-yellow" />
            <span className="relative h-5 w-5 rounded-full bg-brasil-blue ring-1 ring-white/80" />
          </div>
          <div className="origin-center rotate-90 text-4xl font-black text-white [text-shadow:0_2px_0_#009cb3]">
            BRA
          </div>
        </div>

        <div className="absolute bottom-5 left-4 right-4">
          <div className="rounded-[18px] bg-[#002050] px-3 py-3 text-center text-white shadow-lg">
            <div className="truncate text-2xl font-black leading-none">{name}</div>
            <div className="mt-2 truncate text-[0.72rem] font-semibold">{stats}</div>
          </div>
          <div className="mt-2 grid grid-cols-[1fr_auto] items-center gap-2">
            <div className="truncate rounded-lg bg-[#002050] px-3 py-2 text-center text-xs font-bold text-white">
              {team}
            </div>
            <div className="rounded-md border-2 border-red-700 bg-brasil-yellow px-2 py-1 font-serif text-xs font-black text-red-700">
              PANINI
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
