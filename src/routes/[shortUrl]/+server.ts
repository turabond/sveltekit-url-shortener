import { redirect, error, type RequestHandler } from '@sveltejs/kit';
import { URLService } from '$lib/server/url.service';
import { KVRepository } from '$lib/server/kv';

export const GET: RequestHandler = async ({ params, platform, request }) => {
	if (!platform || !platform.env || !platform.env.URL_SHORTENER_KV) {
		throw error(404, 'Platform or URL_SHORTENER_KV is not defined');
	}

	const kv = new KVRepository(platform.env.URL_SHORTENER_KV);
	const urlService = new URLService(kv);

	const shortUrl = params.shortUrl;
	if (!shortUrl) {
		return new Response('shortUrl not found', { status: 404 });
	}

	const originalUrl = await urlService.getOriginalUrl(shortUrl);

	if (!originalUrl) {
		return new Response('URL not found', { status: 404 });
	}

	const userAgent = request.headers.get('user-agent');
	const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('X-Forwarded-For');
	const geo = request.headers.get('CF-IPCountry');

	await urlService.logClick(shortUrl, userAgent, ip, geo);

	throw redirect(302, originalUrl);
};
