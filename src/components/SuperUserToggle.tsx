import { useState } from "react";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SuperUserToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
}

const SUPER_USER_PASSWORD = "admin123"; // In production, this should be stored securely

export const SuperUserToggle = ({ enabled, onToggle }: SuperUserToggleProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const handleToggle = () => {
    if (enabled) {
      // Turn off super user mode
      onToggle(false);
      toast({
        title: "Super User Mode Disabled",
        description: "User information is now hidden",
      });
    } else {
      // Show password dialog to enable
      setDialogOpen(true);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === SUPER_USER_PASSWORD) {
      onToggle(true);
      setDialogOpen(false);
      setPassword("");
      toast({
        title: "Super User Mode Enabled",
        description: "You can now see who created and updated tickets",
      });
    } else {
      toast({
        title: "Incorrect Password",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button
        variant={enabled ? "default" : "outline"}
        size="sm"
        onClick={handleToggle}
        className="gap-2"
      >
        <Shield className="h-4 w-4" />
        {enabled ? "Super User: ON" : "Super User"}
      </Button>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <form onSubmit={handlePasswordSubmit}>
            <DialogHeader>
              <DialogTitle>Enable Super User Mode</DialogTitle>
              <DialogDescription>
                Enter the super user password to view creator and updater information
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setDialogOpen(false);
                  setPassword("");
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Enable</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};
