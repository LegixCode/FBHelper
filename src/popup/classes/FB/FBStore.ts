import { IAdaccount } from "@/classes/FB/types/IAdaccount";
import { computed, ref } from "vue";
import { execContentScriptAction, getCookies } from "@/classes/chromeMethods";
import { getAdaccounts } from "@/classes/FB/requests/getAdaccounts";
import { getBillingHoldStatus } from "@/classes/FB/requests/getBillingHoldStatus";
import { getCards } from "@/classes/FB/requests/getCards";
import { parseAccessToken } from "@/classes/FB/parseAccessToken";

export type TAdaccountSortType = "name" | "status";

export class FBStore {
    static self = null;

    static make() {
        FBStore.self = new FBStore();
        return FBStore.self;
    }

    private readonly _userId = ref<number | string | null>();
    readonly userId = computed(() => {
        if (!this._userId.value) {
            getCookies((cookies) => {
                const userCookie = cookies.find((c) => c.name == "c_user");
                if (userCookie) this._userId.value = userCookie.value;
            });
        }
        return this._userId.value;
    });

    private readonly _accessToken = ref<string | null>();
    readonly accessToken = computed(() => {
        if (!this._accessToken.value && !this.accessTokenNotFound.value && !this.loadAccessTokenProcessing.value) {
            this.loadAccessTokenProcessing.value = true;

            execContentScriptAction<string>("get_token", (newAccessToken) => {
                if (newAccessToken) {
                    this._accessToken.value = newAccessToken;
                    this.loadAccessTokenProcessing.value = false;
                } else {
                    fetch("https://adsmanager.facebook.com/adsmanager/manage/campaigns")
                        .then((response) => response.text())
                        .then((html) => (this._accessToken.value = parseAccessToken(html)))
                        .catch(() => (this.accessTokenNotFound.value = true))
                        .finally(() => (this.loadAccessTokenProcessing.value = false));
                }
            });
        }
        return this._accessToken.value;
    });
    readonly accessTokenNotFound = ref<boolean>(false);
    readonly loadAccessTokenProcessing = ref<boolean>(false);

    private readonly _adaccounts = ref<IAdaccount[] | null>();
    readonly adaccounts = computed<IAdaccount[] | null>(() => {
        if (!this._adaccounts.value && this.accessToken.value) this.loadAdaccounts();

        const getSortValue = (adaccount: IAdaccount) =>
            this.sortType.value == "name"
                ? adaccount.name.toLowerCase()
                : (adaccount.disable_reason ?? adaccount.status);
        return this._adaccounts.value?.sort((a, b) => (getSortValue(a) < getSortValue(b) ? -1 : 1));
    });
    readonly loadAdaccountsProcessing = ref<boolean>(false);
    readonly loadAdaccountsError = ref<string | null>(null);

    readonly sortType = ref<TAdaccountSortType>(
        (localStorage.getItem("fb_account_sort_type") as TAdaccountSortType) ?? "name"
    );

    setSortType(type: TAdaccountSortType) {
        this.sortType.value = type;
        localStorage.setItem("fb_account_sort_type", type);
    }

    private loadAdaccounts() {
        if (this.loadAccessTokenProcessing.value) return;
        this.loadAdaccountsProcessing.value = true;
        getAdaccounts(this.accessToken.value)
            .then((response) => {
                this._adaccounts.value = response;
                chrome.storage.local.set({
                    adaccounts: JSON.stringify(this._adaccounts.value),
                });
                const adaccountIds = this._adaccounts.value.map((a) => a.id);
                getCards(adaccountIds, this.accessToken.value)
                    .then((adaccountsCard) => {
                        for (const adaccountCard of adaccountsCard)
                            this.getAdaccount(adaccountCard.id).cards = adaccountCard.cards;

                        this.loadAdaccountsProcessing.value = false;
                    })
                    .catch(() => {
                        this.loadAdaccountsProcessing.value = false;
                    });
                getBillingHoldStatus(adaccountIds, this.accessToken.value).then((adaccountsPreauth) => {
                    for (const adaccountPreauth of adaccountsPreauth)
                        this.getAdaccount(adaccountPreauth.id).resolve_preauth_friction =
                            adaccountPreauth.resolve_preauth_friction;
                });
            })
            .catch((error: string) => {
                this.loadAdaccountsError.value = error;
                this.loadAdaccountsProcessing.value = false;
            });
    }

    getAdaccount(id: string): IAdaccount {
        return this._adaccounts.value.find((adaccount) => adaccount.id == id);
    }
}
