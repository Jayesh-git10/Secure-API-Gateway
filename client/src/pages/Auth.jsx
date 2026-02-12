function _extends() {return _extends = Object.assign ? Object.assign.bind() : function (n) {for (var e = 1; e < arguments.length; e++) {var t = arguments[e];for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);}return n;}, _extends.apply(null, arguments);}import { Button } from "@/components/ui/button";
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

  return (/*#__PURE__*/
    React.createElement("div", { className: "min-h-screen w-full flex items-center justify-center bg-muted/40 p-4" }, /*#__PURE__*/

    React.createElement("div", { className: "absolute inset-0 -z-10 overflow-hidden" }, /*#__PURE__*/
    React.createElement("div", { className: "absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-3xl" }), /*#__PURE__*/
    React.createElement("div", { className: "absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-3xl" })
    ), /*#__PURE__*/

    React.createElement(motion.div, {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, ease: "out" },
      className: "w-full max-w-md" }, /*#__PURE__*/

    React.createElement("div", { className: "text-center mb-8" }, /*#__PURE__*/
    React.createElement("div", { className: "inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4" }, /*#__PURE__*/
    React.createElement(ShieldCheck, { className: "w-8 h-8 text-primary" })
    ), /*#__PURE__*/
    React.createElement("h1", { className: "text-3xl font-display font-bold tracking-tight text-foreground" }, "TaskMaster Pro"), /*#__PURE__*/
    React.createElement("p", { className: "text-muted-foreground mt-2" }, "Manage your team's tasks efficiently.")
    ), /*#__PURE__*/

    React.createElement(Tabs, { defaultValue: "login", className: "w-full" }, /*#__PURE__*/
    React.createElement(TabsList, { className: "grid w-full grid-cols-2 mb-4" }, /*#__PURE__*/
    React.createElement(TabsTrigger, { value: "login" }, "Login"), /*#__PURE__*/
    React.createElement(TabsTrigger, { value: "register" }, "Register")
    ), /*#__PURE__*/

    React.createElement(TabsContent, { value: "login" }, /*#__PURE__*/
    React.createElement(LoginForm, null)
    ), /*#__PURE__*/

    React.createElement(TabsContent, { value: "register" }, /*#__PURE__*/
    React.createElement(RegisterForm, null)
    )
    )
    )
    ));

}

