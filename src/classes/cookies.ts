import { getCookies } from "@/utils/chromeMethods";

export type TCookies = ICookiesItem[];

export interface ICookiesItem {
    domain?: string | undefined;
    path?: string | undefined;
    name?: string | undefined;
    value?: string | undefined;
    expirationDate?: number | undefined;
}

export function netscapeToJson(netscape: string): string {
    const cookies: TCookies = netscape.split("\n").map((line) => {
        const values = line.split("\t");
        return {
            domain: values[0],
            path: values[2],
            name: values[5],
            value: values[6],
            expirationDate: Number(values[4]),
        };
    });
    return JSON.stringify(cookies);
}

export function getUserIdFromCookies(callback: (userId: string) => void): void {
    getCookies((cookies) => {
        const userCookie = cookies.find((c) => c.name == "c_user");
        if (userCookie) callback(userCookie.value);
    });
}
