import { ExecutionStatus } from '@caidense/reasoning/execution/execution.interface';


// Represents the runtime state of an execution instance
export interface ExecutionInstanceState {
    instanceId: string;
    currentNodeIds: Set<string>; // IDs of currently active nodes (tokens)
    completedIncomingEdgeIds: Map<string, Set<string>>; // For join gateways: gatewayId -> set of completed incoming edge IDs
    variables: Map<string, any>; // Execution instance variables
    status: ExecutionStatus;
    startTime: Date; // When the execution instance started
    endTime?: Date; // When the execution instance ended (if applicable)
    error?: string; // Error message if the execution failed
  }