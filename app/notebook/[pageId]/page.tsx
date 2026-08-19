import Notebook from "../../components/notebook/Notebook";

type Props = {
  params: Promise<{ pageId: string }>;
};
export default async function NotebookPageDynamic({ params }: Props) {
  const { pageId } = await params;

  return (
    <main className="flex flex-col justify-evenly w-screen h-screen">
      <div className="">
        {" "}
        <Notebook initialPage={pageId} />
      </div>

      <div className=" self-end text-center w-full text-gray-300 text-sm z-10000">
        <p>© 2026. All rights reserved.</p>
      </div>
    </main>
  );
}
