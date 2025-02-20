import type { PageServerLoad } from './$types';
import { KVRepository } from '$lib/server/kv';
import { URLService } from '$lib/server/url.service';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ platform, url }) => {
	if (!platform || !platform.env || !platform.env.URL_SHORTENER_KV) {
		throw error(404, 'Platform or URL_SHORTENER_KV is not defined');
	}

	const kv = new KVRepository(platform.env.URL_SHORTENER_KV);
	const urlService = new URLService(kv);

	const page = Number(url.searchParams.get('page')) || 1;
	const limit = Number(url.searchParams.get('limit')) || 20;

	return await urlService.getShortLinksByPageAndLimit(page, limit);
};
