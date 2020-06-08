class MarkdownReader extends React.Component {
  constructor() {
    super();
    this.state = {
      raw: "",
    };
  }

  componentDidMount() {
    const placeholder = `# Welcome to my React Markdown Previewer!

## This is a sub-heading...
### And here's some other cool stuff:

Heres some code, \`<div></div>\`, between 2 backticks.

\`\`\`
// this is multi-line code:

function anotherExample(firstLine, lastLine) {
  if (firstLine == '\`\`\`' && lastLine == '\`\`\`') {
    return multiLineCode;
  }
}
\`\`\`

You can also make text **bold**... whoa!
Or _italic_.
Or... wait for it... **_both!_**
And feel free to go crazy ~~crossing stuff out~~.

There's also [links](https://www.freecodecamp.com), and
> Block Quotes!

And if you want to get really crazy, even tables:

Wild Header | Crazy Header | Another Header?
------------ | ------------- | -------------
Your content can | be here, and it | can be here....
And here. | Okay. | I think we get it.

- And of course there are lists.
  - Some are bulleted.
     - With different indentation levels.
        - That look like this.


1. And there are numbererd lists too.
1. Use just 1s if you want!
1. But the list goes on...
- Even if you use dashes or asterisks.
* And last but not least, let's not forget embedded images:

![React Logo w/ Text](https://goo.gl/Umyytc)
`;
    document.getElementById("editor").innerHTML = placeholder;
    document.getElementById("preview").innerHTML = marked(placeholder);
  }

  onTextChange(event) {
    this.setState({
      raw: event.target.value,
    });
    document.getElementById("preview").innerHTML = marked(event.target.value);
  }

  render() {
    return (
      <div style={{ display: "flex" }}>
        <div
          style={{
            flex: 0.5,
            flexDirection: "column",
            display: "flex",
            margin: 20,
            marginRight: 10,
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontWeight: "bolder",
              backgroundColor: "darkgray",
              backgroundColor: "darkgray",
              borderRadius: "10px 10px 0px 0px",
              borderStyle: "outset",
              color: "darkslategray",
              padding: 5,
            }}
          >
            <i className="fas fa-edit" style={{ marginRight: 5 }} />
            EDITOR
          </div>
          <textarea
            id="editor"
            style={{
              resize: "none",
              padding: 20,
              flex: 1,
              borderRadius: "0px 0px 10px 10px",
              outline: "none",
            }}
            value={this.state.raw}
            onChange={this.onTextChange.bind(this)}
          />
        </div>
        <div
          style={{
            flex: 0.5,
            flexDirection: "column",
            display: "flex",
            margin: 20,
            marginLeft: 10,
          }}
        >
          <div
            style={{
              textAlign: "center",
              fontWeight: "bolder",
              backgroundColor: "darkgray",
              backgroundColor: "darkgray",
              borderRadius: "10px 10px 0px 0px",
              borderStyle: "outset",
              color: "darkslategray",
              padding: 5,
            }}
          >
            <i className="fab fa-markdown" style={{ marginRight: 5 }} />
            PREVIEW
          </div>
          <p
            id="preview"
            style={{
              backgroundColor: "black",
              padding: 20,
              marginTop: 0,
              marginBottom: 0,
              flex: 1,
              color: "white",
              borderRadius: "0px 0px 10px 10px",
            }}
          />
        </div>
      </div>
    );
  }
}

ReactDOM.render(<MarkdownReader />, document.getElementById("app"));
