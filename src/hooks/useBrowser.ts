export default function () {

    function openBrowser(link: string) {
        window.ipcRenderer.invoke('open-browser', link);
    }

    return {openBrowser};
}