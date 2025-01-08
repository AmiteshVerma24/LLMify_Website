import { MagicCard } from '@/components/ui/custom-magic-card';
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import AnimatedShinyText from '../ui/animated-shiny-text';
import { HeroButton } from './HeroButton';
import React from 'react'

export function Hero() {
  return (
    <MagicCard
            className="cursor-pointer shadow-2xl"
            gradientColor={"#262626"}
    >
        <div className='flex flex-col justify-center items-center space-y-16 '>
            <div className="z-10 flex  items-center justify-center ">
            <div
                className={cn(
                "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800",
                )}
            >
                    <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
                    <span>✨ Introducing SmartSnip</span>
                    <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
                </AnimatedShinyText>
            </div>
            </div>   
            <div className='flex flex-col justify-center space-y-8 w-2/3'> 
                <p className="text-3xl sm:text-7xl font-bold text-center">
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#fffefe] to-[#a1a09f] block">
                    Simplify Your Browsing 
                    </span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#fffefe] to-[#a1a09f] block">
                        with <span className='bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text'>SmartSnip!</span>
                    </span>
                </p>
                <span className="block bg-gradient-to-r from-[#fffefe] to-[#a1a09f] text-transparent bg-clip-text text-2xl sm:text-2xl text-center">
                    Highlight, take notes, and get AI-powered insights—all in one Chrome extension. Boost your productivity and make every click count!
                </span>
            </div>
            <HeroButton />
        </div>
        

    </MagicCard>   
  )
}


