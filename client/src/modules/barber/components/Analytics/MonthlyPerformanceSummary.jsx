import { formatRevenue } from "@/data/barber/analyticsData.js";

/**
 * @param {{ rows: Array<{ month: string, revenue: number, appointments: number, completed: number, rating: number }>, periodLabel: string }} props
 */
export default function MonthlyPerformanceSummary({ rows = [], periodLabel }) {
  return (
    <section className="min-w-0 overflow-hidden rounded-xl border border-outline-variant bg-surface-container-low">
      <header className="border-b border-outline-variant px-4 py-3.5 sm:px-5">
        <h2 className="font-serif text-base font-bold text-on-surface sm:text-lg">
          Monthly performance summary
        </h2>
        <p className="mt-0.5 text-xs text-on-surface-variant">{periodLabel}</p>
      </header>

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[32rem] text-left text-sm">
          <thead>
            <tr className="border-b border-outline-variant text-on-surface-variant">
              <th className="px-5 py-3 font-label-caps">Period</th>
              <th className="px-4 py-3 font-label-caps">Revenue</th>
              <th className="px-4 py-3 font-label-caps">Bookings</th>
              <th className="px-4 py-3 font-label-caps">Completed</th>
              <th className="px-4 py-3 font-label-caps">Avg rating</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.month}
                className="border-b border-outline-variant/60 last:border-0 hover:bg-surface-container/40"
              >
                <td className="px-5 py-3 font-medium text-on-surface">
                  {row.month}
                </td>
                <td className="px-4 py-3 text-on-surface">
                  {formatRevenue(row.revenue)}
                </td>
                <td className="px-4 py-3 text-on-surface">{row.appointments}</td>
                <td className="px-4 py-3 text-on-surface">{row.completed}</td>
                <td className="px-4 py-3">
                  <span className="font-semibold text-primary">
                    {row.rating.toFixed(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-outline-variant md:hidden">
        {rows.map((row) => (
          <li key={row.month} className="px-4 py-3.5 sm:px-5">
            <p className="font-semibold text-on-surface">{row.month}</p>
            <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-on-surface-variant">Revenue</dt>
                <dd className="font-medium text-on-surface">
                  {formatRevenue(row.revenue)}
                </dd>
              </div>
              <div>
                <dt className="text-on-surface-variant">Bookings</dt>
                <dd className="font-medium text-on-surface">
                  {row.appointments}
                </dd>
              </div>
              <div>
                <dt className="text-on-surface-variant">Completed</dt>
                <dd className="font-medium text-on-surface">{row.completed}</dd>
              </div>
              <div>
                <dt className="text-on-surface-variant">Rating</dt>
                <dd className="font-medium text-primary">
                  {row.rating.toFixed(1)}
                </dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}
