"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Scissors } from "lucide-react";
import { toast } from "sonner";
import { ServiceCard } from "@/client/modules/barber/components/Services/ServiceCard.jsx";
import DeleteConfirmModal from "@/client/modules/barber/components/Services/DeleteConfirmModal.jsx";
import ServiceFormModal from "@/client/modules/barber/components/Services/ServiceFormModal.jsx";
import { EMPTY_SERVICE_FORM } from "@/client/modules/shared/constants/empty_form.js";
import { formatMoney } from "@/client/lib/format/formatMoney.js";
import { useQueryClient } from "@tanstack/react-query";
import { barberHook } from "@/client/modules/barber/hooks/barberQuery.jsx";
import { mapServiceFromApi, mapServiceToApi } from "@/client/modules/barber/helpers/barberMappers.js";

function recomputeServiceStats(services) {
  const active = services.filter((s) => s.isActive);
  const prices = active.map((s) => s.price);
  const durations = active.map((s) => s.duration);
  return {
    total: services.length,
    active: active.length,
    minPrice: prices.length ? Math.min(...prices) : 0,
    maxPrice: prices.length ? Math.max(...prices) : 0,
    avgDuration: durations.length
      ? Math.round(durations.reduce((sum, value) => sum + value, 0) / durations.length)
      : 0,
  };
}

function patchServicesCache(queryClient, editingId, updated) {
  queryClient.setQueryData(["barberListServices"], (current) => {
    if (!current?.services) return current;
    const services = editingId
      ? current.services.map((service) => (service.id === editingId ? updated : service))
      : [...current.services, updated];
    return {
      ...current,
      services,
      stats: recomputeServiceStats(services),
    };
  });
}

