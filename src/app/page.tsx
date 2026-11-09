import CinematicExperience from "@/components/animation/CinematicExperience";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AboutScene from "@/components/scenes/AboutScene";
import ContactScene from "@/components/scenes/ContactScene";
import EducationScene from "@/components/scenes/EducationScene";
import HeroScene from "@/components/scenes/HeroScene";
import IndiaScene from "@/components/scenes/IndiaScene";
import ProjectsScene from "@/components/scenes/ProjectsScene";

export default function Home() {
  return (
    <CinematicExperience>
      <Navbar />
      <main id="main">
        <HeroScene />
        <AboutScene />
        <EducationScene />
        <IndiaScene />
        <ProjectsScene />
        <ContactScene />
      </main>
      <Footer />
    </CinematicExperience>
  );
}
