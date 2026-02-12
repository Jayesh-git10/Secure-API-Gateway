import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { motion } from "framer-motion";
import { Loader2, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import * as z from "zod";

// Schema for login (no role)
const loginSchema = insertUserSchema.omit({ role: true });
// Schema for register (allow role selection for demo purposes, or default to user)
const registerSchema = insertUserSchema;

export default function AuthPage() {
  const { login, register, token } = useAuth();
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  // Redirect if already logged in
  if (token) {
    setLocation("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-muted/40 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "out" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">TaskMaster Pro</h1>
          <p className="text-muted-foreground mt-2">Manage your team's tasks efficiently.</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

function LoginForm() {
  const { login } = useAuth();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    login.mutate(data, {
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: err.message,
        });
      },
    });
  };

  return (
    <Card className="border-border/50 shadow-xl shadow-black/5">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              placeholder="Enter your username" 
              {...form.register("username")} 
              className="focus-visible:ring-primary"
            />
            {form.formState.errors.username && (
              <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              {...form.register("password")} 
              className="focus-visible:ring-primary"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 transition-all duration-200" disabled={login.isPending}>
            {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign In
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function RegisterForm() {
  const { register } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", password: "", role: "user" },
  });

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    register.mutate(data, {
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: err.message,
        });
      },
    });
  };

  return (
    <Card className="border-border/50 shadow-xl shadow-black/5">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Get started with TaskMaster Pro today.</CardDescription>
      </CardHeader>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reg-username">Username</Label>
            <Input 
              id="reg-username" 
              placeholder="Choose a username" 
              {...form.register("username")} 
              className="focus-visible:ring-primary"
            />
            {form.formState.errors.username && (
              <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="reg-password">Password</Label>
            <Input 
              id="reg-password" 
              type="password" 
              placeholder="Create a password" 
              {...form.register("password")} 
              className="focus-visible:ring-primary"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label>Role (For Demo)</Label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input 
                  type="radio" 
                  value="user" 
                  {...form.register("role")} 
                  className="accent-primary"
                />
                User
              </label>
              <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input 
                  type="radio" 
                  value="admin" 
                  {...form.register("role")} 
                  className="accent-primary"
                />
                Admin
              </label>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 transition-all duration-200" disabled={register.isPending}>
            {register.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
