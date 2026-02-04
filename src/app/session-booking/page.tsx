"use client";

import { InlineWidget } from "react-calendly";
import { useBooking } from "./hooks/booking.hooks";

export default function CalendlyWidget() {
  const { agentURL, userName, userEmail, loading, error } = useBooking();

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center h-[700px]">
        <p className="text-muted-foreground">Loading booking calendar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center h-[700px]">
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!agentURL) {
    return (
      <div className="w-full flex items-center justify-center h-[700px]">
        <p className="text-muted-foreground">No booking calendar available.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <InlineWidget
        url={agentURL}
        styles={{ height: "700px" }}
        prefill={{
          email: userEmail,
          name: userName,
        }}
      />
    </div>
  );
}