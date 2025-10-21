import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api-client';
import { Toaster, toast } from '@/components/ui/sonner';
import type { AnyUser } from '@shared/types';
import { ChangePhotoDialog } from '@/components/ChangePhotoDialog';
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
});
type ProfileFormData = z.infer<typeof profileSchema>;
const securitySchema = z.object({
  email: z.string().email('Invalid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.').or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});
type SecurityFormData = z.infer<typeof securitySchema>;
export default function ProfilePage() {
  const user = useAuth(s => s.user);
  const login = useAuth(s => s.login);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || '' },
  });
  const securityForm = useForm<SecurityFormData>({
    resolver: zodResolver(securitySchema),
    defaultValues: { email: user?.email || '', password: '', confirmPassword: '' },
  });
  const onProfileSubmit = async (data: ProfileFormData) => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      const updatedUser = await api<AnyUser>('/api/profile', {
        method: 'PUT',
        body: JSON.stringify({ ...data, id: user.id, role: user.role, photoUrl: user.photoUrl }),
      });
      login(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile.');
    } finally {
      setIsSavingProfile(false);
    }
  };
  const onSecuritySubmit = async (data: SecurityFormData) => {
    if (!user) return;
    setIsSavingSecurity(true);
    try {
      const payload = { id: user.id, role: user.role, email: data.email, password: data.password || undefined };
      const updatedUser = await api<AnyUser>('/api/profile/credentials', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });
      login(updatedUser);
      toast.success('Account credentials updated successfully!');
      securityForm.reset({ ...securityForm.getValues(), password: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to update credentials.');
    } finally {
      setIsSavingSecurity(false);
    }
  };
  const handlePhotoSave = async (data: { photoUrl: string }) => {
    if (!user) return;
    setIsSavingProfile(true);
    try {
      const updatedUser = await api<AnyUser>('/api/profile', {
        method: 'PUT',
        body: JSON.stringify({ name: user.name, id: user.id, role: user.role, photoUrl: data.photoUrl }),
      });
      login(updatedUser);
      toast.success('Profile photo updated!');
      setIsPhotoDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update photo.');
    } finally {
      setIsSavingProfile(false);
    }
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Toaster richColors position="top-center" />
      <div className="py-8 md:py-10 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Profile</h1>
          <p className="mt-2 text-lg text-muted-foreground">View and manage your account details.</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your name and profile picture.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.photoUrl} alt={user?.name} />
                  <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <Button variant="outline" onClick={() => setIsPhotoDialogOpen(true)}>Change Photo</Button>
              </div>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <FormField
                    control={profileForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input placeholder="Your full name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-brand hover:bg-brand/90" disabled={isSavingProfile}>
                      {isSavingProfile ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>Update your email and password.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                  <FormField
                    control={securityForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl><Input type="email" placeholder="your@email.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl><Input type="password" placeholder="Leave blank to keep current" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl><Input type="password" placeholder="Confirm your new password" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-brand hover:bg-brand/90" disabled={isSavingSecurity}>
                      {isSavingSecurity ? 'Saving...' : 'Update Credentials'}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      {isPhotoDialogOpen && (
        <ChangePhotoDialog
          isOpen={isPhotoDialogOpen}
          onClose={() => setIsPhotoDialogOpen(false)}
          onSave={handlePhotoSave}
          currentPhotoUrl={user?.photoUrl}
          isSaving={isSavingProfile}
        />
      )}
    </div>
  );
}