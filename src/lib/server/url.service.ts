import { ValidationError } from '$lib/utils';
import type { ClickStat } from '../types';
import type { KVRepository } from './kv';

export class URLService {
	private readonly kv: KVRepository;

	constructor(kv: KVRepository) {
		this.kv = kv;
	}

	private async incrementClickCount(shortUrl: string): Promise<void> {
		const counterKey = `clicks:${shortUrl}`;
		const currentCount = (await this.kv.get<number>(counterKey)) || 0;
		await this.kv.set(counterKey, currentCount + 1);
	}

	private async getPaginatedKeys(
		prefix?: string,
		page = 1,
		limit?: number
	): Promise<{
		total: number;
		page: number;
		pages: number;
		keys: string[];
		limit: number;
	}> {
		const allKeys = await this.kv.listAllKeys(prefix);

		if (!limit) {
			return {
				page: 1,
				pages: 1,
				total: allKeys.length,
				limit: allKeys.length,
				keys: allKeys
			};
		}

		const offset = (page - 1) * limit;
		const pages = Math.ceil(allKeys.length / limit);
		const total = allKeys.length;
		const keys = allKeys.slice(offset, offset + limit);

		return {
			page,
			pages,
			total,
			limit,
			keys
		};
	}

	async getShortLinksByPageAndLimit(
		page = 1,
		limit = 100
	): Promise<{
		page: number;
		pages: number;
		total: number;
		limit: number;
		links: string[];
	}> {
		const { keys, ...rest } = await this.getPaginatedKeys('short:', page, limit);
		return {
			...rest,
			links: keys.map((key) => key.replace(/^short:/, ''))
		};
	}

	async getLinkStatsByPageAndLimit(
		shortUrl: string,
		page = 1,
		limit = 100
	): Promise<{
		page: number;
		pages: number;
		total: number;
		limit: number;
		stats: ClickStat[];
	}> {
		const prefix = `stats:${shortUrl}:`;
		const {
			keys,
			total,
			page: currentPage,
			pages: totalPages
		} = await this.getPaginatedKeys(prefix, page, limit);

		const stats = await Promise.all(keys.map((key) => this.kv.getMetadata<ClickStat>(key)));

		return {
			page: currentPage,
			pages: totalPages,
			total,
			limit,
			stats: stats.filter((stat): stat is ClickStat => stat !== null)
		};
	}

	async createShortUrl(shortUrl: string, originalUrl: string): Promise<void> {
		const key = `short:${shortUrl}`;
		const existing = await this.kv.get<string>(key);

		if (existing) {
			throw new ValidationError('shortUrl', 'The short URL already exists');
		}

		await this.kv.set(key, originalUrl);
	}

	async getOriginalUrl(shortUrl: string): Promise<string | null> {
		return this.kv.get<string>(`short:${shortUrl}`);
	}

	async getClickCount(shortUrl: string): Promise<number> {
		return (await this.kv.get<number>(`clicks:${shortUrl}`)) || 0;
	}

	async logClick(
		shortUrl: string,
		userAgent: string | null,
		ip: string | null,
		geo: string | null
	): Promise<void> {
		const timestamp = Date.now();
		const key = `stats:${shortUrl}:${timestamp}`;

		await this.kv.set(key, '', {
			timestamp,
			userAgent,
			ip,
			geo
		});

		await this.incrementClickCount(shortUrl);
	}

	async deleteAll(): Promise<void> {
		const { keys } = await this.kv.list('');
		await Promise.all(keys.map((key) => this.kv.delete(key)));
	}
}
