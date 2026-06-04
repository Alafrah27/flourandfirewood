import Navbar from "../components/navbar"
import HeroSection from "../components/herosection"
import RandomMenu from "../components/RandomMenu"
import BookingSection from "../components/BookingSection"
import Footer from "../components/Footer"

export default function Home() {
  return (
    <div className=" w-full min-h-screen bg-background flex flex-col  font-sans ">
      <Navbar />
      <HeroSection />
      <RandomMenu />
      <BookingSection />
      <Footer />
    </div>
  );
}
