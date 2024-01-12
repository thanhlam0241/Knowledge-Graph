var network = null
// create an array with nodes
var nodes = new vis.DataSet([
    { id: 98, label: 'coches', group: 'start' },
    { id: 0, label: 'rap', group: 'property' },
    { id: 1, label: 'coches_rs', group: 'property' },
    { id: 58, label: 'cochesabandonados', group: 'property' },
    { id: 99, label: 'picoftheday', group: 'property' },
    { id: 100, label: 'design', group: 'property' },
    { id: 183, label: 'cochesaescala', group: 'property' },
    { id: '184', label: 'cochesantiguos', group: 'start' },
    { id: 185, label: 'cochesbaratos', group: 'property' },
    { id: 186, label: 'cochesboda', group: 'property' },
    { id: 187, label: 'cochesclasicos', group: 'property' },
    { id: 188, label: 'cochesclassicos', group: 'property' },
    { id: 189, label: 'cochescolombia', group: 'property' },
    { id: 190, label: 'cochesdeboda', group: 'start' },
]);

// create an array with edges
var edges = new vis.DataSet([
    { from: 98, to: 0 },
    { from: 98, to: 1 },
    { from: 98, to: 58 },
    { from: 58, to: 99 },
    { from: 58, to: 100 },
    { from: 100, to: 183 },
    { from: 100, to: 183 },
    {
        from: 100, to: '184',
        style: 'dash-line'
    },
    {
        from: 190, to: 185,
        style: 'arrow-center'
    },
    { from: 98, to: 186 },
    { from: 191, to: 187 },
    { from: 98, to: 188 },
    { from: 98, to: 189 },
    { from: 194, to: 190 },
]);

var listProperty = ["type", "comment", "isDefinedBy", "hasName"]

var listSkip = ["domain", "range"]

var dataSave
let countProperty = 0;

var cluster_id = 1;
var node_color = ["orange", "green", "red", "yellow", "cyan"];
var node_shape = ["star", "database", "diamond", "square", "triangle"];

function cluster(n) {
    var clusterOptions = {
        joinCondition: function (childOptions) {
            console.log(childOptions);
            return true;
        },
        clusterNodeProperties: {
            id: cluster_id,
            label: "Cluster " + cluster_id,
            color: node_color[cluster_id - 1],
            shape: node_shape[cluster_id - 1],
            allowSingleNodeCluster: true,
        },
    };
    cluster_id++;
    n.cluster(clusterOptions);
}

const checkExistNode = (name, allNodes) => {
    return allNodes.find(n => n.id === name)
}

function destroy() {
    if (network !== null) {
        network.destroy();
        network = null;
    }
}

var nameClustersExpert = ['Expert', 'University', 'Class']
var clusters = []
var visitedNode = []
const visitByDFS = (nodesStart, allNodes, allEdges) => {
    console.log(nodesStart)
    nodesStart.forEach(n => {
        if (!visitedNode.includes(n.id)) {
            visitedNode.push(n.id)
            let node = allNodes.find(no => no.id === n.id)
            console.log("Node: ", node)
            if (node) {
                if (node.cluster) {
                    clusters.push({ cluster: node.cluster, id: node.id })
                    let nodesFrom = allEdges.filter(e => e.from === n.id).map(e => {
                        return {
                            id: e.to,
                            cluster: node.cluster
                        }
                    })
                    let nodesTo = allEdges.filter(e => e.to === n.id).map(e => {
                        return {
                            id: e.from,
                            cluster: node.cluster
                        }
                    })
                    visitByDFS(nodesFrom, allNodes, allEdges)
                    visitByDFS(nodesTo, allNodes, allEdges)
                }
            }
        }
    })
}

const startTransverse = (nodesStart, nodes, edges) => {
    clusters = []
    visitedNode = []
    visitByDFS(nodesStart, nodes, edges)
    console.log(clusters)
}

function showContext(x, y) {
    const contextMenu = document.querySelector('#context-node')
    contextMenu.style.top = y + 50 + 'px'
    contextMenu.style.left = x + 50 + 'px'
    contextMenu.style.visibility = 'visible'
}

function hideContext() {
    const contextMenu = document.querySelector('#context-node')
    contextMenu.style.visibility = 'hidden'
}


