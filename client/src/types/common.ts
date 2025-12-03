export interface ApiErrorShape {
    status?: number;
    message: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}
