import { VFC, useState, FormEvent } from 'react'
import Link from 'next/link'
import { useQuery, useMutation } from '@apollo/client'
import {
  GET_USERS,
  CREATE_USER,
  DELETE_USER,
  UPDATE_USER,
  GET_USERS_LOCAL,
} from '../queries/queries'
import {
  GetUsersQuery,
  CreateUserMutation,
  DeleteUserMutation,
  UpdateUserMutation,
} from '../types/generated/graphql'
import { Layout } from '../components/Layout'
import { UserItem } from '../components/UserItems'

const HasuraCRUD: VFC = () => {
  const [editedUser, setEditedUser] = useState({ id: '', name: '' })
  const { data, error } = useQuery<GetUsersQuery>(GET_USERS, {
    fetchPolicy: 'cache-and-network',
  })
  const [update_users_by_pk] = useMutation<UpdateUserMutation>(UPDATE_USER)
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
  const [delete_users_by_pk] = useMutation<DeleteUserMutation>(DELETE_USER, {
    //以下、ミューテーション後のキャッシュの処理を書いている
    update(cache, { data: { delete_users_by_pk } }) {
      cache.modify({
        fields: {
          users(existingUsers, { readField }) {
            //更新したいフィールド名
            //existingUsersという引数に既存のデータを渡す。toReferenceにidを渡すとデータを参照できる
            return existingUsers.filter(
              (user) => delete_users_by_pk.id !== readField('id', user)
            )
          },
        },
      })
    },
  })
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editedUser.id) {
      try {
        await update_users_by_pk({
          variables: {
            id: editedUser.id,
            name: editedUser.name,
          },
        })
      } catch (err) {
        alert(err.message)
      }
      setEditedUser({ id: '', name: '' })
    } else {
      try {
        await insert_users_one({
          variables: {
            name: editedUser.name,
          },
        })
      } catch (err) {
        alert(err.message)
      }
      setEditedUser({ id: '', name: '' })
    }
  }
  if (error) {
    return <Layout title="Hasura CRUD">{error.message}</Layout>
  }
  return (
    <Layout title="Hasura CRUD">
      <p className="mb-3 font-bold"></p>
      <form
        className="flex flex-col justify-center items-center"
        onSubmit={handleSubmit}
      >
        <input
          className="px-3 py-2 border border-gray-300"
          placeholder="New User ?"
          type="text"
          value={editedUser.name}
          onChange={(e) => {
            setEditedUser({ ...editedUser, name: e.target.value })
          }}
        />
        <button
          disabled={!editedUser.name}
          className="disabled:opacity-40 my-3 py-1 px-3 text-white bg-indigo-600 hover:bg-indigo-700 rounded-2xl focus:outline-none"
          data-testid="new"
          type="submit"
        >
          {editedUser.id ? 'Update' : 'Create'}
        </button>
      </form>
      {data?.users.map((user) => {
        return (
          <UserItem
            key={user.id}
            user={user}
            delete_users_by_pk={delete_users_by_pk}
            setEditedUser={setEditedUser}
          />
        )
      })}
    </Layout>
  )
}

export default HasuraCRUD