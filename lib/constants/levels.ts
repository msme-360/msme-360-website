/**
 * MSME 360 Industrial Job Architecture (L1 - L6)
 * Standards based on Indeed & PHP HR Corporate Hierarchy models.
 */

export type CareerLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6';

export interface LevelDefinition {
  level: CareerLevel;
  title: string;
  description: string;
  minYears: number;
}

export const JOB_LEVELS: Record<CareerLevel, LevelDefinition> = {
  L1: {
    level: 'L1',
    title: 'Individual Contributor / Junior Staff',
    description: 'Entry-level professionals, interns, and trainees focusing on execution.',
    minYears: 0,
  },
  L2: {
    level: 'L2',
    title: 'Associate / Senior Individual Contributor',
    description: 'Experienced professionals managing independent tasks and smaller projects.',
    minYears: 2,
  },
  L3: {
    level: 'L3',
    title: 'Senior / Lead / Senior Associate',
    description: 'Specialists leading specific technical areas or small project teams.',
    minYears: 4,
  },
  L4: {
    level: 'L4',
    title: 'Manager / Team Lead',
    description: 'Operational leadership focusing on people management and delivery.',
    minYears: 6,
  },
  L5: {
    level: 'L5',
    title: 'Director / Department Head',
    description: 'Strategic leadership focusing on department goals and resource allocation.',
    minYears: 8,
  },
  L6: {
    level: 'L6',
    title: 'Executive / C-Suite / Principal',
    description: 'Top-level governance and strategic direction (CEO, Managing Partner, CTO).',
    minYears: 12,
  }
};

export const getLevelTitle = (level: string) => {
  return JOB_LEVELS[level as CareerLevel]?.title || 'Member';
};
