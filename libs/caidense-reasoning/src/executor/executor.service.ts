import { ExecutorResult } from '@caidense/reasoning/executor/executor.interface';
import { ExecutionNode } from '@caidense/reasoning/node/node.interface';
import { ExecutionContextTracker } from '@caidense/reasoning/state/state.service';
import { Injectable } from '@nestjs/common';


@Injectable()
export abstract class ExecutorBase<T> {
  /**
   * Implementations should:
   * 1. Read data from the input 'context' and 'node.config'.
   * 2. Perform the node's specific operation.
   * 3. Update the 'context' (e.g., modify flowVariables, add history entries).
   * 4. Determine the 'nextNodeIds' based on the node's logic and output branches.
   * 5. Return an INodeExecutionOutcome object.
   *
   * @param node The definition of the node instance to execute.
   * @param context The current state of the graph execution.
   * @returns A Promise resolving to the outcome of the execution.
   */
  protected abstract execute(node: ExecutionNode, tracker: ExecutionContextTracker): Promise<ExecutorResult>;
}