export default function BarberServices() {
  const queryClient = useQueryClient();
  const { data, isPending, isError, error, refetch } = barberHook.Services.useListServices();
  const createMutation = barberHook.Services.useCreateService();
  const updateMutation = barberHook.Services.useUpdateService();
  const deleteMutation = barberHook.Services.useDeleteService();

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_SERVICE_FORM);
  const [errors, setErrors] = useState({});
  const [serviceToDelete, setServiceToDelete] = useState(null);
  const [saved, setSaved] = useState(false);
  const [filter, setFilter] = useState("all");

  const busy =
    isPending || createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  useEffect(() => {
    if (isError) {
      toast.error(error?.message || "Could not load services.");
    }
  }, [isError, error]);

  const services = useMemo(
    () => (data?.services ?? []).map(mapServiceFromApi),
    [data],
  );

  const stats = data?.stats ?? {
    total: services.length,
    active: services.filter((s) => s.active).length,
    minPrice: 0,
    maxPrice: 0,
    avgDuration: 0,
  };

  const filtered = useMemo(() => {
    if (filter === "active") return services.filter((s) => s.active);
    if (filter === "hidden") return services.filter((s) => !s.active);
    return services;
  }, [services, filter]);

  const patchForm = useCallback((patch) => {
    setForm((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patch)) delete next[key];
      return next;
    });
  }, []);

  const validate = useCallback(() => {
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
  }, [form]);

  const openAdd = useCallback(() => {
    if (busy) return;
    setEditingId(null);
    setForm(EMPTY_SERVICE_FORM);
    setErrors({});
    setFormOpen(true);
  }, [busy]);

  const openEdit = useCallback(
    (service) => {
      if (busy) return;
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
    },
    [busy],
  );

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_SERVICE_FORM);
    setErrors({});
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!validate() || busy) return;
    const payload = mapServiceToApi(form);
    const isEdit = Boolean(editingId);

    try {
      const updated = isEdit
        ? await updateMutation.mutateAsync({ id: editingId, ...payload })
        : await createMutation.mutateAsync(payload);

      patchServicesCache(queryClient, isEdit ? editingId : null, updated);
      await queryClient.refetchQueries({ queryKey: ["barberListServices"] });

      toast.success(isEdit ? "Service updated" : "Service added");
      closeForm();
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2400);
    } catch {
      toast.error(isEdit ? "Could not save service" : "Could not add service");
    }
  }, [
    validate,
    busy,
    form,
    editingId,
    updateMutation,
    createMutation,
    queryClient,
    closeForm,
  ]);

  const requestDelete = useCallback(
    (service) => {
      if (!busy) setServiceToDelete(service);
    },
    [busy],
  );

  const confirmDelete = useCallback(async () => {
    if (!serviceToDelete || busy) return;
    const { id } = serviceToDelete;
    try {
      await deleteMutation.mutateAsync(id);
      queryClient.setQueryData(["barberListServices"], (current) => {
        if (!current?.services) return current;
        const services = current.services.filter((service) => service.id !== id);
        return {
          ...current,
          services,
          stats: recomputeServiceStats(services),
        };
      });
      await queryClient.refetchQueries({ queryKey: ["barberListServices"] });
      toast.success("Service deleted");
      setServiceToDelete(null);
      if (editingId === id) closeForm();
    } catch {
      toast.error("Could not delete service");
    }
  }, [serviceToDelete, busy, deleteMutation, queryClient, editingId, closeForm]);

  if (isPending && services.length === 0) {
    return (
      <div className="mx-auto max-w-6xl space-y-8 pb-4">
        <div className="bg-surface-container h-24 animate-pulse rounded-xl" />
        <div className="bg-surface-container h-64 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (isError && services.length === 0) {
    return (
      <div className="text-on-surface mx-auto max-w-6xl py-16 text-center">
        <p className="font-medium">Could not load services.</p>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={busy}
          className="text-primary mt-3 text-sm font-semibold hover:underline disabled:cursor-not-allowed disabled:opacity-50"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-4">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <p className="font-label-caps text-primary">Barber · Services</p>
          <h1 className="text-on-surface font-serif text-2xl font-bold tracking-tight md:text-3xl">
            My services
          </h1>
          <p className="text-on-surface-variant max-w-xl text-sm leading-relaxed">
            Manage what clients can book — set prices, durations, and visibility for each service on
            your chair.
          </p>
        </div>
        <button
          type="button"
          onClick={openAdd}
          disabled={busy}
          className="bg-primary text-on-primary inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add service
        </button>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Total services", value: stats.total },
          { label: "Active for booking", value: stats.active },
          {
            label: "Avg. duration",
            value: stats.avgDuration ? `${stats.avgDuration} min` : "—",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border-outline-variant bg-surface-container-low rounded-xl border px-4 py-3"
          >
            <p className="font-label-caps text-on-surface-variant">{stat.label}</p>
            <p className="text-on-surface mt-1 font-serif text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <section className="border-outline-variant bg-surface-container-low rounded-xl border">
        <div className="border-outline-variant flex flex-col gap-4 border-b px-5 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
          <div className="flex items-center gap-3">
            <span className="bg-primary/15 text-primary flex h-10 w-10 items-center justify-center rounded-lg">
              <Scissors className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="text-on-surface font-serif text-lg font-bold">Service list</h2>
              <p className="text-on-surface-variant text-sm">
                {stats.minPrice > 0 && stats.maxPrice > 0
                  ? `${formatMoney(stats.minPrice)} – ${formatMoney(stats.maxPrice)} on active services`
                  : "Add your first service to start taking bookings."}
              </p>
            </div>
          </div>
          <div className="border-outline-variant flex rounded-lg border p-0.5">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "hidden", label: "Hidden" },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => !busy && setFilter(tab.key)}
                disabled={busy}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
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
                disabled={busy}
              />
            ))
          ) : (
            <p className="border-outline-variant text-on-surface-variant rounded-lg border border-dashed px-4 py-12 text-center text-sm">
              {filter === "all"
                ? "No services yet. Add one to define your menu."
                : `No ${filter} services.`}
            </p>
          )}
        </div>
      </section>

      <p className="text-on-surface-variant text-center text-xs">
        {saved ? "Services updated." : "Changes are saved to your account."}
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
        disabled={busy}
      />

      <DeleteConfirmModal
        service={serviceToDelete}
        onConfirm={confirmDelete}
        onCancel={() => setServiceToDelete(null)}
        disabled={busy}
      />
    </div>
  );
}
