import type { NextRequest } from "next/server";
import { ZodError, type ZodType } from "zod";
import { ValidationError } from "@/server/modules/shared/helpers/AppError";

function zodIssuesToFields(err: ZodError): Record<string, string[]> {
  const fields: Record<string, string[]> = {};
  for (const issue of err.issues) {
    const key = issue.path.join(".") || "_root";
    if (!fields[key]) fields[key] = [];
    fields[key].push(issue.message);
  }
  return fields;
}

function validateSchema<T>(data: unknown, schema: ZodType<T>): T {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      throw new ValidationError("Validation failed", zodIssuesToFields(err));
    }
    throw err;
  }
}

export async function parseBody<T>(req: NextRequest, schema: ZodType<T>): Promise<T> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ValidationError("Request body must be valid JSON");
  }
  return validateSchema(body, schema);
}

/** POST/PATCH with optional body — treats empty body as `{}` */
export async function parseBodyOrEmpty<T>(
  req: NextRequest,
  schema: ZodType<T>,
  emptyValue: T,
): Promise<T> {
  const text = await req.text();
  if (!text.trim()) return emptyValue;
  try {
    return validateSchema(JSON.parse(text) as unknown, schema);
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new ValidationError("Request body must be valid JSON");
    }
    throw err;
  }
}

export function parseQuery<T>(searchParams: URLSearchParams, schema: ZodType<T>): T {
  return validateSchema(Object.fromEntries(searchParams.entries()), schema);
}
