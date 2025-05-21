import { Injectable } from '@nestjs/common';
import { ExecutionGraph } from './graph.interface';
import { ExecutionNodeDto } from '../node/dto/node.dto';
import { ExecutionEdgeDto } from '../edge/dto/edge.dto';
import { ReasoningThinkingDto } from '../thinking/dto/thinking.dto';



@Injectable()
export class GraphService {
  /**
   * Transforms a ReasoningThinkingDto object into an ExecutionGraph interface.
   * It converts the arrays of nodes and edges into Maps for easier lookup by ID.
   *
   * @param dto The ReasoningThinkingDto instance to convert.
   * @returns An ExecutionGraph object.
   */
  async convertToExecutionGraph(dto: ReasoningThinkingDto): Promise<ExecutionGraph> {
    const nodesMap = new Map<string, ExecutionNodeDto>();
    const edgesMap = new Map<string, ExecutionEdgeDto>();

    // Populate the nodes map
    dto.nodes.forEach(node => {
      // Assuming each ExecutionNodeDto has an 'id' property
      nodesMap.set(node._id, node);
    });

    // Populate the edges map
    dto.edges.forEach(edge => {
      // Assuming each ExecutionEdgeDto has an 'id' property
      edgesMap.set(edge._id, edge);
    });

    return {
      id: dto._id, // Use the _id from ReasoningThinkingDto as the graph id
      nodes: nodesMap,
      edges: edgesMap,
    };
  }

  async runGraph(graph: ReasoningThinkingDto): Promise<any> {
    // Implement the logic to run the graph
    // This could involve executing nodes and edges in a specific order
    // based on their dependencies and relationships.
    console.log(`Running graph with ID: ${graph._id}`);
    const convertedGraph = await this.convertToExecutionGraph(graph);

    return convertedGraph;
  }
}
