
    npm install
    coffee server.coffe

**Click to add nodes!** Nodes near the cursor will be linked to the new node.

[D3](http://d3js.org/)'s force layout uses the Barnes–Hut approximation to compute repulsive charge forces between all nodes efficiently. Links are implemented as geometric constraints on top of position Verlet integration, offering greater stability. A virtual spring between each node and the center of the chart prevents nodes from drifting into space.