function LoginForm() {
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" }
  });

  const onSubmit = (data) => {
    login.mutate(data, {
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: err.message
        });
      }
    });
  };

  return (/*#__PURE__*/
    React.createElement(Card, { className: "border-border/50 shadow-xl shadow-black/5" }, /*#__PURE__*/
    React.createElement(CardHeader, null, /*#__PURE__*/
    React.createElement(CardTitle, null, "Welcome back"), /*#__PURE__*/
    React.createElement(CardDescription, null, "Enter your credentials to access your account.")
    ), /*#__PURE__*/
    React.createElement("form", { onSubmit: form.handleSubmit(onSubmit) }, /*#__PURE__*/
    React.createElement(CardContent, { className: "space-y-4" }, /*#__PURE__*/
    React.createElement("div", { className: "space-y-2" }, /*#__PURE__*/
    React.createElement(Label, { htmlFor: "username" }, "Username"), /*#__PURE__*/
    React.createElement(Input, _extends({
      id: "username",
      placeholder: "Enter your username" },
    form.register("username"), {
      className: "focus-visible:ring-primary" })
    ),
    form.formState.errors.username && /*#__PURE__*/
    React.createElement("p", { className: "text-sm text-destructive" }, form.formState.errors.username.message)

    ), /*#__PURE__*/
    React.createElement("div", { className: "space-y-2" }, /*#__PURE__*/
    React.createElement(Label, { htmlFor: "password" }, "Password"), /*#__PURE__*/
    React.createElement(Input, _extends({
      id: "password",
      type: "password",
      placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" },
    form.register("password"), {
      className: "focus-visible:ring-primary" })
    ),
    form.formState.errors.password && /*#__PURE__*/
    React.createElement("p", { className: "text-sm text-destructive" }, form.formState.errors.password.message)

    )
    ), /*#__PURE__*/
    React.createElement(CardFooter, null, /*#__PURE__*/
    React.createElement(Button, { type: "submit", className: "w-full bg-primary hover:bg-primary/90 transition-all duration-200", disabled: login.isPending },
    login.isPending && /*#__PURE__*/React.createElement(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Sign In"

    )
    )
    )
    ));

}

function RegisterForm() {
  const { register } = useAuth();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { username: "", password: "", role: "user" }
  });

  const onSubmit = (data) => {
    register.mutate(data, {
      onError: (err) => {
        toast({
          variant: "destructive",
          title: "Registration Failed",
          description: err.message
        });
      }
    });
  };

  return (/*#__PURE__*/
    React.createElement(Card, { className: "border-border/50 shadow-xl shadow-black/5" }, /*#__PURE__*/
    React.createElement(CardHeader, null, /*#__PURE__*/
    React.createElement(CardTitle, null, "Create an account"), /*#__PURE__*/
    React.createElement(CardDescription, null, "Get started with TaskMaster Pro today.")
    ), /*#__PURE__*/
    React.createElement("form", { onSubmit: form.handleSubmit(onSubmit) }, /*#__PURE__*/
    React.createElement(CardContent, { className: "space-y-4" }, /*#__PURE__*/
    React.createElement("div", { className: "space-y-2" }, /*#__PURE__*/
    React.createElement(Label, { htmlFor: "reg-username" }, "Username"), /*#__PURE__*/
    React.createElement(Input, _extends({
      id: "reg-username",
      placeholder: "Choose a username" },
    form.register("username"), {
      className: "focus-visible:ring-primary" })
    ),
    form.formState.errors.username && /*#__PURE__*/
    React.createElement("p", { className: "text-sm text-destructive" }, form.formState.errors.username.message)

    ), /*#__PURE__*/
    React.createElement("div", { className: "space-y-2" }, /*#__PURE__*/
    React.createElement(Label, { htmlFor: "reg-password" }, "Password"), /*#__PURE__*/
    React.createElement(Input, _extends({
      id: "reg-password",
      type: "password",
      placeholder: "Create a password" },
    form.register("password"), {
      className: "focus-visible:ring-primary" })
    ),
    form.formState.errors.password && /*#__PURE__*/
    React.createElement("p", { className: "text-sm text-destructive" }, form.formState.errors.password.message)

    ), /*#__PURE__*/
    React.createElement("div", { className: "space-y-2" }, /*#__PURE__*/
    React.createElement(Label, null, "Role (For Demo)"), /*#__PURE__*/
    React.createElement("div", { className: "flex gap-4" }, /*#__PURE__*/
    React.createElement("label", { className: "flex items-center gap-2 text-sm font-medium cursor-pointer" }, /*#__PURE__*/
    React.createElement("input", _extends({
      type: "radio",
      value: "user" },
    form.register("role"), {
      className: "accent-primary" })
    ), "User"

    ), /*#__PURE__*/
    React.createElement("label", { className: "flex items-center gap-2 text-sm font-medium cursor-pointer" }, /*#__PURE__*/
    React.createElement("input", _extends({
      type: "radio",
      value: "admin" },
    form.register("role"), {
      className: "accent-primary" })
    ), "Admin"

    )
    )
    )
    ), /*#__PURE__*/
    React.createElement(CardFooter, null, /*#__PURE__*/
    React.createElement(Button, { type: "submit", className: "w-full bg-primary hover:bg-primary/90 transition-all duration-200", disabled: register.isPending },
    register.isPending && /*#__PURE__*/React.createElement(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Create Account"

    )
    )
    )
    ));

}