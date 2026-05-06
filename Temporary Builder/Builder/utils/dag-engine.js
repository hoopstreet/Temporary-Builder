class DAG {
  constructor() {
    this.nodes = new Map();
  }

  add(task, deps = []) {
    this.nodes.set(task, deps);
  }

  // Topological sort
  resolve() {
    const visited = new Set();
    const result = [];

    const visit = (node) => {
      if (visited.has(node)) return;
      visited.add(node);

      const deps = this.nodes.get(node) || [];
      for (const d of deps) visit(d);

      result.push(node);
    };

    for (const node of this.nodes.keys()) {
      visit(node);
    }

    return [...new Set(result)];
  }
}

module.exports = { DAG };
