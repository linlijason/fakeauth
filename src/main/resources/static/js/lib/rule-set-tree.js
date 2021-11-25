/**
 * 预览规则集 - 决策树规则集
 */

function showRuleSetTree(data) {

  // 准备规则树数据
  const treeData = convRuleRelationsToTree(data.ruleRelations, data)

  // 画树
  drawTree(treeData)
}

const types = ['hitChildRuleId', 'notHitChildRuleId', 'unknownChildRuleId']
const typeTexts = {
  hitChildRuleId: '命中',
  notHitChildRuleId: '未命中',
  unknownChildRuleId: '未知',
}
const typeScore = {
  hitChildRuleId: 'hitScore',
  notHitChildRuleId: 'notHitScore',
  unknownChildRuleId: 'unknownScore'
}

function convRuleRelationsToTree(list, data) {
  let tree = list.filter((i) => i.level === 0)[0]
  let treeRule = data.rules.filter(i => i.id === tree.ruleId)[0]
  tree.name = `${treeRule.id}.${treeRule.name}`
  tree.children = []

  types.forEach(type => {
    if (tree[type]) {
      tree.children.push(list.filter((i) => {
        if (i.ruleId === tree[type]) {
          let rule = data.rules.filter(rule => rule.id === i.ruleId)[0]
          i.type = typeTexts[type]
          // 根据连线类型来确定 score 相加参数
          const score = treeRule[typeScore[type]]
          i.hitScore = rule.hitScore + score
          i.notHitScore = rule.notHitScore + score
          i.unknownScore = rule.unknownScore + score
          i.name = `${i.type}：${rule.id}.${rule.name}`
          return i
        }
      })[0])
    }
  })

  function find(arr) {
    if (arr.length === 0) {
      return
    }
    arr.forEach((item, index) => {
      item.children = []

      types.forEach(type => {
        if (item[type]) {
          item.children.push(list.filter(i => {
            if (i.ruleId === item[type]) {
              let rule = data.rules.filter(rule => rule.id === i.ruleId)[0]
              i.type = typeTexts[type]
              // 根据连线类型来确定 score 相加参数
              const score = treeRule[typeScore[type]]
              i.hitScore = rule.hitScore + score
              i.notHitScore = rule.notHitScore + score
              i.unknownScore = rule.unknownScore + score
              i.name = `${i.type}：${rule.id}.${rule.name}`
              return i
            }
          })[0])
        }
      })

      arr[index] = item
    })
    arr.forEach(item => {
      if (item.children.length > 0) {
        find(item.children)
      } else {
        item.scoreText = `[${item.hitScore}, ${item.notHitScore}, ${item.unknownScore}]`
      }
    })
  }
  find(tree.children)
  return tree
}

function drawTree(data) {
  // ************** Generate the tree diagram	 *****************
  var margin = { top: 20, right: 120, bottom: 20, left: 150 },
    width = 960 - margin.right - margin.left,
    height = 500 - margin.top - margin.bottom;

  var i = 0,
    duration = 750,
    root;

  var tree = d3.layout.tree()
    .size([height, width]);

  var diagonal = d3.svg.diagonal()
    .projection(function (d) { return [d.y, d.x]; });

  var svg = d3.select("#tree").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  root = data;
  root.x0 = height / 2;
  root.y0 = 0;

  update(root);

  d3.select(self.frameElement).style("height", "500px");

  function update(source) {

    // Compute the new tree layout.
    var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

    // Normalize for fixed-depth.
    nodes.forEach(function (d) { d.y = d.depth * 180; });

    // Update the nodes…
    var node = svg.selectAll("g.node")
      .data(nodes, function (d) { return d.id || (d.id = ++i); });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function (d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click);

    nodeEnter.append("circle")
      .attr("r", 1e-6)
      .style("fill", "#448fb8");

    const textEnter = nodeEnter.append("text")
      .attr("x", function (d) { return d.children || d._children ? -13 : 13; })
      .attr("dy", ".35em")
      .attr("text-anchor", function (d) { return d.children || d._children ? "end" : "start"; })
      // .text(function (d) { return d.name; })
      .style("fill-opacity", 1e-6)

    textEnter
      // .append('tspan')
      // .text(d => d.name)
      .html((d) => {
        return (byteSize(d.name) > 20) ? renderMultiLineTspan(d.name, 20) : d.name
      })

    textEnter
      .append('tspan')
      .attr('x', '0.8em')
      .attr('dy', '1.2em')
      .text(d => d.scoreText)

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function (d) { return "translate(" + d.y + "," + d.x + ")"; });

    nodeUpdate.select("circle")
      .attr("r", 10)
      .style("fill", "#448fb8");

    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function (d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

    nodeExit.select("circle")
      .attr("r", 1e-6);

    nodeExit.select("text")
      .style("fill-opacity", 1e-6);

    // Update the links…
    var link = svg.selectAll("path.link")
      .data(links, function (d) { return d.target.id; })
      .attr('stroke', '#cccccc')
      .attr('stroke-width', 2);

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function (d) {
        var o = { x: source.x0, y: source.y0 };
        return diagonal({ source: o, target: o });
      });

    // Transition links to their new position.
    link.transition()
      .duration(duration)
      .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(duration)
      .attr("d", function (d) {
        var o = { x: source.x, y: source.y };
        return diagonal({ source: o, target: o });
      })
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  // Toggle children on click.
  function click(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else {
      d.children = d._children;
      d._children = null;
    }
    update(d);
  }
}

// 文字所占字节数
function byteSize(text){
  var i, k = 0, len = text.length;
  for (i = 0; i < len; i++) {
    if (text.charCodeAt(i) < 256) {
      k++;
    } else {
      k += 2;
    }
  }
  return k
}

// 渲染多行文本
function renderMultiLineTspan(text, wrapsize){
  var i = 0, p = 0, k = 0, len = text.length;
  var tspans = [];
  while (i < len) {
    if (text.charCodeAt(i) < 256) {
      k++;
    } else {
      k += 2;
    }
    if (k >= wrapsize) { // k可能==(wrapsize+1)
      tspans.push('<tspan x="0.8em" dy="1.2em">' + text.substring(p, i + 1) + '</tspan>');
      k = 0;
      p = i + 1;
    }
    i++;
  }
  if (k > 0) {
    tspans.push('<tspan x="0.8em" dy="1.2em">' + text.substring(p) + '</tspan>');
  }
  return tspans.join('');
}