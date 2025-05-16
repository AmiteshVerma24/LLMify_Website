"use client"
import { useState, useEffect, useRef, use } from "react"
import { ChevronDown, User, LogOut, Menu, X } from "lucide-react"
import Link from "next/link"
import { useAuth } from "../AuthProvider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavBar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { user, isAuthenticated, isLoading, signIn, signOut, status } = useAuth()

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close mobile menu when screen size increases
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])
  console.log(user)

  return (
    <>
      <div className="flex justify-between items-center w-full px-4 sm:px-6 py-4 bg-black border-b border-gray-800 z-50 h-16">
        {/* Left side - Logo */}
        <div className="text-white text-lg font-bold">Chinhit</div>

        {/* Middle - Navigation Links (hidden on mobile) */}
        <div className="hidden md:flex space-x-6 text-sm">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/features" className="text-gray-400 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
            Contact
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-gray-400 hover:text-white focus:outline-none" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Right side - User Profile with Dropdown */}
        <div className="hidden md:block">
          {isLoading ? (
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse"></div>
            </div>
          ) : isAuthenticated ? (
            <div className="flex items-center">
              <DropdownMenu>
                <DropdownMenuTrigger className="text-white flex items-center space-x-2 p-2 rounded-md hover:bg-zinc-800 transition-colors">
                  {user?.image ? (
                    <img
                      src={user?.image}
                      alt="User avatar"
                      className="h-8 w-8 rounded-full bg-zinc-700"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-zinc-700"></div>
                  )}
                  <span className="hidden md:block text-sm font-medium">{user?.name}</span>
                  <ChevronDown className="h-4 w-4 text-zinc-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-zinc-800 border-zinc-700">
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-zinc-100">{user?.name}</p>
                    <p className="text-xs text-zinc-400 mt-1">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-zinc-700" />
                  <DropdownMenuItem className="hover:bg-zinc-700 cursor-pointer text-white">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="hover:bg-zinc-700 cursor-pointer text-red-400 focus:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-5 py-2 rounded-lg bg-zinc-900 text-white font-semibold 
                        border border-zinc-700 shadow-md hover:shadow-blue-500/20 
                        hover:border-blue-600 transition-all duration-200 
                        ease-in-out hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu (overlay) */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-95 pt-16">
          <div className="flex flex-col items-center p-6">
            <div className="flex flex-col items-center space-y-6 text-base mb-8">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/features"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/contact"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>

            {/* Auth for mobile menu */}
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="flex flex-col items-center">
                {user?.image ? (
                    <img
                      src={user?.image}
                      alt="User avatar"
                      className="h-8 w-8 rounded-full bg-zinc-700"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-zinc-700"></div>
                  )}
                <p className="text-white font-medium mb-1">{user?.name}</p>
                <p className="text-zinc-400 text-sm mb-4">{user?.email}</p>

                <div className="flex flex-col space-y-4 w-full">
                  <button className="flex items-center justify-center space-x-2 p-3 rounded-md bg-zinc-800 text-white hover:bg-zinc-700 transition-colors">
                    <User className="h-4 w-4" />
                    <span>Profile</span>
                  </button>
                  <button
                    onClick={() => signOut()}
                    className="flex items-center justify-center space-x-2 p-3 rounded-md bg-zinc-800 text-red-400 hover:bg-zinc-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="w-full px-5 py-3 rounded-lg bg-zinc-900 text-white font-semibold 
                          border border-zinc-700 shadow-md hover:shadow-blue-500/20 
                          hover:border-blue-600 transition-all duration-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </>
  )
}