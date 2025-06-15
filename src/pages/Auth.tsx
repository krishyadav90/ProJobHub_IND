import * as React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { MovingBackground } from "@/components/MovingBackground";
import { supabase } from "@/integrations/supabase/client";

type Mode = "login" | "signup" | "forgot-password";

export default function AuthPage() {
  const { login, signup, fullName, session, user, loading } = useAuth();
  const [mode, setMode] = React.useState<Mode>("login");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [myName, setMyName] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (session && user) {
      // Get the previous location or default to home
      const from = (location.state as any)?.from?.pathname || "/";
      navigate(from, { replace: true });
    }
    // eslint-disable-next-line
  }, [session, user]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({ title: "Email required", variant: "destructive" });
      return;
    }
    
    setSubmitting(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    });
    
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ 
        title: "Reset email sent", 
        description: "Check your email for password reset instructions." 
      });
      setMode("login");
    }
    setSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === "forgot-password") {
      return handleForgotPassword(e);
    }
    
    setSubmitting(true);
    if (mode === "login") {
      const { error } = await login(email, password);
      if (error) {
        toast({ title: "Login failed", description: error, variant: "destructive" });
      } else {
        toast({ title: `Welcome back`, description: "You are logged in!" });
        const from = (location.state as any)?.from?.pathname || "/";
        navigate(from, { replace: true });
      }
    } else {
      // signup
      if (!myName.trim()) {
        toast({ title: "Full name required", variant: "destructive" }); setSubmitting(false); return;
      }
      const { error } = await signup(email, password, myName.trim());
      if (error) {
        toast({ title: "Registration failed", description: error, variant: "destructive" });
      } else {
        toast({
          title: `Welcome, ${myName.split(" ")[0]}!`,
          description: "Your account has been created. Please verify your email and log in.",
        });
        setMode("login");
      }
    }
    setSubmitting(false);
  };

  const getTitle = () => {
    switch (mode) {
      case "login": return "Login";
      case "signup": return "Register";
      case "forgot-password": return "Reset Password";
    }
  };

  const getButtonText = () => {
    if (submitting) {
      switch (mode) {
        case "login": return "Logging in...";
        case "signup": return "Creating account...";
        case "forgot-password": return "Sending email...";
      }
    }
    switch (mode) {
      case "login": return "Login";
      case "signup": return "Create account";
      case "forgot-password": return "Send reset email";
    }
  };

  return (
    <>
      <MovingBackground />
      <div className="min-h-screen flex justify-center items-center px-3 relative z-10">
        <form className="gradient-card rounded-lg shadow-2xl max-w-md w-full p-7 flex flex-col gap-5" onSubmit={handleSubmit}>
          <h2 className="font-bold text-2xl text-center text-white">{getTitle()}</h2>
          
          <Input
            type="email"
            required
            placeholder="Email address"
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="bg-white/90 backdrop-blur-sm"
          />
          
          {mode !== "forgot-password" && (
            <Input
              type="password"
              required
              placeholder="Password"
              value={password}
              autoComplete="current-password"
              onChange={e => setPassword(e.target.value)}
              className="bg-white/90 backdrop-blur-sm"
            />
          )}
          
          {mode === "signup" && (
            <Input
              type="text"
              required
              placeholder="Full Name"
              value={myName}
              onChange={e => setMyName(e.target.value)}
              autoComplete="name"
              className="bg-white/90 backdrop-blur-sm"
            />
          )}
          
          <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600" disabled={submitting}>
            {getButtonText()}
          </Button>
          
          <div className="text-center text-sm text-gray-200 space-y-2">
            {mode === "login" && (
              <>
                <div>
                  Don&apos;t have an account?{" "}
                  <button className="text-blue-200 font-medium hover:text-blue-100" type="button" onClick={() => setMode("signup")}>Register</button>
                </div>
                <div>
                  <button className="text-blue-200 font-medium hover:text-blue-100" type="button" onClick={() => setMode("forgot-password")}>
                    Forgot password?
                  </button>
                </div>
              </>
            )}
            {mode === "signup" && (
              <div>
                Already have an account?{" "}
                <button className="text-blue-200 font-medium hover:text-blue-100" type="button" onClick={() => setMode("login")}>Login</button>
              </div>
            )}
            {mode === "forgot-password" && (
              <div>
                Remember your password?{" "}
                <button className="text-blue-200 font-medium hover:text-blue-100" type="button" onClick={() => setMode("login")}>Back to login</button>
              </div>
            )}
          </div>
          
          {/* Back to Homepage Link */}
          <div className="text-center pt-4 border-t border-white/20">
            <button 
              type="button"
              onClick={() => navigate("/")}
              className="text-white/70 hover:text-white text-sm underline"
            >
              ← Back to Homepage
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
