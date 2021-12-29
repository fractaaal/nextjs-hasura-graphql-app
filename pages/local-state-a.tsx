import { ChangeEvent, FormEvent, useState, VFC } from 'react'
import { todoVar } from '../cache'
import { useReactiveVar } from '@apollo/client'
import Link from 'next/link'
import { LocalStateA } from '../components/LocalStateA'
import { Layout } from '../components/Layout'

const LocalStatePageA: VFC = () => {
  return (
    <Layout title="LOcal State A">
      <LocalStateA />
    </Layout>
  )
}

export default LocalStatePageA
