"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { usePathname } from "next/navigation"

type SidebarContextType = {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
  isMobileMenuOpen: boolean
  setIsMobileMenuOpen: (value: boolean) => void
  shouldShowSidebar: boolean
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const excludedRoutes = ["/login", "/register", "/forgot-password", "/full-screen-view", "/"]

  const shouldShowSidebar = !excludedRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed")
    if (savedState) {
      setIsCollapsed(savedState === "true")
    }
  }, [])

  // Save collapsed state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isCollapsed.toString())
  }, [isCollapsed])

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        shouldShowSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider")
  }
  return context
}
