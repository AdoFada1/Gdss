import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, Users, UserCheck, ClipboardList, GraduationCap, UserCircle } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
const adminNavItems = [
  { href: "/dashboard/overview", label: "Overview", icon: Home },
  { href: "/dashboard/students", label: "Students", icon: Users },
  { href: "/dashboard/staff", label: "Staff", icon: UserCheck },
];
const staffNavItems = [
  { href: "/dashboard/my-students", label: "My Students", icon: GraduationCap },
  { href: "/dashboard/results", label: "Manage Results", icon: ClipboardList },
];
const studentNavItems = [
  { href: "/dashboard/my-results", label: "My Results", icon: ClipboardList },
];
const profileNavItem = { href: "/dashboard/profile", label: "My Profile", icon: UserCircle };
export function AppSidebar(): JSX.Element {
  const role = useAuth(s => s.role);
  const location = useLocation();
  const getNavItems = () => {
    switch (role) {
      case 'admin':
        return adminNavItems;
      case 'staff':
        return staffNavItems;
      case 'student':
        return studentNavItems;
      default:
        return [];
    }
  };
  const navItems = getNavItems();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <img src="https://i.imgur.com/1gJc7Rz.png" alt="School Logo" className="h-8 w-8 object-contain" />
          <span className="text-lg font-semibold font-display">AcademiaOS</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton asChild isActive={location.pathname.startsWith(item.href)}>
                <NavLink to={item.href} className={({ isActive }) => cn(isActive && "bg-accent text-accent-foreground")}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarSeparator className="my-4" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location.pathname.startsWith(profileNavItem.href)}>
              <NavLink to={profileNavItem.href} className={({ isActive }) => cn(isActive && "bg-accent text-accent-foreground")}>
                <profileNavItem.icon className="h-5 w-5" />
                <span>{profileNavItem.label}</span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}