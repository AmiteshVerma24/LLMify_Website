"use client";
import React from 'react'
import { useState } from "react";
import { MagicCard } from '../ui/magic-card';
import HeroVideoDialog from '../ui/hero-video-dialog';

export function FeatureSection() {
  return (
    <div className='min-h-screen'>
      <FeatureSectionHeader />
      <FeatureSectionContent />
    </div>
  )
}
function FeatureSectionHeader () {
  return (
    <div className="bg-black text-white">
      <div className="container mx-auto px-32 py-12">
        <h1 className="text-4xl font-bold sm:text-5xl">
          Experience Smarter Browsing, <br /> One Click at a Time.
        </h1>
        <p className="text-lg sm:text-xl mt-4 text-gray-300">
        Highlight, take notes, and unlock AI-powered insights—all in one Chrome extension. Boost your productivity and make every click smarter!
        </p>
        
      </div>
    </div>
  );
}

function FeatureSectionContent () {
  const features = [
    {
      id: 1,
      title: "Highlight and Persist Text",
      description:
        "Easily highlight text on any website and save it for future reference. Your highlights will always be there, even when you return later.",
      videoSrc: "https://www.youtube.com/embed/npofYu_0NqU", // Replace with your video file path
    },
    {
      id: 2,
      title: "Take and Manage Notes",
      description:
        "Take notes directly from any website, view them later, and edit with ease. Keep your ideas organized in one place.",
      videoSrc: "https://www.youtube.com/embed/npofYu_0NqU",
    },
    {
      id: 3,
      title: "Explain Text with AI",
      description:
        "Chat with AI based on the current context of the website. Get insights, suggestions, or even answers tailored to what you're viewing.",
      videoSrc: "https://www.youtube.com/embed/npofYu_0NqU",
    },
    {
      id: 4,
      title: "AI Chat for Contextual Assistance",
      description:
        "Simply drag your zooms on the timeline. All the heavy lifting is done automatically. No manual work is required.",
      videoSrc: "https://www.youtube.com/embed/npofYu_0NqU",
    },
  ];

  const [selectedFeature, setSelectedFeature] = useState(features[0]);

  const handleFeatureClick = (feature: React.SetStateAction<{ id: number; title: string; description: string; videoSrc: string; }>) => {
    setSelectedFeature(feature);
  };

  return (
    <div className="flex bg-black text-white px-32 space-x-4">
      {/* Left Section */}
      <div className="w-2/5 space-y-6">
        {features.map((feature) => (
          <MagicCard
            key={feature.id}
            className={`p-4 rounded-lg cursor-pointer transition-colors duration-300 ${
              selectedFeature.id === feature.id
                ? "bg-gray-800 text-white"
                : "bg-gray-900 text-gray-400"
            }`}            
            onClick={() => handleFeatureClick(feature)}
          >
            <h2 className="text-xl font-semibold">{feature.title}</h2>
            <p className="text-sm">{feature.description}</p>
          </MagicCard>
        ))}
      </div>

      {/* Right Section */}
      {/* <div className="w-3/5 flex items-center justify-center">
        <video
          key={selectedFeature.videoSrc}
          src={selectedFeature.videoSrc}
          className="rounded-lg shadow-lg"
          autoPlay
          loop
          muted
          controls={false}
        />
      </div> */}
      <div className="relative w-3/5 flex items-center justify-center">
        <HeroVideoDialog
          className="dark:hidden block"
          animationStyle="top-in-bottom-out"
          videoSrc={selectedFeature.videoSrc}
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-light.png"
          thumbnailAlt="Hero Video"
        />
        <HeroVideoDialog
          className="hidden dark:block"
          animationStyle="top-in-bottom-out"
          videoSrc={selectedFeature.videoSrc}
          thumbnailSrc="https://startup-template-sage.vercel.app/hero-dark.png"
          thumbnailAlt="Hero Video"
        />
    </div>
    </div>
  );
}





