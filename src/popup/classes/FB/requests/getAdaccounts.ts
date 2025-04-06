import { FBGraphApi } from "../FBApi";
import { IAd } from "../types/IAd";
import { getAccountStatusText, getDisableReasonText, IAdaccount } from "../types/IAdaccount";

interface FBResponse {
    data: any[];
    paging?: {
        cursors: {
            before: string;
            after: string;
        };
        next?: string;
    };
    error?: {
        message: string;
    };
}

export async function getAdaccounts(accessToken: string): Promise<IAdaccount[]> {
    const fields = [
        "name",
        "account_id",
        "account_status",
        "disable_reason",
        "currency",
        "business_country_code",
        "adspaymentcycle",
        "adtrust_dsl",
        "amount_spent",
        "ads.limit(500){status,effective_status,name,ad_review_feedback,adcreatives.limit(1){thumbnail_url}}",
        "account_currency_ratio_to_usd",
        "adspixels",
        "timezone_name",
        "timezone_offset_hours_utc",
    ].join(",");

    const params = {
        limit: "25",
        locale: "ru_RU",
        fields: fields,
    };

    let after: string | null = null;
    let allData: any[] = [];

    do {
        const response = (await FBGraphApi.get(
            "me/adaccounts",
            after
                ? {
                      ...params,
                      after: after,
                  }
                : params,
            accessToken
        )) as FBResponse;

        if (response.error?.message) throw response.error.message;

        allData = [...allData, ...response.data];
        after = response.paging?.next ? response.paging?.cursors?.after : null;
    } while (after);

    return parseAdaccountsData(allData);
}

function parseAdaccountsData(adaccountsData: any[]): IAdaccount[] {
    return adaccountsData.map((adaccountData: any): IAdaccount => {
        const adaccount: IAdaccount = {
            id: adaccountData.account_id,
            name: adaccountData.name,
            status: getAccountStatusText(adaccountData.account_status),
            disable_reason: getDisableReasonText(adaccountData.disable_reason),
            currency: adaccountData.currency,
            daily_limit: adaccountData.adtrust_dsl,
            amount_spent: parseInt(adaccountData.amount_spent),
            country: adaccountData.business_country_code,
            ads: [],
            currency_ratio_to_usd: adaccountData.account_currency_ratio_to_usd,
            has_pixel: adaccountData.adspixels?.data?.length > 0,
            billing: adaccountData.adspaymentcycle?.data[0]?.threshold_amount / 100,
            cards: null,
        };
        if (adaccountData.timezone_offset_hours_utc !== undefined && adaccountData.timezone_name !== undefined)
            adaccount.timezone =
                (adaccountData.timezone_offset_hours_utc > 0 ? "+" : "") + `${adaccountData.timezone_offset_hours_utc}`;

        if (adaccountData.ads) {
            adaccount.ads = adaccountData.ads.data.map(
                (adData): IAd => ({
                    id: adData.id,
                    name: adData.name,
                    status: adData.status,
                    effective_status: adData.effective_status,
                    ad_review_feedback: adData.ad_review_feedback?.global ?? {},
                    preview: adData.adcreatives?.data[0]?.thumbnail_url,
                })
            );
        }
        return adaccount;
    });
}
