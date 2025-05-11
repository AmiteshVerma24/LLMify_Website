'use client'
import React from 'react'
import { useAuth } from '@/components/AuthProvider'
import HeroSection from '@/components/dashboard/hero-section';
import Sidebar from '@/components/global/SideBar';
import RecentActivity from '@/components/dashboard/recent-activity';

function page() {
    const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();

    return (
        <div className='p-8'>
            <HeroSection/>
            <RecentActivity/>
        </div>
    )
}

export default page
