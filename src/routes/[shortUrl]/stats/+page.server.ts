import type { PageServerLoad } from './$types';
import { URLService } from '$lib/server/url.service';
import { KVRepository } from '$lib/server/kv';

export const load: PageServerLoad = async ({ params, platform, url }) => {
	if (!platform || !platform.env || !platform.env.URL_SHORTENER_KV) {
		throw new Error('Platform or URL_SHORTENER_KV is not defined');
	}

	const kv = new KVRepository(platform.env.URL_SHORTENER_KV);
	const urlService = new URLService(kv);
	const { shortUrl } = params;

	const cursor = url.searchParams.get('cursor') ?? undefined;
	const limit = Number(url.searchParams.get('limit')) || 20;

	const [{ stats, currentPage, total, totalPages, prevCursor, nextCursor }, clickCount] =
		await Promise.all([
			urlService.getStats(shortUrl, limit, cursor),
			urlService.getClickCount(shortUrl)
		]);

	return {
		stats,
		total,
		currentPage,
		totalPages,
		prevCursor,
		nextCursor,
		clickCount,
		shortUrl,
		limit,
		cursor
	};
};
