export interface IAd {
    id: string;
    name: string;
    status: string;
    effective_status: string;
    ad_review_feedback: { [name: string]: string };
    preview?: string;
}
