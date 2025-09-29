import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const PlannerFeaturesSection = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={containerVariants}
      className="py-24 px-6 sm:px-8 lg:px-12 xl:px-16 bg-white"
    >
      <div className="max-w-4xl xl:max-w-6xl mx-auto">
        <motion.h2
          variants={itemVariants}
          className="text-3xl font-bold text-center mb-12 w-full sm:w-2/3 mx-auto"
        >
          Quickly create the events you want using our simple event creation
          page!
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16">
          {[0, 1, 2].map((index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard
                imageSrc={`/utils/landing-search${3 - index}.png`}
                title={
                  [
                    "Create Verified and Trusted Events",
                    "Manage Your Events Easily",
                    "Boost Visibility with Advanced Tools",
                  ][index]
                }
                description={
                  [
                    "Build credibility by creating events that are verified and trusted by attendees.",
                    "Use intuitive tools to edit details, track engagement, and stay in control of your event.",
                    "Promote your event and reach more people using our advanced discovery features.",
                  ][index]
                }
                linkText={["Create", "Manage", "My Events"][index]}
                linkHref={
                  ["/createEvents", "/manageEvents", "/userProfile"][index]
                }
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const FeatureCard = ({ imageSrc, title, description, linkText, linkHref }) => (
  <div className="text-center">
    <div className="p-4 rounded-lg mb-4 flex items-center justify-center h-48">
      <img
        src={imageSrc}
        className="w-full h-full object-contain"
        alt={title}
      />
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="mb-4">{description}</p>
    <Link
      to={linkHref}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="inline-block border border-gray-300 rounded px-4 py-2 hover:bg-gray-100"
    >
      {linkText}
    </Link>
  </div>
);

export default PlannerFeaturesSection;
