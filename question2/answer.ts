

function createArrayListFromArray(nodes: Array<ListNode>): ListNode {
    let firsNode = null;
    let lastNode = null;
    const nodesMap = {};
    nodes?.forEach(node => {
        nodesMap[node.id] = node;
    });
    nodes?.forEach(node => {
        if (node.after) {
            _dealAfter(node);
        }
        if (node.before) {
            _dealBefore(node);
        }
        if (node.first) {
            if (node.beforeNode || firsNode) { //firstnode已经存在，或者当前node不是第一个节点。
                throw new Error('所给的节点顺序存在冲突');
            } else {
                firsNode = node;
            }
        }
        if (node.last) {
            if (node.afterNode || lastNode) { 
                throw new Error('所给的节点顺序存在冲突');
            } else {
                lastNode = node;
            }
        }
    });
    _addExtraNode();
    return firsNode;
    /**
     * 处理before
     */
    function _dealAfter(node) {
        const afterNode = nodesMap[node.after];
        if (afterNode && (!afterNode.before || afterNode.before === node.id) ) { //afterNode没有before 或者 before是符合预期的。 
            node.afterNode = afterNode;
            afterNode.beforeNode = node;
        } else {
            throw new Error('所给的节点顺序存在冲突');
        }
    }
    /**
     * 处理after
     */
    function _dealBefore(node) {
        const beforeNode = nodesMap[node.before];
        if (beforeNode && (!beforeNode.after || beforeNode.after === node.id) && !beforeNode.last ) { //afterNode没有before 或者 before是符合预期的。 
            node.beforeNode = beforeNode;
            beforeNode.afterNode = node;
        } else {
            throw new Error('所给的节点顺序存在冲突');
        }
    }
    /**
     * 组装后，可能存在很多链表。需要把他们串起来。
     */
    function _addExtraNode() {
        const bakNodesMap = {...nodesMap};
        const listArr = []; //所有链表头元素集合。
        Object.values(nodesMap).forEach((node: ListNode) => {
            if (bakNodesMap[node.id]) {
                let preNode = node;
                while(preNode.beforeNode) { //找到开头节点
                    if (bakNodesMap[preNode.id]) {
                        delete bakNodesMap[preNode.id]; //找开头节点过程中就把已经遍历的节点 delete了。减少遍历
                        preNode = node.beforeNode;
                    } else { //map里面没有节点代表有环路
                        throw new Error('所给的节点形成链表存在环路，无法排序');
                    }
                }
                if (!firsNode || preNode.id !== firsNode.id) listArr.push(preNode); //加入集合
                delete bakNodesMap[preNode.id];
                //从node开始向后遍历 delete节点
                let nextNode = node;
                while(nextNode.afterNode) {
                    if (bakNodesMap[nextNode.afterNode.id]) {
                        delete bakNodesMap[nextNode.afterNode.id];
                        nextNode = nextNode.afterNode;
                    } else {
                        throw new Error('所给的节点形成链表存在环路，无法排序2');
                    }
                };
            }
        });
        // 把 listArr 里面的所有链表串起来
        let currentNode = null;
        if (firsNode) {
            currentNode = firsNode;
            while(currentNode.afterNode && !currentNode.afterNode.last) currentNode = currentNode.afterNode;
        }
        listArr.forEach( list => {
            currentNode.afterNode = list;
            list.beforeNode = currentNode;
            //currentNode继续找到最后一个
            currentNode = list;
            while(currentNode.afterNode && !currentNode.afterNode.last) currentNode = currentNode.afterNode;
        });
    }
} 

interface ListNode {
    id: number,
    before?: number, //上一个编号
    beforeNode?: ListNode, //上一个节点对象
    after?: number, //下一个编号
    afterNode?: ListNode, //下一个节点对象
    first?: boolean,
    last?: boolean
}
//测试
const sortList = createArrayListFromArray([
    {id: 1},
    {id: 2, before: 1},
    {id: 3, after: 1},
    {id: 5, first: true},
    {id: 6, last: true},
    {id: 7, after: 8},
    {id: 8},
    {id: 9},
]);
let cNode = sortList;
while (cNode) {
    console.info(cNode.id);
    cNode = cNode.afterNode;
}

//用时  2小时