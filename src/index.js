import React from "react";
// import ReactDOM from "react-dom";
import ReactDOM from "./mReact/react-dom";
import Component from "./mReact/Component";
import "./index.css";
// import App from "./App";
// import reportWebVitals from "./reportWebVitals";

function FunctionComponent(props) {
  return (
    <div className="border">
      <p>FunctionComponent-{props.name}</p>
    </div>
  );
}

class ClassComponent extends Component {
  render() {
    return (
      <div className="border">
        <p>ClassComponent-{this.props.name}</p>
      </div>
    );
  }
}

const jsx = (
  <div className="border">
    <h1>这是一个标题</h1>
    <a href="www.baidu.com">点我呀</a>
    <FunctionComponent name="函数组件" />
    {/* <ClassComponent name="类组件" /> */}
  </div>
);

ReactDOM.render(jsx, document.getElementById("root"));

console.log("version", React.version);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
