import { useMemo } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Ticket, TicketStatus } from "@/lib/supabase";
import { TicketColumn } from "./TicketColumn";
import { TicketCard } from "./TicketCard";
import { useState } from "react";

interface TicketBoardProps {
  tickets: Ticket[];
  onTicketUpdate: (ticketId: string, updates: Partial<Ticket>) => void;
  superUserMode: boolean;
}

const COLUMNS: { id: TicketStatus; title: string }[] = [
  { id: 'todo', title: 'To Do' },
  { id: 'in_progress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
];

export const TicketBoard = ({ tickets, onTicketUpdate, superUserMode }: TicketBoardProps) => {
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const ticketsByStatus = useMemo(() => {
    return COLUMNS.reduce((acc, column) => {
      acc[column.id] = tickets.filter(ticket => ticket.status === column.id);
      return acc;
    }, {} as Record<TicketStatus, Ticket[]>);
  }, [tickets]);

  const handleDragStart = (event: DragStartEvent) => {
    const ticket = tickets.find(t => t.id === event.active.id);
    if (ticket) {
      setActiveTicket(ticket);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTicket(null);
      return;
    }

    const ticketId = active.id as string;
    const newStatus = over.id as TicketStatus;

    const ticket = tickets.find(t => t.id === ticketId);
    if (ticket && ticket.status !== newStatus) {
      onTicketUpdate(ticketId, { status: newStatus });
    }

    setActiveTicket(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((column) => (
          <SortableContext
            key={column.id}
            items={ticketsByStatus[column.id].map(t => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <TicketColumn
              title={column.title}
              status={column.id}
              tickets={ticketsByStatus[column.id]}
              superUserMode={superUserMode}
            />
          </SortableContext>
        ))}
      </div>

      <DragOverlay>
        {activeTicket ? (
          <TicketCard
            ticket={activeTicket}
            superUserMode={superUserMode}
            isDragging
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
