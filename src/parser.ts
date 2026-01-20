import * as path from 'path';

export interface TreeNode {
  name: string;
  isFile: boolean;
  level: number;
  children: TreeNode[];
}

export class TreeParser {

  /**
   * Mejorado: Identifica el inicio real del nombre del archivo.
   * Consideramos "nombre" a partir del primer carácter alfanumérico O un punto (para .gitignore)
   */
  private parseLine(line: string) {
    const contentMatch = line.match(/[a-zA-Z0-9._]/);
    
    if (!contentMatch || contentMatch.index === undefined) {
      return null; // Es una línea de puro "dibujo" (solo ┃, ┣, etc.)
    }

    const firstContentIndex = contentMatch.index;
    const rawIndent = line.substring(0, firstContentIndex);
    let rawName = line.substring(firstContentIndex).trim();

    // 2. Limpieza de sufijos comunes de IA como "(folder)", "[file]", etc.
    rawName = rawName.replace(/\s*[\(\[]\s*(folder|file|directorio|archivo)\s*[\)\]]\s*$/i, '');

    return {
      indent: rawIndent.length,
      name: rawName.replace(/\/$/, ''),
      isExplicitFolder: rawName.endsWith('/')
    };
  }

  private getLevel(indent: number, indentLevels: number[]): number {
    let index = indentLevels.indexOf(indent);
    if (index === -1) {
      indentLevels.push(indent);
      indentLevels.sort((a, b) => a - b);
      index = indentLevels.indexOf(indent);
    }
    return index;
  }

  public parse(treeText: string): TreeNode[] {
    // Filtramos líneas vacías y procesamos
    const lines = treeText.split('\n');
    const parsedLines: any[] = [];

    for (const line of lines) {
      const p = this.parseLine(line);
      if (p) parsedLines.push(p); // Solo agregamos si tiene contenido real
    }
    
    const root: TreeNode[] = [];
    const stack: TreeNode[] = [];
    const indentLevels: number[] = [];

    for (let i = 0; i < parsedLines.length; i++) {
      const parsed = parsedLines[i];
      const level = this.getLevel(parsed.indent, indentLevels);

      let isFile: boolean;
      if (parsed.isExplicitFolder) {
        isFile = false;
      } else {
        const nextParsed = parsedLines[i + 1];
        // Si el siguiente tiene más indentación, esto es una carpeta
        if (nextParsed && nextParsed.indent > parsed.indent) {
          isFile = false;
        } else {
          // Si no tiene hijos, verificamos extensión
          isFile = /\.[a-zA-Z0-9]+$/.test(parsed.name);
        }
      }

      const node: TreeNode = {
        name: parsed.name,
        level,
        isFile,
        children: []
      };

      while (stack.length > level) {
        stack.pop();
      }

      if (stack.length === 0) {
        root.push(node);
      } else {
        const parent = stack[stack.length - 1];
        parent.children.push(node);
      }

      stack.push(node);
    }

    return root;
  }

  public toPaths(nodes: TreeNode[], basePath: string = ''): Array<{ path: string; isFile: boolean }> {
    const result: Array<{ path: string; isFile: boolean }> = [];
    for (const node of nodes) {
      const fullPath = path.join(basePath, node.name);
      result.push({ path: fullPath, isFile: node.isFile });
      if (node.children.length > 0) {
        result.push(...this.toPaths(node.children, fullPath));
      }
    }
    return result;
  }
}