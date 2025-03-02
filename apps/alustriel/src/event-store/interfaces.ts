/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

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
  data: Record<string, unknown>;
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
