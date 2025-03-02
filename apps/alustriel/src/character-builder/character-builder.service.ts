/*
 * Copyright 2025 Phillip Gates-Shannon. All rights reserved. Licensed under the Open Software License version 3.0.
 */

import { Injectable } from '@nestjs/common';
import { createActor } from 'xstate';
import { characterCreationMachine } from './state/character-creation.machine';

@Injectable()
export class CharacterBuilderService {
  private stateMachines: Map<string, ReturnType<typeof createActor>> =
    new Map();

  createCharacterSession(sessionId: string) {
    if (!this.stateMachines.has(sessionId)) {
      const actor = createActor(characterCreationMachine);
      actor.start(); // Start the actor
      this.stateMachines.set(sessionId, actor);
    }
  }

  sendEvent(sessionId: string, event: 'NEXT' | 'PREV' | 'CONFIRM') {
    const actor = this.stateMachines.get(sessionId);
    if (actor) {
      actor.send({ type: event }); // Send event
      return actor.getSnapshot(); // Get updated state
    }
    throw new Error('Session not found');
  }

  getCharacterState(sessionId: string) {
    return this.stateMachines.get(sessionId)?.getSnapshot();
  }
}
