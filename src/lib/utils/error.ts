export class ValidationError extends Error {
	constructor(
		public field: string,
		public message: string,
		public status = 400
	) {
		super(message);
	}
}

export const createFieldError = (field: string, message: string) => ({
	error: { field, message }
});
