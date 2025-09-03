"use client"

import React from 'react'
import { LayoutDashboard, Building2, Users, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { signOutAction } from "@/app/admin/actions"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarRail
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

// Menu items for admin navigation
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
    title: "Job Sites",
    url: "/admin/job-sites",
    icon: Building2,
  },
  {
    title: "Contractors",
    url: "/admin/contractors",
    icon: Building2,
  },
  {
    title: "Workers",
    url: "/admin/workers", 
    icon: Users,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]

interface AppSidebarProps {
  children: React.ReactNode
  title?: string
}

function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center justify-start p-4">
          <Image 
            src="/Logo BG.PNG" 
            alt="Bayside Builders Logo" 
            width={96}
            height={96}
            className="flex-shrink-0"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <Link href={item.url as any}>
                        <Icon className="w-5 h-5" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <form action={signOutAction} className="p-2">
          <Button 
            variant="ghost" 
            size="sm" 
            type="submit"
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4" />
            <span className="ml-2 group-data-[collapsible=icon]:hidden">Sign Out</span>
          </Button>
        </form>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

export function AppSidebar({ children, title = "Dashboard" }: AppSidebarProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop: Fixed Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow bg-gray-50">
          <div className="flex items-start justify-start p-4">
            <Image 
              src="/Logo BG.PNG" 
              alt="Bayside Builders Logo" 
              width={128}
              height={128}
              className="flex-shrink-0"
            />
          </div>
          
          <nav className="flex-1 px-4 pb-4 space-y-1">
            {items.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.title}
                  href={item.url as any}
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900"
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.title}
                </Link>
              )
            })}
          </nav>
          
          <div className="p-4">
            <form action={signOutAction}>
              <Button 
                variant="ghost" 
                size="sm" 
                type="submit"
                className="w-full justify-start"
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-2">Sign Out</span>
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Mobile: Slide-out Sidebar */}
      <div className="md:hidden">
        <SidebarProvider>
          <AdminSidebar collapsible="offcanvas" className="w-32" />
          <SidebarInset>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="bg-white rounded-lg shadow-lg border p-6">
                <div className="flex items-center gap-2 mb-6">
                  <SidebarTrigger className="-ml-1" />
                  <h1 className="text-xl font-semibold">{title}</h1>
                </div>
                {children}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>

      {/* Desktop: Main Content */}
      <div className="hidden md:flex md:flex-1 md:flex-col">
        <div className="flex flex-1 flex-col p-2">
          <div className="bg-white rounded-lg shadow-lg border p-6">
            <h1 className="text-xl font-semibold mb-6">{title}</h1>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}