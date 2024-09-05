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
