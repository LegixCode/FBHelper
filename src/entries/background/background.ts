import { ProxyConfig } from "@/classes/ProxyConfig";

// Глобальная переменная для кэширования конфига прокси
let cachedProxyConfig: ProxyConfig | null = null;

// Слушаем изменения в storage и обновляем кэш
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local" && changes.proxy?.newValue) {
        cachedProxyConfig = new ProxyConfig(JSON.parse(changes.proxy.newValue));
    }
});

// Инициализируем кэш при запуске
ProxyConfig.makeFromChromeStorage((proxy) => (cachedProxyConfig = proxy));

chrome.webRequest.onAuthRequired.addListener(
    (details, callback) => {
        try {
            callback(
                cachedProxyConfig?.activated && cachedProxyConfig?.username && cachedProxyConfig?.password
                    ? {
                          authCredentials: {
                              username: cachedProxyConfig.username,
                              password: cachedProxyConfig.password,
                          },
                      }
                    : {}
            );
        } catch {
            callback({});
        }
    },
    { urls: ["<all_urls>"] },
    ["asyncBlocking"]
);
