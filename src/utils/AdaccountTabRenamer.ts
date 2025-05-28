export function initAdaccountTabRenamer() {
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
}
