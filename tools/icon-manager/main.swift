// Skill Icons Manager: a native window around index.html for browsing ./icons and building stacks.
import AppKit
import WebKit

let repoDefaultsKey = "repoPath"
let appearanceDefaultsKey = "appearance"

/// The first preferred system language; the page gets the same one through window.APP_LANG.
let appLanguage = Locale.preferredLanguages.first ?? "en"
let isPortuguese = appLanguage.lowercased().hasPrefix("pt")
func L(_ en: String, _ pt: String) -> String { isPortuguese ? pt : en }

/// A window without a visible title bar: the page's header takes its place. Clicks on the
/// header's blank space drag the window; clicks on its controls go to the page.
final class AppWindow: NSWindow {
  weak var webView: WKWebView?
  /// Bottom of the page header and its interactive controls, in page (top-left) points.
  var headerHeight: CGFloat = 52
  var controls: [CGRect] = []
  /// Native appearance: the system toolbar is the header. The web view under it would still
  /// swallow clicks on the toolbar's empty space, so those drag the window here.
  var nativeChrome = false
  private var forwarding = false

  override func sendEvent(_ event: NSEvent) {
    switch event.type {
    case .leftMouseDown where nativeChrome:
      guard let point = pagePoint(event), point.y < titlebarHeight, !hitsControl(event)
      else { break }
      dragOrZoom(event)
      return
    case .leftMouseDown:
      guard let webView, let point = pagePoint(event), point.y < headerHeight,
        !overWindowButton(event)
      else { break }
      if controls.contains(where: { $0.contains(point) }) {
        // The transparent title bar would swallow this click; hand it to the page.
        guard point.y < titlebarHeight else { break }
        forwarding = true
        makeFirstResponder(webView)
        webView.mouseDown(with: event)
        return
      }
      dragOrZoom(event)
      return
    case .leftMouseDragged where forwarding:
      webView?.mouseDragged(with: event)
      return
    case .leftMouseUp where forwarding:
      forwarding = false
      webView?.mouseUp(with: event)
      return
    default:
      break
    }
    super.sendEvent(event)
  }

  private func dragOrZoom(_ event: NSEvent) {
    if event.clickCount == 2 {
      switch UserDefaults.standard.string(forKey: "AppleActionOnDoubleClick") {
      case "Minimize": performMiniaturize(nil)
      case "None": break
      default: performZoom(nil)
      }
    } else {
      performDrag(with: event)
    }
  }

  /// Whether the click lands on a toolbar control or a window button rather than empty chrome.
  private func hitsControl(_ event: NSEvent) -> Bool {
    guard let frameView = contentView?.superview else { return false }
    var view = frameView.hitTest(event.locationInWindow)
    while let current = view, current !== webView, current !== contentView {
      if current is NSControl || current is NSText { return true }
      view = current.superview
    }
    return false
  }

  private var titlebarHeight: CGFloat { frame.height - contentLayoutRect.height }

  private func pagePoint(_ event: NSEvent) -> CGPoint? {
    guard let content = contentView else { return nil }
    let p = content.convert(event.locationInWindow, from: nil)
    // WKWebView is flipped, so its points are already top-left based like the page's.
    return content.isFlipped ? p : CGPoint(x: p.x, y: content.bounds.height - p.y)
  }

  private func overWindowButton(_ event: NSEvent) -> Bool {
    [.closeButton, .miniaturizeButton, .zoomButton].contains { (kind: NSWindow.ButtonType) in
      guard let button = standardWindowButton(kind) else { return false }
      return button.convert(button.bounds, to: nil).contains(event.locationInWindow)
    }
  }
}

