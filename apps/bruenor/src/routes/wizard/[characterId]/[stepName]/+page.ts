/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Elastic License 2.0 (ELv2).
 */

import type { PageLoad } from './$types';
export const load: PageLoad = ({ params }) => {
  console.log(`Params: ${JSON.stringify(params)}`);

  return {
    characterId: params.characterId,
    stepName: params.stepName,
  };
};
