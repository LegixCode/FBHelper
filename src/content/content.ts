import { DisablePopupConfig } from "@popup/classes/DisablePopupConfig";
import { initCurrencyConverter } from "@popup/classes/CurrencyConverter";
import { parseAccessToken } from "@popup/classes/FB/parseAccessToken";

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action)
        switch (request.action) {
            case "get_token":
                sendResponse(getAccessToken());
                return true;
        }
    return true;
});

function getAccessToken(): string | null {
    try {
        return parseAccessToken(document.firstElementChild?.outerHTML ?? "");
    } catch {
        return null;
    }
}

let popupObserver: MutationObserver | null = null;

function removePopup() {
    document.querySelector('[data-visualcompletion="ignore"]')?.remove();
}

function disablePopup() {
    if (!window.location.hostname.includes("business.facebook.com")) {
        return;
    }

    DisablePopupConfig.makeFromChromeStorage((config: DisablePopupConfig) => {
        if (config.is_active) {
            removePopup();
            if (!popupObserver) {
                popupObserver = new MutationObserver(removePopup);

                popupObserver.observe(document.body, {
                    childList: true,
                    subtree: true,
                });
            }
        } else {
            if (popupObserver) {
                popupObserver.disconnect();
                popupObserver = null;
            }
        }
    });
}

disablePopup();

chrome.storage.onChanged.addListener((changes) => {
    if (changes.disable_popup) {
        disablePopup();
    }
});

(function () {
    let originalTitle = null;
    document.addEventListener("visibilitychange", () => {
        const accountId = new URLSearchParams(window.location.search).get("act");
        if (document.hidden && accountId) {
            originalTitle = document.title;
            chrome.storage.local.get("adaccounts", (result) => {
                if (result.adaccounts) {
                    try {
                        const adaccount = JSON.parse(result.adaccounts).find((acc: any) => acc.id === accountId);
                        if (adaccount && adaccount.name) {
                            document.title = adaccount.name;
                        }
                    } catch (error) {
                        console.error("Ошибка при обработке данных аккаунтов:", error);
                    }
                }
            });
        } else if (originalTitle) {
            document.title = originalTitle;
            originalTitle = null;
        }
    });
})();

initCurrencyConverter();
