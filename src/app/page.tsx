import PuzzleBoard from "@/components/PuzzleBoard";

export default function Home() {
  return (
    <div className="mx-auto container flex flex-col gap-10 p-8">
      <header className="flex gap-4 items-center flex-col ">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          8 puzzle solver
      </h1>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
          Using A*, Deep-Search and Wide-Search algorithms and using JS
      </h4>
      </header>
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <PuzzleBoard initialState="123456078"/>
        <PuzzleBoard initialState="123456078"/>
        <PuzzleBoard initialState="123456078"/>
      </main>
    </div>
  );
}
