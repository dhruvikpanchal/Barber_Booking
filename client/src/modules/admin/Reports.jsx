"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Calendar,
  CalendarCheck,
  Download,
  FileSpreadsheet,
  FileText,
  Loader2,
  RefreshCw,
  Scissors,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { Toast } from "@/components/common/settings/TinyPrimitives.jsx";
import {
  REPORT_DATE_RANGES,
  REPORT_TYPES,
  REPORT_RANGE_MULTIPLIER,
} from "@/constants/admin/admin.js";
import {
  scale,
  buildSummary,
  buildTableRows,
  getColumns,
  rowsToCsv,
  downloadFile,
} from "./components/Reports/MockDataBuilder";
import { StatusCell, SummaryCard } from "./components/Reports/Primitives.jsx";

export default function Reports() {
  const [reportType, setReportType] = useState("appointments");
  const [dateRange, setDateRange] = useState("month");
  const [customStart, setCustomStart] = useState("2026-05-01");
  const [customEnd, setCustomEnd] = useState("2026-05-19");
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(null);
  const [toast, setToast] = useState(null);

  const activeType = REPORT_TYPES.find((r) => r.key === reportType);
  const columns = useMemo(() => getColumns(reportType), [reportType]);
  const rows = useMemo(
    () => (generated ? buildTableRows(reportType, dateRange) : []),
    [generated, reportType, dateRange],
  );
  const summary = useMemo(
    () => (generated ? buildSummary(dateRange) : null),
    [generated, dateRange],
  );

  const rangeLabel = useMemo(() => {
    if (dateRange === "custom") {
      return `${customStart} → ${customEnd}`;
    }
    return REPORT_DATE_RANGES.find((d) => d.key === dateRange)?.label ?? "";
  }, [dateRange, customStart, customEnd]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  async function handleGenerate() {
    if (dateRange === "custom" && (!customStart || !customEnd)) {
      showToast("Select both start and end dates for a custom range.", "error");
      return;
    }
    if (dateRange === "custom" && new Date(customStart) > new Date(customEnd)) {
      showToast("Start date must be before end date.", "error");
      return;
    }

    setLoading(true);
    setGenerated(false);
    await new Promise((r) => setTimeout(r, 700));
    setGenerated(true);
    setLoading(false);
    showToast("Report generated successfully.");
  }

  async function handleExport(format) {
    if (!generated || rows.length === 0) {
      showToast("Generate a report before exporting.", "error");
      return;
    }

    setExporting(format);
    await new Promise((r) => setTimeout(r, 500));

    const slug = `${reportType}-${dateRange}-${Date.now()}`;
    if (format === "csv") {
      const csv = rowsToCsv(columns, rows);
      downloadFile(csv, `iron-oak-${slug}.csv`, "text/csv;charset=utf-8;");
      showToast("CSV export downloaded.");
    } else {
      const text = [
        `Iron & Oak — ${activeType?.label ?? "Report"}`,
        `Period: ${rangeLabel}`,
        "",
        rowsToCsv(columns, rows),
        "",
        "— Demo PDF export (plain text). Use a PDF library in production.",
      ].join("\n");
      downloadFile(text, `iron-oak-${slug}.txt`, "text/plain;charset=utf-8;");
      showToast("PDF export simulated as downloadable summary file.", "info");
    }

    setExporting(null);
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-4">
      <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <p className="font-label-caps text-primary">Admin · Platform</p>
          <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
            Reports
          </h1>
          <p className="text-on-surface-variant max-w-2xl text-sm leading-relaxed">
            Generate and export platform-wide insights — appointments, users, barbers, services, and
            activity. Admin scope only; not shop-level POS reporting.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={loading}
            className="bg-primary text-on-primary inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-bold transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <RefreshCw className="h-4 w-4" aria-hidden />
            )}
            Generate report
          </button>
          <button
            type="button"
            onClick={() => handleExport("csv")}
            disabled={!generated || Boolean(exporting)}
            className="border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {exporting === "csv" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <FileSpreadsheet className="h-4 w-4" aria-hidden />
            )}
            Export CSV
          </button>
          <button
            type="button"
            onClick={() => handleExport("pdf")}
            disabled={!generated || Boolean(exporting)}
            className="border-outline-variant bg-surface-container-low text-on-surface hover:bg-surface-container inline-flex h-10 items-center gap-2 rounded-md border px-4 text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {exporting === "pdf" ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Download className="h-4 w-4" aria-hidden />
            )}
            Export PDF
          </button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Report type selection */}
        <aside className="space-y-3">
          <p className="font-label-caps text-on-surface-variant">Report type</p>
          <nav className="space-y-2" aria-label="Report types">
            {REPORT_TYPES.map((type) => {
              const Icon = type.icon;
              const active = reportType === type.key;
              return (
                <button
                  key={type.key}
                  type="button"
                  onClick={() => {
                    setReportType(type.key);
                    setGenerated(false);
                  }}
                  className={`w-full rounded-xl border p-4 text-left transition-colors ${
                    active
                      ? "border-primary bg-primary/10"
                      : "border-outline-variant bg-surface-container-low hover:bg-surface-container"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                        active
                          ? "bg-primary/20 text-primary"
                          : "bg-surface-container text-on-surface-variant"
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </span>
                    <div className="min-w-0">
                      <p className="text-on-surface-variant text-[10px] font-semibold tracking-wide uppercase">
                        {type.category}
                      </p>
                      <p className="text-on-surface mt-0.5 text-sm font-semibold">{type.label}</p>
                      <p className="text-on-surface-variant mt-1 line-clamp-2 text-xs">
                        {type.description}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </aside>

        <div className="space-y-6">
          {/* Filters */}
          <section className="border-outline-variant bg-surface-container-low rounded-xl border p-5 md:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-on-surface font-serif text-lg font-bold">Filters</h2>
                <p className="text-on-surface-variant text-sm">
                  {activeType?.label} · {rangeLabel}
                </p>
              </div>
              <span className="border-outline-variant bg-surface-container text-on-surface-variant inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold">
                <Calendar className="h-3.5 w-3.5" aria-hidden />
                Platform-wide
              </span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {REPORT_DATE_RANGES.map((range) => (
                <button
                  key={range.key}
                  type="button"
                  onClick={() => {
                    setDateRange(range.key);
                    setGenerated(false);
                  }}
                  className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                    dateRange === range.key
                      ? "bg-primary text-on-primary"
                      : "border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface border"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {dateRange === "custom" && (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="block text-xs">
                  <span className="font-label-caps text-on-surface-variant">Start date</span>
                  <input
                    type="date"
                    value={customStart}
                    onChange={(e) => {
                      setCustomStart(e.target.value);
                      setGenerated(false);
                    }}
                    className="border-outline-variant bg-surface-container text-on-surface focus:border-primary mt-1.5 w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                  />
                </label>
                <label className="block text-xs">
                  <span className="font-label-caps text-on-surface-variant">End date</span>
                  <input
                    type="date"
                    value={customEnd}
                    onChange={(e) => {
                      setCustomEnd(e.target.value);
                      setGenerated(false);
                    }}
                    className="border-outline-variant bg-surface-container text-on-surface focus:border-primary mt-1.5 w-full rounded-md border px-3 py-2 text-sm focus:outline-none"
                  />
                </label>
              </div>
            )}
          </section>

          {/* Summary metrics */}
          {loading && (
            <div className="border-outline-variant flex flex-col items-center justify-center rounded-xl border border-dashed py-20">
              <Loader2 className="text-primary h-8 w-8 animate-spin" aria-hidden />
              <p className="text-on-surface-variant mt-3 text-sm">Generating report…</p>
            </div>
          )}

          {!loading && generated && summary && (
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                label="Total appointments"
                value={summary.totalAppointments.toLocaleString()}
                sub={`${summary.completionRate}% completed`}
                icon={CalendarCheck}
                accent="bg-primary/15 text-primary"
              />
              <SummaryCard
                label="Completed"
                value={summary.completed.toLocaleString()}
                icon={CalendarCheck}
                accent="bg-status-confirmed/15 text-status-confirmed"
              />
              <SummaryCard
                label="Cancelled"
                value={summary.cancelled.toLocaleString()}
                icon={XCircle}
                accent="bg-status-cancelled/15 text-status-cancelled"
              />
              <SummaryCard
                label="New customers"
                value={summary.newCustomers.toLocaleString()}
                sub={`${summary.newBarbers} new barbers`}
                icon={Users}
                accent="bg-primary/15 text-primary"
              />
              <SummaryCard
                label="Active barbers"
                value={summary.activeBarbers}
                icon={Scissors}
                accent="bg-status-confirmed/15 text-status-confirmed"
              />
              <SummaryCard
                label="Top service"
                value={summary.topService}
                sub="Most booked"
                icon={BarChart3}
                accent="bg-primary/15 text-primary"
              />
              <SummaryCard
                label="Platform sessions"
                value={summary.platformSessions.toLocaleString()}
                icon={Activity}
                accent="bg-surface-container text-on-surface-variant"
              />
              <SummaryCard
                label="Registrations"
                value={(summary.newCustomers + summary.newBarbers).toLocaleString()}
                sub="Customers + barbers"
                icon={UserPlus}
                accent="bg-primary/15 text-primary"
              />
            </section>
          )}

          {/* Preview table */}
          {!loading && (
            <section className="border-outline-variant bg-surface-container-low rounded-xl border">
              <header className="border-outline-variant flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4 md:px-6">
                <div>
                  <h2 className="text-on-surface font-serif text-lg font-bold">Report preview</h2>
                  <p className="text-on-surface-variant text-sm">
                    {generated
                      ? `${rows.length} rows · ${activeType?.label}`
                      : "Generate a report to preview data"}
                  </p>
                </div>
                {generated && (
                  <span className="text-status-confirmed inline-flex items-center gap-1.5 text-xs font-semibold">
                    <FileText className="h-3.5 w-3.5" aria-hidden />
                    Ready to export
                  </span>
                )}
              </header>

              {!generated ? (
                <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                  <FileText className="text-on-surface-variant/30 h-10 w-10" aria-hidden />
                  <p className="text-on-surface mt-4 font-serif text-base font-bold">
                    No report generated yet
                  </p>
                  <p className="text-on-surface-variant mt-1 max-w-sm text-sm">
                    Choose a report type and date range, then click Generate report to load platform
                    data.
                  </p>
                </div>
              ) : rows.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <p className="text-on-surface font-serif text-base font-bold">
                    No data for this period
                  </p>
                  <p className="text-on-surface-variant mt-1 text-sm">
                    Try a wider date range or another report type.
                  </p>
                </div>
              ) : (
                <>
                  <div className="hidden overflow-x-auto md:block">
                    <table className="w-full min-w-[720px] text-left text-sm">
                      <thead>
                        <tr className="border-outline-variant text-on-surface-variant border-b">
                          {columns.map((col) => (
                            <th key={col.key} className="font-label-caps px-5 py-3">
                              {col.label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row) => (
                          <tr
                            key={row.id}
                            className="border-outline-variant/60 hover:bg-surface-container/40 border-b transition-colors last:border-b-0"
                          >
                            {columns.map((col) => {
                              const val = row[col.key];
                              const isStatus =
                                col.key === "status" ||
                                (typeof val === "string" &&
                                  [
                                    "completed",
                                    "cancelled",
                                    "active",
                                    "pending",
                                    "confirmed",
                                    "inactive",
                                    "disabled",
                                    "approved",
                                    "rejected",
                                    "no-show",
                                  ].some((s) => String(val).toLowerCase().includes(s)));
                              return (
                                <td key={col.key} className="text-on-surface px-5 py-3.5">
                                  {isStatus ? <StatusCell value={val} /> : val}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <ul className="space-y-3 p-4 md:hidden">
                    {rows.map((row) => (
                      <li
                        key={row.id}
                        className="border-outline-variant bg-surface-container rounded-lg border p-4"
                      >
                        {columns.map((col) => (
                          <div
                            key={col.key}
                            className="border-outline-variant/50 flex justify-between gap-3 border-b py-2 last:border-b-0"
                          >
                            <span className="text-on-surface-variant text-xs">{col.label}</span>
                            <span className="text-on-surface text-right text-sm font-medium">
                              {col.key === "status" ||
                              String(row[col.key])
                                .toLowerCase()
                                .match(/active|cancel|complet|pending|approv/) ? (
                                <StatusCell value={row[col.key]} />
                              ) : (
                                row[col.key]
                              )}
                            </span>
                          </div>
                        ))}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
