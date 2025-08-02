/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

export type Expression =
  | number
  | string
  | { $add: Expression[] }
  | { $sub: Expression[] }
  | { $mul: Expression[] }
  | { $div: Expression[] }
  | {
      $var:
        | string
        | (string | { $field: string; } | { $fromOption: string; })[]
    }
  | { $field: string }           // value from user input
  | { $fromOption: string }      // metadata from selected item
  | { $path: string };           // absolute path into character schema
