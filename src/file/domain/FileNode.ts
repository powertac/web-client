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

export function findNode(root: FileNode, path: string[]): FileNode|undefined {
  if (path.length === 0) {
    return root;
  } else if (root.children !== undefined) {
    const next = path.shift();
    for (const child of root.children) {
      if (child.name === next) {
        return findNode(child, path);
      }
    }
  }
}

export function relativePath(node: FileNode): string {
  if (node.parent === undefined) {
    return '';
  } else {
    return relativePath(node.parent) + '/' + node.name
  }
}
