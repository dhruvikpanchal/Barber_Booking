import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

export default function UserLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
