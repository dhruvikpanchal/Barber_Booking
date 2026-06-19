import { Armchair, Clock, Users } from "lucide-react";

export default function QueueSnapshot({
  waiting = 0,
  inService = 0,
  chairsBusy = 0,
  chairsTotal = 0,
}) {
  const freeChairs = Math.max(0, chairsTotal - chairsBusy);
  const activeTotal = waiting + inService;
  const load =
    chairsTotal > 0 ? Math.min(100, Math.round((chairsBusy / chairsTotal) * 100)) : 0;

  return (
    <section className="border-outline-variant bg-surface-container-low flex h-full min-w-0 flex-col overflow-hidden rounded-xl border">
      <header className="border-outline-variant border-b px-4 py-3 sm:px-5 sm:py-4">
        <p className="font-label-caps text-on-surface-variant">Live queue</p>
        <h3 className="text-on-surface font-serif text-base font-bold sm:text-lg">
          Platform snapshot
        </h3>
      </header>

      <div className="flex flex-1 flex-col justify-center gap-4 p-4 sm:p-5">
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          <div className="bg-surface-container/60 rounded-lg border border-outline-variant/60 p-3 text-center">
            <Clock className="text-primary mx-auto h-4 w-4" aria-hidden />
            <p className="text-on-surface mt-2 font-serif text-xl font-bold">{waiting}</p>
            <p className="text-on-surface-variant text-[10px] font-medium uppercase tracking-wide">
              Waiting
            </p>
          </div>
          <div className="bg-surface-container/60 rounded-lg border border-outline-variant/60 p-3 text-center">
            <Users className="text-status-confirmed mx-auto h-4 w-4" aria-hidden />
            <p className="text-on-surface mt-2 font-serif text-xl font-bold">{inService}</p>
            <p className="text-on-surface-variant text-[10px] font-medium uppercase tracking-wide">
              In service
            </p>
          </div>
          <div className="bg-surface-container/60 rounded-lg border border-outline-variant/60 p-3 text-center">
            <Armchair className="text-on-surface-variant mx-auto h-4 w-4" aria-hidden />
            <p className="text-on-surface mt-2 font-serif text-xl font-bold">{freeChairs}</p>
            <p className="text-on-surface-variant text-[10px] font-medium uppercase tracking-wide">
              Free chairs
            </p>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Chair utilization</span>
            <span className="text-on-surface font-medium">
              {chairsBusy}/{chairsTotal || "—"}
            </span>
          </div>
          <div className="bg-surface-container h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${load}%` }}
            />
          </div>
          <p className="text-on-surface-variant mt-2 text-xs">
            {activeTotal > 0
              ? `${activeTotal} customer${activeTotal !== 1 ? "s" : ""} in queue or being served`
              : "No active queue traffic right now"}
          </p>
        </div>
      </div>
    </section>
  );
}
