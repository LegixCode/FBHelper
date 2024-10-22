export type TUseragentConfigType = "default" | "custom";

export interface IUseragentConfig {
    type: TUseragentConfigType;
    value: string;
}

export class UseragentConfig implements IUseragentConfig {
    type: TUseragentConfigType = "default";
    value: string = "";

    public constructor(data?: IUseragentConfig | null) {
        if (data) {
            if (data.type) this.type = data.type;
            if (data.value) this.value = data.value;
        }
    }

    public static makeFromLocalStorage(): UseragentConfig {
        const dataString = localStorage.getItem("ua");
        return dataString ? new UseragentConfig(JSON.parse(dataString)) : new UseragentConfig();
    }

    public saveToLocalStorage() {
        localStorage.setItem("ua", JSON.stringify(this));
    }
}
