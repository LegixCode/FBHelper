chrome.webRequest.onAuthRequired.addListener(
    function (details) {
        var proxy = localStorage.getItem("proxy");
        if (!proxy) return {};
        proxy = JSON.parse(proxy);
        if (!proxy.activated) return {};

        return {
            authCredentials: {
                username: proxy.username,
                password: proxy.password,
            },
        };
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        var ua = localStorage.getItem("ua");

        if (!ua) {
            return {};
        }
        ua = JSON.parse(ua);
        if (ua.type == "default") {
            return {};
        }
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === "User-Agent") {
                details.requestHeaders[i].value = ua.type == "personal" ? ua.personal_value : ua.generated_value;
                break;
            }
        }
        return { requestHeaders: details.requestHeaders };
    },
    { urls: ["<all_urls>"] },
    ["blocking", "requestHeaders"]
);

chrome.webRequest.onBeforeRequest.addListener(
    function (info) {
        var translate = localStorage.getItem("translate");
        if (translate) {
            try {
                translate = JSON.parse(translate);
            } catch (e) {
                translate = { is_active: false };
            }
        }
        var new_url = info.url;
        if (translate && translate.is_active && new_url.indexOf("locale=ru_RU") === -1) {
            var arr = new_url.split("?");
            if (arr.length == 1) {
                new_url += "?locale=ru_RU";
            } else {
                arr[1] = "locale=ru_RU&" + arr[1];
                new_url = arr.join("?");
            }
            return { redirectUrl: new_url };
        }
        return {};
    },
    {
        urls: ["https://facebook.com/*", "https://*.facebook.com/*"],
    },
    ["blocking"]
);
