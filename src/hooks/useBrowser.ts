export default function () {

    function openBrowser(link: string | undefined) {
        if(!link) {
            return;
        }
        window.ipcRenderer.invoke('open-browser', link);
    }

    return {openBrowser};
}