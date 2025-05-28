import { FBGraphApi } from "@/classes/FB/FBApi";
import { IAdaccount } from "@/classes/FB/types/IAdaccount";

export async function getBillingHoldStatus(
    adaccountIds: string[],
    accessToken: string
): Promise<Partial<IAdaccount>[]> {
    const chunks: string[][] = [];
    while (adaccountIds.length) chunks.push(adaccountIds.splice(0, 50));

    const adaccountsPreauth = [];
    for (const chunk of chunks) adaccountsPreauth.push(...(await handleChunk(chunk, accessToken)));
    return adaccountsPreauth;
}

async function handleChunk(adaccountIds, accessToken): Promise<Partial<IAdaccount>[]> {
    const requests = adaccountIds.map((adaccountId) => ({
        method: "POST",
        relative_url: `graphql?fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BillingWizardNameUtilsQuery&doc_id=5029176233809814&variables={"paymentAccountID":"${adaccountId}","budget":null}`,
    }));
    const response = await FBGraphApi.post("", { batch: JSON.stringify(requests) }, accessToken);

    const adaccountsPreauth = [];
    for (let i = 0; i < adaccountIds.length; i++) {
        const adaccountBody = JSON.parse(response[i].body);
        adaccountsPreauth.push({
            id: adaccountIds[i],
            resolve_preauth_friction:
                adaccountBody?.data?.required_wizard_name?.wizard_name == "RESOLVE_PREAUTH_FRICTION",
        });
    }

    return adaccountsPreauth;
}
