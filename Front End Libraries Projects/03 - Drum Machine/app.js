const drumPads = [
  {
    name: "Heater 1",
    key: "Q",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3",
  },
  {
    name: "Heater 2",
    key: "W",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3",
  },
  {
    name: "Heater 3",
    key: "E",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3",
  },
  {
    name: "Heater 4",
    key: "A",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3",
  },
  {
    name: "Clap",
    key: "S",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3",
  },
  {
    name: "Open HH",
    key: "D",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3",
  },
  {
    name: "Kick n` Hat",
    key: "Z",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3",
  },
  {
    name: "Kick",
    key: "X",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3",
  },
  {
    name: "Closed HH",
    key: "C",
    audio: "https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3",
  },
];

class DrumMachine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: "",
    };
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.renderDrumPads = this.renderDrumPads.bind(this);
    this.playAudio = this.playAudio.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyPress);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyPress);
  }

  handleKeyPress(event) {
    event.preventDefault();
    var found = drumPads.find(function (element) {
      return element.key.charCodeAt(0) === event.keyCode;
    });
    if (found) {
      this.playAudio(found);
    }
  }

  playAudio(drumPad) {
    const audio = document.getElementById(drumPad.key);
    audio.play();
    this.setState({
      display: drumPad.name,
    });
  }

  renderDrumPads() {
    return drumPads.map((drumPad, i) => (
      <div
        onClick={() => this.playAudio(drumPad)}
        id={`Pad-${i}`}
        className="drum-pad"
      >
        <audio className="clip" id={drumPad.key} src={drumPad.audio}></audio>
        {drumPad.key}
      </div>
    ));
  }

  render() {
    return (
      <div
        id="drum-machine"
        style={{
          width: 600,
          backgroundColor: "gray",
          borderRadius: 10,
          padding: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 20,
          }}
        >
          <div id="drum">{this.renderDrumPads()}</div>
          <div id="display">
            <h1 id="title">{this.state.display}</h1>
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<DrumMachine />, document.getElementById("app"));
