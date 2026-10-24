import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { queryClient } from "./lib/query-client";
import { Home } from "./pages/home";
import { NotFound } from "./pages/not-found";
import { Redirect } from "./pages/redirect";

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/url/not-found", element: <NotFound /> },
  { path: "/:slug", element: <Redirect /> },
  { path: "*", element: <NotFound /> },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster position="bottom-right" richColors />
    </QueryClientProvider>
  );
}
