# Adding New Functionality to the Editor

This guide explains the process of adding new functionality to the editor, following the established patterns used throughout the application. It covers the entire process from defining actions to connecting them with the UI through the component hierarchy.

## Overview of the Pattern

Our application follows a consistent pattern for implementing new functionality:

1. **Define Actions**: Create functions in the actions file that handle the core logic and directly mutate the data
2. **Propagate Through Component Hierarchy**: Pass callbacks down through the component tree
3. **Create UI Controls**: Add controls that trigger the actions
4. **Connect Everything**: Wire up the UI controls to the actions through the component hierarchy

This pattern leverages Svelte 5's runes and reactivity system, which can detect mutations to objects, along with the component hierarchy to create a clean, maintainable architecture.

## Step 1: Define Actions in the Actions File

All core functionality should be defined in the appropriate actions file (e.g., `src/lib/actions/collection.svelte.ts`).

### Guidelines for Action Functions:

- **Direct Mutations**: Actions directly mutate the data, which Svelte 5 can detect through runes
- **Clear Parameters**: Use explicit typing for parameters
- **Documentation**: Add JSDoc comments explaining the purpose and parameters

### Example: Adding a Section Split Action

```typescript
/**
 * Splits a section at a paragraph, creating a new section with the paragraph as its heading
 * 
 * @param node The section to split
 * @param paragraphId The ID of the paragraph to convert to a heading
 * @param addSection Callback to add the new section to the container
 */
export function splitSection(
  node: Section,
  paragraphId: string,
  addSection: (section: Section) => void
) {
  const newId = crypto.randomUUID();
  const paragraphIndex = node.children.findIndex((child) => child.id === paragraphId);
  
  // Validation
  if (paragraphIndex === -1 || node.children[paragraphIndex].type !== 'paragraph') {
    return;
  }

  const paragraph = node.children[paragraphIndex];

  // Create new section
  const newSection: Section = {
    type: 'section',
    id: newId,
    created: new Date().toISOString(),
    last_modified: new Date().toISOString(),
    view: [
      { type: 'collection/section/default', state: 'expanded' },
      { type: 'collection/section/static' },
      { type: 'collection/section/page' }
    ],
    heading: {
      type: 'heading',
      id: paragraphId,
      created: paragraph.created,
      last_modified: new Date().toISOString(),
      view: [{ type: 'content/heading/default' }],
      content: paragraph.content,
      level: node.heading.level,
      activeView: 'content/heading/default'
    },
    summary: [],
    children: node.children.slice(paragraphIndex + 1),
    activeView: 'collection/section/default'
  };

  // Directly mutate the original section - Svelte 5 will detect this change
  node.children = node.children.slice(0, paragraphIndex);

  // Add the new section using the provided callback
  addSection(newSection);
}
```

## Step 2: Propagate Through Component Hierarchy

For the action to be accessible where needed, we need to pass callbacks down through the component hierarchy.

### The Propagation Pattern:

1. **Top-Level Container**: Defines the base implementation of the action
2. **Intermediate Components**: Pass the action down, potentially with additional context
3. **Leaf Components**: Trigger the action when appropriate

### Example: Propagating Section Split Functionality

#### 1. Section Container Component (Top Level)

```svelte
<script lang="ts">
  import { addSectionToContainer } from '$lib/actions/collection.svelte';
  
  let {
    node, // SectionContainer
    refs,
    onUnmount
  } = $props();
  
  let { children } = $derived(node);

  let ChildrenRenderers = $derived(
    children.map((child, index) => ({
      child,
      Renderer: registry[child.activeView as keyof typeof registry],
      // Create a specialized addSection function for each child
      addSectionForChild: (section: Section) => addSectionToContainer(node, section, index + 1)
    }))
  );
</script>

<div class="flex flex-col gap-12">
  {#each ChildrenRenderers as { child, Renderer, addSectionForChild }}
    <Renderer 
      node={child} 
      {refs} 
      {onUnmount} 
      addSection={addSectionForChild}
    />
  {/each}
</div>
```

