export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/api-management",
    "/completions/pending",
    "/completions/approved",
    "/completions/rejected",
  ],
};
