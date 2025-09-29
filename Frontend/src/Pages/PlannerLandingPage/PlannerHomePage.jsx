import React from "react";

import Footer from "../../components/adminFooter";
import PlannerHeroSection from "./PlannerHeroSection";
import PlannerFeaturesSection from "./PlannerFeaturesSection";
import PlannerDiscoverSection from "./PlannerDiscoverSection";
import PlannerCallToActionSection from "./PlannerCallToActionSection";

const PlannerHomePage = () => {
  return (
    <div>
      <PlannerHeroSection />
      <PlannerFeaturesSection />
      <PlannerDiscoverSection />
      <PlannerCallToActionSection />
      <Footer />
    </div>
  );
};

export default PlannerHomePage;
