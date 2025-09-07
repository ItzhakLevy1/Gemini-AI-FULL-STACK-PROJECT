import { Outlet, useNavigate } from "react-router-dom";
import "./dashboardLayout.css";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import ChatList from "../../components/chatList/ChatList";

const DashboardLayout = () => {
  const { userId, isLoaded } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in");
    }
  }, [isLoaded, userId, navigate]); // Added navigate to dependency array to avoid warning

  if (!isLoaded) return "Loading...";

  return (
    <div className="dashboardLayout">
      <div className="menu">
        <ChatList />  {/* Include the ChatList component in the menu section */}
      </div>
      <div className="content">
        <Outlet />  {/* Render child routes (DashboardPage or ChatPage) */}
      </div>
    </div>
  );
};

export default DashboardLayout;

// This layout is used for the dashboard page and its children routes (chat page)
// It checks if the user is authenticated using Clerk's useAuth hook
// If the user is not authenticated, it redirects to the sign-in page
// It uses Outlet to render the child routes (DashboardPage and ChatPage)
// It also includes a ChatList component in the menu section