export type TUseragentConfigType = "default" | "generated" | "personal";

export interface IUseragentConfig {
    type: TUseragentConfigType;
    generated_value: string;
    personal_value: string;
}

export class UseragentConfig implements IUseragentConfig {
    type: TUseragentConfigType = "default";
    generated_value: string = "";
    personal_value: string = "";

    public constructor(data?: IUseragentConfig | null) {
        if (data) {
            if (data.type) this.type = data.type;
            if (data.generated_value) this.generated_value = data.generated_value;
            if (data.personal_value) this.personal_value = data.personal_value;
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
