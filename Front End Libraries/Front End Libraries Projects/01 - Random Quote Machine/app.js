class QuoteMachine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currQuoteIndex: null,
      quotes: [
        {
          text: "The purpose of our lives is to be happy.",
          author: "Dalai Lama",
        },
        {
          text: "Life is what happens when you’re busy making other plans.",
          author: "John Lennon",
        },
        {
          text: "Get busy living or get busy dying.",
          author: "Stephen King",
        },
      ],
    };
  }

  getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  updateQuote() {
    const newQuoteIndex = this.getRndInteger(0, this.state.quotes.length);
    if (newQuoteIndex !== this.state.currQuoteIndex) {
      this.setState({
        currQuoteIndex: newQuoteIndex,
      });
    } else {
      this.updateQuote();
    }
  }

  render() {
    const { currQuoteIndex, quotes } = this.state;
    const quote =
      currQuoteIndex === null
        ? quotes[this.getRndInteger(0, quotes.length)]
        : quotes[currQuoteIndex];
    return (
      <div
        id="quote-box"
        style={{
          backgroundColor: "purple",
          alignItems: "center",
          padding: 20,
          width: 400,
          flex: 1,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span id="text" style={{ fontSize: 35, color: "cornsilk" }}>
            <i
              className="fa fa-quote-left"
              style={{
                margin: 10,
                marginRight: 15,
                fontSize: 35,
                color: "burlywood",
              }}
            />
            {quote.text}
          </span>
          <span
            id="author"
            style={{
              marginTop: 20,
              fontWeight: "bold",
              fontSize: 30,
              fontStyle: "italic",
              alignSelf: "flex-end",
              color: "burlywood",
            }}
          >
            ~ {quote.author}
          </span>
        </div>
        <div
          id="buttons"
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 25,
          }}
        >
          <div
            id="social-media"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <a
              id="tweet-quote"
              style={{
                backgroundColor: "burlywood",
                padding: 12,
                borderRadius: 5,
                fontSize: "x-large",
                textDecoration: "unset",
                color: "purple",
              }}
              href="https://twitter.com/intent/tweet"
              data-text={quote.text + " - " + quote.author}
              data-hashtags="quote"
            >
              Tweet
            </a>
          </div>
          <button
            id="new-quote"
            style={{
              marginTop: 10,
              padding: 10,
              borderRadius: 10,
              backgroundColor: "burlywood",
              border: 0,
              color: "purple",
              fontSize: "x-large",
              fontWeight: "bolder",
            }}
            onClick={() => this.updateQuote()}
          >
            New Quote
          </button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<QuoteMachine />, document.getElementById("app"));
