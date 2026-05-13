import UserHeader from '@/components/common/UserHeader.jsx';
import UserSidebar from '@/components/common/UserSidebar.jsx';

export default function UserLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#131313]">
      <UserHeader />
      <UserSidebar />
      <main className="pt-[65px] lg:ml-[260px] min-h-screen bg-[#131313]">{children}</main>
    </div>
  );
}
