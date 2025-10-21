import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Printer, BookOpenCheck } from "lucide-react";
import { api } from '@/lib/api-client';
import type { Result, Student } from '@shared/types';
import { useAuth } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Toaster, toast } from '@/components/ui/sonner';
import { Badge } from '@/components/ui/badge';
export default function MyResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = useAuth(s => s.user) as Student | null;
  useEffect(() => {
    const fetchResults = async () => {
      if (!user) return;
      try {
        setIsLoading(true);
        const data = await api<{ items: Result[] }>(`/api/results?studentId=${user.id}`);
        setResults(data.items);
      } catch (error) {
        toast.error('Failed to fetch results.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, [user]);
  const handlePrint = () => {
    window.print();
  };
  const averageScore = results.length > 0 ? (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(2) : 'N/A';
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Toaster richColors position="top-center" />
      <div className="py-8 md:py-10 lg:py-12">
        <div className="flex items-center justify-between mb-8 print-hidden">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">My Academic Results</h1>
            <p className="mt-2 text-lg text-muted-foreground">View and print your report card.</p>
          </div>
          <Button className="bg-brand hover:bg-brand/90" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print Report
          </Button>
        </div>
        <Card id="report-card" className="print-shadow-none print-border-none">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-brand flex items-center justify-center print-hidden">
                  <BookOpenCheck className="h-7 w-7 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl">GDSS Waziri Ibrahim</CardTitle>
                  <CardDescription>Student Report Card</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.studentId}</p>
                <p className="text-sm text-muted-foreground">Class: {user?.class}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-16 ml-auto" /></TableCell>
                      <TableCell className="text-center"><Skeleton className="h-5 w-12 mx-auto" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    </TableRow>
                  ))
                ) : results.length > 0 ? (
                  results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.subject}</TableCell>
                      <TableCell className="text-right font-semibold">{result.score}</TableCell>
                      <TableCell className="text-center">{result.grade || 'N/A'}</TableCell>
                      <TableCell>{result.remarks || 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No results have been recorded for you yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          {results.length > 0 && (
            <CardFooter className="flex justify-end items-center gap-4 border-t pt-4">
              <span className="text-muted-foreground">Average Score:</span>
              <Badge variant="secondary" className="text-lg">{averageScore}</Badge>
            </CardFooter>
          )}
        </Card>
        <p className="text-center text-sm text-muted-foreground mt-6 print-hidden">
          Built with ❤️ at Cloudflare
        </p>
      </div>
    </div>
  );
}