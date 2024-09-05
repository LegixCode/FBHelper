export const API_VER = "v15.0";

export class FBGraphApi {
    static get(path: string, queryParams: { [key: string]: string }, accessToken: string): Promise<Response> {
        const queryString = new URLSearchParams({
            ...queryParams,
            access_token: accessToken,
            include_headers: "false",
        }).toString();

        return fetch(`https://graph.facebook.com/${API_VER}/${path}?${queryString}`).then((response) =>
            response.json()
        );
    }

    static post(path: string, queryParams: { [key: string]: string }, accessToken: string): Promise<Response> {
        const body = {
            ...queryParams,
            access_token: accessToken,
            include_headers: "false",
        };
        return fetch(`https://graph.facebook.com/${API_VER}/${path}`, {
            method: "POST",
            headers: {
                accept: "*/*",
                "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                "content-type": "application/json",
            },
            body: JSON.stringify(body),
        }).then((response) => response.json());
    }
}
