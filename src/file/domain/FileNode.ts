export default interface FileNode {
  path: string;
  name: string;
  directory: boolean;
  byteCount: number;
  parent?: FileNode;
  children?: FileNode[];
}

export function hydrateParents(root: FileNode): FileNode {
  if (root.children !== undefined) {
    for (const child of root.children) {
      child.parent = root;
      hydrateParents(child);
    }
  }
  return root;
}
