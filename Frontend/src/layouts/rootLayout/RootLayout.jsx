import "./rootLayout.css";
import { Link, Outlet } from "react-router-dom";
// import {
//   ClerkProvider,
//   SignedIn,
//   SignedOut,
//   SignInButton,
//   UserButton,
// } from "@clerk/clerk-react";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const RootLayout = () => {
  return (
    // <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
    <div className="rootLayout">
      {" "}
      {/*  Main container for the layout to be used as a navbar */}
      <header>
        <Link to="/" className="logo">
          <img src="/logo.png" alt="logo" />
          <span>LEVY'S AI</span>
        </Link>
        <div className="user">
          {/* <SignedIn> */}
          {/* <UserButton /> */}
          {/* </SignedIn> */}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
    // </ClerkProvider>
  );
};

export default RootLayout;

// This layout is used as the main layout for the application
// It includes a header with a logo and user authentication buttons
// It uses ClerkProvider to provide authentication context to the app
// It uses Outlet to render the child routes
// It conditionally shows the UserButton when the user is signed in
// and a SignInButton when the user is signed out