function loadGraphExpert(data) {
    console.log(data)
    let nodeDatas = []
    let edgeDatas = []
    data.forEach(d => {
        const obj = d.object
        const sub = d.subject
        const pred = d.predicate

        const objId = obj.uri || obj.name
        const subId = sub.uri || sub.name

        if (listProperty.includes(pred.name)) {
            const index = nodeDatas.findIndex(n => n.id === subId)
            if (index !== -1) {
                if (pred.name === "hasName") {
                    nodeDatas[index].label = obj.name
                }
                else if (pred.name === 'type') {
                    nodeDatas[index].cluster = obj.name
                    nodeDatas[index].type = obj.name
                }
                else if (pred.name !== 'isDefinedBy') {
                    nodeDatas[index][pred.name] = obj.name
                }
                else {
                    console.log(2)
                    nodeDatas[index][pred.name] = obj.uri
                }
            }
            else {
                const newNode = {
                    id: subId,
                    label: pred.name === "hasName" ? obj.name : sub.name,
                    group: 'node',
                    uri: sub.uri,
                    isDefinedBy: obj.uri
                }
                if (pred.name === 'type') {
                    newNode.cluster = obj.name
                    newNode.type = obj.name
                }
                nodeDatas.push(newNode)
            }
        }
        // else if (listSkip.includes(pred.name)) {
        //     return
        // }
        else {
            if (!checkExistNode(objId, nodeDatas)) {
                if (obj.type === 'literal') {
                    nodeDatas.push({
                        id: objId, label: obj.name, group: 'literal', shapeProperties: { borderDashes: [5, 5] },
                        uri: obj.uri
                    })
                } else {
                    nodeDatas.push({ id: objId, label: obj.name, group: 'node', uri: obj.uri })
                }
            }
            if (!checkExistNode(subId, nodeDatas)) {
                nodeDatas.push({ id: subId, label: sub.name, group: 'node', uri: sub.uri })
            }
            countProperty++
            let isClass = pred.name.toString().toLowerCase().includes('class') ? true : false
            nodeDatas.push({ id: countProperty, label: pred.name, group: isClass ? 'class' : 'property', uri: pred.uri })
            edgeDatas.push({
                from: subId, to: countProperty,
                dashes: isClass,
                arrows: {
                    to: {
                        enabled: false,
                        type: 'arrow',
                    },
                },
            })
            edgeDatas.push({
                from: countProperty, to: objId, arrows: {
                    to: {
                        enabled: true,
                        type: 'arrow',
                    },
                },
                dashes: isClass
            })
        }
    })
    dataSave = {
        nodes: nodeDatas,
        edges: edgeDatas
    }
    startTransverse(nodeDatas.filter(n => n.cluster), nodeDatas, edgeDatas)
    console.log(dataSave)
    nodes = new vis.DataSet(nodeDatas)
    edges = new vis.DataSet(edgeDatas)
    pageInit()
}



