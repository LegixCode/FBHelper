export type TCookies = ICookiesItem[];

export interface ICookiesItem {
    domain?: string | undefined;
    path?: string | undefined;
    name?: string | undefined;
    value?: string | undefined;
    expirationDate?: number | undefined;
}

export function netscapeToJson(netscape: string): string {
    const cookies: TCookies = [];
    const lines = netscape.split("\n");
    for (const line of lines) {
        const values = line.split("\t");
        cookies.push({
            domain: values[0],
            path: values[2],
            name: values[5],
            value: values[6],
            expirationDate: Number(values[4]),
        });
    }
    return JSON.stringify(cookies);
}
