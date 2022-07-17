var notifyTimer = 0;
function Notify(text, type) {
    if (notifyTimer != 0)
        clearTimeout(notifyTimer);
    var notifyEl = document.getElementById('notification');
    notifyEl.innerText = text;
    switch (type) {
        case 'danger':
            notifyEl.style.backgroundColor = '#F44336';
            break;
        default:
            notifyEl.style.backgroundColor = '#4CAF50';
            break;
    }
    notifyEl.style.display = 'block';
    notifyTimer = setTimeout(() => {
        notifyEl.style.display = 'none';
        notifyTimer = 0;
    }, 4000);
}

function InitAccordion() {
    var headers = document.getElementsByClassName('accordion-header');
    for (var i = 0; i < headers.length; i++)
        headers[i].addEventListener('click', function (event) {
            this.parentElement.classList.toggle('show');
            var adaccount_id = this.parentElement.getAttribute('adaccount_id');
            expanded_accounts = window.localStorage.getItem('expanded_accounts');
            expanded_accounts = expanded_accounts ? JSON.parse(expanded_accounts) : {};
            expanded_accounts[adaccount_id] = this.parentElement.classList.contains('show');
            window.localStorage.setItem('expanded_accounts', JSON.stringify(expanded_accounts));
        });
}

function InitNavigation() {
    var nav_links = document.getElementsByClassName('nav-link');
    var pages = document.getElementsByClassName('page');
    for (var i = 0; i < nav_links.length; i++)
        nav_links[i].addEventListener('click', (event) => {
            event.preventDefault();
            for (var j = 0; j < nav_links.length; j++)
                nav_links[j].classList.remove('active');
            for (var j = 0; j < pages.length; j++)
                pages[j].style.display = 'none';
            event.target.classList.add('active');
            document.getElementById(event.target.getAttribute('target')).style.display = 'block';
        });
    document.getElementById('submenu_show').addEventListener('click', function (event) {
        document.getElementById('submenu_wrapper').style.display = 'block';
    });
    document.getElementById('submenu_wrapper').addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('submenu_wrapper').style.display = 'none';
    });
    var sub_menu_links = document.querySelectorAll('#submenu_wrapper li a');
    for (var i = 0; i < sub_menu_links.length; i++)
        sub_menu_links[i].addEventListener('click', function (event) {
            event.preventDefault();
            chrome.tabs.create({
                url: event.target.getAttribute('href')
            });
        });
}

function InitBtnClipboard() {
    var btns = document.getElementsByClassName('btn-clipboard');
    for (var i = 0; i < btns.length; i++)
        btns[i].addEventListener('click', (event) => {
            console.log(event);
            var elem = document.getElementById(event.target.getAttribute('target'));
            if (!navigator.clipboard) {
                elem.focus();
                elem.select();
                document.execCommand('copy');
                return;
            }
            navigator.clipboard.writeText(elem.value);
        });
}

function CreateBadge(append_class, title) {
    return ` <span class="badge ${append_class}">${title}</span>`;
}

