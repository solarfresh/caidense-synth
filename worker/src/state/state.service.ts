import { ExecutionInstanceState, ExecutionInstanceStateStore } from '@/state/state.interface';
import { ExecutionStatus } from '@caidense/reasoning/execution/execution.interface';


export class ExecutionInstanceStateTracker {
    private state: ExecutionInstanceState;
    private stateStore: ExecutionInstanceStateStore;

    constructor(initialState: ExecutionInstanceState, stateStore: ExecutionInstanceStateStore) {
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
        stateStore: ExecutionInstanceStateStore
    ): Promise<ExecutionInstanceStateTracker> {
        const now = new Date();
        const newState: ExecutionInstanceState = {
            instanceId,
            currentNodeIds: new Set([initialNodeId]),
            completedIncomingEdgeIds: new Map(),
            variables: new Map(initialVariables),
            status: ExecutionStatus.RUNNING,
            startTime: now,
            endTime: undefined,
            error: undefined,
          };
        const tracker = new ExecutionInstanceStateTracker(newState, stateStore);
        await tracker.persistState();
        return tracker;
    }

    public static async loadInstance(instanceId: string, stateStore: ExecutionInstanceStateStore): Promise<ExecutionInstanceStateTracker | null> {
        const state = await stateStore.getState(instanceId);
        if (state) {
            return new ExecutionInstanceStateTracker(state, stateStore);
        }
        return null;
    }

    public getCurrentState(): Readonly<ExecutionInstanceState> {
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

    public getVariables(): Map<string, any> {
        return new Map(this.state.variables);
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
        await this.stateStore.saveState(stateForStorage as unknown as ExecutionInstanceState);
    }

    public getInstanceId(): string {
        return this.state.instanceId;
    }
}