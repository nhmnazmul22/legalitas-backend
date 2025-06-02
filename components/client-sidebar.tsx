"use client"

import {
  LayoutDashboard,
  FileText,
  Receipt,
  ClipboardList,
  User,
  LogOut,
  MessageSquare,
  FolderOpen,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
  {
    title: "Dashboard",
    url: "/client",
    icon: LayoutDashboard,
  },
  {
    title: "Proposal",
    url: "/client/proposal",
    icon: FileText,
  },
  {
    title: "Invoice",
    url: "/client/invoice",
    icon: Receipt,
  },
  {
    title: "Progress Pekerjaan",
    url: "/client/progress",
    icon: ClipboardList,
  },
  {
    title: "Daftar Review",
    url: "/client/reviews",
    icon: MessageSquare,
  },
  {
    title: "Brankas Legalitas",
    url: "/client/documents",
    icon: FolderOpen,
  },
]

export function ClientSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r bg-gradient-to-b from-blue-600 to-purple-600">
      <SidebarHeader className="p-6 border-b border-white/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-blue-600 font-bold text-lg">L</span>
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">Legalitas.org</h2>
            <p className="text-xs text-blue-100">Client Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-4 py-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`text-white hover:bg-white/20 transition-colors rounded-lg p-3 ${
                      pathname === item.url ? "bg-white/20 font-medium" : ""
                    }`}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      <span className="text-sm">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/20">
        <SidebarMenu className="space-y-2">
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white hover:bg-white/20 transition-colors rounded-lg p-3">
              <Link href="/client/profile" className="flex items-center gap-3">
                <User className="w-5 h-5" />
                <span className="text-sm">Profile</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="text-white hover:bg-white/20 transition-colors rounded-lg p-3">
              <Link href="/login" className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span className="text-sm">Logout</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
