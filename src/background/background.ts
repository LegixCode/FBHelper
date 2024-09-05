import { ProxyConfig } from "../popup/classes/ProxyConfig";
import { TranslateConfig } from "../popup/classes/TranslateConfig";
import { UseragentConfig } from "../popup/classes/UseragentConfig";

chrome.webRequest.onAuthRequired.addListener(
    function () {
        const proxy = ProxyConfig.makeFromLocalStorage();

        return proxy.activated
            ? {
                  authCredentials: {
                      username: proxy.username,
                      password: proxy.password,
                  },
              }
            : {};
    },
    { urls: ["<all_urls>"] },
    ["blocking"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        const config = UseragentConfig.makeFromLocalStorage();
        if (config.type == "default") {
            return {};
        }
        const useragent = config.type == "personal" ? config.personal_value : config.generated_value;
        const headerIndex = details.requestHeaders.findIndex((h) => h.name === "User-Agent");
        if (headerIndex !== -1) details.requestHeaders[headerIndex].value = useragent;

        return { requestHeaders: details.requestHeaders };
    },
    { urls: ["<all_urls>"] },
    ["blocking", "requestHeaders"]
);

chrome.webRequest.onBeforeRequest.addListener(
    function (info) {
        const translateConfig = TranslateConfig.makeFromLocalStorage();

        return translateConfig.is_active && !info.url.includes("locale=ru_RU")
            ? {
                  redirectUrl: info.url + (info.url.includes("?") ? "&" : "?") + "locale=ru_RU",
              }
            : {};
    },
    {
        urls: ["https://facebook.com/*", "https://*.facebook.com/*"],
    },
    ["blocking"]
);
