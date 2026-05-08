import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

export default function BarberLayout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
