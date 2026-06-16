export type MaintenanceState = {
  enabled: boolean;
  message: string;
};

let state: MaintenanceState = {
  enabled: false,
  message: "",
};

export function getMaintenanceState(): MaintenanceState {
  return { ...state };
}

export function setMaintenanceState(next: MaintenanceState): MaintenanceState {
  state = {
    enabled: next.enabled,
    message: next.message ?? "",
  };
  return getMaintenanceState();
}
