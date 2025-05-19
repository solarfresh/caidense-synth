// This class is typically instantiated and populated in the WorkerModule.
import { NodeExecutor } from '../interfaces/executor.interface';

/**
 * Registry for mapping node type strings to their corresponding
 * NodeExecutor implementations.
 *
 * This allows the flow execution logic to dynamically find and
 * execute the correct code based on a node's 'type' property.
 */
export class NodeExecutorRegistry {
  // A private map to store the mapping from node type string to executor instance
  private readonly executors = new Map<string, NodeExecutor>();

  /**
   * Registers an executor instance with the registry for a specific node type.
   * This method is typically called during application startup or module
   * initialization (e.g., in a factory provider in the WorkerModule).
   *
   * @param type The unique node type string (e.g., 'aiCall', 'systemLogic:sum').
   * @param executor The instance of the NodeExecutor implementation for this type.
   * @throws Error if an executor for the same type is already registered.
   */
  register(type: string, executor: NodeExecutor): void {
    if (this.executors.has(type)) {
      // Prevent duplicate registrations for the same type
      throw new Error(`NodeExecutorRegistry Error: Executor already registered for type "${type}"`);
    }
    this.executors.set(type, executor);
    // console.log(`[NodeExecutorRegistry] Registered executor for type: "${type}"`); // Optional: Log successful registration
  }

  /**
   * Retrieves the executor instance registered for a given node type.
   * This method is called by the WorkerService when it needs to execute a node.
   *
   * @param type The node type string to look up.
   * @returns The registered NodeExecutor instance.
   * @throws Error if no executor is registered for the given type.
   */
  getExecutor(type: string): NodeExecutor {
    const executor = this.executors.get(type);
    if (!executor) {
      // If no executor is found for the type, it's a configuration error
      throw new Error(`NodeExecutorRegistry Error: No executor registered for type "${type}"`);
    }
    return executor;
  }

  /**
   * Gets a list of all node types currently registered in the registry.
   * Useful for introspection or debugging.
   *
   * @returns An array of strings representing the registered node types.
   */
  getExecutorTypes(): string[] {
      return Array.from(this.executors.keys());
  }

  // You might add methods for registering multiple types to one executor
  // or for handling aliases if your node type naming is flexible.
}