/**
 * Canvas renderer for graph visualization
 */
export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.scale = 1;
        this.offsetX = 0;
        this.offsetY = 0;

        // Visual settings
        this.nodeRadius = 24;
        this.colors = {
            node: '#667eea',
            nodeStroke: '#764ba2',
            nodeHover: '#f093fb',
            nodeStart: '#38ef7d',
            nodeCurrent: '#f5576c',
            edge: 'rgba(255, 255, 255, 0.3)',
            edgeUsed: '#667eea',
            edgeHover: 'rgba(255, 255, 255, 0.5)',
            pathLine: '#f5576c',
            text: '#fff'
        };

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const rect = this.canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        this.canvas.width = rect.width * dpr;
        this.canvas.height = rect.height * dpr;

        this.ctx.scale(dpr, dpr);

        this.width = rect.width;
        this.height = rect.height;
    }

    /**
     * Main render function
     */
    render(graph, gameState) {
        this.ctx.clearRect(0, 0, this.width, this.height);

        if (!graph) return;

        // Calculate transform to fit graph in canvas
        this.calculateTransform(graph);

        // Draw edges first (below nodes)
        this.drawEdges(graph, gameState);

        // Draw the player's current path
        this.drawPath(graph, gameState);

        // Draw nodes on top
        this.drawNodes(graph, gameState);
    }

    calculateTransform(graph) {
        if (graph.nodes.size === 0) return;

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        for (const [, node] of graph.nodes) {
            minX = Math.min(minX, node.x);
            maxX = Math.max(maxX, node.x);
            minY = Math.min(minY, node.y);
            maxY = Math.max(maxY, node.y);
        }

        const padding = 60;
        const graphWidth = maxX - minX || 1;
        const graphHeight = maxY - minY || 1;

        const scaleX = (this.width - padding * 2) / graphWidth;
        const scaleY = (this.height - padding * 2) / graphHeight;
        this.scale = Math.min(scaleX, scaleY, 80); // Cap scale

        this.offsetX = (this.width - graphWidth * this.scale) / 2 - minX * this.scale;
        this.offsetY = (this.height - graphHeight * this.scale) / 2 - minY * this.scale;
    }

    transformPoint(x, y) {
        return {
            x: x * this.scale + this.offsetX,
            y: y * this.scale + this.offsetY
        };
    }

    inverseTransformPoint(screenX, screenY) {
        return {
            x: (screenX - this.offsetX) / this.scale,
            y: (screenY - this.offsetY) / this.scale
        };
    }

    drawEdges(graph, gameState) {
        const ctx = this.ctx;

        for (const edge of graph.edges) {
            const fromNode = graph.nodes.get(edge.from);
            const toNode = graph.nodes.get(edge.to);
            const from = this.transformPoint(fromNode.x, fromNode.y);
            const to = this.transformPoint(toNode.x, toNode.y);

            // Check if edge is used in current path
            const edgeKey = graph.edgeKey(edge.from, edge.to);
            const usedCount = gameState.usedEdges.get(edgeKey) || 0;
            const isHovered = gameState.hoveredEdge === edgeKey;

            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);

            if (usedCount > 0) {
                ctx.strokeStyle = this.colors.edgeUsed;
                ctx.lineWidth = 4;
            } else if (isHovered) {
                ctx.strokeStyle = this.colors.edgeHover;
                ctx.lineWidth = 3;
            } else {
                ctx.strokeStyle = this.colors.edge;
                ctx.lineWidth = 2;
            }

            ctx.stroke();

            // Draw usage count for multi-edges
            if (usedCount > 1) {
                const midX = (from.x + to.x) / 2;
                const midY = (from.y + to.y) / 2;
                ctx.fillStyle = this.colors.edgeUsed;
                ctx.font = 'bold 14px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(usedCount.toString(), midX, midY);
            }
        }
    }

    drawPath(graph, gameState) {
        if (gameState.path.length < 2) return;

        const ctx = this.ctx;
        ctx.beginPath();
        ctx.strokeStyle = this.colors.pathLine;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        const firstNode = graph.nodes.get(gameState.path[0]);
        const start = this.transformPoint(firstNode.x, firstNode.y);
        ctx.moveTo(start.x, start.y);

        for (let i = 1; i < gameState.path.length; i++) {
            const node = graph.nodes.get(gameState.path[i]);
            const point = this.transformPoint(node.x, node.y);
            ctx.lineTo(point.x, point.y);
        }

        ctx.stroke();
    }

    drawNodes(graph, gameState) {
        const ctx = this.ctx;

        for (const [nodeId, node] of graph.nodes) {
            const pos = this.transformPoint(node.x, node.y);
            const isStart = gameState.path.length > 0 && gameState.path[0] === nodeId;
            const isCurrent = gameState.path.length > 0 && gameState.path[gameState.path.length - 1] === nodeId;
            const isHovered = gameState.hoveredNode === nodeId;
            const isValidMove = gameState.validMoves.has(nodeId);

            // Node circle
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, this.nodeRadius, 0, Math.PI * 2);

            // Fill color based on state
            if (isStart && isCurrent && gameState.path.length > 1) {
                // Back at start - potential completion
                ctx.fillStyle = '#38ef7d';
            } else if (isCurrent) {
                ctx.fillStyle = this.colors.nodeCurrent;
            } else if (isStart) {
                ctx.fillStyle = this.colors.nodeStart;
            } else if (isHovered && isValidMove) {
                ctx.fillStyle = this.colors.nodeHover;
            } else {
                ctx.fillStyle = this.colors.node;
            }

            ctx.fill();

            // Stroke
            ctx.strokeStyle = isValidMove && !isCurrent ? 'rgba(255,255,255,0.8)' : this.colors.nodeStroke;
            ctx.lineWidth = isValidMove && !isCurrent ? 3 : 2;
            ctx.stroke();

            // Label
            ctx.fillStyle = this.colors.text;
            ctx.font = 'bold 16px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(node.label, pos.x, pos.y);
        }
    }

    /**
     * Find node at screen coordinates
     */
    getNodeAt(screenX, screenY, graph) {
        for (const [nodeId, node] of graph.nodes) {
            const pos = this.transformPoint(node.x, node.y);
            const dx = screenX - pos.x;
            const dy = screenY - pos.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance <= this.nodeRadius + 5) {
                return nodeId;
            }
        }
        return null;
    }
}
