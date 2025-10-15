import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, Project, Ticket } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { CreateTicketDialog } from "@/components/CreateTicketDialog";
import { TicketBoard } from "@/components/TicketBoard";
import { SuperUserToggle } from "@/components/SuperUserToggle";
import { useToast } from "@/hooks/use-toast";

const ProjectBoard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { user, loading: authLoading } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [superUserMode, setSuperUserMode] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user && projectId) {
      fetchProject();
      fetchTickets();

      // Subscribe to real-time ticket updates
      const channel = supabase
        .channel('tickets-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tickets',
            filter: `project_id=eq.${projectId}`
          },
          (payload) => {
            console.log('Ticket change:', payload);
            fetchTickets();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, projectId]);

  const fetchProject = async () => {
    if (!projectId) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      setProject(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchTickets = async () => {
    if (!projectId) return;

    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          creator:profiles!tickets_creator_id_fkey(*),
          updater:profiles!tickets_updater_id_fkey(*)
        `)
        .eq('project_id', projectId)
        .order('position', { ascending: true });

      if (error) throw error;
      setTickets(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTicketUpdate = async (ticketId: string, updates: Partial<Ticket>) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tickets')
        .update({
          ...updates,
          updater_id: user.id,
        })
        .eq('id', ticketId);

      if (error) throw error;

      // Create notification for ticket update
      const ticket = tickets.find(t => t.id === ticketId);
      if (ticket) {
        const { error: notifError } = await supabase
          .from('notifications')
          .insert({
            user_id: ticket.creator_id,
            message: `Ticket "${ticket.title}" was updated`,
            ticket_id: ticketId,
            project_id: projectId,
          });

        if (notifError) console.error('Notification error:', notifError);
      }

      fetchTickets();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (authLoading || !user || loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{project?.name}</h1>
                {project?.description && (
                  <p className="text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SuperUserToggle 
                enabled={superUserMode} 
                onToggle={setSuperUserMode}
              />
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Ticket
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <TicketBoard
          tickets={tickets}
          onTicketUpdate={handleTicketUpdate}
          superUserMode={superUserMode}
        />
      </main>

      <CreateTicketDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        projectId={projectId!}
        onTicketCreated={fetchTickets}
      />
    </div>
  );
};

export default ProjectBoard;
