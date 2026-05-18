import type { NextRequest } from 'next/server'

interface YahooQuote {
  open: (number | null)[]
  high: (number | null)[]
  low: (number | null)[]
  close: (number | null)[]
}

interface YahooChartResult {
  timestamp: number[]
  indicators: { quote: YahooQuote[] }
}

interface YahooResponse {
  chart: {
    result: YahooChartResult[] | null
    error: { code: string; description: string } | null
  }
}

export interface CandleData {
  time: string
  open: number
  high: number
  low: number
  close: number
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const ticker = searchParams.get('ticker')
  const to = searchParams.get('to')

  if (!ticker || !to) {
    return Response.json({ error: 'ticker and to are required' }, { status: 400 })
  }

  const endDate = new Date(to)
  const startDate = new Date(endDate)
  startDate.setFullYear(startDate.getFullYear() - 1)

  const period1 = Math.floor(startDate.getTime() / 1000)
  const period2 = Math.floor(endDate.getTime() / 1000)

  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}` +
    `?period1=${period1}&period2=${period2}&interval=1d&includePrePost=false`

  let res: Response
  try {
    res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } })
  } catch {
    return Response.json({ error: 'Network error reaching Yahoo Finance' }, { status: 502 })
  }

  if (!res.ok) {
    return Response.json({ error: `Yahoo Finance returned ${res.status}` }, { status: 502 })
  }

  const json: YahooResponse = await res.json()

  if (!json.chart.result || json.chart.error) {
    return Response.json(
      { error: json.chart.error?.description ?? 'No data returned for this ticker' },
      { status: 404 }
    )
  }

  const result = json.chart.result[0]
  const { timestamp, indicators } = result
  const [quote] = indicators.quote

  const candles: CandleData[] = []

  for (let i = 0; i < timestamp.length; i++) {
    const open = quote.open[i]
    const high = quote.high[i]
    const low = quote.low[i]
    const close = quote.close[i]

    if (open == null || high == null || low == null || close == null) continue

    const date = new Date(timestamp[i] * 1000)
    const time = date.toISOString().split('T')[0]

    candles.push({ time, open, high, low, close })
  }

  return Response.json(candles)
}
