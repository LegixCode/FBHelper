import Cookie = chrome.cookies.Cookie;
import SetDetails = chrome.cookies.SetDetails;

function deactivateRule(ruleId: number): void {
    chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: [ruleId],
    });
}

export function openTab(link: string, active: boolean = true): void {
    chrome.tabs.create({ url: link, active: active });
}

export function execContentScriptAction<T>(action: string, callback: (data: T) => void): void {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
        if (!tabs.length || !tabs[0].id) {
            callback(null);
            return;
        }

        try {
            chrome.tabs.sendMessage(tabs[0].id, { action: action }, (response) => {
                if (chrome.runtime.lastError) {
                    callback(null);
                    return;
                }
                callback(response);
            });
        } catch (error) {
            callback(null);
        }
    });
}

export function getCookies(callback: (cookies: Cookie[]) => void): void {
    chrome.cookies.getAll({ url: "https://facebook.com" }, callback);
}

export function setCookies(cookiesDetails: Partial<SetDetails>[]): void {
    cookiesDetails
        .filter((cookiesItem) => cookiesItem.domain == ".facebook.com")
        .forEach((cookiesItem) => {
            const chromeCookiesItem: SetDetails = {
                url: "https://www.facebook.com",
                domain: cookiesItem.domain,
                path: cookiesItem.path,
                name: cookiesItem.name,
                value: cookiesItem.value,
                expirationDate: cookiesItem.expirationDate,
            };
            chrome.cookies.set(chromeCookiesItem, () => {});
        });
}

export function removeCookies(callback: () => void): void {
    chrome.cookies.getAll({ url: "https://facebook.com" }, (cookies) => {
        cookies.forEach((cookiesItem) => {
            chrome.cookies.remove({
                url: "https://facebook.com/",
                name: cookiesItem.name,
            });
        });
        callback();
    });
}

export function setProxy(config: {
    mode: string;
    rules?: {
        singleProxy: {
            scheme: string;
            host: string;
            port: number;
        };
    };
}): void {
    chrome.proxy.settings.set({ value: config, scope: "regular" }, function () {});
}

export function activateLocaleRule() {
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
            {
                id: 564,
                action: {
                    type: chrome.declarativeNetRequest.RuleActionType.REDIRECT,
                    redirect: {
                        transform: {
                            queryTransform: {
                                addOrReplaceParams: [{ key: "locale", value: "ru_RU" }],
                            },
                        },
                    },
                },
                condition: {
                    initiatorDomains: ["facebook.com"],
                    requestDomains: ["facebook.com"],
                    resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
                },
            },
        ],
    });
}

export function deactivateLocaleRule() {
    deactivateRule(564);
}

export function activateUseragentRule(value: string) {
    chrome.declarativeNetRequest.updateDynamicRules({
        addRules: [
            {
                id: 315,
                action: {
                    type: chrome.declarativeNetRequest.RuleActionType.MODIFY_HEADERS,
                    requestHeaders: [
                        {
                            header: "User-Agent",
                            operation: chrome.declarativeNetRequest.HeaderOperation.SET,
                            value: value,
                        },
                    ],
                },
                condition: {
                    resourceTypes: [chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
                },
            },
        ],
    });
}

export function deactivateUseragentRule() {
    deactivateRule(315);
}

export function getVersion(): string {
    return chrome.runtime.getManifest().version;
}
