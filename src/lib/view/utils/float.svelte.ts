import { autoUpdate } from '@floating-ui/dom';
import { computePosition } from '@floating-ui/dom';
import { shift } from '@floating-ui/dom';

/**
 * Calculate z-index based on path length
 * @param path The path array representing the node's position in the document hierarchy
 * @returns A z-index value where deeper nodes get higher values
 */
export function calculateZIndex(path: (string | number)[]): number {
	// Base z-index value (for outermost elements)
	const baseZIndex = 1;
	// Z-index increment per level of nesting
	const zIndexIncrement = 1;
	// Calculate z-index based on path length
	return baseZIndex + (path.length * zIndexIncrement);
}

export function float(
	referenceElement: HTMLElement, 
	floatingElement: HTMLElement, 
	placement: 'left-start' | 'left' = 'left-start', 
	useShift: boolean = true,
	zIndex?: number
) {
	return () => {
		let cleanup: () => void;
		if (referenceElement && floatingElement) {
			cleanup = autoUpdate(referenceElement, floatingElement, () => {
				computePosition(referenceElement, floatingElement, {
					placement,
					middleware: useShift ? [shift({ crossAxis: true })] : []
				}).then(({ x, y }) => {
					if (zIndex !== undefined) {
						Object.assign(floatingElement.style, {
							left: `${x}px`,
							top: `${y}px`,
							zIndex: zIndex.toString()
						});
					} else {
						Object.assign(floatingElement.style, {
							left: `${x}px`,
							top: `${y}px`
						});
					}
				});
			});
		}

		return () => {
			cleanup?.();
		};
	};
}
