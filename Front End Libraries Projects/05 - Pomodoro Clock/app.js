function CountDownTimer(duration, granularity) {
  this.duration = duration;
  this.granularity = granularity || 1000;
  this.tickFtns = [];
  this.running = false;
  this.timer = null;
  this.step = 0; // in ms
}

CountDownTimer.prototype.start = function () {
  if (this.running) {
    return;
  }
  this.running = true;
  var start = Date.now(),
    that = this,
    diff,
    obj;

  function timer() {
    diff = that.duration - (((Date.now() - start) / 1000) | 0);
    that.step = diff;

    if (diff > 0) {
      that.timer = setTimeout(timer, that.granularity);
    } else {
      diff = 0;
      that.running = false;
    }

    obj = CountDownTimer.parse(diff);
    that.tickFtns.forEach(function (ftn) {
      ftn.call(this, obj.minutes, obj.seconds);
    }, that);
  }

  timer();
};

CountDownTimer.prototype.onTick = function (ftn) {
  if (typeof ftn === "function") {
    this.tickFtns.push(ftn);
  }
  return this;
};

CountDownTimer.prototype.expired = function () {
  return !this.running;
};

CountDownTimer.prototype.clear = function () {
  clearTimeout(this.timer);
};

CountDownTimer.parse = function (seconds) {
  return {
    minutes: (seconds / 60) | 0,
    seconds: seconds % 60 | 0,
  };
};

