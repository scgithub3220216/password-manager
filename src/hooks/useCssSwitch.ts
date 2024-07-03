export default function () {


    function addHighLight(idName: string) {
        setTimeout(() => {

            // 添加高亮
            let element = document.getElementById(idName);
            // console.log('element:', element)
            let items = element?.getElementsByTagName('li');
            if (!items) {
                console.log('items 为空')
                return;
            }
            for (var i = 0; i < items.length; i++) {
                items[i].classList.remove('selected');
            }
            let item = items[items.length - 1];
            if (!item) {
                console.log('item 为空')
                return;
            }
            item.classList.add('selected')
        }, 100);

    }

    function addPwdInfoHighlight(idName: string) {
        addHighLight(idName);
    }

    function addGroupHighlight(idName: string) {
        addHighLight(idName);
    }


    return {addGroupHighlight, addPwdInfoHighlight};
}