function loadGraph(data) {
    let nodeDatas = []
    let edgeDatas = []
    data.forEach(d => {
        const obj = d.object
        const sub = d.subject
        const pred = d.predicate

        const objId = obj.uri || obj.name
        const subId = sub.uri || sub.name

        if (listProperty.includes(pred.name)) {
            const index = nodeDatas.findIndex(n => n.id === subId)
            if (index !== -1) {
                if (pred.name === "hasName") {
                    nodeDatas[index].label = obj.name
                }
                else if (pred.name !== 'isDefinedBy') {
                    nodeDatas[index][pred.name] = obj.name
                }
                else if (pred.name === 'type') {
                    clusters.push(obj.name)
                    nodeDatas[index].cluster = obj.name
                }
                else {
                    console.log(2)
                    nodeDatas[index][pred.name] = obj.uri
                }
            }
            else {
                nodeDatas.push({
                    id: subId,
                    label: pred.name === "hasName" ? obj.name : sub.name,
                    group: 'node',
                    uri: sub.uri,
                    isDefinedBy: obj.uri,
                    ...{ cluster: pred.name === 'type' ? obj.name : null }
                })
            }
        }
        // else if (listSkip.includes(pred.name)) {
        //     return
        // }
        else {
            if (!checkExistNode(objId, nodeDatas)) {
                if (obj.type === 'literal') {
                    countProperty++
                    nodeDatas.push({
                        id: countProperty,
                        label: obj.name, group: 'literal', shapeProperties: { borderDashes: [5, 5] },
                        uri: obj.uri
                    })
                } else {
                    nodeDatas.push({ id: objId, label: obj.name, group: 'node', uri: obj.uri })
                }
            }
            if (!checkExistNode(subId, nodeDatas)) {
                nodeDatas.push({ id: subId, label: sub.name, group: 'node', uri: sub.uri })
            }
            countProperty++
            let isClass = pred.name.toString().toLowerCase().includes('class') ? true : false
            nodeDatas.push({ id: countProperty, label: pred.name, group: isClass ? 'class' : 'property', uri: pred.uri })
            edgeDatas.push({
                from: subId, to: countProperty,
                dashes: isClass,
                arrows: {
                    to: {
                        enabled: false,
                        type: 'arrow',
                    },
                },
            })
            edgeDatas.push({
                from: countProperty, to: objId, arrows: {
                    to: {
                        enabled: true,
                        type: 'arrow',
                    },
                },
                dashes: isClass
            })
        }
    })
    dataSave = {
        nodes: nodeDatas,
        edges: edgeDatas
    }
    console.log(dataSave)
    nodes = new vis.DataSet(nodeDatas)
    edges = new vis.DataSet(edgeDatas)
    pageInit()
}

const btnSubmit = document.querySelector("button[type='submit']")
const btnTest1 = document.querySelector("#test1")
const input = document.querySelector("#uri")
const uriTest1 = 'http://localhost:8082/test/4'
if (btnTest1) {
    btnTest1.addEventListener('click', (e) => {
        e.preventDefault()
        fetch(uriTest1)
            .then(res => res.json())
            .then(data => {
                loadGraphExpert(data)
            })
    })
}
if (btnSubmit && input) {
    btnSubmit.addEventListener('click', (e) => {
        e.preventDefault()
        const uri = input.value
        console.log(uri)
        fetch("http://localhost:8082" + "/graph/uri?uri=" + uri)
            .then(res => res.json())
            .then(data => {
                loadGraph(data)
            })
    })
}