function InitAccountsView(adaccounts) {
    document.getElementById('accounts_wrapper').style.display = 'block';
    var adaccounts_wrapper = document.getElementById('adaccounts_wrapper');
    expanded_accounts = window.localStorage.getItem('expanded_accounts');
    expanded_accounts = expanded_accounts ? JSON.parse(expanded_accounts) : {};
    adaccounts.sort((a, b) => {
        if (a.name.toString().toLowerCase() == b.name.toString().toLowerCase())
            return 0;
        return a.name.toString().toLowerCase() > b.name.toString().toLowerCase() ? 1 : -1;
    });
    adaccounts.forEach((adaccount) => {
        var adaccount_status_badge;
        if (adaccount.disable_reason)
            adaccount_status_badge = CreateBadge('bg-danger', adaccount.disable_reason);
        else
            adaccount_status_badge = CreateBadge(adaccount.status == 'ACTIVE' ? 'bg-success' : 'bg-warning', adaccount.status);

        var ads_status_badges = "";
        if (adaccount.ads_statuses.pending_review > 0)
            ads_status_badges += CreateBadge('bg-primary ads', adaccount.ads_statuses.pending_review);
        if (adaccount.ads_statuses.active > 0)
            ads_status_badges += CreateBadge('bg-success ads', adaccount.ads_statuses.active);
        if (adaccount.ads_statuses.paused > 0)
            ads_status_badges += CreateBadge('bg-warning ads', adaccount.ads_statuses.paused);
        if (adaccount.ads_statuses.disapproved > 0)
            ads_status_badges += CreateBadge('bg-danger ads', adaccount.ads_statuses.disapproved);
        var info = `Лимит: ${adaccount.daily_limit == '-1' ? '∞' : adaccount.daily_limit} ${adaccount.currency} `;
        if (adaccount.daily_limit != '-1' && adaccount.currency != 'USD') info += `(${Math.round(adaccount.daily_limit / adaccount.currency_ratio_to_usd * 10) / 10}$)`
        if (adaccount.country) info += ` | Гео: ${adaccount.country}`;
        info += '<br>';
        if (adaccount.billing) info += `Билл: ${adaccount.billing} ${adaccount.currency} `;
        if (adaccount.currency != 'USD') info += `(${Math.round(adaccount.billing / adaccount.currency_ratio_to_usd * 10) / 10}$)`
        if (adaccount.card) info += ` | ${adaccount.card}`;

        var header = `
        <h2 class="accordion-header">
            <button class="accordion-button" type="button">
                <div class="d-flex w-100 align-items-center">
                    <div class="">${adaccount.name}</div>
                    <small class="adaccount_info">
                        ${info}
                    </small>
                    <div class="ms-auto text-right">
                        ${ads_status_badges}
                        ${adaccount_status_badge}
                    </div>
                </div>
            </button>
        </h2>`;
        var ad_items;
        if (adaccount.ads.length > 0) {
            ad_items = '<ul class="list-group">';
            adaccount.ads.forEach((ad) => {
                var badges = '';
                switch (ad.effective_status) {
                    case 'ACTIVE':
                        badges += CreateBadge('bg-success', ad.effective_status);
                        break;
                    case 'PAUSED':
                    case 'CAMPAIGN_PAUSED':
                    case 'ADSET_PAUSED':
                        badges += CreateBadge('bg-warning', ad.effective_status);
                        break;
                    case 'PENDING_REVIEW':
                        badges += CreateBadge('bg-primary', ad.effective_status);
                        break;
                    default:
                        badges += CreateBadge('bg-danger', ad.effective_status);
                        break;
                }
                ad.ad_review_feedback.forEach(feedback => badges += CreateBadge('bg-danger', feedback));
                ad_items += `
                <li class="list-group-item">
                    <div class="d-flex w-100 align-items-center">
                        <img src="${ad.preview}" class="ad_preview rounded-circle">
                        <div class="ad_name">${ad.name}</div>
                        <div class="ms-auto text-end">${badges}</div>
                    </div>
                </li>
            `;
            });
            ad_items += '</ul>';
        } else {
            ad_items = '<div class="w-100 text-center py-2">Объявления отсутствуют</div>'
        }
        var show = adaccount.ads.length != 0;
        if (expanded_accounts[adaccount.account_id] !== undefined)
            show = expanded_accounts[adaccount.account_id];
        show = show ? 'show' : '';
        adaccounts_wrapper.insertAdjacentHTML('beforeend', `
            <div class="accordion-item ${show}" adaccount_id=${adaccount.account_id}>
                ${header}
                <div class="accordion-collapse collapse el-${adaccount.ads.length}">
                    ${ad_items}
                </div>
            </div>
        `);
    });
    InitAccordion();
}

