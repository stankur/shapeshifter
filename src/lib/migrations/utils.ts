/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Document } from '$lib/model/document';

type NodeVisitors = {
  section?: (node: any) => void;
  sectionContainer?: (node: any) => void;
  paragraph?: (node: any) => void;
  heading?: (node: any) => void;
  untitledSection?: (node: any) => void;
  // Add other node types as needed
};

/**
 * Traverses a document and applies visitor functions to each node based on its type
 */
export function traverseDocument(document: Document, visitors: NodeVisitors): Document {
  // Create a deep clone to avoid modifying the original
  const newDocument = JSON.parse(JSON.stringify(document));
  
  // Start traversal from the document content
  traverseNode(newDocument.content, visitors);
  
  return newDocument;
}

/**
 * Recursively traverses a node and its children, applying visitor functions
 */
function traverseNode(node: any, visitors: NodeVisitors): void {
  if (!node) return;
  
  // Apply the appropriate visitor based on node type
  if (node.type === 'section' && visitors.section) {
    visitors.section(node);
  } else if (node.type === 'section-container' && visitors.sectionContainer) {
    visitors.sectionContainer(node);
  } else if (node.type === 'paragraph' && visitors.paragraph) {
    visitors.paragraph(node);
  } else if (node.type === 'heading' && visitors.heading) {
    visitors.heading(node);
  } else if (node.type === 'untitled-section' && visitors.untitledSection) {
    visitors.untitledSection(node);
  }
  
  // Recursively process children
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      traverseNode(child, visitors);
    }
  }
  
  // Recursively process summary if it exists
  if (node.summary && Array.isArray(node.summary)) {
    for (const item of node.summary) {
      traverseNode(item, visitors);
    }
  }
}
