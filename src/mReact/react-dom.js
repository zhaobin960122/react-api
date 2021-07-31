function render(vnode, container) {
  // console.log(vnode, container);
  // vnode->node
  const node = createNode(vnode);
  container.appendChild(node);
}
function createNode(vnode) {
  let node = null;
  const { type } = vnode;
  if (typeof type === "string") {
    node = updateHostComponent(vnode);
  } else if (typeof type === "function") {
    node = type.prototype.isReactComponent
      ? updateClassComponent(vnode)
      : updateFunctionComponent(vnode);
  } else {
    node = updateTextComponent(vnode);
  }
  return node;
}
function updateClassComponent(vnode) {
  const { type, props } = vnode;
  const instance = new type(props);
  const vvnode = instance.render();
  const node = createNode(vvnode);
  return node;
}
function updateFunctionComponent(vnode) {
  const { type, props } = vnode;
  const vvnode = type(props);
  const node = createNode(vvnode);
  return node;
}

function updateHostComponent(vnode) {
  const { type, props } = vnode;
  const node = document.createElement(type);
  updateNode(node, props);
  reconcileChildren(node, props.children);
  return node;
}

function updateNode(node, nextVal) {
  Object.keys(nextVal)
    .filter(k => k !== "children")
    .forEach(k => (node[k] = nextVal[k]));
}
function updateTextComponent(vnode) {
  const node = document.createTextNode(vnode);
  return node;
}
function reconcileChildren(parentNode, vnode) {
  const children = Array.isArray(vnode) ? vnode : [vnode];
  children.forEach(child => render(child, parentNode));
}
const exported = { render };
export default exported;
