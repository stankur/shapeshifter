import type { Document } from '$lib/model/document';

export type MigrationStep = {
  toVersion: number;
  migrate: (document: Document) => Document;
};

export type MigrationRegistry = {
  steps: MigrationStep[];
};