final class AppDelegate: NSObject, NSApplicationDelegate, NSWindowDelegate, NSMenuItemValidation,
  WKScriptMessageHandlerWithReply
{
  var window: AppWindow!
  var webView: WKWebView!
  var stream: FSEventStreamRef?
  /// Last state the page reported, mirrored by the native toolbar.
  var pageState: [String: Any] = [:]
  var segments: [String: NSSegmentedControl] = [:]
  var categoryPopup: NSPopUpButton?
  var searchItem: NSSearchToolbarItem?
  var chromeInset: CGFloat = -1
  /// Desktop blur behind the transparent page in the "native" appearance. Liquid Glass itself
  /// comes from the native toolbar controls; a glass slab over the whole window only cost frames.
  var backdrop: NSView!

  /// "site" (the site's stone/ink palette) or "native" (system colors over Liquid Glass).
  var appearance: String {
    get { UserDefaults.standard.string(forKey: appearanceDefaultsKey) ?? "site" }
    set { UserDefaults.standard.set(newValue, forKey: appearanceDefaultsKey) }
  }

  var repoPath: String {
    UserDefaults.standard.string(forKey: repoDefaultsKey)
      ?? (Bundle.main.object(forInfoDictionaryKey: "SIRepoPath") as? String ?? "")
  }
  var iconsPath: String { (repoPath as NSString).appendingPathComponent("icons") }
  /// Shared to-do list of icons to add, versioned in the repo (the stacks stay per user).
  var candidatesPath: String {
    (repoPath as NSString).appendingPathComponent("icon-candidates.json")
  }

  var stateURL: URL {
    let dir = FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)[0]
      .appendingPathComponent("SkillIconsManager", isDirectory: true)
    try? FileManager.default.createDirectory(at: dir, withIntermediateDirectories: true)
    return dir.appendingPathComponent("state.json")
  }

  func applicationDidFinishLaunching(_ notification: Notification) {
    buildMenu()

    let config = WKWebViewConfiguration()
    config.userContentController.addUserScript(WKUserScript(
      source: """
        window.APP_LANG = \(String(reflecting: appLanguage));
        document.documentElement.classList.toggle('native', \(appearance == "native"));
        """,
      injectionTime: .atDocumentStart, forMainFrameOnly: true))
    config.userContentController.addScriptMessageHandler(self, contentWorld: .page, name: "bridge")
    webView = WKWebView(frame: .zero, configuration: config)
    webView.setValue(false, forKey: "drawsBackground")
    if #available(macOS 13.3, *) { webView.isInspectable = true }

    window = AppWindow(
      contentRect: NSRect(x: 0, y: 0, width: 1280, height: 820),
      styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
      backing: .buffered, defer: false)
    window.title = "Skill Icons Manager"
    window.titleVisibility = .hidden
    window.titlebarAppearsTransparent = true
    window.titlebarSeparatorStyle = .none
    // An empty unified toolbar makes the title bar 52pt tall, centering the traffic lights on the header.
    let toolbar = NSToolbar(identifier: "main")
    toolbar.delegate = self
    toolbar.displayMode = .iconOnly
    toolbar.allowsUserCustomization = false
    window.toolbar = toolbar
    window.toolbarStyle = .unified
    window.webView = webView
    window.delegate = self
    window.minSize = NSSize(width: 900, height: 480)
    backdrop = makeBackdrop()
    let container = NSView()
    for view in [backdrop!, webView!] {
      view.frame = container.bounds
      view.autoresizingMask = [.width, .height]
      container.addSubview(view)
    }
    backdrop.isHidden = appearance != "native"
    window.contentView = container
    window.center()
    window.setFrameAutosaveName("main")
    window.makeKeyAndOrderFront(nil)

    loadPage()
    startWatching()
    NSApp.activate(ignoringOtherApps: true)
    // Release builds (from GitHub) don't know where the repo is: ask on first launch.
    if !hasIcons(repoPath) { DispatchQueue.main.async { self.chooseRepo() } }
  }

  func windowDidEnterFullScreen(_ notification: Notification) { setFullscreen(true) }
  func windowDidExitFullScreen(_ notification: Notification) { setFullscreen(false) }
  func setFullscreen(_ on: Bool) {
    webView.evaluateJavaScript("window.setFullscreen && window.setFullscreen(\(on))")
    sendChromeInset()
  }

  func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool { true }

  func loadPage() {
    chromeInset = -1
    guard let page = Bundle.main.url(forResource: "index", withExtension: "html") else { return }
    webView.loadFileURL(page, allowingReadAccessTo: URL(fileURLWithPath: "/"))
  }

  // MARK: Menu

  func buildMenu() {
    let main = NSMenu()

    let appItem = NSMenuItem()
    let appMenu = NSMenu()
    appMenu.addItem(withTitle: L("About Skill Icons Manager", "Sobre o Skill Icons Manager"),
                    action: #selector(NSApplication.orderFrontStandardAboutPanel(_:)), keyEquivalent: "")
    appMenu.addItem(.separator())
    appMenu.addItem(withTitle: L("Choose Repo Folder…", "Escolher pasta do repo…"), action: #selector(chooseRepo), keyEquivalent: "o")
    appMenu.addItem(.separator())
    appMenu.addItem(withTitle: L("Hide", "Ocultar"), action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
    appMenu.addItem(withTitle: L("Quit", "Sair"), action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
    appItem.submenu = appMenu
    main.addItem(appItem)

    let editItem = NSMenuItem()
    let editMenu = NSMenu(title: L("Edit", "Editar"))
    editMenu.addItem(withTitle: L("Undo", "Desfazer"), action: Selector(("undo:")), keyEquivalent: "z")
    editMenu.addItem(withTitle: L("Redo", "Refazer"), action: Selector(("redo:")), keyEquivalent: "Z")
    editMenu.addItem(.separator())
    editMenu.addItem(withTitle: L("Cut", "Recortar"), action: #selector(NSText.cut(_:)), keyEquivalent: "x")
    editMenu.addItem(withTitle: L("Copy", "Copiar"), action: #selector(NSText.copy(_:)), keyEquivalent: "c")
    editMenu.addItem(withTitle: L("Paste", "Colar"), action: #selector(NSText.paste(_:)), keyEquivalent: "v")
    editMenu.addItem(withTitle: L("Select All", "Selecionar tudo"), action: #selector(NSText.selectAll(_:)), keyEquivalent: "a")
    editItem.submenu = editMenu
    main.addItem(editItem)

    let viewItem = NSMenuItem()
    let viewMenu = NSMenu(title: L("View", "Visualizar"))
    let siteItem = viewMenu.addItem(
      withTitle: L("Site Appearance", "Aparência do site"), action: #selector(chooseAppearance(_:)),
      keyEquivalent: "1")
    siteItem.representedObject = "site"
    let nativeItem = viewMenu.addItem(
      withTitle: L("Native Appearance (Liquid Glass)", "Aparência nativa (Liquid Glass)"),
      action: #selector(chooseAppearance(_:)), keyEquivalent: "2")
    nativeItem.representedObject = "native"
    viewMenu.addItem(.separator())
    viewMenu.addItem(withTitle: L("Reload", "Recarregar"), action: #selector(reload), keyEquivalent: "r")
    viewMenu.addItem(withTitle: L("Show Icons in Finder", "Mostrar ícones no Finder"), action: #selector(openIconsFolder), keyEquivalent: "")
    viewItem.submenu = viewMenu
    main.addItem(viewItem)

    let windowItem = NSMenuItem()
    let windowMenu = NSMenu(title: L("Window", "Janela"))
    windowMenu.addItem(withTitle: L("Minimize", "Minimizar"), action: #selector(NSWindow.performMiniaturize(_:)), keyEquivalent: "m")
    windowMenu.addItem(withTitle: L("Close", "Fechar"), action: #selector(NSWindow.performClose(_:)), keyEquivalent: "w")
    windowItem.submenu = windowMenu
    main.addItem(windowItem)
    NSApp.windowsMenu = windowMenu

    NSApp.mainMenu = main
  }

  @objc func reload() { loadPage() }

  @objc func chooseAppearance(_ sender: NSMenuItem) {
    guard let value = sender.representedObject as? String else { return }
    appearance = value
    backdrop.isHidden = value != "native"
    webView.evaluateJavaScript(
      "document.documentElement.classList.toggle('native', \(value == "native"))")
    rebuildToolbar()
  }

  func validateMenuItem(_ item: NSMenuItem) -> Bool {
    if item.action == #selector(chooseAppearance(_:)) {
      item.state = (item.representedObject as? String) == appearance ? .on : .off
    }
    return true
  }

  func makeBackdrop() -> NSView {
    let blur = NSVisualEffectView()
    blur.blendingMode = .behindWindow
    blur.material = .underWindowBackground
    blur.state = .followsWindowActiveState
    return blur
  }

  @objc func openIconsFolder() { NSWorkspace.shared.open(URL(fileURLWithPath: iconsPath)) }

  func hasIcons(_ repo: String) -> Bool {
    var isDir: ObjCBool = false
    return !repo.isEmpty
      && FileManager.default.fileExists(
        atPath: (repo as NSString).appendingPathComponent("icons"), isDirectory: &isDir)
      && isDir.boolValue
  }

  @objc func chooseRepo() {
    let panel = NSOpenPanel()
    panel.canChooseDirectories = true
    panel.canChooseFiles = false
    panel.message = L(
      "Choose the skill-icons repository folder (the one containing icons/)",
      "Escolha a pasta do repositório skill-icons (a que contém icons/)")
    panel.directoryURL = URL(fileURLWithPath: repoPath)
    panel.beginSheetModal(for: window) { response in
      guard response == .OK, let url = panel.url else { return }
      guard self.hasIcons(url.path) else {
        let alert = NSAlert()
        alert.messageText = L("This folder has no icons/", "Esta pasta não tem icons/")
        alert.informativeText = L(
          "Choose the root of your skill-icons clone.", "Escolha a raiz do seu clone do skill-icons.")
        alert.beginSheetModal(for: self.window) { _ in self.chooseRepo() }
        return
      }
      UserDefaults.standard.set(url.path, forKey: repoDefaultsKey)
      self.startWatching()
      self.loadPage()
    }
  }

  // MARK: Watching ./icons and icon-candidates.json

  func startWatching() {
    if let stream {
      FSEventStreamStop(stream)
      FSEventStreamInvalidate(stream)
      FSEventStreamRelease(stream)
    }
    var context = FSEventStreamContext(
      version: 0, info: Unmanaged.passUnretained(self).toOpaque(),
      retain: nil, release: nil, copyDescription: nil)
    let callback: FSEventStreamCallback = { _, info, count, paths, _, _ in
      guard let info else { return }
      let me = Unmanaged<AppDelegate>.fromOpaque(info).takeUnretainedValue()
      let changed = unsafeBitCast(paths, to: NSArray.self) as? [String] ?? []
      me.filesChanged(changed.prefix(count).map { ($0 as NSString).resolvingSymlinksInPath })
    }
    // The whole repo is watched so atomic saves of icon-candidates.json are seen too.
    stream = FSEventStreamCreate(
      nil, callback, &context, [repoPath] as CFArray,
      FSEventStreamEventId(kFSEventStreamEventIdSinceNow), 0.3,
      FSEventStreamCreateFlags(
        kFSEventStreamCreateFlagFileEvents | kFSEventStreamCreateFlagNoDefer
          | kFSEventStreamCreateFlagUseCFTypes))
    guard let stream else { return }
    FSEventStreamSetDispatchQueue(stream, .main)
    FSEventStreamStart(stream)
  }

  func filesChanged(_ paths: [String]) {
    let icons = (iconsPath as NSString).resolvingSymlinksInPath + "/"
    let candidates = (candidatesPath as NSString).resolvingSymlinksInPath
    if paths.contains(where: { $0.hasPrefix(icons) }) {
      webView.evaluateJavaScript("window.iconsChanged && window.iconsChanged()")
    }
    if paths.contains(candidates) {
      webView.evaluateJavaScript("window.candidatesChanged && window.candidatesChanged()")
    }
  }

  // MARK: Bridge

  func userContentController(
    _ userContentController: WKUserContentController, didReceive message: WKScriptMessage,
    replyHandler: @escaping (Any?, String?) -> Void
  ) {
    guard let body = message.body as? [String: Any], let cmd = body["cmd"] as? String else {
      return replyHandler(nil, L("Invalid message", "Mensagem inválida"))
    }
    switch cmd {
    case "list":
      do {
        let files = try FileManager.default.contentsOfDirectory(atPath: iconsPath)
          .filter { $0.hasSuffix(".svg") }
          .sorted()
        replyHandler(["repoPath": repoPath, "files": files], nil)
      } catch {
        replyHandler(nil, L(
          "Could not find \(iconsPath). Use the “Choose Repo Folder…” menu.",
          "Não encontrei \(iconsPath). Use o menu “Escolher pasta do repo…”."))
      }
    case "toolbarState":
      pageState = body
      rebuildToolbar()
      replyHandler(true, nil)
    case "focusSearch":
      if let field = searchItem?.searchField { window.makeFirstResponder(field) }
      replyHandler(true, nil)
    case "layout":
      window.headerHeight = body["height"] as? CGFloat ?? 52
      window.controls = (body["rects"] as? [[Double]] ?? []).compactMap { r in
        r.count == 4 ? CGRect(x: r[0], y: r[1], width: r[2], height: r[3]) : nil
      }
      replyHandler(true, nil)
    case "readCandidates":
      replyHandler(try? String(contentsOfFile: candidatesPath, encoding: .utf8), nil)
    case "writeCandidates":
      do {
        try (body["text"] as? String ?? "").write(
          toFile: candidatesPath, atomically: true, encoding: .utf8)
        replyHandler(true, nil)
      } catch {
        replyHandler(nil, error.localizedDescription)
      }
    case "readCategories":
      // [[category, [icon ids]]] in file order, from shared/icon-categories.ts. The ids are
      // the ones `bun skill-icon generate` accepts; the icons feed the sidebar.
      let file = (repoPath as NSString).appendingPathComponent("shared/icon-categories.ts")
      let source = ((try? String(contentsOfFile: file, encoding: .utf8)) ?? "") as NSString
      let block = try! NSRegularExpression(pattern: "^  (\\w+): \\{([^}]*)\\}", options: .anchorsMatchLines)
      let key = try! NSRegularExpression(pattern: "(\\w+): 1")
      let categories = block.matches(in: source as String, range: NSRange(location: 0, length: source.length))
        .map { match -> [Any] in
          let body = source.substring(with: match.range(at: 2)) as NSString
          let icons = key.matches(in: body as String, range: NSRange(location: 0, length: body.length))
            .map { body.substring(with: $0.range(at: 1)) }
          return [source.substring(with: match.range(at: 1)), icons]
        }
      replyHandler(categories, nil)
    case "loadState":
      replyHandler(try? String(contentsOf: stateURL, encoding: .utf8), nil)
    case "saveState":
      do {
        try (body["json"] as? String ?? "").write(to: stateURL, atomically: true, encoding: .utf8)
        replyHandler(true, nil)
      } catch {
        replyHandler(nil, error.localizedDescription)
      }
    case "copy":
      NSPasteboard.general.clearContents()
      NSPasteboard.general.setString(body["text"] as? String ?? "", forType: .string)
      replyHandler(true, nil)
    case "reveal":
      let urls = (body["paths"] as? [String] ?? []).map { URL(fileURLWithPath: $0) }
      NSWorkspace.shared.activateFileViewerSelecting(urls)
      replyHandler(true, nil)
    case "open":
      if let path = body["path"] as? String { NSWorkspace.shared.open(URL(fileURLWithPath: path)) }
      replyHandler(true, nil)
    default:
      replyHandler(nil, L("Unknown command: \(cmd)", "Comando desconhecido: \(cmd)"))
    }
  }
}

// MARK: - Native toolbar
// In the native appearance the page hides its header and these system controls take its place,
// so they get Liquid Glass on macOS 26+. The page owns the state: it reports it through
// "toolbarState" and the controls send changes back with window.nativeControl / nativeSearch.

extension NSToolbarItem.Identifier {
  static let view = Self("view")
  static let theme = Self("theme")
  static let filter = Self("filter")
  static let pathMode = Self("pathMode")
  static let taskStatus = Self("taskStatus")
  static let taskCategory = Self("taskCategory")
  static let search = Self("search")
}

/// Segmented controls: page state key → (value, label) per segment.
let segmentOptions: [String: [(String, String)]] = [
  "view": [("icons", L("Icons", "Ícones")), ("tasks", L("Candidates", "Candidatos"))],
  "theme": [("dark", "Dark"), ("light", "Light")],
  "filter": [
    ("all", L("All", "Todos")), ("themed", L("Themed", "Com tema")),
    ("plain", L("No theme", "Sem tema")),
  ],
  "pathMode": [("relative", L("Relative", "Relativo")), ("absolute", L("Absolute", "Absoluto"))],
  "taskStatus": [
    ("all", L("All", "Todos")), ("pending", L("Pending", "Pendente")),
    ("researched", L("Researched", "Pesquisado")), ("added", L("Added", "Adicionado")),
  ],
]
/// Hover help per segment value.
let segmentToolTips: [String: String] = [
  "relative": L(
    "Relative to the repo root, e.g. icons/React-Dark.svg. Use it in code and scripts run from the repo, so it works on any machine.",
    "A partir da raiz do repo, ex.: icons/React-Dark.svg. Use em código e scripts rodados no repo; funciona em qualquer máquina."),
  "absolute": L(
    "Full path on this Mac, e.g. /Users/you/skill-icons/icons/React-Dark.svg. Works from any folder, but only on this machine.",
    "Caminho completo neste Mac, ex.: /Users/voce/skill-icons/icons/React-Dark.svg. Funciona de qualquer pasta, mas só nesta máquina."),
]
let segmentLabels: [String: String] = [
  "view": L("View", "Visão"), "theme": L("Theme", "Tema"), "filter": L("Show", "Mostrar"),
  "pathMode": L("Path", "Caminho"), "taskStatus": L("Status", "Status"),
]

extension AppDelegate: NSToolbarDelegate {
  var pageView: String { pageState["view"] as? String ?? "icons" }

  func currentToolbarItems() -> [NSToolbarItem.Identifier] {
    guard appearance == "native" else { return [] }
    return pageView == "tasks"
      ? [.view, .flexibleSpace, .taskStatus, .taskCategory, .search]
      : [.view, .flexibleSpace, .theme, .filter, .pathMode, .search]
  }

  func toolbarDefaultItemIdentifiers(_ toolbar: NSToolbar) -> [NSToolbarItem.Identifier] {
    currentToolbarItems()
  }

  func toolbarAllowedItemIdentifiers(_ toolbar: NSToolbar) -> [NSToolbarItem.Identifier] {
    [.view, .theme, .filter, .pathMode, .taskStatus, .taskCategory, .search, .flexibleSpace]
  }

  func toolbar(
    _ toolbar: NSToolbar, itemForItemIdentifier id: NSToolbarItem.Identifier,
    willBeInsertedIntoToolbar flag: Bool
  ) -> NSToolbarItem? {
    switch id {
    case .search:
      let item = NSSearchToolbarItem(itemIdentifier: id)
      item.searchField.sendsSearchStringImmediately = true
      item.searchField.target = self
      item.searchField.action = #selector(searchChanged(_:))
      searchItem = item
      return item
    case .taskCategory:
      let popup = NSPopUpButton(frame: .zero, pullsDown: false)
      popup.target = self
      popup.action = #selector(categoryChanged(_:))
      categoryPopup = popup
      let item = NSToolbarItem(itemIdentifier: id)
      item.view = popup
      item.label = L("Category", "Categoria")
      return item
    default:
      guard let options = segmentOptions[id.rawValue] else { return nil }
      let control = NSSegmentedControl(
        labels: options.map(\.1), trackingMode: .selectOne, target: self,
        action: #selector(segmentChanged(_:)))
      control.identifier = NSUserInterfaceItemIdentifier(id.rawValue)
      for (index, option) in options.enumerated() {
        if let tip = segmentToolTips[option.0] { control.setToolTip(tip, forSegment: index) }
      }
      segments[id.rawValue] = control
      let item = NSToolbarItem(itemIdentifier: id)
      item.view = control
      item.label = segmentLabels[id.rawValue] ?? ""
      return item
    }
  }

  func rebuildToolbar() {
    window.nativeChrome = appearance == "native"
    guard let toolbar = window.toolbar else { return }
    let wanted = currentToolbarItems()
    if toolbar.items.map(\.itemIdentifier) != wanted {
      while !toolbar.items.isEmpty { toolbar.removeItem(at: 0) }
      for (index, id) in wanted.enumerated() { toolbar.insertItem(withItemIdentifier: id, at: index) }
    }
    syncToolbar()
    sendChromeInset()
  }

  /// Mirrors the page state into the controls.
  func syncToolbar() {
    for (key, control) in segments {
      let value = pageState[key] as? String
      if let index = segmentOptions[key]?.firstIndex(where: { $0.0 == value }) {
        control.selectedSegment = index
      }
    }
    if let popup = categoryPopup {
      let ids = pageState["categories"] as? [String] ?? []
      let wanted = [""] + ids
      if popup.itemArray.compactMap({ $0.representedObject as? String }) != wanted {
        popup.removeAllItems()
        for id in wanted {
          popup.addItem(withTitle: id.isEmpty ? L("All categories", "Todas as categorias") : id)
          popup.lastItem?.representedObject = id
        }
      }
      let selected = pageState["taskCategory"] as? String ?? ""
      popup.selectItem(at: max(0, wanted.firstIndex(of: selected) ?? 0))
    }
    if let field = searchItem?.searchField {
      let tasks = pageView == "tasks"
      field.placeholderString =
        tasks ? L("Search candidates", "Buscar candidato") : L("Search icons", "Buscar ícone")
      // Leave the text alone while the user is typing in it.
      if field.currentEditor() == nil {
        field.stringValue = pageState[tasks ? "taskQuery" : "query"] as? String ?? ""
      }
    }
  }

  /// The page pads its top by the title bar + toolbar height in the native appearance.
  func sendChromeInset() {
    let inset = window.frame.height - window.contentLayoutRect.height
    // Setting the variable restyles the whole page, so only send real changes.
    guard inset != chromeInset else { return }
    chromeInset = inset
    webView.evaluateJavaScript(
      "document.documentElement.style.setProperty('--chrome-top', '\(inset)px')")
  }

  func sendToPage(_ call: String, _ args: Any...) {
    guard let data = try? JSONSerialization.data(withJSONObject: args, options: .fragmentsAllowed),
      let json = String(data: data, encoding: .utf8)
    else { return }
    webView.evaluateJavaScript("window.\(call) && window.\(call)(...\(json))")
  }

  @objc func segmentChanged(_ sender: NSSegmentedControl) {
    guard let key = sender.identifier?.rawValue, let options = segmentOptions[key],
      options.indices.contains(sender.selectedSegment)
    else { return }
    sendToPage("nativeControl", key, options[sender.selectedSegment].0)
  }

  @objc func categoryChanged(_ sender: NSPopUpButton) {
    sendToPage("nativeControl", "taskCategory", sender.selectedItem?.representedObject as? String ?? "")
  }

  @objc func searchChanged(_ sender: NSSearchField) {
    guard let data = try? JSONSerialization.data(withJSONObject: [sender.stringValue]),
      let json = String(data: data, encoding: .utf8)
    else { return }
    // A pasted array of icons selects them; the page answers true and the field empties.
    webView.evaluateJavaScript("window.nativeSearch && window.nativeSearch(...\(json))") {
      result, _ in
      if result as? Bool == true { sender.stringValue = "" }
    }
  }
}

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.regular)
app.run()
