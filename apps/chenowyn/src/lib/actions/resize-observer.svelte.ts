/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import type { Action } from 'svelte/action';

export const resizeObserver: Action<Element, (rect: DOMRectReadOnly) => void> = (
  node,
  callback: (rect: DOMRectReadOnly) => void
) => {
  $effect(() => {
    const observer = new ResizeObserver(([ entry ]) => {
      if (callback) {
        callback(entry.contentRect);
      }
    });

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  });
};
