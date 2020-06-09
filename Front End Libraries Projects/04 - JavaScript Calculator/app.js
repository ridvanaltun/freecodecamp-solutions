const isNumber = (value) => {
  return !isNaN(value);
};

const isFloat = (value) => {
  return value.includes(".");
};

const isNull = (value) => {
  return value === null;
};

const notNull = (value) => {
  return value !== null;
};

const isArithmeticOperator = (value) => {
  return ["+", "-", "x", "/"].indexOf(value) !== -1;
};

const isLastDigitPeriod = (value) => {
  return value.charAt(value.length - 1) === ".";
};

const isNegativeSign = (operator) => {
  return operator === "-";
};

const isZero = (value) => {
  return value === "0";
};

const calculate = (firstNum, secondNum, operator) => {
  firstNum = parseFloat(firstNum);
  secondNum = parseFloat(secondNum);
  switch (operator) {
    case "+":
      return firstNum + secondNum;
    case "-":
      return firstNum - secondNum;
    case "x":
      return firstNum * secondNum;
    case "/":
      return firstNum / secondNum;
  }
};

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: null,
      formula: "", // not used
      currValue: null,
      isCalculated: false,
      lastOperator: "",
      negativeSign: false,
    };
    this.clearClick = this.clearClick.bind(this);
    this.numClick = this.numClick.bind(this);
    this.actionClick = this.actionClick.bind(this);
    this.calculateClick = this.calculateClick.bind(this);
    this.decimalClick = this.decimalClick.bind(this);
  }

  clearClick() {
    this.setState({
      display: null,
      formula: "",
      currValue: null,
      isCalculated: false,
      lastOperator: "",
      negativeSign: false,
    });
  }

  actionClick(e) {
    const newOperator = e.target.value;
    const { display, currValue, lastOperator, isCalculated } = this.state;

    // clear last calculation
    if (isCalculated) {
      const lastCalculation = display;
      this.setState({
        currValue: lastCalculation,
        display: newOperator,
        lastOperator: newOperator,
        isCalculated: false,
        negativeSign: false,
      });
      return;
    }

    // you can't pass sign to emty display
    if (isNull(display)) return;

    // convert display to newOperator when number not valid to process
    if (isLastDigitPeriod(display)) {
      this.setState({
        display: newOperator,
      });
      return;
    }

    // first time an operator clicked, don't process
    if (isNumber(display) && isNull(currValue)) {
      const newVal = display;
      this.setState({
        lastOperator: newOperator,
        currValue: newVal,
        display: newOperator,
      });
      return;
    }

    // process current value
    if (isNumber(display) && notNull(currValue)) {
      const firstNum = currValue;
      const secondNum = display;
      this.setState({
        lastOperator: newOperator,
        currValue: calculate(firstNum, secondNum, lastOperator),
        display: newOperator,
      });
      return;
    }

    // display has already have an operator
    if (isArithmeticOperator(display)) {
      // if new operator negative, don't change
      if (isNegativeSign(newOperator)) {
        this.setState({
          negativeSign: true,
          display: newOperator,
        });
      } else {
        // change operator
        this.setState({
          lastOperator: newOperator,
          display: newOperator,
        });
      }
      return;
    }
  }

  decimalClick() {
    const { display } = this.state;

    // set decimal in initial
    if (isNull(display) || isArithmeticOperator(display)) {
      this.setState({
        display: "0.",
      });
      return;
    }

    // pass if display has already a decimal
    if (isFloat(display)) return;

    //
    if (isNumber(display)) {
      this.setState({
        display: display + ".",
      });
      return;
    }
  }

  numClick(e) {
    const number = e.target.value;
    const { display, isCalculated, negativeSign } = this.state;

    // clear last calculation
    if (isCalculated) {
      this.clearClick();
      this.setState({
        display: number,
      });
      return;
    }

    // prevent dirst digit zero
    if (isZero(number) && isNull(display)) return;

    // erase arithmetic operator than place number itself
    if (isArithmeticOperator(display) || isNull(display)) {
      if (negativeSign) {
        this.setState({
          negativeSign: false,
          display: display + number,
        });
      } else {
        this.setState({
          display: number,
        });
      }

      return;
    }

    //
    if (isNumber(display)) {
      this.setState({
        display: display + number,
      });
      return;
    }
  }

  calculateClick() {
    const { display, currValue, lastOperator } = this.state;

    // if display empty, do not anything
    if (isNull(display)) return;

    // show display itself when not operation exist
    if (isNumber(display) && isNull(currValue)) {
      this.setState({
        display: display,
        isCalculated: true,
      });
      return;
    }

    // show current value without any calculation
    if (isArithmeticOperator(display) && notNull(currValue)) {
      this.setState({
        display: currValue,
        isCalculated: true,
      });
      return;
    }

    // it is not possible, just in case
    if (isArithmeticOperator(display) && isNull(currValue)) {
      this.clearClick();
    }

    // calculate and show new result
    if (isNumber(display) && notNull(currValue)) {
      const firstNum = currValue;
      const secondNum = display;
      const newVal = calculate(firstNum, secondNum, lastOperator);
      this.setState({
        currValue: newVal,
        display: newVal,
        isCalculated: true,
      });
      return;
    }
  }

  render() {
    return (
      <div id="calculator">
        <div id="screen">
          <div id="formula">{this.state.formula}</div>
          <div id="display">{this.state.display || 0}</div>
        </div>
        <div id="keypad">
          <button id="clear" className="large-btn" onClick={this.clearClick}>
            AC
          </button>
          <button
            id="divide"
            className="act-btn"
            onClick={this.actionClick}
            value="/"
          >
            /
          </button>
          <button
            id="multiply"
            className="act-btn"
            onClick={this.actionClick}
            value="x"
          >
            x
          </button>
          <button
            id="seven"
            className="num-btn"
            value={7}
            onClick={this.numClick}
          >
            7
          </button>
          <button
            id="eight"
            className="num-btn"
            onClick={this.numClick}
            value={8}
          >
            8
          </button>
          <button
            id="nine"
            className="num-btn"
            onClick={this.numClick}
            value={9}
          >
            9
          </button>
          <button
            id="subtract"
            className="act-btn"
            onClick={this.actionClick}
            value="-"
          >
            -
          </button>
          <button
            id="four"
            className="num-btn"
            onClick={this.numClick}
            value={4}
          >
            4
          </button>
          <button
            id="five"
            className="num-btn"
            onClick={this.numClick}
            value={5}
          >
            5
          </button>
          <button
            id="six"
            className="num-btn"
            onClick={this.numClick}
            value={6}
          >
            6
          </button>
          <button
            id="add"
            className="act-btn"
            onClick={this.actionClick}
            value="+"
          >
            +
          </button>
          <button
            id="one"
            className="num-btn"
            onClick={this.numClick}
            value={1}
          >
            1
          </button>
          <button
            id="two"
            className="num-btn"
            onClick={this.numClick}
            value={2}
          >
            2
          </button>
          <button
            id="three"
            className="num-btn"
            onClick={this.numClick}
            value={3}
          >
            3
          </button>
          <button id="equals" className="act-btn" onClick={this.calculateClick}>
            =
          </button>
          <button
            id="zero"
            className="num-btn large-btn"
            onClick={this.numClick}
            value={0}
          >
            0
          </button>
          <button
            id="decimal"
            className="num-btn"
            onClick={this.decimalClick}
            value="."
          >
            .
          </button>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Calculator />, document.getElementById("app"));
