import { Card } from '@/components/ui'
import type { ForecastDay } from '@/lib'

import { ForecastBar } from './ForecastBar'

export function ReviewForecastCard({ forecast }: { forecast: ForecastDay[] }) {
  const max = Math.max(0, ...forecast.map((day) => day.count))

  return (
    <Card className="p-5">
      <h2 className="text-sm font-medium text-slate-500">Reviews this week</h2>
      <ol className="mt-4 flex gap-2">
        {forecast.map((day) => (
          <ForecastBar key={day.date} day={day} max={max} />
        ))}
      </ol>
    </Card>
  )
}
