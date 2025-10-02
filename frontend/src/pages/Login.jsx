import SideDesign from "../components/auth-side-design";
import AuthForm from "../components/forms";

const Login = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 w-screen h-screen">
      <div className="hidden lg:block">
        <SideDesign />
      </div>

      <div className="flex items-center justify-center p-4">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
