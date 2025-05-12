"use client"

import type React from "react"
import { NavBar } from "@/components"
import Sidebar from "@/components/global/SideBar"
import { useSidebar } from "@/components/global/SidebarContext"

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const { shouldShowSidebar, isCollapsed } = useSidebar()

  // Calculate the margin based on sidebar visibility and collapsed state
  const getMarginClass = () => {
    if (!shouldShowSidebar) return ""
    return isCollapsed ? "md:ml-16" : "md:ml-64"
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar is conditionally rendered but doesn't affect layout */}
      <Sidebar />

      {/* Main content area - adjusts width based on sidebar presence AND collapsed state */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${getMarginClass()}`}>
        <NavBar />
        <main className="flex-1" style={{ minHeight: "calc(100vh - 4rem)" }}>
          {children}
        </main>
      </div>
    </div>
  )
}
