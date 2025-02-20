import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { URLService } from '$lib/server/url.service';
import { KVRepository } from '$lib/server/kv';

export const load: PageServerLoad = async ({ params, platform, url }) => {
	if (!platform || !platform.env || !platform.env.URL_SHORTENER_KV) {
		throw error(404, 'Platform or URL_SHORTENER_KV is not defined');
	}

	const kv = new KVRepository(platform.env.URL_SHORTENER_KV);
	const urlService = new URLService(kv);
	const { shortUrl } = params;

	const page = Number(url.searchParams.get('page')) || 1;
	const limit = Number(url.searchParams.get('limit')) || 20;

	const [{ stats, ...rest }, clickCount] = await Promise.all([
		urlService.getLinkStatsByPageAndLimit(shortUrl, page, limit),
		urlService.getClickCount(shortUrl)
	]);

	return {
		...rest,
		shortUrl,
		stats,
		clickCount
	};
};
