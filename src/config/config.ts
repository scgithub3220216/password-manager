export const packageVersion = '2.0.0';
// oss
export const ossTypeAliYun = 'oss';

// emitter topic
export const emitterInsertGroupTopic = 'insertGroupTopic';
export const emitterLockTopic = 'lockTopic';
export const emitterInsertPwdInfoTopic = 'insertPwdInfoTopic';

export const salt = '`f:i+(o ====~.~====  Hello world n"iaj4~R>0@';


// Aes 加密 Key
export const aesKey = '0iq5<`fn"iaj4nD>';

export const aesIv = '|T@R>0@/:i+(ox,&';

export const defaultPwd = 'c1eed9e510f0c45e301ec7f3b535daf5ec9bfc5afbaded2e82ab61aa004d3b72af6aaf92a3b0d244bf044cf0cbdcded707cbf765154b47113ec2e76831d99d39';

export const defaultOpenMainWinShortcutKey = 'Ctrl + Alt + E';
export const defaultLogoutShortcutKey = 'Escape';

export const defaultCopyUsernameShortcutKey = 'Ctrl + U';

export const defaultCopyPwdShortcutKey = 'Ctrl + P';
export const defaultCopyLinkShortcutKey = 'Ctrl + L';
export const defaultInsertGroupShortcutKey = 'Ctrl + G';
export const defaultInsertPwdInfoShortcutKey = 'Ctrl + N';
export const defaultSyncLocalToOssShortcutKey = 'Ctrl + Shift + K';
export const defaultSyncOssToLocalShortcutKey = 'F5';

export const ossHelpLink = 'https://www.yuque.com/youshidadianhua-tbssk/xd5gi1/zdv235flfkshlpv7?singleDoc# 《阿里云账号操作指引》'

export const helpLink = 'https://www.yuque.com/youshidadianhua-tbssk/xd5gi1/nwnlnh2yg81h1n0q?singleDoc# 《帮助手册-Pc端》';

export const giteeCodeLink = 'https://gitee.com/star-sc/password-manager';
export const giteeIssueLink = 'https://gitee.com/star-sc/password-manager/issues';

export const supportDesc = '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <title>Title</title>\n' +
    '</head>\n' +
    '<script>\n' +
    '    \n' +
    '</script>\n' +
    '<body>\n' +
    '<div class="content">\n' +
    '    <p>使用支付宝/微信支付捐赠后请留言或者通过邮件提供您的名字/昵称和网站，格式为：</p>\n' +
    '    <p>名字/昵称 [&lt;网站>][：留言]</p>\n' +
    '\n' +
    '    <p> 网站与留言为可选部分，以下是一个例子：</p>\n' +
    '    <p style="font-style:italic"> star-sc &lt;gitee.com/star-sc>：加油！</p>\n' +
    '\n' +
    '    <p> 通过邮件发送时，请还提供以下信息：</p>\n' +
    '    <div class="main-info"> 捐赠金额：&lt;金额></div>\n' +
    '    <div class="main-info"> 支付平台：&lt;支付宝/微信支付></div>\n' +
    '    <div class="main-info"> 账单号（后5位）：&lt;账单号></div>\n' +
    '    <p></p>\n' +
    '\n' +
    '    <div> 邮箱地址：17786925624@163.com </div>\n' +
    '    <div> 您提供的名字、网站和捐赠总额将会被添加到 <a href="#" onclick="function openBr() {\n' +
    '        window.ipcRenderer.invoke(\'ipc-open-browser\', \'https://www.yuque.com/youshidadianhua-tbssk/xd5gi1/gvxig7bdxvkko2dr?singleDoc# 《捐赠清单》\');\n' +
    '    }\n' +
    '    openBr()"> 捐赠者</a>列表中。</div>\n' +
    '    <div> 感谢您的慷慨捐赠！</div>\n' +
    '</div>\n' +
    '\n' +
    '</body>\n' +
    '</html>\n' +
    '\n' +
    '<style>\n' +
    '    .main-info {\n' +
    '        font-style: italic;\n' +
    '        font-weight: bold;\n' +
    '    }\n' +
    '</style>\n' +
    '\n';
export const setPwdMsgTipsStr = '<!DOCTYPE html>\n' +
    '<html lang="en">\n' +
    '<head>\n' +
    '    <meta charset="UTF-8">\n' +
    '    <title>Title</title>\n' +
    '</head>\n' +
    '<body>\n' +
    '<div class="content">\n' +
    '    <h3>【密码管理器 - 用户须知与免责声明】</h3>\n' +
    '    <span><strong>尊敬的用户：</strong></span>\n' +
    '    <p class="paragraph">欢迎使用 【密码管理器】，一款致力于为您日常生活中的常用密码提供安全存储解决方案的软件。</p>\n' +
    '    <p class="paragraph">我们深知密码管理的重要性，但也请您理解并接受以下几点重要提示：</p>\n' +
    '    <ul>\n' +
    '        <li>\n' +
    '            合理使用，风险自担：本软件旨在帮助您管理如社交媒体、邮箱等非金融类账户的密码。强烈建议避免存储涉及资金交易的重要密码，例如银行卡、支付宝及微信支付密码等。您的安全意识是第一道防线。\n' +
    '        </li>\n' +
    '        <li>\n' +
    '            牢记登录密码：为保障账户安全，若您遗失【密码管理器】的登录密码，当前版本暂不提供找回服务。请务必妥善保管您的登录信息，这是访问您所有存储密码的唯一途径。\n' +
    '        </li>\n' +
    '\n' +
    '        <li>\n' +
    '            安全声明：虽然我们持续优化软件的安全性能，但任何电子设备和网络环境都无法保证绝对安全。使用本软件存储密码存在一定的风险，一旦发生密码泄露、丢失等情况，作者不承担任何责任。我们鼓励用户采取多层防护措施，如定期更换密码，增加复杂度等。\n' +
    '        </li>\n' +
    '\n' +
    '        <li><b>隐私保护承诺：</b>【密码管理器】严格遵守隐私政策，<strong>承诺不联网，不收集、不分享您的任何个人信息。您的数据仅存储于本地设备，</strong>\n' +
    '            确保最大程度的隐私安全。\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '    <p class="paragraph">\n' +
    '        通过阅读并接受上述条款，您将能继续享受【密码管理器】带来的便捷与安心。我们感谢您的理解与支持，愿与您共同守护数字生活中的每一串重要密码。</p>\n' +
    '    <p class="paragraph team-name">—— 密码管理器团队</p>\n' +
    '\n' +
    '</div>\n' +
    '</body>\n' +
    '</html>\n' +
    '<style>\n' +
    '    .content {\n' +
    '        font-size: 15px;\n' +
    '        line-height: 1.4\n' +
    '    }\n' +
    '\n' +
    '    h3 {\n' +
    '        text-align: center;\n' +
    '    }\n' +
    '\n' +
    '    li {\n' +
    '        line-height: 1.5\n' +
    '    }\n' +
    '\n' +
    '    .paragraph {\n' +
    '        text-indent: 2em;\n' +
    '    }\n' +
    '\n' +
    '    .team-name {\n' +
    '        display: flex;\n' +
    '        flex-direction: row-reverse;\n' +
    '        font-weight: bold\n' +
    '    }\n' +
    '</style>\n' +
    '\n';