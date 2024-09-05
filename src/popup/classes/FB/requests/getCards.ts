import { FBGraphApi } from "../FBApi";
import { IAdaccount } from "../types/IAdaccount";

export function getCards(adaccountIds: string[], accessToken: string): Promise<Partial<IAdaccount>[]> {
    return new Promise((resolve, reject) => {
        getCardsByGraphApi(accessToken)
            .then(resolve)
            .catch(() => {
                getCardsByGraphqlApi(adaccountIds, accessToken).then(resolve).catch(reject);
            });
    });
}

async function getCardsByGraphApi(accessToken: string): Promise<Partial<IAdaccount>[]> {
    const response = await FBGraphApi.get(
        "me/adaccounts",
        {
            limit: "100",
            fields: "account_id,all_payment_methods{pm_credit_card{display_string}}",
        },
        accessToken
    );
    return await response.data.map((adaccountData: any) => {
        let cards: string | null = null;
        if (adaccountData.all_payment_methods?.pm_credit_card) {
            cards = adaccountData.all_payment_methods.pm_credit_card.data.map((card) => card.display_string).join(",");
        }
        return {
            id: adaccountData.account_id,
            cards: cards,
        };
    });
}

function getCardsByGraphqlApi(adaccountIds: string[], accessToken: string): Promise<Partial<IAdaccount>[]> {
    const requests = adaccountIds.map((adaccountId) => ({
        method: "POST",
        relative_url: `graphql?fb_api_caller_class=RelayModern&fb_api_req_friendly_name=BillingHubPaymentSettingsPaymentMethodsListQuery&doc_id=6271422066224436&variables={"paymentAccountID":"${adaccountId}","hasSDCRiskRestriction":false}`,
    }));

    return FBGraphApi.post("", { batch: JSON.stringify(requests) }, accessToken).then((response) => {
        const adaccountsCards: Partial<IAdaccount>[] = [];
        response.forEach((adaccountResponse) => {
            const body = JSON.parse(adaccountResponse.body);

            if (body.data?.billable_account_by_payment_account?.billing_payment_account?.billing_payment_methods) {
                const cards =
                    body.data.billable_account_by_payment_account.billing_payment_account.billing_payment_methods.map(
                        (payment_method): string => {
                            if (payment_method.credential.last_four_digits)
                                return `${payment_method.credential.card_association_name} · ${payment_method.credential.last_four_digits}`;
                            if (payment_method.credential.email) return payment_method.credential.email;
                        }
                    );
                adaccountsCards.push({
                    id: body.data?.billable_account_by_payment_account?.billing_payment_account.id,
                    cards: cards.join(","),
                });
            }
        });
        return adaccountsCards;
    });
}
