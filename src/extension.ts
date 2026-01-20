import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { TreeParser } from './parser';

export function activate(context: vscode.ExtensionContext) {
  console.log('Tree-to-Folder extension is now active');

  const disposable = vscode.commands.registerCommand(
    'tree-to-folder.generateFromTree',
    async (uri: vscode.Uri) => {
      try {
        // Encuentra el directorio objetivo
        const targetPath = await getTargetPath(uri);
        if (!targetPath) {
          return;
        }

        // Pregunta al usuario cómo quiere ingresar el árbol
        const inputMethod = await vscode.window.showQuickPick(
          ['Open in editor (recommended)', 'Quick input box (single line only)'],
          { placeHolder: 'How would you like to input the tree structure?' }
        );

        if (!inputMethod) {
          return;
        }

        let finalTreeText: string;

        if (inputMethod === 'Open in editor (recommended)') {
          // Crea un nuevo documento sin título
          const doc = await vscode.workspace.openTextDocument({
            content: '# Paste your tree structure below, then click "Generate" in the notification\n\n',
            language: 'plaintext'
          });
          
          const editor = await vscode.window.showTextDocument(doc);
          
          // Espera a que el usuario haga clic en "Generate"
          const result = await vscode.window.showInformationMessage(
            'Paste your tree structure in the editor, then click "Generate"',
            'Generate',
            'Cancel'
          );

          if (result !== 'Generate') {
            return;
          }

          // Obtiene el texto del documento
          finalTreeText = doc.getText();
          
          // Elimina la línea de instrucción si está presente
          finalTreeText = finalTreeText.replace(/^#.*\n\n/, '');
          
        } else {
          // Usa el cuadro de entrada rápido
          const treeText = await vscode.window.showInputBox({
            prompt: 'Paste your directory tree structure (WARNING: Multi-line will be collapsed)',
            placeHolder: 'Example: src/components/Button.tsx',
            ignoreFocusOut: true,
            validateInput: (text) => {
              if (!text || text.trim().length === 0) {
                return 'Please enter a valid tree structure';
              }
              return null;
            }
          });

          if (!treeText) {
            return;
          }

          finalTreeText = treeText;
        }

        if (!finalTreeText || finalTreeText.trim().length === 0) {
          vscode.window.showErrorMessage('No tree structure provided');
          return;
        }

        // Esparce
        const parser = new TreeParser();
        const tree = parser.parse(finalTreeText);
        const paths = parser.toPaths(tree, targetPath);

        if (paths.length === 0) {
          vscode.window.showErrorMessage('No valid items found in tree structure');
          return;
        }

        // Muestra una vista previa y pide confirmación
        const preview = paths.map(p => 
          `${p.isFile ? '📄' : '📁'} ${path.relative(targetPath, p.path)}`
        ).join('\n');

        const confirm = await vscode.window.showInformationMessage(
          `Create ${paths.length} items?\n\n${preview.split('\n').slice(0, 10).join('\n')}${paths.length > 10 ? '\n...' : ''}`,
          { modal: true },
          'Create',
          'Cancel'
        );

        if (confirm !== 'Create') {
          return;
        }

        // Crea la estructura de archivos y carpetas
        await createStructure(paths);

        vscode.window.showInformationMessage(
          `✅ Successfully created ${paths.length} items!`
        );

        // Refresca el explorador de archivos
        vscode.commands.executeCommand('workbench.files.action.refreshFilesExplorer');

      } catch (error) {
        vscode.window.showErrorMessage(
          `Error generating structure: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

async function getTargetPath(uri?: vscode.Uri): Promise<string | undefined> {
  // Si hace clic derecho en una carpeta o archivo, se usa
  if (uri && fs.existsSync(uri.fsPath)) {
    const stat = fs.statSync(uri.fsPath);
    if (stat.isDirectory()) {
      return uri.fsPath;
    }
    return path.dirname(uri.fsPath);
  }

  // O usamos la carpeta de trabajo abierta
  const workspaceFolders = vscode.workspace.workspaceFolders;
  if (!workspaceFolders || workspaceFolders.length === 0) {
    vscode.window.showErrorMessage('Please open a workspace first');
    return undefined;
  }

  if (workspaceFolders.length === 1) {
    return workspaceFolders[0].uri.fsPath;
  }

  // Multiple workspace folders
  const selected = await vscode.window.showQuickPick(
    workspaceFolders.map(folder => ({
      label: folder.name,
      description: folder.uri.fsPath,
      folder: folder
    })),
    { placeHolder: 'Select target workspace folder' }
  );

  return selected?.folder.uri.fsPath;
}

async function createStructure(paths: Array<{path: string, isFile: boolean}>): Promise<void> {
  for (const item of paths) {
    if (item.isFile) {
      // Crea directorio padre
      const dir = path.dirname(item.path);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      // Crea archivo
      if (!fs.existsSync(item.path)) {
        fs.writeFileSync(item.path, '', 'utf8');
      }
    } else {
      // Crea carpeta
      if (!fs.existsSync(item.path)) {
        fs.mkdirSync(item.path, { recursive: true });
      }
    }
  }
}

export function deactivate() {
  console.log('Tree-to-Folder extension is now deactivated');
}