"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const alphaInstaller_1 = require("./alphaInstaller");
const pollDownloadProgress_1 = require("./binary/pollDownloadProgress");
const requests_1 = require("./binary/requests/requests");
const capabilities_1 = require("./capabilities");
const commandsHandler_1 = require("./commandsHandler");
const consts_1 = require("./consts");
const extensionContext_1 = require("./extensionContext");
const handleUninstall_1 = require("./handleUninstall");
const hoverHandler_1 = require("./hovers/hoverHandler");
const pollNotifications_1 = require("./notifications/pollNotifications");
const provideCompletionItems_1 = require("./provideCompletionItems");
const selectionHandler_1 = require("./selectionHandler");
const pollStatusBar_1 = require("./statusBar/pollStatusBar");
const statusBar_1 = require("./statusBar/statusBar");
const ValidatorClient_1 = require("./validator/ValidatorClient");
function activate(context) {
    requests_1.initBinary();
    handleSelection(context);
    handleUninstall_1.default(() => {
        return uponUninstall(context);
    });
    statusBar_1.registerStatusBar(context);
    // Do not await on this function as we do not want VSCode to wait for it to finish
    // before considering TabNine ready to operate.
    void backgroundInit(context);
    return Promise.resolve();
}
exports.activate = activate;
async function backgroundInit(context) {
    // Goes to the binary to fetch what capabilities enabled:
    await capabilities_1.fetchCapabilitiesOnFocus();
    if (capabilities_1.isCapabilityEnabled(capabilities_1.Capability.ALPHA_CAPABILITY) &&
        process.env.NODE_ENV !== "test") {
        void alphaInstaller_1.default(context);
    }
    pollNotifications_1.default(context);
    pollStatusBar_1.default(context);
    statusBar_1.setDefaultStatus();
    commandsHandler_1.registerCommands(context);
    pollDownloadProgress_1.default();
    vscode.languages.registerCompletionItemProvider({ pattern: "**" }, {
        provideCompletionItems: provideCompletionItems_1.default,
    }, ...consts_1.COMPLETION_TRIGGERS);
    vscode.languages.registerHoverProvider({ pattern: "**" }, {
        provideHover: hoverHandler_1.provideHover,
    });
}
async function deactivate() {
    void ValidatorClient_1.closeValidator();
    pollNotifications_1.cancelNotificationsPolling();
    pollStatusBar_1.disposeStatus();
    return requests_1.deactivate();
}
exports.deactivate = deactivate;
function uponUninstall(context) {
    void alphaInstaller_1.updatePersistedAlphaVersion(context, undefined);
    return requests_1.uninstalling();
}
function handleSelection(context) {
    if (extensionContext_1.tabnineContext.isTabNineAutoImportEnabled) {
        context.subscriptions.push(vscode.commands.registerTextEditorCommand(selectionHandler_1.COMPLETION_IMPORTS, selectionHandler_1.getSelectionHandler(context)), vscode.commands.registerTextEditorCommand(selectionHandler_1.HANDLE_IMPORTS, selectionHandler_1.handleImports));
    }
}
//# sourceMappingURL=extension.js.map