class FBHelper {
    static GetDataFromFB(token, callback) {
        var xhr = new XMLHttpRequest();
        var fields = [
            'name',
            'account_id',
            'account_status',
            'disable_reason',
            'currency',
            'business_country_code',
            'adspaymentcycle',
            'adtrust_dsl',
            'all_payment_methods{pm_credit_card{display_string}}',
            'ads.limit(500){status,effective_status,name,ad_review_feedback,adcreatives.limit(1){thumbnail_url}}',
            'account_currency_ratio_to_usd',
            'adspixels'

        ].join(',');
        xhr.open("GET", `https://graph.facebook.com/v10.0/me/adaccounts?locale=ru_RU&fields=${fields}&access_token=${token}`, true);

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                var adaccounts_data = JSON.parse(xhr.responseText);
                var adaccounts = [];

                adaccounts_data.data.forEach(adaccount_data => {
                    var adaccount = {
                        id: adaccount_data.id,
                        account_id: adaccount_data.account_id,
                        name: adaccount_data.name,
                        status: FBHelper.GetAccountStatusText(adaccount_data.account_status),
                        disable_reason: FBHelper.GetDisableReasonText(adaccount_data.disable_reason),
                        currency: adaccount_data.currency,
                        daily_limit: adaccount_data.adtrust_dsl,
                        country: adaccount_data.business_country_code,
                        ads: [],
                        ads_statuses: {
                            active: 0,
                            paused: 0,
                            pending_review: 0,
                            disapproved: 0
                        },
                        currency_ratio_to_usd: adaccount_data.account_currency_ratio_to_usd,
                        has_pixel: false
                    };
                    if (adaccount_data.adspaymentcycle && adaccount_data.adspaymentcycle.data)
                        adaccount.billing = adaccount_data.adspaymentcycle.data[0].threshold_amount / 100;

                    if (adaccount_data.all_payment_methods && adaccount_data.all_payment_methods.pm_credit_card) {
                        var cards = [];
                        adaccount_data.all_payment_methods.pm_credit_card.data.forEach(card => cards.push(card.display_string));
                        adaccount.card = cards.join(',');
                    }
                    if (adaccount_data.ads) {
                        adaccount_data.ads.data.forEach(ad_data => {
                            var ad = {
                                name: ad_data.name,
                                status: ad_data.status,
                                effective_status: ad_data.effective_status,
                                ad_review_feedback: [],
                                preview: ad_data.adcreatives.data.length == 0 ? '' : ad_data.adcreatives.data[0].thumbnail_url
                            }
                            if (ad_data.ad_review_feedback && ad_data.ad_review_feedback.global)
                                for (var o in ad_data.ad_review_feedback.global)
                                    ad.ad_review_feedback.push(o);

                            switch (ad.effective_status) {
                                case 'ACTIVE':
                                    adaccount.ads_statuses.active++;
                                    break;
                                case 'PAUSED':
                                case 'CAMPAIGN_PAUSED':
                                case 'ADSET_PAUSED':
                                    adaccount.ads_statuses.paused++;
                                    break;
                                case 'PENDING_REVIEW':
                                    adaccount.ads_statuses.pending_review++;
                                    break;
                                default:
                                    adaccount.ads_statuses.disapproved++;
                                    break;
                            }
                            adaccount.ads.push(ad);
                        });
                        if (adaccount_data.adspixels && adaccount_data.adspixels.data && adaccount_data.adspixels.data.length > 0)
                            adaccount.has_pixel = true;
                    }
                    adaccounts.push(adaccount);
                });
                callback(adaccounts);
            }
        }
        xhr.send();
    }

    static GetBMs(token, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", 'https://graph.facebook.com/v10.0/me/businesses?fields=id,name&access_token=' + token, true);

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                var bms = JSON.parse(xhr.responseText);
                callback(bms.data);
            }
        }
        xhr.send();
    }

    static GetDisableReasonText(disable_reason) {
        switch (disable_reason) {
            case 1: return 'POLICY';
            case 2: return 'ADS_IP_REVIEW';
            case 3: return 'RISK';
            case 4: return 'GRAY_ACCOUNT_SHUT_DOWN';
            case 5: return 'ADS_AFC_REVIEW';
            case 6: return 'BUSINESS_INTEGRITY_RAR';
            case 7: return 'PERMANENT_CLOSE';
            case 8: return 'UNUSED_RESELLER_ACCOUNTR';
            default: return false;
        }
    }

    static GetAccountStatusText(status) {
        switch (status) {
            case 1: return 'ACTIVE';
            case 2: return 'DISABLED';
            case 3: return 'UNSETTLED';
            case 7: return 'PENDING_RISK_REVIEW';
            case 8: return 'PENDING_SETTLEMENT';
            case 9: return 'IN_GRACE_PERIOD';
            case 100: return 'PENDING_CLOSURE';
            case 101: return 'CLOSED';
            case 201: return 'ANY_ACTIVE';
            case 202: return 'ANY_CLOSED';
            default: return status;
        }
    }

    static ChangeTimeZoneAndCurrency(token, adaccount_id, country, state, zip, currency, tz, callback) {
        var xhr = new XMLHttpRequest();

        if (country == 'US')
            var body = `timezone_id=${tz}&currency=${currency}&business_info={"business_country_code":"${country}","business_city":"Los Angeles","business_name":"Carl Johnson","business_state":"${state}","business_street":"Grove Street","business_zip":${zip}}&access_token=${token}`;
        else
            var body = 'timezone_id=' + tz + '&currency=' + currency + '&business_info={"business_country_code":"' + country + '","business_zip":672934}&access_token=' + token;

        xhr.open("POST", 'https://graph.facebook.com/v10.0/act_' + adaccount_id, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                var data = JSON.parse(xhr.responseText);
                callback(data);
            }
        };

        xhr.send(body);
    }

    static GetUserId(token, callback) {
        let url = 'https://graph.facebook.com/v10.0/me?access_token=' + token;
        fetch(url).then(response => response.json()).then(response => callback(response));
    }

    static AddCard(token, user_id, adaccount_id, card_number, card_expiry_year, card_expiry_month, card_cvc, callback) {
        var xhr = new XMLHttpRequest();

        var body = 'make_ads_primaty_funding_source=1&app_version=22916291&payment_type=ads_invoice&locale=uk_UA&billing_address={"country_code":"US","zip":672934}&sdk=ios&sdk_version=3&risk_features={"CreditCardFormType":"mobile","MobilePlatform":"iOS"}&pretty=0&creditCardNumber=' + card_number + '&expiry_year=' + card_expiry_year + '&expiry_month=' + card_expiry_month + '&csc=' + card_cvc + '&account_id=' + adaccount_id + '&format=json&fb_api_req_friendly_name=add_credit_card&fb_api_caller_class=com.facebook.payments.common.PaymentNetworkOperationHelper';

        xhr.open("POST", "https://graph.secure.facebook.com/ajax/payment/token_proxy.php?tpe=/" + user_id + "/creditcards", true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-Fb-Connection-Type', 'wifi');
        xhr.setRequestHeader('X-Fb-Sim-Hni', '25001');
        xhr.setRequestHeader('Authorization', "OAuth " + token);

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                var data = JSON.parse(xhr.responseText);
                callback(data);
            }
        };

        xhr.send(body);
    }


    static GetPendingUsersLinks(token, business_id, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open("GET", 'https://graph.facebook.com/v11.0/' + business_id + '/pending_users?access_token=' + token, true);

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                var links = [];
                var users = JSON.parse(xhr.responseText);
                var links_str = '';
                var user_ids = [];
                users.data.forEach(user => {
                    links.push(user.invite_link);
                    user_ids.push(user.id);
                    links_str += user.invite_link + '	';
                });
                callback(links, links_str, user_ids);
            }
        };

        xhr.send();
    }

    static CreateBusinessUser(token, business_id, callback) {
        var xhr = new XMLHttpRequest();

        var body = 'role=ADMIN&email=' + FBHelper.GenerateEmail() + '&access_token=' + token;

        xhr.open("POST", 'https://graph.facebook.com/v11.0/' + business_id + '/business_users', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                callback();
            }
        };

        xhr.send(body);
    }

    static GenerateEmail() {
        var email = '';
        for (var i = 0; i < 8; i++) {
            email += String.fromCharCode(FBHelper.GetRandomInt(97, 123));
        }
        return "fbviewer_" + email + "@mail.ru";
    }

    static GetRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
    }

    static CreatePixel(token, adaccount_id, callback) {
        var xhr = new XMLHttpRequest();

        var body = 'name=MyPixel&access_token=' + token;

        xhr.open("POST", 'https://graph.facebook.com/v11.0/act_' + adaccount_id + '/adspixels', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                var data = JSON.parse(xhr.responseText);
                callback(data);
            }
        };

        xhr.send(body);
    }

    static CreateRule(token, adaccount_id, rule_param, callback) {
        var xhr = new XMLHttpRequest();
        var body = 'status=ENABLED'
        for (var key in rule_param) {
            body += `&${key}=${rule_param[key]}`;
        }
        body += '&access_token=' + token;

        xhr.open("POST", 'https://graph.facebook.com/v11.0/act_' + adaccount_id + '/adrules_library', true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4) {
                var data = JSON.parse(xhr.responseText);
                callback(data);
            }
        };

        xhr.send(body);
    }
}