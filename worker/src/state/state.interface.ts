import { ExecutionStatus } from '@caidense/reasoning/execution/execution.interface';
import { Variable } from '@caidense/reasoning/common/common.interface';


// Represents the runtime state of an execution instance
export interface ExecutionInstanceState {
    instanceId: string;
    currentNodeIds: Set<string>; // IDs of currently active nodes (tokens)
    completedIncomingEdgeIds: Map<string, Set<string>>; // For join gateways: gatewayId -> set of completed incoming edge IDs
    variables: Map<string, Variable>; // Execution instance variables
    status: ExecutionStatus;
    startTime: Date; // When the execution instance started
    endTime?: Date; // When the execution instance ended (if applicable)
    error?: string; // Error message if the execution failed
  }

  export interface ExecutionInstanceStateStore {
    saveState(state: ExecutionInstanceState): Promise<void>;
    getState(instanceId: string): Promise<ExecutionInstanceState | null>;
    deleteState(instanceId: string): Promise<void>;
    // Optional: query methods for monitoring dashboards
    getInstancesByStatus(status: ExecutionStatus): Promise<ExecutionInstanceState[]>;
    // Add more methods as needed for your use case
}
