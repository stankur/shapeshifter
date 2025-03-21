import type { Refs } from '$lib/components/Document.svelte';
import { onDestroy } from 'svelte';

export function registerRef(
	node: HTMLElement,
	params: {
		id: string;
		refs: Refs;
		animateOptions: {
			animateAbsolute: boolean;
			animateNested: boolean;
		};
	}
) {
    
    params.refs[params.id] = {
		element: node,
		animateAbsolute: params.animateOptions.animateAbsolute,
		animateNested: params.animateOptions.animateNested
	};

	onDestroy(() => {
		delete params.refs[params.id];
	});
}
