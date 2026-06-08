import { formatRevenue } from "@/modules/barber/data/analyticsData.js";

/**
 * @param {{ rows: Array<{ month: string, revenue: number, appointments: number, completed: number, rating: number }>, periodLabel: string }} props
 */
export default function MonthlyPerformanceSummary({ rows = [], periodLabel }) {
  return (
    <section className="border-outline-variant bg-surface-container-low min-w-0 overflow-hidden rounded-xl border">
      <header className="border-outline-variant border-b px-4 py-3.5 sm:px-5">
        <h2 className="text-on-surface font-serif text-base font-bold sm:text-lg">
          Monthly performance summary
        </h2>
        <p className="text-on-surface-variant mt-0.5 text-xs">{periodLabel}</p>
      </header>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-outline-variant text-on-surface-variant border-b">
              <th className="font-label-caps px-5 py-3">Period</th>
              <th className="font-label-caps px-4 py-3">Revenue</th>
              <th className="font-label-caps px-4 py-3">Bookings</th>
              <th className="font-label-caps px-4 py-3">Completed</th>
              <th className="font-label-caps px-4 py-3">Avg rating</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.month}
                className="border-outline-variant/60 hover:bg-surface-container/40 border-b last:border-0"
              >
                <td className="text-on-surface px-5 py-3 font-medium">{row.month}</td>
                <td className="text-on-surface px-4 py-3">{formatRevenue(row.revenue)}</td>
                <td className="text-on-surface px-4 py-3">{row.appointments}</td>
                <td className="text-on-surface px-4 py-3">{row.completed}</td>
                <td className="px-4 py-3">
                  <span className="text-primary font-semibold">{row.rating.toFixed(1)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-outline-variant divide-y md:hidden">
        {rows.map((row) => (
          <li key={row.month} className="px-4 py-3.5 sm:px-5">
            <p className="text-on-surface font-semibold">{row.month}</p>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-on-surface-variant">Revenue</dt>
                <dd className="text-on-surface font-medium">{formatRevenue(row.revenue)}</dd>
              </div>
              <div>
                <dt className="text-on-surface-variant">Bookings</dt>
                <dd className="text-on-surface font-medium">{row.appointments}</dd>
              </div>
              <div>
                <dt className="text-on-surface-variant">Completed</dt>
                <dd className="text-on-surface font-medium">{row.completed}</dd>
              </div>
              <div>
                <dt className="text-on-surface-variant">Rating</dt>
                <dd className="text-primary font-medium">{row.rating.toFixed(1)}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}
