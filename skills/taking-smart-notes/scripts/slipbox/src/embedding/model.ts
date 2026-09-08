// biome-ignore lint/suspicious/noExplicitAny: transformers.js types are loose
let _pipeline: any = null;
const _model = process.env.SLIPBOX_MODEL ?? "BAAI/bge-m3";

export interface ModelInfo {
  name: string;
  dim: number;
}

// biome-ignore lint/suspicious/noExplicitAny: transformers.js types are loose
export async function getPipeline(): Promise<any> {
  if (_pipeline) return _pipeline;
  const { pipeline } = await import("@huggingface/transformers");
  _pipeline = await pipeline("feature-extraction", _model, {
    dtype: "fp32",
    use_external_data_format: true,
  });
  return _pipeline;
}

export async function getModelInfo(): Promise<ModelInfo> {
  const pipe = await getPipeline();
  const out = await pipe(" ", { pooling: "mean", normalize: true });
  return { name: _model, dim: out.dims[1] ?? out.data.length };
}

export async function embedTexts(texts: string[]): Promise<number[][]> {
  const pipe = await getPipeline();
  const results: number[][] = [];
  for (const t of texts) {
    const out = await pipe(t, { pooling: "mean", normalize: true });
    results.push(Array.from(out.data));
  }
  return results;
}