#### 2. Section Component (Intermediate)

```svelte
<script lang="ts">
  import { splitSection } from '$lib/actions/collection.svelte';
  
  let {
    node, // Section
    refs,
    onUnmount,
    addSection // Function passed from parent
  } = $props();
  
  // Other component logic...
</script>

<!-- Pass the functionality down to child components -->
<Renderer
  bind:node={node.children[i]}
  onConvertToHeading={(paragraphId) => {
    splitSection(node, paragraphId, addSection);
  }}
  {refs}
  {onUnmount}
/>
```

#### 3. Paragraph Component (Leaf)

```svelte
<script lang="ts">
  let {
    node, // Paragraph
    refs,
    onUnmount,
    onConvertToHeading // Function passed from parent
  } = $props();
  
  let isParagraphHovered = $state(false);
</script>

<div
  class="relative"
  bind:this={ref}
  onmouseenter={() => isParagraphHovered = true}
  onmouseleave={() => isParagraphHovered = false}
>
  <!-- Paragraph content -->
  
  {#if onConvertToHeading && documentNode.state.mode !== 'read'}
    <ParagraphControls 
      {isParagraphHovered} 
      onConvertToHeading={() => onConvertToHeading(node.id)} 
    />
  {/if}
</div>
```

## Step 3: Create UI Controls

UI controls provide the interface for users to trigger actions. Follow the pattern in `guides/creating-controls.md` for creating controls.

### Example: Paragraph Controls for Section Split

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { float } from '$lib/view/utils/float.svelte';

  let {
    onConvertToHeading,
    isParagraphHovered
  } = $props();

  let isHovered = $state(false);
  let floatingElement: HTMLDivElement;
  let referenceElement: HTMLDivElement;

  function showControls() {
    isHovered = true;
  }

  function hideControls() {
    isHovered = false;
  }

  onMount(() => {
    return float(referenceElement, floatingElement, 'left')();
  });
</script>

<div
  bind:this={floatingElement}
  onmouseenter={showControls}
  onmouseleave={hideControls}
  class={[
    'floating-controls flex items-center space-x-2 rounded bg-white/80 px-2 py-1 shadow-sm backdrop-blur-sm',
    isHovered || isParagraphHovered ? 'visible' : 'invisible'
  ]}
>
  <button
    class="text-sm font-semibold text-gray-700 hover:text-blue-600"
    onclick={onConvertToHeading}
    title="Convert to heading and create new section"
  >
    H
  </button>
</div>

<div bind:this={referenceElement} class="reference-element w-full"></div>

<style lang="postcss">
  .floating-controls {
    position: absolute;
    width: max-content;
    z-index: 10;
  }
</style>
```

## Step 4: Connect Everything

Ensure all the pieces are properly connected:

1. **Type Definitions**: Update component prop types to include the new callbacks
2. **Conditional Rendering**: Only show controls when appropriate
3. **Error Handling**: Add validation in action functions

## Complete Example: Adding "Convert to Heading" Functionality

Let's walk through the complete process of adding the "Convert Paragraph to Heading" functionality:

### 1. Define the Action in `collection.svelte.ts`

```typescript
export function splitSection(
  node: Section,
  paragraphId: string,
  addSection: (section: Section) => void
) {
  // Implementation as shown above
}

export function addSectionToContainer(container: SectionContainer, section: Section, index?: number) {
  if (index !== undefined && index >= 0 && index <= container.children.length) {
    // Direct mutation - Svelte 5 will detect this
    container.children.splice(index, 0, section);
  } else {
    // Direct mutation - Svelte 5 will detect this
    container.children.push(section);
  }
  container.last_modified = new Date().toISOString();
}
```

### 2. Update Section Container Component

```svelte
<!-- Section Container Component -->
<script>
  // Create specialized addSection functions for each child
  let ChildrenRenderers = $derived(
    children.map((child, index) => ({
      child,
      Renderer: registry[child.activeView as keyof typeof registry],
      addSectionForChild: (section: Section) => addSectionToContainer(node, section, index + 1)
    }))
  );
</script>

