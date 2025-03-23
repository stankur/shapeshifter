export type NavigationHandler = () => string | null;

export interface NavigationProps {
	getNextEditable?: NavigationHandler;
	getPrevEditable?: NavigationHandler;
}
