export const load = async ({ params }) => {
	const { slug } = params;
	return { slug };
};

export const ssr = false;
