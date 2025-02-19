import { ValidationError } from '$lib/utils';
import type { ClickStat } from '../types';
import type { KVRepository } from './kv';

// TODO: this is not good solution, and should be refactored
// this is needed to keep track of the cursor history for pagination
const cursorHistory: Map<string, string[]> = new Map();

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

	private updateCursorHistory(prefix: string, cursor?: string, nextCursor?: string) {
		if (!cursorHistory.has(prefix)) {
			cursorHistory.set(prefix, []);
		}

		const history = cursorHistory.get(prefix)!;

		if (!cursor) {
			cursorHistory.set(prefix, []);
		}

		if (cursor && !history.includes(cursor)) {
			history.push(cursor);
		}

		if (nextCursor && !history.includes(nextCursor)) {
			history.push(nextCursor);
		}

		return history;
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

	async getStats(
		shortUrl: string,
		limit = 100,
		cursor?: string
	): Promise<{
		stats: ClickStat[];
		nextCursor?: string;
		prevCursor?: string;
		total: number;
		currentPage: number;
		totalPages: number;
	}> {
		const prefix = `stats:${shortUrl}:`;
		const { keys, nextCursor, total } = await this.kv.list(prefix, limit, cursor);
		const stats = await Promise.all(keys.map((key) => this.kv.getMetadata<ClickStat>(key)));

		const history = this.updateCursorHistory(prefix, cursor, nextCursor);

		const totalPages = Math.ceil(total / limit);
		const cursorIndex = cursor ? history.indexOf(cursor) : -1;
		const prevCursor = cursorIndex > 0 ? history[cursorIndex - 1] : cursor ? 'restart' : undefined;
		const currentPage = cursorIndex + 2;

		return {
			stats: stats.filter((stat): stat is ClickStat => stat !== null),
			nextCursor,
			prevCursor,
			total,
			currentPage,
			totalPages
		};
	}

	async listAllShortUrls(
		limit = 100,
		cursor?: string
	): Promise<{
		urls: string[];
		nextCursor?: string;
		prevCursor?: string | 'restart';
		total: number;
		currentPage: number;
		totalPages: number;
	}> {
		const prefix = 'short:';
		const { keys, nextCursor, total } = await this.kv.list(prefix, limit, cursor);
		const history = this.updateCursorHistory(prefix, cursor, nextCursor);

		const totalPages = Math.ceil(total / limit);
		const cursorIndex = cursor ? history.indexOf(cursor) : -1;
		const prevCursor = cursorIndex > 0 ? history[cursorIndex - 1] : cursor ? 'restart' : undefined;
		const currentPage = cursorIndex + 2;

		return {
			urls: keys.map((key) => key.replace(/^short:/, '')),
			nextCursor,
			prevCursor,
			currentPage,
			totalPages,
			total
		};
	}

	async deleteAll(): Promise<void> {
		const { keys } = await this.kv.list('');
		await Promise.all(keys.map((key) => this.kv.delete(key)));
	}
}
