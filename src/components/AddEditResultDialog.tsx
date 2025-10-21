import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { Result, Student } from '@shared/types';
const resultSchema = z.object({
  studentId: z.string().min(1, 'Student is required.'),
  subject: z.string().min(2, 'Subject must be at least 2 characters.'),
  score: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.coerce
      .number({ invalid_type_error: "Score must be a number." })
      .min(0, "Score must be at least 0.")
      .max(100, "Score cannot exceed 100.")
      .optional()
  ),
  term: z.enum(['First', 'Second', 'Third']),
  session: z.string().regex(/^\d{4}\/\d{4}$/, 'Session must be in YYYY/YYYY format.'),
  grade: z.string().optional(),
  remarks: z.string().optional(),
});
type ResultFormData = z.infer<typeof resultSchema>;
interface AddEditResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ResultFormData, id?: string) => void;
  result?: Result | null;
  students: Student[];
  isSaving: boolean;
}
export function AddEditResultDialog({ isOpen, onClose, onSave, result, students, isSaving }: AddEditResultDialogProps) {
  const form = useForm<ResultFormData>({
    resolver: zodResolver(resultSchema),
    defaultValues: {
      studentId: result?.studentId || '',
      subject: result?.subject || '',
      score: result?.score ?? undefined,
      term: result?.term || 'First',
      session: result?.session || '2023/2024',
      grade: result?.grade || '',
      remarks: result?.remarks || '',
    },
  });
  useEffect(() => {
    if (isOpen) {
      form.reset({
        studentId: result?.studentId || '',
        subject: result?.subject || '',
        score: result?.score ?? undefined,
        term: result?.term || 'First',
        session: result?.session || '2023/2024',
        grade: result?.grade || '',
        remarks: result?.remarks || '',
      });
    }
  }, [result, isOpen, form]);
  const handleSave = (data: ResultFormData) => {
    onSave(data, result?.id);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{result ? 'Edit Result' : 'Add New Result'}</DialogTitle>
          <DialogDescription>
            {result ? 'Update the academic result for this student.' : 'Enter the details for the new academic result.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!!result}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {students.map(student => (
                        <SelectItem key={student.id} value={student.id}>{student.name} ({student.studentId})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Mathematics" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="score"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Score</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="85"
                        {...field}
                        value={field.value ?? ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="grade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grade (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="A" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="term"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Term</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select term" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="First">First</SelectItem>
                        <SelectItem value="Second">Second</SelectItem>
                        <SelectItem value="Third">Third</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="session"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Session</FormLabel>
                    <FormControl>
                      <Input placeholder="2023/2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Excellent work..." {...field} value={field.value ?? ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="bg-brand hover:bg-brand/90" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Result'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}