function InitActionsView(adaccounts) {
    document.querySelector('.nav-link.disabled').classList.remove('disabled');
    action_adaccount_select = document.getElementById('action_adaccount_select');
    adaccounts.forEach(adaccount => {
        var card = !adaccount.card ? `` : ` | ${adaccount.card}`;
        action_adaccount_select.insertAdjacentHTML('afterbegin', `<option value="${adaccount.account_id}">${adaccount.name} ${card} | ${adaccount.status}</option>`);
    });
    document.getElementById('create_pixel').addEventListener('click', () => {
        var adaccount = action_adaccount_select.value;
        var token = document.getElementById('access_token').value;
        FBHelper.CreatePixel(token, adaccount, (response) => {
            if (response.id)
                Notify('Пиксель создан');
            else
                Notify('Ошибка создания пикселя', 'danger');
        });
    });
    document.getElementById('create_rules').addEventListener('click', () => {
        var adaccount = action_adaccount_select.value;
        var token = document.getElementById('access_token').value;
        var start = document.getElementById('rules_start').value;
        var stop = document.getElementById('rules_stop').value;
        FBHelper.GetUserId(token, (user) => {
            if (!user.id)
                return;
            var start_params = {
                name: 'start',
                evaluation_spec: '{"evaluation_type":"SCHEDULE","filters":[{"field":"entity_type","value":"CAMPAIGN","operator":"EQUAL"},{"field":"time_preset","value":"MAXIMUM","operator":"EQUAL"}]}',
                execution_spec: `{"execution_type":"UNPAUSE","execution_options":[{"field":"user_ids","value":["${user.id}"],"operator":"EQUAL"},{"field":"alert_preferences","value":{"instant":{"trigger":"CHANGE"}},"operator":"EQUAL"}]}`,
                schedule_spec: `{"schedule_type":"CUSTOM","schedule":[{"days":[0],"start_minute":${start},"end_minute":${start}},{"days":[1],"start_minute":${start},"end_minute":${start}},{"days":[2],"start_minute":${start},"end_minute":${start}},{"days":[3],"start_minute":${start},"end_minute":${start}},{"days":[4],"start_minute":${start},"end_minute":${start}},{"days":[5],"start_minute":${start},"end_minute":${start}},{"days":[6],"start_minute":${start},"end_minute":${start}}]}`
            };
            var stop_params = {
                name: 'stop',
                evaluation_spec: '{"evaluation_type":"SCHEDULE","filters":[{"field":"entity_type","value":"CAMPAIGN","operator":"EQUAL"},{"field":"time_preset","value":"MAXIMUM","operator":"EQUAL"}]}',
                execution_spec: `{"execution_type":"PAUSE","execution_options":[{"field":"user_ids","value":["${user.id}"],"operator":"EQUAL"},{"field":"alert_preferences","value":{"instant":{"trigger":"CHANGE"}},"operator":"EQUAL"}]}`,
                schedule_spec: `{"schedule_type":"CUSTOM","schedule":[{"days":[0],"start_minute":${stop},"end_minute":${stop}},{"days":[1],"start_minute":${stop},"end_minute":${stop}},{"days":[2],"start_minute":${stop},"end_minute":${stop}},{"days":[3],"start_minute":${stop},"end_minute":${stop}},{"days":[4],"start_minute":${stop},"end_minute":${stop}},{"days":[5],"start_minute":${stop},"end_minute":${stop}},{"days":[6],"start_minute":${stop},"end_minute":${stop}}]}`
            };
            FBHelper.CreateRule(token, adaccount, start_params, (response) => {
                if (response.id)
                    FBHelper.CreateRule(token, adaccount, stop_params, (response2) => {
                        if (response2.id)
                            Notify('Правила созданы');
                        else
                            Notify('Ошибка создания правил', 'danger');
                    });
                else
                    Notify('Ошибка создания правил', 'danger');
            });
        });
    });

    var action = {
        _currency: 'USD',
        _country: 'US',
        _state: 'CA',
        _zip: '',
        _tz: 116,
        save: function () {
            localStorage.setItem('action', JSON.stringify({
                currency: this._currency,
                country: this._country,
                state: this._state,
                zip: this._zip,
                tz: this._tz,
            }));
        },
        get currency() {
            return this._currency;
        },
        set currency(value) {
            this._currency = value;
            document.getElementById('action_currency_select').value = value;
        },
        get country() {
            return this._country;
        },
        set country(value) {
            this._country = value;
            document.getElementById('action_country_select').value = value;
        },
        get state() {
            return this._state;
        },
        set state(value) {
            this._state = value;
            document.getElementById('action_usa_state_select').value = value;
        },
        get zip() {
            return this._zip;
        },
        set zip(value) {
            this._zip = value;
            document.getElementById('action_zip_input').value = value;
        },
        get tz() {
            return this._tz;
        },
        set tz(value) {
            this._tz = value;
            document.getElementById('action_tz_select').value = value;
        },
    };

    var action_data = localStorage.getItem('action');
    if (action_data) {
        action_data = JSON.parse(action_data);
        action.currency = action_data.currency;
        action.country = action_data.country;
        action.state = action_data.state;
        action.zip = action_data.zip;
        action.tz = action_data.tz;
    }

    document.getElementById('action_currency_select').addEventListener('change', (event) => {
        action.currency = event.target.value;
        action.save();
    });
    document.getElementById('action_country_select').addEventListener('change', (event) => {
        action.country = event.target.value;
        action.save();
        document.getElementById('action_usa_state_wrapper').style.display = action.country == 'US' ? 'block' : 'none';
        document.getElementById('action_zip_wrapper').style.display = action.country == 'US' ? 'block' : 'none';
    });
    document.getElementById('action_usa_state_select').addEventListener('change', (event) => {
        action.state = event.target.value;
        action.save();
    });
    document.getElementById('action_zip_input').addEventListener('change', (event) => {
        action.zip = event.target.value;
        action.save();
    });
    document.getElementById('action_tz_select').addEventListener('change', (event) => {
        action.tz = event.target.value;
        action.save();
    });

    document.getElementById('change_timezone_currency').addEventListener('click', () => {
        var adaccount = action_adaccount_select.value;
        var token = document.getElementById('access_token').value;
        FBHelper.ChangeTimeZoneAndCurrency(token, adaccount, action.country, action.state, action.zip, action.currency, action.tz, (response) => {
            if (response.success) {
                Notify('Часовой пояс и валюта изменены');
            } else {
                Notify('Ошибка изменения', 'danger');
            }
        });
    });
    var card = {
        _number: '',
        _expiry_month: '',
        _expiry_year: '2021',
        _cvc: '',
        save: function () {
            localStorage.setItem('card', JSON.stringify({
                number: this._number,
                expiry_month: this._expiry_month,
                expiry_year: this._expiry_year,
                cvc: this._cvc,
            }));
        },

        get number() {
            return this._number;
        },
        set number(value) {
            var valueArr = value.split(' ');
            if (valueArr.length == 1)
                valueArr = value.split('	');
            if (valueArr.length != 4) {
                this._number = value;
                document.getElementById('card_number').value = value;
            } else {
                this._number = valueArr[0];
                document.getElementById('card_number').value = valueArr[0];
                this.expiry_month = valueArr[1];
                this.expiry_year = valueArr[2];
                this.cvc = valueArr[3];
            }
        },
        get expiry_month() {
            return this._expiry_month;
        },
        set expiry_month(value) {
            this._expiry_month = value;
            document.getElementById('card_expiry_month').value = value;
        },
        get expiry_year() {
            return this._expiry_year;
        },
        set expiry_year(value) {
            this._expiry_year = value;
            document.getElementById('card_expiry_year').value = value;
        },
        get cvc() {
            return this._cvc;
        },
        set cvc(value) {
            this._cvc = value;
            document.getElementById('card_cvc').value = value;
        }
    };

    var card_data = localStorage.getItem('card');
    if (card_data) {
        card_data = JSON.parse(card_data);
        card.number = card_data.number;
        card.expiry_month = card_data.expiry_month;
        card.expiry_year = card_data.expiry_year;
        card.cvc = card_data.cvc;
    }

    document.getElementById('card_number').addEventListener('change', (event) => {
        card.number = event.target.value;
        card.save();
    });
    document.getElementById('card_expiry_month').addEventListener('change', (event) => {
        card.expiry_month = event.target.value;
        card.save();
    });
    document.getElementById('card_expiry_year').addEventListener('change', (event) => {
        card.expiry_year = event.target.value;
        card.save();
    });
    document.getElementById('card_cvc').addEventListener('change', (event) => {
        card.cvc = event.target.value;
        card.save();
    });
    document.getElementById('add_card').addEventListener('click', () => {
        var adaccount = action_adaccount_select.value;
        var token = document.getElementById('access_token').value;
        FBHelper.GetUserId(token, (user) => {
            if (!user.id)
                return;
            FBHelper.AddCard(token, user.id, adaccount, card.number, card.expiry_year, card.expiry_month, card.cvc, (response) => {
                if (response.id && response.card_type)
                    Notify('Карта успешно привязана 🔥🔥🔥');
                else
                    Notify('При привязке возникла ошибка', 'danger');
            });
        });
    });

    action_bm_select = document.getElementById('action_bm_select');
    FBHelper.GetBMs(document.getElementById('access_token').value, (bms) => {
        if (bms.length == 0) {
            document.getElementById('bm_action_wrapper').style.display = 'none';
            return;
        }
        bms.forEach(bm => action_bm_select.insertAdjacentHTML('afterbegin', `<option value="${bm.id}">${bm.name}</option>`));
    });

    var GetLinks = () => {
        document.getElementById('bm_links_loader').style.display = 'block';
        FBHelper.GetPendingUsersLinks(document.getElementById('access_token').value, action_bm_select.value, function (links_arr, links_str) {
            document.getElementById('bm_links').value = links_arr;
            document.getElementById('bm_links_wrapper').style.display = 'block';
            document.getElementById('bm_links_loader').style.display = 'none';
        });
    };
    document.getElementById('add_people_button').addEventListener('click', () => {
        document.getElementById('bm_links_wrapper').style.display = 'none';
        document.getElementById('bm_links_loader').style.display = 'block';
        var count = 0;
        for (var i = 0; i < 4; i++) {
            FBHelper.CreateBusinessUser(document.getElementById('access_token').value, action_bm_select.value, () => {
                count++;
                if (count >= 3) {
                    GetLinks();
                }
            });
        }
    });
    document.getElementById('parse_links_button').addEventListener('click', () => {
        document.getElementById('bm_links_wrapper').style.display = 'none';
        GetLinks();
    });
}

