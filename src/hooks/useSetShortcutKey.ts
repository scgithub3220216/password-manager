import {onMounted, ref} from "vue";
import {storeToRefs} from "pinia";
import {useUserDataInfoStore} from "../store/userDataInfo.ts";
import {
    defaultCopyLinkShortcutKey,
    defaultCopyPwdShortcutKey,
    defaultCopyUsernameShortcutKey,
    defaultInsertGroupShortcutKey,
    defaultInsertPwdInfoShortcutKey,
    defaultLockWinShortcutKey,
    defaultOpenMainWinShortcutKey
} from "../config/config.ts";

export default function () {

    let joinSymbol = " + ";
    const userInfoStore = useUserDataInfoStore();
    const {shortCutKeyCombs} = storeToRefs(userInfoStore)

    const currentOpenMainKeys = ref<string[]>([]);
    const mainShortcuts = ref("");

    const lockShortcuts = ref("");
    const currentLockKeys = ref<string[]>([]);

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
        lockShortcuts.value = shortCutKeyCombs.value[1].desc;
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
        window.ipcRenderer.invoke("save-shortcuts", mainShortcuts.value);
        userInfoStore.setShortCutKeyComb(0, mainShortcuts.value);
    }

    // 锁定屏幕
    function handleLockKeydown(e: any) {
        console.log('handleLockKeydown')
        e.stopPropagation();

        let key = e.key;
        console.log("event", key);
        if (key === "Control") {
            key = "Ctrl";
        }
        if (currentLockKeys.value.includes(key)) {
            return;
        }
        currentLockKeys.value.push(processKey(key));
        lockShortcuts.value = currentLockKeys.value.join(joinSymbol);
    }

    function handleLockKeyup() {
        console.log('handleLockKeyup')
        // 在键盘抬起时清空 currentKeys 数组
        currentLockKeys.value = [];
    }

    function clearLockKeys() {
        console.log('clearLockKeys')
        currentLockKeys.value = [];
        lockShortcuts.value = ""
    }


    function saveLockShortcuts() {
        console.log("saveLockShortcuts lockShortcuts:", lockShortcuts.value);
        userInfoStore.setShortCutKeyComb(1, lockShortcuts.value);
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
        userInfoStore.setShortCutKeyComb(2, cpUsernames.value);
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
        userInfoStore.setShortCutKeyComb(3, cpPwds.value);
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
        userInfoStore.setShortCutKeyComb(4, cpLinks.value);
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
        userInfoStore.setShortCutKeyComb(5, insertGroups.value);
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
        userInfoStore.setShortCutKeyComb(6, insertPwdInfos.value);
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
        saveOpenMainShortcuts();
        saveLockShortcuts();
        saveCpUNameShortcuts();
        saveCpPwdsShortcuts();
        saveCpLinksShortcuts();
        saveInsertGroupsShortcuts();
        saveInsertPwdInfosShortcuts();

        userInfoStore.editAction()

    }

    function reset() {
        console.log("reset");
        mainShortcuts.value = defaultOpenMainWinShortcutKey;
        lockShortcuts.value = defaultLockWinShortcutKey;
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

        lockShortcuts,
        handleLockKeydown,
        handleLockKeyup,
        clearLockKeys,

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