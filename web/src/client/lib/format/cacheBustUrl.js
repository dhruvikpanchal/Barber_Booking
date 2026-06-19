export function cacheBustUrl(url) {
  if (!url || url.startsWith("blob:")) return url;
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${Date.now()}`;
}

export function stripCacheBust(url) {
  if (!url || typeof url !== "string") return url ?? null;
  return url.split("?")[0] || null;
}
