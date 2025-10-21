import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster, toast } from '@/components/ui/sonner';
import { useAuth } from '@/lib/auth';
import { api } from '@/lib/api-client';
import type { AnyUser, UserRole } from '@shared/types';
const MOCK_CREDENTIALS = {
  admin: { email: 'admin@gdss.com', password: 'password' },
  staff: { email: 'staff@gdss.com', password: 'password' },
  student: { email: 'student@gdss.com', password: 'password' },
};
export default function LoginPage() {
  const [role, setRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState(MOCK_CREDENTIALS.admin.email);
  const [password, setPassword] = useState(MOCK_CREDENTIALS.admin.password);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const login = useAuth(s => s.login);
  const navigate = useNavigate();
  const handleRoleChange = (value: string) => {
    const newRole = value as UserRole;
    setRole(newRole);
    setEmail(MOCK_CREDENTIALS[newRole].email);
    setPassword(MOCK_CREDENTIALS[newRole].password);
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = await api<AnyUser>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password, role }),
      });
      login(user);
      toast.success(`Welcome, ${user.name}!`);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      toast.error('Login failed. Please check your credentials.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <Toaster richColors position="top-center" />
      <div className="w-full max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3 text-2xl font-bold font-display text-foreground">
            <img src="https://i.imgur.com/1gJc7Rz.png" alt="School Logo" className="h-12 w-12 object-contain" />
            AcademiaOS
          </div>
        </div>
        <Card className="shadow-soft animate-fade-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Welcome Back!</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={role} onValueChange={handleRoleChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="staff">Staff</TabsTrigger>
                <TabsTrigger value="student">Student</TabsTrigger>
              </TabsList>
              <TabsContent value={role} asChild>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 h-full px-3"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-brand hover:bg-brand/90" disabled={isLoading}>
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Built with ❤️ at Cloudflare
        </p>
      </div>
    </div>
  );
}