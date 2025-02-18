export const isValidUrl = (url: string): boolean => {
	try {
		const newUrl = new URL(url);
		return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
	} catch {
		return false;
	}
};

export const isValidShortUrl = (shortUrl: string): boolean => {
	return /^[a-zA-Z0-9-_]+$/.test(shortUrl);
};
