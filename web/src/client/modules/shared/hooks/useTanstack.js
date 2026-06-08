import { useQuery, useMutation } from "@tanstack/react-query";

function buildQueryKey(key, args) {
  return args.length > 0 ? [key, ...args] : [key];
}

function shouldEnableQuery(args) {
  if (args.length === 0) return true;

  const first = args[0];
  if (typeof first === "string" || typeof first === "number") {
    return first !== "" && first != null;
  }

  return true;
}

export function createQuery(key, queryFn, ...args) {
  return useQuery({
    queryKey: buildQueryKey(key, args),
    queryFn: () => queryFn(...args),
    enabled: shouldEnableQuery(args),
  });
}

export function createMutation(key, mutationFn, ...boundArgs) {
  return useMutation({
    mutationKey: [key],
    mutationFn:
      boundArgs.length === 0
        ? (variables) =>
            variables !== undefined ? mutationFn(variables) : mutationFn()
        : () => mutationFn(...boundArgs),
  });
}
