/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from '$lib/model/document';
import type { MigrationRegistry, MigrationStep } from './types';
import { createSectionMigrations } from './collection/section';
import { createSectionContainerMigrations } from './collection/section-container';

// Create migration registry using a factory function
export function createMigrationRegistry() {
  const registry: MigrationRegistry = {
    steps: []
  };
  
  // Function to register a migration step
  function registerStep(step: MigrationStep) {
    registry.steps.push(step);
    // Sort steps by toVersion to ensure correct order
    registry.steps.sort((a, b) => a.toVersion - b.toVersion);
  }
  
  // Function to migrate a document
  function migrateDocument(document: Document): Document {
    // If document has no version, assume it's version 0
    const currentVersion = document.version ?? 0;
    
    // Find applicable migration steps
    const applicableSteps = registry.steps.filter(
      step => step.toVersion > currentVersion
    );
    
    if (applicableSteps.length === 0) {
      return document;
    }
    
    // Apply migrations in sequence
    let migratedDocument = { ...document };
    
    for (const step of applicableSteps) {
      console.log(`Migrating document to version ${step.toVersion}`);
      migratedDocument = step.migrate(migratedDocument);
      migratedDocument.version = step.toVersion;
    }
    
    return migratedDocument;
  }
  
  return {
    registerStep,
    migrateDocument
  };
}

// Create and initialize the migration registry
const migrationRegistry = createMigrationRegistry();

// Register all migrations
createSectionMigrations(migrationRegistry);
createSectionContainerMigrations(migrationRegistry);

// Export the migration function for use in document retrieval
export function migrateDocumentIfNeeded(document: Document): Document {
  return migrationRegistry.migrateDocument(document);
}