function InitProxyView() {
    var proxy = {
        _activated: false,
        _host: '',
        _port: '',
        _username: '',
        _password: '',
        save: function () {
            localStorage.setItem('proxy', JSON.stringify({
                activated: this._activated,
                host: this._host,
                port: this._port,
                username: this._username,
                password: this._password,
            }));
            this.activate();
        },
        activate: function () {
            if (typeof InstallTrigger !== 'undefined')
                return;
            if (this.activated) {
                var config = {
                    mode: 'fixed_servers',
                    rules: {
                        singleProxy: {
                            scheme: 'http',
                            host: this.host,
                            port: parseInt(this.port)
                        }
                    },
                };
                chrome.proxy.settings.set(
                    { value: config, scope: 'regular' },
                    function () { });
            } else {
                var config = {
                    mode: 'system',
                };
                chrome.proxy.settings.set(
                    { value: config, scope: 'regular' },
                    function () { });
            }
        },

        get activated() {
            return this._activated;
        },
        set activated(value) {
            this._activated = value;
            document.getElementById('proxy_activated').checked = value;
        },
        get host() {
            return this._host;
        },
        set host(value) {
            var valueArr = value.split(' ');
            if (valueArr.length == 1)
                valueArr = value.split('	');
            if (valueArr.length != 4) {
                this._host = value;
                document.getElementById('proxy_host').value = value;
            } else {
                this._host = valueArr[0];
                document.getElementById('proxy_host').value = valueArr[0];
                this.port = valueArr[1];
                this.username = valueArr[2];
                this.password = valueArr[3];
            }
        },
        get port() {
            return this._port;
        },
        set port(value) {
            this._port = value;
            document.getElementById('proxy_port').value = value;
        },
        get username() {
            return this._username;
        },
        set username(value) {
            this._username = value;
            document.getElementById('proxy_username').value = value;
        },
        get password() {
            return this._password;
        },
        set password(value) {
            this._password = value;
            document.getElementById('proxy_password').value = value;
        }
    };

    var proxy_data = localStorage.getItem('proxy');
    if (proxy_data) {
        proxy_data = JSON.parse(proxy_data);
        proxy.activated = proxy_data.activated;
        proxy.host = proxy_data.host;
        proxy.port = proxy_data.port;
        proxy.username = proxy_data.username;
        proxy.password = proxy_data.password;
    }

    document.getElementById('proxy_activated').addEventListener('change', (event) => {
        console.log(event.target.checked);
        proxy.activated = event.target.checked;
        proxy.save();
    });
    document.getElementById('proxy_host').addEventListener('change', (event) => {
        proxy.host = event.target.value;
        proxy.save();
    });
    document.getElementById('proxy_port').addEventListener('change', (event) => {
        proxy.port = event.target.value;
        proxy.save();
    });
    document.getElementById('proxy_username').addEventListener('change', (event) => {
        proxy.username = event.target.value;
        proxy.save();
    });
    document.getElementById('proxy_password').addEventListener('change', (event) => {
        proxy.password = event.target.value;
        proxy.save();
    });
}

