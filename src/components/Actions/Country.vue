<script setup>
import Select from "@/components/ui/Select.vue";
import Input from "@/components/ui/Input.vue";
import Button from "@/components/ui/Button.vue";
import { onMounted, ref, watch, inject } from "vue";

const emitter = inject("emitter");

const props = defineProps({
    adaccount_id: Number,
    access_token: String,
});

const timezones = {
    100: "(GMT +13:00) Время в Окленде",
    125: "(GMT +12:00) Время на Камчатке",
    15: "(GMT +11:00) Время в Сиднее",
    124: "(GMT +11:00) Время в Магадане",
    144: "(GMT +11:00) Время в Мельбурне",
    14: "(GMT +10:30) Время в Брокен-Хилл",
    123: "(GMT +10:00) Время во Владивостоке",
    68: "(GMT +09:00) Время в Джаяпуре",
    77: "(GMT +09:00) Время в Токио",
    79: "(GMT +09:00) Время в Сеуле",
    122: "(GMT +09:00) Время в Якутске",
    13: "(GMT +08:00) Время в Перте",
    62: "(GMT +08:00) Время в Гонконге",
    67: "(GMT +08:00) Время в Макассаре",
    95: "(GMT +08:00) Время в Куала-Лумпуре",
    104: "(GMT +08:00) Время в Маниле",
    121: "(GMT +08:00) Время в Иркутске",
    128: "(GMT +08:00) Время в Сингапуре",
    136: "(GMT +08:00) Время в Тайбэе",
    66: "(GMT +07:00) Время в Джакарте",
    120: "(GMT +07:00) Время в Красноярске",
    132: "(GMT +07:00) Время в Бангкоке",
    140: "(GMT +07:00) Время в Хо Ши Мине",
    17: "(GMT +06:00) Время в Дакке",
    119: "(GMT +06:00) Время в Омске",
    145: "(GMT +05:45) Время в Катманду",
    476: "(GMT +05:30) Время в Калькутте",
    82: "(GMT +05:30) Время в Коломбо",
    90: "(GMT +05:00) Время на Мальдивах",
    105: "(GMT +05:00) Время в Карачи",
    118: "(GMT +05:00) Время в Екатеринбурге",
    8: "(GMT +04:00) Время в Дубае",
    89: "(GMT +04:00) Время в Маврикии",
    101: "(GMT +04:00) Время в Мускате",
    117: "(GMT +04:00) Время в Самаре",
    146: "(GMT +04:00) Время в Баку",
    347: "(GMT +04:00) Время в Ереване",
    20: "(GMT +03:00) Время в Бахрейне",
    72: "(GMT +03:00) Время в Багдаде",
    78: "(GMT +03:00) Время в Найроби",
    80: "(GMT +03:00) Время в Кувейте",
    112: "(GMT +03:00) Время в Катаре",
    116: "(GMT +03:00) Время в Москве",
    126: "(GMT +03:00) Время в Эр-Рияде",
    134: "(GMT +03:00) Время в Истанбуле",
    19: "(GMT +02:00) Время в Софии",
    45: "(GMT +02:00) Время в Никосии",
    52: "(GMT +02:00) Время в Таллине",
    53: "(GMT +02:00) Время в Каире",
    56: "(GMT +02:00) Время в Хельсинки",
    60: "(GMT +02:00) Время в Афинах",
    70: "(GMT +02:00) Время в Иерусалиме",
    76: "(GMT +02:00) Время в Аммане",
    81: "(GMT +02:00) Время в Бейруте",
    83: "(GMT +02:00) Время в Вильнюсе",
    85: "(GMT +02:00) Время в Риге",
    108: "(GMT +02:00) Время в Газе",
    113: "(GMT +02:00) Время в Бухаресте",
    115: "(GMT +02:00) Время в Калининграде",
    137: "(GMT +02:00) Время в Киеве",
    141: "(GMT +02:00) Время в Йоханнесбурге",
    404: "(GMT +02:00) Время в Кишенёве",
    12: "(GMT +01:00) Время в Вене",
    16: "(GMT +01:00) Время в Сараево",
    18: "(GMT +01:00) Время в Брюсселе",
    39: "(GMT +01:00) Время в Цюрихе",
    46: "(GMT +01:00) Время в Праге",
    47: "(GMT +01:00) Время в Берлине",
    48: "(GMT +01:00) Время в Копенгагене",
    55: "(GMT +01:00) Время в Мадриде",
    57: "(GMT +01:00) Время в Париже",
    64: "(GMT +01:00) Время в Загребе",
    65: "(GMT +01:00) Время в Будапеште",
    74: "(GMT +01:00) Время в Риме",
    84: "(GMT +01:00) Время в Люксембурге",
    86: "(GMT +01:00) Время в Касабланке",
    87: "(GMT +01:00) Время в Скопье",
    88: "(GMT +01:00) Время на Мальте",
    96: "(GMT +01:00) Время в Лагосе",
    98: "(GMT +01:00) Время в Амстердаме",
    99: "(GMT +01:00) Время в Осло",
    106: "(GMT +01:00) Время в Варшаве",
    114: "(GMT +01:00) Время в Белграде",
    127: "(GMT +01:00) Время в Стокгольме",
    129: "(GMT +01:00) Время в Любляне",
    130: "(GMT +01:00) Время в Братиславе",
    133: "(GMT +01:00) Время в Тунисе",
    54: "(GMT +00:00) Время на Канарских островах",
    58: "(GMT +00:00) Время в Лондоне",
    59: "(GMT +00:00) Время в Аккре",
    69: "(GMT +00:00) Время в Дублине",
    73: "(GMT +00:00) Время в Рейкьявике",
    110: "(GMT +00:00) Время в Лисбоне",
    187: "(GMT +00:00) Время в Уагадугу",
    109: "(GMT -01:00) Время на Азорских островах",
    22: "(GMT -02:00) Время в Норонья",
    9: "(GMT -03:00) Время в Сан-Луисе",
    10: "(GMT -03:00) Время в Буэнос-Айресе",
    11: "(GMT -03:00) Время в Сальте",
    24: "(GMT -03:00) Время в Белеме",
    25: "(GMT -03:00) Время в Сан-Паулу",
    41: "(GMT -03:00) Время в Сантьяго",
    111: "(GMT -03:00) Время в Асунсьоне",
    138: "(GMT -03:00) Время в Монтевидео",
    38: "(GMT -03:30) Время в Сент-Джонсе",
    21: "(GMT -04:00) Время в Ла-Пасе",
    23: "(GMT -04:00) Время в Кампу-Гранди",
    36: "(GMT -04:00) Время в Бланк-Саблоне",
    37: "(GMT -04:00) Время в Галифаксе",
    49: "(GMT -04:00) Время в Санто-Доминго",
    107: "(GMT -04:00) Время в Пуэрто-Рико",
    135: "(GMT -04:00) Время в Порт-оф-Спейн",
    139: "(GMT -04:00) Время в Каракасе",
    26: "(GMT -05:00) Время в Нассау",
    33: "(GMT -05:00) Время в Атикокане",
    34: "(GMT -05:00) Время в Икалуите",
    35: "(GMT -05:00) Время в Торонто",
    43: "(GMT -05:00) Время в Боготе",
    51: "(GMT -05:00) Время в Гуаякиле",
    75: "(GMT -05:00) Время на Ямайке",
    102: "(GMT -05:00) Время в Панаме",
    103: "(GMT -05:00) Время в Лиме",
    143: "(GMT -05:00) Время в Детройте",
    31: "(GMT -06:00) Время в Рейни Ривер",
    32: "(GMT -06:00) Время в Реджайне",
    44: "(GMT -06:00) Время в Коста-Рике",
    50: "(GMT -06:00) Время на Галапагосских островах",
    61: "(GMT -06:00) Время в Гватемале",
    63: "(GMT -06:00) Время в Тегусигальпе",
    94: "(GMT -06:00) Время в Мехико",
    97: "(GMT -06:00) Время в Манагуа",
    131: "(GMT -06:00) Время в Сальвадоре",
    142: "(GMT -06:00) Время в Виннипеге",
    27: "(GMT -07:00) Время в Доусоне",
    29: "(GMT -07:00) Время в Доусон-Крике",
    30: "(GMT -07:00) Время в Эдмонте",
    92: "(GMT -07:00) Время в Эрмосильо",
    93: "(GMT -07:00) Время в Мазатлане",
    28: "(GMT -08:00) Время в Ванкувере",
    91: "(GMT -08:00) Время в Тихуане",
};
const countries = {
    RU: "Россия",
    UA: "Украина",
    US: "Соединённые Штаты Америки",
    PE: "Перу",
    GT: "Гватемала",
    GL: "Гренландия",
    IS: "Исландия",
    KZ: "Казахстан",
    AU: "Австралия",
    AT: "Австрия",
    AZ: "Азербайджан",
    AX: "Аландские острова",
    AL: "Албания",
    DZ: "Алжир",
    AS: "Американское Самоа",
    AI: "Ангилья",
    AO: "Ангола",
    AD: "Андорра",
    AQ: "Антарктика",
    AG: "Антигуа и Барбуда",
    AR: "Аргентина",
    AM: "Армения",
    AW: "Аруба",
    AF: "Афганистан",
    BS: "Багамские Острова",
    BD: "Бангладеш",
    BB: "Барбадос",
    BH: "Бахрейн",
    BY: "Беларусь",
    BZ: "Белиз",
    BE: "Бельгия",
    BJ: "Бенин",
    BM: "Бермудские Острова",
    BG: "Болгария",
    BO: "Боливия",
    BA: "Босния и Герцеговина",
    BW: "Ботсвана",
    BR: "Бразилия",
    IO: "Британская Территория в Индийском Океане",
    BN: "Бруней",
    BF: "Буркина Фасо",
    BI: "Бурунди",
    BT: "Бутан",
    VU: "Вануату",
    VA: "Ватикан",
    GB: "Великобритания",
    HU: "Венгрия",
    VE: "Венесуэла",
    VG: "Виргинские Острова",
    VI: "Виргинские Острова",
    UM: "Внешние малые острова США",
    TL: "Восточный Тимор",
    VN: "Вьетнам",
    GA: "Габон",
    HT: "Гаити",
    GY: "Гайана",
    GM: "Гамбия",
    GH: "Гана",
    GP: "Гваделупа",
    GN: "Гвинея",
    GW: "Гвинея Бисау",
    DE: "Германия",
    GI: "Гибралтар",
    HN: "Гондурас",
    HK: "Гонконг",
    GD: "Гранада",
    GR: "Греция",
    GE: "Грузия",
    GU: "Гуам",
    DK: "Дания",
    CD: "Демократическая Республика Конго",
    DJ: "Джибути",
    DM: "Доминика",
    DO: "Доминиканская Республика",
    EG: "Египет",
    ZM: "Замбия",
    EH: "Западная Сахара",
    ZW: "Зимбабве",
    IL: "Израиль",
    IN: "Индия",
    ID: "Индонезия",
    JO: "Иордания",
    IQ: "Ирак",
    IR: "Иран",
    IE: "Ирландия",
    ES: "Испания",
    IT: "Италия",
    YE: "Йемен",
    CV: "Кабо Верде",
    KH: "Камбоджа",
    CM: "Камерун",
    CA: "Канада",
    QA: "Катар",
    KE: "Кения",
    CY: "Кипр",
    KG: "Киргизия",
    KI: "Кирибати",
    CN: "Китай",
    CC: "Кокосовые острова",
    CO: "Колумбия",
    KM: "Коморы",
    KP: "Корейская Народно Демократическая Республика",
    XK: "Косово",
    CR: "Коста Рика",
    CI: "Кот д Ивуар",
    CU: "Куба",
    KW: "Кувейт",
    LA: "Лаос",
    LV: "Латвия",
    LS: "Лесото",
    LR: "Либерия",
    LB: "Ливан",
    LY: "Ливия",
    LT: "Литва",
    LI: "Лихтенштейн",
    LU: "Люксембург",
    MU: "Маврикий",
    MR: "Мавритания",
    MG: "Мадагаскар",
    YT: "Майотта",
    MO: "Макао",
    MW: "Малави",
    MY: "Малайзия",
    ML: "Мали",
    MV: "Мальдивы",
    MT: "Мальта",
    MA: "Марокко",
    MQ: "Мартиника",
    MH: "Маршалловы Острова",
    MX: "Мексика",
    MZ: "Мозамбик",
    MC: "Монако",
    MN: "Монголия",
    MS: "Монсеррат",
    MM: "Мьянма",
    NA: "Намибия",
    NP: "Непал",
    NE: "Нигер",
    NG: "Нигерия",
    AN: "Нидерландские Антильские острова",
    NL: "Нидерланды",
    NI: "Никарагуа",
    NU: "Ниуэ",
    NZ: "Новая Зеландия",
    NC: "Новая Каледония",
    NO: "Норвегия",
    AE: "Объединённые Арабские Эмираты",
    PS: "Оккупированная Палестинская Территория",
    OM: "Оман",
    BV: "Остров Буве",
    IM: "Остров Мэн",
    NF: "Остров Норфолк",
    CX: "Остров Рождества",
    SH: "Остров Святой Елены",
    HM: "Остров Херд и острова Макдональд",
    KY: "Острова Кайман",
    CK: "Острова Кука",
    PK: "Пакистан",
    PW: "Палау",
    PA: "Панама",
    PG: "Папуа Новая Гвинея",
    PY: "Парагвай",
    PN: "Питкэрн",
    PL: "Польша",
    PT: "Португалия",
    PR: "Пуэрто Рико",
    CG: "Республика Конго",
    KR: "Республика Корея",
    MD: "Республика Молдова",
    RE: "Реюньон",
    RW: "Руанда",
    RO: "Румыния",
    SV: "Сальвадор",
    WS: "Самоа",
    SM: "Сан Марино",
    ST: "Сан Томе и Принсипи",
    SA: "Саудовская Аравия",
    MK: "Северная Македония",
    MP: "Северные Марианские Острова",
    SC: "Сейшелы",
    PM: "Сен Пьер и Микелон",
    SN: "Сенегал",
    VC: "Сент Винсент и Гренадины",
    KN: "Сент Китс и Невис",
    LC: "Сент Люсия",
    RS: "Сербия",
    CS: "Сербия и Черногория",
    SG: "Сингапур",
    SY: "Сирия",
    SK: "Словакия",
    SI: "Словения",
    SB: "Соломоновы Острова",
    SO: "Сомали",
    SD: "Судан",
    SR: "Суринам",
    SL: "Сьерра Леоне",
    TJ: "Таджикистан",
    TH: "Таиланд",
    TW: "Тайвань",
    TZ: "Танзания",
    TC: "Теркс и Кайкос",
    TG: "Того",
    TK: "Токелау",
    TO: "Тонга",
    TT: "Тринидад и Тобаго",
    TV: "Тувалу",
    TN: "Тунис",
    TM: "Туркменистан",
    TR: "Турция",
    UG: "Уганда",
    UZ: "Узбекистан",
    WF: "Уоллис и Футуна",
    UY: "Уругвай",
    FO: "Фарерские острова",
    FM: "Федеративные Штаты Микронезии",
    FJ: "Фиджи",
    PH: "Филиппины",
    FI: "Финляндия",
    FK: "Фолклендские острова",
    FR: "Франция",
    GF: "Французская Гвиана",
    PF: "Французская Полинезия",
    TF: "Французские Южные и Антарктические территории",
    HR: "Хорватия",
    CF: "Центральноафриканская Республика",
    TD: "Чад",
    ME: "Черногория",
    CZ: "Чехия",
    CL: "Чили",
    CH: "Швейцария",
    SE: "Швеция",
    SJ: "Шпицберген и Ян Майен",
    LK: "Шри Ланка",
    EC: "Эквадор",
    GQ: "Экваториальная Гвинея",
    ER: "Эритрея",
    SZ: "Эсватини",
    EE: "Эстония",
    ET: "Эфиопия",
    GS: "Южная Георгия и Южные Сандвичевы Острова",
    ZA: "Южно Африканская Республика",
    SS: "Южный Судан",
    JM: "Ямайка",
    JP: "Япония",
};
const states = {
    AL: "Alabama",
    AK: "Alaska",
    AZ: "Arizona",
    AR: "Arkansas",
    CA: "California",
    CO: "Colorado",
    CT: "Connecticut",
    DE: "Delaware",
    FL: "Florida",
    GA: "Georgia",
    HI: "Hawaii",
    ID: "Idaho",
    IL: "Illinois",
    IN: "Indiana",
    IA: "Iowa",
    KS: "Kansas",
    KY: "Kentucky",
    LA: "Louisiana",
    ME: "Maine",
    MD: "Maryland",
    MA: "Massachusetts",
    MI: "Michigan",
    MN: "Minnesota",
    MS: "Mississippi",
    MO: "Missouri",
    MT: "Montana",
    NE: "Nebraska",
    NV: "Nevada",
    NH: "New Hampshire",
    NJ: "New Jersey",
    NM: "New Mexico",
    NY: "New York",
    NC: "North Carolina",
    ND: "North Dakota",
    OH: "Ohio",
    OK: "Oklahoma",
    OR: "Oregon",
    PA: "Pennsylvania",
    RI: "Rhode Island",
    SC: "South Carolina",
    SD: "South Dakota",
    TN: "Tennessee",
    TX: "Texas",
    UT: "Utah",
    VT: "Vermont",
    VA: "Virginia",
    WA: "Washington",
    WV: "West Virginia",
    WI: "Wisconsin",
    WY: "Wyoming",
};
const currencies = [
    "RUB",
    "USD",
    "UAH",
    "ALL",
    "AFN",
    "ARS",
    "AWG",
    "AUD",
    "AZN",
    "BSD",
    "BBD",
    "BYN",
    "BZD",
    "BMD",
    "BOB",
    "BAM",
    "BWP",
    "BGN",
    "BRL",
    "BND",
    "KHR",
    "CAD",
    "KYD",
    "CLP",
    "CNY",
    "COP",
    "CRC",
    "HRK",
    "CUP",
    "CZK",
    "DKK",
    "DOP",
    "DZD",
    "XCD",
    "EGP",
    "SVC",
    "EUR",
    "FKP",
    "FJD",
    "GHS",
    "GIP",
    "GTQ",
    "GGP",
    "GYD",
    "HNL",
    "HKD",
    "HUF",
    "ISK",
    "INR",
    "IDR",
    "IRR",
    "IMP",
    "ILS",
    "JMD",
    "JPY",
    "JEP",
    "KZT",
    "KPW",
    "KRW",
    "KGS",
    "LAK",
    "LBP",
    "LRD",
    "MKD",
    "MYR",
    "MUR",
    "MXN",
    "MNT",
    "MZN",
    "NAD",
    "NPR",
    "ANG",
    "NZD",
    "NIO",
    "NGN",
    "KPW",
    "NOK",
    "OMR",
    "PKR",
    "PAB",
    "PYG",
    "PEN",
    "PHP",
    "PLN",
    "QAR",
    "RON",
    "SHP",
    "SAR",
    "RSD",
    "SCR",
    "SGD",
    "SBD",
    "SOS",
    "ZAR",
    "KRW",
    "LKR",
    "SEK",
    "CHF",
    "SRD",
    "SYP",
    "TWD",
    "THB",
    "TTD",
    "TRY",
    "TVD",
    "GBP",
    "UYU",
    "UZS",
    "VEF",
    "VND",
    "YER",
    "ZWD",
];

