import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import Process from "@/components/Process";
import WhyMe from "@/components/WhyMe";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const Index = () => (
  <main>
    <Navbar />
    <Hero />
    <WhyMe />
    <Projects />
    <Services />
    <Process />
    <FinalCTA />
    <Footer />
  </main>
);

export default Index;