import { headers } from "next/headers";

export async function f(input, init = {}) {
  const url = process.env.NEXTAUTH_URL + input;

  return fetch(url, {
    ...init,
    headers: headers(),
  });
}
