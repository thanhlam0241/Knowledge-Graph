var network = null
var isExpert = false
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

var uriSelect = null
var nodeSelected = null

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
function showContext(x, y) {
    const contextMenu = document.querySelector('#context-node')
    contextMenu.style.top = y + 50 + 'px'
    contextMenu.style.left = x + 50 + 'px'
    contextMenu.style.visibility = 'visible'
}

function hideContext() {
    const contextMenu = document.querySelector('#context-node')
    contextMenu.style.visibility = 'hidden'
    uriSelect = null
    nodeSelected = null
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
            let isClass = pred.name.toString().toLowerCase().includes('class') ? true : false
            if (index !== -1) {
                const node = nodeDatas[index]
                if (pred.name === "hasName") {
                    node.label = obj.name
                }
                else if (pred.name === "comment") {
                    node.comment = obj.name
                }
                else if (pred.name === 'type') {
                    node.type = obj.name
                }
                else if (pred.name !== 'isDefinedBy') {
                    node[pred.name] = obj.name
                }
                else {
                    node[pred.name] = obj.uri
                    if (isClass) node['type'] = 'Class'
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
                } else {
                    if (isClass) newNode.type = 'Class'
                }
                nodeDatas.push(newNode)
            }
        }
        else {
            countProperty++
            let isClass = pred.name.toString().toLowerCase().includes('class') ? true : false
            if (!checkExistNode(objId, nodeDatas)) {
                if (obj.type === 'literal') {
                    nodeDatas.push({
                        id: objId, label: obj.name, group: 'literal', shapeProperties: { borderDashes: [5, 5] },
                        uri: obj.uri,
                        type: isClass ? 'Class' : 'None'
                    })
                } else {
                    nodeDatas.push({ id: objId, label: obj.name, group: isClass ? 'class' : 'node', uri: obj.uri, type: isClass ? 'Class' : 'None' })
                }
            }
            else {
                if (isClass) {
                    const node = nodeDatas.find(n => n.id === objId)
                    node.type = 'Class'
                    node.group = 'class'
                }
            }
            if (!checkExistNode(subId, nodeDatas)) {
                nodeDatas.push({
                    id: subId, label: sub.name, group: isClass ? 'class' : 'node', uri: sub.uri,
                    type: isClass ? 'Class' : 'None'
                })
            } else {
                if (isClass) {
                    const node = nodeDatas.find(n => n.id === subId)
                    node.type = 'Class'
                    node.group = 'class'
                }
            }
            nodeDatas.push({ id: countProperty, label: pred.name, group: 'property', uri: pred.uri })
            edgeDatas.push({
                from: subId, to: countProperty,
                dashes: isClass,
                arrows: {
                    to: {
                        enabled: false,
                        type: 'arrow',
                    },
                }, color: {
                    color: 'black',
                    highlight: 'red',
                    hover: 'red',
                    inherit: 'from',
                    opacity: 1.0
                }
            })
            edgeDatas.push({
                from: countProperty, to: objId, arrows: {
                    to: {
                        enabled: true,
                        type: 'arrow',
                    },
                },
                dashes: isClass,
                color: {
                    color: 'black',
                    highlight: 'red',
                    hover: 'red',
                    inherit: 'from',
                    opacity: 1.0
                }
            })
        }
    })
    dataSave = {
        nodes: nodeDatas,
        edges: edgeDatas
    }
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

            let isExistEdge = false
            for (let i = 0; i < edgeDatas.length; i++) {
                const e1 = edgeDatas[i]
                const p = e1.to
                if (e1.from === subId) {
                    let index = edgeDatas.findIndex(e => e.from === p)
                    if (index !== -1 && e.to === objId) {
                        const nodeProperty = nodeDatas.find(n => n.id === e1.to)
                        if (nodeProperty.label === pred.name) {
                            isExistEdge = true
                            break
                        }
                    }
                }
            }

            if (!isExistEdge) {
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

function resetByListNode(list) {
    console.log(list)
    const listNodes = []
    list.forEach(l => {
        listNodes.push({ id: l.uri.value, label: l.name.value, group: 'node', uri: l.uri.value })
    })
    dataSave = {
        nodes: listNodes,
        edges: []
    }
    nodes = new vis.DataSet(listNodes)
    edges = new vis.DataSet([])
    pageInit()
}

function addNodesAndEdges(data) {
    try {
        data.forEach(d => {
            const obj = d.object
            const sub = d.subject
            const pred = d.predicate

            let objId = obj.uri || obj.name
            let subId = sub.uri || sub.name

            if (listProperty.includes(pred.name)) {
                const node = nodes.get({ id: subId })
                if (node) {
                    if (pred.name === "hasName") {
                        node.label = obj.name
                    }
                    else if (pred.name !== 'isDefinedBy') {
                        node[pred.name] = obj.name
                    }
                    else if (pred.name === 'type') {
                        node.type = obj.name
                    }
                    else {
                        node[pred.name] = obj.uri
                    }
                    nodes.update({
                        ...node
                    })
                }
                else {
                    nodes.add({
                        id: subId,
                        label: pred.name === "hasName" ? obj.name : sub.name,
                        group: 'node',
                        uri: sub.uri,
                        isDefinedBy: obj.uri,
                        ...{ cluster: pred.name === 'type' ? obj.name : null }
                    })
                }
            }
            else {
                const isExistObj = nodes.get(objId)
                const isExistSub = nodes.get(subId)

                console.log(isExistObj, isExistSub)

                if (!isExistObj) {
                    if (obj.type === 'literal') {
                        countProperty++
                        objId = countProperty
                        nodes.add({
                            id: objId,
                            label: obj.name, group: 'literal', shapeProperties: { borderDashes: [5, 5] },
                            uri: obj.uri
                        })
                    } else {
                        nodes.add({ id: objId, label: obj.name, group: 'node', uri: obj.uri })
                    }
                }
                if (!isExistSub) {
                    nodes.add({ id: subId, label: sub.name, group: 'node', uri: sub.uri })
                }

                let isExistEdge = false

                console.log(isExistObj, isExistSub)

                if (isExistObj && isExistSub) {
                    console.log('Check exist edge')
                    let mapEdges = [...edges._data.values()]
                    console.log(mapEdges)
                    for (let edge of mapEdges) {
                        console.log(edge)
                        console.log(edge.to)
                        console.log('Map')
                        if (edge.from === subId) {
                            const p = edge.to
                            const edge2 = mapEdges.find(e => e.from.toString() === p.toString() && e.to === objId)
                            console.log(edge2)
                            if (edge2) {
                                const nodeProperty = nodes.get(edge.to)
                                if (nodeProperty.label === pred.name) {
                                    isExistEdge = true
                                    break
                                }
                            }
                        }

                    }
                }

                console.log(isExistEdge)

                if (!isExistEdge) {
                    let isClass = pred.name.toString().toLowerCase().includes('class') ? true : false
                    countProperty++
                    nodes.add({ id: countProperty, label: pred.name, group: isClass ? 'class' : 'property', uri: pred.uri })
                    edges.add({
                        from: subId, to: countProperty,
                        dashes: isClass,
                        arrows: {
                            to: {
                                enabled: false,
                                type: 'arrow',
                            },
                        },
                    })
                    edges.add({
                        from: countProperty, to: objId, arrows: {
                            to: {
                                enabled: true,
                                type: 'arrow',
                            },
                        },
                        dashes: isClass
                    })
                }
            }
        })
    }
    catch (err) {
        console.log(err)
        alert(err)
    }
}

// URL 
const urlServer = 'http://localhost:8082'
const uriExpertOntology = `${urlServer}/test/2`
const uriGraph = `${urlServer}/graph/uri`
const uriExpert = `${urlServer}/graph/expert/uri`
const classExpert = `${urlServer}/graph/class`

function onClickDetail(e) {
    console.log('Click button 3')
    e.preventDefault()
    console.log(nodeSelected)
    console.log(isExpert)
    if (!isExpert) return
    if (!nodeSelected) return
    console.log(nodeSelected)
    if (nodeSelected.type === 'Class') {
        loading.style.visibility = 'visible'
        fetch(classExpert + `?class=${nodeSelected.label}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0) resetByListNode(data)
            }).catch(err => {
                alert(err)
            }).finally(() => {
                loading.style.visibility = 'hidden'
                hideContext()
            })
    } else {
        loading.style.visibility = 'visible'
        fetch(classExpert + `?uri=${nodeSelected.label}`)
            .then(res => res.json())
            .then(data => {
                if (data.length > 0)
                    resetByListNode(data)
            }).catch(err => {
                alert(err)
            }).finally(() => {
                loading.style.visibility = 'hidden'
                hideContext()
            })
    }
}

function onClickVisualize(e) {
    e.preventDefault()
    console.log('Visualize node in network uri: ' + uriSelect)
    if (uriSelect) {
        loading.style.visibility = 'visible'
        console.log('Start')
        fetch(isExpert ? uriExpert : uriGraph, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ uri: uriSelect })

        })
            .then(res => res.json())
            .then(data => {
                loadGraphExpert(data)
            }).catch(err => {
                alert(err)
            }).finally(() => {
                hideContext()
                loading.style.visibility = 'hidden'
            })
    }
}

function onClickExpand(e) {
    e.preventDefault()
    console.log('Expand node in network uri: ' + uriSelect)
    if (uriSelect) {
        loading.style.visibility = 'visible'
        console.log('Start')
        if (isExpert) {
            fetch(uriExpert, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uri: uriSelect })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    addNodesAndEdges(data)
                }).catch(err => {
                    alert(err)
                }).finally(() => {
                    hideContext()
                    loading.style.visibility = 'hidden'
                })
        } else {
            fetch(uriGraph, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uri: uriSelect })
            })
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                    addNodesAndEdges(data)
                }).catch(err => {
                    alert(err)
                }).finally(() => {
                    hideContext()
                    loading.style.visibility = 'hidden'
                })
        }
    }
}

function initButton() {
    // Element
    const btnSubmit = document.querySelector("#submit")
    const btnTest1 = document.querySelector("#test1")
    const btnVisualize = document.querySelector("#visualize")
    const btnDetail = document.querySelector("#detail")
    const btnExpand = document.querySelector("#expand")

    const input = document.querySelector("#uri")
    // const btnExpand = document.querySelector("#expand")
    const fileUpload = document.querySelector("#file-upload");

    const loading = document.querySelector("#loading")

    input.value = 'https://dbpedia.org/ontology/Actor'

    if (btnDetail) {
        btnDetail.onclick = onClickDetail
    }

    if (btnExpand) {
        btnExpand.onclick = onClickExpand
    }

    if (fileUpload) {
        fileUpload.addEventListener("change", (event) => {
            const { files } = event.target;

            console.log("files", files)

            if (files && files.length) {
                const fileToLoad = files[0];
                // upload file to server
                const formData = new FormData();
                formData.append("file", fileToLoad);
                loading.style.visibility = 'visible'
                fetch(`${urlServer}/graph/file`, {
                    method: "POST",
                    body: formData,
                })
                    .then((res) => res.json())
                    .then((data) => {
                        loadGraph(data)
                    })
                    .catch((err) => {
                        alert(err);
                    })
                    .finally(() => {
                        loading.style.visibility = 'hidden'
                    });
            }

        })
    }

    if (btnTest1) {
        btnTest1.addEventListener('click', (e) => {
            isExpert = true
            console.log('Click button 1')
            e.preventDefault()
            loading.style.visibility = 'visible'
            fetch(uriExpertOntology)
                .then(res => res.json())
                .then(data => {
                    loadGraphExpert(data)
                }).catch(err => {
                    alert(err)
                }).finally(() => {
                    loading.style.visibility = 'hidden'
                })
        })
    }
    if (btnSubmit && input) {
        btnSubmit.addEventListener('mousedown', (e) => {
            isExpert = false
            console.log('Click button 2')
            e.preventDefault()
            e.stopPropagation()
            console.log("click")
            const uri = input.value
            console.log(uri)
            if (!uri) {
                alert("Please input uri")
                return
            }
            loading.style.visibility = 'visible'
            fetch(uriGraph, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ uri: uri })
            })
                .then(res => res.json())
                .then(data => {
                    loadGraphExpert(data)
                }).catch(err => {
                    alert(err)
                }).finally(() => {
                    loading.style.visibility = 'hidden'
                })
        })
    }

    if (btnVisualize) {
        btnVisualize.onclick = onClickVisualize
    }

}

function initInput() {
    const input = document.querySelector("#find")
    const comboboxOptions = document.querySelector(".combobox-options")

    const topPos = input.offsetTop + input.offsetHeight
    const widthInput = input.offsetWidth
    comboboxOptions.style.top = topPos + 80 + 'px'
    comboboxOptions.style.visibility = 'hidden'
    comboboxOptions.style.width = widthInput + 'px'

    input.oninput = (e) => {
        console.log(e.target.value)
        const value = e.target.value
        if (value) {
            const nodesFilter = nodes.get({
                filter: function (item) {
                    return item.label.toLowerCase().includes(value.toLowerCase());
                }
            });
            network.selectNodes(nodesFilter.map(n => n.id))

            const listLabel = nodesFilter.map(n => n.label)
            console.log(listLabel)
            if (listLabel.length === 0) {
                comboboxOptions.style.visibility = 'hidden'
                return
            }
            comboboxOptions.innerHTML = ''
            listLabel.forEach(l => {
                const option = document.createElement('div')
                option.classList.add('combobox-option')
                option.innerHTML = l

                option.addEventListener('click', (e) => {
                    input.value = l
                    comboboxOptions.style.visibility = 'hidden'
                    network.unselectAll()
                    network.selectNodes(nodesFilter.filter(n => n.label === l).map(n => n.id))
                })

                comboboxOptions.appendChild(option)
            })

            comboboxOptions.style.visibility = 'visible'
        }
        else {
            network.unselectAll()
            comboboxOptions.style.visibility = 'hidden'
        }
    }
}

function resetInit() {
    destroy()
}

const pageInit = () => {
    destroy()
    // create a network
    var container = document.getElementById('mynetwork');
    const contextMenu = document.querySelector('#context-node')

    initButton()
    initInput()

    document.addEventListener('click', (e) => {
        if (e.target !== contextMenu && !contextMenu.contains(e.target) && contextMenu.style.visibility !== 'hidden') {
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
            // smooth: true,
            arrows: {
                to: {
                    enabled: true,
                },
            },
            // physics: true,
        },
        interaction: {
            hover: true,
            hideEdgesOnDrag: true,
            hideEdgesOnZoom: true,
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
            stabilization: { iterations: 300 },
            barnesHut: {
                gravitationalConstant: -8000,
                springConstant: 0.001,
                springLength: 200,
            },
        },
        groups: {
            'node': {
                // shape: 'circle',
                title: null,
                color: {
                    color: '#000',
                    border: '#000',
                    background: '#aaccff',
                    highlight: { background: 'red', border: 'black' },
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
                    color: 'black'
                },
                margin: 10,
                // padding: 10
            },
            'property': {
                shape: 'box',
                title: null,
                color: {
                    border: '#009688',
                    background: '#99cc66',
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
                    // size: 59
                    color: 'black'
                },
                margin: 10,
                padding: 10
            },
            'literal': {
                shape: 'box',
                title: null,
                color: {
                    border: 'black',
                    background: 'yellow',
                    highlight: { background: 'red' },
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
                shape: 'circle',
                title: null,
                borderWidth: 3,
                color: {
                    border: '#F44336',
                    background: '#aaccff',
                    highlight: { background: 'red', border: '#000' },
                },
                font: {
                    color: 'black'
                },
                // margin: 10,
                // padding: 10
            },
        },
        //clusterOutliers: true
    };
    network = new vis.Network(container, data, options);

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
        const nodeSelect = nodes.get(node)
        // console.log(nodeSelect)
        uriSelect = nodeSelect.uri
        nodeSelected = nodeSelect
        showContext(params.pointer.DOM.x, params.pointer.DOM.y)
    });

    network.on("stabilizationProgress", function (params) {
        const progressBar = document.querySelector('#progress-bar')
        const loadingBar = document.querySelector('#loading-progress')
        loadingBar.style.visibility = "visible";
        var maxWidth = 100;
        var minWidth = 0;
        var widthFactor = params.iterations / params.total;
        var width = Math.max(minWidth, maxWidth * widthFactor);

        progressBar.style.width = width + "%";
        progressBar.innerText =
            Math.round(widthFactor * 100) + "%";
    });
    network.once("stabilizationIterationsDone", function () {
        const progressBar = document.querySelector('#progress-bar')
        const loadingBar = document.querySelector('#loading-progress')
        progressBar.innerText = "100%";
        progressBar.style.width = "100%";
        // really clean the dom element
        setTimeout(function () {
            loadingBar.style.visibility = "hidden";
        }, 500);
    });

}

pageInit()