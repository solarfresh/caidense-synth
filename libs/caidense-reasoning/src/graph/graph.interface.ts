import { VariableDto } from '@caidense/reasoning/common/dto/common.dto';
import { ExecutionEdgeDto } from '../edge/dto/edge.dto';
import { ExecutionNodeDto } from '../node/dto/node.dto';


export interface ExecutionGraphConfig {
  inputs: Map<string, any>
  [key: string]: any;
}

// Represents the parsed process definition graph
export interface ExecutionGraph {
  id: string; // Unique identifier for the graph
  nodes: Map<string, ExecutionNodeDto>; // Map node ID to ExecutionNode object
  edges: Map<string, ExecutionEdgeDto>; // Map flow ID to ExecutionEdge object
  inputs: VariableDto[];
  outputs: VariableDto[];
}