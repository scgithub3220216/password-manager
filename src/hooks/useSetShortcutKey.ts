import {onMounted, ref} from "vue";
import {storeToRefs} from "pinia";
import {
    defaultCopyLinkShortcutKey,
    defaultCopyPwdShortcutKey,
    defaultCopyUsernameShortcutKey,
    defaultInsertGroupShortcutKey,
    defaultInsertPwdInfoShortcutKey,
    defaultLogoutShortcutKey,
    defaultOpenMainWinShortcutKey
} from "../config/config.ts";
import useDBShortcutKey from "./useDBShortcutKey.ts";
import {
    copyLink,
    copyPwd,
    copyUsername,
    insertGroup,
    insertPwdInfo,
    logout,
    openMainWindows
} from "../../electron/db/sqlite/components/configConstants.ts";
import {useShortcutKeyStore} from "../store/shortcutKey.ts";
import {ElMessage} from "element-plus";
import {IPC_SAVE_SHORTCUTS} from "../../electron/constant.ts";

export default function () {

    const {updateShortCutKey} = useDBShortcutKey()
    let joinSymbol = " + ";
    const shortcutKeyStore = useShortcutKeyStore();
    const {shortCutKeyCombs} = storeToRefs(shortcutKeyStore);

    const currentOpenMainKeys = ref<string[]>([]);
    const mainShortcuts = ref("");

    const logouts = ref("");
    const logoutArr = ref<string[]>([]);

    const cpUsernames = ref("");
    const cpUsernameArr = ref<string[]>([]);

    const cpPwds = ref("");
    const cpPwdArr = ref<string[]>([]);

    const cpLinks = ref("");
    const cpLinkArr = ref<string[]>([]);

    const insertGroups = ref("");
    const insertGroupArr = ref<string[]>([]);

    const insertPwdInfos = ref("");
    const insertPwdInfoArr = ref<string[]>([]);

    onMounted(() => {
        console.log("shorCutKeys onMounted");
        mainShortcuts.value = shortCutKeyCombs.value[0].desc;
        logouts.value = shortCutKeyCombs.value[1].desc;
        cpUsernames.value = shortCutKeyCombs.value[2].desc;
        cpPwds.value = shortCutKeyCombs.value[3].desc;
        cpLinks.value = shortCutKeyCombs.value[4].desc;
        insertGroups.value = shortCutKeyCombs.value[5].desc;
        insertPwdInfos.value = shortCutKeyCombs.value[6].desc;
    });


    function handleOpenMainKeydown(event: any) {
        event.stopPropagation();

        let key = event.key;
        console.log("event", key);
        if (key === "Control") {
            key = "Ctrl";
        }
        if (currentOpenMainKeys.value.includes(key)) {
            return;
        }
        currentOpenMainKeys.value.push(processKey(key));
        mainShortcuts.value = currentOpenMainKeys.value.join(joinSymbol);
    }

    function handleOpenMainKeyup() {
        // 在键盘抬起时清空 currentKeys 数组
        currentOpenMainKeys.value = [];
    }

    function clearOpenMainKeys() {
        console.log('clearOpenMainKeys')
        currentOpenMainKeys.value = [];
        mainShortcuts.value = ""
    }

    function saveOpenMainShortcuts() {
        console.log("saveOpenMainShortcuts", mainShortcuts.value);
        // 发送事件给主进程
        window.ipcRenderer.invoke(IPC_SAVE_SHORTCUTS, mainShortcuts.value);

        shortcutKeyStore.setShortCutKeyComb(0, mainShortcuts.value);
        updateShortCutKey(openMainWindows, mainShortcuts.value)
    }

    // 锁定屏幕
    function handleLogoutKeydown(e: any) {
        console.log('handleLogoutKeydown')
        e.stopPropagation();

        let key = e.key;
        console.log("event", key);
        if (key === "Control") {
            key = "Ctrl";
        }
        if (logoutArr.value.includes(key)) {
            return;
        }
        logoutArr.value.push(processKey(key));
        logouts.value = logoutArr.value.join(joinSymbol);
    }

    function handleLogoutKeyup() {
        console.log('handleLockKeyup')
        // 在键盘抬起时清空 currentKeys 数组
        logoutArr.value = [];
    }

    function clearLogoutKeys() {
        console.log('clearLogoutKeys')
        logoutArr.value = [];
        logouts.value = ""
    }


    function saveLogoutShortcuts() {
        console.log("saveLogoutShortcuts logouts:", logouts.value);
        shortcutKeyStore.setShortCutKeyComb(1, logouts.value);
        updateShortCutKey(logout, logouts.value)
    }


    // 复制账号
    function handleCpUNameKeydown(e: any) {
        console.log('handleCpUNameKeydown key:', e.key)
        e.stopPropagation();
        let key = e.key;
        if (key === "Control") {
            key = "Ctrl";
        }
        if (cpUsernameArr.value.includes(key)) {
            return;
        }
        cpUsernameArr.value.push(processKey(key));
        cpUsernames.value = cpUsernameArr.value.join(joinSymbol);
    }

    function handleCpUNameKeyup() {
        console.log('handleCpUNameKeyup')
        // 在键盘抬起时清空 currentKeys 数组
        cpUsernameArr.value = [];
    }

    function clearCpUNameKeys() {
        console.log('clearCpUNameKeys')
        cpUsernameArr.value = [];
        cpUsernames.value = ""
    }


    function saveCpUNameShortcuts() {
        console.log("saveCpUNameShortcuts cpUsernames:", cpUsernames.value);
        shortcutKeyStore.setShortCutKeyComb(2, cpUsernames.value);
        updateShortCutKey(copyUsername, cpUsernames.value)
    }

    // 复制密码 cpPwds
    function handleCpPwdsKeydown(e: any) {
        console.log('handleCpPwdsKeydown key:', e.key)
        e.stopPropagation();
        let key = e.key;
        if (key === "Control") {
            key = "Ctrl";
        }
        if (cpPwdArr.value.includes(key)) {
            return;
        }
        cpPwdArr.value.push(processKey(key));
        cpPwds.value = cpPwdArr.value.join(joinSymbol);
    }

    function handleCpPwdsKeyup() {
        console.log('handleCpPwdsKeyup')
        // 在键盘抬起时清空 currentKeys 数组
        cpPwdArr.value = [];
    }

    function clearCpPwdsKeys() {
        console.log('clearCpPwdsKeys')
        cpPwdArr.value = [];
        cpPwds.value = ""
    }


    function saveCpPwdsShortcuts() {
        console.log("saveCpPwdsShortcuts", cpPwds.value);
        shortcutKeyStore.setShortCutKeyComb(3, cpPwds.value);
        updateShortCutKey(copyPwd, cpPwds.value)
    }

    // 复制链接 cpLinks
    function handleCpLinksKeydown(e: any) {
        console.log('handleCpLinksKeydown key:', e.key)
        e.stopPropagation();
        let key = e.key;
        if (key === "Control") {
            key = "Ctrl";
        }
        if (cpLinkArr.value.includes(key)) {
            return;
        }
        cpLinkArr.value.push(processKey(key));
        cpLinks.value = cpLinkArr.value.join(joinSymbol);
    }

    function handleCpLinksKeyup() {
        console.log('handleCpLinksKeyup')
        // 在键盘抬起时清空 currentKeys 数组
        cpLinkArr.value = [];
    }

    function clearCpLinksKeys() {
        console.log('clearCpLinksKeys')
        cpLinkArr.value = [];
        cpLinks.value = ""
    }


    function saveCpLinksShortcuts() {
        console.log("saveCpLinksShortcuts", cpLinks.value);
        shortcutKeyStore.setShortCutKeyComb(4, cpLinks.value);
        updateShortCutKey(copyLink, cpLinks.value)
    }


    // 新增分组 insertGroups
    // insertGroupArr
    function handleInsertGroupsKeydown(e: any) {
        console.log('handleInsertGroupsKeydown key:', e.key)
        e.stopPropagation();
        let key = e.key;
        if (key === "Control") {
            key = "Ctrl";
        }
        if (insertGroupArr.value.includes(key)) {
            return;
        }
        insertGroupArr.value.push(processKey(key));
        insertGroups.value = insertGroupArr.value.join(joinSymbol);
    }

    function handleInsertGroupsKeyup() {
        console.log('handleInsertGroupsKeyup')
        // 在键盘抬起时清空 currentKeys 数组
        insertGroupArr.value = [];
    }

    function clearInsertGroupsKeys() {
        console.log('clearInsertGroupsKeys')
        insertGroupArr.value = [];
        insertGroups.value = ""
    }


    function saveInsertGroupsShortcuts() {
        console.log("saveInsertGroupsShortcuts", insertGroups.value);
        shortcutKeyStore.setShortCutKeyComb(5, insertGroups.value);
        updateShortCutKey(insertGroup, insertGroups.value)
    }

    // 新增密码信息 insertPwdInfos
    function handleInsertPwdInfosKeydown(e: any) {
        console.log('handleInsertPwdInfosKeydown key:', e.key)
        e.stopPropagation();
        let key = e.key;
        if (key === "Control") {
            key = "Ctrl";
        }
        if (insertPwdInfoArr.value.includes(key)) {
            return;
        }
        insertPwdInfoArr.value.push(processKey(key));
        insertPwdInfos.value = insertPwdInfoArr.value.join(joinSymbol);
    }

    function handleInsertPwdInfosKeyup() {
        console.log('handleInsertPwdInfosKeyup')
        // 在键盘抬起时清空 currentKeys 数组
        insertPwdInfoArr.value = [];
    }

    function clearInsertPwdInfosKeys() {
        console.log('clearInsertPwdInfosKeys')
        insertPwdInfoArr.value = [];
        insertPwdInfos.value = ""
    }


    function saveInsertPwdInfosShortcuts() {
        console.log("saveInsertPwdInfosShortcuts", insertPwdInfos.value);
        shortcutKeyStore.setShortCutKeyComb(6, insertPwdInfos.value);
        updateShortCutKey(insertPwdInfo, insertPwdInfos.value)
    }

    function processKey(key: string): string {
        if (!key) {
            return key;
        }

        if (key.length != 1) {
            return key;
        }
        return key.toUpperCase();
    }


    function saveAll() {
        console.log("saveAll")
        try {
            saveOpenMainShortcuts();
            saveLogoutShortcuts();
            saveCpUNameShortcuts();
            saveCpPwdsShortcuts();
            saveCpLinksShortcuts();
            saveInsertGroupsShortcuts();
            saveInsertPwdInfosShortcuts();
        } catch (e) {
            console.log("saveAll error:", e);
            ElMessage.error('快捷键设置失败');
        }
        ElMessage.success('快捷键设置成功');
    }

    function reset() {
        console.log("reset");
        mainShortcuts.value = defaultOpenMainWinShortcutKey;
        logouts.value = defaultLogoutShortcutKey;
        cpUsernames.value = defaultCopyUsernameShortcutKey;
        cpPwds.value = defaultCopyPwdShortcutKey;
        cpLinks.value = defaultCopyLinkShortcutKey;
        insertGroups.value = defaultInsertGroupShortcutKey;
        insertPwdInfos.value = defaultInsertPwdInfoShortcutKey;
    }

    return {
        mainShortcuts,
        handleOpenMainKeydown,
        handleOpenMainKeyup,
        clearOpenMainKeys,

        logouts,
        handleLogoutKeydown,
        handleLogoutKeyup,
        clearLogoutKeys,

        cpUsernames,
        handleCpUNameKeydown,
        handleCpUNameKeyup,
        clearCpUNameKeys,

        cpPwds,
        handleCpPwdsKeydown,
        handleCpPwdsKeyup,
        clearCpPwdsKeys,

        cpLinks,
        handleCpLinksKeydown,
        handleCpLinksKeyup,
        clearCpLinksKeys,

        insertGroups,
        handleInsertGroupsKeydown,
        handleInsertGroupsKeyup,
        clearInsertGroupsKeys,

        insertPwdInfos,
        handleInsertPwdInfosKeydown,
        handleInsertPwdInfosKeyup,
        clearInsertPwdInfosKeys,

        saveAll,
        reset
    };
}