<div>
  {#each ChildrenRenderers as { child, Renderer, addSectionForChild }}
    <Renderer 
      node={child} 
      {refs} 
      {onUnmount} 
      addSection={addSectionForChild}
    />
  {/each}
</div>
```

### 3. Update Section Component

```svelte
<!-- Section Component -->
<script>
  type Props = {
    node: Section;
    refs: Refs;
    onUnmount: () => void;
    overRides: { heading: boolean };
    addSection: (section: Section) => void;
  };
  
  let { node, refs, onUnmount, overRides = { heading: true }, addSection } = $props();
</script>

<div>
  <!-- Other content -->
  {#each ChildrenRenderers as { Renderer }, i}
    <Renderer
      bind:node={node.children[i]}
      onConvertToHeading={(paragraphId) => {
        splitSection(node, paragraphId, addSection);
      }}
      {refs}
      {onUnmount}
    />
  {/each}
</div>
```

### 4. Update Paragraph Component

```svelte
<!-- Paragraph Component -->
<script>
  type Props = {
    node: ContentParagraph;
    refs: Record<string, { element: HTMLElement; animateAbsolute: boolean; animateNested: boolean }>;
    additionalFlipId?: string;
    updateParent: () => void;
    onUnmount: () => void;
    onSplit: (blocks: [string, string]) => void;
    onConvertToHeading?: (paragraphId: string) => void;
    getNextEditable?: NavigationHandler;
    getPrevEditable?: NavigationHandler;
  };
  
  let { 
    node, 
    refs, 
    onUnmount, 
    onSplit, 
    onConvertToHeading,
    // Other props 
  } = $props();
  
  let isParagraphHovered = $state(false);
</script>

<div
  class="relative"
  onmouseenter={() => isParagraphHovered = true}
  onmouseleave={() => isParagraphHovered = false}
>
  <!-- Paragraph content -->
  
  {#if onConvertToHeading && documentNode.state.mode !== 'read'}
    <ParagraphControls 
      {isParagraphHovered} 
      onConvertToHeading={() => onConvertToHeading(node.id)} 
    />
  {/if}
</div>
```

### 5. Create ParagraphControls Component

```svelte
<!-- ParagraphControls Component -->
<script>
  let {
    onConvertToHeading,
    isParagraphHovered
  } = $props();
  
  // Control implementation as shown above
</script>

<!-- Control UI -->
```

## Adding Other Types of Functionality

This pattern can be applied to many different types of functionality:

### Example: Adding a New Tab

1. **Define Action**: Create an `addTab` function in the actions file that directly mutates the container
2. **Propagate**: Pass the function down through the component hierarchy
3. **Create Control**: Add a "+" button in the tab container
4. **Connect**: Wire up the button to call the action

### Example: Rearranging Tabs

1. **Define Action**: Create a `moveTab` function in the actions file that directly mutates the array
2. **Propagate**: Pass the function down with the necessary context
3. **Create Controls**: Add up/down arrows to tab controls
4. **Connect**: Wire up the arrows to call the action with the appropriate indices

## Best Practices

1. **Leverage Svelte 5 Reactivity**: Take advantage of Svelte 5's ability to detect mutations through runes
2. **Type Everything**: Use TypeScript to ensure type safety throughout the chain
3. **Specialized Callbacks**: Create specialized callbacks at each level rather than passing generic ones
4. **Validation**: Add validation in action functions to prevent invalid operations
5. **Documentation**: Document the purpose and parameters of each action function

## Troubleshooting

If your new functionality isn't working as expected, check:

1. **Prop Passing**: Ensure all props are correctly passed down the component chain
2. **Type Definitions**: Verify that component prop types include the new callbacks
3. **Action Implementation**: Check that the action function correctly mutates the data
4. **Control Visibility**: Ensure controls are visible when they should be
5. **Event Handlers**: Verify that event handlers are correctly attached

By following this pattern, you can add new functionality to the editor in a consistent, maintainable way that integrates seamlessly with the existing architecture and takes full advantage of Svelte 5's reactivity system.
