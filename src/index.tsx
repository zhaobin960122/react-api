import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
// import App from './App';
// import reportWebVitals from './reportWebVitals';
const jsx = (
  <div className="border">
    <h1>这是个标题</h1>
    <a href="www.baidu.con">点我呀</a>
  </div>
);

ReactDOM.render(jsx, document.getElementById("root"));
console.log("version", React.version); //sy-log
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
