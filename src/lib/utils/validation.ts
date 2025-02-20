export const isValidUrl = (url: string): boolean => {
	try {
		const newUrl = new URL(url);
		const hostPattern = /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

		return ['http:', 'https:'].includes(newUrl.protocol) && hostPattern.test(newUrl.hostname);
	} catch {
		return false;
	}
};

export const isValidShortUrl = (shortUrl: string): boolean => {
	return /^[a-zA-Z0-9-_]+$/.test(shortUrl);
};