const pageInit = () => {
    destroy()
    // create a network
    var container = document.getElementById('mynetwork');
    const contextMenu = document.querySelector('#context-node')

    document.addEventListener('click', (e) => {
        if (e.target !== contextMenu && contextMenu.style.visibility !== 'hidden') {
            hideContext()
        }
    })

    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {
        nodes: {
            // margin: 110,
            shape: 'circle',
            font: {
                size: 11,
                color: 'white',
            },
            mass: 0.5,
            scaling: {
                label: {
                    enabled: true,
                    min: 20,
                    max: 20
                },
            },
            widthConstraint: 80,
        },
        edges: {
            smooth: true,
            arrows: {
                to: {
                    enabled: true,
                },
            },
            physics: true,
        },
        interaction: {
            hover: true,
            // hideEdgesOnDrag: true,
            // hideEdgesOnZoom: true,
            navigationButtons: true,
            keyboard: true,
        },
        physics: {
            forceAtlas2Based: {
                gravitationalConstant: -26,
                centralGravity: 0.0005,
                springLength: 300,
                springConstant: 0.38,
            },
            adaptiveTimestep: true,
            maxVelocity: 146,
            solver: "forceAtlas2Based",
            timestep: 0.35,
            stabilization: { iterations: 150 },
            barnesHut: {
                gravitationalConstant: -80000,
                springConstant: 0.001,
                springLength: 200,
            },
        },
        groups: {
            'node': {
                // shape: 'circle',
                title: null,
                color: {
                    border: '#009688',
                    background: '#42A5F5',
                    highlight: { background: 'red', border: '#202443' },
                },
                shadow: {
                    enabled: true,
                    color: 'rgba(94, 105, 119, 0.5)',
                    size: 10,
                    x: 0,
                    y: 3
                },
                shape: 'circle',
                font: {
                    // size: 59,
                },
                margin: 10,
                // padding: 10
            },
            'property': {
                shape: 'box',
                title: null,
                color: {
                    border: '#009688',
                    background: '#009688',
                    highlight: { background: 'red', border: '#202443' },
                },
                shadow: {
                    enabled: true,
                    color: 'rgba(94, 105, 119, 0.5)',
                    size: 10,
                    x: 0,
                    y: 3
                },
                // font: {
                //     size: 59
                // },
                margin: 10,
                padding: 10
            },
            'literal': {
                shape: 'box',
                title: null,
                color: {
                    border: 'black',
                    background: 'yellow',
                    highlight: { background: 'red', border: '#202443' },
                },
                shadow: {
                    enabled: true,
                    color: 'rgba(94, 105, 119, 0.5)',
                    size: 10,
                    x: 0,
                    y: 3
                },
                font: {
                    color: 'black'
                },
                margin: 10,
                padding: 10
            },
            'class': {
                shape: 'box',
                title: null,
                color: {
                    border: 'black',
                    background: 'white',
                    highlight: { background: 'red', border: '#202443' },
                },
                shadow: {
                    enabled: true,
                    color: 'rgba(94, 105, 119, 0.5)',
                    size: 10,
                    x: 0,
                    y: 3
                },
                font: {
                    color: 'black'
                },
                margin: 10,
                padding: 10
            },
        },
        //clusterOutliers: true
    };
    network = new vis.Network(container, data, options);

    // var clusterOptionsByClass = {
    //     joinCondition: function (childOptions) {
    //         return childOptions.type == "Class";
    //     },
    //     clusterNodeProperties: {
    //         id: "ClassCluster",
    //         borderWidth: 3,
    //         label: "Class",
    //         shape: "circle",
    //     },
    // };

    // var clusterOptionsByExpert = {
    //     joinCondition: function (childOptions) {
    //         return childOptions.type == "Expert";
    //     },
    //     clusterNodeProperties: {
    //         id: "ExpertCluster",
    //         borderWidth: 3,
    //         label: "Expert",
    //         shape: "circle",
    //     },
    // };

    // var clusterOptionsByUniversity = {
    //     joinCondition: function (childOptions) {
    //         return childOptions.type == "University";
    //     },
    //     clusterNodeProperties: {
    //         id: "UniCluster",
    //         borderWidth: 3,
    //         label: "University",
    //         shape: "circle",
    //     },
    // };

    // network.cluster(
    //     clusterOptionsByClass
    // )

    // network.cluster(
    //     clusterOptionsByExpert
    // )

    // network.cluster(
    //     clusterOptionsByUniversity
    // )

    network.on('click', function (properties) {
        if (properties.nodes.length == 1) {
            if (network.isCluster(properties.nodes[0]) == true) {
                network.openCluster(properties.nodes[0]);
            }
        }
        var ids = properties.nodes;
        var clickedNodes = nodes.get(ids);
        if (clickedNodes.length === 0) return
        console.log('clicked nodes:', clickedNodes);
        let uriSpan = document.querySelector('#node-uri')
        let labelSpan = document.querySelector('#node-label')
        let typeSpan = document.querySelector('#node-type')
        let commentSpan = document.querySelector('#node-comment')
        let isDefinedBySpan = document.querySelector('#node-isDefinedBy')
        uriSpan.innerHTML = clickedNodes[0].uri ? `<a>${clickedNodes[0].uri}</a>` : 'Not exist'
        labelSpan.innerHTML = clickedNodes[0].label
        typeSpan.innerHTML = clickedNodes[0].type ? clickedNodes[0].type : 'Not exist'
        commentSpan.innerHTML = clickedNodes[0].comment ? clickedNodes[0].comment : 'Not exist'
        isDefinedBySpan.innerHTML = clickedNodes[0].isDefinedBy ? clickedNodes[0].isDefinedBy : 'Not exist'
    });

    network.on("doubleClick", function (params) {
        console.log(params)
    });

    network.on('oncontext', function (params) {
        params.event.preventDefault();
        console.log(params)
        const node = network.getNodeAt(params.pointer.DOM);
        if (!node) return
        network.selectNodes([node], true);
        showContext(params.pointer.DOM.x, params.pointer.DOM.y)
    });

}

pageInit()