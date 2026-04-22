import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
}

export default AuthLayout;
