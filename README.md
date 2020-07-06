# gerbv AppImage

## local development setup

### install nektos/act (global)

```sh
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

### ./act

Use local `./act` script to run the Github Action locally. It builds a docker image to use as the runner environment and calls the globally installed `act`.
