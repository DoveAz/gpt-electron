const {
  app,
  BrowserWindow,
  globalShortcut,
  shell,
  BrowserView,
  ipcMain,
  BaseWindow,
  WebContentsView,
} = require('electron')
const path = require('node:path')
const _ = require('lodash')

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit()
}
const createWindow = () => {
  // Create the browser window.

  const mainWindow = new BaseWindow({
    width: 1100,
    height: 800,
    y: 60,
    icon: './images/icon.ico',
  })

  const tabContentsView = new WebContentsView({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })
  mainWindow.contentView.addChildView(tabContentsView)
  tabContentsView.setBounds({ x: 0, y: 0, width: 1100, height: 37 })
  // tabContentsView.webContents.loadFile('src/tab.html')
  tabContentsView.webContents.loadURL('https://gpt-group.doveaz.xyz:1443/index2.html')

  // const view = new BrowserView()
  // mainWindow.addBrowserView(view)
  // view.setBounds({ x: 0, y: 0, width: 1100, height: 37 })
  //
  // view.webContents.loadFile('src/tab.html')

  const views = {}

  mainWindow.on('resize', () => {
    const { width, height } = mainWindow.getContentBounds()
    _.forEach(views, view => {
      view.setBounds({ x: 0, y: 37, width, height: height - 37  })
    })
  })

  ipcMain.on('change-tab', (event, url) => {
    if (views[url]) {
      // mainWindow.setTopBrowserView(views[url])
      _.forEach(views, view => {
        view.setVisible(false)
      })
      views[url].setVisible(true)
    } else {
      const view = new WebContentsView()
      mainWindow.contentView.addChildView(view)
      const { width, height } = mainWindow.getContentBounds()
      view.setBounds({ x: 0, y: 37, width, height: height - 37 })
      view.webContents.loadURL(url)
      // mainWindow.setTopBrowserView(view)
      views[url] = view
    }
  })


  mainWindow.setMenuBarVisibility(false)
  // mainWindow.loadURL('https://gpt-group.doveaz.xyz:1443/')
  // mainWindow.loadURL('https://chat.deepseek.com/')
  // mainWindow.webContents.setWindowOpenHandler(({ url }) => {
  //   shell.openExternal(url);
  //   return { action: 'deny' };
  // });

  globalShortcut.register('alt+S', () => {
    if (mainWindow.isVisible() && mainWindow.isFocused()) {
      // 如果窗口在最前并且已被聚焦，则隐藏窗口
      mainWindow.hide()
    } else {
      // 否则，显示并聚焦窗口
      mainWindow.show()
      mainWindow.focus()
    }
  })


  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
