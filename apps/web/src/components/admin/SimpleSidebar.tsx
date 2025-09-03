"use client"

import { useState } from 'react'
import { LayoutDashboard, Building2, Users, ShieldCheck, Settings, LogOut, Menu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { signOutAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const items = [
  {
    title: "Overview",
    url: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Projects", 
    url: "/admin/projects",
    icon: Building2,
  },
  {
    title: "Workers",
    url: "/admin/workers", 
    icon: Users,
  },
  {
    title: "Certifications",
    url: "/admin/certifications",
    icon: ShieldCheck,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

interface SimpleSidebarProps {
  children: React.ReactNode
}

export function SimpleSidebar({ children }: SimpleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const toggleSidebar = () => {
    console.log("Toggling sidebar:", !isCollapsed)
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div 
        className={`bg-white border-r transition-all duration-200 ease-linear flex flex-col ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b">
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
            <Image 
              src="/Logo BG.PNG" 
              alt="Bayside Builders Logo" 
              width={32}
              height={32}
              className="flex-shrink-0"
            />
            {!isCollapsed && (
              <span className="font-semibold text-lg">Admin</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 p-2">
          <div className={`mb-2 ${isCollapsed ? 'text-center' : ''}`}>
            {!isCollapsed && (
              <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wide">
                Navigation
              </div>
            )}
          </div>
          
          <nav className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.title}
                  href={item.url as any}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-100 transition-colors ${
                    isCollapsed ? 'justify-center' : 'gap-3'
                  }`}
                  title={isCollapsed ? item.title : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-2 border-t">
          {!isCollapsed && (
            <div className="flex items-center gap-2 px-3 py-2 mb-2">
              <Badge variant="outline" className="gap-1.5 px-2 py-1 bg-green-50 border-green-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-medium text-green-700">Live</span>
              </Badge>
            </div>
          )}
          
          <form action={signOutAction}>
            <Button 
              variant="ghost" 
              size="sm" 
              type="submit"
              className={`w-full ${isCollapsed ? 'px-2' : 'justify-start px-3'}`}
            >
              <LogOut className="h-4 w-4" />
              {!isCollapsed && <span className="ml-2">Sign Out</span>}
            </Button>
          </form>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header with Toggle */}
        <header className="flex h-16 shrink-0 items-center border-b border-gray-200 px-6 bg-white">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon" 
              onClick={toggleSidebar}
              className="h-7 w-7"
            >
              <Menu className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}