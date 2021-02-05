## Description
multiprocess-cypress is cli tool, which helps you run cypress test on multi-process

## Installation

```bash
npm i @boozingeorge/multiprocess-cypress -D
```

## Usage

### npx
```bash
npx @boozingeorge/multiprocess-cypress run -d cypress/integration -t 2
```

### npm script:
```json
{
    "scripts": {
        "multiprocess-run": "multiprocess-cypress run -d cypress/integration -t 2"
    }
}

```

### bash:
```bash
./node_modules/.bin/multiprocess-cypress run -d cypress/integration -t 2
```

## Comands and options

```
Commands:
  run  Run cypress tests
```

```
run  Run cypress tests

Options:
      --version         Show version number                            [boolean]
  -h, --help            Show help                                      [boolean]
  -t, --threads         number threads to run tests        [number] [default: 1]
  -d, --dir             path directory to run tests          [string] [required]
  -e, --extension       file test extension                             [string]
      --bin-path        path to cypress binary
                                 [string] [default: "node_modules/.bin/cypress"]
      --output-log-dir  path to output log dir
                                          [string] [default: "multiprocess-cypress"]
```

## Pass arguments
you can use custom arguments when executing tool. The special option `--` is used by [getopt](https://unix.stackexchange.com/questions/147143/when-and-how-was-the-double-dash-introduced-as-an-end-of-options-delimiter) to delimit the end of the options. Tool will pass all the arguments after the `--` directly to cypress bin:

```bash
npx @boozingeorge/multiprocess-cypress run -d cypress/integration -t 2 -- --env allure=true
```