function InitUAView() {
    var uaGenerator = new UAGenerator();
    var ua = localStorage.getItem('ua');
    if (!ua)
        ua = {
            type: 'default',
            generated_value: uaGenerator.generate(),
            personal_value: ''
        }
    else
        ua = JSON.parse(ua);
    switch_type = function (type) {
        switch (type) {
            case 'generated':
                document.getElementById('ua_generated_wrapper').style.display = 'block';
                document.getElementById('ua_personal_wrapper').style.display = 'none';
                break;
            case 'personal':
                document.getElementById('ua_generated_wrapper').style.display = 'none';
                document.getElementById('ua_personal_wrapper').style.display = 'block';
                break;
            default:
                document.getElementById('ua_generated_wrapper').style.display = 'none';
                document.getElementById('ua_personal_wrapper').style.display = 'none';
                break;
        }
    }
    switch_type(ua.type);
    document.getElementById('ua_type').value = ua.type;
    document.getElementById('ua_type').addEventListener('change', (event) => {
        ua.type = event.target.value;
        switch_type(ua.type);
        localStorage.setItem('ua', JSON.stringify(ua));
    });

    document.getElementById('ua_personal_value').value = ua.personal_value;
    document.getElementById('ua_personal_value').addEventListener('change', (event) => {
        ua.personal_value = event.target.value;
        localStorage.setItem('ua', JSON.stringify(ua));
    });

    document.getElementById('ua_generated_value').innerText = ua.generated_value;
    document.getElementById('ua_generate_button').addEventListener('click', (event) => {
        ua.generated_value = uaGenerator.generate();
        document.getElementById('ua_generated_value').innerText = ua.generated_value;
        localStorage.setItem('ua', JSON.stringify(ua));
    });
}

