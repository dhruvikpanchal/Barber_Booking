"use client";

import { useMemo, useState } from "react";
import { Plus, Scissors } from "lucide-react";
import {
  ServiceCard,
  formatMoney,
} from "./components/Services/ServiceCard.jsx";
import DeleteConfirmModal from "./components/Services/DeleteConfirmModal.jsx";
import ServiceFormModal from "./components/Services/ServiceFormModal.jsx";
import { EMPTY_SERVICE_FORM } from "@/constants/shared/empty_form.js";
import { INITIAL_SERVICES } from "@/data/barber/servicesData.js";
import { createId } from "@/components/common/helpers/createId.js";

export default function BarberServices() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_SERVICE_FORM);
  const [errors, setErrors] = useState({});
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [saved, setSaved] = useState(false);
  const [filter, setFilter] = useState("all");

  const stats = useMemo(() => {
    const active = services.filter((s) => s.active);
    const prices = active.map((s) => s.price);
    const durations = active.map((s) => s.duration);
    return {
      total: services.length,
      active: active.length,
      minPrice: prices.length ? Math.min(...prices) : 0,
      maxPrice: prices.length ? Math.max(...prices) : 0,
      avgDuration: durations.length
        ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length)
        : 0,
    };
  }, [services]);

  const filtered = useMemo(() => {
    if (filter === "active") return services.filter((s) => s.active);
    if (filter === "hidden") return services.filter((s) => !s.active);
    return services;
  }, [services, filter]);

  function patchForm(patch) {
    setForm((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patch)) delete next[key];
      return next;
    });
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    const price = Number(form.price);
    if (form.price === "" || Number.isNaN(price) || price < 0) {
      next.price = "Enter a valid price.";
    }
    const duration = Number(form.duration);
    if (form.duration === "" || Number.isNaN(duration) || duration < 5) {
      next.duration = "Duration must be at least 5 minutes.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function openAdd() {
    setEditingId(null);
    setForm(EMPTY_SERVICE_FORM);
    setErrors({});
    setFormOpen(true);
  }

  function openEdit(service) {
    setEditingId(service.id);
    setForm({
      name: service.name,
      description: service.description,
      price: String(service.price),
      duration: String(service.duration),
      active: service.active,
    });
    setErrors({});
    setFormOpen(true);
    setServiceToDelete(null);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_SERVICE_FORM);
    setErrors({});
  }

  function handleSubmit() {
    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      duration: Number(form.duration),
      active: form.active,
    };

    if (editingId) {
      setServices((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...payload } : s)),
      );
    } else {
      setServices((prev) => [...prev, { id: createId(), ...payload }]);
    }

    closeForm();
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2400);
  }

  function requestDelete(service) {
    setServiceToDelete(service);
  }

  function confirmDelete() {
    if (!serviceToDelete) return;
    const { id } = serviceToDelete;
    setServices((prev) => prev.filter((s) => s.id !== id));
    setServiceToDelete(null);
    if (editingId === id) closeForm();
  }

  function cancelDelete() {
    setServiceToDelete(null);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-4">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="font-label-caps text-primary">Barber · Services</p>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
            My services
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-on-surface-variant">
            Manage what clients can book — set prices, durations, and visibility
            for each service on your chair.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-on-primary transition-all hover:opacity-90 active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add service
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total services", value: stats.total },
          {
            label: "Active for booking",
            value: stats.active,
          },
          {
            label: "Avg. duration",
            value: stats.avgDuration ? `${stats.avgDuration} min` : "—",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3"
          >
            <p className="font-label-caps text-on-surface-variant">
              {stat.label}
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-on-surface">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <section className="rounded-xl border border-outline-variant bg-surface-container-low">
        <div className="flex flex-col gap-4 border-b border-outline-variant px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Scissors className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-serif text-lg font-bold text-on-surface">
                Service list
              </h2>
              <p className="text-sm text-on-surface-variant">
                {stats.minPrice > 0 && stats.maxPrice > 0
                  ? `${formatMoney(stats.minPrice)} – ${formatMoney(stats.maxPrice)} on active services`
                  : "Add your first service to start taking bookings."}
              </p>
            </div>
          </div>
          <div className="flex rounded-lg border border-outline-variant p-0.5">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "hidden", label: "Hidden" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  filter === tab.key
                    ? "bg-primary text-on-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 p-5 md:p-6">
          {filtered.length > 0 ? (
            filtered.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onEdit={openEdit}
                onDeleteRequest={requestDelete}
              />
            ))
          ) : (
            <p className="rounded-lg border border-dashed border-outline-variant px-4 py-12 text-center text-sm text-on-surface-variant">
              {filter === "all"
                ? "No services yet. Add one to define your menu."
                : `No ${filter} services.`}
            </p>
          )}
        </div>
      </section>

      <p className="text-center text-xs text-on-surface-variant">
        {saved
          ? "Services updated."
          : "Changes are local until your shop backend is connected."}
      </p>

      <ServiceFormModal
        open={formOpen}
        title={editingId ? "Edit service" : "Add service"}
        form={form}
        errors={errors}
        onChange={patchForm}
        onClose={closeForm}
        onSubmit={handleSubmit}
        submitLabel={editingId ? "Save changes" : "Add service"}
      />

      <DeleteConfirmModal
        service={serviceToDelete}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
