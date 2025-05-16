"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Highlighter,
  FileText,
  Brain,
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "../AuthProvider"
import { useSidebar } from "./SidebarContext"

export default function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, setIsCollapsed, isMobileMenuOpen, setIsMobileMenuOpen, shouldShowSidebar } = useSidebar()
  const { user, isAuthenticated, isLoading, signIn, signOut, status } = useAuth()

  const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Highlights", href: "/highlights", icon: Highlighter },
    { name: "Notes", href: "/notes", icon: FileText },
    { name: "AI", href: "/ai", icon: Brain },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  const isActive = (path: string) => {
    return pathname === path
  }

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  if (!shouldShowSidebar) {
    return null
  }

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-black text-zinc-200"
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar for desktop - FIXED POSITION */}
      <div
        className={`hidden md:flex md:h-screen bg-black z-40 transition-all duration-300 ${
          isCollapsed ? "w-16" : "w-64"
        } fixed top-0 left-0`}
      >
        <div className="flex flex-col w-full border-r border-zinc-800">
          {/* Header with Logo */}
          <div className="flex items-center h-16 flex-shrink-0 px-4 bg-black border-b border-zinc-800">
            {!isCollapsed && (
              <div className="flex items-center space-x-2 flex-grow">
                <div className="h-8 w-8 rounded-full bg-violet-500 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-sky-400">
                  Chinhit
                </span>
              </div>
            )}

            {isCollapsed && (
              <div className="mx-auto">
                <div className="h-8 w-8 rounded-full bg-violet-500 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
              </div>
            )}

            {/* Collapse toggle button */}
            <button
              className={`hidden md:flex items-center justify-center p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ${
                isCollapsed ? "ml-2" : ""
              }`}
              onClick={toggleCollapse}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${
                    isActive(item.href)
                      ? "bg-zinc-800 text-white border-l-2 border-violet-500"
                      : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                  } group flex items-center ${
                    isCollapsed ? "justify-center" : "px-2"
                  } py-2 text-sm font-medium rounded-md transition-all duration-200`}
                  title={isCollapsed ? item.name : ""}
                >
                  <item.icon
                    className={`${
                      isActive(item.href) ? "text-violet-400" : "text-zinc-400 group-hover:text-zinc-300"
                    } ${isCollapsed ? "mx-auto" : "mr-3"} flex-shrink-0 h-5 w-5 transition-colors duration-200`}
                  />
                  {!isCollapsed && item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* User Profile Area */}
          <div className="flex-shrink-0 flex border-t border-zinc-800 p-4">
            {isLoading ? (
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-700 animate-pulse"></div>
              </div>
            ) : isAuthenticated ? (
              isCollapsed ? (
                <div className="mx-auto">
                  {user?.image ? (
                    <img
                      src={user?.image}
                      alt="User avatar"
                      className="h-8 w-8 rounded-full bg-zinc-700"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-zinc-700"></div>
                  )}
                </div>
              ) : (
                <div className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    <img
                      src={user?.image || "https://via.placeholder.com/150"}
                      alt="User avatar"
                      className="h-9 w-9 rounded-full bg-zinc-700"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-white">{user?.name}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-xs font-medium text-zinc-400 group-hover:text-zinc-300">View profile</p>
                        <div className="cursor-pointer" onClick={() => signOut()}>
                          <LogOut className="h-3 w-3 text-zinc-400 group-hover:text-zinc-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="w-full">
                <button
                  onClick={() => signIn()}
                  className="w-full px-3 py-1.5 rounded text-sm bg-zinc-800 text-white font-medium 
                          hover:bg-zinc-700 transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-zinc-950 bg-opacity-75" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 flex flex-col max-w-xs w-full bg-black shadow-lg z-50">
            <div className="flex items-center justify-between h-16 flex-shrink-0 px-4 bg-black border-b border-zinc-800">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-violet-500 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-500 to-sky-400">
                  Highlight AI
                </span>
              </div>
              <button
                className="rounded-md p-2 text-zinc-400 hover:text-white focus:outline-none"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 pt-5 pb-4 overflow-y-auto">
              <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`${
                      isActive(item.href)
                        ? "bg-zinc-800 text-white border-l-2 border-violet-500"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    } group flex items-center px-2 py-2 text-base font-medium rounded-md`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={`${
                        isActive(item.href) ? "text-violet-400" : "text-zinc-400 group-hover:text-zinc-300"
                      } mr-3 flex-shrink-0 h-6 w-6`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-zinc-800 p-4">
              {isLoading ? (
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse"></div>
                </div>
              ) : isAuthenticated ? (
                <div className="flex-shrink-0 w-full group block">
                  <div className="flex items-center">
                    {user?.image ? (
                    <img
                      src={user?.image}
                      alt="User avatar"
                      className="h-8 w-8 rounded-full bg-zinc-700"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-zinc-700"></div>
                  )}
                    <div className="ml-3">
                      <p className="text-base font-medium text-white">{user?.name}</p>
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-zinc-400 group-hover:text-zinc-300">View profile</p>
                        <div className="cursor-pointer" onClick={() => signOut()}>
                          <LogOut className="h-4 w-4 text-zinc-400 group-hover:text-zinc-300" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full">
                  <button
                    onClick={() => signIn()}
                    className="w-full px-3 py-2 rounded text-sm bg-zinc-800 text-white font-medium 
                            hover:bg-zinc-700 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}