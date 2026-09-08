import { describe, expect, test } from "bun:test";
import { embedTexts, getModelInfo } from "../src/embedding/model";

describe("embedding model", () => {
  test("returns a vector of correct dim for a single text", async () => {
    const info = await getModelInfo();
    const vecs = await embedTexts(["hello world"]);
    expect(vecs.length).toBe(1);
    expect(vecs[0]?.length).toBe(info.dim);
  }, 60000);

  test("similar texts yield higher cosine similarity than dissimilar", async () => {
    const vecs = await embedTexts([
      "the cat sat on the mat",
      "felines rest on rugs",
      "stochastic gradient descent",
    ]);
    const cos = (a: number[], b: number[]) => {
      let d = 0;
      let na = 0;
      let nb = 0;
      for (let i = 0; i < a.length; i++) {
        // biome-ignore lint/style/noNonNullAssertion: array index in bounded loop
        d += a[i]! * b[i]!;
        // biome-ignore lint/style/noNonNullAssertion: array index in bounded loop
        na += a[i]! * a[i]!;
        // biome-ignore lint/style/noNonNullAssertion: array index in bounded loop
        nb += b[i]! * b[i]!;
      }
      return d / (Math.sqrt(na) * Math.sqrt(nb));
    };
    const [catVec, felineVec, sgdVec] = vecs;
    const simSimilar = cos(catVec ?? [], felineVec ?? []);
    const simDifferent = cos(catVec ?? [], sgdVec ?? []);
    expect(simSimilar).toBeGreaterThan(simDifferent);
  }, 120000);
});
