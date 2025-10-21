import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, BookCopy } from "lucide-react";
import { api } from '@/lib/api-client';
import type { Student, Staff } from '@shared/types';
import { Skeleton } from '@/components/ui/skeleton';
export default function DashboardOverviewPage() {
  const [studentCount, setStudentCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [studentsData, staffData] = await Promise.all([
          api<{ items: Student[] }>('/api/students'),
          api<{ items: Staff[] }>('/api/staff'),
        ]);
        setStudentCount(studentsData.items.length);
        setStaffCount(staffData.items.length);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);
  const stats = [
    { title: "Total Students", value: studentCount, icon: <Users className="h-6 w-6 text-brand" />, loading: isLoading },
    { title: "Total Staff", value: staffCount, icon: <UserCheck className="h-6 w-6 text-brand" />, loading: isLoading },
    { title: "Classes", value: "3", icon: <BookCopy className="h-6 w-6 text-brand" />, loading: false }, // Classes are static for now
  ];
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8 md:py-10 lg:py-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Welcome back! Here's an overview of GDSS Waziri Ibrahim.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat, index) => (
              <Card key={index} className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  {stat.icon}
                </CardHeader>
                <CardContent>
                  {stat.loading ? (
                    <Skeleton className="h-10 w-24 mt-1" />
                  ) : (
                    <div className="text-4xl font-bold">{stat.value}</div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No recent activity to display.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>School Announcements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">No announcements at this time.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}