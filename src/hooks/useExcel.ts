import * as XLSX from 'xlsx';
import useDBPwdInfo from "./useDBPwdInfo.ts";
import {PwdInfo} from "../components/type.ts";
import {ElMessage, UploadUserFile} from "element-plus";
import useDBGroup from "./useDBGroup.ts";
import {useUserDataInfoStore} from "../store/userDataInfo.ts";

export default function () {

    const {insertPwdInfoByImport, listPwdInfo} = useDBPwdInfo()
    const {insertGroup, getIdByTitle} = useDBGroup();
    const userDataInfoStore = useUserDataInfoStore();
    const exportExcel = async () => {
        console.log('exportExcel')
        // 创建工作表的数据
        const dataList = [
            ['分组', '标题', '用户名', '密码', '链接', '说明']
        ];
        // 获取 所有数据
        let pwdInfoList: PwdInfo[] = await listPwdInfo(0)
        pwdInfoList.forEach((pwdInfo) => {
            dataList.push([pwdInfo.group_title, pwdInfo.title, pwdInfo.username, pwdInfo.password, pwdInfo.link, pwdInfo.remark]);
        });

        // 将数据转换为工作簿
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(dataList);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // 生成文件
        XLSX.writeFile(workbook, '密码管理器数据.xlsx');
    };

    const importExcel = (file: UploadUserFile) => {
        console.log('importExcel:', file.raw)
        if (!file || !file.raw) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, {type: 'binary'});
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonArr = XLSX.utils.sheet_to_json(sheet);
            console.log(jsonArr); // 打印导入的数据
            for (const item of jsonArr) {
                let pwdInfo: PwdInfo = {
                    group_title: item['分组'],
                    title: item['标题'],
                    username: item['用户名'],
                    password: item['密码'],
                    link: item['链接'],
                    remark: item['说明'],
                }
                // 根据 group_title 查询分组
                let groupId = await getIdByTitle(pwdInfo.group_title);
                if (!groupId) {
                    console.log('分组不存在:', pwdInfo.group_title)
                    // 如何没有就新建分组
                    groupId = await insertGroup(pwdInfo.group_title, 0);
                    console.log('创建分组成功: 分组id:', groupId)
                }
                pwdInfo.group_id = groupId;
                console.log('pwdInfo:', pwdInfo)
                // 插入
                insertPwdInfoByImport(pwdInfo);
            }
            // 导入成功
            ElMessage.success('导入成功');
            userDataInfoStore.importFlag = true;
        };
        reader.readAsBinaryString(file.raw);
    };


    return {importExcel, exportExcel};
}