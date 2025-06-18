'use client'
import React from 'react'
import HeroSection from '@/components/dashboard/hero-section';
import RecentActivity from '@/components/dashboard/recent-activity';

function page() {

    return (
        <div className='p-8'>
            <HeroSection/>
            <RecentActivity/>
        </div>
    )
}

export default page