class PomodoroClock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currTime: 25 * 60, // in ms, default 25dk session 25 * 60
      breakLength: 5, // 5
      sessionLength: 25, // 25
      timeLeft: "25:00",
      started: false,
      breakTime: false, // false means session time
      timer: null,
    };
    this.updateTimeLeft = this.updateTimeLeft.bind(this);
    this.toggleMoment = this.toggleMoment.bind(this);
    this.beep = this.beep.bind(this);
  }

  updateTimeLeft(minutes, seconds, updateCurrTime = true) {
    const { timer } = this.state;

    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    const timeLeft = minutes + ":" + seconds;

    if (updateCurrTime) {
      this.setState({
        timeLeft,
        currTime: timer.step,
      });
    } else {
      this.setState({
        timeLeft,
      });
    }
  }

  toggleMoment() {
    const {
      timer,
      breakTime,
      sessionLength,
      breakLength,
      currTime,
    } = this.state;
    if (timer.expired()) {
      this.beep();
      let newTimer;
      const isBreak = !breakTime === true;
      if (isBreak) {
        newTimer = new CountDownTimer(breakLength * 60);
      } else {
        newTimer = new CountDownTimer(sessionLength * 60);
      }
      this.setState({
        breakTime: !breakTime,
        timer: newTimer,
      });
      // start timer
      newTimer.onTick(this.updateTimeLeft).onTick(this.toggleMoment).start();
    }
  }

  breakDecrement() {
    const {
      breakLength,
      breakTime,
      timeLeft,
      started,
      timer,
      currTime,
    } = this.state;
    if (breakLength > 1 && !started) {
      const newBreakLength = breakLength - 1;
      this.setState({
        currTime: breakTime ? newBreakLength * 60 : currTime,
        breakLength: newBreakLength,
        timeLeft: breakTime ? newBreakLength + ":00" : timeLeft,
      });
      timer.clear();
    }
  }

  breakIncrement() {
    const {
      breakLength,
      breakTime,
      timeLeft,
      started,
      timer,
      currTime,
    } = this.state;
    if (breakLength < 60 && !started) {
      const newBreakLength = breakLength + 1;
      this.setState({
        currTime: breakTime ? newBreakLength * 60 : currTime,
        breakLength: newBreakLength,
        timeLeft: breakTime ? newBreakLength + ":00" : timeLeft,
      });
      timer.clear();
    }
  }

  sessionDecrement() {
    const {
      sessionLength,
      breakTime,
      timeLeft,
      started,
      timer,
      currTime,
    } = this.state;
    if (sessionLength > 1 && !started) {
      const newSessionLength = sessionLength - 1;
      this.setState({
        currTime: !breakTime ? newSessionLength * 60 : currTime,
        sessionLength: newSessionLength,
        timeLeft: !breakTime ? newSessionLength + ":00" : timeLeft,
      });
      timer.clear();
    }
  }

  sessionIncrement() {
    const {
      sessionLength,
      breakTime,
      timeLeft,
      started,
      timer,
      currTime,
    } = this.state;
    if (sessionLength < 60 && !started) {
      const newSessionLength = sessionLength + 1;
      this.setState({
        currTime: !breakTime ? newSessionLength * 60 : currTime,
        sessionLength: newSessionLength,
        timeLeft: !breakTime ? newSessionLength + ":00" : timeLeft,
      });
      timer.clear();
    }
  }

  startStop() {
    const { started, breakLength, sessionLength, timer, currTime } = this.state;
    const isNeedStart = !started === true;

    // toggle start-stop
    this.setState({
      started: !started,
    });

    if (isNeedStart) {
      const newTimer = new CountDownTimer(currTime);

      this.setState({
        timer: newTimer,
      });
      // start timer
      newTimer.onTick(this.updateTimeLeft).onTick(this.toggleMoment).start();
    } else {
      // clear timer!!
      timer.clear();
    }
  }

  reset() {
    const { breakTime, sessionLength, breakLength, timer } = this.state;

    if (breakTime) {
      this.setState({
        currTime: breakLength * 60,
        started: false,
      });
      this.updateTimeLeft(breakLength, 0, false);
    } else {
      this.setState({
        currTime: sessionLength * 60,
        started: false,
      });
      this.updateTimeLeft(sessionLength, 0, false);
    }
    timer.clear();
  }

  beep() {
    const audio = document.getElementById("beep");
    audio.play();
    setTimeout(() => {
      audio.pause();
    }, 1000);
  }

  render() {
    const { timeLeft, breakLength, sessionLength, breakTime } = this.state;
    return (
      <div>
        <span id="title">Pomodoro Clock</span>
        <div id="controls">
          <div className="sub-control">
            <span id="break-label">Break Length</span>
            <div className="control-btn-group">
              <button
                id="break-increment"
                onClick={this.breakIncrement.bind(this)}
              >
                <i className="fas fa-arrow-up fa-2x" />
              </button>
              <span id="break-length">{breakLength}</span>
              <button
                id="break-decrement"
                onClick={this.breakDecrement.bind(this)}
              >
                <i className="fas fa-arrow-down fa-2x" />
              </button>
            </div>
          </div>
          <div className="sub-control">
            <span id="session-label">Session Length</span>
            <div className="control-btn-group">
              <button
                id="session-increment"
                onClick={this.sessionIncrement.bind(this)}
              >
                <i className="fas fa-arrow-up fa-2x" />
              </button>
              <span id="session-length">{sessionLength}</span>
              <button
                id="session-decrement"
                onClick={this.sessionDecrement.bind(this)}
              >
                <i className="fas fa-arrow-down fa-2x" />
              </button>
            </div>
          </div>
        </div>
        <div id="timer">
          <div id="timer-head">
            <span id="timer-label">{breakTime ? "Break" : "Session"}</span>
            <span id="time-left">{timeLeft}</span>
          </div>
          <div>
            <button id="start_stop" onClick={this.startStop.bind(this)}>
              <i className="fa fa-play fa-2x" />
              <i className="fa fa-pause fa-2x" />
            </button>
            <button id="reset" onClick={this.reset.bind(this)}>
              <i className="fas fa-sync-alt fa-2x" />
            </button>
          </div>
          <audio
            loop
            id="beep"
            src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"
          ></audio>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<PomodoroClock />, document.getElementById("app"));
