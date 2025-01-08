"use client";
import React from 'react'
import { useState } from "react";
import { MagicCard } from '../ui/magic-card';

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
            Highlight, annotate, summarize, and engage in real-time chat—all 
            seamlessly powered by advanced AI. Revolutionize the way you interact
             with websites, capture key information, and never miss a detail again.
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
      videoSrc: "/videos/video1.mov", // Replace with your video file path
    },
    {
      id: 2,
      title: "Take and Manage Notes",
      description:
        "Take notes directly from any website, view them later, and edit with ease. Keep your ideas organized in one place.",
      videoSrc: "/videos/video2.mov", // Replace with your video file path
    },
    {
      id: 3,
      title: "Explain Text with AI",
      description:
        "Chat with AI based on the current context of the website. Get insights, suggestions, or even answers tailored to what you're viewing.",
      videoSrc: "/videos/video1.mov", // Replace with your video file path
    },
    {
      id: 4,
      title: "AI Chat for Contextual Assistance",
      description:
        "Simply drag your zooms on the timeline. All the heavy lifting is done automatically. No manual work is required.",
      videoSrc: "/videos/video2.mov", // Replace with your video file path
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
      <div className="w-3/5 flex items-center justify-center">
        <video
          key={selectedFeature.videoSrc} // Re-render video on source change
          src={selectedFeature.videoSrc}
          className="rounded-lg shadow-lg"
          autoPlay
          loop
          muted
          controls={false}
        />
      </div>
    </div>
  );
}





