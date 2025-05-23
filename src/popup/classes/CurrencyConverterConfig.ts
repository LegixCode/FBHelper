export interface ICurrencyConverterConfig {
    is_active: boolean;
}

export class CurrencyConverterConfig implements ICurrencyConverterConfig {
    is_active: boolean = false;

    public constructor(data?: ICurrencyConverterConfig | null) {
        if (data) {
            if (data.is_active) this.is_active = data.is_active;
        }
    }

    public static makeFromChromeStorage(callback: (config: CurrencyConverterConfig) => void): void {
        chrome.storage.local.get(["currency_converter"]).then((result) => {
            callback(
                result.currency_converter
                    ? new CurrencyConverterConfig(JSON.parse(result.currency_converter))
                    : new CurrencyConverterConfig()
            );
        });
    }

    public saveToChromeStorage() {
        chrome.storage.local.set({
            currency_converter: JSON.stringify(this),
        });
    }
}
