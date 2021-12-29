import { ChangeEvent, FormEvent, useState, VFC } from 'react'
import { LocalStateB } from '../components/LocalStateB'
import { Layout } from '../components/Layout'

export const LocalStatePageB: VFC = () => {
  return (
    <Layout title="LOcal State B">
      <LocalStateB />
    </Layout>
  )
}

export default LocalStatePageB
