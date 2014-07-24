(function(){

  var socket;

  socket = io.connect();

  socket.on('connect', function() {
    $('body').addClass('connected')
  })

  socket.on('disconnect', function() {
    $('body').removeClass('connected')
  })

  socket.on('addnode', function(json){
    var message = JSON.parse(json)
    addnode(message.id)
  })

  socket.on('addlink', function(json){
    var message = JSON.parse(json)
    addlink(message.source, message.target)
  })

  var width = 960,
      height = 500;

  var fill = d3.scale.category20();

  var force = d3.layout.force()
      .size([width, height])
      .nodes([]) // initialize with no nodes
      .linkDistance(30)
      .charge(-60)
      .on("tick", tick);

  var svg = d3.select("body").append("svg")
      .attr("width", width)
      .attr("height", height)
      .on("mousemove", mousemove)
      .on("mousedown", mousedown);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height);

  var nodes = force.nodes(),
      links = force.links(),
      node = svg.selectAll(".node"),
      link = svg.selectAll(".link");

  var cursor = svg.append("circle")
      .attr("r", 30)
      .attr("transform", "translate(-100,-100)")
      .attr("class", "cursor");

  restart();

  function addnode(id){
    for(var i=0; i<nodes.length; i++){
      if(nodes[i].id===id){
        console.log("node "+id+" already exists, not adding");
        return;
      }
    }

    console.log("adding node "+id);
    nodes.push({x: 200, y: 50, id: id});
    restart();
    return node;
  }

  function findnode(id){
    return nodes.filter(function(node){
      return node.id===id;
    })
  }

  function findlink(source_id, target_id){
    return links.filter(function(link){
      return (link.source.id===source_id && link.target.id===target_id) ||
              (link.source.id===target_id && link.target.id===source_id);
    })
  }

  function addlink(source_id, target_id){
    // find or create nodes
    var source = findnode(source_id)[0] || addnode(source_id);
    var target = findnode(target_id)[0] || addnode(target_id);

    // find or create source and target node
    if(findlink(source_id,target_id).length){
      console.log("link "+source_id+" => "+target_id+" already exists, not adding");
      return;
    }
    console.log("adding link "+source_id+" => "+target_id);
    links.push({source: source, target: target});
    restart();
  }

  function mousemove() {
    cursor.attr("transform", "translate(" + d3.mouse(this) + ")");
  }

  function mousedown() {
    /*var point = d3.mouse(this),
        node = {x: point[0], y: point[1]},
        n = nodes.push(node);

    socket.emit('addnode', node);
    // add links to any nearby nodes
    nodes.forEach(function(target) {
      var x = target.x - node.x,
          y = target.y - node.y;
      if (Math.sqrt(x * x + y * y) < 30) {
        links.push({source: node, target: target});
        socket.emit('addlink', {source: node, target: target});
      }
    });

    restart();*/

    console.log("addnode")
    socket.emit("addnode", "yo")
  }

  function tick() {
    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
  }

  function restart() {
    link = link.data(links);

    link.enter().insert("line", ".node")
        .attr("class", "link");

    node = node.data(nodes);

    node.enter().insert("circle", ".cursor")
        .attr("class", "node")
        .attr("r", 5)
        .call(force.drag);

    force.start();
  }

})()
