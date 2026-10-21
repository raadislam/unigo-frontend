const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: BodyInit | Record<string, unknown> | null;
};

export async function apiRequest<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured.");
  }

  const headers = new Headers(options.headers);
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const body =
    options.body &&
    typeof options.body === "object" &&
    !(options.body instanceof FormData) &&
    !(options.body instanceof Blob)
      ? JSON.stringify(options.body)
      : options.body;

  const response = await fetch(
    `${API_URL.replace(/\/$/, "")}/${endpoint.replace(/^\//, "")}`,
    {
      ...options,
      headers,
      body,
    },
  );

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}.`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
