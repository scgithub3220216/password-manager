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


    function clickGroupCss(idName: string) {
        setTimeout(() => {
            let items = document.getElementById(idName)?.getElementsByTagName("li");
            if (!items) {
                return;
            }
            console.log("items:", items.length);
            for (var i = 0; i < items.length; i++) {
                if (i === 0) {
                    console.log("selected");
                    items[i].classList.add("selected");
                    continue;
                }
                items[i].classList.remove("selected");
            }
        }, 100);

    }

    function clickCss(idName: string) {
        // clickGroupCss(idName)
    }


    /**
     * 动态 样式
     */
    function dynamicClickCss() {
        document.getElementById('group-ul')?.addEventListener('click', function (e) {
            // 移除之前所有li的高亮
            var items = this.getElementsByTagName('li');
            addLiCss(items, e);
        });
        document.getElementById('pwd-ul')?.addEventListener('click', function (e) {
            // 移除之前所有li的高亮
            var items = this.getElementsByTagName('li');
            addLiCss(items, e);
        });
    }

    function addLiCss(items: HTMLCollectionOf<HTMLElementTagNameMap[string]>, e: MouseEvent) {
        for (var i = 0; i < items.length; i++) {
            items[i].classList.remove('selected');
        }
        // 给当前点击的li添加高亮
        e.target?.classList.add('selected');
    }


    return {addGroupHighlight, addPwdInfoHighlight, clickCss,clickGroupCss,dynamicClickCss};
}