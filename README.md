## Description
parallel-cypress is cli tool, which helps you run cypress test on multi-process

## Installation

```bash
npm i @boozingeorge/parallel-cypress -D
```

## Usage

### bash:
```bash
./node_modules/.bin/parallel-cypress run -d cypress/integration -t 2
```

### npm script:
```json
{
    "scripts": {
        "parallel-run": "parallel-cypress run -d cypress/integration -t 2"
    }
}

```

## Comands and options

```
Commands:
  run  Run cypress tests
```

```
run

Options:
      --version         Show version number                            [boolean]
  -h, --help            Show help                                      [boolean]
  -t, --threads         number threads to run tests        [number] [default: 1]
  -d, --dir             path directory to run tests          [string] [required]
  -e, --extension       file test extension                             [string]
      --bin-path        path to cypress binary
                                 [string] [default: "node_modules/.bin/cypress"]
      --output-log-dir  path to output log dir
                                          [string] [default: "parallel-cypress"]
```
