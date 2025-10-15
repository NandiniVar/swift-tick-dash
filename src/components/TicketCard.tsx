import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Ticket } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, GripVertical } from "lucide-react";

interface TicketCardProps {
  ticket: Ticket;
  superUserMode: boolean;
  isDragging?: boolean;
}

export const TicketCard = ({ ticket, superUserMode, isDragging }: TicketCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: ticket.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base flex-1">{ticket.title}</CardTitle>
          <div {...listeners} className="cursor-grab">
            <GripVertical className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        {ticket.description && (
          <CardDescription className="text-sm line-clamp-2">
            {ticket.description}
          </CardDescription>
        )}
      </CardHeader>

      {superUserMode && (
        <CardContent className="pt-0">
          <div className="space-y-2 text-xs text-muted-foreground">
            {ticket.creator && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>Created by {ticket.creator.email}</span>
              </div>
            )}
            {ticket.updater && (
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>Updated by {ticket.updater.email}</span>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
};
