import * as XLSX from 'xlsx';
import {userDataInfoStore} from "../store/userDataInfo.ts";

export default function () {

    const exportExcel = () => {
        console.log('exportExcel')
        // 创建工作表的数据
        const dataList = [
            ['分组', '标题', '用户名', '密码', '链接', '说明']
        ];
        // 获取 所有数据
        let userDataInfo = userDataInfoStore();
        // 将 userDataInfo.pwdGroupList 转成 dataList 格式的数据
        userDataInfo.pwdGroupList.forEach((group) => {
            group.pwdList.forEach((pwd) => {
                dataList.push([group.title, pwd.title, pwd.username, pwd.password, pwd.link, pwd.remark]);
            });
        });

        // 将数据转换为工作簿
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.aoa_to_sheet(dataList);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // 生成文件
        XLSX.writeFile(workbook, '密码管理器数据.xlsx');
    };

    const importExcel = (event: any) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = e.target?.result;
            const workbook = XLSX.read(data, {type: 'binary'});
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const result = XLSX.utils.sheet_to_json(sheet);
            console.log(result); // 打印导入的数据
        };
        reader.readAsBinaryString(file);
    };


    return {importExcel, exportExcel};
}