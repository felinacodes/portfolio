import Notebook from "./components/notebook/Notebook";

export default function NotebookPage() {
  return (
    <main className="flex flex-col justify-evenly w-screen h-screen">
      <div className="">
        {" "}
        <Notebook />
      </div>

      <div className=" self-end text-center w-full text-gray-300 text-sm z-10000">
        <p>© 2026. All rights reserved.</p>
      </div>
    </main>
  );
}
