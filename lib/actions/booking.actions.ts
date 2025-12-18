"use server"

// ✅ FIX: Import 'connectDB' (default) instead of '{ connectToDatabase }'
import connectDB from "@/lib/mongodb"; 
import Booking from "@/database/booking.model";

export async function createBooking({ eventId, slug, email }: { eventId: string, slug: string, email: string }) {
  try {
    // ✅ Use the correct function name here
    await connectDB();

    const newBooking = await Booking.create({ eventId, email });

    // Convert to plain object to pass to client
    const booking = JSON.parse(JSON.stringify(newBooking));

    return { success: true};

  } catch (error: any) {
    // Catch duplicate key error (User already booked)
    if (error.code === 11000) {
      return { 
        success: false, 
        error: "You have already booked this event!" 
      };
    }

    console.error("Booking Error:", error);
    return { 
      success: false, 
    };
  }
}