function InitTranslateView() {
    document.getElementById('translated_activated').checked = localStorage.getItem('translate') == 1;
    document.getElementById('translated_activated').addEventListener('change', (event) => {
        localStorage.setItem('translate', event.target.checked ? 1 : 0);
    });
}

function InitCookieView() {
    var refresh_cookies = function () {
        chrome.cookies.getAll({ url: 'https://facebook.com' }, function (cookies) {
            document.getElementById('cookie_value').value = JSON.stringify(cookies);
        });
    }
    refresh_cookies();

    document.getElementById('remove_cookie').addEventListener('click', () => {
        chrome.cookies.getAll({ url: 'https://facebook.com' }, function (cookies) {
            cookies.forEach(cookie => {
                console.log(cookie);
                chrome.cookies.remove({
                    "url": "https://facebook.com/",
                    "name": cookie.name
                });
            });
            refresh_cookies();
        });
    });
    document.getElementById('save_cookie').addEventListener('click', function () {
        var cookies = document.getElementById('cookie_value').value;
        cookies = JSON.parse(cookies);
        cookies.forEach(cookie => {
            if (cookie.domain != '.facebook.com')
                return;
            var clear_cookie = {
                url: "https://www.facebook.com",
                domain: cookie.domain,
                path: cookie.path,
                name: cookie.name,
                value: cookie.value,
                expirationDate: cookie.expirationDate
            };
            chrome.cookies.set(clear_cookie, () => { });
        });

    });
    document.getElementById('netscape_to_json_button').addEventListener('click', function () {
        document.getElementById('cookie_value').value = NetscapeToJson(document.getElementById('cookie_value').value);
    });
}

function NetscapeToJson(cookies) {
    var arrObjects = [];
    var arrayOfLines = cookies.split("\n");
    for (var i = 0; i < arrayOfLines.length; i++) {
        var kuka = arrayOfLines[i].split("\t");
        var cook = new Object();
        cook.domain = kuka[0];
        cook.expirationDate = parseInt(kuka[4]);

        if (kuka[1] == "FALSE") cook.httpOnly = false;
        if (kuka[1] == "TRUE") cook.httpOnly = true;

        cook.name = kuka[5];
        cook.path = kuka[2];

        if (kuka[3] == "FALSE") cook.secure = false;
        if (kuka[3] == "TRUE") cook.secure = true;


        cook.value = kuka[6];


        arrObjects[i] = cook;
    }

    return JSON.stringify(arrObjects);
}

document.addEventListener('DOMContentLoaded', function () {
    InitNavigation();
    InitBtnClipboard();
    InitProxyView();
    InitUAView();
    InitCookieView();
    InitTranslateView();
    chrome.tabs.executeScript(null, {
        file: "js/getTokenFromPage.js"
    }, function () {
        if (chrome.runtime.lastError) {
            document.getElementById('accounts_loader').style.display = 'none';
            document.getElementById('accounts_error').style.display = 'block';
        }
    });
});

chrome.runtime.onMessage.addListener(function (request, sender) {
    if (request.action == "getToken") {
        if (!request.token) {
            document.getElementById('accounts_loader').style.display = 'none';
            document.getElementById('accounts_error').style.display = 'block';
        } else {
            document.getElementById('accounts').style.display = 'block';
            document.getElementById('access_token').value = request.token;
            FBHelper.GetDataFromFB(request.token, (adaccounts) => {
                document.getElementById('accounts_loader').style.display = 'none';
                InitAccountsView(adaccounts);
                InitActionsView(adaccounts);
            });
        }
    }
});