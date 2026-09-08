export function connectedComponents(adj: Map<string, string[]>): string[][] {
  const visited = new Set<string>();
  const out: string[][] = [];
  for (const node of adj.keys()) {
    if (visited.has(node)) continue;
    const comp: string[] = [];
    const stack = [node];
    while (stack.length > 0) {
      const cur = stack.pop();
      if (!cur || visited.has(cur)) continue;
      visited.add(cur);
      comp.push(cur);
      for (const n of adj.get(cur) ?? []) if (!visited.has(n)) stack.push(n);
    }
    out.push(comp);
  }
  return out;
}

// Louvain (single-level, greedy modularity gain) — simplified ~35 LOC.
// Net gain = gainJoin - gainLeave so moves only happen when they improve modularity.
export function louvain(adj: Map<string, string[]>): Map<string, number> {
  const nodes = Array.from(adj.keys());
  const community = new Map<string, number>(nodes.map((n, i) => [n, i] as const));
  const degree = new Map<string, number>(nodes.map((n) => [n, (adj.get(n) ?? []).length] as const));
  const m2 = nodes.reduce((s, n) => s + (degree.get(n) ?? 0), 0);
  if (m2 === 0) return community;

  // sigmaTot[c] = sum of degrees of all nodes currently in community c
  const sigmaTot = new Map<number, number>();
  for (const n of nodes) {
    const c = community.get(n);
    if (c === undefined) continue;
    sigmaTot.set(c, (sigmaTot.get(c) ?? 0) + (degree.get(n) ?? 0));
  }

  const maxIters = 32;
  for (let iter = 0; iter < maxIters; iter++) {
    let improved = false;
    for (const n of nodes) {
      const dn = degree.get(n) ?? 0;
      const cur = community.get(n);
      if (cur === undefined) continue;
      const neighbors = adj.get(n) ?? [];

      // kIn[c] = number of edges from n into community c (counts each neighbor once)
      const kIn = new Map<number, number>();
      for (const nb of neighbors) {
        const cn = community.get(nb);
        if (cn === undefined) continue;
        kIn.set(cn, (kIn.get(cn) ?? 0) + 1);
      }

      // Cost of leaving cur: removing n drops sigmaTot[cur] by dn and removes kIn[cur] internal edges
      const kInCur = kIn.get(cur) ?? 0;
      const sigmaCur = (sigmaTot.get(cur) ?? 0) - dn;
      const lossLeave = kInCur / m2 - (sigmaCur * dn) / ((m2 * m2) / 2);

      let bestComm = cur;
      let bestGain = 0; // must beat staying put
      for (const [c, kInC] of kIn) {
        if (c === cur) continue;
        const sigmaC = sigmaTot.get(c) ?? 0;
        const gainJoin = kInC / m2 - (sigmaC * dn) / ((m2 * m2) / 2);
        const net = gainJoin - lossLeave;
        if (net > bestGain) {
          bestGain = net;
          bestComm = c;
        }
      }

      if (bestComm !== cur) {
        // Move n from cur to bestComm; update sigmaTot
        sigmaTot.set(cur, (sigmaTot.get(cur) ?? 0) - dn);
        sigmaTot.set(bestComm, (sigmaTot.get(bestComm) ?? 0) + dn);
        community.set(n, bestComm);
        improved = true;
      }
    }
    if (!improved) break;
  }

  // Renumber communities compactly
  const remap = new Map<number, number>();
  let next = 0;
  for (const c of community.values()) {
    if (!remap.has(c)) remap.set(c, next++);
  }
  for (const [n, c] of community) {
    const newC = remap.get(c);
    if (newC !== undefined) community.set(n, newC);
  }
  return community;
}
