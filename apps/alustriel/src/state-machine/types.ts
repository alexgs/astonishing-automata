/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { STEPS } from './constants';

export type StepName = (typeof STEPS)[keyof typeof STEPS];
