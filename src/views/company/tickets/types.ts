export type TicketType = {
  id: number;
  ticket_number: number;
  status: string;
  phone: string;
  created_at: string;
  content: string;
  user: UserType;
  replies: any[];
  ticket_type: {
    title: string;
  }
}
