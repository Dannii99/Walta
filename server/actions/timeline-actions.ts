"use server";

import { auth } from "@/lib/auth";
import {
  getTimelineEvents,
} from "@/server/queries/timeline-queries";
import {
  timelineEventTypesSchema,
  type TimelineCursor,
  type TimelineEventType,
} from "@/lib/timeline-types";

export interface LoadMoreTimelineInput {
  cursor: TimelineCursor | null;
  types: TimelineEventType[];
  limit?: number;
}

export interface LoadMoreTimelineResult {
  events: ReturnType<typeof JSON.parse>[];
  nextCursor: TimelineCursor | null;
  hasMore: boolean;
  total: number;
}

export async function loadMoreTimelineAction(
  input: LoadMoreTimelineInput
): Promise<LoadMoreTimelineResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { events: [], nextCursor: null, hasMore: false, total: 0 };
  }

  const validatedTypes: TimelineEventType[] = timelineEventTypesSchema.parse(
    input.types ?? []
  );

  const page = await getTimelineEvents(session.user.id, {
    limit: input.limit,
    cursor: input.cursor,
    types: validatedTypes.length > 0 ? validatedTypes : null,
  });

  return {
    events: page.events.map((e) => ({
      ...e,
      occurredAt: e.occurredAt.toISOString(),
    })),
    nextCursor: page.nextCursor,
    hasMore: page.hasMore,
    total: page.total,
  };
}
