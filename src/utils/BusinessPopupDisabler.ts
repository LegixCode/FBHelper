import { DisablePopupConfig } from "@/classes/DisablePopupConfig";

class BusinessPopupDisabler {
    popupObserver: MutationObserver | null = null;

    constructor() {
        this.disablePopup();

        chrome.storage.onChanged.addListener((changes) => {
            if (changes.disable_popup) {
                this.disablePopup();
            }
        });
    }

    removePopup() {
        document.querySelector('[data-visualcompletion="ignore"]')?.remove();
    }

    disablePopup() {
        if (!window.location.hostname.includes("business.facebook.com")) {
            return;
        }

        DisablePopupConfig.makeFromChromeStorage((config: DisablePopupConfig) => {
            if (config.is_active) {
                this.removePopup();
                if (!this.popupObserver) {
                    this.popupObserver = new MutationObserver(this.removePopup);

                    this.popupObserver.observe(document.body, {
                        childList: true,
                        subtree: true,
                    });
                }
            } else {
                if (this.popupObserver) {
                    this.popupObserver.disconnect();
                    this.popupObserver = null;
                }
            }
        });
    }
}

export function initBusinessPopupDisabler() {
    new BusinessPopupDisabler();
}
