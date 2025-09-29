import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const PlannerDiscoverSection = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={containerVariants}
      className="py-12 bg-white mb-16"
    >
      <div className="max-w-6xl xl:max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <motion.div variants={itemVariants} className="my-12 text-center">
          <h2 className="text-3xl font-semibold leading-tight text-gray-800">
            How do i create an event?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Here is a simple guide to create am event.
          </p>
          <p className="mt-2 text-gray-500 max-w-3xl mx-auto">100% secure</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 xl:gap-16 text-center">
          {[
            {
              imageSrc: "/utils/landing-icon-wand.png",
              title: "Choose event name",
              description:
                "The first step is to choose the name of the event you want to create, and this name should be unique and not similar to any other event.",
            },
            {
              imageSrc: "/utils/landing-icon-calendar.png",
              title: "Choose event date",
              description:
                "Choose the date of the event, and this date should be suitable for you and the attendees, and you can choose the time as well.",
            },
            {
              imageSrc: "/utils/landing-icon-heart.png",
              title: "Choose event location",
              description:
                "Choose the location of the event, and your event is now ready to be created.",
            },
          ].map((card, index) => (
            <motion.div key={index} variants={itemVariants}>
              <DiscoverCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const DiscoverCard = ({ imageSrc, title, description }) => (
  <div className="px-4 py-12 shadow-lg rounded-lg bg-primary-50 md:h-72">
    <div className="bg-navyBlue p-[0.6rem] rounded-full mb-4 h-10 w-10 mx-auto">
      <img src={imageSrc} className="w-full h-full" alt={title} />
    </div>
    <h3 className="mt-4 text-xl font-medium text-gray-800">{title}</h3>
    <p className="mt-2 text-base text-gray-500">{description}</p>
  </div>
);

export default PlannerDiscoverSection;
