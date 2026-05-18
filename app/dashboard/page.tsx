'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'
import type { CandleData } from '../api/chart/route'

const StockChart = dynamic(() => import('../components/StockChart'), { ssr: false })

export default function Dashboard() {
  const [ticker, setTicker] = useState('')
  const [date, setDate] = useState('')
  const [data, setData] = useState<CandleData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!ticker || !date) return

    setLoading(true)
    setError(null)
    setData([])

    try {
      const res = await fetch(
        `/api/chart?ticker=${encodeURIComponent(ticker)}&to=${date}`
      )
      const json = await res.json()

      if (!res.ok) {
        setError(json.error ?? 'Unknown error')
        return
      }

      setData(json)
    } catch {
      setError('Failed to connect to the server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex flex-1 w-full max-w-4xl flex-col gap-8 py-16 px-8">
        <h1 className="text-6xl font-semibold tracking-tight text-black dark:text-zinc-50">
          Trader&apos;s Gate
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
          <input
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase dark:bg-zinc-900 dark:text-white dark:border-zinc-700"
            type="text"
            placeholder="Ticker"
            value={ticker}
            onChange={e => setTicker(e.target.value.toUpperCase())}
          />
          <input
            className="border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:text-white dark:border-zinc-700"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading || !ticker || !date}
            className="bg-black text-white rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 dark:bg-zinc-800"
          >
            {loading ? 'Loading...' : 'Load Chart'}
          </button>
        </form>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        {data.length > 0 && (
          <div className="w-full rounded-lg overflow-hidden border border-zinc-800">
            <StockChart data={data} />
          </div>
        )}
      </main>
    </div>
  )
}
