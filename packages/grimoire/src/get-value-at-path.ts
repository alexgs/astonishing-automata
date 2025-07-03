/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

/**
 * @internal
 */
export function getValueAtPath(obj: Record<string, unknown>, path: string): unknown {
  const pathSegments = path.split('.');

  return pathSegments.reduce<unknown>((acc, key) => {
    if (typeof acc === 'object' && acc !== null && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}
