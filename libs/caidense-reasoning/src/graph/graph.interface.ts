import { ExecutionNodeDto } from '../node/dto/node.dto';
import { ExecutionEdgeDto } from '../edge/dto/edge.dto';


// Represents the parsed process definition graph
export interface ExecutionGraph {
    id: string; // Unique identifier for the graph
    nodes: Map<string, ExecutionNodeDto>; // Map node ID to ExecutionNode object
    edges: Map<string, ExecutionEdgeDto>; // Map flow ID to ExecutionEdge object
}