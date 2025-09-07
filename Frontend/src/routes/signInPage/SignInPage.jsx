import { SignIn } from "@clerk/clerk-react";
import "./signInPage.css";

const SignInPage = () => {
  return (
    <div className="signInPage">
      {/* SignIn component from Clerk, used for user authentication, "path" prop specifies the sign-in route */}
      {/* signUpUrl prop specifies the sign-up route, forceRedirectUrl prop specifies the URL to redirect to after successful sign-in */}
      <SignIn path="/sign-in" signUpUrl="/sign-up" forceRedirectUrl="/dashboard"/>
    </div>
  );
};

export default SignInPage;
