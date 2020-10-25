import {sendHttp} from "./sendHttp";

export const useSendHttp = () => {
    return (config) => {
        return sendHttp(config)
    }
}