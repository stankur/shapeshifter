import Card from './view/collection/section-container/Card/Card.svelte';
import Section from './view/collection/section/Default.svelte';
import Heading from './view/content/Heading.svelte';
import Paragraph from './view/content/Paragraph.svelte';
import TableOfContents from './view/collection/section-container/TableOfContent/TableOfContents.svelte';
import Default from './view/collection/section-container/Default/Default.svelte';
import Sidebar from './view/collection/section-container/Sidebar.svelte';
import Tabs from './view/collection/section-container/Tabs/Tabs.svelte';

export const registry = {
	'content/paragraph/default': Paragraph,
	'content/heading/default': Heading,
	'collection/section/default': Section,
	'collection/section-container/card': Card,
	'collection/section-container/table-of-contents': TableOfContents,
	'collection/section-container/default': Default,
	'collection/section-container/sidebar': Sidebar,
	'collection/section-container/tabs': Tabs
};
