export interface Migration {
  id: string;          // Unique identifier for the migration
  description: string; // Description of what the migration does
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apply: (node: any) => boolean; // Function to apply migration, returns true if changes were made
}

export interface MigrationResult {
  applied: boolean;    // Whether the migration was applied
  migrationId: string; // ID of the migration that was applied
}
