import { headers } from "next/headers";

export async function f(input, init = {}) {
  const url = process.env.NEXTAUTH_URL + input;

  return fetch(url, {
    ...init,
    cache: "no-cache", // 'force-cache' is the default in Next.js 🤦‍
    headers: headers(),
  });
}
