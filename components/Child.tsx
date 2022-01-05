import { VFC, memo, ChangeEvent, FormEvent } from 'react'

interface Props {
  printMsg: () => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>
}
export const Child: VFC<Props> = memo(({ printMsg, handleSubmit }) => {
  return (
    <>
      {console.log('Child rendered')}
      <p>Child Component</p>
      <button
        className="my-3 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rouded-2xl focus:outline-none"
        onClick={printMsg}
      >
        Click
      </button>
    </>
  )
})
