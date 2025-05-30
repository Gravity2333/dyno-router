export function encodeToBase64(str: string) {
    return btoa(unescape(encodeURIComponent(str)));
}