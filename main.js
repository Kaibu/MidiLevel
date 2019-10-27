const {app} = require('electron')

const {Menu, Tray, BrowserWindow, ipcMain} = require('electron')

let tray = null
let version = app.getVersion()

let midiWin

const createWindows = () => {
  // web process
  midiWin = new BrowserWindow({
    icon: 'resources/icon/workericon.ico',
    width: 1000,
    height: 500,
    show: false,
    webPreferences: {
      nodeIntegration: true
    }
  }).on('close', () => {
    app.quit()
  })
  midiWin.loadURL(`file://${__dirname}/app/midiWin.html`)
  midiWin.webContents.openDevTools({
    detach: false
  })

  setUpIpcHandlers()
  createTray()
}

const createTray = () => {
  tray = new Tray(app.getAppPath() + '\\resources\\icon\\tray.ico')
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Reload Config',
      click: () => {
      }
    },
    {
      label: 'Dev-Tools',
      click: () => {
        toggleDevTools()
      }
    },
    {
      label: 'Restart',
      click: () => {
        app.relaunch()
        app.quit()
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Quit',
      click: () => {
        app.quit()
      }
    }
  ])
  tray.setToolTip('MidiLevel')
  tray.setContextMenu(contextMenu)
  tray.on('click', () => {
    midiWin.isMinimized() ? win.restore() : midiWin.minimize()
  })
}

const toggleDevTools = () => {
  midiWin.show()
}

const setUpIpcHandlers = () => {
  if (!midiWin) return
  ipcMain.on('to-midi', (event, arg) => {
    try {
      midiWin.webContents.send('to-dwn', arg)
    } catch (e) {
    }
  })
}

app.on('window-all-closed', () => {
  ipcMain.removeAllListeners()
})

const shouldQuit = app.requestSingleInstanceLock()

if (!shouldQuit) {
  app.quit()
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {

  })
}

app.on('ready', () => {
  createWindows()
})

app.on('activate', () => {
  if (midiWin === null) {
    createWindows()
  }
})

ipcMain.on('close-app', () => {
  app.quit()
})

ipcMain.on('focus-window', () => {
  midiWin.focus()
})