/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import ms, { StringValue } from 'ms';

export async function sleep(time: StringValue | number): Promise<void> {
  let duration: number;
  if (typeof time === 'number') {
    duration = time;
  } else {
    duration = ms(time);
  }

  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
}
