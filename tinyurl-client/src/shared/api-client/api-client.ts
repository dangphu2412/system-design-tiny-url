const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000';

export async function doRequest(url: string, options: RequestInit) {
  const response = await fetch(`${BACKEND_URL}/${url}`, options);

  return await response.json();
}
