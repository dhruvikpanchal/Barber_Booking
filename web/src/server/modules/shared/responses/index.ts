import { NextResponse } from "next/server";

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ApiResponse<T> = { success: true; data: T };

export type ApiErrorBody = {
  success: false;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string[]>;
  };
};

export type PaginatedResponse<T> = ApiResponse<T[]> & { meta: PaginationMeta };

export function ok<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status });
}

export function created<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 });
}

export function paginated<T>(
  data: T[],
  meta: PaginationMeta,
): NextResponse<PaginatedResponse<T>> {
  return NextResponse.json({ success: true, data, meta }, { status: 200 });
}
