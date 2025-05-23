import { ExecutorBase } from '@caidense/reasoning/executor/executor.service';
import { ExecutionNodeDto } from '@caidense/reasoning/node/dto/node.dto';
import { ExecutionNodeType } from '@caidense/reasoning/node/node.interface';
import { ExecutionContextTracker } from '@caidense/reasoning/state/state.service';
import { Injectable } from '@nestjs/common';


@Injectable()
export class ScriptExecutor extends ExecutorBase {
  async execute(node: ExecutionNodeDto, tracker: ExecutionContextTracker): Promise<void> {
    if (node.type !== ExecutionNodeType.SCRIPT) {
      console.error(`ScriptExecutor received unexpected node type: ${node.type}`);
    }
  }
}