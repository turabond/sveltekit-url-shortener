import type { PageServerLoad } from './$types';
import { KVRepository } from '$lib/server/kv';
import { URLService } from '$lib/server/url.service';

export const load: PageServerLoad = async ({ platform, url }) => {
	if (!platform || !platform.env || !platform.env.URL_SHORTENER_KV) {
		throw new Error('Platform or URL_SHORTENER_KV is not defined');
	}

	const kv = new KVRepository(platform.env.URL_SHORTENER_KV);
	const urlService = new URLService(kv);

	const cursor = url.searchParams.get('cursor') ?? undefined;
	const limit = Number(url.searchParams.get('limit')) || 20;

	const { urls, nextCursor, prevCursor, total, currentPage, totalPages } =
		await urlService.listAllShortUrls(limit, cursor);

	return { urls, nextCursor, prevCursor, limit, currentPage, totalPages, total };
};
