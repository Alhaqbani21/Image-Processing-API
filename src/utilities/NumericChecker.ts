export function isNumeric(value: unknown): boolean {
    if (typeof value === 'number' || typeof value === 'string') {
        return /^-?\d+$/.test(value.toString());
    }
    return false;
}
