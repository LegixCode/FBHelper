import RandExp from "randexp";

export default class UAGenerator {
    patterns = {
        locales: ["en-(US|AU|CA|IN|IE|MT|NZ|PH|SG|ZA|GB|US)"],
        net_clr: {
            v1: ["( \\.NET CLR 1\\.[0-1]\\.[4-5]07[0-5][0-9];|)"],
            v2up: ["( \\.NET CLR [2-3]\\.[1-8]\\.[3-5]07[0-9][0-9];|)"],
        },
        media_server: ["( Media Center PC [4-6]\\.0;|)"],
        windows: ["Windows NT (6\\.[1-3]|10\\.0|11\\.0)"],
        macos: {
            v10_blink: ["Intel Mac OS X 10_(1[4-5])_[0-7]", "Intel Mac OS X 1[1-3]_[0-7]_[0-9]"],
            v10_firefox: ["Intel Mac OS X 1[0-3]\\.[0-7]"],
        },
        applewebkit: ["AppleWebKit/(60[5-9]\\.[1-7]\\.[1-8])", "AppleWebKit/(53[5-8]\\.[1-2][0-9]\\.[1-3][0-9])"],
        browsers_versions: {
            chrome: ["(12[0-2]\\.0\\.\\d{4}|11[0-9]\\.0\\.\\d{4})\\.(?:[1-9][0-9]|[1-9][0-9][0-9])"],
            safari: ["1[6-7]\\.[0-4]\\.[1-9]"],
            firefox: ["1(2[0-3]|1[0-9])\\.0"],
            opera: ["9[5-9]\\.0\\.\\d{4}\\.([1-9][0-9]|[1-9][0-9][0-9])", "10[0-2]\\.0\\.\\d{4}\\.([1-9][0-9]|[1-9][0-9][0-9])"],
            edge: [
                "Chrome/11[0-9]\\.0\\.\\d{4}\\.\\d+ Safari/537\\.36 Edg/11[0-9]\\.0\\.\\d{4}\\.[0-9]+",
                "Chrome/12[0-2]\\.0\\.\\d{4}\\.\\d+ Safari/537\\.36 Edg/12[0-2]\\.0\\.\\d{4}\\.[0-9]+",
            ],
        },
    };
    useragents = {
        chrome: {
            win: {
                name: "Chrome on Windows",
                regexp: [
                    "Mozilla/5\\.0 \\(" +
                        this.get(this.patterns.windows) +
                        "(; Win64; x64|; WOW64|)\\) AppleWebKit/537\\.36 \\(KHTML, like Gecko\\) Chrome/(" +
                        this.get(this.patterns.browsers_versions.chrome) +
                        ") Safari/537\\.36",
                ],
            },
            mac: {
                name: "Chrome on Mac",
                regexp: [
                    "Mozilla/5\\.0 \\(Macintosh; " +
                        this.get(this.patterns.macos.v10_blink) +
                        "\\) AppleWebKit/537\\.36 \\(KHTML, like Gecko\\) Chrome/(" +
                        this.get(this.patterns.browsers_versions.chrome) +
                        ") Safari/537\\.36",
                ],
            },
        },
        firefox: {
            win: {
                name: "Firefox on Windows",
                regexp: [
                    "Mozilla/5\\.0 \\(" +
                        this.get(this.patterns.windows) +
                        "; (WOW64|Win64); rv:(" +
                        this.get(this.patterns.browsers_versions.firefox) +
                        ")\\) Gecko/20100101 Firefox/(\\3)",
                ],
            },
            mac: {
                name: "Firefox on Mac",
                regexp: [
                    "Mozilla/5\\.0 \\(Macintosh;( U; | )" +
                        this.get(this.patterns.macos.v10_firefox) +
                        "; rv:(" +
                        this.get(this.patterns.browsers_versions.firefox) +
                        ")\\) Gecko/20100101 Firefox/(\\3)",
                ],
            },
        },
        safari: {
            mac: {
                name: "Safari on Mac",
                regexp: [
                    "Mozilla/5\\.0 \\(Macintosh;( U; | )" +
                        this.get(this.patterns.macos.v10_blink) +
                        "; " +
                        this.get(this.patterns.locales) +
                        "\\) " +
                        this.get(this.patterns.applewebkit) +
                        " \\(KHTML, like Gecko\\) Version/" +
                        this.get(this.patterns.browsers_versions.safari) +
                        " Safari/(\\4)",
                ],
            },
        },
        opera: {
            win: {
                name: "Opera on Windows",
                regexp: [
                    "Mozilla/5\\.0 \\(" +
                        this.get(this.patterns.windows) +
                        "(; Win64; x64|; WOW64|)\\) AppleWebKit/537\\.36 \\(KHTML, like Gecko\\) Chrome/(" +
                        this.get(this.patterns.browsers_versions.chrome) +
                        ") Safari/537\\.36 OPR/" +
                        this.get(this.patterns.browsers_versions.opera),
                ],
            },
            mac: {
                name: "Opera on Mac",
                regexp: [
                    "Mozilla/5\\.0 \\(Macintosh; " +
                        this.get(this.patterns.macos.v10_blink) +
                        "\\) AppleWebKit/537\\.36 \\(KHTML, like Gecko\\) Chrome/(" +
                        this.get(this.patterns.browsers_versions.chrome) +
                        ") Safari/537\\.36 OPR/" +
                        this.get(this.patterns.browsers_versions.opera),
                ],
            },
        },
    };

    isString(e: any) {
        return "string" == typeof e;
    }

    isUndefined(e: any) {
        return void 0 === e;
    }

    get(e: any) {
        return Array.isArray(e) ? e[Math.floor(Math.random() * e.length)] : null;
    }

    randexp(e: any) {
        if ("undefined" == typeof RandExp) throw new Error('"RandExp" component must be included first');
        if (this.isString(e)) return new RandExp(e).gen();
        console.error("regexp must be string");
        return null;
    }

    getAllByKeyName(e: any, t: any) {
        const i = [];

        const recursive = (e: any, t: any) => {
            for (const s in e)
                "object" != typeof e[s] || Array.isArray(e[s]) || null === e[s]
                    ? s === t && i.push(e[s])
                    : recursive(e[s], t);
        };

        recursive(e, t);

        return i;
    }

    generate(e: any = null) {
        this.isString(e) && (e = [e]);
        Array.isArray(e) || (e = []);
        e.length <= 0 && (e = ["*"]);
        const t = [];
        for (let i = 0, s = e.length; i < s; i++) {
            if ("*" === e[i]) return this.randexp(this.get(this.get(this.getAllByKeyName(this.useragents, "regexp"))));
            let r: any, n: any;
            const o = e[i].split("_");
            !this.isUndefined(o[0]) && this.isString(o[0]) && (r = o[0]);
            !this.isUndefined(o[1]) && this.isString(o[1]) && (n = o[1]);
            this.isUndefined(r) ||
                this.isUndefined(n) ||
                this.isUndefined(this.useragents[r][n]) ||
                t.push(this.get(this.useragents[r][n].regexp));
        }
        if (t.length > 0) return this.randexp(this.get(t));
        console.error("User-Agent patterns not found");
        return null;
    }
}
