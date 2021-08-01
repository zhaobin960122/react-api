/** work in progress 正在工作的节点 */
let wipRoot = null;
/**
 * 渲染，构造fiber
 * @param {*} vnode 虚拟dom
 * @param {*} container 容器
 */
function render(vnode, container) {
  // console.log(vnode, container);
  // vnode->node
  //   const node = createNode(vnode);
  //   container.appendChild(node);
  wipRoot = {
    type: "div",
    props: {
      children: { ...vnode },
    },
    stateNode: container,
  };

  nextUnitOfWork = wipRoot;
}
/**
 * 根据fiber创建node
 * @param {*} workInProgress fiber
 */
function createNode(workInProgress) {
  let node = null;
  const { type, props } = workInProgress;
  node = document.createElement(type);
  updateNode(node, props);
  return node;
}
/**
 * 构造类组件fiber
 * @param {*} workInProgress
 * @returns
 */
function updateClassComponent(workInProgress) {
  const { type, props } = workInProgress;
  const instance = new type(props);
  const children = instance.render();
  reconcileChildren(workInProgress, children);
}
/**
 * 构造函数组件fiber
 * @param {*} workInProgress
 * @returns
 */
function updateFunctionComponent(workInProgress) {
  const { type, props } = workInProgress;
  const children = type(props);
  reconcileChildren(workInProgress, children);
}
/**
 * 构造原生标签的fiber
 * @param {*} workInProgress
 * @returns
 */
function updateHostComponent(workInProgress) {
  const { props } = workInProgress;
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = createNode(workInProgress);
  }
  reconcileChildren(workInProgress, props.children);
  console.log("workInProgress", workInProgress);
}
/**
 * 添加node节点的属性
 * @param {*} node
 * @param {*} nextVal
 */
function updateNode(node, nextVal) {
  Object.keys(nextVal)
    // .filter(k => k !== "children")
    .forEach(k => {
      if (k === "children") {
        if (typeof nextVal[k] === "string") {
          node.textContent = nextVal[k];
        }
      } else {
        node[k] = nextVal[k];
      }
    });
}
/**
 * 将文本节点的vnode转化为node
 * @param {*} workInProgress
 * @returns
 */
function updateTextComponent(workInProgress) {
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = document.createTextNode(workInProgress.props);
  }
}
/**
 * 协调子节点
 * @param {*} workInProgress
 * @param {*} children
 */
function reconcileChildren(workInProgress, children) {
  if (typeof children === "string" || typeof children === "number") {
    return;
  }
  const newChildren = Array.isArray(children) ? children : [children];
  let previousNewFiber = null;
  newChildren.forEach((child, index) => {
    let newFiber = {
      type: child.type,
      props: { ...child.props },
      stateNode: null,
      child: null,
      sibling: null,
      return: workInProgress,
    };
    if (typeof child === "string") {
      newFiber.props = child;
    }
    // 第一个子节点挂载在child，后面的在上一个节点的sibling
    if (index === 0) {
      workInProgress.child = newFiber;
    } else {
      previousNewFiber.sibling = newFiber;
    }
    previousNewFiber = newFiber;
  });
}
/** 下一个工作节点 */
let nextUnitOfWork = null;

function performUnitOfWork(workInProgress) {
  // step1 执行任务
  const { type } = workInProgress;
  if (typeof type === "string") {
    updateHostComponent(workInProgress);
  } else if (typeof type === "function") {
    type.prototype.isReactComponent
      ? updateClassComponent(workInProgress)
      : updateFunctionComponent(workInProgress);
  } else if (typeof type === "undefined") {
    updateTextComponent(workInProgress);
  }
  // step2 返回下一个任务
  if (workInProgress.child) {
    return workInProgress.child;
  }
  let nextFiber = workInProgress;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
}

function workLoop(IdleDeadline) {
  while (nextUnitOfWork && IdleDeadline.timeRemaining() > 1) {
    // 执行任务并返回下一个任务
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
  }
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
}
requestIdleCallback(workLoop);

function commitRoot() {
  commitWork(wipRoot.child);
  wipRoot = null;
}

function commitWork(workInProgress) {
  // 提交自己
  if (!workInProgress) {
    return;
  }
  let parentNodeFiber = workInProgress.return;
  // 父fiber不一定有node节点
  while (!parentNodeFiber.stateNode) {
    parentNodeFiber = parentNodeFiber.return;
  }
  let parentNode = parentNodeFiber.stateNode;
  if (workInProgress.stateNode) {
    parentNode.appendChild(workInProgress.stateNode);
  }
  // 提交子节点
  commitWork(workInProgress.child);
  // 提交兄弟节点
  commitWork(workInProgress.sibling);
}
const exported = { render };
export default exported;
