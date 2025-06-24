import { ExecutorBase } from '@caidense/reasoning/executor/executor.service';
import { ExecutionNodeDto } from '@caidense/reasoning/node/dto/node.dto';
import { ExecutionNodeType } from '@caidense/reasoning/node/node.interface';
import { ExecutionContextTracker } from '@caidense/reasoning/state/state.service';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as vm from 'vm';


@Injectable()
export class ScriptExecutor extends ExecutorBase {
  constructor(
    private readonly configService: ConfigService,
  ) {
    super()
  }

  async execute(node: ExecutionNodeDto, tracker: ExecutionContextTracker): Promise<void> {
    if (node.type !== ExecutionNodeType.SCRIPT) {
      console.error(`ScriptExecutor received unexpected node type: ${node.type}`);
    }

    const script = new vm.Script(node.config.script);
    const sandbox = await this.getInputs(node, tracker)
    const context = vm.createContext(sandbox);
    const vmTimeout = this.configService.get('VM_TIMEOUT') | 1000;
    try {
        script.runInContext(context, { timeout: vmTimeout });
    } catch (err) {
        console.error('VM execution error:', err.message);
    }

    await this.setOutputs(sandbox, node, tracker)
  }
}