import { IAd } from "./IAd";

export interface IAdaccount {
    id: string;
    name: string;
    status: string;
    disable_reason?: string;
    currency: string;
    daily_limit: number;
    amount_spent: number;
    country: string;
    ads: IAd[];
    currency_ratio_to_usd: number;
    has_pixel: boolean;
    billing?: number;
    cards?: string;
    resolve_preauth_friction?: boolean;
    timezone?: string;
}

export function getDisableReasonText(disable_reason): string | null {
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
            return null;
    }
}

export function getAccountStatusText(status): string {
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
