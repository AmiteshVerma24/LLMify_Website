'use client'
import React from 'react'
import { useAuth } from '@/components/AuthProvider'
import Image from 'next/image';

function page() {
    const { user, isAuthenticated, isLoading, signIn, signOut } = useAuth();
    console.log(user, isAuthenticated, isLoading);

    return (
        <div className="flex items-center gap-4">
        
        </div>
    )
}

export default page
