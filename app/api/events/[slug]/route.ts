import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/database/event.model";
import type { Types } from "mongoose";

/**
 * Narrow, JSON-serializable view of an event document.
 *
 * Note: The existing model exports `IEvent extends Document`, which is not ideal for lean typing.
 * For a route handler response, we use a strict, plain-object shape.
 */
interface EventDTO {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  overview: string;
  image: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  mode: string;
  audience: string;
  agenda: string[];
  organizer: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

type RouteContext = {
  params: { slug?: string } | Promise<{ slug?: string }>;
};

type ErrorBody = {
  message: string;
  details?: string;
};

function jsonError(status: number, body: ErrorBody): NextResponse<ErrorBody> {
  return NextResponse.json(body, { status });
}

/**
 * Basic slug validation:
 * - required
 * - lowercase, URL-safe, hyphen-separated
 */
function validateSlug(slug: string): { ok: true; value: string } | { ok: false; message: string } {
  const normalized = slug.trim().toLowerCase();

  if (!normalized) {
    return { ok: false, message: "Missing slug." };
  }

  // Matches: "my-event", "devfest-2025", "a"
  // Avoids: spaces, underscores, leading/trailing dashes, consecutive dashes.
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!slugRegex.test(normalized)) {
    return {
      ok: false,
      message: "Invalid slug format. Use lowercase letters/numbers and single hyphens only.",
    };
  }

  // Guardrail for abuse / accidental huge params.
  if (normalized.length > 120) {
    return { ok: false, message: "Invalid slug: too long." };
  }

  return { ok: true, value: normalized };
}

export async function GET(_req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;

    if (typeof slug !== "string") {
      return jsonError(400, { message: "Missing slug route parameter." });
    }

    const parsed = validateSlug(slug);
    if (!parsed.ok) {
      // 422 = semantic validation error.
      return jsonError(422, { message: parsed.message });
    }

    await connectDB();

    // `lean()` avoids returning a full Mongoose document and keeps the response JSON-friendly.
    const event = await Event.findOne({ slug: parsed.value }).lean<EventDTO>().exec();

    if (!event) {
      return jsonError(404, { message: "Event not found." });
    }

    return NextResponse.json(
      {
        message: "Event fetched successfully.",
        event,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    const details = err instanceof Error ? err.message : "Unknown error";
    console.error("GET /api/events/[slug] failed:", err);

    // In production, avoid returning internal error messages to clients.
    const isProd = process.env.NODE_ENV === "production";
    return jsonError(500, isProd ? { message: "Failed to fetch event." } : { message: "Failed to fetch event.", details });
  }
}
