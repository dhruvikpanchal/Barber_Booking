import Navbar from '../components/common/navbar.jsx';
import Footer from '../components/common/footer.jsx';
import { Outlet } from 'react-router-dom';

function UserLayout() {
  return (
    <div className="w-full">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default UserLayout;
