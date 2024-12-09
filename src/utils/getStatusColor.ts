export default function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "text-[#FCC230] bg-[#FCC2300D]";

    case "client_cancel":
      return "text-red bg-[#FF445B0D]";
    case "admin_rejected":
      return "text-red bg-[#FF445B0D]";
    case "admin_cancel":
      return "text-red bg-[#FF445B0D]";
    case "refused":
      return "text-red bg-[#FF445B0D]";
    case "rejected":
      return "text-red bg-[#FF445B0D]";
    case "cancelled":
      return "text-red bg-[#FF445B0D]";
    case "canceled":
      return "text-red bg-[#FF445B0D]";

    case "admin_in_progress":
      return "text-[#FCC230] bg-[#FCC2300D]";
    case "accepted":
      return "text-success bg-[#06D6A01A]";
    case "ready_to_finish":
      return "text-success bg-[#06D6A01A]";
    case "admin_shipping":
      return "text-success bg-[#06D6A01A]";
    case "finished":
      return "text-success bg-[#06D6A01A]";
    case "admin_accept":
      return "text-success bg-[#06D6A01A]";
    case "completed":
      return "text-green bg-[#06D6A01A]";
    case "admin_delivered":
      return "text-blue bg-[#06D6A01A]";
    default:
      return "text-sub bg-[#9ea1c10D]";
  }
};
