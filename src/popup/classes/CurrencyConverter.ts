import { currencySymbols } from "../data/currencies";
import { IAdaccount } from "./FB/types/IAdaccount";

export class CurrencyConverter {
    private static instance: CurrencyConverter | null = null;
    private observer: MutationObserver | null = null;
    private currentActId: string | null = null;

    private constructor() {
        this.init();
        this.setupURLChangeListener();
    }

    public static getInstance(): CurrencyConverter {
        if (!CurrencyConverter.instance) {
            CurrencyConverter.instance = new CurrencyConverter();
        }
        return CurrencyConverter.instance;
    }

    private init(): void {
        const urlParams = new URLSearchParams(window.location.search);
        const actId = urlParams.get("act");
        if (actId !== this.currentActId) {
            this.stopObservation();
            this.currentActId = actId;

            if (actId) {
                this.processAdAccount(actId);
            }
        }
    }

    private setupURLChangeListener(): void {
        if ("navigation" in window) {
            window.navigation.addEventListener("navigate", () => {
                this.init();
            });
        } else {
            console.warn("Navigation API не поддерживается в этом браузере");
        }
    }

    private stopObservation(): void {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }

    private processAdAccount(actId: string): void {
        chrome.storage.local.get(["currency_converter", "adaccounts"], (result) => {
            if (!result.currency_converter || !result.adaccounts) return;

            try {
                const config = JSON.parse(result.currency_converter);
                if (!config.is_active) return;

                const adaccounts: IAdaccount[] = JSON.parse(result.adaccounts);
                const adaccount = adaccounts.find((acc) => acc.id === actId);

                if (!adaccount || adaccount.currency === "USD") return;

                this.convertCurrency(adaccount);
            } catch (error) {
                console.error("Ошибка при обработке данных для конвертации валют:", error);
            }
        });
    }

    private convertCurrency(adaccount: IAdaccount): void {
        const currencySymbolsArray = currencySymbols[adaccount.currency] || [];
        if (currencySymbolsArray.length === 0 || !adaccount.currency_ratio_to_usd) return;

        this.stopObservation();

        this.observer = new MutationObserver((mutations) => {
            const currentActId = new URLSearchParams(window.location.search).get("act");

            if (currentActId !== this.currentActId) {
                this.init();
                return;
            }

            for (const mutation of mutations) {
                if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                    this.findAndConvertCurrencySpans(currencySymbolsArray, adaccount.currency_ratio_to_usd);
                }
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true,
        });

        this.findAndConvertCurrencySpans(currencySymbolsArray, adaccount.currency_ratio_to_usd);
    }

    private findAndConvertCurrencySpans(currencySymbols: string[], currencyRatio: number): void {
        currencySymbols = currencySymbols.map((s) => this.escapeRegExp(s));
        const spans = document.querySelectorAll("span:not(:has(*))");

        const regexs = currencySymbols.flatMap((symbol) => [
            new RegExp(`^${symbol}\\s*(\\d+(?:[\\s,.'\\s]\\d+)*(?:[.,]\\d{2})?)$`),
            new RegExp(`^(\\d+(?:[\\s,.'\\s]\\d+)*(?:[.,]\\d{2})?)\\s*${symbol}$`),
        ]);

        spans.forEach((span) => {
            const text = span.textContent?.trim();
            if (!text) return;
            let newText = null;

            for (const regex of regexs) {
                if (regex.test(text)) {
                    newText = text.replace(regex, (match, amount) => {
                        const numAmount = this.parseNumberWithFormat(amount);
                        const usdAmount = this.convertToUsd(numAmount, currencyRatio);
                        return `±$${usdAmount.toFixed(2)}`;
                    });
                    break;
                }
            }

            if (newText) {
                span.textContent = newText;
            }
        });
    }

    private parseNumberWithFormat(formattedNumber: string): number {
        const hasDecimalPart = /[.,]\d{2}$/.test(formattedNumber);

        if (hasDecimalPart) {
            const decimalPart = formattedNumber.slice(-3).replace(",", ".");
            const wholePart = formattedNumber.slice(0, -3).replace(/\D/g, "");
            return parseFloat(wholePart + decimalPart);
        } else {
            return parseFloat(formattedNumber.replace(/\D/g, ""));
        }
    }

    private convertToUsd(amount: number, currencyRatio: number): number {
        return amount / currencyRatio;
    }

    private escapeRegExp(string: string): string {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
}

export function initCurrencyConverter() {
    CurrencyConverter.getInstance();
}
