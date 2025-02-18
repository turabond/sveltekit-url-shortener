import type { KVNamespace } from '@cloudflare/workers-types';

export class KVRepository {
	private readonly kv: KVNamespace;

	constructor(kv: KVNamespace) {
		this.kv = kv;
	}

	async get<T>(key: string): Promise<T | null> {
		return this.kv.get<T>(key, 'json');
	}

	async set<T>(
		key: string,
		value: T,
		metadata?: Record<string, unknown>,
		expirationTtl?: number
	): Promise<void> {
		await this.kv.put(key, JSON.stringify(value), { metadata, expirationTtl });
	}

	async getMetadata<T>(key: string): Promise<T | null> {
		const data = await this.kv.getWithMetadata<null, T>(key, 'json');
		return data?.metadata ?? null;
	}

	async list(
		prefix: string,
		limit = 1000,
		cursor?: string
	): Promise<{ keys: string[]; nextCursor?: string; total: number }> {
		const { keys: totalKeys } = await this.kv.list({ prefix });
		const total = totalKeys.length;

		const response = await this.kv.list({ prefix, limit, cursor });
		const nextCursor = response.list_complete ? undefined : response.cursor;

		return {
			keys: response.keys.map((k) => k.name),
			nextCursor,
			total
		};
	}

	async delete(key: string): Promise<void> {
		await this.kv.delete(key);
	}
}
