import { ExecutorBase } from '@caidense/reasoning/executor/executor.service';
import { ExecutionNodeDto } from '@caidense/reasoning/node/dto/node.dto';
import { ExecutionNodeType } from '@caidense/reasoning/node/node.interface';
import { ExecutionContextTracker } from '@caidense/reasoning/state/state.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class SwitchExecutor extends ExecutorBase {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super()
  }

  async execute(node: ExecutionNodeDto, tracker: ExecutionContextTracker): Promise<void> {
    if (node.type !== ExecutionNodeType.SWITCH) {
      console.error(`ConditionExecutor received unexpected node type: ${node.type}`);
    }

    const inputs = await this.getInputs(node, tracker);
    node.outgoing = [inputs[node.config.script]];
  }
}