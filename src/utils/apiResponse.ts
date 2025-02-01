export class ApiResponse<T> {
    constructor(
        public message: string,
        public data: T | null = null,
        public status: number = 200,
        public success: boolean = true
    ) { }
}