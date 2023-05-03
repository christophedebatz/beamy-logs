## Usage
### Level 1
Command that launch level 1 program:
`make install1 && node run emit_logs`

### Level 2
Command that lauch level 2 program:

Non functional: 
`make install2 && node run emit_logs`

### Docker
A docker is available to deploy 2nd level, not completed unfortunately.
It uses an Alpine image and then install Node 12 with NPM 6:

`cd level2 && docker compose up --build`

### CI

It would have been nice if I had had the time to add some unit / api integration tests to be plugged to my docker in a `workflow.yaml` Github Action.
