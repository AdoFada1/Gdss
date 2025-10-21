import { useState, useEffect } from 'react';
import { useForm, useWatch } from 'react-hook-form';
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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Image as ImageIcon, AlertCircle } from 'lucide-react';
const photoSchema = z.object({
  photoUrl: z.string().url('Please enter a valid URL.').or(z.literal('')),
});
type PhotoFormData = z.infer<typeof photoSchema>;
interface ChangePhotoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: PhotoFormData) => void;
  currentPhotoUrl?: string;
  isSaving: boolean;
}
export function ChangePhotoDialog({ isOpen, onClose, onSave, currentPhotoUrl, isSaving }: ChangePhotoDialogProps) {
  const form = useForm<PhotoFormData>({
    resolver: zodResolver(photoSchema),
    defaultValues: {
      photoUrl: currentPhotoUrl || '',
    },
  });
  const photoUrlValue = useWatch({ control: form.control, name: 'photoUrl' });
  const [previewUrl, setPreviewUrl] = useState(currentPhotoUrl || '');
  const [isPreviewError, setIsPreviewError] = useState(false);
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const isValidUrl = z.string().url().safeParse(photoUrlValue).success;
      if (isValidUrl) {
        setPreviewUrl(photoUrlValue);
        setIsPreviewError(false);
      } else if (photoUrlValue === '') {
        setPreviewUrl('');
        setIsPreviewError(false);
      }
    }, 500); // Debounce input
    return () => clearTimeout(timeoutId);
  }, [photoUrlValue]);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Profile Photo</DialogTitle>
          <DialogDescription>
            Enter the URL of your new profile photo to see a preview.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-4 py-4">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={previewUrl}
                  alt="Profile photo preview"
                  onLoad={() => setIsPreviewError(false)}
                  onError={() => setIsPreviewError(true)}
                />
                <AvatarFallback className="bg-muted">
                  {isPreviewError ? (
                    <AlertCircle className="h-8 w-8 text-destructive" />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </AvatarFallback>
              </Avatar>
            </div>
            <FormField
              control={form.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/photo.jpg" {...field} />
                  </FormControl>
                  <FormDescription>
                    Please provide a direct link to a publicly accessible image (e.g., from Imgur, Postimages).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>
                Cancel
              </Button>
              <Button type="submit" className="bg-brand hover:bg-brand/90" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Photo'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}