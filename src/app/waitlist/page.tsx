import React from 'react';
import { WaitListForm, NavBar } from '@/components';
import { MagicCard } from '@/components/ui/custom-magic-card';

function Page() {
  return (
    <MagicCard
        className="cursor-pointer shadow-2xl"
        gradientColor={"#262626"}
      >
            <NavBar />
            <div className='flex flex-col justify-center space-y-16 '> 
                <p className="text-3xl sm:text-5xl font-bold text-center">
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#fffefe] to-[#a1a09f]">
                    Be the first to try <span className='bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text'>SmartSnip!</span>
                    </span>
                    <span className="block bg-gradient-to-r from-[#fffefe] to-[#a1a09f] text-transparent bg-clip-text text-2xl sm:text-4xl">
                    Sign up for early access to AI-powered highlights!
                    </span>
                </p>
                <WaitListForm />
            </div>
            <div>
                <div className='flex flex-col text-sm justify-center items-center space-x-2'>
                    <p className='text-[#a1a09f]'>Boost your productivity with every click.</p>
                    <p className='text-[#a1a09f]'>Crafted by <span className='text-white underline'>@amitesh</span></p>
                </div>
            </div>

      </MagicCard>   
  )
}

export default Page
