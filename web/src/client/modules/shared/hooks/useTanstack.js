import { useQuery, useMutation } from "@tanstack/react-query";
import { shouldRetryQuery } from "@/client/lib/query/retryPolicy.js";

const QUERY_OPTION_KEYS = new Set([
  "enabled",
  "staleTime",
  "gcTime",
  "refetchOnWindowFocus",
  "refetchOnMount",
  "retry",
  "placeholderData",
  "initialData",
]);

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

function splitArgs(args) {
  if (args.length === 0) return { queryArgs: args, options: {} };

  const last = args[args.length - 1];
  if (
    last &&
    typeof last === "object" &&
    !Array.isArray(last) &&
    Object.keys(last).some((key) => QUERY_OPTION_KEYS.has(key))
  ) {
    return { queryArgs: args.slice(0, -1), options: last };
  }

  return { queryArgs: args, options: {} };
}

export function createQuery(key, queryFn, ...args) {
  const { queryArgs, options } = splitArgs(args);
  const enabledByArgs = shouldEnableQuery(queryArgs);
  const enabledByOptions = options.enabled ?? true;

  return useQuery({
    queryKey: buildQueryKey(key, queryArgs),
    queryFn: () => queryFn(...queryArgs),
    enabled: enabledByArgs && enabledByOptions,
    retry: shouldRetryQuery,
    ...options,
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
