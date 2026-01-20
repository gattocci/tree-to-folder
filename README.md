Hello, boss! This is:

## Tree-to-Folder Generator

![Demo](media/demo.gif)

  This VS Code extension transforms plain text directory schemas into real project structures with a single click.

How to use: Right-click any folder or empty space in the Explorer and select "Generate from Tree".

    Two Ways to Input:

    Editor Mode: Opens a temporary scratchpad—ideal for pasting large, complex trees from a README or AI chat.

    Quick Input: A simple pop-up box for fast, single-line or small structures.

#### Smart Parsing: 

- The extension automatically strips away emojis (📦, 📂), box-drawing characters (┣, ┗, ┃), and guide lines. It focuses purely on indentation and names to build your project.

#### Intelligent Hierarchy: 

- It detects folders vs. files based on nesting and extensions. If an item has "children" indented underneath it, the extension knows it's a folder, even if it has a file-like name.

#### Safe Preview: 

- Before any files are created on your disk, the extension shows a preview list of the final paths. You can verify the structure and click "Create" to confirm or "Cancel" to tweak your text.

#### Pro-Tip:

To handle highly complex or "messy" trees with broken guide lines, we recommend using the Editor Mode. Just paste your text, hit the Generate button in the notification, and let the extension do the heavy lifting.

### Actual fact:
If you think, “Yes, if I put three completely different trees with different characters, it won't work properly,” yes, that's what will happen. It won't work with 100% accuracy. 

You don't have to think too much about it. Just copy paste the tree and generate.

Not perfect but enough.

## Manual Installation
Just follow this simple tutorial if you not found this plugin in the Extensions Marketplace (This assume that you actually are inside a folder while using VS Code);

#### 1. Prerequisites
Ensure you have Node.js installed, then install the VS Code Extension Manager globally:


```bash
npm install -g @vscode/vsce
```

#### 2. Build the Extension
Clone the repository and generate the installation package:

```bash
git clone https://github.com/gattocci/tree-to-folder.git
cd tree-to-folder
npm install
npm run compile
vsce package
```
#### 3. Install to VS Code
After running the commands above, a file named tree-to-folder-1.0.0.vsix will be created in your folder. To install it:

Via UI: Open VS Code, go to the Extensions view (Ctrl+Shift+X), click the "..." (Views and More Actions) at the top right, select Install from VSIX..., and choose the generated file.

Via Terminal: Run the following command:

```bash
code --install-extension tree-to-folder-1.0.0.vsix
```

Or directly download the extension inside VS code!
--not yet--