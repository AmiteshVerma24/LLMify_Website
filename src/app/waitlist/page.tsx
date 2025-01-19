import React from "react";
import { WaitListForm } from "@/components";
import { MagicCard } from "@/components/ui/custom-magic-card";

function Page() {
  return (
    <MagicCard
      className="cursor-pointer shadow-2xl p-6 sm:p-8 lg:p-12"
      gradientColor={"#262626"}
    >
      <div className="flex flex-col justify-center space-y-12 md:space-y-16 px-4 sm:px-8 lg:px-16 xl:px-24">
        {/* Header Section */}
        <p className="text-center">
          <span className="text-3xl sm:text-5xl font-bold block text-transparent bg-clip-text bg-gradient-to-b from-[#fffefe] to-[#a1a09f]">
            Be the first to experience{" "}
            <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
              SmartSnip!
            </span>
          </span>
          <span className="block mt-4 text-2xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-[#fffefe] to-[#a1a09f]">
            Sign up now for early access and transform
            <br className="hidden sm:block" />
            your browsing with AI-powered tools!
          </span>
        </p>

        {/* WaitListForm Section */}
        <WaitListForm />
      </div>

      {/* Footer Section */}
      <div className="absolute bottom-4 w-full px-4">
        <div className="flex flex-col items-center space-y-1 text-center">
          <p className="text-sm text-[#a1a09f]">
            Boost your productivity with every click.
          </p>
          <a
            className="text-[#a1a09f] hover:text-white transition-colors"
            href="https://x.com/AmitesH2419"
            target="new"
          >
            Crafted by{" "}
            <span className="text-white underline decoration-dotted">
              @amitesh
            </span>
          </a>
        </div>
      </div>
    </MagicCard>
  );
}

export default Page;
