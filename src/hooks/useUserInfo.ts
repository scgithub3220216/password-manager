import {userDataInfoStore} from "../store/userDataInfo.ts";

export default function () {
    const userInfoStore = userDataInfoStore();


    function getLockTime() {
        let autoLock = userInfoStore.userInfo.autoLock;
        if (!autoLock) {
            return 60 * 1000;
        }
        return autoLock.autoLockTime * autoLock.autoLockTimeUnit;
    }

    function setLockTime(autoLockTime: number, autoLockTimeUnit: number) {
        console.log('setLockTime:', autoLockTime,'----', autoLockTimeUnit)
        userInfoStore.setLockTime(autoLockTime, autoLockTimeUnit)
    }

    return {getLockTime, setLockTime};
}