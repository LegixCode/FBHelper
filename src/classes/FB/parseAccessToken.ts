export function parseAccessToken(html: string) {
    let token = /"EAAB(.*?)"/gi.exec(html);
    if (token != null) {
        return "EAAB" + token[1];
    }

    throw new Error("Token not found");
}
