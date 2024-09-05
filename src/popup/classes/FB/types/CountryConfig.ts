export interface ICountryConfig {
    tz: number;
    zip: string;
    currency: string;
    country: string;
    state: string;
}

export class CountryConfig implements ICountryConfig {
    tz: number = 116;
    zip: string = "";
    currency: string = "USD";
    country: string = "US";
    state: string = "CA";

    public constructor(data?: ICountryConfig | null) {
        if (data) {
            if (data.tz) this.tz = data.tz;
            if (data.zip) this.zip = data.zip;
            if (data.currency) this.currency = data.currency;
            if (data.country) this.country = data.country;
            if (data.state) this.state = data.state;
        }
    }

    public static makeFromLocalStorage(): CountryConfig {
        const dataString = localStorage.getItem("action");
        return dataString ? new CountryConfig(JSON.parse(dataString)) : new CountryConfig();
    }

    public saveToLocalStorage() {
        localStorage.setItem("action", JSON.stringify(this));
    }
}
