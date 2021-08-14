

/**
 * 
 * @param nodes 树节点
 * @returns 合并后的树，可能存在多颗
 */
function createTreeFromArray(nodes: Array<Tree>): Array<Tree> {
    const treeMap = {};
    const rootNodes: Array<Tree> = [];
    //构建映射table
    nodes?.forEach(node => {
        treeMap[node.id] = node;
    });
    //合并节点
    nodes?.forEach(node => {
        const parentNode = treeMap[node.parentId];
        if (!parentNode) {
            rootNodes.push(node);
        } else {
            (parentNode.childrens || (parentNode.childrens = [])).push(node);
        }
    });
    return rootNodes;
}

interface Tree {
    id: number, 
    name: string, 
    parentId?: number,
    childrens?: Array<Tree>
}

//测试
console.log(JSON.stringify(createTreeFromArray([
    {id:1, name: 'i1'},
    {id:2, name:'i2', parentId: 1},
    {id:4, name:'i4', parentId: 3},
    {id:3, name:'i3', parentId: 2},
    {id:8, name:'i8', parentId: 7}
])));

//用时30分钟左右  时间复杂度：O(n)