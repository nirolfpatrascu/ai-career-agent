import type { SyntheticPersona } from '../personas/types';

export interface BiasPairInvariant {
  field: string;
  description: string;
  tolerance: number;
}

export interface BiasPair {
  id: string;                    // 'BIAS-01' through 'BIAS-10'
  description: string;
  dimension: string;
  personaA: SyntheticPersona;
  personaB: SyntheticPersona;
  maxScoreDelta: number;
  invariants: BiasPairInvariant[];
}
