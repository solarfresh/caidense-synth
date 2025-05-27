import { ExecutionContext, ExecutionContextStore } from '@caidense/reasoning/state/state.interface';
import { ExecutionStatus } from '@caidense/reasoning/execution/execution.interface';


/**
 * A mock in-memory implementation of ExecutionContextStore for demonstration.
 * In a real application, this would interact with a database.
 */
export class InMemoryExecutionContextStore implements ExecutionContextStore {
  private store: Map<string, ExecutionContext> = new Map();

  async saveState(state: ExecutionContext): Promise<void> {
    // Deep clone the state to prevent external modifications affecting the stored state
    const stateToStore: ExecutionContext = {
      ...state,
      currentNodeIds: new Set(state.currentNodeIds),
      completedIncomingEdgeIds: new Map(
        Array.from(state.completedIncomingEdgeIds.entries()).map(([key, value]) => [key, new Set(value)])
      ),
      variables: new Map(state.variables),
      startTime: new Date(state.startTime),
      endTime: state.endTime ? new Date(state.endTime) : undefined,
    };
    this.store.set(state.instanceId, stateToStore);
    console.log(`[Store] State saved for instance: ${state.instanceId}`);
  }

  async getState(instanceId: string): Promise<ExecutionContext | null> {
    const state = this.store.get(instanceId);
    if (state) {
      // Return a deep clone to ensure the caller works with a mutable copy
      return {
        ...state,
        currentNodeIds: new Set(state.currentNodeIds),
        completedIncomingEdgeIds: new Map(
          Array.from(state.completedIncomingEdgeIds.entries()).map(([key, value]) => [key, new Set(value)])
        ),
        variables: new Map(state.variables),
        startTime: new Date(state.startTime),
        endTime: state.endTime ? new Date(state.endTime) : undefined,
      };
    }
    return null;
  }

  async deleteState(instanceId: string): Promise<void> {
    this.store.delete(instanceId);
    console.log(`[Store] State deleted for instance: ${instanceId}`);
  }

  async getInstancesByStatus(status: ExecutionContext['status']): Promise<ExecutionContext[]> {
    const filtered = Array.from(this.store.values()).filter(s => s.status === status);
    return filtered.map(s => ({
      ...s,
      currentNodeIds: new Set(s.currentNodeIds),
      completedIncomingEdgeIds: new Map(Array.from(s.completedIncomingEdgeIds.entries()).map(([key, value]) => [key, new Set(value)])),
      variables: new Map(s.variables),
      startTime: new Date(s.startTime),
      endTime: s.endTime ? new Date(s.endTime) : undefined,
    }));
  }
}

export class ExecutionContextTracker {
  private state: ExecutionContext;
  private stateStore: ExecutionContextStore;

  constructor(initialState: ExecutionContext, stateStore: ExecutionContextStore) {
    this.state = initialState;
    this.stateStore = stateStore;
    // Ensure sets and maps are correctly initialized even if loaded from plain object
    this.state.currentNodeIds = new Set(initialState.currentNodeIds);
    this.state.completedIncomingEdgeIds = new Map(initialState.completedIncomingEdgeIds.entries());
    for (const [gatewayId, edgeSet] of this.state.completedIncomingEdgeIds.entries()) {
      if (!(edgeSet instanceof Set)) {
        this.state.completedIncomingEdgeIds.set(gatewayId, new Set(Array.from(edgeSet)));
      }
    }
    this.state.variables = new Map(initialState.variables);
  }

  public static async createNewInstance(
    instanceId: string,
    initialNodeId: string,
    initialVariables: Map<string, any>,
    stateStore: ExecutionContextStore
  ): Promise<ExecutionContextTracker> {
    const now = new Date();
    const newState: ExecutionContext = {
      instanceId,
      currentNodeIds: new Set([initialNodeId]),
      completedIncomingEdgeIds: new Map(),
      variables: initialVariables,
      status: ExecutionStatus.RUNNING,
      startTime: now,
      endTime: undefined,
      error: undefined,
    };
    const tracker = new ExecutionContextTracker(newState, stateStore);
    await tracker.persistState();
    return tracker;
  }

  public static async loadInstance(instanceId: string, stateStore: ExecutionContextStore): Promise<ExecutionContextTracker | null> {
    const state = await stateStore.getState(instanceId);
    if (state) {
      return new ExecutionContextTracker(state, stateStore);
    }
    return null;
  }

  public getCurrentState(): Readonly<ExecutionContext> {
    return {
      ...this.state,
      currentNodeIds: new Set(this.state.currentNodeIds),
      completedIncomingEdgeIds: new Map(
        Array.from(this.state.completedIncomingEdgeIds.entries()).map(([key, value]) => [key, new Set(value)])
      ),
      variables: new Map(this.state.variables),
    };
  }

  public activateNode(nodeId: string): void {
    this.state.currentNodeIds.add(nodeId);
  }

  public completeNode(nodeId: string): void {
    this.state.currentNodeIds.delete(nodeId);
  }

  public setVariable(key: string, value: any): void {
    this.state.variables.set(key, value);
  }

  public getVariable(key: string): any {
    return this.state.variables.get(key);
  }

  public getVariables(filter: string[] = []): Map<string, any> {
    if (filter.length) {
      return new Map(filter.map(key => [key, this.state.variables[key]]))
    }
    return new Map(this.state.variables);
  }

  public async filterVariables(filter: string[]): Promise<void> {
    if (filter.length) {
      this.state.variables = new Map(filter.map(key => [key, this.state.variables.get(key)]))
    }
  }

  public recordCompletedIncomingFlow(gatewayId: string, incomingFlowId: string): void {
    if (!this.state.completedIncomingEdgeIds.has(gatewayId)) {
      this.state.completedIncomingEdgeIds.set(gatewayId, new Set<string>());
    }
    this.state.completedIncomingEdgeIds.get(gatewayId)!.add(incomingFlowId);
  }

  public hasCompletedIncomingFlow(gatewayId: string, incomingFlowId: string): boolean {
    return this.state.completedIncomingEdgeIds.has(gatewayId) &&
      this.state.completedIncomingEdgeIds.get(gatewayId)!.has(incomingFlowId);
  }

  public clearCompletedIncomingFlows(gatewayId: string): void {
    this.state.completedIncomingEdgeIds.delete(gatewayId);
  }

  public setStatus(status: ExecutionStatus, errorMessage?: string): void {
    this.state.status = status;
    this.state.error = errorMessage;
    if (status === ExecutionStatus.COMPLETED || status === ExecutionStatus.TERMINATED || status === ExecutionStatus.FAILED) {
      this.state.endTime = new Date();
    }
  }

  public async persistState(): Promise<void> {
    const stateForStorage = {
      ...this.state,
      currentNodeIds: Array.from(this.state.currentNodeIds),
      completedIncomingEdgeIds: Array.from(this.state.completedIncomingEdgeIds.entries()).map(([key, value]) => [key, Array.from(value)]),
      variables: Array.from(this.state.variables.entries()),
    };
    await this.stateStore.saveState(stateForStorage as unknown as ExecutionContext);
  }

  public getInstanceId(): string {
    return this.state.instanceId;
  }
}