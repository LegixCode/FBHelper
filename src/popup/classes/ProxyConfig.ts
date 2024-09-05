export interface IProxyConfig {
    activated: boolean;
    host: string;
    port: string;
    username: string;
    password: string;
}

export class ProxyConfig implements IProxyConfig {
    activated: boolean = false;
    host: string = "";
    port: string = "";
    username: string = "";
    password: string = "";

    public constructor(data?: IProxyConfig | null) {
        if (data) {
            if (data.activated) this.activated = data.activated;
            if (data.host) this.host = data.host;
            if (data.port) this.port = data.port;
            if (data.username) this.username = data.username;
            if (data.password) this.password = data.password;
        }
    }

    public static makeFromLocalStorage(): ProxyConfig {
        const dataString = localStorage.getItem("proxy");
        return dataString ? new ProxyConfig(JSON.parse(dataString)) : new ProxyConfig();
    }

    public saveToLocalStorage() {
        localStorage.setItem("proxy", JSON.stringify(this));
    }
}
