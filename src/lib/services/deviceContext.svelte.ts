import { onMount } from 'svelte';

export type DeviceContext = {
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
};

export function createDeviceContext() {
    // Default to desktop view initially
    const deviceState = $state<DeviceContext>({
        isMobile: false,
        isTablet: false,
        isDesktop: true
    });

    // Define breakpoints (in pixels)
    const MOBILE_BREAKPOINT = 768;
    const TABLET_BREAKPOINT = 1024;

    // Function to check device size
    function checkDeviceSize() {
        const width = window.innerWidth;
        deviceState.isMobile = width < MOBILE_BREAKPOINT;
        deviceState.isTablet = width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT;
        deviceState.isDesktop = width >= TABLET_BREAKPOINT;
    }

    // Initialize and set up event listeners
    function initialize() {
        onMount(() => {
            // Check size on mount
            checkDeviceSize();
            
            // Add resize listener
            window.addEventListener('resize', checkDeviceSize);
            
            // Clean up on unmount
            return () => {
                window.removeEventListener('resize', checkDeviceSize);
            };
        });
    }

    return {
        deviceState,
        initialize
    };
}
