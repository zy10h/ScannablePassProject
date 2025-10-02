import SideDesign from "../components/auth-side-design";
import AuthForm from "../components/forms";

const Register = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 w-screen h-screen">
      <div className="hidden lg:block">
        <SideDesign />
      </div>
      <div className="flex items-center justify-center p-4 lg:p-10">
        <div className="w-full max-w-[511px]">
          <AuthForm />
        </div>
      </div>
    </div>
  );
};

export default Register;
