import { ProxyConfig } from "../popup/classes/ProxyConfig";

chrome.webRequest.onAuthRequired.addListener(
    function (details, callback) {
        ProxyConfig.makeFromChromeStorage((proxy: ProxyConfig) => {
            console.log(proxy);
            callback(
                proxy.activated
                    ? {
                          authCredentials: {
                              username: proxy.username,
                              password: proxy.password,
                          },
                      }
                    : {}
            );
        });
    },
    { urls: ["<all_urls>"] },
    ["asyncBlocking"]
);
