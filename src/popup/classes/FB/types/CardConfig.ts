export interface ICardConfig {
    number: string;
    expiry_month: string;
    expiry_year: string;
    cvc: string;
}

export class CardConfig implements ICardConfig {
    number: string = "";
    expiry_month: string = "";
    expiry_year: string = "";
    cvc: string = "";

    public constructor(data?: ICardConfig | null) {
        if (data) {
            if (data.number) this.number = data.number;
            if (data.expiry_month) this.expiry_month = data.expiry_month;
            if (data.expiry_year) this.expiry_year = data.expiry_year;
            if (data.cvc) this.cvc = data.cvc;
        }
    }

    public static makeFromLocalStorage(): CardConfig {
        const dataString = localStorage.getItem("card");
        return dataString ? new CardConfig(JSON.parse(dataString)) : new CardConfig();
    }

    public saveToLocalStorage() {
        localStorage.setItem("card", JSON.stringify(this));
    }
}