const form = ref({
    tz: 116,
    zip: "",
    currency: "USD",
    country: "US",
    state: "CA",
});
onMounted(() => {
    var action_data = localStorage.getItem("action");
    if (action_data) {
        action_data = JSON.parse(action_data);
        form.value.currency = action_data.currency;
        form.value.country = action_data.country;
        form.value.state = action_data.state;
        form.value.zip = action_data.zip;
        form.value.tz = action_data.tz;
    }
    watch(() => form.value.tz, save);
    watch(() => form.value.zip, save);
    watch(() => form.value.country, save);
    watch(() => form.value.currency, save);
    watch(() => form.value.state, save);
});
function save() {
    window.localStorage.setItem("action", JSON.stringify(form.value));
}

function apply() {
    var xhr = new XMLHttpRequest();

    if (form.value.country == "US")
        var body = `timezone_id=${form.value.tz}&currency=${form.value.currency}&business_info={"business_country_code":"${form.value.country}","business_city":"Los Angeles","business_name":"Carl Johnson","business_state":"${form.value.state}","business_street":"Grove Street","business_zip":${form.value.zip}}&access_token=${props.access_token}`;
    else
        var body =
            "timezone_id=" +
            form.value.tz +
            "&currency=" +
            form.value.currency +
            '&business_info={"business_country_code":"' +
            form.value.country +
            '","business_zip":672934}&access_token=' +
            props.access_token;

    xhr.open("POST", "https://graph.facebook.com/v15.0/act_" + props.adaccount_id, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    xhr.onload = function () {
        var response = JSON.parse(xhr.response);
        if (response.success) emitter.emit("notify", { title: "Часовой пояс и валюта изменены", type: "success" });
        else emitter.emit("notify", { title: "Ошибка изменения", type: "error" });
    };

    xhr.send(body);
}
</script>
<template>
    <div class="flex flex-col gap-3">
        <Select label="Часовой пояс" v-model="form.tz">
            <option v-for="(name, code) of timezones" :value="code" :key="code">{{ name }}</option>
        </Select>
        <Select label="Страна" v-model="form.country">
            <option v-for="(name, code) of countries" :value="code" :key="code">{{ name }}</option>
        </Select>
        <Select label="Штат" v-model="form.state" v-if="form.country == 'US'">
            <option v-for="(name, code) of states" :value="code" :key="code">{{ name }}</option>
        </Select>
        <Input label="Почтовый индекc" v-model="form.zip" v-if="form.country == 'US'" />
        <Select label="Валюта" v-model="form.currency">
            <option v-for="name of currencies" :value="name" :key="name">{{ name }}</option>
        </Select>
        <Button color="teal" :bg="true" @click="apply">Изменить страну, ч/п и валюту</Button>
    </div>
</template>
