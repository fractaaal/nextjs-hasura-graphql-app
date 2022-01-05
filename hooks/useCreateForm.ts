import { useState, useCallback, ChangeEvent, FormEvent } from 'react'
import { useMutation } from '@apollo/client'
import { CREATE_USER } from '../queries/queries'
import { CreateUserMutation } from '../types/generated/graphql'

export const useCreateForm = () => {
  const [text, setText] = useState('')
  const [username, setUsername] = useState('')

  const [insert_users_one] = useMutation<CreateUserMutation>(CREATE_USER, {
    //以下、ミューテーション後のキャッシュの処理を書いている
    update(cache, { data: { insert_users_one } }) {
      //
      const cacheId = cache.identify(insert_users_one) //insert_users_oneというフィールド名で返ってきたオブジェクトをキャッシュのIDにする
      cache.modify({
        fields: {
          users(existingUsers, { toReference }) {
            //更新したいフィールド名
            //existingUsersという引数に既存のデータを渡す。toReferenceにidを渡すとデータを参照できる
            return [toReference(cacheId), ...existingUsers]
          },
        },
      })
    },
  })
  const handleTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
  }, [])
  const usernameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }, [])
  const printMsg = useCallback(() => {
    console.log('Hello')
  }, [])
  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault
      try {
        await insert_users_one({
          variables: {
            name: username,
          },
        })
      } catch (err) {
        alert(err.message)
      }
      setUsername('')
    },
    [username]
  )
  return {
    text,
    handleSubmit,
    username,
    usernameChange,
    printMsg,
    handleTextChange,
  }
}
