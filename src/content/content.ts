import { DisablePopupConfig } from "../popup/classes/DisablePopupConfig";

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
    const html = document.firstElementChild?.outerHTML ?? "";
    let token = /"EAAB(.*?)"/gi.exec(html);
    if (token != null) {
        return "EAAB" + token[1];
    }

    token = /"EAA(.*?)"/gi.exec(html);
    if (token != null) {
        return "EAA" + token[1];
    }

    return null;
}

function disablePopup() {
    DisablePopupConfig.makeFromChromeStorage((config: DisablePopupConfig) => {
        if (config.is_active) {
            document.querySelector('[data-visualcompletion="ignore"]')?.remove();
        }
    });
}

const observer = new MutationObserver(disablePopup);
observer.observe(document.body, { childList: true, subtree: true });
setInterval(disablePopup, 3000); // Check every 2 seconds
disablePopup();
