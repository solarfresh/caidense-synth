import { ExecutionContextTracker } from '@caidense/reasoning/state/state.service';
import { Injectable } from '@nestjs/common';
import { ExecutionNodeDto } from '../node/dto/node.dto';


@Injectable()
export abstract class ExecutorBase {
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
  protected abstract execute(node: ExecutionNodeDto, tracker: ExecutionContextTracker): Promise<void>;

  async getInputs(node: ExecutionNodeDto, tracker: ExecutionContextTracker): Promise<Record<string, any>> {
    const inputs: Record<string, string> = {};
    return node.inputs.reduce((acc, variable) => {
      let inputValue = tracker.getVariable(variable.name)
      acc[variable.name] = inputValue
      return acc
    }, inputs)
  }

  async setOutputs(results: Record<string, any>, node: ExecutionNodeDto, tracker: ExecutionContextTracker): Promise<void> {
    node.outputs.map(variable => {
      let value = results[variable.name];
      if (value) {
        tracker.setVariable(variable.name, value)
      }
    })
  }
}
