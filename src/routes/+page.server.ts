import type { Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { KVRepository } from '$lib/server/kv';
import { URLService } from '$lib/server/url.service';
import { isValidUrl, isValidShortUrl, createFieldError } from '$lib/utils';

export const actions: Actions = {
	create: async ({ request, platform }) => {
		if (!platform || !platform.env || !platform.env.URL_SHORTENER_KV) {
			throw new Error('Platform or URL_SHORTENER_KV is not defined');
		}

		const kv = new KVRepository(platform.env.URL_SHORTENER_KV);
		const urlService = new URLService(kv);

		const formData = await request.formData();
		const originalUrl = formData.get('originalUrl')?.toString() ?? null;
		const shortUrl = formData.get('shortUrl')?.toString() ?? null;

		if (!originalUrl) return fail(400, createFieldError('originalUrl', 'Please enter a URL'));
		if (!isValidUrl(originalUrl))
			return fail(400, createFieldError('originalUrl', 'Please enter a valid URL'));

		if (!shortUrl) return fail(400, createFieldError('shortUrl', 'Please enter a short URL'));
		if (!isValidShortUrl(shortUrl)) {
			return fail(
				400,
				createFieldError(
					'shortUrl',
					'Short URL can only contain letters, numbers, dashes, and underscores'
				)
			);
		}

		try {
			await urlService.createShortUrl(shortUrl.toString(), originalUrl.toString());
			return { success: true, shortUrl, originalUrl };
		} catch (error) {
			if ((error as Error).message === 'The short URL already exists') {
				return fail(400, createFieldError('shortUrl', 'The short URL already exists'));
			}
			return fail(500, createFieldError('', 'Internal server error'));
		}
	}
};
