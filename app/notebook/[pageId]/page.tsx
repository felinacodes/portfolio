import Notebook from '../../components/notebook/Notebook'

type Props = {
  params: Promise<{ pageId: string }>
}
export default async function NotebookPageDynamic({ params }: Props) {
  const { pageId } = await params

  return (
    <main className="flex items-center justify-center w-full min-h-screen">
      <Notebook initialPage={pageId} />
    </main>
  )
}
