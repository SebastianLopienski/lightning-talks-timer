# A timer for lightning talks sessions

Author: Sebastian.Lopienski@cern.ch

### How to start

To run the timer (on any machine with nodejs):

```shell
node timer.js [SECRET-TOKEN] [TALK-TIME] [QA-TIME]
```

Arguments (all optional)
* `SECRET-TOKEN` - if not provided or empty, it will be randomly generated for you
* `TALK-TIME` - duration of a talk, in minutes (default: 5)
* `QA-TIME` - duration of Q&A, in minutes (default: 2)


### TODO

- [ ] add an automatic reload of the timer panel (every 30 seconds?)
- [ ] add a visual notification when updates from the server fail