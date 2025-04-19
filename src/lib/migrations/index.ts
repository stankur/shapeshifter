/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Migration, MigrationResult } from './types';
import { sectionMigrations } from './collection/section';

// Combine all migrations
export const allMigrations: Migration[] = [
  ...sectionMigrations,
  // Add other migrations here
];

// Apply all applicable migrations to a node
export function applyMigrations(node: any): MigrationResult[] {
  const results: MigrationResult[] = [];
  
  if (!node) return results;
  
  // Apply migrations based on node type
  const applicableMigrations = getMigrationsForNode(node);
  
  for (const migration of applicableMigrations) {
    const applied = migration.apply(node);
    if (applied) {
      results.push({
        applied,
        migrationId: migration.id
      });
    }
  }
  
  // Recursively apply migrations to children if they exist
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      results.push(...applyMigrations(child));
    }
  }
  
  // Also check summary if it exists
  if (node.summary && Array.isArray(node.summary)) {
    for (const item of node.summary) {
      results.push(...applyMigrations(item));
    }
  }
  
  return results;
}

// Get migrations applicable to a specific node type
function getMigrationsForNode(node: any): Migration[] {
  if (!node || !node.type) return [];
  
  switch (node.type) {
    case 'section':
      return sectionMigrations;
    // Add other node types here
    default:
      return [];
  }
}
