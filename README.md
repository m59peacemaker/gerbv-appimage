# gerbv AppImage

## nodejs

### install

```sh
npm install m59peacemaker/gerbv-appimage
```

### usage

```js
import { execFile } from 'child_process'
import { promisify } from 'util'
import gerbvBin from 'gerbv-bin'
const execFileAsync = promisify(execFile)

;(async () => {
  await execFileAsync(gerbvBin, [ '--export', 'png', '--output', outputFilePath, inputFilePath ])
})()
```

## local development setup

### install `nektos/act` (global)

```sh
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

### `./act`

Use local `./act` script to run the Github Action locally. It builds a docker image to use as the runner environment and calls the globally installed `act`.
