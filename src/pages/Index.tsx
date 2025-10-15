import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { FolderKanban, ArrowRight } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4">
          <FolderKanban className="h-10 w-10 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to TaskFlow
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A modern project management dashboard for teams. Track projects, manage tickets, 
            and collaborate in real-time with your team members.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
            Get Started
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl mx-auto">
          <div className="p-6 rounded-lg bg-card border">
            <h3 className="font-semibold mb-2">Email OTP Auth</h3>
            <p className="text-sm text-muted-foreground">
              Secure, passwordless authentication with email verification
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border">
            <h3 className="font-semibold mb-2">Real-time Updates</h3>
            <p className="text-sm text-muted-foreground">
              See ticket changes instantly across all team members
            </p>
          </div>
          <div className="p-6 rounded-lg bg-card border">
            <h3 className="font-semibold mb-2">Drag & Drop</h3>
            <p className="text-sm text-muted-foreground">
              Intuitive board interface with smooth drag-and-drop
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
