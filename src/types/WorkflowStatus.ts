import type { Values } from './Values';

const WorkflowStatusMap = {
  DRAFT: 'DRAFT',
  APPROVED: 'APPROVED',
  READY_FOR_VALIDATION: 'READY_FOR_VALIDATION',
  REJECTED: 'REJECTED',
  DELETED: 'DELETED',
} as const;

type WorkflowStatus = Values<typeof WorkflowStatusMap>;

export { WorkflowStatusMap };

export type { WorkflowStatus };
