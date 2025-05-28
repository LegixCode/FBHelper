import { initBackgroundCurrencyConverter } from "@/utils/BackgroundCurrencyConverter";
import { parseAccessToken } from "@/classes/FB/parseAccessToken";
import { initAdaccountTabRenamer } from "@/utils/AdaccountTabRenamer";
import { initBusinessPopupDisabler } from "@/utils/BusinessPopupDisabler";

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

initAdaccountTabRenamer();
initBackgroundCurrencyConverter();
initBusinessPopupDisabler();
