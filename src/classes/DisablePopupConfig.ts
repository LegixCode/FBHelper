export interface IDisablePopupConfig {
    is_active: boolean;
}

export class DisablePopupConfig implements IDisablePopupConfig {
    is_active: boolean = false;

    public constructor(data?: IDisablePopupConfig | null) {
        if (data) {
            if (data.is_active) this.is_active = data.is_active;
        }
    }

    public static makeFromChromeStorage(callback: (config: DisablePopupConfig) => void): void {
        chrome.storage.local.get(["disable_popup"]).then((result) => {
            callback(result.disable_popup ? new DisablePopupConfig(JSON.parse(result.disable_popup)) : new DisablePopupConfig());
        });
    }

    public saveToChromeStorage() {
        chrome.storage.local.set({
            disable_popup: JSON.stringify(this),
        });
    }
}
