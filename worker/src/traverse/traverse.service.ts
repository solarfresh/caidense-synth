import { ExecutionStatus } from '@caidense/reasoning/execution/execution.interface';
import { ExecutionGraph } from '@caidense/reasoning/graph/graph.interface';
import { ExecutionNodeType } from '@caidense/reasoning/node/node.interface';
import { ExecutionContext } from '@caidense/reasoning/state/state.interface';
import { ExecutionContextTracker } from '@caidense/reasoning/state/state.service';


export class GraphTraversalEngine {
    private graph: ExecutionGraph;
    public stateTracker: ExecutionContextTracker;

    constructor(graph: ExecutionGraph, stateTracker: ExecutionContextTracker) {
        this.graph = graph;
        this.stateTracker = stateTracker;
    }

    /**
     * Advances the process instance from a completed node.
     * This is typically called when a task is completed or an event is caught.
     * @param completedNodeId The ID of the node that just completed.
     * @returns An array of node IDs that are now active and ready to be dispatched.
     */
    public advanceExecute(completedNodeId: string): string[] {
        const completedNode = this.graph.nodes.get(completedNodeId);
        if (!completedNode) {
            console.warn(`Completed node with ID ${completedNodeId} not found in graph.`);
            return [];
        }

        // Remove the completed node from active nodes
        this.stateTracker.completeNode(completedNodeId);

        const nodesToActivate: string[] = [];
        // const currentVariables = this.stateTracker.getVariables();

        // Iterate over all outgoing sequence edges from the completed node
        for (const edgeId of completedNode.outgoing) {
            const edge = this.graph.edges.get(edgeId);
            if (!edge) {
                console.warn(`Sequence edge with ID (${edgeId}) from the node (${completedNode.label}) with ID (${completedNode._id}) not found.`);
                continue;
            }

            const targetNode = this.graph.nodes.get(edge.target);
            if (!targetNode) {
                console.warn(`Target node with ID ${edge.target} for edge ${edgeId} not found.`);
                continue;
            }

            // Handle different types of target nodes
            switch (targetNode.type) {
                case ExecutionNodeType.LLM_CALL:
                case ExecutionNodeType.SCRIPT:
                case ExecutionNodeType.START_EVENT: // Usually only one starting point
                case ExecutionNodeType.END_EVENT:
                    // For simple nodes, activate them directly
                    this.activateNode(targetNode._id, nodesToActivate);
                    break;

                // Add more cases as needed
                // case ExecutionNodeType.EXCLUSIVE_GATEWAY:
                //     this.handleExclusiveGateway(targetNode, nodesToActivate);
                //     break;

                default:
                    console.warn(`Unsupported node type encountered: ${targetNode.type}`);
                    break;
            }
        }

        // If no new nodes were activated, and the process instance has no active nodes, it might be completed.
        // This is a simplified check, full completion check is more complex.
        const currentNodeIds = this.stateTracker.getCurrentState().currentNodeIds
        if (nodesToActivate.length === 0 && currentNodeIds.size === 0) {
            // Check if all active paths have reached an EndEvent or are otherwise complete.
            // A more robust check for process completion would be needed here.
            this.stateTracker.setStatus(ExecutionStatus.COMPLETED);
        }

        return nodesToActivate;
    }

    /**
     * Returns the current state of the process instance.
     * @returns The ExecutionContext object.
     */
    public getCurrentState(): ExecutionContext {
        return this.stateTracker.getCurrentState();
    }

    /**
     * Activates a node and adds it to the list of nodes to be dispatched.
     * @param nodeId The ID of the node to activate.
     * @param nodesToActivate Array to collect activated nodes.
     */
    private activateNode(nodeId: string, nodesToActivate: string[]): void {
        this.stateTracker.activateNode(nodeId);
        nodesToActivate.push(nodeId);
        console.log(`Node activated: ${nodeId}`);
    }

    /**
     * Add other utility methods as needed.
     */
}