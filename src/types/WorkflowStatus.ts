import type { Values } from './Values';

const WorkflowStatus = {
  DRAFT: 'DRAFT',
  APPROVED: 'APPROVED',
  READY_FOR_VALIDATION: 'READY_FOR_VALIDATION',
  REJECTED: 'REJECTED',
  DELETED: 'DELETED',
} as const;

type WorkflowStatus = Values<typeof WorkflowStatus>;

export { WorkflowStatus };
