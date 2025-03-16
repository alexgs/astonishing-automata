/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import { STEPS } from './constants';

export type StepName = (typeof STEPS)[keyof typeof STEPS];
