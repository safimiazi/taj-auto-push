📁 your-extension/
├── .vscode/                      # VS Code workspace config
│   └── launch.json               # Debug configs
│
├── media/                        # Images, icons, HTML, CSS for Webviews
│   ├── main.css
│   └── logo.png
│
├── src/
│   ├── commands/                 # All registered commands
│   │   ├── index.ts              # Register all commands
│   │   ├── helloWorld.ts
│   │   └── formatFile.ts
│   │
│   ├── features/                 # Higher-level domain logic
│   │   └── codeActionProvider.ts
│   │
│   ├── services/                 # File system, API, theme, config
│   │   ├── fileService.ts
│   │   └── themeService.ts
│   │
│   ├── utils/                    # Helper functions
│   │   ├── logger.ts
│   │   └── pathHelpers.ts
│   │
│   ├── views/                    # Webview or TreeView UI
│   │   ├── webviewPanel.ts
│   │   └── sidebarView.ts
│   │
│   ├── types/                    # Custom type declarations
│   │   └── extensionTypes.d.ts
│   │
│   ├── config.ts                 # Constants and global config
│   └── extension.ts             # Entry point (keep this clean)
│
├── test/                         # Unit + integration tests
│   └── extension.test.ts
│
├── out/                          # Compiled JavaScript (auto-generated)
│
├── package.json                  # VS Code extension manifest
├── tsconfig.json                 # TypeScript config
├── README.md
└── .gitignore







    // "configuration": {
        //     "title": "Git Auto Commit",
        //     "properties": {
        //         "gitAutoCommit.enable": {
        //             "type": "boolean",
        //             "default": true,
        //             "description": "Enable or disable auto-commit feature"
        //         },
        //         "gitAutoCommit.branch": {
        //             "type": "string",
        //             "default": "main",
        //             "description": "Git branch to push commits to"
        //         },
        //         "gitAutoCommit.debounceTime": {
        //             "type": "number",
        //             "default": 3000,
        //             "description": "Debounce time in milliseconds before auto-commit"
        //         }
        //     }
        // }