/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

// --- E V E N T   S T O R E ---

export interface CreateEventPayload {
  data: EventPayloads | Record<string, unknown>;
  eventType: string;
  streamId: string;
  streamType: string;
}

// {
//   "id":"01HJ659NEF95QMJHSMGN36VA7J",
//   "created_at":"2023-12-21T17:23:39.216Z",
//   "data":{"year":"1977","title":"Star Wars"},
//   "stream_id":"ebe6d909-5976-4b64-8445-3b726ab891a4",
//   "type":"event-types.movie-created",
//   "version":1,
// }
export interface EventReadModel {
  id: string;
  created_at: Date;
  data: Record<string, unknown>;
  stream_id: string;
  type: string;
  version: number;
}

export interface EventWriteModel {
  id: string;
  data: EventPayloads | Record<string, unknown>;
  expectedVersion: number;
  streamId: string;
  streamType: string;
  type: string;
}

export interface StreamRecord {
  id: string;
  type: string;
  version: number;
}

// --- E V E N T   P A Y L O A D S ---

export type EventPayloads =
  | BudgetCreatedEventPayload
  | CategoryCreatedEventPayload
  | TransactionCategoriesRehomedEventPayload
  | UserCreatedEventPayload;

// --- Budget Created Event Payload ---

export interface BudgetCreatedEventPayload {
  name: string;
  owner: string;
  slug: string;
}

// --- Category Created Event Payload ---

export interface CategoryCreatedEventPayload {
  budgetId: string;
  name: string;
  parentId: string | null;
}

// --- Transaction Categories Rehomed Event Payload ---

export interface RehomedCategorySubrecord {
  id: string;
  categoryId: string;
  prevCategoryId: string;
}

export interface TransactionCategoriesRehomedEventPayload {
  // This should look like a transaction-created-event payload, but with only the parts that have changed
  // Payload does **NOT** include its own ID (that's what the stream_id is for)
  budgetId: string;
  categories: RehomedCategorySubrecord[];
}

// --- User Created Event Payload ---

export interface UserCreatedEventPayload {
  email: string;
  previousEmail: string;
}
