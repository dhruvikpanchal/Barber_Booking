import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// loader
import { Loader } from '../components/UI/loader.jsx';
import NotFound from '../components/common/NotFound.jsx';

// layouts
import PublicLayout from '../layouts/publicLayout.jsx';
import AdminLayout from '../layouts/adminLayout.jsx';
import AuthLayout from '../layouts/authLayout.jsx';
import BarberLayout from '../layouts/barberLayout.jsx';
import UserLayout from '../layouts/userLaayout.jsx';

// public routes
const Home = lazy(() => import('../components/common/home.jsx'));
const About = lazy(() => import('../modules/public/about.jsx'));
const Contact = lazy(() => import('../modules/public/contact.jsx'));

// auth routes
const Login = lazy(() => import('../modules/auth/login.jsx'));
const Register = lazy(() => import('../modules/auth/register.jsx'));
const ForgotPassword = lazy(() => import('../modules/auth/ForgotPassword.jsx'));
const VerifyEmail = lazy(() => import('../modules/auth/verifyEmail.jsx'));
const ResetPassword = lazy(() => import('../modules/auth/resetPassword.jsx'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        {/* public Layout*/}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* auth Layout*/}
        <Route element={<AuthLayout />}>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forget-password" element={<ForgotPassword />} />
          <Route path="/auth/forget-password/verify-email" element={<VerifyEmail />} />
          <Route path="/auth/forget-password/reset-password" element={<ResetPassword />} />
        </Route>

        {/* admin Layout*/}
        <Route element={<AdminLayout />}>{/* <Route path="/admin" element={<Admin />} /> */}</Route>

        {/* barber Layout*/}
        <Route element={<BarberLayout />}>
          {/* <Route path="/barber" element={<Barber />} /> */}
        </Route>

        {/* user Layout*/}
        <Route element={<UserLayout />}>{/* <Route path="/user" element={<User />} /> */}</Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
