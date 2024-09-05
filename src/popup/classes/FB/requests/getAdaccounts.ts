import { FBGraphApi } from "../FBApi";
import { getAccountStatusText, getDisableReasonText, IAdaccount } from "../types/IAdaccount";
import { IAd } from "../types/IAd";

export function getAdaccounts(accessToken: string): Promise<IAdaccount[]> {
    return new Promise((resolve, reject) => {
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
        const requests = [
            {
                method: "GET",
                relative_url:
                    `me/adaccounts?` +
                    new URLSearchParams({
                        limit: "100",
                        locale: "ru_RU",
                        fields: fields,
                    }).toString(),
            },
        ];

        FBGraphApi.post("", { batch: JSON.stringify(requests) }, accessToken)
            .then((response) => {
                const adaccountsData: any[] = JSON.parse(response[0].body).data;
                const adaccounts: IAdaccount[] = adaccountsData.map((adaccountData: any): IAdaccount => {
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
                    if (
                        adaccountData.timezone_offset_hours_utc !== undefined &&
                        adaccountData.timezone_name !== undefined
                    )
                        adaccount.timezone =
                            (adaccountData.timezone_offset_hours_utc > 0 ? "+" : "") +
                            `${adaccountData.timezone_offset_hours_utc}`;

                    if (adaccountData.ads) {
                        adaccount.ads = adaccountData.ads.data.map((adData): IAd => {
                            const ad: IAd = {
                                id: adData.id,
                                name: adData.name,
                                status: adData.status,
                                effective_status: adData.effective_status,
                                ad_review_feedback: {},
                                preview: adData.adcreatives?.data[0]?.thumbnail_url,
                            };
                            if (adData.ad_review_feedback?.global)
                                ad.ad_review_feedback = adData.ad_review_feedback.global;
                            return ad;
                        });
                    }
                    return adaccount;
                });
                resolve(adaccounts);
            })
            .catch(reject);
    });
}
