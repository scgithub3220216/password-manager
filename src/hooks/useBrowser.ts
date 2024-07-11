import {IPC_OPEN_BROWSER} from "../../electron/constant.ts";

export default function () {

    function openBrowser(link: string | undefined) {
        if (!link) {
            return;
        }
        window.ipcRenderer.invoke(IPC_OPEN_BROWSER, link);
    }

    return {openBrowser};
}