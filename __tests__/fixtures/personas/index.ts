export type { SyntheticPersona, PersonaCategory, ExpectedTraits } from './types';
export { normalProgressionPersonas } from './normal-progression';
export { techPivotPersonas } from './tech-pivot-leadership';
export { betterPayingPivotPersonas } from './better-paying-pivot';
export { careerChangePersonas } from './career-change';

import { normalProgressionPersonas } from './normal-progression';
import { techPivotPersonas } from './tech-pivot-leadership';
import { betterPayingPivotPersonas } from './better-paying-pivot';
import { careerChangePersonas } from './career-change';

/** All 60 synthetic personas */
export const allPersonas = [
  ...normalProgressionPersonas,
  ...techPivotPersonas,
  ...betterPayingPivotPersonas,
  ...careerChangePersonas,
];
