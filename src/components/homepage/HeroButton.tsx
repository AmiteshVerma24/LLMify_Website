"use client"
import React from 'react'
import { RainbowButton } from '../ui/rainbow-button';

export function HeroButton() {
  return (
    <div className='flex flex-row justify-center space-x-8'>
        <RainbowButton className="text-md" onClick={() => { console.log("Button clicked!");}}>
            Download Now
        </RainbowButton>
        <RainbowButton className="text-md text-black bg-[linear-gradient(#fff,#fff),linear-gradient(#fff_50%,rgba(255,255,255,0.6)_80%,rgba(0,0,0,0)),linear-gradient(90deg,hsl(var(--color-1)),hsl(var(--color-5)),hsl(var(--color-3)),hsl(var(--color-4)),hsl(var(--color-2)))]" >
            Joint the waitlist!
        </RainbowButton>
    </div>
  )
}


