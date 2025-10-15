import { useDroppable } from "@dnd-kit/core";
import { Ticket, TicketStatus } from "@/lib/supabase";
import { TicketCard } from "./TicketCard";
import { Card } from "@/components/ui/card";

interface TicketColumnProps {
  title: string;
  status: TicketStatus;
  tickets: Ticket[];
  superUserMode: boolean;
}

const getStatusColor = (status: TicketStatus) => {
  switch (status) {
    case 'todo':
      return 'bg-status-todo/10 border-status-todo/20';
    case 'in_progress':
      return 'bg-status-in-progress/10 border-status-in-progress/20';
    case 'done':
      return 'bg-status-done/10 border-status-done/20';
  }
};

const getStatusDotColor = (status: TicketStatus) => {
  switch (status) {
    case 'todo':
      return 'bg-status-todo';
    case 'in_progress':
      return 'bg-status-in-progress';
    case 'done':
      return 'bg-status-done';
  }
};

export const TicketColumn = ({ title, status, tickets, superUserMode }: TicketColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col gap-4 transition-colors ${
        isOver ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-center gap-2 px-1">
        <div className={`w-2 h-2 rounded-full ${getStatusDotColor(status)}`} />
        <h3 className="font-semibold text-lg">{title}</h3>
        <span className="text-sm text-muted-foreground">
          ({tickets.length})
        </span>
      </div>

      <div className={`rounded-lg border-2 border-dashed p-4 min-h-[500px] ${getStatusColor(status)}`}>
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              superUserMode={superUserMode}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
