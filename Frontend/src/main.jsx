import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Homepage from "./routes/homepage/Homepage";
import DashboardPage from "./routes/dashboardPage/DashboardPage";
import ChatPage from "./routes/chatPage/ChatPage";
import RootLayout from "./layouts/rootLayout/RootLayout";
import DashboardLayout from "./layouts/dashboardLayout/DashboardLayout";

// Create a client
const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <RootLayout />, // Main layout for the application with header and authentication
    children: [
      // Define child routes
      {
        path: "/",
        element: <Homepage />,
      },
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/dashboard/chats/:id",
            element: <ChatPage />,
          },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);

// This is the main entry point of the React application
// It sets up the routing using react-router-dom and the data fetching using react-query
// It defines the routes and their corresponding components
// It uses RootLayout as the main layout and DashboardLayout for the dashboard and chat pages
// It also includes authentication routes for sign-in and sign-up pages
