import { reactive, ref } from "vue";

export type TNotificationType = "success" | "error" | "info";

export interface INotification {
    type: TNotificationType;
    title: string;
}

export const notifyStore = reactive(
    (() => {
        const notification = ref<INotification | null>(null);

        const timeoutId = ref<number | null>(null);

        function createNotification(type: TNotificationType, title: string) {
            if (timeoutId.value) clearTimeout(timeoutId.value);
            notification.value = {
                type: type,
                title: title,
            };
            timeoutId.value = setTimeout(() => {
                timeoutId.value = null;
                notification.value = null;
            }, 3000);
        }

        function success(title: string): void {
            createNotification("success", title);
        }

        function error(title: string): void {
            createNotification("error", title);
        }

        function info(title: string): void {
            createNotification("info", title);
        }

        return {
            notification,
            success,
            error,
            info,
        };
    })()
);
