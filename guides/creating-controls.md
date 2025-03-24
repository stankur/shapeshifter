# Creating Controls in the Editor

This guide explains how to create new control components for the editor, following the established patterns used throughout the application.

## Control Component Pattern

Controls in our editor follow a consistent pattern:

1. They use the floating UI pattern to position themselves relative to their target element
2. They handle their own visibility based on hover state
3. They maintain a clean separation from the content they control

## Types of Controls

Our application uses several types of controls:

1. **Simple Action Controls**: Provide basic actions like the paragraph-to-heading conversion
2. **View Switching Controls**: Allow changing between different view types
3. **Configuration Controls**: Provide complex configuration options for a view

## Step-by-Step Guide

### 1. Create the Control Component

Create a new Svelte component for your control with this structure:

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { float } from '$lib/view/utils/float.svelte';

  // Define props - these will vary based on control type
  let {
    // Common props
    onUnmount,
    isParentHovered,
    
    // For node-modifying controls, include the node
    node,
    
    // For configuration controls, include config options
    configOptions
  } = $props();

  // Track the control's own hover state
  let isHovered = $state(false);
  
  // References to the floating element and its anchor
  let floatingElement: HTMLDivElement;
  let referenceElement: HTMLDivElement;

  // Show/hide control methods
  function showControls() {
    isHovered = true;
  }

  function hideControls() {
    isHovered = false;
  }

  // Set up floating behavior on mount
  onMount(() => {
    return float(referenceElement, floatingElement)();
  });
</script>

<!-- The floating control element -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  bind:this={floatingElement}
  onmouseenter={showControls}
  onmouseleave={hideControls}
  class={[
    'floating-controls [your-styling-classes]',
    isHovered || isParentHovered ? 'visible' : 'invisible'
  ]}
>
  <!-- Your control buttons/UI -->
  <!-- For simple controls: -->
  <button 
    class="[your-button-styling]"
    onclick={yourActionHandler}
    title="Action description"
  >
    Button Text
  </button>
  
  <!-- For view switching controls: -->
  <button
    onclick={() => {
      onUnmount();
      node.activeView = 'new/view/type';
    }}
  >
    View Name
  </button>
  
  <!-- For configuration controls: -->
  <input
    type="range"
    min="0"
    max="72"
    bind:value={configOptions.someValue}
    onchange={(event) => {
      configOptions.someValue = parseInt((event.target as HTMLInputElement).value);
    }}
  />
</div>

<!-- The reference element that anchors the floating control -->
<div bind:this={referenceElement} class="reference-element w-full"></div>

<style lang="postcss">
  .floating-controls {
    position: absolute;
    width: max-content;
    z-index: 10;
  }
</style>
```

### 2. Use the Control in a Parent Component

In the parent component:

1. Import your control component
2. Add a state variable to track hover state
3. Include the control component in your template
4. Pass the necessary props including hover state, node, and configuration options

```svelte
<script lang="ts">
  import YourControl from './YourControl.svelte';
  
  // Add hover state
  let isParentHovered = $state(false);
  
  // Get node and other props from component props
  let { node, onUnmount } = $props();
  
  // For configuration controls, prepare config options
  let configOptions = $state(/* initial values */);
</script>

<div 
  class="your-parent-element"
  onmouseenter={() => isParentHovered = true}
  onmouseleave={() => isParentHovered = false}
>
  <!-- Your content -->
  
  <!-- Include the control -->
  <YourControl 
    {isParentHovered}
    {node}
    {onUnmount}
    {configOptions}
  />
</div>
```

## Control Types in Detail

### 1. Simple Action Controls

These controls provide basic actions like converting a paragraph to a heading.

Example: `ParagraphControls.svelte`

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { float } from '$lib/view/utils/float.svelte';

  let {
    onConvertToHeading,
    isParagraphHovered
  }: {
    onConvertToHeading: () => void;
    isParagraphHovered: boolean;
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

<!-- Control UI -->
```

### 2. View Switching Controls

These controls allow changing between different view types for a node.

Example: `Card/Controls.svelte`

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import { float } from '$lib/view/utils/float.svelte';

  let {
    node,
    onUnmount,
    isCardHovered
  }: {
    node: any;
    onUnmount: () => void;
    isCardHovered: boolean;
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

  function switchToDefault() {
    onUnmount();
    node.activeView = 'collection/section-container/default';
  }

  onMount(() => {
    return float(referenceElement, floatingElement)();
  });
</script>

<!-- Control UI with view switching buttons -->
```

### 3. Configuration Controls

These controls provide complex configuration options for a view.

Example: `TableOfContent/Controls.svelte`

```svelte
<script lang="ts">
  import { onMount } from 'svelte';
  import type { z } from 'zod';
  import type { sectionContainer } from '$lib/model/collection';
  import { float } from '$lib/view/utils/float.svelte';

  let {
    node,
    onUnmount,
    directions,
    isTableHovered
  }: {
    node: z.infer<typeof sectionContainer>;
    onUnmount: () => void;
    directions: {
      type: string;
      perRow?: number;
      gap?: number;
      interGenerationGap: number;
      innerGap: number;
      innerDirection: string;
    }[];
    isTableHovered: boolean;
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
    return float(referenceElement, floatingElement)();
  });
</script>

<!-- Control UI with configuration options -->
```

## Placement Options

The `float` utility accepts these placement options:

- `'left-start'` (default): Position the control to the left, aligned with the top of the reference element
- `'left'`: Position the control to the left, centered vertically with the reference element

Choose the placement that best fits your UI needs.

## Best Practices

1. **Visibility Logic**: Controls should only be visible when:
   - The parent element is hovered OR
   - The control itself is hovered

2. **Styling**:
   - Use consistent styling with other controls
   - Keep controls compact and unobtrusive
   - Use appropriate z-index to ensure controls appear above content

3. **Node Modifications**:
   - When modifying node properties directly, always call `onUnmount()` first
   - For view switching, update the `activeView` property
   - For configuration, update the appropriate state properties

4. **Performance**:
   - Controls should be lightweight and not affect editor performance
   - Use bind:value for form controls when appropriate
   - Handle change events efficiently

5. **Component Structure**:
   - Always include both the floating element and reference element
   - Use consistent naming for hover state variables
   - Follow the established pattern for show/hide methods

By following these patterns, your controls will integrate seamlessly with the rest of the editor and provide a consistent user experience.
