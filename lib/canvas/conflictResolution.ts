import type { CanvasOperation } from '../../types';

interface ConflictResolutionStrategy {
  resolveConflict(localOp: CanvasOperation, remoteOp: CanvasOperation): CanvasOperation[];
}

// Last-writer-wins strategy
export class LastWriterWinsStrategy implements ConflictResolutionStrategy {
  resolveConflict(localOp: CanvasOperation, remoteOp: CanvasOperation): CanvasOperation[] {
    // Compare timestamps
    const localTime = localOp.timestamp instanceof Date ? localOp.timestamp.getTime() : new Date(localOp.timestamp).getTime();
    const remoteTime = remoteOp.timestamp instanceof Date ? remoteOp.timestamp.getTime() : new Date(remoteOp.timestamp).getTime();
    
    if (remoteTime > localTime) {
      return [remoteOp]; // Remote operation wins
    } else if (localTime > remoteTime) {
      return [localOp]; // Local operation wins
    } else {
      // Same timestamp, use user ID as tiebreaker
      return localOp.userId > remoteOp.userId ? [localOp] : [remoteOp];
    }
  }
}

// Operational Transform strategy for concurrent operations
export class OperationalTransformStrategy implements ConflictResolutionStrategy {
  resolveConflict(localOp: CanvasOperation, remoteOp: CanvasOperation): CanvasOperation[] {
    // If operations are on different objects, both can be applied
    if (localOp.data.objectId !== remoteOp.data.objectId) {
      return [localOp, remoteOp];
    }

    // If operations are on the same object, apply transformation
    switch (localOp.type) {
      case 'draw':
        if (remoteOp.type === 'draw') {
          // Both drawing, use timestamp
          return new LastWriterWinsStrategy().resolveConflict(localOp, remoteOp);
        }
        break;
        
      case 'erase':
        if (remoteOp.type === 'erase') {
          // Both erasing, merge if possible
          return this.mergeModifications(localOp, remoteOp);
        } else if (remoteOp.type === 'clear') {
          // Remote clear wins over local erase
          return [remoteOp];
        }
        break;
        
      case 'clear':
        if (remoteOp.type === 'clear') {
          // Both clearing, either one is fine
          return [localOp];
        } else {
          // Local clear wins over remote operations
          return [localOp];
        }
        break;
    }

    // Default to last-writer-wins
    return new LastWriterWinsStrategy().resolveConflict(localOp, remoteOp);
  }

  private mergeModifications(localOp: CanvasOperation, remoteOp: CanvasOperation): CanvasOperation[] {
    // Simple merge strategy - combine properties from both operations
    if (!localOp.data || !remoteOp.data) {
      return new LastWriterWinsStrategy().resolveConflict(localOp, remoteOp);
    }

    try {
      const mergedData = {
        ...remoteOp.data,
        ...localOp.data,
      };

      const mergedOperation: CanvasOperation = {
        ...localOp,
        data: mergedData,
        timestamp: new Date(),
      };

      return [mergedOperation];
    } catch (error) {
      console.error('Failed to merge modifications:', error);
      return new LastWriterWinsStrategy().resolveConflict(localOp, remoteOp);
    }
  }
}

// Conflict resolver class
export class ConflictResolver {
  private strategy: ConflictResolutionStrategy;

  constructor(strategy: ConflictResolutionStrategy = new OperationalTransformStrategy()) {
    this.strategy = strategy;
  }

  // Resolve conflict between operations
  resolve(localOp: CanvasOperation, remoteOp: CanvasOperation): CanvasOperation[] {
    return this.strategy.resolveConflict(localOp, remoteOp);
  }

  // Set resolution strategy
  setStrategy(strategy: ConflictResolutionStrategy) {
    this.strategy = strategy;
  }

  // Resolve multiple conflicting operations
  resolveMultiple(operations: CanvasOperation[]): CanvasOperation[] {
    if (operations.length <= 1) return operations;

    // Group operations by object ID
    const operationGroups = new Map<string, CanvasOperation[]>();
    
    operations.forEach(op => {
      const key = op.data.objectId || 'global';
      if (!operationGroups.has(key)) {
        operationGroups.set(key, []);
      }
      operationGroups.get(key)!.push(op);
    });

    // Resolve conflicts within each group
    const resolvedOperations: CanvasOperation[] = [];
    
    operationGroups.forEach(group => {
      if (group.length === 1) {
        resolvedOperations.push(group[0]);
      } else {
        // Sort by timestamp
        group.sort((a, b) => {
          const aTime = a.timestamp instanceof Date ? a.timestamp.getTime() : new Date(a.timestamp).getTime();
          const bTime = b.timestamp instanceof Date ? b.timestamp.getTime() : new Date(b.timestamp).getTime();
          return aTime - bTime;
        });
        
        // Resolve conflicts pairwise
        let current = group[0];
        for (let i = 1; i < group.length; i++) {
          const resolved = this.resolve(current, group[i]);
          current = resolved[resolved.length - 1]; // Take the last resolved operation
        }
        resolvedOperations.push(current);
      }
    });

    return resolvedOperations;
  }
}

// Performance optimization for large numbers of operations
export class BatchConflictResolver extends ConflictResolver {
  private batchSize = 100;
  
  setBatchSize(size: number) {
    this.batchSize = size;
  }

  async resolveMultipleBatched(operations: CanvasOperation[]): Promise<CanvasOperation[]> {
    const results: CanvasOperation[] = [];
    
    for (let i = 0; i < operations.length; i += this.batchSize) {
      const batch = operations.slice(i, i + this.batchSize);
      const batchResults = this.resolveMultiple(batch);
      results.push(...batchResults);
      
      // Yield control to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    return results;
  }
}