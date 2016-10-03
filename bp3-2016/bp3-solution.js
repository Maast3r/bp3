function combineNodesAndEdges(diagram) {
	for (var edge in diagram.edges) {
		if (!diagram.nodes[diagram.edges[edge].from].to) {
			diagram.nodes[diagram.edges[edge].from].to = new Set();
			diagram.nodes[diagram.edges[edge].from].to.add(diagram.edges[edge].to);
		} else {
			diagram.nodes[diagram.edges[edge].from].to.add(diagram.edges[edge].to);
		}
	}
	return diagram.nodes;
}


function findNextHumanTask(nodes) {
	return nodes.map(function (node) {
		if (node.to) {
			node.to.forEach(function (nextIndex) {
				if (nodes[nextIndex].type !== 'HumanTask' 
						&& nodes[nextIndex].type !== 'End') {
					node.to.delete(nextIndex);
					if (nodes[nextIndex].to) {
						nodes[nextIndex].to.forEach(function (nextNextIndex) {
							node.to.add(nextNextIndex);
						});
					}
				}
			});
		}
		return node;
	});
}

function removeNodeTo(node) {
	var newNode = {};
	newNode.id = node.id;
	newNode.name = node.name;
	newNode.type = node.type;
	return newNode;
}

function includeOnlyHumanTasks(node) {
	if (node.type === 'HumanTask' || node.type === 'Start'
			|| node.type === 'End') {
		return node;
	}
}

function filterPeopleTasks(nodes) {
	var humanizedNodes = findNextHumanTask(nodes);
	var newDiagram = {'nodes': [], 'edges': []};
	newDiagram.nodes = humanizedNodes.filter(includeOnlyHumanTasks);
	newDiagram.nodes.forEach(function (node) {
		if (node.to) {
			node.to.forEach(function (to) {
				newDiagram.edges.push({'from': node.id, 'to': to});
			});
		}
	});
	newDiagram.nodes = newDiagram.nodes.map(removeNodeTo);
	return(newDiagram);
}

var diagram = require('./diagram.json');

console.log(filterPeopleTasks(combineNodesAndEdges(diagram)));