/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import * as postgres from 'postgres';

export interface IPostgresService {
  getSql(): postgres.Sql;
  close(): Promise<void>;
}

// --- E V E N T   S T O R E ---

export interface CreateEventPayload {
  data: unknown;
  eventType: string;
  streamId: string;
  streamType: string;
}

export interface EventStoreReadModel {
  id: string;
  created_at: Date;
  data: unknown;
  stream_id: string;
  type: string;
  version: number;
}

export interface EventStoreWriteModel {
  id: string;
  data: unknown;
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
