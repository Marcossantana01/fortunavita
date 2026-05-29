import "@/services/supabaseClient";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Sobrenos from "../components/Sobrenos";
import Metodologia from "../components/Metodologia";
import Especialidades from "../components/Especialidades";
import Depoimentos from "../components/Depoimentos";
import Contato from "../components/Contato";
import SocialAssistant from "../components/SocialAssistant";

function Home() {
  return (
    <>
      <Navbar />

      <Hero />
      <Sobrenos />
      <Metodologia />
      <Especialidades />
      <Depoimentos />
      <Contato />
      <SocialAssistant />
    </>
  );
}

export default Home;
