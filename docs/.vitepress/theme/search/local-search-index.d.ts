/** VitePress' local search index: per locale key, the serialized MiniSearch index. */
declare module "@localSearchIndex" {
  const indexes: Record<string, () => Promise<{ default: string }>>;
  export default indexes;
}
