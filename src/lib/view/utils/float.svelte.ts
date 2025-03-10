import { autoUpdate } from '@floating-ui/dom';

import { computePosition } from '@floating-ui/dom';

import { shift } from '@floating-ui/dom';

export function float(referenceElement: HTMLElement, floatingElement: HTMLElement, placement: 'left-start' | 'left' = 'left-start') {
	return () => {
		let cleanup: () => void;
		if (referenceElement && floatingElement) {
			cleanup = autoUpdate(referenceElement, floatingElement, () => {
				computePosition(referenceElement, floatingElement, {
					placement,
					middleware: [shift({ crossAxis: true })]
				}).then(({ x, y }) => {
					Object.assign(floatingElement.style, {
						left: `${x}px`,
						top: `${y}px`
					});
				});
			});
		}

		return () => {
			cleanup?.();
		};
	};
}
