import api from "@/lib/axios";

const EMPTY_META = { total: 0, page: 1, limit: 20, totalPages: 0 };

export async function get(path, params) {
  const response = await api.get(path, { params });
  return response.data;
}

export async function patch(path, data) {
  const response = await api.patch(path, data);
  return response.data;
}

export async function post(path, data) {
  const response = await api.post(path, data);
  return response.data;
}

export async function put(path, data) {
  const response = await api.put(path, data);
  return response.data;
}

export async function del(path) {
  const response = await api.delete(path);
  return response.data;
}

export async function getPaginated(path, params) {
  const body = await get(path, params);
  if (body && typeof body === "object") {
    if (Array.isArray(body.items)) {
      return { items: body.items, meta: body.meta ?? EMPTY_META };
    }
    if (Array.isArray(body.data)) {
      return { items: body.data, meta: body.meta ?? EMPTY_META };
    }
  }
  if (Array.isArray(body)) {
    return {
      items: body,
      meta: { total: body.length, page: 1, limit: body.length, totalPages: 1 },
    };
  }
  return { items: [], meta: EMPTY_META };
}
