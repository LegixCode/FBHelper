export interface ITranslateConfig {
    is_active: boolean;
}

export class TranslateConfig implements ITranslateConfig {
    is_active: boolean = false;

    public constructor(data?: ITranslateConfig | null) {
        if (data) {
            if (data.is_active) this.is_active = data.is_active;
        }
    }

    public static makeFromLocalStorage(): TranslateConfig {
        const dataString = localStorage.getItem("translate");
        return dataString ? new TranslateConfig(JSON.parse(dataString)) : new TranslateConfig();
    }

    public saveToLocalStorage() {
        localStorage.setItem("translate", JSON.stringify(this));
    }
}
