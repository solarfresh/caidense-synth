export enum ExecutionStatus {
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  SKIPPED = 'skipped',
}

export enum ExecutionNodeType {
  SEQUENCE = 'sequence',
  PARALLEL = 'parallel',
  EXCLUSIVE = 'exclusive',
  INCLUSIVE = 'inclusive',
  START_EVENT = 'startEvent',
  END_EVENT = 'endEvent',
  TASK = 'task',
  GATEWAY = 'gateway',
  SCRIPT = 'script',
}