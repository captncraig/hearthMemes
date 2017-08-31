/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "createElement", function() { return h; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "cloneElement", function() { return cloneElement; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Component", function() { return Component; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rerender", function() { return rerender; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "options", function() { return options; });
/** Virtual DOM Node */
function VNode() {}

/** Global options
 *	@public
 *	@namespace options {Object}
 */
var options = {

	/** If `true`, `prop` changes trigger synchronous component updates.
  *	@name syncComponentUpdates
  *	@type Boolean
  *	@default true
  */
	//syncComponentUpdates: true,

	/** Processes all created VNodes.
  *	@param {VNode} vnode	A newly-created VNode to normalize/process
  */
	//vnode(vnode) { }

	/** Hook invoked after a component is mounted. */
	// afterMount(component) { }

	/** Hook invoked after the DOM is updated with a component's latest render. */
	// afterUpdate(component) { }

	/** Hook invoked immediately before a component is unmounted. */
	// beforeUnmount(component) { }
};

var stack = [];

var EMPTY_CHILDREN = [];

/** JSX/hyperscript reviver
*	Benchmarks: https://esbench.com/bench/57ee8f8e330ab09900a1a1a0
 *	@see http://jasonformat.com/wtf-is-jsx
 *	@public
 */
function h(nodeName, attributes) {
	var children = EMPTY_CHILDREN,
	    lastSimple,
	    child,
	    simple,
	    i;
	for (i = arguments.length; i-- > 2;) {
		stack.push(arguments[i]);
	}
	if (attributes && attributes.children != null) {
		if (!stack.length) stack.push(attributes.children);
		delete attributes.children;
	}
	while (stack.length) {
		if ((child = stack.pop()) && child.pop !== undefined) {
			for (i = child.length; i--;) {
				stack.push(child[i]);
			}
		} else {
			if (typeof child === 'boolean') child = null;

			if (simple = typeof nodeName !== 'function') {
				if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
			}

			if (simple && lastSimple) {
				children[children.length - 1] += child;
			} else if (children === EMPTY_CHILDREN) {
				children = [child];
			} else {
				children.push(child);
			}

			lastSimple = simple;
		}
	}

	var p = new VNode();
	p.nodeName = nodeName;
	p.children = children;
	p.attributes = attributes == null ? undefined : attributes;
	p.key = attributes == null ? undefined : attributes.key;

	// if a "vnode hook" is defined, pass every created VNode to it
	if (options.vnode !== undefined) options.vnode(p);

	return p;
}

/** Copy own-properties from `props` onto `obj`.
 *	@returns obj
 *	@private
 */
function extend(obj, props) {
  for (var i in props) {
    obj[i] = props[i];
  }return obj;
}

/** Call a function asynchronously, as soon as possible.
 *	@param {Function} callback
 */
var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

function cloneElement(vnode, props) {
	return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
}

// DOM properties that should NOT have "px" added when numeric
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

/** Managed queue of dirty components to be re-rendered */

var items = [];

function enqueueRender(component) {
	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
		(options.debounceRendering || defer)(rerender);
	}
}

function rerender() {
	var p,
	    list = items;
	items = [];
	while (p = list.pop()) {
		if (p._dirty) renderComponent(p);
	}
}

/** Check if two nodes are equivalent.
 *	@param {Element} node
 *	@param {VNode} vnode
 *	@private
 */
function isSameNodeType(node, vnode, hydrating) {
	if (typeof vnode === 'string' || typeof vnode === 'number') {
		return node.splitText !== undefined;
	}
	if (typeof vnode.nodeName === 'string') {
		return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
	}
	return hydrating || node._componentConstructor === vnode.nodeName;
}

/** Check if an Element has a given normalized name.
*	@param {Element} node
*	@param {String} nodeName
 */
function isNamedNode(node, nodeName) {
	return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

/**
 * Reconstruct Component-style `props` from a VNode.
 * Ensures default/fallback values from `defaultProps`:
 * Own-properties of `defaultProps` not present in `vnode.attributes` are added.
 * @param {VNode} vnode
 * @returns {Object} props
 */
function getNodeProps(vnode) {
	var props = extend({}, vnode.attributes);
	props.children = vnode.children;

	var defaultProps = vnode.nodeName.defaultProps;
	if (defaultProps !== undefined) {
		for (var i in defaultProps) {
			if (props[i] === undefined) {
				props[i] = defaultProps[i];
			}
		}
	}

	return props;
}

/** Create an element with the given nodeName.
 *	@param {String} nodeName
 *	@param {Boolean} [isSvg=false]	If `true`, creates an element within the SVG namespace.
 *	@returns {Element} node
 */
function createNode(nodeName, isSvg) {
	var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
	node.normalizedNodeName = nodeName;
	return node;
}

/** Remove a child node from its parent if attached.
 *	@param {Element} node		The node to remove
 */
function removeNode(node) {
	var parentNode = node.parentNode;
	if (parentNode) parentNode.removeChild(node);
}

/** Set a named attribute on the given Node, with special behavior for some names and event handlers.
 *	If `value` is `null`, the attribute/handler will be removed.
 *	@param {Element} node	An element to mutate
 *	@param {string} name	The name/key to set, such as an event or attribute name
 *	@param {any} old	The last value that was set for this name/node pair
 *	@param {any} value	An attribute value, such as a function to be used as an event handler
 *	@param {Boolean} isSvg	Are we currently diffing inside an svg?
 *	@private
 */
function setAccessor(node, name, old, value, isSvg) {
	if (name === 'className') name = 'class';

	if (name === 'key') {
		// ignore
	} else if (name === 'ref') {
		if (old) old(null);
		if (value) value(node);
	} else if (name === 'class' && !isSvg) {
		node.className = value || '';
	} else if (name === 'style') {
		if (!value || typeof value === 'string' || typeof old === 'string') {
			node.style.cssText = value || '';
		}
		if (value && typeof value === 'object') {
			if (typeof old !== 'string') {
				for (var i in old) {
					if (!(i in value)) node.style[i] = '';
				}
			}
			for (var i in value) {
				node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
			}
		}
	} else if (name === 'dangerouslySetInnerHTML') {
		if (value) node.innerHTML = value.__html || '';
	} else if (name[0] == 'o' && name[1] == 'n') {
		var useCapture = name !== (name = name.replace(/Capture$/, ''));
		name = name.toLowerCase().substring(2);
		if (value) {
			if (!old) node.addEventListener(name, eventProxy, useCapture);
		} else {
			node.removeEventListener(name, eventProxy, useCapture);
		}
		(node._listeners || (node._listeners = {}))[name] = value;
	} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
		setProperty(node, name, value == null ? '' : value);
		if (value == null || value === false) node.removeAttribute(name);
	} else {
		var ns = isSvg && name !== (name = name.replace(/^xlink\:?/, ''));
		if (value == null || value === false) {
			if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
		} else if (typeof value !== 'function') {
			if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
		}
	}
}

/** Attempt to set a DOM property to the given value.
 *	IE & FF throw for certain property-value combinations.
 */
function setProperty(node, name, value) {
	try {
		node[name] = value;
	} catch (e) {}
}

/** Proxy an event to hooked event handlers
 *	@private
 */
function eventProxy(e) {
	return this._listeners[e.type](options.event && options.event(e) || e);
}

/** Queue of components that have been mounted and are awaiting componentDidMount */
var mounts = [];

/** Diff recursion count, used to track the end of the diff cycle. */
var diffLevel = 0;

/** Global flag indicating if the diff is currently within an SVG */
var isSvgMode = false;

/** Global flag indicating if the diff is performing hydration */
var hydrating = false;

/** Invoke queued componentDidMount lifecycle methods */
function flushMounts() {
	var c;
	while (c = mounts.pop()) {
		if (options.afterMount) options.afterMount(c);
		if (c.componentDidMount) c.componentDidMount();
	}
}

/** Apply differences in a given vnode (and it's deep children) to a real DOM Node.
 *	@param {Element} [dom=null]		A DOM node to mutate into the shape of the `vnode`
 *	@param {VNode} vnode			A VNode (with descendants forming a tree) representing the desired DOM structure
 *	@returns {Element} dom			The created/mutated element
 *	@private
 */
function diff(dom, vnode, context, mountAll, parent, componentRoot) {
	// diffLevel having been 0 here indicates initial entry into the diff (not a subdiff)
	if (!diffLevel++) {
		// when first starting the diff, check if we're diffing an SVG or within an SVG
		isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

		// hydration is indicated by the existing element to be diffed not having a prop cache
		hydrating = dom != null && !('__preactattr_' in dom);
	}

	var ret = idiff(dom, vnode, context, mountAll, componentRoot);

	// append the element if its a new parent
	if (parent && ret.parentNode !== parent) parent.appendChild(ret);

	// diffLevel being reduced to 0 means we're exiting the diff
	if (! --diffLevel) {
		hydrating = false;
		// invoke queued componentDidMount lifecycle methods
		if (!componentRoot) flushMounts();
	}

	return ret;
}

/** Internals of `diff()`, separated to allow bypassing diffLevel / mount flushing. */
function idiff(dom, vnode, context, mountAll, componentRoot) {
	var out = dom,
	    prevSvgMode = isSvgMode;

	// empty values (null, undefined, booleans) render as empty Text nodes
	if (vnode == null || typeof vnode === 'boolean') vnode = '';

	// Fast case: Strings & Numbers create/update Text nodes.
	if (typeof vnode === 'string' || typeof vnode === 'number') {

		// update if it's already a Text node:
		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
			/* istanbul ignore if */ /* Browser quirk that can't be covered: https://github.com/developit/preact/commit/fd4f21f5c45dfd75151bd27b4c217d8003aa5eb9 */
			if (dom.nodeValue != vnode) {
				dom.nodeValue = vnode;
			}
		} else {
			// it wasn't a Text node: replace it with one and recycle the old Element
			out = document.createTextNode(vnode);
			if (dom) {
				if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
				recollectNodeTree(dom, true);
			}
		}

		out['__preactattr_'] = true;

		return out;
	}

	// If the VNode represents a Component, perform a component diff:
	var vnodeName = vnode.nodeName;
	if (typeof vnodeName === 'function') {
		return buildComponentFromVNode(dom, vnode, context, mountAll);
	}

	// Tracks entering and exiting SVG namespace when descending through the tree.
	isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

	// If there's no existing element or it's the wrong type, create a new one:
	vnodeName = String(vnodeName);
	if (!dom || !isNamedNode(dom, vnodeName)) {
		out = createNode(vnodeName, isSvgMode);

		if (dom) {
			// move children into the replacement node
			while (dom.firstChild) {
				out.appendChild(dom.firstChild);
			} // if the previous Element was mounted into the DOM, replace it inline
			if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

			// recycle the old element (skips non-Element node types)
			recollectNodeTree(dom, true);
		}
	}

	var fc = out.firstChild,
	    props = out['__preactattr_'],
	    vchildren = vnode.children;

	if (props == null) {
		props = out['__preactattr_'] = {};
		for (var a = out.attributes, i = a.length; i--;) {
			props[a[i].name] = a[i].value;
		}
	}

	// Optimization: fast-path for elements containing a single TextNode:
	if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
		if (fc.nodeValue != vchildren[0]) {
			fc.nodeValue = vchildren[0];
		}
	}
	// otherwise, if there are existing or new children, diff them:
	else if (vchildren && vchildren.length || fc != null) {
			innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
		}

	// Apply attributes/props from VNode to the DOM Element:
	diffAttributes(out, vnode.attributes, props);

	// restore previous SVG mode: (in case we're exiting an SVG namespace)
	isSvgMode = prevSvgMode;

	return out;
}

/** Apply child and attribute changes between a VNode and a DOM Node to the DOM.
 *	@param {Element} dom			Element whose children should be compared & mutated
 *	@param {Array} vchildren		Array of VNodes to compare to `dom.childNodes`
 *	@param {Object} context			Implicitly descendant context object (from most recent `getChildContext()`)
 *	@param {Boolean} mountAll
 *	@param {Boolean} isHydrating	If `true`, consumes externally created elements similar to hydration
 */
function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
	var originalChildren = dom.childNodes,
	    children = [],
	    keyed = {},
	    keyedLen = 0,
	    min = 0,
	    len = originalChildren.length,
	    childrenLen = 0,
	    vlen = vchildren ? vchildren.length : 0,
	    j,
	    c,
	    f,
	    vchild,
	    child;

	// Build up a map of keyed children and an Array of unkeyed children:
	if (len !== 0) {
		for (var i = 0; i < len; i++) {
			var _child = originalChildren[i],
			    props = _child['__preactattr_'],
			    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
			if (key != null) {
				keyedLen++;
				keyed[key] = _child;
			} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
				children[childrenLen++] = _child;
			}
		}
	}

	if (vlen !== 0) {
		for (var i = 0; i < vlen; i++) {
			vchild = vchildren[i];
			child = null;

			// attempt to find a node based on key matching
			var key = vchild.key;
			if (key != null) {
				if (keyedLen && keyed[key] !== undefined) {
					child = keyed[key];
					keyed[key] = undefined;
					keyedLen--;
				}
			}
			// attempt to pluck a node of the same type from the existing children
			else if (!child && min < childrenLen) {
					for (j = min; j < childrenLen; j++) {
						if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
							child = c;
							children[j] = undefined;
							if (j === childrenLen - 1) childrenLen--;
							if (j === min) min++;
							break;
						}
					}
				}

			// morph the matched/found/created DOM child to match vchild (deep)
			child = idiff(child, vchild, context, mountAll);

			f = originalChildren[i];
			if (child && child !== dom && child !== f) {
				if (f == null) {
					dom.appendChild(child);
				} else if (child === f.nextSibling) {
					removeNode(f);
				} else {
					dom.insertBefore(child, f);
				}
			}
		}
	}

	// remove unused keyed children:
	if (keyedLen) {
		for (var i in keyed) {
			if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
		}
	}

	// remove orphaned unkeyed children:
	while (min <= childrenLen) {
		if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
	}
}

/** Recursively recycle (or just unmount) a node and its descendants.
 *	@param {Node} node						DOM node to start unmount/removal from
 *	@param {Boolean} [unmountOnly=false]	If `true`, only triggers unmount lifecycle, skips removal
 */
function recollectNodeTree(node, unmountOnly) {
	var component = node._component;
	if (component) {
		// if node is owned by a Component, unmount that component (ends up recursing back here)
		unmountComponent(component);
	} else {
		// If the node's VNode had a ref function, invoke it with null here.
		// (this is part of the React spec, and smart for unsetting references)
		if (node['__preactattr_'] != null && node['__preactattr_'].ref) node['__preactattr_'].ref(null);

		if (unmountOnly === false || node['__preactattr_'] == null) {
			removeNode(node);
		}

		removeChildren(node);
	}
}

/** Recollect/unmount all children.
 *	- we use .lastChild here because it causes less reflow than .firstChild
 *	- it's also cheaper than accessing the .childNodes Live NodeList
 */
function removeChildren(node) {
	node = node.lastChild;
	while (node) {
		var next = node.previousSibling;
		recollectNodeTree(node, true);
		node = next;
	}
}

/** Apply differences in attributes from a VNode to the given DOM Element.
 *	@param {Element} dom		Element with attributes to diff `attrs` against
 *	@param {Object} attrs		The desired end-state key-value attribute pairs
 *	@param {Object} old			Current/previous attributes (from previous VNode or element's prop cache)
 */
function diffAttributes(dom, attrs, old) {
	var name;

	// remove attributes no longer present on the vnode by setting them to undefined
	for (name in old) {
		if (!(attrs && attrs[name] != null) && old[name] != null) {
			setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
		}
	}

	// add new & update changed attributes
	for (name in attrs) {
		if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
			setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
		}
	}
}

/** Retains a pool of Components for re-use, keyed on component name.
 *	Note: since component names are not unique or even necessarily available, these are primarily a form of sharding.
 *	@private
 */
var components = {};

/** Reclaim a component for later re-use by the recycler. */
function collectComponent(component) {
	var name = component.constructor.name;
	(components[name] || (components[name] = [])).push(component);
}

/** Create a component. Normalizes differences between PFC's and classful Components. */
function createComponent(Ctor, props, context) {
	var list = components[Ctor.name],
	    inst;

	if (Ctor.prototype && Ctor.prototype.render) {
		inst = new Ctor(props, context);
		Component.call(inst, props, context);
	} else {
		inst = new Component(props, context);
		inst.constructor = Ctor;
		inst.render = doRender;
	}

	if (list) {
		for (var i = list.length; i--;) {
			if (list[i].constructor === Ctor) {
				inst.nextBase = list[i].nextBase;
				list.splice(i, 1);
				break;
			}
		}
	}
	return inst;
}

/** The `.render()` method for a PFC backing instance. */
function doRender(props, state, context) {
	return this.constructor(props, context);
}

/** Set a component's `props` (generally derived from JSX attributes).
 *	@param {Object} props
 *	@param {Object} [opts]
 *	@param {boolean} [opts.renderSync=false]	If `true` and {@link options.syncComponentUpdates} is `true`, triggers synchronous rendering.
 *	@param {boolean} [opts.render=true]			If `false`, no render will be triggered.
 */
function setComponentProps(component, props, opts, context, mountAll) {
	if (component._disable) return;
	component._disable = true;

	if (component.__ref = props.ref) delete props.ref;
	if (component.__key = props.key) delete props.key;

	if (!component.base || mountAll) {
		if (component.componentWillMount) component.componentWillMount();
	} else if (component.componentWillReceiveProps) {
		component.componentWillReceiveProps(props, context);
	}

	if (context && context !== component.context) {
		if (!component.prevContext) component.prevContext = component.context;
		component.context = context;
	}

	if (!component.prevProps) component.prevProps = component.props;
	component.props = props;

	component._disable = false;

	if (opts !== 0) {
		if (opts === 1 || options.syncComponentUpdates !== false || !component.base) {
			renderComponent(component, 1, mountAll);
		} else {
			enqueueRender(component);
		}
	}

	if (component.__ref) component.__ref(component);
}

/** Render a Component, triggering necessary lifecycle events and taking High-Order Components into account.
 *	@param {Component} component
 *	@param {Object} [opts]
 *	@param {boolean} [opts.build=false]		If `true`, component will build and store a DOM node if not already associated with one.
 *	@private
 */
function renderComponent(component, opts, mountAll, isChild) {
	if (component._disable) return;

	var props = component.props,
	    state = component.state,
	    context = component.context,
	    previousProps = component.prevProps || props,
	    previousState = component.prevState || state,
	    previousContext = component.prevContext || context,
	    isUpdate = component.base,
	    nextBase = component.nextBase,
	    initialBase = isUpdate || nextBase,
	    initialChildComponent = component._component,
	    skip = false,
	    rendered,
	    inst,
	    cbase;

	// if updating
	if (isUpdate) {
		component.props = previousProps;
		component.state = previousState;
		component.context = previousContext;
		if (opts !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
			skip = true;
		} else if (component.componentWillUpdate) {
			component.componentWillUpdate(props, state, context);
		}
		component.props = props;
		component.state = state;
		component.context = context;
	}

	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
	component._dirty = false;

	if (!skip) {
		rendered = component.render(props, state, context);

		// context to pass to the child, can be updated via (grand-)parent component
		if (component.getChildContext) {
			context = extend(extend({}, context), component.getChildContext());
		}

		var childComponent = rendered && rendered.nodeName,
		    toUnmount,
		    base;

		if (typeof childComponent === 'function') {
			// set up high order component link

			var childProps = getNodeProps(rendered);
			inst = initialChildComponent;

			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
				setComponentProps(inst, childProps, 1, context, false);
			} else {
				toUnmount = inst;

				component._component = inst = createComponent(childComponent, childProps, context);
				inst.nextBase = inst.nextBase || nextBase;
				inst._parentComponent = component;
				setComponentProps(inst, childProps, 0, context, false);
				renderComponent(inst, 1, mountAll, true);
			}

			base = inst.base;
		} else {
			cbase = initialBase;

			// destroy high order component link
			toUnmount = initialChildComponent;
			if (toUnmount) {
				cbase = component._component = null;
			}

			if (initialBase || opts === 1) {
				if (cbase) cbase._component = null;
				base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
			}
		}

		if (initialBase && base !== initialBase && inst !== initialChildComponent) {
			var baseParent = initialBase.parentNode;
			if (baseParent && base !== baseParent) {
				baseParent.replaceChild(base, initialBase);

				if (!toUnmount) {
					initialBase._component = null;
					recollectNodeTree(initialBase, false);
				}
			}
		}

		if (toUnmount) {
			unmountComponent(toUnmount);
		}

		component.base = base;
		if (base && !isChild) {
			var componentRef = component,
			    t = component;
			while (t = t._parentComponent) {
				(componentRef = t).base = base;
			}
			base._component = componentRef;
			base._componentConstructor = componentRef.constructor;
		}
	}

	if (!isUpdate || mountAll) {
		mounts.unshift(component);
	} else if (!skip) {
		// Ensure that pending componentDidMount() hooks of child components
		// are called before the componentDidUpdate() hook in the parent.
		// Note: disabled as it causes duplicate hooks, see https://github.com/developit/preact/issues/750
		// flushMounts();

		if (component.componentDidUpdate) {
			component.componentDidUpdate(previousProps, previousState, previousContext);
		}
		if (options.afterUpdate) options.afterUpdate(component);
	}

	if (component._renderCallbacks != null) {
		while (component._renderCallbacks.length) {
			component._renderCallbacks.pop().call(component);
		}
	}

	if (!diffLevel && !isChild) flushMounts();
}

/** Apply the Component referenced by a VNode to the DOM.
 *	@param {Element} dom	The DOM node to mutate
 *	@param {VNode} vnode	A Component-referencing VNode
 *	@returns {Element} dom	The created/mutated element
 *	@private
 */
function buildComponentFromVNode(dom, vnode, context, mountAll) {
	var c = dom && dom._component,
	    originalComponent = c,
	    oldDom = dom,
	    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
	    isOwner = isDirectOwner,
	    props = getNodeProps(vnode);
	while (c && !isOwner && (c = c._parentComponent)) {
		isOwner = c.constructor === vnode.nodeName;
	}

	if (c && isOwner && (!mountAll || c._component)) {
		setComponentProps(c, props, 3, context, mountAll);
		dom = c.base;
	} else {
		if (originalComponent && !isDirectOwner) {
			unmountComponent(originalComponent);
			dom = oldDom = null;
		}

		c = createComponent(vnode.nodeName, props, context);
		if (dom && !c.nextBase) {
			c.nextBase = dom;
			// passing dom/oldDom as nextBase will recycle it if unused, so bypass recycling on L229:
			oldDom = null;
		}
		setComponentProps(c, props, 1, context, mountAll);
		dom = c.base;

		if (oldDom && dom !== oldDom) {
			oldDom._component = null;
			recollectNodeTree(oldDom, false);
		}
	}

	return dom;
}

/** Remove a component from the DOM and recycle it.
 *	@param {Component} component	The Component instance to unmount
 *	@private
 */
function unmountComponent(component) {
	if (options.beforeUnmount) options.beforeUnmount(component);

	var base = component.base;

	component._disable = true;

	if (component.componentWillUnmount) component.componentWillUnmount();

	component.base = null;

	// recursively tear down & recollect high-order component children:
	var inner = component._component;
	if (inner) {
		unmountComponent(inner);
	} else if (base) {
		if (base['__preactattr_'] && base['__preactattr_'].ref) base['__preactattr_'].ref(null);

		component.nextBase = base;

		removeNode(base);
		collectComponent(component);

		removeChildren(base);
	}

	if (component.__ref) component.__ref(null);
}

/** Base Component class.
 *	Provides `setState()` and `forceUpdate()`, which trigger rendering.
 *	@public
 *
 *	@example
 *	class MyFoo extends Component {
 *		render(props, state) {
 *			return <div />;
 *		}
 *	}
 */
function Component(props, context) {
	this._dirty = true;

	/** @public
  *	@type {object}
  */
	this.context = context;

	/** @public
  *	@type {object}
  */
	this.props = props;

	/** @public
  *	@type {object}
  */
	this.state = this.state || {};
}

extend(Component.prototype, {

	/** Returns a `boolean` indicating if the component should re-render when receiving the given `props` and `state`.
  *	@param {object} nextProps
  *	@param {object} nextState
  *	@param {object} nextContext
  *	@returns {Boolean} should the component re-render
  *	@name shouldComponentUpdate
  *	@function
  */

	/** Update component state by copying properties from `state` to `this.state`.
  *	@param {object} state		A hash of state properties to update with new values
  *	@param {function} callback	A function to be called once component state is updated
  */
	setState: function setState(state, callback) {
		var s = this.state;
		if (!this.prevState) this.prevState = extend({}, s);
		extend(s, typeof state === 'function' ? state(s, this.props) : state);
		if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
		enqueueRender(this);
	},


	/** Immediately perform a synchronous re-render of the component.
  *	@param {function} callback		A function to be called after component is re-rendered.
  *	@private
  */
	forceUpdate: function forceUpdate(callback) {
		if (callback) (this._renderCallbacks = this._renderCallbacks || []).push(callback);
		renderComponent(this, 2);
	},


	/** Accepts `props` and `state`, and returns a new Virtual DOM tree to build.
  *	Virtual DOM is generally constructed via [JSX](http://jasonformat.com/wtf-is-jsx).
  *	@param {object} props		Props (eg: JSX attributes) received from parent element/component
  *	@param {object} state		The component's current state
  *	@param {object} context		Context object (if a parent component has provided context)
  *	@returns VNode
  */
	render: function render() {}
});

/** Render JSX into a `parent` Element.
 *	@param {VNode} vnode		A (JSX) VNode to render
 *	@param {Element} parent		DOM element to render into
 *	@param {Element} [merge]	Attempt to re-use an existing DOM tree rooted at `merge`
 *	@public
 *
 *	@example
 *	// render a div into <body>:
 *	render(<div id="hello">hello!</div>, document.body);
 *
 *	@example
 *	// render a "Thing" component into #foo:
 *	const Thing = ({ name }) => <span>{ name }</span>;
 *	render(<Thing name="one" />, document.querySelector('#foo'));
 */
function render(vnode, parent, merge) {
  return diff(merge, vnode, {}, false, parent, false);
}

var preact = {
	h: h,
	createElement: h,
	cloneElement: cloneElement,
	Component: Component,
	render: render,
	rerender: rerender,
	options: options
};


/* harmony default export */ __webpack_exports__["default"] = (preact);
//# sourceMappingURL=preact.esm.js.map


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(2);


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = __webpack_require__(0);
var browse_1 = __webpack_require__(3);
var preact_router_1 = __webpack_require__(7);
var Home = /** @class */ (function (_super) {
    __extends(Home, _super);
    function Home() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Home.prototype.render = function (props) {
        return preact_1.h("p", null,
            "Hello ",
            props.name,
            " ",
            props.id,
            "!");
    };
    return Home;
}(preact_1.Component));
exports.default = Home;
preact_1.render(preact_1.h(preact_router_1.default, null,
    preact_1.h(Home, { name: "World", path: "/" }),
    preact_1.h(browse_1.default, { path: "/browse" })), document.querySelector('#app'));


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var preact_1 = __webpack_require__(0);
var cards_1 = __webpack_require__(4);
var howler_1 = __webpack_require__(5);
var linkstate_1 = __webpack_require__(8);
var howlCache = [];
var Browse = /** @class */ (function (_super) {
    __extends(Browse, _super);
    function Browse() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.perPage = 12;
        _this.state = {
            page: 0,
            filter: "",
        };
        _this.prevPage = function () {
            _this.setState({ page: _this.state.page - 1 });
        };
        _this.nextPage = function () {
            _this.setState({ page: _this.state.page + 1 });
        };
        _this.playSound = function (c, e) {
            var file = e.shiftKey ? c.attack_sound : c.play_sound;
            var howl = howlCache[file];
            if (!howl) {
                howl = new howler_1.Howl({ src: [file] });
                howlCache[file] = howl;
            }
            howl.play();
        };
        return _this;
    }
    Browse.prototype.cardBg = function (c) {
        return {
            backgroundImage: "url(" + c.image + ")"
        };
    };
    Browse.prototype.render = function (props, state) {
        var _this = this;
        var filteredCards = cards_1.cards;
        if (state.filter) {
            filteredCards = filteredCards.filter(function (c) { return c.name.match(state.filter); });
        }
        var start = state.page * this.perPage;
        var pageCards = filteredCards.slice(start, start + this.perPage);
        var numPages = Math.ceil(filteredCards.length / this.perPage);
        return preact_1.h("div", { className: 'container' },
            preact_1.h("div", { class: 'flex-ver' },
                preact_1.h("div", { class: 'flex-hor' },
                    preact_1.h("input", { value: state.filter, onInput: linkstate_1.default(this, 'filter') })),
                preact_1.h("div", { class: 'flex-hor' },
                    preact_1.h("button", { className: 'btn btn-default', onClick: this.prevPage }, "prev"),
                    state.page + 1,
                    "/",
                    numPages,
                    preact_1.h("button", { className: 'btn btn-default', onClick: this.nextPage }, "next")),
                preact_1.h("div", { class: 'flex-hor' }, pageCards.map(function (c) {
                    return preact_1.h("div", { className: "card-image", onClick: _this.playSound.bind(_this, c), style: _this.cardBg(c) });
                }))));
    };
    return Browse;
}(preact_1.Component));
exports.default = Browse;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
function getCard(name) {
    for (var _i = 0, cards_1 = exports.cards; _i < cards_1.length; _i++) {
        var card = cards_1[_i];
        if (card.name == name) {
            return card;
        }
    }
    return null;
}
exports.getCard = getCard;
exports.cards = [
    {
        "card_id": "CFM_648t",
        "set": "GANGS",
        "name": "\"Little Friend\"",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_CFM_648t_Male_Ogre_Play_02.ogg",
        "attack_sound": "files/VO_CFM_648t_Male_Ogre_Attack_01.ogg",
        "image": "files/CFM_648t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_648t_premium.gif"
    },
    {
        "card_id": "ICCA01_010",
        "set": "ICECROWN",
        "name": "A. F. Kay",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_ICCA01_010_Female_Human_Play_01.ogg",
        "attack_sound": "files/VO_ICCA01_010_Female_Human_Attack_02.ogg",
        "image": "files/ICCA01_010.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/ICCA01_010.png"
    },
    {
        "card_id": "OG_150",
        "set": "OG",
        "name": "Aberrant Berserker",
        "collectible": true,
        "flavor_text": "I berserk, therefore I am.",
        "play_sound": "files/VO_OG_150_Male_Troll_Play_01.ogg",
        "attack_sound": "files/VO_OG_150_Male_Troll_Attack_01.ogg",
        "image": "files/OG_150.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_150_premium.gif"
    },
    {
        "card_id": "BRMA15_4",
        "set": "BRM",
        "name": "Aberration",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BRMA_15_4_Aberration_Attack_1.ogg",
        "attack_sound": "files/BRMA_15_4_Aberration_Attack_1.ogg",
        "image": "files/BRMA15_4.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA15_4.png"
    },
    {
        "card_id": "EX1_097",
        "set": "CLASSIC",
        "name": "Abomination",
        "collectible": true,
        "flavor_text": "Abominations enjoy Fresh Meat and long walks on the beach.",
        "play_sound": "files/VO_EX1_097_Play_01.ogg",
        "attack_sound": "files/VO_EX1_097_Attack_02.ogg",
        "image": "files/EX1_097.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_097_premium.gif"
    },
    {
        "card_id": "CS2_188",
        "set": "CLASSIC",
        "name": "Abusive Sergeant",
        "collectible": true,
        "flavor_text": "ADD ME TO YOUR DECK, MAGGOT!",
        "play_sound": "files/VO_CS2_188_Play_01.ogg",
        "attack_sound": "files/VO_CS2_188_Attack_02.ogg",
        "image": "files/CS2_188.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_188_premium.gif"
    },
    {
        "card_id": "KARA_00_02a",
        "set": "KARA",
        "name": "Abyssal",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/Infernal_KARA_00_02a_Play.ogg",
        "attack_sound": "files/Infernal_KARA_00_02a_Attack.ogg",
        "image": "files/KARA_00_02a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KARA_00_02a.png"
    },
    {
        "card_id": "CFM_751",
        "set": "GANGS",
        "name": "Abyssal Enforcer",
        "collectible": true,
        "flavor_text": "The Kabal print this on every package of illicit Mana Crystals: WARNING - DO NOT PUT WITHIN REACH OF ABYSSALS. THIS IS NOT APPROVED FOR USE BY FLAMING DEMONS OF ANY KIND.",
        "play_sound": "files/AbyssalEnforcer_CFM_751_Play.ogg",
        "attack_sound": "files/AbyssalEnforcer_CFM_751_Attack.ogg",
        "image": "files/CFM_751.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_751_premium.gif"
    },
    {
        "card_id": "ICC_092",
        "set": "ICECROWN",
        "name": "Acherus Veteran",
        "collectible": true,
        "flavor_text": "This is my Runeblade. There are many like it but this one is mine.",
        "play_sound": "files/VO_ICC_092_Female_BloodElf_Play_01.ogg",
        "attack_sound": "files/VO_ICC_092_Female_BloodElf_Attack_02.ogg",
        "image": "files/ICC_092.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_092_premium.gif"
    },
    {
        "card_id": "EX1_066",
        "set": "BASIC",
        "name": "Acidic Swamp Ooze",
        "collectible": true,
        "flavor_text": "Oozes love Flamenco.  Don't ask.",
        "play_sound": "files/EX1_066_AcidicSwampOoze_EnterPlay.ogg",
        "attack_sound": "files/EX1_066_AcidicSwampOoze_Attack.ogg",
        "image": "files/EX1_066.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_066_premium.gif"
    },
    {
        "card_id": "AT_063",
        "set": "TGT",
        "name": "Acidmaw",
        "collectible": true,
        "flavor_text": "With the help of his trusty sidekick Dreadscale, the giant jormungar Acidmaw is ready to face any knight!",
        "play_sound": "files/SFX_AT_063_Play.ogg",
        "attack_sound": "files/SFX_AT_063_Attack.ogg",
        "image": "files/AT_063.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_063_premium.gif"
    },
    {
        "card_id": "ICC_212",
        "set": "ICECROWN",
        "name": "Acolyte of Agony",
        "collectible": true,
        "flavor_text": "It takes many years of practiced study in order to fully master agony.",
        "play_sound": "files/VO_ICC_212_Male_Undead_Play_01.ogg",
        "attack_sound": "files/VO_ICC_212_Male_Undead_Attack_03.ogg",
        "image": "files/ICC_212.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_212_premium.gif"
    },
    {
        "card_id": "EX1_007",
        "set": "CLASSIC",
        "name": "Acolyte of Pain",
        "collectible": true,
        "flavor_text": "He trained when he was younger to be an acolyte of joy, but things didn’t work out like he thought they would.",
        "play_sound": "files/VO_EX1_007_Play_01.ogg",
        "attack_sound": "files/VO_EX1_007_Attack_02.ogg",
        "image": "files/EX1_007.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_007_premium.gif"
    },
    {
        "card_id": "OG_313",
        "set": "OG",
        "name": "Addled Grizzly",
        "collectible": true,
        "flavor_text": "Druids who spend too long in bear form are more susceptible to the whispers of the Old Gods.  Right now they are whispering the lyrics to \"La Bamba\".",
        "play_sound": "files/VO_OG_313_Female_Bear_Play_01.ogg",
        "attack_sound": "files/VO_OG_313_Female_Bear_Attack_01.ogg",
        "image": "files/OG_313.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_313_premium.gif"
    },
    {
        "card_id": "UNG_019",
        "set": "UNGORO",
        "name": "Air Elemental",
        "collectible": true,
        "flavor_text": "Makes a mean puff pastry.",
        "play_sound": "files/UNG_019_AirElemental_Play.ogg",
        "attack_sound": "files/UNG_019_AirElemental_Attack.ogg",
        "image": "files/UNG_019.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_019_premium.gif"
    },
    {
        "card_id": "NEW1_010",
        "set": "CLASSIC",
        "name": "Al'Akir the Windlord",
        "collectible": true,
        "flavor_text": "He is the weakest of the four Elemental Lords.  And the other three don't let him forget it.",
        "play_sound": "files/VO_NEW1_010_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_010_Attack_02.ogg",
        "image": "files/NEW1_010.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_010_premium.gif"
    },
    {
        "card_id": "EX1_006",
        "set": "CLASSIC",
        "name": "Alarm-o-Bot",
        "collectible": true,
        "flavor_text": "WARNING.  WARNING.  WARNING.",
        "play_sound": "files/EX1_006_AlarmOBot_EnterPlay1.ogg",
        "attack_sound": "files/EX1_006_AlarmOBot_Attack1.ogg",
        "image": "files/EX1_006.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_006_premium.gif"
    },
    {
        "card_id": "EX1_382",
        "set": "CLASSIC",
        "name": "Aldor Peacekeeper",
        "collectible": true,
        "flavor_text": "The Aldor hate two things: the Scryers and smooth jazz.",
        "play_sound": "files/VO_EX1_382_Play_01.ogg",
        "attack_sound": "files/VO_EX1_382_Attack_02.ogg",
        "image": "files/EX1_382.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_382_premium.gif"
    },
    {
        "card_id": "EX1_561",
        "set": "CLASSIC",
        "name": "Alexstrasza",
        "collectible": true,
        "flavor_text": "Alexstrasza the Life-Binder brings life and hope to everyone.  Except Deathwing.  And Malygos.  And Nekros.",
        "play_sound": "files/VO_EX1_561_Play_01.ogg",
        "attack_sound": "files/VO_EX1_561_Attack_02.ogg",
        "image": "files/EX1_561.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_561_premium.gif"
    },
    {
        "card_id": "AT_071",
        "set": "TGT",
        "name": "Alexstrasza's Champion",
        "collectible": true,
        "flavor_text": "\"Put more spikes on her.  No, more spikes.  What part of 'more spikes' do you not understand?  MORE SPIKES!\" - Alexstrasza",
        "play_sound": "files/VO_AT_071_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_071_ATTACK_02.ogg",
        "image": "files/AT_071.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_071_premium.gif"
    },
    {
        "card_id": "CFM_756",
        "set": "GANGS",
        "name": "Alley Armorsmith",
        "collectible": true,
        "flavor_text": "The rent is cheap and she passes the savings onto YOU!",
        "play_sound": "files/VO_CFM_756_Female_Orc_Play_01.ogg",
        "attack_sound": "files/VO_CFM_756_Female_Orc_Attack_01.ogg",
        "image": "files/CFM_756.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_756_premium.gif"
    },
    {
        "card_id": "CFM_315",
        "set": "GANGS",
        "name": "Alleycat",
        "collectible": true,
        "flavor_text": "To be a cool cat in Gadgetzan, you gotta have bling.",
        "play_sound": "files/GoldTuskCub_CFM_315_Play.ogg",
        "attack_sound": "files/GoldTuskCub_CFM_315_Attack.ogg",
        "image": "files/CFM_315.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_315_premium.gif"
    },
    {
        "card_id": "OG_248",
        "set": "OG",
        "name": "Am'gam Rager",
        "collectible": true,
        "flavor_text": "peerc rewop",
        "play_sound": "files/OG_248_AmgamRager_Play.ogg",
        "attack_sound": "files/OG_248_AmgamRager_Attack.ogg",
        "image": "files/OG_248.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_248_premium.gif"
    },
    {
        "card_id": "EX1_393",
        "set": "CLASSIC",
        "name": "Amani Berserker",
        "collectible": true,
        "flavor_text": "If an Amani berserker asks \"Joo lookin' at me?!\", the correct response is \"Nah, mon\".",
        "play_sound": "files/VO_EX1_393_Play_01.ogg",
        "attack_sound": "files/VO_EX1_393_Attack_02.ogg",
        "image": "files/EX1_393.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_393_premium.gif"
    },
    {
        "card_id": "UNG_940t8",
        "set": "UNGORO",
        "name": "Amara, Warden of Hope",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_UNG_940t8_Female_Titan_Play_01.ogg",
        "attack_sound": "files/VO_UNG_940t8_Female_Titan_Attack_01.ogg",
        "image": "files/UNG_940t8.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_940t8_premium.gif"
    },
    {
        "card_id": "EX1_057",
        "set": "CLASSIC",
        "name": "Ancient Brewmaster",
        "collectible": true,
        "flavor_text": "Most pandaren say his brew tastes like yak.  But apparently that's a compliment.",
        "play_sound": "files/VO_EX1_057_Play_01.ogg",
        "attack_sound": "files/VO_EX1_057_Attack_02.ogg",
        "image": "files/EX1_057.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_057_premium.gif"
    },
    {
        "card_id": "OG_290",
        "set": "OG",
        "name": "Ancient Harbinger",
        "collectible": true,
        "flavor_text": "\"honey, can u run down to the store and pick up some 10 cost minions? thx\"",
        "play_sound": "files/VO_OG_290_Female_Night Elf_Play_01.ogg",
        "attack_sound": "files/VO_OG_290_Female_Night Elf_Attack_01.ogg",
        "image": "files/OG_290.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_290_premium.gif"
    },
    {
        "card_id": "EX1_584",
        "set": "CLASSIC",
        "name": "Ancient Mage",
        "collectible": true,
        "flavor_text": "Sometimes he forgets and just wanders into someone else's game.",
        "play_sound": "files/VO_EX1_584_Play_01.ogg",
        "attack_sound": "files/VO_EX1_584_Attack_02.ogg",
        "image": "files/EX1_584.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_584_premium.gif"
    },
    {
        "card_id": "LOE_110",
        "set": "LOE",
        "name": "Ancient Shade",
        "collectible": true,
        "flavor_text": "Warning: Do not expose to direct sunlight.",
        "play_sound": "files/VO_LOE_110_Play_01.ogg",
        "attack_sound": "files/VO_LOE_110_Attack_02.ogg",
        "image": "files/LOE_110.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_110_premium.gif"
    },
    {
        "card_id": "OG_301",
        "set": "OG",
        "name": "Ancient Shieldbearer",
        "collectible": true,
        "flavor_text": "Back in her day, each shield weighed two tons and she had to carry four of them on each arm!",
        "play_sound": "files/VO_OG_301_Female_Dwarf_Play_01.ogg",
        "attack_sound": "files/VO_OG_301_Female_Dwarf_Attack_01.ogg",
        "image": "files/OG_301.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_301_premium.gif"
    },
    {
        "card_id": "EX1_045",
        "set": "CLASSIC",
        "name": "Ancient Watcher",
        "collectible": true,
        "flavor_text": "Why do its eyes seem to follow you as you walk by?",
        "play_sound": "files/SFX_EX1_045_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_045_Attack.ogg",
        "image": "files/EX1_045.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_045_premium.gif"
    },
    {
        "card_id": "NEW1_008",
        "set": "CLASSIC",
        "name": "Ancient of Lore",
        "collectible": true,
        "flavor_text": "Go ahead, carve your initials in him.",
        "play_sound": "files/NEW1_008_AncientOfLore_EnterPlay.ogg",
        "attack_sound": "files/NEW1_008_AncientOfLore_Attack.ogg",
        "image": "files/NEW1_008.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_008_premium.gif"
    },
    {
        "card_id": "EX1_178",
        "set": "CLASSIC",
        "name": "Ancient of War",
        "collectible": true,
        "flavor_text": "Young Night Elves love to play \"Who can get the Ancient of War to Uproot?\"  You lose if you get crushed to death.",
        "play_sound": "files/EX1_178_Ancient_Of_War_EnterPlay1.ogg",
        "attack_sound": "files/EX1_178_Ancient_Of_War_Attack3.ogg",
        "image": "files/EX1_178.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_178_premium.gif"
    },
    {
        "card_id": "EX1_009",
        "set": "CLASSIC",
        "name": "Angry Chicken",
        "collectible": true,
        "flavor_text": "There is no beast more frightening (or ridiculous) than a fully enraged chicken.",
        "play_sound": "files/SFX_EX1_009_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_009_Attack.ogg",
        "image": "files/EX1_009.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_009_premium.gif"
    },
    {
        "card_id": "GVG_077",
        "set": "GVG",
        "name": "Anima Golem",
        "collectible": true,
        "flavor_text": "The Dark Animus is evil and mysterious and huge and unable to write sentences that utilize proper grammar.",
        "play_sound": "files/GVG_077_SonOfAnimus_EnterPlay.ogg",
        "attack_sound": "files/GVG_077_SonOfAnimus_Attack.ogg",
        "image": "files/GVG_077.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_077_premium.gif"
    },
    {
        "card_id": "ICC_238",
        "set": "ICECROWN",
        "name": "Animated Berserker",
        "collectible": true,
        "flavor_text": "He'd be a lot easier to animate if he would just stand still.",
        "play_sound": "files/VO_ICC_238_Male_Spirit_Play_02.ogg",
        "attack_sound": "files/VO_ICC_238_Male_Spirit_Attack_01.ogg",
        "image": "files/ICC_238.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_238_premium.gif"
    },
    {
        "card_id": "KAR_710m",
        "set": "KARA",
        "name": "Animated Shield",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KAR_710m_Male_Shield_Play_01.ogg",
        "attack_sound": "files/VO_KAR_710m_Male_Shield_Attack_01.ogg",
        "image": "files/KAR_710m.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_710m_premium.gif"
    },
    {
        "card_id": "LOEA04_27",
        "set": "LOE",
        "name": "Animated Statue",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/LOEA04_27_AnimatedStatue_Play.ogg",
        "attack_sound": "files/LOEA04_27_AnimatedStatue_Attack.ogg",
        "image": "files/LOEA04_27.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA04_27.png"
    },
    {
        "card_id": "GVG_085",
        "set": "GVG",
        "name": "Annoy-o-Tron",
        "collectible": true,
        "flavor_text": "The inventor of the Annoy-o-Tron was immediately expelled from Tinkerschool, Tinkertown, and was eventually exiled from the Eastern Kingdoms altogether.",
        "play_sound": "files/VO_GVG_085_Play_01.ogg",
        "attack_sound": "files/VO_GVG_085_Attack_02_ALT.ogg",
        "image": "files/GVG_085.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_085_premium.gif"
    },
    {
        "card_id": "GVG_030",
        "set": "GVG",
        "name": "Anodized Robo Cub",
        "collectible": true,
        "flavor_text": "It's adorable! AND OH MY GOODNESS WHY IS IT EATING MY FACE",
        "play_sound": "files/SFX_GVG_030_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_030_Attack.ogg",
        "image": "files/GVG_030.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_030_premium.gif"
    },
    {
        "card_id": "OG_120",
        "set": "OG",
        "name": "Anomalus",
        "collectible": true,
        "flavor_text": "That's short for \"Anomnomnomnomalus\".",
        "play_sound": "files/VO_OG_120_Male_Elemental_Play_01.ogg",
        "attack_sound": "files/VO_OG_120_Male_Elemental_Attack_01.ogg",
        "image": "files/OG_120.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_120_premium.gif"
    },
    {
        "card_id": "GVG_069",
        "set": "GVG",
        "name": "Antique Healbot",
        "collectible": true,
        "flavor_text": "They don't make 'em like they used to! (Because of explosions, mostly.)",
        "play_sound": "files/VO_GVG_069_Play_01.ogg",
        "attack_sound": "files/VO_GVG_069_Attack_02.ogg",
        "image": "files/GVG_069.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_069_premium.gif"
    },
    {
        "card_id": "FP1_026",
        "set": "NAXX",
        "name": "Anub'ar Ambusher",
        "collectible": true,
        "flavor_text": "Originally he was called \"Anub'ar Guy who bounces a guy back to your hand\", but it lacked a certain zing.",
        "play_sound": "files/SFX_FP1_026_EnterPlay.ogg",
        "attack_sound": "files/SFX_FP1_026_Attack.ogg",
        "image": "files/FP1_026.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_026_premium.gif"
    },
    {
        "card_id": "AT_036",
        "set": "TGT",
        "name": "Anub'arak",
        "collectible": true,
        "flavor_text": "Was actually a pretty nice guy before, you know, the whole Lich King thing.",
        "play_sound": "files/VO_AT_036_PLAY_01_ALT.ogg",
        "attack_sound": "files/VO_AT_036_ATTACK_ALT1_05.ogg",
        "image": "files/AT_036.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_036_premium.gif"
    },
    {
        "card_id": "LOE_061",
        "set": "LOE",
        "name": "Anubisath Sentinel",
        "collectible": true,
        "flavor_text": "He's actually a 1/1 who picked up the hammer from the last guy.",
        "play_sound": "files/SFX_LOE_061_Play.ogg",
        "attack_sound": "files/SFX_LOE_061_Attack.ogg",
        "image": "files/LOE_061.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_061_premium.gif"
    },
    {
        "card_id": "LOEA04_24",
        "set": "LOE",
        "name": "Anubisath Temple Guard",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_LOEA04_24_Play_01.ogg",
        "attack_sound": "files/VO_LOEA04_24_Attack2_03.ogg",
        "image": "files/LOEA04_24.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA04_24.png"
    },
    {
        "card_id": "EX1_398",
        "set": "CLASSIC",
        "name": "Arathi Weaponsmith",
        "collectible": true,
        "flavor_text": "50% off fist weapons, limited time only!",
        "play_sound": "files/VO_EX1_398_Play_01.ogg",
        "attack_sound": "files/VO_EX1_398_Attack_02.ogg",
        "image": "files/EX1_398.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_398_premium.gif"
    },
    {
        "card_id": "KAR_036",
        "set": "KARA",
        "name": "Arcane Anomaly",
        "collectible": true,
        "flavor_text": "He used to get work as a Spatial Anomaly, but he got tired of having his polarity reversed.",
        "play_sound": "files/KAR_036_ArcaneAnomaly_Play.ogg",
        "attack_sound": "files/KAR_036_ArcaneAnomaly_Attack.ogg",
        "image": "files/KAR_036.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_036_premium.gif"
    },
    {
        "card_id": "KAR_711",
        "set": "KARA",
        "name": "Arcane Giant",
        "collectible": true,
        "flavor_text": "Claims to be drawn to Karazhan because of the ley lines. Actually, just loves Moroes’ cooking.",
        "play_sound": "files/KAR_711_ArcaneGiant_Play_01.ogg",
        "attack_sound": "files/KAR_711_ArcaneGiant_Attack_01.ogg",
        "image": "files/KAR_711.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_711_premium.gif"
    },
    {
        "card_id": "EX1_089",
        "set": "CLASSIC",
        "name": "Arcane Golem",
        "collectible": true,
        "flavor_text": "Having Arcane golems at home really classes up the place, and as a bonus they are great conversation pieces.",
        "play_sound": "files/EX1_089_Arcane_Golem_EnterPlay2.ogg",
        "attack_sound": "files/EX1_089_Arcane_Golem_Attack5.ogg",
        "image": "files/EX1_089.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_089_premium.gif"
    },
    {
        "card_id": "GVG_091",
        "set": "GVG",
        "name": "Arcane Nullifier X-21",
        "collectible": true,
        "flavor_text": "There was some hard talk between gnome magi and engineers about inventing this mech.",
        "play_sound": "files/VO_GVG_091_Play_01.ogg",
        "attack_sound": "files/VO_GVG_091_Attack_02_ALT.ogg",
        "image": "files/GVG_091.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_091_premium.gif"
    },
    {
        "card_id": "UNG_020",
        "set": "UNGORO",
        "name": "Arcanologist",
        "collectible": true,
        "flavor_text": "What did you draw? Shhhh… it’s a secret.",
        "play_sound": "files/VO_UNG_020_Female_Gnome_Play_01.ogg",
        "attack_sound": "files/VO_UNG_020_Female_Gnome_Attack_01.ogg",
        "image": "files/UNG_020.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_020_premium.gif"
    },
    {
        "card_id": "KAR_710",
        "set": "KARA",
        "name": "Arcanosmith",
        "collectible": true,
        "flavor_text": "He’s really just a Blacksmith, but he thought the fancy title would bring in more business.",
        "play_sound": "files/VO_KAR_710m_Male_Shield_Play_01.ogg",
        "attack_sound": "files/VO_KAR_710m_Male_Shield_Attack_01.ogg",
        "image": "files/KAR_710.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_710_premium.gif"
    },
    {
        "card_id": "BRMA14_3",
        "set": "BRM",
        "name": "Arcanotron",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_BRMA14_3_Play_01.ogg",
        "attack_sound": "files/VO_BRMA14_3_Attack_02.ogg",
        "image": "files/BRMA14_3.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA14_3.png"
    },
    {
        "card_id": "LOE_092",
        "set": "LOE",
        "name": "Arch-Thief Rafaam",
        "collectible": true,
        "flavor_text": "He's very good at retrieving artifacts.  From other people's museums.",
        "play_sound": "files/VO_LOE_092_Play_04.ogg",
        "attack_sound": "files/VO_LOE_092_Attack_02.ogg",
        "image": "files/LOE_092.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_092_premium.gif"
    },
    {
        "card_id": "ICC_215",
        "set": "ICECROWN",
        "name": "Archbishop Benedictus",
        "collectible": true,
        "flavor_text": "Nobody expects the Archbishop's Benediction!",
        "play_sound": "files/VO_ICC_215_Male_Human_Play_01.ogg",
        "attack_sound": "files/VO_ICC_215_Male_Human_Attack_01.ogg",
        "image": "files/ICC_215.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_215_premium.gif"
    },
    {
        "card_id": "CS2_155",
        "set": "BASIC",
        "name": "Archmage",
        "collectible": true,
        "flavor_text": "You earn the title of Archmage when you can destroy anyone who calls you on it.",
        "play_sound": "files/VO_CS2_155_Play_01.ogg",
        "attack_sound": "files/VO_CS2_155_Attack_02.ogg",
        "image": "files/CS2_155.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_155_premium.gif"
    },
    {
        "card_id": "EX1_559",
        "set": "CLASSIC",
        "name": "Archmage Antonidas",
        "collectible": true,
        "flavor_text": "Antonidas was the Grand Magus of the Kirin Tor, and Jaina's mentor.  This was a big step up from being Grand Magus of Jelly Donuts.",
        "play_sound": "files/VO_EX1_559_Play_01.ogg",
        "attack_sound": "files/VO_EX1_559_Attack_03.ogg",
        "image": "files/EX1_559.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_559_premium.gif"
    },
    {
        "card_id": "KARA_00_08",
        "set": "KARA",
        "name": "Archmage's Apprentice",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KARA_00_08_Male_Human_Play_01.ogg",
        "attack_sound": "files/VO_KARA_00_08_Male_Human_Attack_02.ogg",
        "image": "files/KARA_00_08.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KARA_00_08.png"
    },
    {
        "card_id": "ICC_854",
        "set": "ICECROWN",
        "name": "Arfus",
        "collectible": true,
        "flavor_text": "There must always be a Lick King.",
        "play_sound": "files/ICC_854_Arfus_Play.ogg",
        "attack_sound": "files/ICC_854_Arfus_Attack.ogg",
        "image": "files/ICC_854.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_854_premium.gif"
    },
    {
        "card_id": "EX1_067",
        "set": "CLASSIC",
        "name": "Argent Commander",
        "collectible": true,
        "flavor_text": "The Argent Dawn stands vigilant against the Scourge, as well as people who cut in line at coffee shops.",
        "play_sound": "files/VO_EX1_067_Play_01.ogg",
        "attack_sound": "files/VO_EX1_067_Attack_02.ogg",
        "image": "files/EX1_067.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_067_premium.gif"
    },
    {
        "card_id": "AT_087",
        "set": "TGT",
        "name": "Argent Horserider",
        "collectible": true,
        "flavor_text": "His horse's name is Betsy.",
        "play_sound": "files/VO_AT_087_PLAY_ALT1_02.ogg",
        "attack_sound": "files/VO_AT_087_ATTACK_04.ogg",
        "image": "files/AT_087.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_087_premium.gif"
    },
    {
        "card_id": "EX1_362",
        "set": "CLASSIC",
        "name": "Argent Protector",
        "collectible": true,
        "flavor_text": "\"I'm not saying you can dodge fireballs.  I'm saying with this shield, you won't have to.\"",
        "play_sound": "files/VO_EX1_362_Play_01.ogg",
        "attack_sound": "files/VO_EX1_362_Attack_02.ogg",
        "image": "files/EX1_362.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_362_premium.gif"
    },
    {
        "card_id": "EX1_008",
        "set": "CLASSIC",
        "name": "Argent Squire",
        "collectible": true,
        "flavor_text": "\"I solemnly swear to uphold the Light, purge the world of darkness, and to eat only burritos.\" - The Argent Dawn Oath",
        "play_sound": "files/VO_EX1_008_Play_01.ogg",
        "attack_sound": "files/VO_EX1_008_Attack_02.ogg",
        "image": "files/EX1_008.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_008_premium.gif"
    },
    {
        "card_id": "AT_109",
        "set": "TGT",
        "name": "Argent Watchman",
        "collectible": true,
        "flavor_text": "Who argent watches the Argent Watchman?",
        "play_sound": "files/VO_AT_109_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_109_ATTACK_02.ogg",
        "image": "files/AT_109.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_109_premium.gif"
    },
    {
        "card_id": "AT_108",
        "set": "TGT",
        "name": "Armored Warhorse",
        "collectible": true,
        "flavor_text": "Yep.  It's a horse... wearing armor... going to war.",
        "play_sound": "files/SFX_AT_108_Play_01.ogg",
        "attack_sound": "files/SFX_AT_108_Attack_01.ogg",
        "image": "files/AT_108.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_108_premium.gif"
    },
    {
        "card_id": "EX1_402",
        "set": "CLASSIC",
        "name": "Armorsmith",
        "collectible": true,
        "flavor_text": "She accepts guild funds for repairs!",
        "play_sound": "files/VO_EX1_402_Play_01.ogg",
        "attack_sound": "files/VO_EX1_402_Attack_02.ogg",
        "image": "files/EX1_402.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_402_premium.gif"
    },
    {
        "card_id": "ICC_034",
        "set": "ICECROWN",
        "name": "Arrogant Crusader",
        "collectible": true,
        "flavor_text": "To be honest, he was kind of a jerk even BEFORE he was bitten by that ghoul.",
        "play_sound": "files/VO_ICC_034_Male_BloodElf_Play_02.ogg",
        "attack_sound": "files/VO_ICC_034_Male_BloodElf_Attack_02.ogg",
        "image": "files/ICC_034.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_034_premium.gif"
    },
    {
        "card_id": "EX1_591",
        "set": "CLASSIC",
        "name": "Auchenai Soulpriest",
        "collectible": true,
        "flavor_text": "The Auchenai know the end is coming, but they're not sure when.",
        "play_sound": "files/VO_EX1_591_Play_01.ogg",
        "attack_sound": "files/VO_EX1_591_Attack_02.ogg",
        "image": "files/EX1_591.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_591_premium.gif"
    },
    {
        "card_id": "CFM_807",
        "set": "GANGS",
        "name": "Auctionmaster Beardo",
        "collectible": true,
        "flavor_text": "Gadgetzan has always run an under-the-table auction house, and business has been PRETTY good for Beardo since the population explosion.  And since the explosion that destroyed the competing auction houses in the city.",
        "play_sound": "files/VO_CFM_807_Male_Goblin_Play_01.ogg",
        "attack_sound": "files/VO_CFM_807_Male_Goblin_Attack_01.ogg",
        "image": "files/CFM_807.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_807_premium.gif"
    },
    {
        "card_id": "KAR_037",
        "set": "KARA",
        "name": "Avian Watcher",
        "collectible": true,
        "flavor_text": "He mostly watches light romantic comedies.",
        "play_sound": "files/KAR_037_RavenWatcher_Play_01.ogg",
        "attack_sound": "files/KAR_037_RavenWatcher_Attack_01.ogg",
        "image": "files/KAR_037.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_037_premium.gif"
    },
    {
        "card_id": "AT_045",
        "set": "TGT",
        "name": "Aviana",
        "collectible": true,
        "flavor_text": "Call her \"Tweety\".  She'll find it real funny.  I PROMISE.",
        "play_sound": "files/VO_AT_045_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_045_ATTACK_02.ogg",
        "image": "files/AT_045.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_045_premium.gif"
    },
    {
        "card_id": "BRM_016",
        "set": "BRM",
        "name": "Axe Flinger",
        "collectible": true,
        "flavor_text": "Once a lowly \"Stick Flinger\", he's been relentless on the path to his ultimate dream: \"Tauren Flinger\".",
        "play_sound": "files/VO_BRM_016_Play_01.ogg",
        "attack_sound": "files/VO_BRM_016_Attack_02.ogg",
        "image": "files/BRM_016.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_016_premium.gif"
    },
    {
        "card_id": "CFM_902",
        "set": "GANGS",
        "name": "Aya Blackpaw",
        "collectible": true,
        "flavor_text": "Though young, Aya took over as the leader of Jade Lotus through her charisma and strategic acumen when her predecessor was accidentally crushed by a jade golem.",
        "play_sound": "files/VO_CFM_902_Female_Pandaren_Play_02.ogg",
        "attack_sound": "files/VO_CFM_902_Female_Pandaren_Attack_01.ogg",
        "image": "files/CFM_902.gif",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_902_premium.gif"
    },
    {
        "card_id": "EX1_284",
        "set": "HOF",
        "name": "Azure Drake",
        "collectible": true,
        "flavor_text": "They initially planned to be the Beryl or Cerulean drakes, but those felt a tad too pretentious.",
        "play_sound": "files/WoW_EX1_284_AzureDrake_EnterPlay.ogg",
        "attack_sound": "files/WoW_EX1_284_AzureDrake_Attack.ogg",
        "image": "files/EX1_284.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_284_premium.gif"
    },
    {
        "card_id": "KAR_009",
        "set": "KARA",
        "name": "Babbling Book",
        "collectible": true,
        "flavor_text": "His idol is the Green Hills of Stranglethorn, and he won't shut up about it.",
        "play_sound": "files/VO_KAR_009_Male_Book_Play_01.ogg",
        "attack_sound": "files/VO_KAR_009_Male_Book_Attack_01.ogg",
        "image": "files/KAR_009.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_009_premium.gif"
    },
    {
        "card_id": "CFM_658",
        "set": "GANGS",
        "name": "Backroom Bouncer",
        "collectible": true,
        "flavor_text": "\"WHY ARE YOU IN THE BACK ROOM?  WHO IS WATCHING THE FRONT?!\"",
        "play_sound": "files/VO_CFM_658_Male_Tauren_Play_03.ogg",
        "attack_sound": "files/VO_CFM_658_Male_Tauren_Attack_02.ogg",
        "image": "files/CFM_658.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_658_premium.gif"
    },
    {
        "card_id": "CFM_646",
        "set": "GANGS",
        "name": "Backstreet Leper",
        "collectible": true,
        "flavor_text": "Quit playing games with his heart. And his fingers. And foot. It's rude.",
        "play_sound": "files/VO_CFM_646_Male_Gnome_Play_01.ogg",
        "attack_sound": "files/VO_CFM_646_Male_Gnome_Attack_02.ogg",
        "image": "files/CFM_646.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_646_premium.gif"
    },
    {
        "card_id": "EX1_110t",
        "set": "CLASSIC",
        "name": "Baine Bloodhoof",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_EX1_110t_Play_01.ogg",
        "attack_sound": "files/VO_EX1_110t_Attack_02.ogg",
        "image": "files/EX1_110t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_110t_premium.gif"
    },
    {
        "card_id": "UNG_116t",
        "set": "UNGORO",
        "name": "Barnabus the Stomper",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BarnabusTheStomper_UNG_116t_Play.ogg",
        "attack_sound": "files/BarnabusTheStomper_UNG_116t_Attack.ogg",
        "image": "files/UNG_116t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_116t_premium.gif"
    },
    {
        "card_id": "KAR_114",
        "set": "KARA",
        "name": "Barnes",
        "collectible": true,
        "flavor_text": "He used to play every part, until Moroes confiscated his Orb of Deception.",
        "play_sound": "files/VO_KAR_114_Male_Human_Play_02.ogg",
        "attack_sound": "files/VO_KAR_114_Male_Human_Attack_01.ogg",
        "image": "files/KAR_114.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_114_premium.gif"
    },
    {
        "card_id": "EX1_249",
        "set": "CLASSIC",
        "name": "Baron Geddon",
        "collectible": true,
        "flavor_text": "Baron Geddon was Ragnaros's foremost lieutenant, until he got FIRED.",
        "play_sound": "files/EX1_249_Baron_Geddon_EnterPlay1.ogg",
        "attack_sound": "files/EX1_249_Baron_Geddon_Attack1.ogg",
        "image": "files/EX1_249.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_249_premium.gif"
    },
    {
        "card_id": "FP1_031",
        "set": "NAXX",
        "name": "Baron Rivendare",
        "collectible": true,
        "flavor_text": "There used to be five Horsemen but one of them left because a job opened up in the deadmines and the benefits were better.",
        "play_sound": "files/VO_FP1_031_EnterPlay_06.ogg",
        "attack_sound": "files/VO_FP1_031_Attack_07.ogg",
        "image": "files/FP1_031.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_031_premium.gif"
    },
    {
        "card_id": "ICC_419",
        "set": "ICECROWN",
        "name": "Bearshark",
        "collectible": true,
        "flavor_text": "\"Candygram.\"",
        "play_sound": "files/GrizzlyGrotesque_ICC_419_Play.ogg",
        "attack_sound": "files/GrizzlyGrotesque_ICC_419_Attack.ogg",
        "image": "files/ICC_419.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_419_premium.gif"
    },
    {
        "card_id": "OG_281",
        "set": "OG",
        "name": "Beckoner of Evil",
        "collectible": true,
        "flavor_text": "Here, Evil!  C'mon boy!",
        "play_sound": "files/VO_OG_281_Female_Human_Play_01.ogg",
        "attack_sound": "files/VO_OG_281_Female_Human_Attack_01.ogg",
        "image": "files/OG_281.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_281_premium.gif"
    },
    {
        "card_id": "KAR_005a",
        "set": "KARA",
        "name": "Big Bad Wolf",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KAR_005a_Male_Worgen_Play_01.ogg",
        "attack_sound": "files/VO_KAR_005a_Male_Worgen_Attack_03.ogg",
        "image": "files/KAR_005a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_005a_premium.gif"
    },
    {
        "card_id": "EX1_005",
        "set": "CLASSIC",
        "name": "Big Game Hunter",
        "collectible": true,
        "flavor_text": "Mere devilsaurs no longer excite him.  Soon he'll be trying to catch Onyxia with only a dull Krol Blade.",
        "play_sound": "files/VO_EX1_005_Play_01.ogg",
        "attack_sound": "files/VO_EX1_005_Attack_02.ogg",
        "image": "files/EX1_005.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_005_premium.gif"
    },
    {
        "card_id": "CFM_648",
        "set": "GANGS",
        "name": "Big-Time Racketeer",
        "collectible": true,
        "flavor_text": "\"It'd be a shame if someone disenchanted those Legendaries.\"",
        "play_sound": "files/VO_CFM_648_Male_Goblin_Play_02.ogg",
        "attack_sound": "files/VO_CFM_648_Male_Goblin_Attack_01.ogg",
        "image": "files/CFM_648.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_648_premium.gif"
    },
    {
        "card_id": "OG_156",
        "set": "OG",
        "name": "Bilefin Tidehunter",
        "collectible": true,
        "flavor_text": "Bile actually makes for surprisingly sturdy fins.",
        "play_sound": "files/OG_156_BilefinTidehunter_Play.ogg",
        "attack_sound": "files/OG_156_BilefinTidehunter_Attack.ogg",
        "image": "files/OG_156.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_156_premium.gif"
    },
    {
        "card_id": "UNG_063",
        "set": "UNGORO",
        "name": "Biteweed",
        "collectible": true,
        "flavor_text": "AKA Edwin VanLeaf.",
        "play_sound": "files/UNG_063_SproutingSporling_Play.ogg",
        "attack_sound": "files/UNG_063_SproutingSporling_Attack.ogg",
        "image": "files/UNG_063.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_063_premium.gif"
    },
    {
        "card_id": "UNG_087",
        "set": "UNGORO",
        "name": "Bittertide Hydra",
        "collectible": true,
        "flavor_text": "It's actually only the middle head that's bitter. The others are sweet and spicy.",
        "play_sound": "files/BittertideHydra_UNG_087_Play.ogg",
        "attack_sound": "files/BittertideHydra_UNG_087_Attack.ogg",
        "image": "files/UNG_087.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_087_premium.gif"
    },
    {
        "card_id": "KAR_A10_06",
        "set": "KARA",
        "name": "Black Bishop",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KAR_A10_06_Male_ChessPiece_Play_01.ogg",
        "attack_sound": "files/VO_KAR_A10_06_Male_ChessPiece_Play_01.ogg",
        "image": "files/KAR_A10_06.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KAR_A10_06.png"
    },
    {
        "card_id": "KAR_A10_01",
        "set": "KARA",
        "name": "Black Pawn",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KAR_A10_01_Male_ChessPiece_Play_02.ogg",
        "attack_sound": "files/VO_KAR_A10_01_Male_ChessPiece_Attack_01.ogg",
        "image": "files/KAR_A10_01.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KAR_A10_01.png"
    },
    {
        "card_id": "KAR_A10_10",
        "set": "KARA",
        "name": "Black Queen",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KAR_A10_10_Female_ChessPiece_Play_01.ogg",
        "attack_sound": "files/VO_KAR_A10_10_Female_ChessPiece_Attack_02.ogg",
        "image": "files/KAR_A10_10.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KAR_A10_10.png"
    },
    {
        "card_id": "BRM_022t",
        "set": "BRM",
        "name": "Black Whelp",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_BRM_022t_BlackWhelp_EnterPlay.ogg",
        "attack_sound": "files/SFX_BRM_022t_BlackWhelp_Attack.ogg",
        "image": "files/BRM_022t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_022t_premium.gif"
    },
    {
        "card_id": "ICC_245",
        "set": "ICECROWN",
        "name": "Blackguard",
        "collectible": true,
        "flavor_text": "\"Did I ever tell you the story of when I single-handedly took down a 29/29 C'thun?\" - Reno Jackson",
        "play_sound": "files/VO_ICC_245_Male_Draenei_Play_02.ogg",
        "attack_sound": "files/VO_ICC_245_Male_Draenei_Attack_02.ogg",
        "image": "files/ICC_245.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_245_premium.gif"
    },
    {
        "card_id": "OG_322",
        "set": "OG",
        "name": "Blackwater Pirate",
        "collectible": true,
        "flavor_text": "\"Look, they fell off the back of a ship, do you want them or not? I have a meeting with Y'Shaarj in like ten minutes.\"",
        "play_sound": "files/VO_OG_322_Female_Goblin_Play_01.ogg",
        "attack_sound": "files/VO_OG_322_Female_Goblin_Attack_02.ogg",
        "image": "files/OG_322.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_322_premium.gif"
    },
    {
        "card_id": "BRM_034",
        "set": "BRM",
        "name": "Blackwing Corruptor",
        "collectible": true,
        "flavor_text": "He got his name when he gave Blackwing some comic books and rock \u0026 roll records.",
        "play_sound": "files/VO_BRM_034_Play_01.ogg",
        "attack_sound": "files/VO_BRM_034_Attack_02.ogg",
        "image": "files/BRM_034.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_034_premium.gif"
    },
    {
        "card_id": "BRM_033",
        "set": "BRM",
        "name": "Blackwing Technician",
        "collectible": true,
        "flavor_text": "This is who you go to when your Blackwing needs a tune up. Don't go to a cut rate Blackwing tune up shop!",
        "play_sound": "files/VO_BRM_033_Play_01.ogg",
        "attack_sound": "files/VO_BRM_033_Attack_03.ogg",
        "image": "files/BRM_033.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_033_premium.gif"
    },
    {
        "card_id": "OG_282",
        "set": "OG",
        "name": "Blade of C'Thun",
        "collectible": true,
        "flavor_text": "C'Thun demands a sacrifice! Preferably a Deathwing.",
        "play_sound": "files/VO_OG_282_Male_Human_Play_01.ogg",
        "attack_sound": "files/VO_OG_282_Male_Human_Attack_01.ogg",
        "image": "files/OG_282.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_282_premium.gif"
    },
    {
        "card_id": "OG_070",
        "set": "OG",
        "name": "Bladed Cultist",
        "collectible": true,
        "flavor_text": "He has a poor understanding of the law of diminishing returns.",
        "play_sound": "files/VO_OG_070_Male_Troll_Play_01.ogg",
        "attack_sound": "files/VO_OG_070_Male_Troll_Attack_01.ogg",
        "image": "files/OG_070.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_070_premium.gif"
    },
    {
        "card_id": "GVG_119",
        "set": "GVG",
        "name": "Blingtron 3000",
        "collectible": true,
        "flavor_text": "PREPARE PARTY SERVOS FOR IMMEDIATE DEPLOYMENT.",
        "play_sound": "files/VO_GVG_119_Play_01_ALT.ogg",
        "attack_sound": "files/VO_GVG_119_Attack_02.ogg",
        "image": "files/GVG_119.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_119_premium.gif"
    },
    {
        "card_id": "ICCA09_001t1",
        "set": "ICECROWN",
        "name": "Blood Beast",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BloodBeast_ICCA09_001t1_Play.ogg",
        "attack_sound": "files/BloodBeast_ICCA09_001t1_Attack.ogg",
        "image": "files/ICCA09_001t1.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/ICCA09_001t1.png"
    },
    {
        "card_id": "CS2_059",
        "set": "CLASSIC",
        "name": "Blood Imp",
        "collectible": true,
        "flavor_text": "Imps are content to hide and viciously taunt everyone nearby.",
        "play_sound": "files/VO_CS2_059_Play_01.ogg",
        "attack_sound": "files/VO_CS2_059_Attack_02.ogg",
        "image": "files/CS2_059.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_059_premium.gif"
    },
    {
        "card_id": "EX1_590",
        "set": "CLASSIC",
        "name": "Blood Knight",
        "collectible": true,
        "flavor_text": "The Blood Knights get their holy powers from the Sunwell, which you should NOT bathe in.",
        "play_sound": "files/VO_EX1_590_Play_01.ogg",
        "attack_sound": "files/VO_EX1_590_Attack_02.ogg",
        "image": "files/EX1_590.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_590_premium.gif"
    },
    {
        "card_id": "OG_173",
        "set": "OG",
        "name": "Blood of The Ancient One",
        "collectible": true,
        "flavor_text": "Add two cups of Blood of the Ancient One to one cup of lemon juice. Add just a dash of sugar and stir. Delicious!",
        "play_sound": "files/BloodOfTheAncientOne_OG_173_Play.ogg",
        "attack_sound": "files/BloodOfTheAncientOne_OG_173_Attack.ogg",
        "image": "files/OG_173.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_173_premium.gif"
    },
    {
        "card_id": "ICC_841",
        "set": "ICECROWN",
        "name": "Blood-Queen Lana'thel",
        "collectible": true,
        "flavor_text": "As a young blood-princess she learned the proper way for a lady to curtsy, how to address fellow members of royalty, and how to bite them.",
        "play_sound": "files/VO_ICC_841_Female_Sanlayn_Play_01.ogg",
        "attack_sound": "files/VO_ICC_841_Female_Sanlayn_Attack_01.ogg",
        "image": "files/ICC_841.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_841_premium.gif"
    },
    {
        "card_id": "CS2_172",
        "set": "BASIC",
        "name": "Bloodfen Raptor",
        "collectible": true,
        "flavor_text": "\"Kill 30 raptors.\" - Hemet Nesingwary",
        "play_sound": "files/CS2_172_StranglethornRaptor_EnterPlay.ogg",
        "attack_sound": "files/CS2_172_StranglethornRaptor_Attack.ogg",
        "image": "files/CS2_172.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_172_premium.gif"
    },
    {
        "card_id": "OG_218",
        "set": "OG",
        "name": "Bloodhoof Brave",
        "collectible": true,
        "flavor_text": "He thought the set was called \"Flippers of the Old Cods\" and hungrily volunteered to be in it.  He is definitely going to get his hearing checked.",
        "play_sound": "files/VO_OG_218_Male_Tauren_Play_01.ogg",
        "attack_sound": "files/VO_OG_218_Male_Tauren_Attack_01.ogg",
        "image": "files/OG_218.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_218_premium.gif"
    },
    {
        "card_id": "EX1_012",
        "set": "CLASSIC",
        "name": "Bloodmage Thalnos",
        "collectible": true,
        "flavor_text": "He's in charge of the Annual Scarlet Monastery Blood Drive!",
        "play_sound": "files/VO_EX1_012_Play_01.ogg",
        "attack_sound": "files/VO_EX1_012_Attack_02.ogg",
        "image": "files/EX1_012.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_012_premium.gif"
    },
    {
        "card_id": "NEW1_025",
        "set": "CLASSIC",
        "name": "Bloodsail Corsair",
        "collectible": true,
        "flavor_text": "Every pirate uses the same four digits to access Automated Gold Dispensers.  It's called the \"Pirate's Code\".",
        "play_sound": "files/VO_NEW1_025_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_025_Attack_02.ogg",
        "image": "files/NEW1_025.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_025_premium.gif"
    },
    {
        "card_id": "OG_315",
        "set": "OG",
        "name": "Bloodsail Cultist",
        "collectible": true,
        "flavor_text": "They're really just in it for the Blood Parrot.",
        "play_sound": "files/VO_OG_315_Female_Gnome_Play_01.ogg",
        "attack_sound": "files/VO_OG_315_Female_Gnome_Attack_01.ogg",
        "image": "files/OG_315.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_315_premium.gif"
    },
    {
        "card_id": "NEW1_018",
        "set": "CLASSIC",
        "name": "Bloodsail Raider",
        "collectible": true,
        "flavor_text": "\"I only plunder on days that end in 'y'.\"",
        "play_sound": "files/VO_NEW1_018_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_018_Attack_02.ogg",
        "image": "files/NEW1_018.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_018_premium.gif"
    },
    {
        "card_id": "ICC_905",
        "set": "ICECROWN",
        "name": "Bloodworm",
        "collectible": true,
        "flavor_text": "Queen Lana'thel insists on one of these, fried, every morning for breakfast.",
        "play_sound": "files/ICC_905_Bloodworm_Play.ogg",
        "attack_sound": "files/ICC_905_Bloodworm_Attack.ogg",
        "image": "files/ICC_905.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_905_premium.gif"
    },
    {
        "card_id": "CFM_647",
        "set": "GANGS",
        "name": "Blowgill Sniper",
        "collectible": true,
        "flavor_text": "Imagine how much further his darts would go if he had lungs instead of gills!",
        "play_sound": "files/VO_CFM_647_Male_Murloc_Play_01.ogg",
        "attack_sound": "files/VO_CFM_647_Male_Murloc_Attack_01.ogg",
        "image": "files/CFM_647.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_647_premium.gif"
    },
    {
        "card_id": "CFM_064",
        "set": "GANGS",
        "name": "Blubber Baron",
        "collectible": true,
        "flavor_text": "When oil, railroad, steel, robber, and red are all already taken, your options are limited.",
        "play_sound": "files/VO_CFM_064_Male_Tuskarr_Play_01.ogg",
        "attack_sound": "files/VO_CFM_064_Male_Tuskarr_Attack_01.ogg",
        "image": "files/CFM_064.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_064_premium.gif"
    },
    {
        "card_id": "CS2_173",
        "set": "BASIC",
        "name": "Bluegill Warrior",
        "collectible": true,
        "flavor_text": "He just wants a hug.   A sloppy... slimy... hug.",
        "play_sound": "files/CS2_173_Bluegill_Warrior_EnterPlay1.ogg",
        "attack_sound": "files/CS2_173_Bluegill_Warrior_Attack3.ogg",
        "image": "files/CS2_173.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_173_premium.gif"
    },
    {
        "card_id": "CS2_boar",
        "set": "BASIC",
        "name": "Boar",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_CS2_boar_EnterPlay.ogg",
        "attack_sound": "files/SFX_CS2_boar_Attack.ogg",
        "image": "files/CS2_boar.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_boar_premium.gif"
    },
    {
        "card_id": "AT_005t",
        "set": "TGT",
        "name": "Boar2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_CS2_boar_EnterPlay.ogg",
        "attack_sound": "files/SFX_CS2_boar_Attack.ogg",
        "image": "files/AT_005t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_005t_premium.gif"
    },
    {
        "card_id": "OG_153",
        "set": "OG",
        "name": "Bog Creeper",
        "collectible": true,
        "flavor_text": "He's tried other things, but bog sidling, bog ambling, and bog trundling just aren't as effective as bog creeping.",
        "play_sound": "files/BogCreeper_OG_153_Play.ogg",
        "attack_sound": "files/BogCreeper_OG_153_Attack.ogg",
        "image": "files/OG_153.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_153_premium.gif"
    },
    {
        "card_id": "AT_124",
        "set": "TGT",
        "name": "Bolf Ramshield",
        "collectible": true,
        "flavor_text": "Bolf keeps coming in 2nd at the Grand Tournament.  It might be his year this year, if Lebron doesn't enter.",
        "play_sound": "files/VO_AT_124_PLAY_ALT2_03.ogg",
        "attack_sound": "files/VO_AT_124_ATTACK_04.ogg",
        "image": "files/AT_124.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_124_premium.gif"
    },
    {
        "card_id": "GVG_063",
        "set": "GVG",
        "name": "Bolvar Fordragon",
        "collectible": true,
        "flavor_text": "Spoiler alert: Bolvar gets melted and then sits on an ice throne and everyone forgets about him.",
        "play_sound": "files/VO_GVG_063_Play_01.ogg",
        "attack_sound": "files/VO_GVG_063_Attack_02.ogg",
        "image": "files/GVG_063.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_063_premium.gif"
    },
    {
        "card_id": "ICC_858",
        "set": "ICECROWN",
        "name": "Bolvar, Fireblood",
        "collectible": true,
        "flavor_text": "He's so hot right now.",
        "play_sound": "files/VO_ICC_858_Male_Human_Play_02.ogg",
        "attack_sound": "files/VO_ICC_858_Male_Human_Attack_01.ogg",
        "image": "files/ICC_858.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_858_premium.gif"
    },
    {
        "card_id": "GVG_099",
        "set": "GVG",
        "name": "Bomb Lobber",
        "collectible": true,
        "flavor_text": "He lobbies Orgrimmar daily on behalf of bombs.",
        "play_sound": "files/VO_GVG_099_Play_01.ogg",
        "attack_sound": "files/VO_GVG_099_Attack_02.ogg",
        "image": "files/GVG_099.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_099_premium.gif"
    },
    {
        "card_id": "CFM_667",
        "set": "GANGS",
        "name": "Bomb Squad",
        "collectible": true,
        "flavor_text": "Please don't explode!  Please don't explode!  Please don't explode!",
        "play_sound": "files/VO_CFM_667_Female_Goblin_Play_01.ogg",
        "attack_sound": "files/VO_CFM_667_Female_Goblin_Attack_01.ogg",
        "image": "files/CFM_667.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_667_premium.gif"
    },
    {
        "card_id": "ICC_065",
        "set": "ICECROWN",
        "name": "Bone Baron",
        "collectible": true,
        "flavor_text": "\"Oil,\" \"Rail,\" and \"Blubber\" were already taken.",
        "play_sound": "files/VO_ICC_065_Male_Human_Play_01.ogg",
        "attack_sound": "files/VO_ICC_065_Male_Human_Attack_01.ogg",
        "image": "files/ICC_065.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_065_premium.gif"
    },
    {
        "card_id": "BRMA17_6",
        "set": "BRM",
        "name": "Bone Construct",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BRMA17_6_BoneConstruct_EnterPlay_1.ogg",
        "attack_sound": "files/BRMA17_6_BoneConstruct_Attack_1.ogg",
        "image": "files/BRMA17_6.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA17_6.png"
    },
    {
        "card_id": "ICC_027",
        "set": "ICECROWN",
        "name": "Bone Drake",
        "collectible": true,
        "flavor_text": "The bone drake brings all the dragons to the yard. He would teach you, but you have no cards.",
        "play_sound": "files/BoneDrake_ICC_027_Play.ogg",
        "attack_sound": "files/BoneDrake_ICC_027_Attack.ogg",
        "image": "files/ICC_027.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_027_premium.gif"
    },
    {
        "card_id": "ICCA06_005",
        "set": "ICECROWN",
        "name": "Bone Spike",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/ICCA06_005_Bonespike_Play.ogg",
        "attack_sound": "files/ICCA06_005_Bonespike_Attack.ogg",
        "image": "files/ICCA06_005.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/ICCA06_005.png"
    },
    {
        "card_id": "AT_089",
        "set": "TGT",
        "name": "Boneguard Lieutenant",
        "collectible": true,
        "flavor_text": "Underneath all that impressive armor, he's just skin and bones.  Okay, maybe just bones.",
        "play_sound": "files/VO_AT_089_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_089_ATTACK_02.ogg",
        "image": "files/AT_089.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_089_premium.gif"
    },
    {
        "card_id": "ICC_705",
        "set": "ICECROWN",
        "name": "Bonemare",
        "collectible": true,
        "flavor_text": "Attacks her job with unbridled enthusiasm.",
        "play_sound": "files/ICC_705_Bonemare_Play.ogg",
        "attack_sound": "files/ICC_705_Bonemare_Attack.ogg",
        "image": "files/ICC_705.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_705_premium.gif"
    },
    {
        "card_id": "KAR_033",
        "set": "KARA",
        "name": "Book Wyrm",
        "collectible": true,
        "flavor_text": "His favorites are classic tragedies like \"The Hobbit\" and \"Grendel\".",
        "play_sound": "files/VO_KAR_033_Male_Dragon_Play_01.ogg",
        "attack_sound": "files/VO_KAR_033_Male_Dragon_Attack_01.ogg",
        "image": "files/KAR_033.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_033_premium.gif"
    },
    {
        "card_id": "GVG_110t",
        "set": "GVG",
        "name": "Boom Bot",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/GVG_110t_BoomBot_EnterPlay.ogg",
        "attack_sound": "files/GVG_110t_BoomBot_Attack.ogg",
        "image": "files/GVG_110t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_110t_premium.gif"
    },
    {
        "card_id": "CS2_187",
        "set": "BASIC",
        "name": "Booty Bay Bodyguard",
        "collectible": true,
        "flavor_text": "You can hire him... until someone offers him enough gold to turn on you.",
        "play_sound": "files/VO_CS2_187_Play_01.ogg",
        "attack_sound": "files/VO_CS2_187_Attack_02.ogg",
        "image": "files/CS2_187.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_187_premium.gif"
    },
    {
        "card_id": "CS2_200",
        "set": "BASIC",
        "name": "Boulderfist Ogre",
        "collectible": true,
        "flavor_text": "\"ME HAVE GOOD STATS FOR THE COST\"",
        "play_sound": "files/VO_CS2_200_Play_01.ogg",
        "attack_sound": "files/VO_CS2_200_Attack_02.ogg",
        "image": "files/CS2_200.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_200_premium.gif"
    },
    {
        "card_id": "LOE_077",
        "set": "LOE",
        "name": "Brann Bronzebeard",
        "collectible": true,
        "flavor_text": "Contains 75% more fiber than his brother Magni!",
        "play_sound": "files/VO_LOE_077_Play_16.ogg",
        "attack_sound": "files/VO_LOE_077_Attack_12.ogg",
        "image": "files/LOE_077.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_077_premium.gif"
    },
    {
        "card_id": "AT_059",
        "set": "TGT",
        "name": "Brave Archer",
        "collectible": true,
        "flavor_text": "This is a \"bearly\" concealed reference.",
        "play_sound": "files/VO_AT_059_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_059_ATTACK_03.ogg",
        "image": "files/AT_059.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_059_premium.gif"
    },
    {
        "card_id": "KAR_025b",
        "set": "KARA",
        "name": "Broom",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/KAR_025b_Broom_Play_01.ogg",
        "attack_sound": "files/KAR_025b_Broom_Attack_01.ogg",
        "image": "files/KAR_025b.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_025b_premium.gif"
    },
    {
        "card_id": "ICC_058",
        "set": "ICECROWN",
        "name": "Brrrloc",
        "collectible": true,
        "flavor_text": "He may be frozen fish, but he fights fresh!",
        "play_sound": "files/VO_ICC_058_Male_Murloc_Play_02.ogg",
        "attack_sound": "files/VO_ICC_058_Male_Murloc_Attack_01.ogg",
        "image": "files/ICC_058.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_058_premium.gif"
    },
    {
        "card_id": "AT_029",
        "set": "TGT",
        "name": "Buccaneer",
        "collectible": true,
        "flavor_text": "The best part of buccaneering is the pants.",
        "play_sound": "files/VO_AT_029_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_029_ATTACK_02.ogg",
        "image": "files/AT_029.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_029_premium.gif"
    },
    {
        "card_id": "CFM_669",
        "set": "GANGS",
        "name": "Burgly Bully",
        "collectible": true,
        "flavor_text": "He only burgles to pay the bills.  He is really just a bully at heart.",
        "play_sound": "files/VO_CFM_669_Male_Trogg_Attack_02.ogg",
        "attack_sound": "files/VO_CFM_669_Male_Trogg_Attack_02.ogg",
        "image": "files/CFM_669.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_669_premium.gif"
    },
    {
        "card_id": "GVG_068",
        "set": "GVG",
        "name": "Burly Rockjaw Trogg",
        "collectible": true,
        "flavor_text": "He's burly because he does CrossFit.",
        "play_sound": "files/VO_GVG_068_Play_01.ogg",
        "attack_sound": "files/VO_GVG_068_Attack_02.ogg",
        "image": "files/GVG_068.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_068_premium.gif"
    },
    {
        "card_id": "OG_280",
        "set": "OG",
        "name": "C'Thun",
        "collectible": true,
        "flavor_text": "C'Thun's least favorite Hearthstone card: Eye for an Eye.",
        "play_sound": "files/VO_OG_280_Male_OldGod_InPlay_12.ogg",
        "attack_sound": "files/VO_OG_280_Male_OldGod_Attack_01.ogg",
        "image": "files/OG_280.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_280_premium.gif"
    },
    {
        "card_id": "OG_283",
        "set": "OG",
        "name": "C'Thun's Chosen",
        "collectible": true,
        "flavor_text": "He gave her a promise ring and everything.",
        "play_sound": "files/VO_OG_283_Female_Undead_Play_01.ogg",
        "attack_sound": "files/VO_OG_283_Female_Undead_Attack_01.ogg",
        "image": "files/OG_283.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_283_premium.gif"
    },
    {
        "card_id": "EX1_091",
        "set": "CLASSIC",
        "name": "Cabal Shadow Priest",
        "collectible": true,
        "flavor_text": "You never know who may be secretly working for the Cabal....",
        "play_sound": "files/VO_EX1_091_Play_01.ogg",
        "attack_sound": "files/VO_EX1_091_Attack_02.ogg",
        "image": "files/EX1_091.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_091_premium.gif"
    },
    {
        "card_id": "EX1_110",
        "set": "CLASSIC",
        "name": "Cairne Bloodhoof",
        "collectible": true,
        "flavor_text": "Cairne was killed by Garrosh, so... don't put this guy in a Warrior deck.  It's pretty insensitive.",
        "play_sound": "files/VO_EX1_110_Play_01.ogg",
        "attack_sound": "files/VO_EX1_110_Attack_02.ogg",
        "image": "files/EX1_110.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_110_premium.gif"
    },
    {
        "card_id": "KAR_025a",
        "set": "KARA",
        "name": "Candle",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/KAR_025a_Candle_Play_01.ogg",
        "attack_sound": "files/KAR_025a_Candle_Attack_01.ogg",
        "image": "files/KAR_025a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_025a_premium.gif"
    },
    {
        "card_id": "NEW1_024",
        "set": "CLASSIC",
        "name": "Captain Greenskin",
        "collectible": true,
        "flavor_text": "He was \u003ci\u003ethis close\u003c/i\u003e to piloting a massive juggernaut into Stormwind Harbor. If it weren't for those pesky kids!",
        "play_sound": "files/VO_NEW1_024_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_024_Attack_02.ogg",
        "image": "files/NEW1_024.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_024_premium.gif"
    },
    {
        "card_id": "NEW1_016",
        "set": "HOF",
        "name": "Captain's Parrot",
        "collectible": true,
        "flavor_text": "Pirates and Parrots go together like Virmen and Carrots.",
        "play_sound": "files/VO_NEW1_016_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_016_Attack_02.ogg",
        "image": "files/NEW1_016.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_016_premium.gif"
    },
    {
        "card_id": "AT_102",
        "set": "TGT",
        "name": "Captured Jormungar",
        "collectible": true,
        "flavor_text": "You can keep him, but you have to promise to feed him and clean out his tank every day!",
        "play_sound": "files/SFX_AT_102_Play.ogg",
        "attack_sound": "files/SFX_AT_102_Attack.ogg",
        "image": "files/AT_102.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_102_premium.gif"
    },
    {
        "card_id": "KAR_004a",
        "set": "KARA",
        "name": "Cat in a Hat",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/CatInAHat_KAR_004a_Play.ogg",
        "attack_sound": "files/CatInAHat_KAR_004a_Attack.ogg",
        "image": "files/KAR_004a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_004a_premium.gif"
    },
    {
        "card_id": "LOEA09_7",
        "set": "LOE",
        "name": "Cauldron",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/LOEA09_7_Cauldron_Play.ogg",
        "attack_sound": "files/LOEA09_7_Cauldron_Attack.ogg",
        "image": "files/LOEA09_7.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA09_7.png"
    },
    {
        "card_id": "CFM_617",
        "set": "GANGS",
        "name": "Celestial Dreamer",
        "collectible": true,
        "flavor_text": "If you think her job is easy, YOU try falling asleep on cue.",
        "play_sound": "files/VO_CFM_617_Female_NightElf_Play_01.ogg",
        "attack_sound": "files/VO_CFM_617_Female_NightElf_Attack_01.ogg",
        "image": "files/CFM_617.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_617_premium.gif"
    },
    {
        "card_id": "KAR_030",
        "set": "KARA",
        "name": "Cellar Spider",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/CellarSpiders_KAR_030_Play.ogg",
        "attack_sound": "files/CellarSpiders_KAR_030_Attack.ogg",
        "image": "files/KAR_030.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_030_premium.gif"
    },
    {
        "card_id": "EX1_573",
        "set": "CLASSIC",
        "name": "Cenarius",
        "collectible": true,
        "flavor_text": "Yes, he's a demigod. No, he doesn't need to wear a shirt.",
        "play_sound": "files/VO_EX1_573_Play_01.ogg",
        "attack_sound": "files/VO_EX1_573_Attack_02.ogg",
        "image": "files/EX1_573.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_573_premium.gif"
    },
    {
        "card_id": "UNG_099",
        "set": "UNGORO",
        "name": "Charged Devilsaur",
        "collectible": true,
        "flavor_text": "What happens when a dinosaur mixes soda and pop rocks.",
        "play_sound": "files/UNG_099_ChargedDevilsaur_Play.ogg",
        "attack_sound": "files/UNG_099_ChargedDevilsaur_Attack.ogg",
        "image": "files/UNG_099.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_099_premium.gif"
    },
    {
        "card_id": "LOEA07_09",
        "set": "LOE",
        "name": "Chasing Trogg",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/LOEA07_09_ChasingTrogg_Play.ogg",
        "attack_sound": "files/LOEA07_09_ChasingTrogg_Attack.ogg",
        "image": "files/LOEA07_09.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA07_09.png"
    },
    {
        "card_id": "Mekka4t",
        "set": "HOF",
        "name": "Chicken",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_Mekka4t_EnterPlay.ogg",
        "attack_sound": "files/SFX_Mekka4t_Attack.ogg",
        "image": "files/Mekka4t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/Mekka4t_premium.gif"
    },
    {
        "card_id": "GVG_092t",
        "set": "GVG",
        "name": "Chicken2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_Mekka4t_EnterPlay.ogg",
        "attack_sound": "files/SFX_Mekka4t_Attack.ogg",
        "image": "files/GVG_092t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_092t_premium.gif"
    },
    {
        "card_id": "ICC_820",
        "set": "ICECROWN",
        "name": "Chillblade Champion",
        "collectible": true,
        "flavor_text": "It slices, it dices, it vaporizes! The Chillblade will make a Champion out of even the lowliest gnome.",
        "play_sound": "files/VO_ICC_820_Male_Gnome_Play_01.ogg",
        "attack_sound": "files/VO_ICC_820_Male_Gnome_Attack_01.ogg",
        "image": "files/ICC_820.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_820_premium.gif"
    },
    {
        "card_id": "AT_123",
        "set": "TGT",
        "name": "Chillmaw",
        "collectible": true,
        "flavor_text": "Chillmaw keeps trying to ruin the Grand Tournament, and she would've done it too, if it weren't for those dang kids!",
        "play_sound": "files/SFX_AT_123_Play_01.ogg",
        "attack_sound": "files/SFX_AT_123_Attack_01.ogg",
        "image": "files/AT_123.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_123_premium.gif"
    },
    {
        "card_id": "CS2_182",
        "set": "BASIC",
        "name": "Chillwind Yeti",
        "collectible": true,
        "flavor_text": "He always dreamed of coming down from the mountains and opening a noodle shop, but he never got the nerve.",
        "play_sound": "files/CS2_182_ChillwindYeti_EnterPlay1.ogg",
        "attack_sound": "files/CS2_182_ChillwindYeti_Attack1.ogg",
        "image": "files/CS2_182.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_182_premium.gif"
    },
    {
        "card_id": "UNG_835",
        "set": "UNGORO",
        "name": "Chittering Tunneler",
        "collectible": true,
        "flavor_text": "Ear to the ground, he carefully interpreted the chittering noises: “You wanna cast a spell? I wanna cast a spell!”",
        "play_sound": "files/ChitteringTunneler_UNG_835_Play.ogg",
        "attack_sound": "files/ChitteringTunneler_UNG_835_Attack.ogg",
        "image": "files/UNG_835.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_835_premium.gif"
    },
    {
        "card_id": "OG_121",
        "set": "OG",
        "name": "Cho'gall",
        "collectible": true,
        "flavor_text": "Even after all this time, Gul'dan still makes Cho'gall go get donuts and coffee.",
        "play_sound": "files/VO_OG_121_Male_Ogre_Play_01.ogg",
        "attack_sound": "files/VO_OG_121_Male_Ogre_Attack_01.ogg",
        "image": "files/OG_121.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_121_premium.gif"
    },
    {
        "card_id": "BRM_031",
        "set": "BRM",
        "name": "Chromaggus",
        "collectible": true,
        "flavor_text": "Left head and right head can never agree about what to eat for dinner, so they always end up just eating ramen again.",
        "play_sound": "files/BRM_031_Chromaggus_EnterPlay_1.ogg",
        "attack_sound": "files/BRM_031_Chromaggus_Attack_1.ogg",
        "image": "files/BRM_031.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_031_premium.gif"
    },
    {
        "card_id": "BRMA12_8t",
        "set": "BRM",
        "name": "Chromatic Dragonkin",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BRMA12_8t_ChromaticDragonkin_EnterPlay_1.ogg",
        "attack_sound": "files/BRMA12_8t_ChromaticDragonkin_Attack_1.ogg",
        "image": "files/BRMA12_8t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA12_8t.png"
    },
    {
        "card_id": "BRMA10_5",
        "set": "BRM",
        "name": "Chromatic Drake",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BRMA10_5_ChromaticDrake_EnterPlay_1.ogg",
        "attack_sound": "files/BRMA10_5_ChromaticDrake_Attack_1.ogg",
        "image": "files/BRMA10_5.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA10_5.png"
    },
    {
        "card_id": "BRMA17_7",
        "set": "BRM",
        "name": "Chromatic Prototype",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BRMA17_7_ChromaticPrototype_EnterPlay_1.ogg",
        "attack_sound": "files/BRMA17_7_ChromaticPrototype_Attack_1.ogg",
        "image": "files/BRMA17_7.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA17_7.png"
    },
    {
        "card_id": "KAR_006",
        "set": "KARA",
        "name": "Cloaked Huntress",
        "collectible": true,
        "flavor_text": "She's practically GIVING your secrets away!",
        "play_sound": "files/VO_KAR_006_Female_Human_Play_01.ogg",
        "attack_sound": "files/VO_KAR_006_Female_Human_Attack_01.ogg",
        "image": "files/KAR_006.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_006_premium.gif"
    },
    {
        "card_id": "GVG_121",
        "set": "GVG",
        "name": "Clockwork Giant",
        "collectible": true,
        "flavor_text": "He and Mountain Giant don't get along.",
        "play_sound": "files/SFX_GVG_121_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_121_Attack.ogg",
        "image": "files/GVG_121.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_121_premium.gif"
    },
    {
        "card_id": "GVG_082",
        "set": "GVG",
        "name": "Clockwork Gnome",
        "collectible": true,
        "flavor_text": "Clockwork gnomes are always asking what time it is.",
        "play_sound": "files/VO_GVG_082_Play_01.ogg",
        "attack_sound": "files/VO_GVG_082_Attack_02.ogg",
        "image": "files/GVG_082.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_082_premium.gif"
    },
    {
        "card_id": "AT_096",
        "set": "TGT",
        "name": "Clockwork Knight",
        "collectible": true,
        "flavor_text": "It takes a lot to wind him up.",
        "play_sound": "files/VO_AT_096_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_096_ATTACK_02.ogg",
        "image": "files/AT_096.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_096_premium.gif"
    },
    {
        "card_id": "UNG_836",
        "set": "UNGORO",
        "name": "Clutchmother Zavas",
        "collectible": true,
        "flavor_text": "A bit of a snob: still refuses to drive anything with automatic transmission.",
        "play_sound": "files/ClutchmotherZavas_UNG_836_Play.ogg",
        "attack_sound": "files/ClutchmotherZavas_UNG_836_Attack.ogg",
        "image": "files/UNG_836.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_836_premium.gif"
    },
    {
        "card_id": "GVG_062",
        "set": "GVG",
        "name": "Cobalt Guardian",
        "collectible": true,
        "flavor_text": "Guardians used to be built out of Adamantium, but production got moved to Gadgetzan and Cobalt was cheap.",
        "play_sound": "files/VO_GVG_062_Play_01.ogg",
        "attack_sound": "files/VO_GVG_062_Attack_02.ogg",
        "image": "files/GVG_062.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_062_premium.gif"
    },
    {
        "card_id": "ICC_029",
        "set": "ICECROWN",
        "name": "Cobalt Scalebane",
        "collectible": true,
        "flavor_text": "You get a sword! And you get a sword! Everybody gets a sword!",
        "play_sound": "files/VO_ICC_029_Female_Troll_Play_01.ogg",
        "attack_sound": "files/VO_ICC_029_Female_Troll_Attack_02.ogg",
        "image": "files/ICC_029.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_029_premium.gif"
    },
    {
        "card_id": "GVG_013",
        "set": "GVG",
        "name": "Cogmaster",
        "collectible": true,
        "flavor_text": "After a while, you don't see the cogs and sprockets. All you see is a robot, a spider tank, a deathray...",
        "play_sound": "files/VO_GVG_069_Play_01.ogg",
        "attack_sound": "files/VO_GVG_069_Attack_02.ogg",
        "image": "files/GVG_013.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_013_premium.gif"
    },
    {
        "card_id": "AT_008",
        "set": "TGT",
        "name": "Coldarra Drake",
        "collectible": true,
        "flavor_text": "The Grand Tournament has a \"No dragons allowed\" policy, but it's rarely enforced.",
        "play_sound": "files/AT_008_ColdarraDrake_Play_1.ogg",
        "attack_sound": "files/AT_008_ColdarraDrake_Attack_1.ogg",
        "image": "files/AT_008.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_008_premium.gif"
    },
    {
        "card_id": "EX1_050",
        "set": "CLASSIC",
        "name": "Coldlight Oracle",
        "collectible": true,
        "flavor_text": "They can see the future.   In that future both players draw more cards.   Spoooky.",
        "play_sound": "files/EX1_050_Coldlight_Oracle_EnterPlay1.ogg",
        "attack_sound": "files/EX1_050_Coldlight_Oracle_Attack1.ogg",
        "image": "files/EX1_050.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_050_premium.gif"
    },
    {
        "card_id": "EX1_103",
        "set": "CLASSIC",
        "name": "Coldlight Seer",
        "collectible": true,
        "flavor_text": "The Coldlight murlocs reside in the darkest pits of the Abyssal Depths.  So no, there's no getting away from murlocs.",
        "play_sound": "files/EX1_103_Coldlight_Seer_EnterPlay1.ogg",
        "attack_sound": "files/EX1_103_Coldlight_Seer_Attack2.ogg",
        "image": "files/EX1_103.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_103_premium.gif"
    },
    {
        "card_id": "ICC_252",
        "set": "ICECROWN",
        "name": "Coldwraith",
        "collectible": true,
        "flavor_text": "He's freezing his bones off!",
        "play_sound": "files/VO_ICC_252_Male_Undead_Play_02.ogg",
        "attack_sound": "files/VO_ICC_252_Male_Undead_Attack_01.ogg",
        "image": "files/ICC_252.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_252_premium.gif"
    },
    {
        "card_id": "AT_110",
        "set": "TGT",
        "name": "Coliseum Manager",
        "collectible": true,
        "flavor_text": "Meets monthly with the gladiators to discuss career goals.",
        "play_sound": "files/VO_AT_110_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_110_ATTACK_ALT1_04.ogg",
        "image": "files/AT_110.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_110_premium.gif"
    },
    {
        "card_id": "AT_018",
        "set": "TGT",
        "name": "Confessor Paletress",
        "collectible": true,
        "flavor_text": "She sees into your past and makes you face your fears.  Most common fear:  Getting Majordomo out of Sneed's Old Shredder.",
        "play_sound": "files/VO_AT_018_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_018_ATTACK_02.ogg",
        "image": "files/AT_018.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_018_premium.gif"
    },
    {
        "card_id": "CS2_201",
        "set": "BASIC",
        "name": "Core Hound",
        "collectible": true,
        "flavor_text": "You don’t tame a Core Hound. You just train it to eat someone else before it eats you.",
        "play_sound": "files/CS2_201_Core_Hound_EnterPlay1.ogg",
        "attack_sound": "files/CS2_201_Core_Hound_Attack2.ogg",
        "image": "files/CS2_201.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_201_premium.gif"
    },
    {
        "card_id": "BRM_014",
        "set": "BRM",
        "name": "Core Rager",
        "collectible": true,
        "flavor_text": "It takes a special kind of hunter to venture deep into a firey lava pit and convince a monster who lives there to come home and be a cuddly housepet.",
        "play_sound": "files/BRM_014_CoreRager_EnterPlay_1.ogg",
        "attack_sound": "files/BRM_014_CoreRager_Attack_1.ogg",
        "image": "files/BRM_014.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_014_premium.gif"
    },
    {
        "card_id": "BRMC_92",
        "set": "TB",
        "name": "Coren Direbrew",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BRMC_92_Coren_Play.ogg",
        "attack_sound": "files/BRMC_92_Coren_Attack.ogg",
        "image": "files/BRMC_92.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMC_92.png"
    },
    {
        "card_id": "UNG_926",
        "set": "UNGORO",
        "name": "Cornered Sentry",
        "collectible": true,
        "flavor_text": "The Draenei are seriously considering cancelling \"Bring Your Murderous Pet to Work Day.\"",
        "play_sound": "files/VO_UNG_926_Female_Draenei_Play_01.ogg",
        "attack_sound": "files/VO_UNG_926_Female_Draenei_Attack_01.ogg",
        "image": "files/UNG_926.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_926_premium.gif"
    },
    {
        "card_id": "ICC_257",
        "set": "ICECROWN",
        "name": "Corpse Raiser",
        "collectible": true,
        "flavor_text": "He was just minding his business, farming corpses, when you meddling adventurers came along.",
        "play_sound": "files/VO_ICC_257_Male_Ymirjar_Play_01.ogg",
        "attack_sound": "files/VO_ICC_257_Male_Ymirjar_Attack_01.ogg",
        "image": "files/ICC_257.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_257_premium.gif"
    },
    {
        "card_id": "ICC_243",
        "set": "ICECROWN",
        "name": "Corpse Widow",
        "collectible": true,
        "flavor_text": "Her marriage survived death, but it decayed pretty quickly after that.",
        "play_sound": "files/VO_ICC_243_Male_Abomination_Play_01.ogg",
        "attack_sound": "files/VO_ICC_243_Male_Abomination_Attack_01.ogg",
        "image": "files/ICC_243.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_243_premium.gif"
    },
    {
        "card_id": "ICC_912",
        "set": "ICECROWN",
        "name": "Corpsetaker",
        "collectible": true,
        "flavor_text": "Her extensive collection of corpses includes one of nearly every type.  She'd love for you to join it.",
        "play_sound": "files/VO_ICC_912_Female_Troll_Play_01.ogg",
        "attack_sound": "files/VO_ICC_912_Female_Troll_Attack_01.ogg",
        "image": "files/ICC_912.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_912_premium.gif"
    },
    {
        "card_id": "BRMA10_4",
        "set": "BRM",
        "name": "Corrupted Egg",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BRMA10_4_CorruptedEgg_EnterPlay.ogg",
        "attack_sound": "files/BRMA10_4_CorruptedEgg_Attack.ogg",
        "image": "files/BRMA10_4.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA10_4.png"
    },
    {
        "card_id": "OG_147",
        "set": "OG",
        "name": "Corrupted Healbot",
        "collectible": true,
        "flavor_text": "Not so much \"corrupted\" as \"has terrible aim\".",
        "play_sound": "files/CorruptedHealbot_OG_147_Play.ogg",
        "attack_sound": "files/CorruptedHealbot_OG_147_Attack.ogg",
        "image": "files/OG_147.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_147_premium.gif"
    },
    {
        "card_id": "OG_161",
        "set": "OG",
        "name": "Corrupted Seer",
        "collectible": true,
        "flavor_text": "For seers, it's very handy to have your crystal ball hanging right in front of your face.",
        "play_sound": "files/OG_161_CorruptedSeer_Play.ogg",
        "attack_sound": "files/OG_161_CorruptedSeer_Attack.ogg",
        "image": "files/OG_161.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_161_premium.gif"
    },
    {
        "card_id": "UNG_915",
        "set": "UNGORO",
        "name": "Crackling Razormaw",
        "collectible": true,
        "flavor_text": "Wasn't clever enough to go AROUND the electric fence.",
        "play_sound": "files/UNG_915_CleverRazormaw_Play.ogg",
        "attack_sound": "files/UNG_915_CleverRazormaw_Attack.ogg",
        "image": "files/UNG_915.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_915_premium.gif"
    },
    {
        "card_id": "EX1_059",
        "set": "CLASSIC",
        "name": "Crazed Alchemist",
        "collectible": true,
        "flavor_text": "\"You'll \u003ci\u003elove\u003c/i\u003e my new recipe!\" he says... especially if you're not happy with your current number of limbs.",
        "play_sound": "files/VO_EX1_059_Play_01.ogg",
        "attack_sound": "files/VO_EX1_059_Attack_02.ogg",
        "image": "files/EX1_059.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_059_premium.gif"
    },
    {
        "card_id": "TU4d_002",
        "set": "MISSIONS",
        "name": "Crazed Hunter",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_TU4d_002_Play_01.ogg",
        "attack_sound": "files/VO_TU4d_002_Play_01.ogg",
        "image": "files/TU4d_002.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/TU4d_002.png"
    },
    {
        "card_id": "OG_321",
        "set": "OG",
        "name": "Crazed Worshipper",
        "collectible": true,
        "flavor_text": "Every month they share a pancake breakfast with the Perfectly Rational Worshippers.",
        "play_sound": "files/VO_OG_321_Male_Dwarf_Play_01.ogg",
        "attack_sound": "files/VO_OG_321_Male_Dwarf_Attack_01.ogg",
        "image": "files/OG_321.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_321_premium.gif"
    },
    {
        "card_id": "TU4f_007",
        "set": "MISSIONS",
        "name": "Crazy Monkey",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/MONKEY_ENTER_PLAY_02.ogg",
        "attack_sound": "files/MONKEY_ENTER_PLAY_02.ogg",
        "image": "files/TU4f_007.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/TU4f_007.png"
    },
    {
        "card_id": "AT_121",
        "set": "TGT",
        "name": "Crowd Favorite",
        "collectible": true,
        "flavor_text": "The crowd ALWAYS yells lethal.",
        "play_sound": "files/VO_AT_121_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_121_ATTACK_02.ogg",
        "image": "files/AT_121.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_121_premium.gif"
    },
    {
        "card_id": "UNG_830",
        "set": "UNGORO",
        "name": "Cruel Dinomancer",
        "collectible": true,
        "flavor_text": "As that old saying goes: \"you don't get into dinomancing to make friends.\"",
        "play_sound": "files/VO_UNG_830_Female_Saurok_Play_01.ogg",
        "attack_sound": "files/VO_UNG_830_Female_Saurok_Attack_01.ogg",
        "image": "files/UNG_830.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_830_premium.gif"
    },
    {
        "card_id": "EX1_603",
        "set": "CLASSIC",
        "name": "Cruel Taskmaster",
        "collectible": true,
        "flavor_text": "\"I'm going to need you to come in on Sunday.\" - Cruel Taskmaster",
        "play_sound": "files/VO_EX1_603_Play_01.ogg",
        "attack_sound": "files/VO_EX1_603_Attack_02.ogg",
        "image": "files/EX1_603.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_603_premium.gif"
    },
    {
        "card_id": "CFM_671",
        "set": "GANGS",
        "name": "Cryomancer",
        "collectible": true,
        "flavor_text": "She loves Frozen. I mean who doesn't?",
        "play_sound": "files/VO_CFM_671_Female_Wretched_Play_03.ogg",
        "attack_sound": "files/VO_CFM_671_Female_Wretched_Attack_01.ogg",
        "image": "files/CFM_671.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_671_premium.gif"
    },
    {
        "card_id": "ICC_808",
        "set": "ICECROWN",
        "name": "Crypt Lord",
        "collectible": true,
        "flavor_text": "The original fifth beetle!",
        "play_sound": "files/VO_ICC_808_Male_Tauren_Play_01.ogg",
        "attack_sound": "files/VO_ICC_808_Male_Tauren_Attack_02.ogg",
        "image": "files/ICC_808.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_808_premium.gif"
    },
    {
        "card_id": "CFM_606t",
        "set": "GANGS",
        "name": "Crystal",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/CFM_606t_CrystalShard_Play.ogg",
        "attack_sound": "files/CFM_606t_CrystalShard_Attack.ogg",
        "image": "files/CFM_606t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_606t_premium.gif"
    },
    {
        "card_id": "UNG_032",
        "set": "UNGORO",
        "name": "Crystalline Oracle",
        "collectible": true,
        "flavor_text": "Being made of light has its disadvantages, but at least it's always looking on the bright side.",
        "play_sound": "files/LivingLight_UNG_032_Play.ogg",
        "attack_sound": "files/LivingLight_UNG_032_Attack.ogg",
        "image": "files/UNG_032.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_032_premium.gif"
    },
    {
        "card_id": "CFM_610",
        "set": "GANGS",
        "name": "Crystalweaver",
        "collectible": true,
        "flavor_text": "The trick is soaking the crystals in warm milk to soften them up.",
        "play_sound": "files/VO_CFM_610_Male_Dranei_Play_01.ogg",
        "attack_sound": "files/VO_CFM_610_Male_Dranei_Attack_01.ogg",
        "image": "files/CFM_610.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_610_premium.gif"
    },
    {
        "card_id": "OG_295",
        "set": "OG",
        "name": "Cult Apothecary",
        "collectible": true,
        "flavor_text": "Cults need pharmacists too.",
        "play_sound": "files/VO_OG_295_Male_Worgen_Play_01.ogg",
        "attack_sound": "files/VO_OG_295_Male_Worgen_Attack_01.ogg",
        "image": "files/OG_295.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_295_premium.gif"
    },
    {
        "card_id": "EX1_595",
        "set": "CLASSIC",
        "name": "Cult Master",
        "collectible": true,
        "flavor_text": "She may be an evil cult master, but she still calls her parents once a week.",
        "play_sound": "files/VO_EX1_595_Play_01.ogg",
        "attack_sound": "files/VO_EX1_595_Attack_02.ogg",
        "image": "files/EX1_595.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_595_premium.gif"
    },
    {
        "card_id": "OG_303",
        "set": "OG",
        "name": "Cult Sorcerer",
        "collectible": true,
        "flavor_text": "No matter how many times we tell her not to, she keeps feeding C'Thun scraps under the table.",
        "play_sound": "files/VO_OG_303_Female_Human_Play_01.ogg",
        "attack_sound": "files/VO_OG_303_Female_Human_Attack_01.ogg",
        "image": "files/OG_303.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_303_premium.gif"
    },
    {
        "card_id": "KAR_A02_05",
        "set": "KARA",
        "name": "Cup",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KAR_A02_05_Female_Cup_Play_01.ogg",
        "attack_sound": "files/VO_KAR_A02_05_Female_Cup_Attack_01.ogg",
        "image": "files/KAR_A02_05.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KAR_A02_05.png"
    },
    {
        "card_id": "UNG_035",
        "set": "UNGORO",
        "name": "Curious Glimmerroot",
        "collectible": true,
        "flavor_text": "George promised to be good. But it's easy for little Glimmerroots to forget.",
        "play_sound": "files/CuriousGlimmerroot_UNG_035_Play.ogg",
        "attack_sound": "files/CuriousGlimmerroot_UNG_035_Attack.ogg",
        "image": "files/UNG_035.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_035_premium.gif"
    },
    {
        "card_id": "AT_031",
        "set": "TGT",
        "name": "Cutpurse",
        "collectible": true,
        "flavor_text": "He has a giant collection of purses now.  One for every outfit!",
        "play_sound": "files/VO_AT_031_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_031_ATTACK_02.ogg",
        "image": "files/AT_031.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_031_premium.gif"
    },
    {
        "card_id": "OG_337",
        "set": "OG",
        "name": "Cyclopian Horror",
        "collectible": true,
        "flavor_text": "What are the qualifications for being a 'Horror?'  Just how horrible do you have to be?",
        "play_sound": "files/OG_337_CyclopianHorror_Play.ogg",
        "attack_sound": "files/OG_337_CyclopianHorror_Attack.ogg",
        "image": "files/OG_337.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_337_premium.gif"
    },
    {
        "card_id": "AT_006",
        "set": "TGT",
        "name": "Dalaran Aspirant",
        "collectible": true,
        "flavor_text": "Is he aspiring or inspiring?  Make up your mind!",
        "play_sound": "files/VO_AT_006_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_006_ATTACK_02.ogg",
        "image": "files/AT_006.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_006_premium.gif"
    },
    {
        "card_id": "EX1_582",
        "set": "BASIC",
        "name": "Dalaran Mage",
        "collectible": true,
        "flavor_text": "You don't see a lot of Dalaran warriors.",
        "play_sound": "files/VO_EX1_582_Play_01.ogg",
        "attack_sound": "files/VO_EX1_582_Attack_02.ogg",
        "image": "files/EX1_582.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_582_premium.gif"
    },
    {
        "card_id": "skele21",
        "set": "CLASSIC",
        "name": "Damaged Golem",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_skele21_EnterPlay.ogg",
        "attack_sound": "files/SFX_skele21_Attack.ogg",
        "image": "files/skele21.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/skele21_premium.gif"
    },
    {
        "card_id": "FP1_029",
        "set": "NAXX",
        "name": "Dancing Swords",
        "collectible": true,
        "flavor_text": "They like to dance to reggae.",
        "play_sound": "files/FP1_029_DancingSwords_EnterPlay.ogg",
        "attack_sound": "files/FP1_029_DancingSwords_Attack.ogg",
        "image": "files/FP1_029.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_029_premium.gif"
    },
    {
        "card_id": "CFM_851",
        "set": "GANGS",
        "name": "Daring Reporter",
        "collectible": true,
        "flavor_text": "She's working on a story!  While skydiving!",
        "play_sound": "files/VO_CFM_851_Female_NightElf_Play_01.ogg",
        "attack_sound": "files/VO_CFM_851_Female_NightElf_Attack_01.ogg",
        "image": "files/CFM_851.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_851_premium.gif"
    },
    {
        "card_id": "ICC_829t5",
        "set": "ICECROWN",
        "name": "Darion Mograine",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_ICC_829t5_Male_Human_Play_01.ogg",
        "attack_sound": "files/VO_ICC_829t5_Male_Human_Attack_02.ogg",
        "image": "files/ICC_829t5.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_829t5_premium.gif"
    },
    {
        "card_id": "OG_293",
        "set": "OG",
        "name": "Dark Arakkoa",
        "collectible": true,
        "flavor_text": "There's a whole gradient of Arakkoa! This one is on the darker side.",
        "play_sound": "files/VO_OG_293_Male_Arakkoa_Play_01.ogg",
        "attack_sound": "files/VO_OG_293_Male_Arakkoa_Attack_01.ogg",
        "image": "files/OG_293.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_293_premium.gif"
    },
    {
        "card_id": "FP1_023",
        "set": "NAXX",
        "name": "Dark Cultist",
        "collectible": true,
        "flavor_text": "The Cult of the Damned has found it's best not to mention their name when recruiting new cultists.",
        "play_sound": "files/VO_FP1_023_EnterPlay_01.ogg",
        "attack_sound": "files/VO_FP1_023_Attack_02.ogg",
        "image": "files/FP1_023.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_023_premium.gif"
    },
    {
        "card_id": "BRMA01_3",
        "set": "BRM",
        "name": "Dark Iron Bouncer",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_BRMA01_3_Play_01.ogg",
        "attack_sound": "files/VO_BRMA01_3_Attack_02.ogg",
        "image": "files/BRMA01_3.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA01_3.png"
    },
    {
        "card_id": "EX1_046",
        "set": "CLASSIC",
        "name": "Dark Iron Dwarf",
        "collectible": true,
        "flavor_text": "Guardians of Dark Iron Ore.  Perhaps the most annoying ore, given where you have to forge it.",
        "play_sound": "files/VO_EX1_046_Play_01.ogg",
        "attack_sound": "files/VO_EX1_046_Attack_02.ogg",
        "image": "files/EX1_046.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_046_premium.gif"
    },
    {
        "card_id": "BRM_008",
        "set": "BRM",
        "name": "Dark Iron Skulker",
        "collectible": true,
        "flavor_text": "He loves skulking. He skulks after hours just for the joy of it, but his friends are pretty worried he'll get burnt out.",
        "play_sound": "files/VO_BRM_008_Play_01.ogg",
        "attack_sound": "files/VO_BRM_008_Attack_02.ogg",
        "image": "files/BRM_008.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_008_premium.gif"
    },
    {
        "card_id": "BRMA02_2t",
        "set": "BRM",
        "name": "Dark Iron Spectator",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_BRMA02_2t_Play_01.ogg",
        "attack_sound": "files/VO_BRMA02_2t_Attack_02.ogg",
        "image": "files/BRMA02_2t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA02_2t.png"
    },
    {
        "card_id": "LOE_023",
        "set": "LOE",
        "name": "Dark Peddler",
        "collectible": true,
        "flavor_text": "I'm offering you a bargain here!  This amazing vacuum cleaner for your soul!",
        "play_sound": "files/VO_LOE_023_Play_01.ogg",
        "attack_sound": "files/VO_LOE_023_Attack_02.ogg",
        "image": "files/LOE_023.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_023_premium.gif"
    },
    {
        "card_id": "DS1_055",
        "set": "BASIC",
        "name": "Darkscale Healer",
        "collectible": true,
        "flavor_text": "Healing is just something she does in her free time.  It's more of a hobby really.",
        "play_sound": "files/VO_DS1_055_Play_01.ogg",
        "attack_sound": "files/VO_DS1_055_Attack_02.ogg",
        "image": "files/DS1_055.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/DS1_055_premium.gif"
    },
    {
        "card_id": "OG_234",
        "set": "OG",
        "name": "Darkshire Alchemist",
        "collectible": true,
        "flavor_text": "The secret ingredient: liquified funnel cake.",
        "play_sound": "files/VO_OG_234_Female_Human_Play_01.ogg",
        "attack_sound": "files/VO_OG_234_Female_Human_Attack_01.ogg",
        "image": "files/OG_234.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_234_premium.gif"
    },
    {
        "card_id": "OG_113",
        "set": "OG",
        "name": "Darkshire Councilman",
        "collectible": true,
        "flavor_text": "Democracy in action!",
        "play_sound": "files/VO_OG_113_Male_Human_Play_01.ogg",
        "attack_sound": "files/VO_OG_113_Male_Human_Attack_01.ogg",
        "image": "files/OG_113.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_113_premium.gif"
    },
    {
        "card_id": "OG_109",
        "set": "OG",
        "name": "Darkshire Librarian",
        "collectible": true,
        "flavor_text": "Do NOT be late with your overdue fines.",
        "play_sound": "files/VO_OG_109_Female_Human_Play_01.ogg",
        "attack_sound": "files/VO_OG_109_Female_Human_Attack_01.ogg",
        "image": "files/OG_109.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_109_premium.gif"
    },
    {
        "card_id": "OG_102",
        "set": "OG",
        "name": "Darkspeaker",
        "collectible": true,
        "flavor_text": "People often think that Darkspeaker is the arch nemesis of Lightspeaker, but that title actually belongs to Heavyspeaker.",
        "play_sound": "files/Darkspeaker_OG_102_Play.ogg",
        "attack_sound": "files/Darkspeaker_OG_102_Attack.ogg",
        "image": "files/OG_102.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_102_premium.gif"
    },
    {
        "card_id": "AT_038",
        "set": "TGT",
        "name": "Darnassus Aspirant",
        "collectible": true,
        "flavor_text": "She loves mana crystals, she hates mana crystals.   So fickle!",
        "play_sound": "files/VO_AT_038_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_038_ATTACK_02.ogg",
        "image": "files/AT_038.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_038_premium.gif"
    },
    {
        "card_id": "KAR_094",
        "set": "KARA",
        "name": "Deadly Fork",
        "collectible": true,
        "flavor_text": "For a proper setting, place the deadly fork \u003ci\u003eafter\u003c/i\u003e the salad fork, but \u003ci\u003ebefore\u003c/i\u003e the dinner fork.",
        "play_sound": "files/VO_KAR_094_Male_Fork_Play_02.ogg",
        "attack_sound": "files/VO_KAR_094_Male_Fork_Attack_02.ogg",
        "image": "files/KAR_094.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_094_premium.gif"
    },
    {
        "card_id": "ICC_220",
        "set": "ICECROWN",
        "name": "Deadscale Knight",
        "collectible": true,
        "flavor_text": "His favorite spell is Chum Explosion.",
        "play_sound": "files/VO_ICC_220_Male_Murloc_Play_01.ogg",
        "attack_sound": "files/VO_ICC_220_Male_Murloc_Attack_01.ogg",
        "image": "files/ICC_220.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_220_premium.gif"
    },
    {
        "card_id": "ICC_450",
        "set": "ICECROWN",
        "name": "Death Revenant",
        "collectible": true,
        "flavor_text": "How's everyone doing? Hurt? Bleeding? Wounded? ... Excellent.",
        "play_sound": "files/VO_ICC_450_Male_Spirit_Play_01.ogg",
        "attack_sound": "files/VO_ICC_450_Male_Spirit_Attack_01.ogg",
        "image": "files/ICC_450.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_450_premium.gif"
    },
    {
        "card_id": "ICC_810",
        "set": "ICECROWN",
        "name": "Deathaxe Punisher",
        "collectible": true,
        "flavor_text": "Don't fear the Arcanite Reaper.",
        "play_sound": "files/VO_ICC_810_Male_Undead_Play_01.ogg",
        "attack_sound": "files/VO_ICC_810_Male_Undead_Attack_02.ogg",
        "image": "files/ICC_810.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_810_premium.gif"
    },
    {
        "card_id": "FP1_006",
        "set": "NAXX",
        "name": "Deathcharger",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_FP1_006_EnterPlay.ogg",
        "attack_sound": "files/SFX_FP1_006_Attack.ogg",
        "image": "files/FP1_006.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_006_premium.gif"
    },
    {
        "card_id": "FP1_009",
        "set": "NAXX",
        "name": "Deathlord",
        "collectible": true,
        "flavor_text": "\"Rise from your grave!\" - Kel'Thuzad",
        "play_sound": "files/VO_FP1_009_EnterPlay_01.ogg",
        "attack_sound": "files/VO_FP1_009_Attack_02.ogg",
        "image": "files/FP1_009.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_009_premium.gif"
    },
    {
        "card_id": "ICC_829t2",
        "set": "ICECROWN",
        "name": "Deathlord Nazgrim",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_ICC_829t2_Male_Orc_Play_02.ogg",
        "attack_sound": "files/VO_ICC_829t2_Male_Orc_Attack_01.ogg",
        "image": "files/ICC_829t2.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_829t2_premium.gif"
    },
    {
        "card_id": "ICC_467",
        "set": "ICECROWN",
        "name": "Deathspeaker",
        "collectible": true,
        "flavor_text": "It helps to speak really, really loud.",
        "play_sound": "files/VO_ICC_467_Female_Nerubian_Play_01.ogg",
        "attack_sound": "files/VO_ICC_467_Female_Nerubian_Attack_01.ogg",
        "image": "files/ICC_467.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_467_premium.gif"
    },
    {
        "card_id": "NEW1_030",
        "set": "CLASSIC",
        "name": "Deathwing",
        "collectible": true,
        "flavor_text": "Once a noble dragon known as Neltharion, Deathwing lost his mind and shattered Azeroth before finally being defeated.  Daddy issues?",
        "play_sound": "files/VO_NEW1_030_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_030_Attack_02.ogg",
        "image": "files/NEW1_030.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_030_premium.gif"
    },
    {
        "card_id": "OG_317",
        "set": "OG",
        "name": "Deathwing, Dragonlord",
        "collectible": true,
        "flavor_text": "To his credit, Deathwing really took to heart the feedback he was receiving that he needed to be \"more of a team player\".",
        "play_sound": "files/VO_OG_317_Male_Dragon_Play_01.ogg",
        "attack_sound": "files/VO_OG_317_Male_Dragon_Attack_01.ogg",
        "image": "files/OG_317.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_317_premium.gif"
    },
    {
        "card_id": "LOEA07_11",
        "set": "LOE",
        "name": "Debris",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/LOEA07_11_Debris_Play.ogg",
        "attack_sound": "files/LOEA07_11_Debris_Attack.ogg",
        "image": "files/LOEA07_11.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA07_11.png"
    },
    {
        "card_id": "EX1_130a",
        "set": "CLASSIC",
        "name": "Defender",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_EX1_130a_Play_01.ogg",
        "attack_sound": "files/VO_EX1_130a_Attack_02.ogg",
        "image": "files/EX1_130a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_130a_premium.gif"
    },
    {
        "card_id": "EX1_093",
        "set": "CLASSIC",
        "name": "Defender of Argus",
        "collectible": true,
        "flavor_text": "You wouldn’t think that Argus would need this much defending.  But it does.",
        "play_sound": "files/VO_EX1_093_Play_01.ogg",
        "attack_sound": "files/VO_EX1_093_Attack_02.ogg",
        "image": "files/EX1_093.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_093_premium.gif"
    },
    {
        "card_id": "EX1_131t",
        "set": "CLASSIC",
        "name": "Defias Bandit",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_EX1_131t_Play_01.ogg",
        "attack_sound": "files/VO_EX1_131t_Attack_02.ogg",
        "image": "files/EX1_131t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_131t_premium.gif"
    },
    {
        "card_id": "CFM_855",
        "set": "GANGS",
        "name": "Defias Cleaner",
        "collectible": true,
        "flavor_text": "His house cleaning service is quite thorough.  Not a spot to be found... or any of your stuff!",
        "play_sound": "files/VO_CFM_855_Male_Human_Play_01.ogg",
        "attack_sound": "files/VO_CFM_855_Male_Human_Attack_01.ogg",
        "image": "files/CFM_855.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_855_premium.gif"
    },
    {
        "card_id": "EX1_131",
        "set": "CLASSIC",
        "name": "Defias Ringleader",
        "collectible": true,
        "flavor_text": "He stole the deed to town years ago, so technically the town \u003ci\u003eis\u003c/i\u003e his. He just calls people Scrub to be mean.",
        "play_sound": "files/VO_EX1_131_Play_01.ogg",
        "attack_sound": "files/VO_EX1_131_Attack_02.ogg",
        "image": "files/EX1_131.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_131_premium.gif"
    },
    {
        "card_id": "OG_085",
        "set": "OG",
        "name": "Demented Frostcaller",
        "collectible": true,
        "flavor_text": "He prefers that you refer to him by his nickname: 'Frostwaker.'",
        "play_sound": "files/VO_OG_085_Androgynous _Faceless_Play_02.ogg",
        "attack_sound": "files/VO_OG_085_Androgynous _Faceless_Attack_01.ogg",
        "image": "files/OG_085.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_085_premium.gif"
    },
    {
        "card_id": "EX1_102",
        "set": "CLASSIC",
        "name": "Demolisher",
        "collectible": true,
        "flavor_text": "Laying siege isn't fun for anyone.  It's not even all that effective, now that everyone has a flying mount.",
        "play_sound": "files/SFX_EX1_102_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_102_Attack.ogg",
        "image": "files/EX1_102.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_102_premium.gif"
    },
    {
        "card_id": "LOE_020",
        "set": "LOE",
        "name": "Desert Camel",
        "collectible": true,
        "flavor_text": "Dang.  This card is sweet.  Almost as sweet as Dessert Camel.",
        "play_sound": "files/SFX_LOE_020_Play.ogg",
        "attack_sound": "files/SFX_LOE_020_Attack.ogg",
        "image": "files/LOE_020.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_020_premium.gif"
    },
    {
        "card_id": "ICC_075",
        "set": "ICECROWN",
        "name": "Despicable Dreadlord",
        "collectible": true,
        "flavor_text": "He's deathspicable.",
        "play_sound": "files/VO_ICC_075_Male_Dreadlord_Play_01.ogg",
        "attack_sound": "files/VO_ICC_075_Male_Dreadlord_Attack_02.ogg",
        "image": "files/ICC_075.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_075_premium.gif"
    },
    {
        "card_id": "EX1_tk29",
        "set": "CLASSIC",
        "name": "Devilsaur",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_EX1_tk29_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_tk29_Attack.ogg",
        "image": "files/EX1_tk29.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_tk29_premium.gif"
    },
    {
        "card_id": "UNG_083t1",
        "set": "UNGORO",
        "name": "Devilsaur2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/UNG_083t1_Devilsaur_Play.ogg",
        "attack_sound": "files/UNG_083t1_Devilsaur_Attack.ogg",
        "image": "files/UNG_083t1.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_083t1_premium.gif"
    },
    {
        "card_id": "UNG_083",
        "set": "UNGORO",
        "name": "Devilsaur Egg",
        "collectible": true,
        "flavor_text": "A key ingredient in all discerning Funnel Cake recipes.",
        "play_sound": "files/DevilsaurEgg_UNG_083_Play.ogg",
        "attack_sound": "files/DevilsaurEgg_UNG_083_Attack.ogg",
        "image": "files/UNG_083.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_083_premium.gif"
    },
    {
        "card_id": "EX1_162",
        "set": "CLASSIC",
        "name": "Dire Wolf Alpha",
        "collectible": true,
        "flavor_text": "We are pretty excited about the upcoming release of Dire Wolf Beta, just repost this sign for a chance at a key.",
        "play_sound": "files/SFX_EX1_162_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_162_Attack.ogg",
        "image": "files/EX1_162.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_162_premium.gif"
    },
    {
        "card_id": "UNG_957",
        "set": "UNGORO",
        "name": "Direhorn Hatchling",
        "collectible": true,
        "flavor_text": "His mom could beat up your mom.",
        "play_sound": "files/UNG_957_DirehornHatchling_Play.ogg",
        "attack_sound": "files/UNG_957_DirehornHatchling_Attack.ogg",
        "image": "files/UNG_957.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_957_premium.gif"
    },
    {
        "card_id": "UNG_957t1",
        "set": "UNGORO",
        "name": "Direhorn Matriarch",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/UNG_957t1_DirehornMatriarch_Play.ogg",
        "attack_sound": "files/UNG_957t1_DirehornMatriarch_Attack.ogg",
        "image": "files/UNG_957t1.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_957t1_premium.gif"
    },
    {
        "card_id": "CFM_790",
        "set": "GANGS",
        "name": "Dirty Rat",
        "collectible": true,
        "flavor_text": "It's not his fault…  Someone keeps stealing his soap!",
        "play_sound": "files/VO_CFM_790_Male_Kobold_Play_03.ogg",
        "attack_sound": "files/VO_CFM_790_Male_Kobold_Attack_01.ogg",
        "image": "files/CFM_790.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_790_premium.gif"
    },
    {
        "card_id": "OG_162",
        "set": "OG",
        "name": "Disciple of C'Thun",
        "collectible": true,
        "flavor_text": "C’Thun’s recruiting pitch involves cookies, which is why it’s the most popular Old God.",
        "play_sound": "files/VO_OG_162_Male_Panderan_Play_01.ogg",
        "attack_sound": "files/VO_OG_162_Male_Panderan_Attack_01.ogg",
        "image": "files/OG_162.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_162_premium.gif"
    },
    {
        "card_id": "LOE_053",
        "set": "LOE",
        "name": "Djinni of Zephyrs",
        "collectible": true,
        "flavor_text": "If you want your wish granted, don't rub him the wrong way.",
        "play_sound": "files/VO_LOE_053_Play_01.ogg",
        "attack_sound": "files/VO_LOE_053_Attack_02.ogg",
        "image": "files/LOE_053.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_053_premium.gif"
    },
    {
        "card_id": "CFM_685",
        "set": "GANGS",
        "name": "Don Han'Cho",
        "collectible": true,
        "flavor_text": "The brilliant mastermind of the Grimy Goons, Han sometimes thinks about ditching the idiot Cho, but that would just tear him apart.",
        "play_sound": "files/VO_CFM_685_Male_Ogre_Play_01_Hon.ogg",
        "attack_sound": "files/VO_CFM_685_Male_Ogre_Attack_01_Hon.ogg",
        "image": "files/CFM_685.gif",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_685_premium.gif"
    },
    {
        "card_id": "OG_255",
        "set": "OG",
        "name": "Doomcaller",
        "collectible": true,
        "flavor_text": "\"Hello, is Doom there? No? Can I leave a message?\"",
        "play_sound": "files/VO_OG_255_Male_Orc_Play_01.ogg",
        "attack_sound": "files/VO_OG_255_Male_Orc_Attack_01.ogg",
        "image": "files/OG_255.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_255_premium.gif"
    },
    {
        "card_id": "ICC_083",
        "set": "ICECROWN",
        "name": "Doomed Apprentice",
        "collectible": true,
        "flavor_text": "Jaina was never good at keeping up apprentices.",
        "play_sound": "files/VO_ICC_083_Female_Gnome_Play_01.ogg",
        "attack_sound": "files/VO_ICC_083_Female_Gnome_Attack_02.ogg",
        "image": "files/ICC_083.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_083_premium.gif"
    },
    {
        "card_id": "EX1_310",
        "set": "CLASSIC",
        "name": "Doomguard",
        "collectible": true,
        "flavor_text": "Summoning a doomguard is risky. \u003ci\u003eSomeone\u003c/i\u003e is going to die.",
        "play_sound": "files/VO_EX1_310_Play_01.ogg",
        "attack_sound": "files/VO_EX1_310_Attack_02.ogg",
        "image": "files/EX1_310.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_310_premium.gif"
    },
    {
        "card_id": "NEW1_021",
        "set": "CLASSIC",
        "name": "Doomsayer",
        "collectible": true,
        "flavor_text": "He's almost been right so many times. He was \u003ci\u003esure\u003c/i\u003e it was coming during the Cataclysm.",
        "play_sound": "files/VO_NEW1_021_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_021_Attack_02.ogg",
        "image": "files/NEW1_021.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_021_premium.gif"
    },
    {
        "card_id": "CFM_668t",
        "set": "GANGS",
        "name": "Doppelgangster",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_CFM_668t_Male_Faceless_Play_05.ogg",
        "attack_sound": "files/VO_CFM_668t_Male_Faceless_Attack_01.ogg",
        "image": "files/CFM_668t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_668t_premium.gif"
    },
    {
        "card_id": "CFM_668",
        "set": "GANGS",
        "name": "Doppelgangster2",
        "collectible": true,
        "flavor_text": "\"Every me, get in here!\"",
        "play_sound": "files/VO_CFM_668_Male_Dwarf_Play_02.ogg",
        "attack_sound": "files/VO_CFM_668_Male_Dwarf_Attack_02.ogg",
        "image": "files/CFM_668.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_668_premium.gif"
    },
    {
        "card_id": "CFM_668t2",
        "set": "GANGS",
        "name": "Doppelgangster3",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_CFM_668t2_Male_Faceless_Play_05.ogg",
        "attack_sound": "files/VO_CFM_668t2_Male_Faceless_Attack_02.ogg",
        "image": "files/CFM_668t2.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_668t2_premium.gif"
    },
    {
        "card_id": "KARA_04_01",
        "set": "KARA",
        "name": "Dorothee",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KARA_04_01_Female_Human_Play_01.ogg",
        "attack_sound": "files/VO_KARA_04_01_Female_Human_Attack_01.ogg",
        "image": "files/KARA_04_01.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KARA_04_01.png"
    },
    {
        "card_id": "GVG_110",
        "set": "GVG",
        "name": "Dr. Boom",
        "collectible": true,
        "flavor_text": "MARVEL AT HIS MIGHT!",
        "play_sound": "files/GVG_110_DrBoom_Play.ogg",
        "attack_sound": "files/GVG_110_DrBoom_Attack.ogg",
        "image": "files/GVG_110.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_110_premium.gif"
    },
    {
        "card_id": "AT_047",
        "set": "TGT",
        "name": "Draenei Totemcarver",
        "collectible": true,
        "flavor_text": "It's nice to find a real craftsman in this day and age of mass-produced totems.",
        "play_sound": "files/VO_AT_047_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_047_ATTACK_02.ogg",
        "image": "files/AT_047.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_047_premium.gif"
    },
    {
        "card_id": "BRM_018",
        "set": "BRM",
        "name": "Dragon Consort",
        "collectible": true,
        "flavor_text": "Everybody wants someone to snuggle with. Even giant armored scaly draconic beasts of destruction.",
        "play_sound": "files/BRM_018_DragonConsort_EnterPlay_1.ogg",
        "attack_sound": "files/BRM_018_DragonConsort_Attack_1.ogg",
        "image": "files/BRM_018.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_018_premium.gif"
    },
    {
        "card_id": "BRM_022",
        "set": "BRM",
        "name": "Dragon Egg",
        "collectible": true,
        "flavor_text": "Think of them as bullets for your dragon gun.",
        "play_sound": "files/BRM_022_4 DragonEgg_EnterPlay_1.ogg",
        "attack_sound": "files/BRM_022_4 DragonEgg_Attack_1.ogg",
        "image": "files/BRM_022.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_022_premium.gif"
    },
    {
        "card_id": "AT_083",
        "set": "TGT",
        "name": "Dragonhawk Rider",
        "collectible": true,
        "flavor_text": "Check it out.  You can do barrel rolls on this thing.",
        "play_sound": "files/VO_AT_083_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_083_ATTACK_02.ogg",
        "image": "files/AT_083.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_083_premium.gif"
    },
    {
        "card_id": "BRMA09_4t",
        "set": "BRM",
        "name": "Dragonkin",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BRMA09_4t_Dragonkin_EnterPlay_1.ogg",
        "attack_sound": "files/BRMA09_4t_Dragonkin_Attack_1.ogg",
        "image": "files/BRMA09_4t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA09_4t.png"
    },
    {
        "card_id": "BRM_020",
        "set": "BRM",
        "name": "Dragonkin Sorcerer",
        "collectible": true,
        "flavor_text": "Dragonkin Sorcerers be all \"I'm a wizard\" and everyone else be all \"daaaaang\".",
        "play_sound": "files/VO_BRM_020_Play_01.ogg",
        "attack_sound": "files/VO_BRM_020_Attack_02.ogg",
        "image": "files/BRM_020.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_020_premium.gif"
    },
    {
        "card_id": "EX1_025",
        "set": "BASIC",
        "name": "Dragonling Mechanic",
        "collectible": true,
        "flavor_text": "She is still working on installing the rocket launcher add-on for Mr. Bitey.",
        "play_sound": "files/VO_EX1_025_Play_01.ogg",
        "attack_sound": "files/VO_EX1_025_Attack_02.ogg",
        "image": "files/EX1_025.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_025_premium.gif"
    },
    {
        "card_id": "ICC_081",
        "set": "ICECROWN",
        "name": "Drakkari Defender",
        "collectible": true,
        "flavor_text": "Sometimes, the best defense is an offensive troll.",
        "play_sound": "files/VO_ICC_081_Male_Troll_Play_02.ogg",
        "attack_sound": "files/VO_ICC_081_Male_Troll_Attack_02.ogg",
        "image": "files/ICC_081.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_081_premium.gif"
    },
    {
        "card_id": "ICC_901",
        "set": "ICECROWN",
        "name": "Drakkari Enchanter",
        "collectible": true,
        "flavor_text": "Drakkari sorceresses have the irritating habit of repeating themselves at the end of every sentence. Every sentence.",
        "play_sound": "files/VO_ICC_901_Male_Ghoul_Play_01.ogg",
        "attack_sound": "files/VO_ICC_901_Male_Ghoul_Attack_01.ogg",
        "image": "files/ICC_901.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_901_premium.gif"
    },
    {
        "card_id": "BRM_024",
        "set": "BRM",
        "name": "Drakonid Crusher",
        "collectible": true,
        "flavor_text": "Drakonids were created to have all the bad parts of a dragon in the form of a humanoid. But, like, why?",
        "play_sound": "files/VO_BRM_024_Play_01.ogg",
        "attack_sound": "files/VO_BRM_024_Attack_02.ogg",
        "image": "files/BRM_024.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_024_premium.gif"
    },
    {
        "card_id": "CFM_605",
        "set": "GANGS",
        "name": "Drakonid Operative",
        "collectible": true,
        "flavor_text": "His job is to spy on the Goons and the Jade Lotus, but he's OBVIOUSLY a dragon so it's pretty hard work.",
        "play_sound": "files/VO_CFM_605_Male_Drakanoid_Play_02.ogg",
        "attack_sound": "files/VO_CFM_605_Male_Drakanoid_Attack_01.ogg",
        "image": "files/CFM_605.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_605_premium.gif"
    },
    {
        "card_id": "NEW1_022",
        "set": "CLASSIC",
        "name": "Dread Corsair",
        "collectible": true,
        "flavor_text": "\"Yarrrr\" is a pirate word that means \"Greetings, milord.\"",
        "play_sound": "files/VO_NEW1_022_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_022_Attack_02.ogg",
        "image": "files/NEW1_022.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_022_premium.gif"
    },
    {
        "card_id": "CS2_064",
        "set": "BASIC",
        "name": "Dread Infernal",
        "collectible": true,
        "flavor_text": "\"INFERNOOOOOOOOOO!\" - Jaraxxus, Eredar Lord of the Burning Legion",
        "play_sound": "files/SFX_CS2_064_EnterPlay.ogg",
        "attack_sound": "files/SFX_CS2_064_Attack.ogg",
        "image": "files/CS2_064.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_064_premium.gif"
    },
    {
        "card_id": "AT_063t",
        "set": "TGT",
        "name": "Dreadscale",
        "collectible": true,
        "flavor_text": "Let's be clear about this:  ACIDMAW is the sidekick.",
        "play_sound": "files/SFX_AT_063t_Play.ogg",
        "attack_sound": "files/SFX_AT_063t_Attack.ogg",
        "image": "files/AT_063t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_063t_premium.gif"
    },
    {
        "card_id": "AT_019",
        "set": "TGT",
        "name": "Dreadsteed",
        "collectible": true,
        "flavor_text": "Crescendo himself summoned this steed, riding it to victory in the Grand Tournament.  Wherever he rides, an army of riders ride behind him, supporting the legendary champion.",
        "play_sound": "files/SFX_AT_019_Play.ogg",
        "attack_sound": "files/SFX_AT_019_Attack.ogg",
        "image": "files/AT_019.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_019_premium.gif"
    },
    {
        "card_id": "EX1_165",
        "set": "CLASSIC",
        "name": "Druid of the Claw",
        "collectible": true,
        "flavor_text": "Cat or Bear?  Cat or Bear?!  I just cannot CHOOSE!",
        "play_sound": "files/VO_EX1_165_Play_01.ogg",
        "attack_sound": "files/VO_EX1_165_Attack_02.ogg",
        "image": "files/EX1_165.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_165_premium.gif"
    },
    {
        "card_id": "EX1_165t1",
        "set": "CLASSIC",
        "name": "Druid of the Claw2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_EX1_165t1_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_165t1_Attack.ogg",
        "image": "files/EX1_165t1.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_165t1_premium.gif"
    },
    {
        "card_id": "EX1_165t2",
        "set": "CLASSIC",
        "name": "Druid of the Claw3",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_EX1_165t2_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_165t2_Attack.ogg",
        "image": "files/EX1_165t2.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_165t2_premium.gif"
    },
    {
        "card_id": "OG_044a",
        "set": "CLASSIC",
        "name": "Druid of the Claw4",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/DruidOfTheClaw_OG_044a_Play.ogg",
        "attack_sound": "files/DruidOfTheClaw_OG_044a_Attack.ogg",
        "image": "files/OG_044a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_044a_premium.gif"
    },
    {
        "card_id": "GVG_080",
        "set": "GVG",
        "name": "Druid of the Fang",
        "collectible": true,
        "flavor_text": "The Druids of the Fang live in the Wailing Caverns. They wear cool snake shirts and tell snake jokes and say \"bro\" a lot.",
        "play_sound": "files/VO_GVG_080_Play_01.ogg",
        "attack_sound": "files/VO_GVG_080_Attack_02.ogg",
        "image": "files/GVG_080.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_080_premium.gif"
    },
    {
        "card_id": "GVG_080t",
        "set": "GVG",
        "name": "Druid of the Fang2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/GVG_080t_DruidOfTheFang_Serpent_Play.ogg",
        "attack_sound": "files/GVG_080t_DruidOfTheFang_Serpent_Attack.ogg",
        "image": "files/GVG_080t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_080t_premium.gif"
    },
    {
        "card_id": "BRM_010",
        "set": "BRM",
        "name": "Druid of the Flame",
        "collectible": true,
        "flavor_text": "Druids who fought too long in Northrend were easily seduced by Ragnaros; a mug of hot chocolate was generally all it took.",
        "play_sound": "files/VO_BRM_010_Play_01.ogg",
        "attack_sound": "files/VO_BRM_010_Attack_02.ogg",
        "image": "files/BRM_010.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_010_premium.gif"
    },
    {
        "card_id": "BRM_010t",
        "set": "BRM",
        "name": "Druid of the Flame2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BRM_010t_FirecatForm_EnterPlay_1.ogg",
        "attack_sound": "files/BRM_010t_FirecatForm_Attack_1.ogg",
        "image": "files/BRM_010t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_010t_premium.gif"
    },
    {
        "card_id": "BRM_010t2",
        "set": "BRM",
        "name": "Druid of the Flame3",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BRM_010t2_FirehawkForm_EnterPlay_1.ogg",
        "attack_sound": "files/BRM_010t2_FirehawkForm_Attack_1.ogg",
        "image": "files/BRM_010t2.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_010t2_premium.gif"
    },
    {
        "card_id": "AT_042",
        "set": "TGT",
        "name": "Druid of the Saber",
        "collectible": true,
        "flavor_text": "That's saberTEETH, not like curved pirate blades.  That's a different kind of druid.  Druid of the Curved Pirate Blades.",
        "play_sound": "files/VO_AT_042_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_042_ATTACK_01.ogg",
        "image": "files/AT_042.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_042_premium.gif"
    },
    {
        "card_id": "ICC_051t",
        "set": "ICECROWN",
        "name": "Druid of the Swarm",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/ICC_051t_DruidofTheSwarm_Play.ogg",
        "attack_sound": "files/ICC_051t_DruidofTheSwarm_Attack.ogg",
        "image": "files/ICC_051t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_051t_premium.gif"
    },
    {
        "card_id": "ICC_051",
        "set": "ICECROWN",
        "name": "Druid of the Swarm2",
        "collectible": true,
        "flavor_text": "The Druid awoke from troubling dreams to find herself transformed into a giant spider.",
        "play_sound": "files/VO_ICC_051_Female_NightElf_Play_02.ogg",
        "attack_sound": "files/VO_ICC_051_Female_NightElf_Attack_02.ogg",
        "image": "files/ICC_051.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_051_premium.gif"
    },
    {
        "card_id": "ICC_051t2",
        "set": "ICECROWN",
        "name": "Druid of the Swarm3",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/ICC_051t2_DruidoftheSwarm_Play.ogg",
        "attack_sound": "files/ICC_051t2_DruidoftheSwarm_Attack.ogg",
        "image": "files/ICC_051t2.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_051t2_premium.gif"
    },
    {
        "card_id": "ICC_051t3",
        "set": "ICECROWN",
        "name": "Druid of the Swarm4",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/ICC_051t3_DruidoftheSwarm_Play.ogg",
        "attack_sound": "files/ICC_051t3_DruidoftheSwarm_Attack.ogg",
        "image": "files/ICC_051t3.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_051t3_premium.gif"
    },
    {
        "card_id": "GVG_066",
        "set": "GVG",
        "name": "Dunemaul Shaman",
        "collectible": true,
        "flavor_text": "He just closes his eyes and goes for it. Raarararrrarar!",
        "play_sound": "files/VO_GVG_066_Play_01.ogg",
        "attack_sound": "files/VO_GVG_066_Attack_02.ogg",
        "image": "files/GVG_066.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_066_premium.gif"
    },
    {
        "card_id": "OG_326",
        "set": "OG",
        "name": "Duskboar",
        "collectible": true,
        "flavor_text": "Often excluded from dinner parties.  To be fair, he is very boaring.",
        "play_sound": "files/Duskboar_OG_326_Play.ogg",
        "attack_sound": "files/Duskboar_OG_326_Attack.ogg",
        "image": "files/OG_326.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_326_premium.gif"
    },
    {
        "card_id": "EX1_243",
        "set": "CLASSIC",
        "name": "Dust Devil",
        "collectible": true,
        "flavor_text": "Westfall is full of dust devils. And buzzards. And crazed golems. And pirates. Why does anyone live here?",
        "play_sound": "files/EX1_243_Dust_Devil_EnterPlay1.ogg",
        "attack_sound": "files/EX1_243_Dust_Devil_Attack3.ogg",
        "image": "files/EX1_243.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_243_premium.gif"
    },
    {
        "card_id": "AT_081",
        "set": "TGT",
        "name": "Eadric the Pure",
        "collectible": true,
        "flavor_text": "Nobody rocks a monocle like Eadric.",
        "play_sound": "files/VO_AT_081_PLAY_ALT1_02.ogg",
        "attack_sound": "files/VO_AT_081_ATTACK_03.ogg",
        "image": "files/AT_081.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_081_premium.gif"
    },
    {
        "card_id": "ICCA01_007",
        "set": "ICECROWN",
        "name": "Eager Rogue",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_ICCA01_007_Male_Gnome_Play_01.ogg",
        "attack_sound": "files/VO_ICCA01_007_Male_Gnome_Attack_03.ogg",
        "image": "files/ICCA01_007.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/ICCA01_007.png"
    },
    {
        "card_id": "EX1_250",
        "set": "CLASSIC",
        "name": "Earth Elemental",
        "collectible": true,
        "flavor_text": "Nothing beats rock.",
        "play_sound": "files/EX1_250_Earth_Elemental_EnterPlay2.ogg",
        "attack_sound": "files/EX1_250_Earth_Elemental_Attack3.ogg",
        "image": "files/EX1_250.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_250_premium.gif"
    },
    {
        "card_id": "LOEA07_12",
        "set": "LOE",
        "name": "Earthen Pursuer",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_LOEA07_12_Play_01.ogg",
        "attack_sound": "files/VO_LOEA07_12_Play_01.ogg",
        "image": "files/LOEA07_12.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA07_12.png"
    },
    {
        "card_id": "CS2_117",
        "set": "CLASSIC",
        "name": "Earthen Ring Farseer",
        "collectible": true,
        "flavor_text": "He can see really far, and he doesn't use a telescope like those filthy pirates.",
        "play_sound": "files/VO_CS2_117_Play_01.ogg",
        "attack_sound": "files/VO_CS2_117_Attack_02.ogg",
        "image": "files/CS2_117.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_117_premium.gif"
    },
    {
        "card_id": "LOEA06_02t",
        "set": "LOE",
        "name": "Earthen Statue",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/LOEA06_02t_EarthenStatue_Play.ogg",
        "attack_sound": "files/LOEA06_02t_EarthenStatue_Attack.ogg",
        "image": "files/LOEA06_02t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA06_02t.png"
    },
    {
        "card_id": "OG_254",
        "set": "OG",
        "name": "Eater of Secrets",
        "collectible": true,
        "flavor_text": "You don't want to be around after it has eaten an explosive trap.  You thought Sludge Belcher was bad...",
        "play_sound": "files/VO_OG_254_Androgynous _Faceless_Play_01.ogg",
        "attack_sound": "files/VO_OG_254_Androgynous _Faceless_Attack_01.ogg",
        "image": "files/OG_254.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_254_premium.gif"
    },
    {
        "card_id": "FP1_003",
        "set": "NAXX",
        "name": "Echoing Ooze",
        "collectible": true,
        "flavor_text": "OOZE... Ooze... Ooze... (ooze...)",
        "play_sound": "files/SFX_FP1_003_EnterPlay.ogg",
        "attack_sound": "files/SFX_FP1_003_Attack.ogg",
        "image": "files/FP1_003.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_003_premium.gif"
    },
    {
        "card_id": "EX1_613",
        "set": "CLASSIC",
        "name": "Edwin VanCleef",
        "collectible": true,
        "flavor_text": "He led the Stonemasons in the reconstruction of Stormwind, and when the nobles refused to pay, he founded the Defias Brotherhood to, well, \u003ci\u003edeconstruct\u003c/i\u003e Stormwind.",
        "play_sound": "files/VO_EX1_613_Play_01.ogg",
        "attack_sound": "files/VO_EX1_613_Attack_02.ogg",
        "image": "files/EX1_613.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_613_premium.gif"
    },
    {
        "card_id": "LOE_107",
        "set": "LOE",
        "name": "Eerie Statue",
        "collectible": true,
        "flavor_text": "Don't blink!  Don't turn your back, don't look away, and DON'T BLINK.",
        "play_sound": "files/LOE_107_EerieStatue_Play.ogg",
        "attack_sound": "files/LOE_107_EerieStatue_Attack.ogg",
        "image": "files/LOE_107.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_107_premium.gif"
    },
    {
        "card_id": "UNG_076",
        "set": "UNGORO",
        "name": "Eggnapper",
        "collectible": true,
        "flavor_text": "Often misunderstood, it's just that he likes to use the eggs as pillows.",
        "play_sound": "files/VO_UNG_076_Male_Tortollan_Play_01.ogg",
        "attack_sound": "files/VO_UNG_076_Male_Tortollan_Attack_01.ogg",
        "image": "files/UNG_076.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_076_premium.gif"
    },
    {
        "card_id": "UNG_109",
        "set": "UNGORO",
        "name": "Elder Longneck",
        "collectible": true,
        "flavor_text": "And so the bartender says, “Why the long neck?”",
        "play_sound": "files/UNG_109_WitheredLongneck_Play.ogg",
        "attack_sound": "files/UNG_109_WitheredLongneck_Attack.ogg",
        "image": "files/UNG_109.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_109_premium.gif"
    },
    {
        "card_id": "OG_142",
        "set": "OG",
        "name": "Eldritch Horror",
        "collectible": true,
        "flavor_text": "Often wonders what path his life might have taken if he wasn't named, you know, \"Eldritch Horror\".",
        "play_sound": "files/VO_OG_142_Male_Faceless_Play_01.ogg",
        "attack_sound": "files/VO_OG_142_Male_Faceless_Attack_01.ogg",
        "image": "files/OG_142.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_142_premium.gif"
    },
    {
        "card_id": "BRMA14_7",
        "set": "BRM",
        "name": "Electron",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_BRMA14_7_Play_01.ogg",
        "attack_sound": "files/VO_BRMA14_7_Attack_02.ogg",
        "image": "files/BRMA14_7.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA14_7.png"
    },
    {
        "card_id": "LOE_079",
        "set": "LOE",
        "name": "Elise Starseeker",
        "collectible": true,
        "flavor_text": "A large part of her job entails not mixing up the Map to the Golden Monkey with the Map to Monkey Island.",
        "play_sound": "files/VO_LOE_079_Play_15.ogg",
        "attack_sound": "files/VO_LOE_079_Attack_13.ogg",
        "image": "files/LOE_079.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_079_premium.gif"
    },
    {
        "card_id": "UNG_851",
        "set": "UNGORO",
        "name": "Elise the Trailblazer",
        "collectible": true,
        "flavor_text": "Reno taught her that blazing her own trail is a lot more fun than following someone else's map.",
        "play_sound": "files/VO_UNG_851_Female_Night Elf_Play_01.ogg",
        "attack_sound": "files/VO_UNG_851_Female_Night Elf_Attack_01.ogg",
        "image": "files/UNG_851.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_851_premium.gif"
    },
    {
        "card_id": "PRO_001",
        "set": "HOF",
        "name": "Elite Tauren Chieftain",
        "collectible": true,
        "flavor_text": "He's looking for a drummer.  The current candidates are: Novice Engineer, Sen'jin Shieldmasta', and Ragnaros the Firelord.",
        "play_sound": "files/SFX_PRO_001_EnterPlay.ogg",
        "attack_sound": "files/SFX_PRO_001_Attack.ogg",
        "image": "files/PRO_001.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/PRO_001_premium.gif"
    },
    {
        "card_id": "CS2_189",
        "set": "BASIC",
        "name": "Elven Archer",
        "collectible": true,
        "flavor_text": "Don't bother asking her out on a date.  She'll shoot you down.",
        "play_sound": "files/VO_CS2_189_Play_01.ogg",
        "attack_sound": "files/VO_CS2_189_Attack_02.ogg",
        "image": "files/CS2_189.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_189_premium.gif"
    },
    {
        "card_id": "Mekka3",
        "set": "HOF",
        "name": "Emboldener 3000",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_Mekka3_EnterPlay.ogg",
        "attack_sound": "files/SFX_Mekka3_Attack.ogg",
        "image": "files/Mekka3.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/Mekka3_premium.gif"
    },
    {
        "card_id": "DREAM_03",
        "set": "CLASSIC",
        "name": "Emerald Drake",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/WoW_DREAM_03_EmeraldDrake_EnterPlay.ogg",
        "attack_sound": "files/WoW_DREAM_03_EmeraldDrake_Attack.ogg",
        "image": "files/DREAM_03.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/DREAM_03_premium.gif"
    },
    {
        "card_id": "UNG_803",
        "set": "UNGORO",
        "name": "Emerald Reaver",
        "collectible": true,
        "flavor_text": "Not to be confused with clubbing enthusiast Emerald Raver.",
        "play_sound": "files/UNG_803_EmeraldReaver_Play.ogg",
        "attack_sound": "files/UNG_803_EmeraldReaver_Attack.ogg",
        "image": "files/UNG_803.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_803_premium.gif"
    },
    {
        "card_id": "EX1_170",
        "set": "CLASSIC",
        "name": "Emperor Cobra",
        "collectible": true,
        "flavor_text": "The Sholazar Basin is home to a lot of really horrible things. If you're going to visit, wear bug spray.  And plate armor.",
        "play_sound": "files/EX1_170_Emperor_Cobra_EnterPlay1.ogg",
        "attack_sound": "files/EX1_170_Emperor_Cobra_Attack1.ogg",
        "image": "files/EX1_170.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_170_premium.gif"
    },
    {
        "card_id": "KAR_300",
        "set": "KARA",
        "name": "Enchanted Raven",
        "collectible": true,
        "flavor_text": "Once upon a midnight restive, Medivh pondered, feeling festive!",
        "play_sound": "files/KAR_300_EnchantedRaven_Play_01.ogg",
        "attack_sound": "files/KAR_300_EnchantedRaven_Attack_01.ogg",
        "image": "files/KAR_300.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_300_premium.gif"
    },
    {
        "card_id": "GVG_107",
        "set": "GVG",
        "name": "Enhance-o Mechano",
        "collectible": true,
        "flavor_text": "His enhancements are gluten free!",
        "play_sound": "files/VO_GVG_107_Play_01.ogg",
        "attack_sound": "files/VO_GVG_107_Attack_02.ogg",
        "image": "files/GVG_107.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_107_premium.gif"
    },
    {
        "card_id": "OG_026",
        "set": "OG",
        "name": "Eternal Sentinel",
        "collectible": true,
        "flavor_text": "Just try to avoid eye contact.",
        "play_sound": "files/VO_OG_026_Male_Qiraji_Play_01.ogg",
        "attack_sound": "files/VO_OG_026_Male_Qiraji_Attack_01.ogg",
        "image": "files/OG_026.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_026_premium.gif"
    },
    {
        "card_id": "EX1_274",
        "set": "CLASSIC",
        "name": "Ethereal Arcanist",
        "collectible": true,
        "flavor_text": "The ethereals are wrapped in cloth to give form to their non-corporeal bodies. Also because it's nice and soft.",
        "play_sound": "files/EX1_274_Ethereal_Arcanist_EnterPlay1.ogg",
        "attack_sound": "files/EX1_274_Ethereal_Arcanist_Attack1.ogg",
        "image": "files/EX1_274.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_274_premium.gif"
    },
    {
        "card_id": "LOE_003",
        "set": "LOE",
        "name": "Ethereal Conjurer",
        "collectible": true,
        "flavor_text": "Despite the name, he's a solid conjurer.",
        "play_sound": "files/VO_LOE_003_Play_01.ogg",
        "attack_sound": "files/VO_LOE_003_Attack_02.ogg",
        "image": "files/LOE_003.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_003_premium.gif"
    },
    {
        "card_id": "KAR_070",
        "set": "KARA",
        "name": "Ethereal Peddler",
        "collectible": true,
        "flavor_text": "Yeah, sure. That Ragnaros \"fell off the back of a truck\".",
        "play_sound": "files/VO_KAR_070_a_Male_Human_Play_01.ogg",
        "attack_sound": "files/VO_KAR_070_Female_Ethereal_Attack_01.ogg",
        "image": "files/KAR_070.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_070_premium.gif"
    },
    {
        "card_id": "AT_114",
        "set": "TGT",
        "name": "Evil Heckler",
        "collectible": true,
        "flavor_text": "To be honest, heckling is not the most effective form of evil.",
        "play_sound": "files/VO_AT_114_PLAY_ALT1_02.ogg",
        "attack_sound": "files/VO_AT_114_ATTACK_03.ogg",
        "image": "files/AT_114.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_114_premium.gif"
    },
    {
        "card_id": "OG_082",
        "set": "OG",
        "name": "Evolved Kobold",
        "collectible": true,
        "flavor_text": "You no take tentacle!",
        "play_sound": "files/VO_OG_082_Male_Kobold_Play_01.ogg",
        "attack_sound": "files/VO_OG_082_Male_Kobold_Attack_01.ogg",
        "image": "files/OG_082.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_082_premium.gif"
    },
    {
        "card_id": "ICC_021",
        "set": "ICECROWN",
        "name": "Exploding Bloatbat",
        "collectible": true,
        "flavor_text": "We've all been there after a night of one-too-many funnel cakes.",
        "play_sound": "files/ExplodingBloatbat_ICC_021_Play.ogg",
        "attack_sound": "files/ExplodingBloatbat_ICC_021_Attack.ogg",
        "image": "files/ICC_021.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_021_premium.gif"
    },
    {
        "card_id": "GVG_076",
        "set": "GVG",
        "name": "Explosive Sheep",
        "collectible": true,
        "flavor_text": "How is this supposed to work?  Your enemies think, \"\u003ci\u003eHey!\u003c/i\u003e Cute sheep!\" and run over to cuddle it?",
        "play_sound": "files/SFX_GVG_076_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_076_Attack.ogg",
        "image": "files/GVG_076.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_076_premium.gif"
    },
    {
        "card_id": "AT_131",
        "set": "TGT",
        "name": "Eydis Darkbane",
        "collectible": true,
        "flavor_text": "HATES being called \"the wonder twins\".",
        "play_sound": "files/VO_AT_131_PLAY_ALT1_02.ogg",
        "attack_sound": "files/VO_AT_131_ATTACK_03.ogg",
        "image": "files/AT_131.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_131_premium.gif"
    },
    {
        "card_id": "OG_141",
        "set": "OG",
        "name": "Faceless Behemoth",
        "collectible": true,
        "flavor_text": "Rejected names: Forty-Foot Faceless, Big ol' No-face, Huge Creature Sans Face, Teddy.",
        "play_sound": "files/VO_OG_141_Androgynous _Faceless_Play_01.ogg",
        "attack_sound": "files/VO_OG_141_Androgynous _Faceless_Attack_01.ogg",
        "image": "files/OG_141.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_141_premium.gif"
    },
    {
        "card_id": "OG_272t",
        "set": "OG",
        "name": "Faceless Destroyer",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/FacelessDestroyer_OG_272t_Play.ogg",
        "attack_sound": "files/FacelessDestroyer_OG_272t_Attack.ogg",
        "image": "files/OG_272t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_272t_premium.gif"
    },
    {
        "card_id": "EX1_564",
        "set": "CLASSIC",
        "name": "Faceless Manipulator",
        "collectible": true,
        "flavor_text": "The Faceless Ones are servants of Yogg-Saron, and they feed on fear. Right now they are feeding on your fear of accidentally disenchanting all your good cards.",
        "play_sound": "files/WoW_EX1_564_FacelessManipulator_EnterPlay.ogg",
        "attack_sound": "files/WoW_EX1_564_FacelessManipulator_Attack.ogg",
        "image": "files/EX1_564.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_564_premium.gif"
    },
    {
        "card_id": "OG_174",
        "set": "OG",
        "name": "Faceless Shambler",
        "collectible": true,
        "flavor_text": "\"What is that thing?!\" \"I'm not sure, but it seems to be sort of Ysera shaped.\"",
        "play_sound": "files/FacelessShambler_OG_174_Play.ogg",
        "attack_sound": "files/FacelessShambler_OG_174_Attack.ogg",
        "image": "files/OG_174.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_174_premium.gif"
    },
    {
        "card_id": "OG_207",
        "set": "OG",
        "name": "Faceless Summoner",
        "collectible": true,
        "flavor_text": "They never get the recognition they deserve.",
        "play_sound": "files/VO_OG_207_Androgynous _Faceless_Play_01.ogg",
        "attack_sound": "files/VO_OG_207_Androgynous _Faceless_Attack_01.ogg",
        "image": "files/OG_207.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_207_premium.gif"
    },
    {
        "card_id": "NEW1_023",
        "set": "CLASSIC",
        "name": "Faerie Dragon",
        "collectible": true,
        "flavor_text": "Adorable.  Immune to Magic.  Doesn't pee on the rug.  The perfect pet!",
        "play_sound": "files/NEW1_023_Faerie_Dragon_EnterPlay_2.ogg",
        "attack_sound": "files/NEW1_023_Faerie_Dragon_Attack_2.ogg",
        "image": "files/NEW1_023.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_023_premium.gif"
    },
    {
        "card_id": "AT_003",
        "set": "TGT",
        "name": "Fallen Hero",
        "collectible": true,
        "flavor_text": "And he can't get up.",
        "play_sound": "files/VO_AT_003_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_003_ATTACK_02.ogg",
        "image": "files/AT_003.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_003_premium.gif"
    },
    {
        "card_id": "ICC_094",
        "set": "ICECROWN",
        "name": "Fallen Sun Cleric",
        "collectible": true,
        "flavor_text": "It's hard to keep a Shattered Sun Cleric down.",
        "play_sound": "files/VO_ICC_094_Male_Undead_Play_01.ogg",
        "attack_sound": "files/VO_ICC_094_Male_Undead_Attack_01.ogg",
        "image": "files/ICC_094.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_094_premium.gif"
    },
    {
        "card_id": "NAX11_03",
        "set": "NAXX",
        "name": "Fallout Slime",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_NAX11_03_EnterPlay.ogg",
        "attack_sound": "files/SFX_NAX11_03_Attack.ogg",
        "image": "files/NAX11_03.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX11_03.png"
    },
    {
        "card_id": "OG_044",
        "set": "OG",
        "name": "Fandral Staghelm",
        "collectible": true,
        "flavor_text": "Always manages to mention \"Back when I was creating the World Tree…\" in EVERY conversation. Sheesh! Enough already.",
        "play_sound": "files/VO_OG_044_Male_Night Elf_Play_02.ogg",
        "attack_sound": "files/VO_OG_044_Male_Night Elf_Attack_02.ogg",
        "image": "files/OG_044.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_044_premium.gif"
    },
    {
        "card_id": "ICC_047",
        "set": "ICECROWN",
        "name": "Fatespinner",
        "collectible": true,
        "flavor_text": "Her clothing? Pure silk, of course.",
        "play_sound": "files/VO_ICC_047_Female_Nerubian_Play_01.ogg",
        "attack_sound": "files/VO_ICC_047_Female_Nerubian_Attack_02.ogg",
        "image": "files/ICC_047.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_047_premium.gif"
    },
    {
        "card_id": "AT_020",
        "set": "TGT",
        "name": "Fearsome Doomguard",
        "collectible": true,
        "flavor_text": "They were originally called Cuddleguards, but they were not inspiring the proper amount of fear.",
        "play_sound": "files/VO_AT_020_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_020_ATTACK_02.ogg",
        "image": "files/AT_020.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_020_premium.gif"
    },
    {
        "card_id": "GVG_020",
        "set": "GVG",
        "name": "Fel Cannon",
        "collectible": true,
        "flavor_text": "The box says, \"New and improved, with 200% more fel!\"",
        "play_sound": "files/GVG_020_FelCannon_Play.ogg",
        "attack_sound": "files/GVG_020_FelCannon_Attack.ogg",
        "image": "files/GVG_020.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_020_premium.gif"
    },
    {
        "card_id": "CFM_609",
        "set": "GANGS",
        "name": "Fel Orc Soulfiend",
        "collectible": true,
        "flavor_text": "\"Doc says the persistent burning sensation in my soul is probably just an ulcer.\"",
        "play_sound": "files/VO_CFM_609_Male_FelOrc_Play_01.ogg",
        "attack_sound": "files/VO_CFM_609_Male_FelOrc_Attack_01.ogg",
        "image": "files/CFM_609.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_609_premium.gif"
    },
    {
        "card_id": "GVG_016",
        "set": "GVG",
        "name": "Fel Reaver",
        "collectible": true,
        "flavor_text": "So reaver. Much fel. Wow.",
        "play_sound": "files/SFX_GVG_016_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_016_Attack.ogg",
        "image": "files/GVG_016.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_016_premium.gif"
    },
    {
        "card_id": "EX1_301",
        "set": "CLASSIC",
        "name": "Felguard",
        "collectible": true,
        "flavor_text": "Yes, he'll fight for you.  BUT HE'S NOT GOING TO LIKE IT.",
        "play_sound": "files/VO_EX1_301_Play_01.ogg",
        "attack_sound": "files/VO_EX1_301_Attack_02.ogg",
        "image": "files/EX1_301.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_301_premium.gif"
    },
    {
        "card_id": "CS1_069",
        "set": "CLASSIC",
        "name": "Fen Creeper",
        "collectible": true,
        "flavor_text": "He used to be called Bog Beast, but it confused people because he wasn't an actual beast.   Boom, New Name!",
        "play_sound": "files/SFX_CS1_069_EnterPlay.ogg",
        "attack_sound": "files/SFX_CS1_069_Attack.ogg",
        "image": "files/CS1_069.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS1_069_premium.gif"
    },
    {
        "card_id": "AT_115",
        "set": "TGT",
        "name": "Fencing Coach",
        "collectible": true,
        "flavor_text": "Good fencers make good neighbors, right?",
        "play_sound": "files/VO_AT_115_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_115_ATTACK_02.ogg",
        "image": "files/AT_115.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_115_premium.gif"
    },
    {
        "card_id": "ICCA07_008",
        "set": "ICECROWN",
        "name": "Festergut",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_ICCA07_008_Male_Abomination_Play_01.ogg",
        "attack_sound": "files/VO_ICCA07_008_Male_Abomination_Attack_01.ogg",
        "image": "files/ICCA07_008.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/ICCA07_008.png"
    },
    {
        "card_id": "FP1_015",
        "set": "NAXX",
        "name": "Feugen",
        "collectible": true,
        "flavor_text": "Feugen is sad because everyone likes Stalagg better.",
        "play_sound": "files/VO_FP1_015_EnterPlay_01.ogg",
        "attack_sound": "files/VO_FP1_015_Attack_02.ogg",
        "image": "files/FP1_015.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_015_premium.gif"
    },
    {
        "card_id": "LOE_022",
        "set": "LOE",
        "name": "Fierce Monkey",
        "collectible": true,
        "flavor_text": "Fierce monkey.  That funky monkey.",
        "play_sound": "files/SFX_LOE_022_Play.ogg",
        "attack_sound": "files/SFX_LOE_022_Attack.ogg",
        "image": "files/LOE_022.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_022_premium.gif"
    },
    {
        "card_id": "OG_179",
        "set": "OG",
        "name": "Fiery Bat",
        "collectible": true,
        "flavor_text": "He'll always be our first.",
        "play_sound": "files/FieryBat_OG_179_Play.ogg",
        "attack_sound": "files/FieryBat_OG_179_Attack.ogg",
        "image": "files/OG_179.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_179_premium.gif"
    },
    {
        "card_id": "CFM_328",
        "set": "GANGS",
        "name": "Fight Promoter",
        "collectible": true,
        "flavor_text": "\"Yeah, I can get you Knuckles.  No, no, he's been clean for *weeks*.\"",
        "play_sound": "files/VO_CFM_328_Female_Orc_Play_03.ogg",
        "attack_sound": "files/VO_CFM_328_Female_Orc_Attack_01.ogg",
        "image": "files/CFM_328.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_328_premium.gif"
    },
    {
        "card_id": "CFM_344",
        "set": "GANGS",
        "name": "Finja, the Flying Star",
        "collectible": true,
        "flavor_text": "The last true master of Finjitsu.",
        "play_sound": "files/VO_CFM_344_Male_Murloc_Play_01.ogg",
        "attack_sound": "files/VO_CFM_344_Male_Murloc_Attack_01.ogg",
        "image": "files/CFM_344.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_344_premium.gif"
    },
    {
        "card_id": "EX1_finkle",
        "set": "CLASSIC",
        "name": "Finkle Einhorn",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_EX1_finkle_Play_01.ogg",
        "attack_sound": "files/VO_EX1_finkle_Attack_02.ogg",
        "image": "files/EX1_finkle.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_finkle_premium.gif"
    },
    {
        "card_id": "CS2_042",
        "set": "BASIC",
        "name": "Fire Elemental",
        "collectible": true,
        "flavor_text": "He can never take a bath. Ewww.",
        "play_sound": "files/CS2_042_Play_FireElemental.ogg",
        "attack_sound": "files/CS2_042_Attack_FireElemental.ogg",
        "image": "files/CS2_042.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_042_premium.gif"
    },
    {
        "card_id": "UNG_809",
        "set": "UNGORO",
        "name": "Fire Fly",
        "collectible": true,
        "flavor_text": "Archnemeses: small children with glass jars.",
        "play_sound": "files/UNG_809_GiantFirefly_Play.ogg",
        "attack_sound": "files/UNG_809_GiantFirefly_Attack.ogg",
        "image": "files/UNG_809.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_809_premium.gif"
    },
    {
        "card_id": "UNG_202",
        "set": "UNGORO",
        "name": "Fire Plume Harbinger",
        "collectible": true,
        "flavor_text": "Good for summoning elementals. Great for making s'mores.",
        "play_sound": "files/VO_UNG_202_Male_Elemental_Play_01.ogg",
        "attack_sound": "files/VO_UNG_202_Male_Elemental_Attack_01.ogg",
        "image": "files/UNG_202.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_202_premium.gif"
    },
    {
        "card_id": "BRM_012",
        "set": "BRM",
        "name": "Fireguard Destroyer",
        "collectible": true,
        "flavor_text": "Ragnaros interviews hundreds of Fire Elementals for the position of \"Destroyer\" but very few have what it takes.",
        "play_sound": "files/VO_BRM_012_Play_01.ogg",
        "attack_sound": "files/VO_BRM_012_Attack_02.ogg",
        "image": "files/BRM_012.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_012_premium.gif"
    },
    {
        "card_id": "BRMA04_3",
        "set": "BRM",
        "name": "Firesworn",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_BRMA04_3_Play.ogg",
        "attack_sound": "files/SFX_BRMA04_3_Attack.ogg",
        "image": "files/BRMA04_3.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA04_3.png"
    },
    {
        "card_id": "AT_129",
        "set": "TGT",
        "name": "Fjola Lightbane",
        "collectible": true,
        "flavor_text": "LOVES being called \"the wonder twins\".",
        "play_sound": "files/VO_AT_129_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_129_ATTACK_03.ogg",
        "image": "files/AT_129.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_129_premium.gif"
    },
    {
        "card_id": "UNG_809t1",
        "set": "UNGORO",
        "name": "Flame Elemental",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/UNG_809t1_FlameElemental_Play.ogg",
        "attack_sound": "files/UNG_809t1_FlameElemental_Attack.ogg",
        "image": "files/UNG_809t1.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_809t1_premium.gif"
    },
    {
        "card_id": "EX1_319",
        "set": "CLASSIC",
        "name": "Flame Imp",
        "collectible": true,
        "flavor_text": "Imps like being on fire.  They just do.",
        "play_sound": "files/VO_EX1_319_Play_01.ogg",
        "attack_sound": "files/VO_EX1_319_Attack_02.ogg",
        "image": "files/EX1_319.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_319_premium.gif"
    },
    {
        "card_id": "AT_094",
        "set": "TGT",
        "name": "Flame Juggler",
        "collectible": true,
        "flavor_text": "At first he liked juggling chain saws, but then he thought, \"Flames are better!  Because FIRE!\"",
        "play_sound": "files/VO_AT_094_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_094_ATTACK_02.ogg",
        "image": "files/AT_094.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_094_premium.gif"
    },
    {
        "card_id": "GVG_007",
        "set": "GVG",
        "name": "Flame Leviathan",
        "collectible": true,
        "flavor_text": "Mimiron likes to take the Flame Leviathan out on some sweet joyrides.",
        "play_sound": "files/SFX_GVG_007_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_007_Attack.ogg",
        "image": "files/GVG_007.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_007_premium.gif"
    },
    {
        "card_id": "EX1_614t",
        "set": "CLASSIC",
        "name": "Flame of Azzinoth",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/TU4e_002t_Flame_of_Azzinoth_Play.ogg",
        "attack_sound": "files/TU4e_002t_Flame_of_Azzinoth_Attack.ogg",
        "image": "files/EX1_614t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_614t_premium.gif"
    },
    {
        "card_id": "TU4e_002t",
        "set": "MISSIONS",
        "name": "Flame of Azzinoth2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/TU4e_002t_Flame_of_Azzinoth_Play.ogg",
        "attack_sound": "files/TU4e_002t_Flame_of_Azzinoth_Attack.ogg",
        "image": "files/TU4e_002t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/TU4e_002t.png"
    },
    {
        "card_id": "EX1_565",
        "set": "BASIC",
        "name": "Flametongue Totem",
        "collectible": true,
        "flavor_text": "Totemsmiths like to use the rarest woods for their totems.  There are even rumors of totems made of Ironbark Protectors.",
        "play_sound": "files/EX1_565_Play_FlametongueTotem.ogg",
        "attack_sound": "files/SFX_EX1_565_Attack_00.ogg",
        "image": "files/EX1_565.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_565_premium.gif"
    },
    {
        "card_id": "BRM_002",
        "set": "BRM",
        "name": "Flamewaker",
        "collectible": true,
        "flavor_text": "Flamewakers HATE being confused for Flamewalkers. They just wake up fire, they don’t walk on it. Walking on fire is CRAZY.",
        "play_sound": "files/VO_BRM_002_Play_01.ogg",
        "attack_sound": "files/VO_BRM_002_Attack_02.ogg",
        "image": "files/BRM_002.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_002_premium.gif"
    },
    {
        "card_id": "BRMA06_4",
        "set": "BRM",
        "name": "Flamewaker Acolyte",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_BRMA06_4_Play_01.ogg",
        "attack_sound": "files/VO_BRMA06_4_Attack_02.ogg",
        "image": "files/BRMA06_4.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRMA06_4_premium.gif"
    },
    {
        "card_id": "OG_024",
        "set": "OG",
        "name": "Flamewreathed Faceless",
        "collectible": true,
        "flavor_text": "He's on fire! Boomshakalaka!",
        "play_sound": "files/VO_OG_024_Male_Faceless_Play_01.ogg",
        "attack_sound": "files/VO_OG_024_Male_Faceless_Attack_01.ogg",
        "image": "files/OG_024.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_024_premium.gif"
    },
    {
        "card_id": "tt_004",
        "set": "CLASSIC",
        "name": "Flesheating Ghoul",
        "collectible": true,
        "flavor_text": "'Flesheating' is an unfair name.  It's just that there's not really much else for him to eat.",
        "play_sound": "files/tt_004_FleshEating_Ghoul_EnterPlay1.ogg",
        "attack_sound": "files/tt_004_FleshEating_Ghoul_Attack1.ogg",
        "image": "files/tt_004.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/tt_004_premium.gif"
    },
    {
        "card_id": "GVG_100",
        "set": "GVG",
        "name": "Floating Watcher",
        "collectible": true,
        "flavor_text": "\"Evil Eye Watcher of Doom\" was the original name, but marketing felt it was a bit too aggressive.",
        "play_sound": "files/VO_GVG_100_Play_01.ogg",
        "attack_sound": "files/VO_GVG_100_Attack_02.ogg",
        "image": "files/GVG_100.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_100_premium.gif"
    },
    {
        "card_id": "GVG_084",
        "set": "GVG",
        "name": "Flying Machine",
        "collectible": true,
        "flavor_text": "To operate, this contraption needs a hula doll on the dashboard. Otherwise it's just a “falling machine.”",
        "play_sound": "files/VO_GVG_084_Play_01.ogg",
        "attack_sound": "files/VO_GVG_084_Attack_02.ogg",
        "image": "files/GVG_084.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_084_premium.gif"
    },
    {
        "card_id": "KARA_04_05",
        "set": "KARA",
        "name": "Flying Monkey",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/FlyingMonkey_KARA_04_05_Play.ogg",
        "attack_sound": "files/FlyingMonkey_KARA_04_05_Attack.ogg",
        "image": "files/KARA_04_05.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KARA_04_05.png"
    },
    {
        "card_id": "GVG_113",
        "set": "GVG",
        "name": "Foe Reaper 4000",
        "collectible": true,
        "flavor_text": "Foe reaping is really not so different from harvest reaping, at the end of the day.",
        "play_sound": "files/VO_GVG_113_Play_01.ogg",
        "attack_sound": "files/VO_GVG_113_Attack_02.ogg",
        "image": "files/GVG_113.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_113_premium.gif"
    },
    {
        "card_id": "OG_051",
        "set": "OG",
        "name": "Forbidden Ancient",
        "collectible": true,
        "flavor_text": "This Ancient was banned from the local tavern after tucking a 'Dr. Boom' up its sleeve.",
        "play_sound": "files/ForbiddenAncient_OG_051_Play.ogg",
        "attack_sound": "files/ForbiddenAncient_OG_051_Attack.ogg",
        "image": "files/OG_051.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_051_premium.gif"
    },
    {
        "card_id": "GVG_079",
        "set": "GVG",
        "name": "Force-Tank MAX",
        "collectible": true,
        "flavor_text": "There is a factory in Tanaris for crafting force-tanks, but it only ever made two, because of cost overruns.",
        "play_sound": "files/SFX_GVG_079_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_079_Attack.ogg",
        "image": "files/GVG_079.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_079_premium.gif"
    },
    {
        "card_id": "KAR_A02_03",
        "set": "KARA",
        "name": "Fork",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KAR_A02_03_Male_Fork_Play_01.ogg",
        "attack_sound": "files/VO_KAR_A02_03_Male_Fork_Attack_01.ogg",
        "image": "files/KAR_A02_03.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KAR_A02_03.png"
    },
    {
        "card_id": "OG_292",
        "set": "OG",
        "name": "Forlorn Stalker",
        "collectible": true,
        "flavor_text": "He's going to leave the dying up to you, if that's cool.",
        "play_sound": "files/VO_OG_292_Male_Worgen_Play_01.ogg",
        "attack_sound": "files/VO_OG_292_Male_Worgen_Attack_01.ogg",
        "image": "files/OG_292.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_292_premium.gif"
    },
    {
        "card_id": "LOE_073",
        "set": "LOE",
        "name": "Fossilized Devilsaur",
        "collectible": true,
        "flavor_text": "This was the only job he could get after the dinosaur theme park debacle.",
        "play_sound": "files/SFX_LOE_073_Play.ogg",
        "attack_sound": "files/SFX_LOE_073_Attack.ogg",
        "image": "files/LOE_073.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_073_premium.gif"
    },
    {
        "card_id": "CFM_654",
        "set": "GANGS",
        "name": "Friendly Bartender",
        "collectible": true,
        "flavor_text": "\"What'll it be?  A Jade Brew?  A Grimy Goose?  A Kabal Manatini?\"",
        "play_sound": "files/VO_CFM_654_Male_Tauren_Play_01.ogg",
        "attack_sound": "files/VO_CFM_654_Male_Tauren_Attack_01.ogg",
        "image": "files/CFM_654.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_654_premium.gif"
    },
    {
        "card_id": "AT_093",
        "set": "TGT",
        "name": "Frigid Snobold",
        "collectible": true,
        "flavor_text": "Ironically, the natural enemy of the snobold is THE CANDLE.",
        "play_sound": "files/VO_AT_093_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_093_ATTACK_ALT1_04.ogg",
        "image": "files/AT_093.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_093_premium.gif"
    },
    {
        "card_id": "hexfrog",
        "set": "BASIC",
        "name": "Frog",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_HexFrog_Attack.ogg",
        "attack_sound": "files/SFX_HexFrog_Attack.ogg",
        "image": "files/hexfrog.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/hexfrog_premium.gif"
    },
    {
        "card_id": "EX1_283",
        "set": "CLASSIC",
        "name": "Frost Elemental",
        "collectible": true,
        "flavor_text": "When a Water elemental and an Ice elemental love each other VERY much...",
        "play_sound": "files/SFX_EX1_283_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_283_Attack.ogg",
        "image": "files/EX1_283.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_283_premium.gif"
    },
    {
        "card_id": "AT_120",
        "set": "TGT",
        "name": "Frost Giant",
        "collectible": true,
        "flavor_text": "Don't ask him about the beard.  JUST DON'T.",
        "play_sound": "files/SFX_AT_120_Play_01.ogg",
        "attack_sound": "files/SFX_AT_120_Attack_01.ogg",
        "image": "files/AT_120.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_120_premium.gif"
    },
    {
        "card_id": "ICC_832t3",
        "set": "ICECROWN",
        "name": "Frost Widow",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/FrostWidow_ICC_832t3_Play.ogg",
        "attack_sound": "files/FrostWidow_ICC_832t3_Attack.ogg",
        "image": "files/ICC_832t3.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_832t3_premium.gif"
    },
    {
        "card_id": "CS2_121",
        "set": "BASIC",
        "name": "Frostwolf Grunt",
        "collectible": true,
        "flavor_text": "Grunting is what his father did and his father before that.   It's more than just a job.",
        "play_sound": "files/VO_CS2_121_Play_01.ogg",
        "attack_sound": "files/VO_CS2_121_Attack_02.ogg",
        "image": "files/CS2_121.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_121_premium.gif"
    },
    {
        "card_id": "CS2_226",
        "set": "BASIC",
        "name": "Frostwolf Warlord",
        "collectible": true,
        "flavor_text": "The Frostwolves are locked in combat with the Stormpike Expedition over control of Alterac Valley.  Every attempt at peace-talks has ended with Captain Galvangar killing the mediator.",
        "play_sound": "files/VO_CS2_226_Play_01.ogg",
        "attack_sound": "files/VO_CS2_226_Attack_02.ogg",
        "image": "files/CS2_226.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_226_premium.gif"
    },
    {
        "card_id": "EX1_604",
        "set": "CLASSIC",
        "name": "Frothing Berserker",
        "collectible": true,
        "flavor_text": "He used to work as an accountant before he tried his hand at Berserkering.",
        "play_sound": "files/VO_EX1_604_Play_01.ogg",
        "attack_sound": "files/VO_EX1_604_Attack_02.ogg",
        "image": "files/EX1_604.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_604_premium.gif"
    },
    {
        "card_id": "ICC_838t",
        "set": "ICECROWN",
        "name": "Frozen Champion",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/ICC_838t_FrozenChampion_Play.ogg",
        "attack_sound": "files/ICC_838t_FrozenChampion_Attack.ogg",
        "image": "files/ICC_838t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_838t_premium.gif"
    },
    {
        "card_id": "UNG_079",
        "set": "UNGORO",
        "name": "Frozen Crusher",
        "collectible": true,
        "flavor_text": "Goes by the online handle \"KoolKrusher99.\"",
        "play_sound": "files/VO_UNG_079_Male_Elemental_Play_01.ogg",
        "attack_sound": "files/VO_UNG_079_Male_Elemental_Attack_01.ogg",
        "image": "files/UNG_079.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_079_premium.gif"
    },
    {
        "card_id": "ICC_096",
        "set": "ICECROWN",
        "name": "Furnacefire Colossus",
        "collectible": true,
        "flavor_text": "Smelts in his mouth, not in your hand.",
        "play_sound": "files/VO_ICC_096_Male_Giant_Play_02.ogg",
        "attack_sound": "files/VO_ICC_096_Male_Giant_Attack_01.ogg",
        "image": "files/ICC_096.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_096_premium.gif"
    },
    {
        "card_id": "EX1_095",
        "set": "CLASSIC",
        "name": "Gadgetzan Auctioneer",
        "collectible": true,
        "flavor_text": "He used to run the black market auction house, but there was just too much violence and he had to move.",
        "play_sound": "files/VO_EX1_095_Play_01.ogg",
        "attack_sound": "files/VO_EX1_095_Attack_02.ogg",
        "image": "files/EX1_095.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_095_premium.gif"
    },
    {
        "card_id": "CFM_693",
        "set": "GANGS",
        "name": "Gadgetzan Ferryman",
        "collectible": true,
        "flavor_text": "Is it just me, or is there something fishy about that ferryman?",
        "play_sound": "files/VO_CFM_693_Female_Jinyu_Play_01.ogg",
        "attack_sound": "files/VO_CFM_693_Female_Jinyu_Attack_01.ogg",
        "image": "files/CFM_693.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_693_premium.gif"
    },
    {
        "card_id": "AT_133",
        "set": "TGT",
        "name": "Gadgetzan Jouster",
        "collectible": true,
        "flavor_text": "It's not HER fault you didn't put a spinning saw blade on your horse.",
        "play_sound": "files/VO_AT_133_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_133_ATTACK_ALT1_03.ogg",
        "image": "files/AT_133.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_133_premium.gif"
    },
    {
        "card_id": "CFM_659",
        "set": "GANGS",
        "name": "Gadgetzan Socialite",
        "collectible": true,
        "flavor_text": "Comment on her height, and she'll go from flapper to kneecapper in seconds flat.",
        "play_sound": "files/VO_CFM_659_Female_Gnome_Play_01.ogg",
        "attack_sound": "files/VO_CFM_659_Female_Gnome_Attack_01.ogg",
        "image": "files/CFM_659.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_659_premium.gif"
    },
    {
        "card_id": "GVG_049",
        "set": "GVG",
        "name": "Gahz'rilla",
        "collectible": true,
        "flavor_text": "The Sen'jin High football team is The Gahz'rillas.",
        "play_sound": "files/GVG_049_Gahzrilla_EnterPlay.ogg",
        "attack_sound": "files/GVG_049_Gahzrilla_Attack.ogg",
        "image": "files/GVG_049.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_049_premium.gif"
    },
    {
        "card_id": "UNG_954t1",
        "set": "UNGORO",
        "name": "Galvadon",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/UNG_954t1_Anklos_Play.ogg",
        "attack_sound": "files/UNG_954t1_Anklos_Attack.ogg",
        "image": "files/UNG_954t1.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_954t1_premium.gif"
    },
    {
        "card_id": "AT_080",
        "set": "TGT",
        "name": "Garrison Commander",
        "collectible": true,
        "flavor_text": "He'll never admit it, but he pushes you hard because he really cares about you.",
        "play_sound": "files/VO_AT_080_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_080_ATTACK_02.ogg",
        "image": "files/AT_080.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_080_premium.gif"
    },
    {
        "card_id": "GVG_117",
        "set": "GVG",
        "name": "Gazlowe",
        "collectible": true,
        "flavor_text": "Gazlowe was voted \"Most Likely to Explode\" in high school.",
        "play_sound": "files/VO_GVG_117_Play_01.ogg",
        "attack_sound": "files/VO_GVG_117_Attack_02.ogg",
        "image": "files/GVG_117.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_117_premium.gif"
    },
    {
        "card_id": "EX1_112",
        "set": "HOF",
        "name": "Gelbin Mekkatorque",
        "collectible": true,
        "flavor_text": "He's the leader of the gnomes, and an incredible inventor.  He's getting better, too; He turns things into chickens WAY less than he used to.",
        "play_sound": "files/VO_EX1_112_Play_01.ogg",
        "attack_sound": "files/VO_EX1_112_Attack_02.ogg",
        "image": "files/EX1_112.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_112_premium.gif"
    },
    {
        "card_id": "UNG_089",
        "set": "UNGORO",
        "name": "Gentle Megasaur",
        "collectible": true,
        "flavor_text": "\"Low, low rents! Must enjoy a nomadic lifestyle. Quasi-sentient, bipedal, amphibious humanoids ONLY!\"",
        "play_sound": "files/UNG_089_LumberingIsle_Play.ogg",
        "attack_sound": "files/UNG_089_LumberingIsle_Attack.ogg",
        "image": "files/UNG_089.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_089_premium.gif"
    },
    {
        "card_id": "CFM_808",
        "set": "GANGS",
        "name": "Genzo, the Shark",
        "collectible": true,
        "flavor_text": "Infamous in the seedy underground card rooms of Gadgetzan, he got his nickname winning the coveted Shark Plushie in the city's first Hearthstone tournament.",
        "play_sound": "files/VO_CFM_808_Male_Undead_Play_01.ogg",
        "attack_sound": "files/VO_CFM_808_Male_Undead_Attack_01.ogg",
        "image": "files/CFM_808.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_808_premium.gif"
    },
    {
        "card_id": "UNG_086",
        "set": "UNGORO",
        "name": "Giant Anaconda",
        "collectible": true,
        "flavor_text": "Must be something it ate.",
        "play_sound": "files/UNG_086_GiantAnaconda_Play.ogg",
        "attack_sound": "files/UNG_086_GiantAnaconda_Attack.ogg",
        "image": "files/UNG_086.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_086_premium.gif"
    },
    {
        "card_id": "LOEA04_23",
        "set": "LOE",
        "name": "Giant Insect",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_LOEA04_23_Play.ogg",
        "attack_sound": "files/SFX_LOEA04_23_Attack.ogg",
        "image": "files/LOEA04_23.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA04_23.png"
    },
    {
        "card_id": "UNG_071",
        "set": "UNGORO",
        "name": "Giant Mastodon",
        "collectible": true,
        "flavor_text": "Still salty about it not being the \"Year of the Mastodon.\"",
        "play_sound": "files/UNG_071_GiantMastadon_Play.ogg",
        "attack_sound": "files/UNG_071_GiantMastadon_Attack.ogg",
        "image": "files/UNG_071.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_071_premium.gif"
    },
    {
        "card_id": "OG_308",
        "set": "OG",
        "name": "Giant Sand Worm",
        "collectible": true,
        "flavor_text": "Banned from every all-you-can-eat buffet on Azeroth.",
        "play_sound": "files/OG_308_GiantSandWorm_Play.ogg",
        "attack_sound": "files/OG_308_GiantSandWorm_Attack.ogg",
        "image": "files/OG_308.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_308_premium.gif"
    },
    {
        "card_id": "UNG_814",
        "set": "UNGORO",
        "name": "Giant Wasp",
        "collectible": true,
        "flavor_text": "Float like a butterfly, sting like a giant wasp!",
        "play_sound": "files/UNG_814_GiantWasp_Play.ogg",
        "attack_sound": "files/UNG_814_GiantWasp_Attack.ogg",
        "image": "files/UNG_814.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_814_premium.gif"
    },
    {
        "card_id": "LOEA16_24",
        "set": "LOE",
        "name": "Giantfin",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_LOEA16_24_Giantfin_Play.ogg",
        "attack_sound": "files/VO_LOEA16_24_Giantfin_Attack.ogg",
        "image": "files/LOEA16_24.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA16_24.png"
    },
    {
        "card_id": "GVG_081",
        "set": "GVG",
        "name": "Gilblin Stalker",
        "collectible": true,
        "flavor_text": "\"Shhh, I think I hear something.\"\n\n\"Ah, it's probably nothing.\" - Every Henchman",
        "play_sound": "files/VO_GVG_081_Play_01.ogg",
        "attack_sound": "files/VO_GVG_081_Attack_02.ogg",
        "image": "files/GVG_081.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_081_premium.gif"
    },
    {
        "card_id": "UNG_205",
        "set": "UNGORO",
        "name": "Glacial Shard",
        "collectible": true,
        "flavor_text": "Ice, ice, baby!",
        "play_sound": "files/UNG_205_GlacialShard_Play.ogg",
        "attack_sound": "files/UNG_205_GlacialShard_Attack.ogg",
        "image": "files/UNG_205.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_205_premium.gif"
    },
    {
        "card_id": "UNG_946",
        "set": "UNGORO",
        "name": "Gluttonous Ooze",
        "collectible": true,
        "flavor_text": "Three time winner of the Un'Goro weapon eating contest.",
        "play_sound": "files/GluttonousOoze_UNG_946_Play.ogg",
        "attack_sound": "files/GluttonousOoze_UNG_946_Attack.ogg",
        "image": "files/UNG_946.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_946_premium.gif"
    },
    {
        "card_id": "NEW1_040t",
        "set": "CLASSIC",
        "name": "Gnoll",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_NEW1_040t_EnterPlay.ogg",
        "attack_sound": "files/SFX_NEW1_040t_Attack.ogg",
        "image": "files/NEW1_040t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_040t_premium.gif"
    },
    {
        "card_id": "OG_318t",
        "set": "OG",
        "name": "Gnoll2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/OG_318t_InfestedGnoll_Play.ogg",
        "attack_sound": "files/OG_318t_InfestedGnoll_Attack.ogg",
        "image": "files/OG_318t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_318t_premium.gif"
    },
    {
        "card_id": "TU4a_003",
        "set": "MISSIONS",
        "name": "Gnoll3",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/GnollReady1.ogg",
        "attack_sound": "files/GnollReady1.ogg",
        "image": "files/TU4a_003.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/TU4a_003.png"
    },
    {
        "card_id": "ICC_407",
        "set": "ICECROWN",
        "name": "Gnomeferatu",
        "collectible": true,
        "flavor_text": "She prefers the term \"Glampire.\"",
        "play_sound": "files/VO_ICC_407_Female_Gnome_Play_01.ogg",
        "attack_sound": "files/VO_ICC_407_Female_Gnome_Attack_02.ogg",
        "image": "files/ICC_407.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_407_premium.gif"
    },
    {
        "card_id": "GVG_098",
        "set": "GVG",
        "name": "Gnomeregan Infantry",
        "collectible": true,
        "flavor_text": "The gnomes are valiant and ready to return to their irradiated, poorly ventilated homeland!",
        "play_sound": "files/VO_GVG_098_Play_01.ogg",
        "attack_sound": "files/VO_GVG_098_Attack_02.ogg",
        "image": "files/GVG_098.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_098_premium.gif"
    },
    {
        "card_id": "GVG_092",
        "set": "GVG",
        "name": "Gnomish Experimenter",
        "collectible": true,
        "flavor_text": "He's legitimately surprised every time he turns himself into a chicken.",
        "play_sound": "files/VO_GVG_092_Play_01.ogg",
        "attack_sound": "files/VO_GVG_092_Attack_02.ogg",
        "image": "files/GVG_092.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_092_premium.gif"
    },
    {
        "card_id": "CS2_147",
        "set": "BASIC",
        "name": "Gnomish Inventor",
        "collectible": true,
        "flavor_text": "She's never quite sure what she's making, she just knows it's AWESOME!",
        "play_sound": "files/VO_CS2_147_Play_01.ogg",
        "attack_sound": "files/VO_CS2_147_Attack_02.ogg",
        "image": "files/CS2_147.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_147_premium.gif"
    },
    {
        "card_id": "GVG_023",
        "set": "GVG",
        "name": "Goblin Auto-Barber",
        "collectible": true,
        "flavor_text": "This guy is excellent at adjusting your haircut and/or height.",
        "play_sound": "files/SFX_GVG_023_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_023_Attack.ogg",
        "image": "files/GVG_023.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_023_premium.gif"
    },
    {
        "card_id": "GVG_004",
        "set": "GVG",
        "name": "Goblin Blastmage",
        "collectible": true,
        "flavor_text": "If you can't find a bomb to throw, just pick up any goblin invention and throw that.",
        "play_sound": "files/VO_GVG_004_Play_01.ogg",
        "attack_sound": "files/VO_GVG_004_Attack_02.ogg",
        "image": "files/GVG_004.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_004_premium.gif"
    },
    {
        "card_id": "GVG_095",
        "set": "GVG",
        "name": "Goblin Sapper",
        "collectible": true,
        "flavor_text": "He’s not such a binge exploder anymore. These days, he only explodes socially.",
        "play_sound": "files/VO_GVG_095_Play_01.ogg",
        "attack_sound": "files/VO_GVG_095_Attack_02.ogg",
        "image": "files/GVG_095.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_095_premium.gif"
    },
    {
        "card_id": "UNG_807",
        "set": "UNGORO",
        "name": "Golakka Crawler",
        "collectible": true,
        "flavor_text": "Universally adored by both control decks and ninjas.",
        "play_sound": "files/UNG_807_GollakaCrawler_Play.ogg",
        "attack_sound": "files/UNG_807_GollakaCrawler_Attack.ogg",
        "image": "files/UNG_807.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_807_premium.gif"
    },
    {
        "card_id": "LOE_019t2",
        "set": "LOE",
        "name": "Golden Monkey",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_LOE_019t2_Play.ogg",
        "attack_sound": "files/SFX_LOE_019t2_Attack.ogg",
        "image": "files/LOE_019t2.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_019t2_premium.gif"
    },
    {
        "card_id": "CS1_042",
        "set": "BASIC",
        "name": "Goldshire Footman",
        "collectible": true,
        "flavor_text": "If 1/2 minions are all that is defending Goldshire, you would think it would have been overrun years ago.",
        "play_sound": "files/VO_CS1_042_Play_01.ogg",
        "attack_sound": "files/VO_CS1_042_Attack_02.ogg",
        "image": "files/CS1_042.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS1_042_premium.gif"
    },
    {
        "card_id": "LOE_039",
        "set": "LOE",
        "name": "Gorillabot A-3",
        "collectible": true,
        "flavor_text": "A-1 and A-2 went nuts, when they should have gone bolts.",
        "play_sound": "files/SFX_LOE_039_Play.ogg",
        "attack_sound": "files/SFX_LOE_039_Attack.ogg",
        "image": "files/LOE_039.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_039_premium.gif"
    },
    {
        "card_id": "AT_122",
        "set": "TGT",
        "name": "Gormok the Impaler",
        "collectible": true,
        "flavor_text": "Gormok has been giving impaling lessons in a small tent near the tournament grounds.  For only 25g you too could learn the fine art of impaling!",
        "play_sound": "files/AT_122_GormokTheImpaler_Play.ogg",
        "attack_sound": "files/AT_122_GormokTheImpaler_Attack.ogg",
        "image": "files/AT_122.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_122_premium.gif"
    },
    {
        "card_id": "AT_118",
        "set": "TGT",
        "name": "Grand Crusader",
        "collectible": true,
        "flavor_text": "A veteran of a number of crusades, she is a force for light and goodness.  Her latest crusade is against goblin telemarketers.",
        "play_sound": "files/VO_AT_118_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_118_ATTACK_02.ogg",
        "image": "files/AT_118.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_118_premium.gif"
    },
    {
        "card_id": "ICC_097",
        "set": "ICECROWN",
        "name": "Grave Shambler",
        "collectible": true,
        "flavor_text": "I think one of the necromancers got a little carried away.",
        "play_sound": "files/ICC_097_ShamblingMound_Play.ogg",
        "attack_sound": "files/ICC_097_ShamblingMound_Attack.ogg",
        "image": "files/ICC_097.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_097_premium.gif"
    },
    {
        "card_id": "BRM_019",
        "set": "BRM",
        "name": "Grim Patron",
        "collectible": true,
        "flavor_text": "If you love getting your face punched, come to the Grim Guzzler!",
        "play_sound": "files/VO_BRM_019_Play_01.ogg",
        "attack_sound": "files/VO_BRM_019_Attack_02.ogg",
        "image": "files/BRM_019.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_019_premium.gif"
    },
    {
        "card_id": "CFM_639",
        "set": "GANGS",
        "name": "Grimestreet Enforcer",
        "collectible": true,
        "flavor_text": "\"Sir, you don't have a permit to park your mount here.\"",
        "play_sound": "files/VO_CFM_639_Male_Dwarf_Play_01.ogg",
        "attack_sound": "files/VO_CFM_639_Male_Dwarf_Attack_01.ogg",
        "image": "files/CFM_639.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_639_premium.gif"
    },
    {
        "card_id": "CFM_321",
        "set": "GANGS",
        "name": "Grimestreet Informant",
        "collectible": true,
        "flavor_text": "\"Naw, naw.  You're talkin' about Grime BOULEVARD.  I ain't know nuthin' 'bout that.\"",
        "play_sound": "files/VO_CFM_321_Male_OrcAdolescent_Play_02.ogg",
        "attack_sound": "files/VO_CFM_321_Male_OrcAdolescent_Attack_02.ogg",
        "image": "files/CFM_321.gif",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_321_premium.gif"
    },
    {
        "card_id": "CFM_753",
        "set": "GANGS",
        "name": "Grimestreet Outfitter",
        "collectible": true,
        "flavor_text": "If you bargain hard, he'll throw in the hat.",
        "play_sound": "files/VO_CFM_753_Male_Goblin_Play_01.ogg",
        "attack_sound": "files/VO_CFM_753_Male_Goblin_Attack_01.ogg",
        "image": "files/CFM_753.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_753_premium.gif"
    },
    {
        "card_id": "CFM_755",
        "set": "GANGS",
        "name": "Grimestreet Pawnbroker",
        "collectible": true,
        "flavor_text": "\"I don't know a lot about used GvG cards, so I'm going to have to call in an expert.\"",
        "play_sound": "files/VO_CFM_755_Female_Goblin_Play_01.ogg",
        "attack_sound": "files/VO_CFM_755_Female_Goblin_Attack_01.ogg",
        "image": "files/CFM_755.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_755_premium.gif"
    },
    {
        "card_id": "CFM_062",
        "set": "GANGS",
        "name": "Grimestreet Protector",
        "collectible": true,
        "flavor_text": "Some new asphalt should do the trick.",
        "play_sound": "files/VO_CFM_062_Male_Human_Play_01.ogg",
        "attack_sound": "files/VO_CFM_062_Male_Human_Attack_01.ogg",
        "image": "files/CFM_062.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_062_premium.gif"
    },
    {
        "card_id": "CFM_853",
        "set": "GANGS",
        "name": "Grimestreet Smuggler",
        "collectible": true,
        "flavor_text": "She's got anything you want.  Need the latest derpinger?  No problem!",
        "play_sound": "files/VO_CFM_853_Female_Tauren_Play_01.ogg",
        "attack_sound": "files/VO_CFM_853_Female_Tauren_Attack_01.ogg",
        "image": "files/CFM_853.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_853_premium.gif"
    },
    {
        "card_id": "CFM_650",
        "set": "GANGS",
        "name": "Grimscale Chum",
        "collectible": true,
        "flavor_text": "Listen, see?  We'll take 'em to the docks, see?  And throw 'em in the sea, see?",
        "play_sound": "files/VO_CFM_650_Male_Murloc_Play_04.ogg",
        "attack_sound": "files/VO_CFM_650_Male_Murloc_Attack_01.ogg",
        "image": "files/CFM_650.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_650_premium.gif"
    },
    {
        "card_id": "EX1_508",
        "set": "BASIC",
        "name": "Grimscale Oracle",
        "collectible": true,
        "flavor_text": "These are the brainy murlocs.  It turns out that doesn’t mean much.",
        "play_sound": "files/EX1_508_Grimscale_Oracle_EnterPlay1.ogg",
        "attack_sound": "files/EX1_508_Grimscale_Oracle_Attack2.ogg",
        "image": "files/EX1_508.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_508_premium.gif"
    },
    {
        "card_id": "CFM_754",
        "set": "GANGS",
        "name": "Grimy Gadgeteer",
        "collectible": true,
        "flavor_text": "\"You look like a Gadgetgun 3000-Mark IV man, am I right?\"",
        "play_sound": "files/VO_CFM_754_Male_Goblin_Play_01.ogg",
        "attack_sound": "files/VO_CFM_754_Male_Goblin_Attack_03.ogg",
        "image": "files/CFM_754.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_754_premium.gif"
    },
    {
        "card_id": "EX1_414",
        "set": "CLASSIC",
        "name": "Grommash Hellscream",
        "collectible": true,
        "flavor_text": "Grommash drank the tainted blood of Mannoroth, dooming the orcs to green skin and red eyes!  Maybe not his best decision.",
        "play_sound": "files/VO_EX1_414_Play_01.ogg",
        "attack_sound": "files/VO_EX1_414_Attack_02.ogg",
        "image": "files/EX1_414.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_414_premium.gif"
    },
    {
        "card_id": "CFM_666",
        "set": "GANGS",
        "name": "Grook Fu Master",
        "collectible": true,
        "flavor_text": "Grook Fu, the ancient Hozen art of bashing heads with a stick.",
        "play_sound": "files/VO_CFM_666_Male_Hozen_Play_01.ogg",
        "attack_sound": "files/VO_CFM_666_Male_Hozen_Attack_02.ogg",
        "image": "files/CFM_666.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_666_premium.gif"
    },
    {
        "card_id": "OG_152",
        "set": "OG",
        "name": "Grotesque Dragonhawk",
        "collectible": true,
        "flavor_text": "They say that \"grotesque is in the eye of the beholder,\" but that's just because they've never seen a Grotesque Dragonhawk. Yikes!",
        "play_sound": "files/OG_152_GrotesqueDragonhawk_Play.ogg",
        "attack_sound": "files/OG_152_GrotesqueDragonhawk_Attack.ogg",
        "image": "files/OG_152.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_152_premium.gif"
    },
    {
        "card_id": "GVG_032",
        "set": "GVG",
        "name": "Grove Tender",
        "collectible": true,
        "flavor_text": "Likes: Hiking and the great outdoors. Dislikes: Goblin shredders and sandals. (Can’t find any that fit!).",
        "play_sound": "files/VO_GVG_032_Play_01.ogg",
        "attack_sound": "files/VO_GVG_032_Attack_02.ogg",
        "image": "files/GVG_032.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_032_premium.gif"
    },
    {
        "card_id": "ICCA07_004",
        "set": "ICECROWN",
        "name": "Growing Ooze",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/ICCA07_004_GrowingOoze_Play.ogg",
        "attack_sound": "files/ICCA07_004_GrowingOoze_Attack.ogg",
        "image": "files/ICCA07_004.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/ICCA07_004.png"
    },
    {
        "card_id": "NEW1_038",
        "set": "CLASSIC",
        "name": "Gruul",
        "collectible": true,
        "flavor_text": "He's Gruul \"the Dragonkiller\".  He just wanted to cuddle them… he never meant to…",
        "play_sound": "files/VO_NEW1_038_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_038_Attack_02.ogg",
        "image": "files/NEW1_038.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_038_premium.gif"
    },
    {
        "card_id": "NAX15_03n",
        "set": "NAXX",
        "name": "Guardian of Icecrown",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_NAX15_03n_EnterPlay.ogg",
        "attack_sound": "files/SFX_NAX15_03n_Attack.ogg",
        "image": "files/NAX15_03n.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX15_03n.png"
    },
    {
        "card_id": "NAX15_03t",
        "set": "NAXX",
        "name": "Guardian of Icecrown2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_NAX15_03t_EnterPlay.ogg",
        "attack_sound": "files/SFX_NAX15_03t_Attack.ogg",
        "image": "files/NAX15_03t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX15_03t.png"
    },
    {
        "card_id": "CS2_088",
        "set": "BASIC",
        "name": "Guardian of Kings",
        "collectible": true,
        "flavor_text": "Holy beings from the beyond are so cliché!",
        "play_sound": "files/VO_CS2_088_Play_01.ogg",
        "attack_sound": "files/VO_CS2_088_Attack_02.ogg",
        "image": "files/CS2_088.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_088_premium.gif"
    },
    {
        "card_id": "EX1_399",
        "set": "BASIC",
        "name": "Gurubashi Berserker",
        "collectible": true,
        "flavor_text": "No Pain, No Gain.",
        "play_sound": "files/SFX_EX1_399_EnterPlay_02.ogg",
        "attack_sound": "files/SFX_EX1_399_Attack_02.ogg",
        "image": "files/EX1_399.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_399_premium.gif"
    },
    {
        "card_id": "BRMA01_4t",
        "set": "BRM",
        "name": "Guzzler",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_BRMA01_4t_Play3_03.ogg",
        "attack_sound": "files/VO_BRMA01_4t_Attack_05.ogg",
        "image": "files/BRMA01_4t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA01_4t.png"
    },
    {
        "card_id": "BRMA09_5t",
        "set": "BRM",
        "name": "Gyth",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BRMA09_5t_Gyth_EnterPlay_1.ogg",
        "attack_sound": "files/BRMA09_5t_Gyth_Attack_1.ogg",
        "image": "files/BRMA09_5t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA09_5t.png"
    },
    {
        "card_id": "ICC_835",
        "set": "ICECROWN",
        "name": "Hadronox",
        "collectible": true,
        "flavor_text": "The viziers of Azjol-Nerub released Hadronox as a last-ditch effort to hold back the Lich King. They did so by VERY carefully scooping him up in a LARGE newspaper and releasing him.",
        "play_sound": "files/ICC_835_Hadronox_Play.ogg",
        "attack_sound": "files/ICC_835_Hadronox_Attack.ogg",
        "image": "files/ICC_835.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_835_premium.gif"
    },
    {
        "card_id": "OG_209",
        "set": "OG",
        "name": "Hallazeal the Ascended",
        "collectible": true,
        "flavor_text": "Hallazeals all your dallazamage.",
        "play_sound": "files/VO_OG_209_Male_Elemental_Play_01.ogg",
        "attack_sound": "files/VO_OG_209_Male_Elemental_Attack_01.ogg",
        "image": "files/OG_209.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_209_premium.gif"
    },
    {
        "card_id": "EX1_558",
        "set": "CLASSIC",
        "name": "Harrison Jones",
        "collectible": true,
        "flavor_text": "“That belongs in the Hall of Explorers!”",
        "play_sound": "files/VO_EX1_558_Play_01.ogg",
        "attack_sound": "files/HarrisonJ_EX1_558_whip_attack.ogg",
        "image": "files/EX1_558.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_558_premium.gif"
    },
    {
        "card_id": "EX1_556",
        "set": "CLASSIC",
        "name": "Harvest Golem",
        "collectible": true,
        "flavor_text": "\"Overheat threshold exceeded. System failure. Wheat clog in port two. Shutting down.\"",
        "play_sound": "files/SFX_EX1_556_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_556_Attack.ogg",
        "image": "files/EX1_556.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_556_premium.gif"
    },
    {
        "card_id": "FP1_002",
        "set": "NAXX",
        "name": "Haunted Creeper",
        "collectible": true,
        "flavor_text": "Arachnofauxbia: Fear of fake spiders.",
        "play_sound": "files/SFX_FP1_002_EnterPlay.ogg",
        "attack_sound": "files/SFX_FP1_002_Attack.ogg",
        "image": "files/FP1_002.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_002_premium.gif"
    },
    {
        "card_id": "NEW1_009",
        "set": "BASIC",
        "name": "Healing Totem",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/NEW1_009_healing_totem_EnterPlay.ogg",
        "attack_sound": "files/SFX_NEW1_009_Attack_00.ogg",
        "image": "files/NEW1_009.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_009_premium.gif"
    },
    {
        "card_id": "TB_SPT_DPromoMinion",
        "set": "TB",
        "name": "Hell Bovine",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/HellBovine_TB_SPT_DPromoMinion_Play.ogg",
        "attack_sound": "files/HellBovine_TB_SPT_DPromoMinion_Attack.ogg",
        "image": "files/TB_SPT_DPromoMinion.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/TB_SPT_DPromoMinion.png"
    },
    {
        "card_id": "TB_SPT_DPromoMinionChamp",
        "set": "TB",
        "name": "Hell Bovine Champion",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/HellBovineChampion_TB_SPT_DPromoMinionChamp_Play.ogg",
        "attack_sound": "files/HellBovineChampion_TB_SPT_DPromoMinionChamp_Attack.ogg",
        "image": "files/TB_SPT_DPromoMinionChamp.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/TB_SPT_DPromoMinionChamp.png"
    },
    {
        "card_id": "GVG_120",
        "set": "GVG",
        "name": "Hemet Nesingwary",
        "collectible": true,
        "flavor_text": "It's hard to make a living as a hunter in a world where beasts instantly reappear minutes after you kill them.",
        "play_sound": "files/VO_GVG_120_Play_01.ogg",
        "attack_sound": "files/VO_GVG_120_Attack_02.ogg",
        "image": "files/GVG_120.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_120_premium.gif"
    },
    {
        "card_id": "UNG_840",
        "set": "UNGORO",
        "name": "Hemet, Jungle Hunter",
        "collectible": true,
        "flavor_text": "The goblin travel agency lost his luggage, but he's still having a great vacation!",
        "play_sound": "files/VO_UNG_840_Male_Dwarf_Play_05.ogg",
        "attack_sound": "files/VO_UNG_840_Male_Dwarf_Attack_03.ogg",
        "image": "files/UNG_840.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_840_premium.gif"
    },
    {
        "card_id": "OG_316",
        "set": "OG",
        "name": "Herald Volazj",
        "collectible": true,
        "flavor_text": "His whole job is yelling \"Yogg-Saron comin'!\"",
        "play_sound": "files/VO_OG_316_Male_Faceless_Play_01.ogg",
        "attack_sound": "files/VO_OG_316_Male_Faceless_Attack_01.ogg",
        "image": "files/OG_316.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_316_premium.gif"
    },
    {
        "card_id": "CFM_653",
        "set": "GANGS",
        "name": "Hired Gun",
        "collectible": true,
        "flavor_text": "He loves his job and would do it for free!  (But don't tell his boss!)",
        "play_sound": "files/VO_CFM_653_Male_Orc_Play_01.ogg",
        "attack_sound": "files/VO_CFM_653_Male_Orc_Attack_01.ogg",
        "image": "files/CFM_653.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_653_premium.gif"
    },
    {
        "card_id": "CFM_643",
        "set": "GANGS",
        "name": "Hobart Grapplehammer",
        "collectible": true,
        "flavor_text": "Grapplehammer is the horrible mind behind the Automatic Piranha Launcher (banned in 7 districts)!",
        "play_sound": "files/VO_CFM_643_Male_Goblin_Play_01.ogg",
        "attack_sound": "files/VO_CFM_643_Male_Goblin_Attack_01.ogg",
        "image": "files/CFM_643.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_643_premium.gif"
    },
    {
        "card_id": "GVG_104",
        "set": "GVG",
        "name": "Hobgoblin",
        "collectible": true,
        "flavor_text": "Hobgoblins are meeting next week to discuss union benefits.  First on the list: dental plan.",
        "play_sound": "files/VO_GVG_104_Play_01.ogg",
        "attack_sound": "files/VO_GVG_104_Attack_02.ogg",
        "image": "files/GVG_104.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_104_premium.gif"
    },
    {
        "card_id": "NEW1_040",
        "set": "CLASSIC",
        "name": "Hogger",
        "collectible": true,
        "flavor_text": "Hogger is super powerful. If you kill him, it's because he \u003ci\u003elet\u003c/i\u003e you.",
        "play_sound": "files/VO_TUTORIAL_01_HOGGER_02_02.ogg",
        "attack_sound": "files/VO_TUTORIAL_01_HOGGER_01_01.ogg",
        "image": "files/NEW1_040.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_040_premium.gif"
    },
    {
        "card_id": "OG_318",
        "set": "OG",
        "name": "Hogger, Doom of Elwynn",
        "collectible": true,
        "flavor_text": "When C'thun went to sleep, he checked under his bed for Hogger.",
        "play_sound": "files/OG_318_HoggerDofE_Play.ogg",
        "attack_sound": "files/OG_318_HoggerDofE_Attack.ogg",
        "image": "files/OG_318.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_318_premium.gif"
    },
    {
        "card_id": "AT_011",
        "set": "TGT",
        "name": "Holy Champion",
        "collectible": true,
        "flavor_text": "She really likes seeing people get better.  That's why she hurts them in the first place.",
        "play_sound": "files/VO_AT_011_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_011_ATTACK_02.ogg",
        "image": "files/AT_011.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_011_premium.gif"
    },
    {
        "card_id": "Mekka1",
        "set": "HOF",
        "name": "Homing Chicken",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_Mekka1_EnterPlay.ogg",
        "attack_sound": "files/SFX_Mekka1_Attack.ogg",
        "image": "files/Mekka1.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/Mekka1_premium.gif"
    },
    {
        "card_id": "OG_334",
        "set": "OG",
        "name": "Hooded Acolyte",
        "collectible": true,
        "flavor_text": "Wait, what kind of acolyte doesn't wear a hood?",
        "play_sound": "files/VO_OG_334_Female_Human_Play_01.ogg",
        "attack_sound": "files/VO_OG_334_Female_Human_Attack_01.ogg",
        "image": "files/OG_334.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_334_premium.gif"
    },
    {
        "card_id": "UNG_938",
        "set": "UNGORO",
        "name": "Hot Spring Guardian",
        "collectible": true,
        "flavor_text": "NONE SHALL PASS until at least an hour after eating.",
        "play_sound": "files/HotSpringGuardian_UNG_938_Play.ogg",
        "attack_sound": "files/HotSpringGuardian_UNG_938_Attack.ogg",
        "image": "files/UNG_938.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_938_premium.gif"
    },
    {
        "card_id": "EX1_538t",
        "set": "CLASSIC",
        "name": "Hound",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_EX1_538t_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_538t_Attack.ogg",
        "image": "files/EX1_538t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_538t_premium.gif"
    },
    {
        "card_id": "DS1_070",
        "set": "BASIC",
        "name": "Houndmaster",
        "collectible": true,
        "flavor_text": "\"Who let the dogs out?\" he asks.  It's rhetorical.",
        "play_sound": "files/VO_DS1_070_Play_01.ogg",
        "attack_sound": "files/VO_DS1_070_Attack_02.ogg",
        "image": "files/DS1_070.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/DS1_070_premium.gif"
    },
    {
        "card_id": "ICC_218",
        "set": "ICECROWN",
        "name": "Howlfiend",
        "collectible": true,
        "flavor_text": "The problem is that he carries those cards in his mouth.",
        "play_sound": "files/ICC_218_Howlfiend_Play.ogg",
        "attack_sound": "files/ICC_218_Howlfiend_Attack.ogg",
        "image": "files/ICC_218.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_218_premium.gif"
    },
    {
        "card_id": "ICC_801",
        "set": "ICECROWN",
        "name": "Howling Commander",
        "collectible": true,
        "flavor_text": "Enlistment in her battalion comes with several pairs of earplugs.",
        "play_sound": "files/VO_ICC_801_Female_Dwarf_Play_01.ogg",
        "attack_sound": "files/VO_ICC_801_Female_Dwarf_Attack_01.ogg",
        "image": "files/ICC_801.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_801_premium.gif"
    },
    {
        "card_id": "CFM_067",
        "set": "GANGS",
        "name": "Hozen Healer",
        "collectible": true,
        "flavor_text": "He didn't go to school for healing, but we keep losing all the good healers to Ratchet, so I guess we'll take him.",
        "play_sound": "files/VO_CFM_067_Male_Hozen_Play_03.ogg",
        "attack_sound": "files/VO_CFM_067_Male_Hozen_Attack_01.ogg",
        "image": "files/CFM_067.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_067_premium.gif"
    },
    {
        "card_id": "NEW1_034",
        "set": "BASIC",
        "name": "Huffer",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_NEW1_034_EnterPlay.ogg",
        "attack_sound": "files/SFX_NEW1_034_Attack.ogg",
        "image": "files/NEW1_034.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_034_premium.gif"
    },
    {
        "card_id": "LOE_046",
        "set": "LOE",
        "name": "Huge Toad",
        "collectible": true,
        "flavor_text": "Deals damage when he croaks.",
        "play_sound": "files/SFX_LOE_046_Play.ogg",
        "attack_sound": "files/SFX_LOE_046_Attack.ogg",
        "image": "files/LOE_046.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_046_premium.gif"
    },
    {
        "card_id": "UNG_844",
        "set": "UNGORO",
        "name": "Humongous Razorleaf",
        "collectible": true,
        "flavor_text": "Loves goblins.  In a light cream sauce.",
        "play_sound": "files/UNG_844_HumongusRaptorLeaf_Play.ogg",
        "attack_sound": "files/UNG_844_HumongusRaptorLeaf_Attack.ogg",
        "image": "files/UNG_844.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_844_premium.gif"
    },
    {
        "card_id": "NEW1_017",
        "set": "CLASSIC",
        "name": "Hungry Crab",
        "collectible": true,
        "flavor_text": "Murloc.  It's what's for dinner.",
        "play_sound": "files/NEW1_017_Hungry_Crab_EnterPlay1.ogg",
        "attack_sound": "files/NEW1_017_Hungry_Crab_Attack1.ogg",
        "image": "files/NEW1_017.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_017_premium.gif"
    },
    {
        "card_id": "BRM_026",
        "set": "BRM",
        "name": "Hungry Dragon",
        "collectible": true,
        "flavor_text": "Hungry Hungry Dragon is NOT a fun game.",
        "play_sound": "files/BRM_026_HungryDragon_EnterPlay_1.ogg",
        "attack_sound": "files/BRM_026_HungryDragon_Attack_1.ogg",
        "image": "files/BRM_026.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_026_premium.gif"
    },
    {
        "card_id": "LOEA09_5",
        "set": "LOE",
        "name": "Hungry Naga",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/LOEA09_5_HungryNaga_Play.ogg",
        "attack_sound": "files/LOEA09_5_HungryNaga_Attack.ogg",
        "image": "files/LOEA09_5.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA09_5.png"
    },
    {
        "card_id": "UNG_011",
        "set": "UNGORO",
        "name": "Hydrologist",
        "collectible": true,
        "flavor_text": "Murloc hydrologists are pretty rare.  Most murloc undergrads pick computer science.",
        "play_sound": "files/VO_UNG_011_Female_Murloc_Play_01.ogg",
        "attack_sound": "files/VO_UNG_011_Female_Murloc_Attack_05.ogg",
        "image": "files/UNG_011.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_011_premium.gif"
    },
    {
        "card_id": "ICC_855",
        "set": "ICECROWN",
        "name": "Hyldnir Frostrider",
        "collectible": true,
        "flavor_text": "Don't be fooled, that polar bear's the one in charge.",
        "play_sound": "files/VO_ICC_855_Female_Vrykul_Play_01.ogg",
        "attack_sound": "files/VO_ICC_855_Female_Vrykul_Attack_01.ogg",
        "image": "files/ICC_855.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_855_premium.gif"
    },
    {
        "card_id": "AT_092",
        "set": "TGT",
        "name": "Ice Rager",
        "collectible": true,
        "flavor_text": "He's a lot cooler than Magma Rager.",
        "play_sound": "files/AT_092_IceRager_Play.ogg",
        "attack_sound": "files/AT_092_IceRager_Attack.ogg",
        "image": "files/AT_092.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_092_premium.gif"
    },
    {
        "card_id": "ICC_068",
        "set": "ICECROWN",
        "name": "Ice Walker",
        "collectible": true,
        "flavor_text": "Ice \u003ci\u003eWalker\u003c/i\u003e you say? He doesn't have feet!",
        "play_sound": "files/VO_ICC_068_Female_BloodElf_Play_02.ogg",
        "attack_sound": "files/VO_ICC_068_Female_BloodElf_Attack_01.ogg",
        "image": "files/ICC_068.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_068_premium.gif"
    },
    {
        "card_id": "AT_125",
        "set": "TGT",
        "name": "Icehowl",
        "collectible": true,
        "flavor_text": "This massive yeti just closes his eyes and charges at the nearest target.  The nearest Target is a couple blocks away and has sick deals on skateboards.",
        "play_sound": "files/SFX_AT_125_Play_01.ogg",
        "attack_sound": "files/SFX_AT_125_Attack_01.ogg",
        "image": "files/AT_125.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_125_premium.gif"
    },
    {
        "card_id": "KARA_09_03a",
        "set": "KARA",
        "name": "Icky Imp",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KARA_09_03a_Male_Imp_Play_01.ogg",
        "attack_sound": "files/VO_KARA_09_03a_Male_Imp_Attack_01.ogg",
        "image": "files/KARA_09_03a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KARA_09_03a.png"
    },
    {
        "card_id": "OG_114a",
        "set": "OG",
        "name": "Icky Tentacle",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/IckyTentacle_OG_114a_Play.ogg",
        "attack_sound": "files/IckyTentacle_OG_114a_Attack.ogg",
        "image": "files/OG_114a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_114a_premium.gif"
    },
    {
        "card_id": "UNG_845",
        "set": "UNGORO",
        "name": "Igneous Elemental",
        "collectible": true,
        "flavor_text": "We wanted to name him \"Ingenious Elemental\", but he just wasn't that bright.",
        "play_sound": "files/VO_UNG_845_Male_Elemental_Play_01.ogg",
        "attack_sound": "files/VO_UNG_845_Male_Elemental_Attack_01.ogg",
        "image": "files/UNG_845.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_845_premium.gif"
    },
    {
        "card_id": "EX1_614",
        "set": "CLASSIC",
        "name": "Illidan Stormrage",
        "collectible": true,
        "flavor_text": "Illidan's brother, Malfurion, imprisoned him beneath Hyjal for 10,000 years.  Stormrages are not good at letting go of grudges.",
        "play_sound": "files/VO_TUTORIAL_05_ILLIDAN_01_02.ogg",
        "attack_sound": "files/VO_TUTORIAL_05_ILLIDAN_04_05.ogg",
        "image": "files/EX1_614.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_614_premium.gif"
    },
    {
        "card_id": "GVG_089",
        "set": "GVG",
        "name": "Illuminator",
        "collectible": true,
        "flavor_text": "\"LUMOS!\" is not what they yell. What do you think this is, Hogwarts?",
        "play_sound": "files/VO_GVG_089_Play_01.ogg",
        "attack_sound": "files/VO_GVG_089_Attack_02.ogg",
        "image": "files/GVG_089.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_089_premium.gif"
    },
    {
        "card_id": "EX1_598",
        "set": "CLASSIC",
        "name": "Imp",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/WoW_EX1_598_Imp_EnterPlay.ogg",
        "attack_sound": "files/WoW_EX1_598_Imp_Attack.ogg",
        "image": "files/EX1_598.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_598_premium.gif"
    },
    {
        "card_id": "GVG_045t",
        "set": "GVG",
        "name": "Imp2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_GVG_045t_Imp_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_045t_Imp_Attack.ogg",
        "image": "files/GVG_045t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_045t_premium.gif"
    },
    {
        "card_id": "BRM_006",
        "set": "BRM",
        "name": "Imp Gang Boss",
        "collectible": true,
        "flavor_text": "His imp gang likes to sneak into Stormwind to spraypaint \"Ragnaros Rulez\" on the Mage Tower.",
        "play_sound": "files/VO_BRM_006_Play_01.ogg",
        "attack_sound": "files/VO_BRM_006_Attack_02.ogg",
        "image": "files/BRM_006.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_006_premium.gif"
    },
    {
        "card_id": "EX1_597",
        "set": "CLASSIC",
        "name": "Imp Master",
        "collectible": true,
        "flavor_text": "She would enjoy the job a lot more if she just could get the imps to QUIT BITING HER.",
        "play_sound": "files/VO_EX1_597_Play_01.ogg",
        "attack_sound": "files/VO_EX1_597_Attack_02.ogg",
        "image": "files/EX1_597.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_597_premium.gif"
    },
    {
        "card_id": "EX1_tk34",
        "set": "CLASSIC",
        "name": "Infernal",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_EX1_tk34_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_tk34_Attack.ogg",
        "image": "files/EX1_tk34.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_tk34_premium.gif"
    },
    {
        "card_id": "OG_249",
        "set": "OG",
        "name": "Infested Tauren",
        "collectible": true,
        "flavor_text": "The Overmind and the Old Gods are surprisingly similar.",
        "play_sound": "files/VO_OG_249_Male_Tauren_Play_01.ogg",
        "attack_sound": "files/VO_OG_249_Male_Tauren_Attack_01.ogg",
        "image": "files/OG_249.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_249_premium.gif"
    },
    {
        "card_id": "OG_216",
        "set": "OG",
        "name": "Infested Wolf",
        "collectible": true,
        "flavor_text": "A little flea powder will fix that right up.",
        "play_sound": "files/InfestedWolf_OG_216_Play.ogg",
        "attack_sound": "files/InfestedWolf_OG_216_Attack.ogg",
        "image": "files/OG_216.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_216_premium.gif"
    },
    {
        "card_id": "CS2_181",
        "set": "CLASSIC",
        "name": "Injured Blademaster",
        "collectible": true,
        "flavor_text": "He claims it is an old war wound, but we think he just cut himself shaving.",
        "play_sound": "files/VO_CS2_181_Play_01.ogg",
        "attack_sound": "files/VO_CS2_181_Attack_02.ogg",
        "image": "files/CS2_181.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_181_premium.gif"
    },
    {
        "card_id": "AT_105",
        "set": "TGT",
        "name": "Injured Kvaldir",
        "collectible": true,
        "flavor_text": "Don't worry.  With a little skin cream he's going to clear right up.",
        "play_sound": "files/VO_AT_105_PLAY_01_ALT.ogg",
        "attack_sound": "files/VO_AT_105_ATTACK_02.ogg",
        "image": "files/AT_105.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_105_premium.gif"
    },
    {
        "card_id": "CFM_687",
        "set": "GANGS",
        "name": "Inkmaster Solia",
        "collectible": true,
        "flavor_text": "Solia marks the Kabal with intricate tattoos that grant immense power. Also it makes it harder for other gangs to recruit from their numbers. BACK OFF, GOONS.",
        "play_sound": "files/VO_CFM_687_Female_BloodElf_Play_02.ogg",
        "attack_sound": "files/VO_CFM_687_Female_BloodElf_Attack_01.ogg",
        "image": "files/CFM_687.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_687_premium.gif"
    },
    {
        "card_id": "ICC_829t4",
        "set": "ICECROWN",
        "name": "Inquisitor Whitemane",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_ICC_829t4_Female_Human_Play_01.ogg",
        "attack_sound": "files/VO_ICC_829t4_Female_Human_Attack_01.ogg",
        "image": "files/ICC_829t4.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_829t4_premium.gif"
    },
    {
        "card_id": "GVG_056",
        "set": "GVG",
        "name": "Iron Juggernaut",
        "collectible": true,
        "flavor_text": "The Iron Juggernaut guards Orgrimmar and has just earned the \"Employee of the Month\" award!",
        "play_sound": "files/GVG_056_IronJuggernaut_EnterPlay.ogg",
        "attack_sound": "files/GVG_056_IronJuggernaut_Attack.ogg",
        "image": "files/GVG_056.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_056_premium.gif"
    },
    {
        "card_id": "GVG_027",
        "set": "GVG",
        "name": "Iron Sensei",
        "collectible": true,
        "flavor_text": "Mechs like learning from him because he really speaks their language.\n\n0110100001101001",
        "play_sound": "files/VO_GVG_027_Play_01_ALT.ogg",
        "attack_sound": "files/VO_GVG_027_Attack_02.ogg",
        "image": "files/GVG_027.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_027_premium.gif"
    },
    {
        "card_id": "CS2_232",
        "set": "BASIC",
        "name": "Ironbark Protector",
        "collectible": true,
        "flavor_text": "I \u003ci\u003edare\u003c/i\u003e you to attack Darnassus.",
        "play_sound": "files/CS2_232_Ironbark_Protector_EnterPlay2.ogg",
        "attack_sound": "files/CS2_232_Ironbark_Protector_Attack4.ogg",
        "image": "files/CS2_232.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_232_premium.gif"
    },
    {
        "card_id": "CS2_203",
        "set": "CLASSIC",
        "name": "Ironbeak Owl",
        "collectible": true,
        "flavor_text": "Their wings are silent but their screech is... whatever the opposite of silent is.",
        "play_sound": "files/SFX_CS2_203_EnterPlay.ogg",
        "attack_sound": "files/SFX_CS2_203_Attack.ogg",
        "image": "files/CS2_203.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_203_premium.gif"
    },
    {
        "card_id": "CS2_141",
        "set": "BASIC",
        "name": "Ironforge Rifleman",
        "collectible": true,
        "flavor_text": "\"Ready! Aim! Drink!\"",
        "play_sound": "files/VO_CS2_141_Play_01.ogg",
        "attack_sound": "files/VO_CS2_141_Attack_02.ogg",
        "image": "files/CS2_141.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_141_premium.gif"
    },
    {
        "card_id": "CS2_125",
        "set": "BASIC",
        "name": "Ironfur Grizzly",
        "collectible": true,
        "flavor_text": "\"Bear Carcass 1/10\"",
        "play_sound": "files/CS2_125_Ironfur_Grizzly_EnterPlay1.ogg",
        "attack_sound": "files/CS2_125_Ironfur_Grizzly_Attack3.ogg",
        "image": "files/CS2_125.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_125_premium.gif"
    },
    {
        "card_id": "CFM_343",
        "set": "GANGS",
        "name": "Jade Behemoth",
        "collectible": true,
        "flavor_text": "I think we should talk about the jade elephant in the room.",
        "play_sound": "files/JadeElekk_CFM_343_Play.ogg",
        "attack_sound": "files/JadeElekk_CFM_343_Attack.ogg",
        "image": "files/CFM_343.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_343_premium.gif"
    },
    {
        "card_id": "CFM_312",
        "set": "GANGS",
        "name": "Jade Chieftain",
        "collectible": true,
        "flavor_text": "Seeing his Jade Golem grow up into the tall, handsome 6/6 standing before him was the proudest moment of his life.",
        "play_sound": "files/VO_CFM_312_Male_Mogu_Play_01.ogg",
        "attack_sound": "files/VO_CFM_312_Male_Mogu_Attack_01.ogg",
        "image": "files/CFM_312.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_312_premium.gif"
    },
    {
        "card_id": "CFM_715",
        "set": "GANGS",
        "name": "Jade Spirit",
        "collectible": true,
        "flavor_text": "\"He's so cute!  I just want to squeeze him, then use him for Jade Golem parts!\" - Aya Blackpaw",
        "play_sound": "files/CFM_715_JadeElemental_Play.ogg",
        "attack_sound": "files/CFM_715_JadeElemental_Attack.ogg",
        "image": "files/CFM_715.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_715_premium.gif"
    },
    {
        "card_id": "CFM_691",
        "set": "GANGS",
        "name": "Jade Swarmer",
        "collectible": true,
        "flavor_text": "He's so good at swarming, he can swarm all by himself!",
        "play_sound": "files/VO_CFM_691_Male_Mantid_Play_01.ogg",
        "attack_sound": "files/VO_CFM_691_Male_Mantid_Attack_01.ogg",
        "image": "files/CFM_691.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_691_premium.gif"
    },
    {
        "card_id": "GVG_094",
        "set": "GVG",
        "name": "Jeeves",
        "collectible": true,
        "flavor_text": "This robot is a lean, mean, butlerin' machine.",
        "play_sound": "files/VO_GVG_094_Play_01.ogg",
        "attack_sound": "files/VO_GVG_094_Attack_02.ogg",
        "image": "files/GVG_094.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_094_premium.gif"
    },
    {
        "card_id": "UNG_912",
        "set": "UNGORO",
        "name": "Jeweled Macaw",
        "collectible": true,
        "flavor_text": "It’s not LITERALLY jeweled. The goblins were terribly disappointed.",
        "play_sound": "files/JeweledMacaw_UNG_912_Play.ogg",
        "attack_sound": "files/JeweledMacaw_UNG_912_Attack.ogg",
        "image": "files/UNG_912.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_912_premium.gif"
    },
    {
        "card_id": "LOE_029",
        "set": "LOE",
        "name": "Jeweled Scarab",
        "collectible": true,
        "flavor_text": "It's amazing what you can do with super glue!",
        "play_sound": "files/LOE_029_JeweledScarab_Play.ogg",
        "attack_sound": "files/LOE_029_JeweledScarab_Attack.ogg",
        "image": "files/LOE_029.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_029_premium.gif"
    },
    {
        "card_id": "CFM_061",
        "set": "GANGS",
        "name": "Jinyu Waterspeaker",
        "collectible": true,
        "flavor_text": "Waterspeakers can tell the future! So the Jade Lotus employs them to speculate on the Auction House.",
        "play_sound": "files/VO_CFM_061_Male_Jinyu_Play_01.ogg",
        "attack_sound": "files/VO_CFM_061_Male_Jinyu_Attack_01.ogg",
        "image": "files/CFM_061.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_061_premium.gif"
    },
    {
        "card_id": "LOE_051",
        "set": "LOE",
        "name": "Jungle Moonkin",
        "collectible": true,
        "flavor_text": "The REAL angry chicken!",
        "play_sound": "files/LOE_051_JungleMoonkin_Play.ogg",
        "attack_sound": "files/LOE_051_JungleMoonkin_Attack.ogg",
        "image": "files/LOE_051.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_051_premium.gif"
    },
    {
        "card_id": "EX1_017",
        "set": "CLASSIC",
        "name": "Jungle Panther",
        "collectible": true,
        "flavor_text": "Stranglethorn is a beautiful place to visit, but you wouldn't want to live there.",
        "play_sound": "files/SFX_EX1_017_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_017_Attack.ogg",
        "image": "files/EX1_017.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_017_premium.gif"
    },
    {
        "card_id": "GVG_106",
        "set": "GVG",
        "name": "Junkbot",
        "collectible": true,
        "flavor_text": "One bot's junk is another bot's AWESOME UPGRADE!",
        "play_sound": "files/VO_GVG_106_Play_01.ogg",
        "attack_sound": "files/VO_GVG_106_Attack_02.ogg",
        "image": "files/GVG_106.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_106_premium.gif"
    },
    {
        "card_id": "AT_132",
        "set": "TGT",
        "name": "Justicar Trueheart",
        "collectible": true,
        "flavor_text": "It's like putting racing stripes and a giant spoiler on your hero power.",
        "play_sound": "files/VO_AT_132_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_132_ATTACK_02.ogg",
        "image": "files/AT_132.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_132_premium.gif"
    },
    {
        "card_id": "CFM_619",
        "set": "GANGS",
        "name": "Kabal Chemist",
        "collectible": true,
        "flavor_text": "Sure you could have that Polymorph potion, but wouldn't you rather have this mystery potion?  It could be anything.  Even a Polymorph potion!",
        "play_sound": "files/VO_CFM_619_Female_BloodElf_Play_02.ogg",
        "attack_sound": "files/VO_CFM_619_Female_BloodElf_Attack_01.ogg",
        "image": "files/CFM_619.gif",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_619_premium.gif"
    },
    {
        "card_id": "CFM_649",
        "set": "GANGS",
        "name": "Kabal Courier",
        "collectible": true,
        "flavor_text": "Hey, you park your kodo under a harpy nest, you get what you deserve.",
        "play_sound": "files/VO_CFM_649_Female_Harpy_Play_01.ogg",
        "attack_sound": "files/VO_CFM_649_Female_Harpy_Attack_01.ogg",
        "image": "files/CFM_649.gif",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_649_premium.gif"
    },
    {
        "card_id": "CFM_760",
        "set": "GANGS",
        "name": "Kabal Crystal Runner",
        "collectible": true,
        "flavor_text": "\"Listen, I can cut you in on a little of this premium mana, but you can't tell my boss.\"",
        "play_sound": "files/VO_CFM_760_Female_Dranei_Play_01.ogg",
        "attack_sound": "files/VO_CFM_760_Female_Dranei_Attack_01.ogg",
        "image": "files/CFM_760.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_760_premium.gif"
    },
    {
        "card_id": "CFM_066",
        "set": "GANGS",
        "name": "Kabal Lackey",
        "collectible": true,
        "flavor_text": "I'll tell you one thing he doesn't lack: GUMPTION.",
        "play_sound": "files/VO_CFM_066_Male_Goren_Play_01.ogg",
        "attack_sound": "files/VO_CFM_066_Male_Goren_Attack_01.ogg",
        "image": "files/CFM_066.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_066_premium.gif"
    },
    {
        "card_id": "CFM_657",
        "set": "GANGS",
        "name": "Kabal Songstealer",
        "collectible": true,
        "flavor_text": "Gadgetzan Writer’s Award goes to the player who writes the most compelling fanfic about why this Arakkoa has a golden frog in his hand!",
        "play_sound": "files/VO_CFM_657_Male_Arakkoa_Play_01.ogg",
        "attack_sound": "files/VO_CFM_657_Male_Arakkoa_Attack_01.ogg",
        "image": "files/CFM_657.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_657_premium.gif"
    },
    {
        "card_id": "CFM_626",
        "set": "GANGS",
        "name": "Kabal Talonpriest",
        "collectible": true,
        "flavor_text": "Inkmaster Solia had to figure out how to tattoo feathers.",
        "play_sound": "files/VO_CFM_626_Male_Arakkoa_Play_01.ogg",
        "attack_sound": "files/VO_CFM_626_Male_Arakkoa_Attack_01.ogg",
        "image": "files/CFM_626.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_626_premium.gif"
    },
    {
        "card_id": "CFM_663",
        "set": "GANGS",
        "name": "Kabal Trafficker",
        "collectible": true,
        "flavor_text": "She ships illicit mana crystals around the world in packages marked: FUNNEL CAKE.",
        "play_sound": "files/VO_CFM_663_Female_Undead_Play_01.ogg",
        "attack_sound": "files/VO_CFM_663_Female_Undead_Attack_01.ogg",
        "image": "files/CFM_663.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_663_premium.gif"
    },
    {
        "card_id": "UNG_211",
        "set": "UNGORO",
        "name": "Kalimos, Primal Lord",
        "collectible": true,
        "flavor_text": "All that's missing is a little heart.",
        "play_sound": "files/VO_UNG_211_Male_Elemental_Play_01.ogg",
        "attack_sound": "files/VO_UNG_211_Male_Elemental_Attack_01.ogg",
        "image": "files/UNG_211.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_211_premium.gif"
    },
    {
        "card_id": "CFM_621",
        "set": "GANGS",
        "name": "Kazakus",
        "collectible": true,
        "flavor_text": "The mysterious leader of the Kabal is NOT a dragon, and does NOT deal in illegal potions.  Any public statements to the contrary will be met with litigation and Dragonfire Potions.",
        "play_sound": "files/VO_CFM_621_Male_ShadowTroll_Play_01.ogg",
        "attack_sound": "files/VO_CFM_621_Male_ShadowTroll_Attack_01.ogg",
        "image": "files/CFM_621.gif",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_621_premium.gif"
    },
    {
        "card_id": "LOE_017",
        "set": "LOE",
        "name": "Keeper of Uldaman",
        "collectible": true,
        "flavor_text": "U da man!  No, U da man!",
        "play_sound": "files/VO_LOE_017_Play_01.ogg",
        "attack_sound": "files/VO_LOE_017_Attack_02.ogg",
        "image": "files/LOE_017.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_017_premium.gif"
    },
    {
        "card_id": "EX1_166",
        "set": "CLASSIC",
        "name": "Keeper of the Grove",
        "collectible": true,
        "flavor_text": "These guys just show up and start Keeping your Groves without even asking.",
        "play_sound": "files/VO_EX1_166_Play_01.ogg",
        "attack_sound": "files/VO_EX1_166_Attack_02.ogg",
        "image": "files/EX1_166.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_166_premium.gif"
    },
    {
        "card_id": "FP1_013",
        "set": "NAXX",
        "name": "Kel'Thuzad",
        "collectible": true,
        "flavor_text": "Kel'Thuzad could not resist the call of the Lich King. Even when it's just a robo-call extolling the Lich King's virtues.",
        "play_sound": "files/VO_FP1_013_Play_02.ogg",
        "attack_sound": "files/VO_FP1_013_Attack_03.ogg",
        "image": "files/FP1_013.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_013_premium.gif"
    },
    {
        "card_id": "GVG_074",
        "set": "GVG",
        "name": "Kezan Mystic",
        "collectible": true,
        "flavor_text": "They pretend to be wise and enlightened, but they mostly just hate to be left out of a secret.",
        "play_sound": "files/VO_GVG_074_Play_01.ogg",
        "attack_sound": "files/VO_GVG_074_Attack_02.ogg",
        "image": "files/GVG_074.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_074_premium.gif"
    },
    {
        "card_id": "NEW1_005",
        "set": "CLASSIC",
        "name": "Kidnapper",
        "collectible": true,
        "flavor_text": "He just wants people to see his vacation photos.",
        "play_sound": "files/VO_NEW1_005_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_005_Attack_02.ogg",
        "image": "files/NEW1_005.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_005_premium.gif"
    },
    {
        "card_id": "KARA_09_08",
        "set": "KARA",
        "name": "Kil'rek",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KARA_09_08_Male_Imp_Play_01.ogg",
        "attack_sound": "files/VO_KARA_09_08_Male_Imp_Attack_01.ogg",
        "image": "files/KARA_09_08.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KARA_09_08.png"
    },
    {
        "card_id": "KAR_005",
        "set": "KARA",
        "name": "Kindly Grandmother",
        "collectible": true,
        "flavor_text": "\"Goodness! What… abundant drool you have.\"",
        "play_sound": "files/VO_KAR_005a_Male_Worgen_Play_01.ogg",
        "attack_sound": "files/VO_KAR_005_Female_BigBadWolf_Attack_01.ogg",
        "image": "files/KAR_005.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_005_premium.gif"
    },
    {
        "card_id": "EX1_543",
        "set": "CLASSIC",
        "name": "King Krush",
        "collectible": true,
        "flavor_text": "The best defense against King Krush is to have someone you don’t like standing in front of you.",
        "play_sound": "files/SFX_EX1_543_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_543_Attack.ogg",
        "image": "files/EX1_543.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_543_premium.gif"
    },
    {
        "card_id": "UNG_933",
        "set": "UNGORO",
        "name": "King Mosh",
        "collectible": true,
        "flavor_text": "He's a terror at concerts.",
        "play_sound": "files/KingMosh_UNG_933_Play.ogg",
        "attack_sound": "files/KingMosh_UNG_933_Attack.ogg",
        "image": "files/UNG_933.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_933_premium.gif"
    },
    {
        "card_id": "EX1_014",
        "set": "CLASSIC",
        "name": "King Mukla",
        "collectible": true,
        "flavor_text": "King Mukla wanders Jaguero Isle, searching for love.",
        "play_sound": "files/VO_TUTORIAL_03_MUKLA_01_01.ogg",
        "attack_sound": "files/VO_TUTORIAL_03_MUKLA_02_02.ogg",
        "image": "files/EX1_014.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_014_premium.gif"
    },
    {
        "card_id": "GVG_046",
        "set": "GVG",
        "name": "King of Beasts",
        "collectible": true,
        "flavor_text": "He never sleeps.  Not even in the mighty jungle.",
        "play_sound": "files/SFX_GVG_046_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_046_Attack.ogg",
        "image": "files/GVG_046.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_046_premium.gif"
    },
    {
        "card_id": "AT_058",
        "set": "TGT",
        "name": "King's Elekk",
        "collectible": true,
        "flavor_text": "Elekk jousting is AWESOME.",
        "play_sound": "files/SFX_AT_058_Play.ogg",
        "attack_sound": "files/SFX_AT_058_Attack.ogg",
        "image": "files/AT_058.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_058_premium.gif"
    },
    {
        "card_id": "EX1_612",
        "set": "CLASSIC",
        "name": "Kirin Tor Mage",
        "collectible": true,
        "flavor_text": "The Kirin Tor reside in the floating city of Dalaran.  How do you make a Dalaran float?  Two scoops of ice cream, one scoop of Dalaran.",
        "play_sound": "files/VO_EX1_612_Play_01.ogg",
        "attack_sound": "files/VO_EX1_612_Attack_02.ogg",
        "image": "files/EX1_612.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_612_premium.gif"
    },
    {
        "card_id": "OG_188",
        "set": "OG",
        "name": "Klaxxi Amber-Weaver",
        "collectible": true,
        "flavor_text": "Amberweaving is a specialty course at the local trade school.",
        "play_sound": "files/VO_OG_188_Male_Klaxxi_Play_02.ogg",
        "attack_sound": "files/VO_OG_188_Male_Klaxxi_Attack_02.ogg",
        "image": "files/OG_188.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_188_premium.gif"
    },
    {
        "card_id": "KAR_A02_04",
        "set": "KARA",
        "name": "Knife",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KAR_A02_04_Male_Knife_Play_01.ogg",
        "attack_sound": "files/VO_KAR_A02_04_Male_Knife_Attack_01.ogg",
        "image": "files/KAR_A02_04.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KAR_A02_04.png"
    },
    {
        "card_id": "NEW1_019",
        "set": "CLASSIC",
        "name": "Knife Juggler",
        "collectible": true,
        "flavor_text": "Ambitious Knife Jugglers sometimes graduate to Bomb Jugglers.    They never last long enough to make it onto a card though.",
        "play_sound": "files/VO_NEW1_019_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_019_Attack_02.ogg",
        "image": "files/NEW1_019.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_019_premium.gif"
    },
    {
        "card_id": "AT_041",
        "set": "TGT",
        "name": "Knight of the Wild",
        "collectible": true,
        "flavor_text": "He gets a discount on the tournament entry fee because he is his own horse.",
        "play_sound": "files/VO_AT_041_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_041_ATTACK_02.ogg",
        "image": "files/AT_041.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_041_premium.gif"
    },
    {
        "card_id": "CS2_142",
        "set": "BASIC",
        "name": "Kobold Geomancer",
        "collectible": true,
        "flavor_text": "In the old days, Kobolds were the finest candle merchants in the land. Then they got pushed too far...",
        "play_sound": "files/VO_CS2_142_Play_01.ogg",
        "attack_sound": "files/VO_CS2_142_Attack_02.ogg",
        "image": "files/CS2_142.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_142_premium.gif"
    },
    {
        "card_id": "AT_099",
        "set": "TGT",
        "name": "Kodorider",
        "collectible": true,
        "flavor_text": "Someone called her a Rhinorider, and she's NOT HAPPY.",
        "play_sound": "files/VO_AT_099_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_099_ATTACK_04.ogg",
        "image": "files/AT_099.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_099_premium.gif"
    },
    {
        "card_id": "CFM_063",
        "set": "GANGS",
        "name": "Kooky Chemist",
        "collectible": true,
        "flavor_text": "#abs",
        "play_sound": "files/VO_CFM_063_Male_Undead_Play_01.ogg",
        "attack_sound": "files/VO_CFM_063_Male_Undead_Attack_01.ogg",
        "image": "files/CFM_063.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_063_premium.gif"
    },
    {
        "card_id": "NEW1_011",
        "set": "BASIC",
        "name": "Kor'kron Elite",
        "collectible": true,
        "flavor_text": "The Kor'kron are the elite forces of Garrosh Hellscream. Let's just say you don't want to run into these guys while wearing a blue tabard.",
        "play_sound": "files/VO_NEW1_011_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_011_Attack_02.ogg",
        "image": "files/NEW1_011.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_011_premium.gif"
    },
    {
        "card_id": "CFM_750",
        "set": "GANGS",
        "name": "Krul the Unshackled",
        "collectible": true,
        "flavor_text": "Spicklefizz pondered his life choices as he looked at the chain around his neck. \"Become a warlock,\" they said. \"You get to enslave demons,\" they said.",
        "play_sound": "files/VO_CFM_750_Male_VoidWalker_Play_01.ogg",
        "attack_sound": "files/VO_CFM_750_Male_VoidWalker_Attack_01.ogg",
        "image": "files/CFM_750.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_750_premium.gif"
    },
    {
        "card_id": "CFM_308",
        "set": "GANGS",
        "name": "Kun the Forgotten King",
        "collectible": true,
        "flavor_text": "Aya siphons a bit of Kun's soul to animate each golem in her Jade army. To his credit, he's being a great sport about it.",
        "play_sound": "files/VO_CFM_308_Male_Mogu_Play_01.ogg",
        "attack_sound": "files/VO_CFM_308_Male_Mogu_Attack_01.ogg",
        "image": "files/CFM_308.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_308_premium.gif"
    },
    {
        "card_id": "AT_119",
        "set": "TGT",
        "name": "Kvaldir Raider",
        "collectible": true,
        "flavor_text": "Coming soon... to a tuskarr village near you!",
        "play_sound": "files/VO_AT_119_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_119_ATTACK_03.ogg",
        "image": "files/AT_119.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_119_premium.gif"
    },
    {
        "card_id": "NAX9_02",
        "set": "NAXX",
        "name": "Lady Blaumeux",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_NAX9_02_Attack_02.ogg",
        "attack_sound": "files/VO_NAX9_02_Attack_02.ogg",
        "image": "files/NAX9_02.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX9_02.png"
    },
    {
        "card_id": "UNG_833",
        "set": "UNGORO",
        "name": "Lakkari Felhound",
        "collectible": true,
        "flavor_text": "Guaranteed to track tar all over your carpet.",
        "play_sound": "files/LakkariFelhound_UNG_833_Play.ogg",
        "attack_sound": "files/LakkariFelhound_UNG_833_Attack.ogg",
        "image": "files/UNG_833.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_833_premium.gif"
    },
    {
        "card_id": "AT_084",
        "set": "TGT",
        "name": "Lance Carrier",
        "collectible": true,
        "flavor_text": "Lance Carrier is an obscure entry level position in orcish armies.  A mystery, since orcs don't generally use lances.",
        "play_sound": "files/VO_AT_084_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_084_ATTACK_02.ogg",
        "image": "files/AT_084.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_084_premium.gif"
    },
    {
        "card_id": "DREAM_01",
        "set": "CLASSIC",
        "name": "Laughing Sister",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_DREAM_01_Play_01.ogg",
        "attack_sound": "files/VO_DREAM_01_Attack_02.ogg",
        "image": "files/DREAM_01.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/DREAM_01_premium.gif"
    },
    {
        "card_id": "CFM_810",
        "set": "GANGS",
        "name": "Leatherclad Hogleader",
        "collectible": true,
        "flavor_text": "The Hogchoppers, the terrors of Tanaris, can always be found at one tavern or another in Gadgetzan, refueling for totally real and legit adventures that they go on.",
        "play_sound": "files/VO_CFM_810_Female_Quilboar_Play_01.ogg",
        "attack_sound": "files/VO_CFM_810_Female_Quilboar_Attack_02.ogg",
        "image": "files/CFM_810.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_810_premium.gif"
    },
    {
        "card_id": "EX1_116",
        "set": "CLASSIC",
        "name": "Leeroy Jenkins",
        "collectible": true,
        "flavor_text": "At least he has Angry Chicken.",
        "play_sound": "files/VO_EX1_116_Play_01.ogg",
        "attack_sound": "files/VO_EX1_116_Attack_02.ogg",
        "image": "files/EX1_116.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_116_premium.gif"
    },
    {
        "card_id": "NEW1_033",
        "set": "BASIC",
        "name": "Leokk",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_NEW1_033_EnterPlay.ogg",
        "attack_sound": "files/SFX_NEW1_033_Attack.ogg",
        "image": "files/NEW1_033.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_033_premium.gif"
    },
    {
        "card_id": "EX1_029",
        "set": "CLASSIC",
        "name": "Leper Gnome",
        "collectible": true,
        "flavor_text": "He really just wants to be your friend, but the constant rejection is starting to really get to him.",
        "play_sound": "files/VO_EX1_029_Play_01.ogg",
        "attack_sound": "files/VO_EX1_029_Attack_02.ogg",
        "image": "files/EX1_029.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_029_premium.gif"
    },
    {
        "card_id": "AT_106",
        "set": "TGT",
        "name": "Light's Champion",
        "collectible": true,
        "flavor_text": "When there's something strange (say, a gibbering demon) in your neighborhood, who are you going to call?",
        "play_sound": "files/VO_AT_106_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_106_ATTACK_02.ogg",
        "image": "files/AT_106.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_106_premium.gif"
    },
    {
        "card_id": "UNG_962",
        "set": "UNGORO",
        "name": "Lightfused Stegodon",
        "collectible": true,
        "flavor_text": "“Come now, Johnston. I think those horns are quite fetching on you.”",
        "play_sound": "files/LightfusedStegadon_UNG_962_Play.ogg",
        "attack_sound": "files/LightfusedStegadon_UNG_962_Attack.ogg",
        "image": "files/UNG_962.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_962_premium.gif"
    },
    {
        "card_id": "EX1_335",
        "set": "CLASSIC",
        "name": "Lightspawn",
        "collectible": true,
        "flavor_text": "Spawn of the Light? Or Pawn of the Lights?",
        "play_sound": "files/EX1_335_Lightspawn_EnterPlay2.ogg",
        "attack_sound": "files/EX1_335_Lightspawn_Attack2.ogg",
        "image": "files/EX1_335.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_335_premium.gif"
    },
    {
        "card_id": "EX1_001",
        "set": "CLASSIC",
        "name": "Lightwarden",
        "collectible": true,
        "flavor_text": "She’s smaller than her sisters Mediumwarden and Heavywarden.",
        "play_sound": "files/VO_EX1_001_Play_01.ogg",
        "attack_sound": "files/VO_EX1_001_Attack_02.ogg",
        "image": "files/EX1_001.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_001_premium.gif"
    },
    {
        "card_id": "EX1_341",
        "set": "CLASSIC",
        "name": "Lightwell",
        "collectible": true,
        "flavor_text": "It isn't clear if people ignore the Lightwell, or if it is just invisible.",
        "play_sound": "files/EX1_341_Play_Lightwell.ogg",
        "attack_sound": "files/EX1_341_Attack_Lightwell - Copy.ogg",
        "image": "files/EX1_341.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_341_premium.gif"
    },
    {
        "card_id": "GVG_097",
        "set": "GVG",
        "name": "Lil' Exorcist",
        "collectible": true,
        "flavor_text": "Warlocks have the town exorcist on speed dial in case they unleash the wrong demon.",
        "play_sound": "files/VO_GVG_097_Play_01.ogg",
        "attack_sound": "files/VO_GVG_097_Attack_02.ogg",
        "image": "files/GVG_097.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_097_premium.gif"
    },
    {
        "card_id": "ICC_811",
        "set": "ICECROWN",
        "name": "Lilian Voss",
        "collectible": true,
        "flavor_text": "She doesn't feel pity, or remorse, or fear. And she absolutely will not stop... ever, until all necromancers are dead.",
        "play_sound": "files/VO_ICC_811_Female_Undead_Play_01.ogg",
        "attack_sound": "files/VO_ICC_811_Female_Undead_Attack_01.ogg",
        "image": "files/ICC_811.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_811_premium.gif"
    },
    {
        "card_id": "BRMA13_6",
        "set": "BRM",
        "name": "Living Lava",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BRMA13_6_LivingLava_EnterPlay_1.ogg",
        "attack_sound": "files/BRMA13_6_LivingLava_Attack_1.ogg",
        "image": "files/BRMA13_6.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA13_6.png"
    },
    {
        "card_id": "FP1_030",
        "set": "NAXX",
        "name": "Loatheb",
        "collectible": true,
        "flavor_text": "Loatheb used to be a simple Bog Beast.  This is why we need stricter regulations on mining and agriculture.",
        "play_sound": "files/VO_NAX6_01_START_Play_01.ogg",
        "attack_sound": "files/VO_NAX6_01_CARD_Attack_03.ogg",
        "image": "files/FP1_030.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_030_premium.gif"
    },
    {
        "card_id": "EX1_096",
        "set": "CLASSIC",
        "name": "Loot Hoarder",
        "collectible": true,
        "flavor_text": "Always roll need.",
        "play_sound": "files/VO_EX1_096_Play_01.ogg",
        "attack_sound": "files/VO_EX1_096_Attack_02.ogg",
        "image": "files/EX1_096.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_096_premium.gif"
    },
    {
        "card_id": "EX1_323",
        "set": "CLASSIC",
        "name": "Lord Jaraxxus",
        "collectible": true,
        "flavor_text": "\"TRIFLING GNOME! YOUR ARROGANCE WILL BE YOUR UNDOING!!!!\"",
        "play_sound": "files/VO_EX1_323_Play_01.ogg",
        "attack_sound": "files/VO_EX1_323_Attack_02.ogg",
        "image": "files/EX1_323.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_323_premium.gif"
    },
    {
        "card_id": "CS2_162",
        "set": "BASIC",
        "name": "Lord of the Arena",
        "collectible": true,
        "flavor_text": "He used to be a 2100+ rated arena player, but that was years ago and nobody can get him to shut up about it.",
        "play_sound": "files/VO_CS2_162_Play_01.ogg",
        "attack_sound": "files/VO_CS2_162_Attack_02.ogg",
        "image": "files/CS2_162.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_162_premium.gif"
    },
    {
        "card_id": "EX1_100",
        "set": "CLASSIC",
        "name": "Lorewalker Cho",
        "collectible": true,
        "flavor_text": "Lorewalker Cho archives and shares tales from the land of Pandaria, but his favorite story is the one where Joey and Phoebe go on a road trip.",
        "play_sound": "files/VO_Tutorial06_CHO_02_03.ogg",
        "attack_sound": "files/VO_Tutorial06_CHO_03_01.ogg",
        "image": "files/EX1_100.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_100_premium.gif"
    },
    {
        "card_id": "GVG_071",
        "set": "GVG",
        "name": "Lost Tallstrider",
        "collectible": true,
        "flavor_text": "The message, \"If found, please return to Mulgore,\" is tattooed on his rear.",
        "play_sound": "files/GVG_071_LostTallstrider_EnterPlay.ogg",
        "attack_sound": "files/GVG_071_LostTallstrider_Attack.ogg",
        "image": "files/GVG_071.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_071_premium.gif"
    },
    {
        "card_id": "CFM_852",
        "set": "GANGS",
        "name": "Lotus Agents",
        "collectible": true,
        "flavor_text": "Mostly, they stand around and look cool.",
        "play_sound": "files/VO_CFM_852_Female_Pandaren_Play_01.ogg",
        "attack_sound": "files/VO_CFM_852_Female_Pandaren_Attack_01.ogg",
        "image": "files/CFM_852.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_852_premium.gif"
    },
    {
        "card_id": "CFM_634",
        "set": "GANGS",
        "name": "Lotus Assassin",
        "collectible": true,
        "flavor_text": "For 5000g, you can just give the Jade Lotus any name and they will assassinate and/or embarrass them.",
        "play_sound": "files/VO_CFM_634_Male_Pandaren_Play_01.ogg",
        "attack_sound": "files/VO_CFM_634_Male_Pandaren_Attack_01.ogg",
        "image": "files/CFM_634.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_634_premium.gif"
    },
    {
        "card_id": "CFM_697",
        "set": "GANGS",
        "name": "Lotus Illusionist",
        "collectible": true,
        "flavor_text": "If you think her Illidan and Sylvanas cosplay is great, wait till you see her Reno Jackson!",
        "play_sound": "files/VO_CFM_697_Female_NightElf_Play_01.ogg",
        "attack_sound": "files/VO_CFM_697_Female_NightElf_Attack_01.ogg",
        "image": "files/CFM_697.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_697_premium.gif"
    },
    {
        "card_id": "AT_082",
        "set": "TGT",
        "name": "Lowly Squire",
        "collectible": true,
        "flavor_text": "But not the lowliest!",
        "play_sound": "files/VO_AT_082_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_082_ATTACK_02.ogg",
        "image": "files/AT_082.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_082_premium.gif"
    },
    {
        "card_id": "LOEA07_14",
        "set": "LOE",
        "name": "Lumbering Golem",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/LOEA07_14_LumberingGolem_Play.ogg",
        "attack_sound": "files/LOEA07_14_LumberingGolem_Attack.ogg",
        "image": "files/LOEA07_14.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA07_14.png"
    },
    {
        "card_id": "UNG_963",
        "set": "UNGORO",
        "name": "Lyra the Sunshard",
        "collectible": true,
        "flavor_text": "Arise, fair sun, and kill my envious foes. They don't have a legendary as beautiful as you.",
        "play_sound": "files/VO_UNG_963_Female_Elemental_Play_01.ogg",
        "attack_sound": "files/VO_UNG_963_Female_Elemental_Attack_02.ogg",
        "image": "files/UNG_963.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_963_premium.gif"
    },
    {
        "card_id": "EX1_082",
        "set": "CLASSIC",
        "name": "Mad Bomber",
        "collectible": true,
        "flavor_text": "He's not really all that crazy, he is just not as careful with explosives as he should be.",
        "play_sound": "files/VO_EX1_082_Play_01.ogg",
        "attack_sound": "files/VO_EX1_082_Attack_02.ogg",
        "image": "files/EX1_082.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_082_premium.gif"
    },
    {
        "card_id": "FP1_004",
        "set": "NAXX",
        "name": "Mad Scientist",
        "collectible": true,
        "flavor_text": "His mother wanted him to be a mage or a warlock, but noooooooo, he had to go and be a scientist like his father.",
        "play_sound": "files/VO_FP1_004_EnterPlay_01.ogg",
        "attack_sound": "files/VO_FP1_004_Attack_02.ogg",
        "image": "files/FP1_004.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_004_premium.gif"
    },
    {
        "card_id": "CFM_672",
        "set": "GANGS",
        "name": "Madam Goya",
        "collectible": true,
        "flavor_text": "She has set up her Black Market here in Gadgetzan for one purpose, to make a KILLING when Beanie Babies make their inevitable comeback.",
        "play_sound": "files/VO_CFM_672_Female_Pandaren_Play_01.ogg",
        "attack_sound": "files/VO_CFM_672_Female_Pandaren_Attack_01.ogg",
        "image": "files/CFM_672.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_672_premium.gif"
    },
    {
        "card_id": "GVG_090",
        "set": "GVG",
        "name": "Madder Bomber",
        "collectible": true,
        "flavor_text": "Dang, Bomber, calm down.",
        "play_sound": "files/VO_GVG_090_Play_01.ogg",
        "attack_sound": "files/VO_GVG_090_Attack_02.ogg",
        "image": "files/GVG_090.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_090_premium.gif"
    },
    {
        "card_id": "FP1_010",
        "set": "NAXX",
        "name": "Maexxna",
        "collectible": true,
        "flavor_text": "Maexxna gets super mad when people introduce her as \"Maxina\" or \"Maxxy\".",
        "play_sound": "files/SFX_FP1_010_EnterPlay.ogg",
        "attack_sound": "files/SFX_FP1_010_Attack.ogg",
        "image": "files/FP1_010.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_010_premium.gif"
    },
    {
        "card_id": "CS2_118",
        "set": "BASIC",
        "name": "Magma Rager",
        "collectible": true,
        "flavor_text": "He likes to think he is powerful, but pretty much anyone can solo Molten Core now.",
        "play_sound": "files/SFX_CS2_118_EnterPlay.ogg",
        "attack_sound": "files/SFX_CS2_118_Attack.ogg",
        "image": "files/CS2_118.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_118_premium.gif"
    },
    {
        "card_id": "BRMA14_9",
        "set": "BRM",
        "name": "Magmatron",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_BRMA14_9_Play_01.ogg",
        "attack_sound": "files/VO_BRMA14_9_Attack_02.ogg",
        "image": "files/BRMA14_9.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA14_9.png"
    },
    {
        "card_id": "BRMA14_12",
        "set": "BRM",
        "name": "Magmaw",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_BRMA14_12_Play.ogg",
        "attack_sound": "files/SFX_BRMA14_12_Attack.ogg",
        "image": "files/BRMA14_12.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA14_12.png"
    },
    {
        "card_id": "AT_067",
        "set": "TGT",
        "name": "Magnataur Alpha",
        "collectible": true,
        "flavor_text": "Playing him also gets you into the Magnataur Beta.",
        "play_sound": "files/AT_067_MagnataurAlpha_Play.ogg",
        "attack_sound": "files/AT_067_MagnataurAlpha_Attack.ogg",
        "image": "files/AT_067.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_067_premium.gif"
    },
    {
        "card_id": "AT_085",
        "set": "TGT",
        "name": "Maiden of the Lake",
        "collectible": true,
        "flavor_text": "Not a good basis for a system of government.",
        "play_sound": "files/VO_AT_085_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_085_ATTACK_02.ogg",
        "image": "files/AT_085.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_085_premium.gif"
    },
    {
        "card_id": "GVG_021",
        "set": "GVG",
        "name": "Mal'Ganis",
        "collectible": true,
        "flavor_text": "Mal'Ganis doesn't like being betrayed, so if you discard him, watch out.",
        "play_sound": "files/VO_GVG_021_Play_01.ogg",
        "attack_sound": "files/VO_GVG_021_Attack_02.ogg",
        "image": "files/GVG_021.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_021_premium.gif"
    },
    {
        "card_id": "KAR_089",
        "set": "KARA",
        "name": "Malchezaar's Imp",
        "collectible": true,
        "flavor_text": "Malchezaar used to have an imp named Dobby working for him, but there was a tragic accident.",
        "play_sound": "files/VO_KAR_089_Male_Imp_Play_04.ogg",
        "attack_sound": "files/VO_KAR_089_Male_Imp_Attack_02.ogg",
        "image": "files/KAR_089.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_089_premium.gif"
    },
    {
        "card_id": "OG_220",
        "set": "OG",
        "name": "Malkorok",
        "collectible": true,
        "flavor_text": "Garrosh's best buddy. It's true. Look it up.",
        "play_sound": "files/VO_OG_220_Male_Orc_Play_01.ogg",
        "attack_sound": "files/VO_OG_220_Male_Orc_Attack_01.ogg",
        "image": "files/OG_220.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_220_premium.gif"
    },
    {
        "card_id": "GVG_035",
        "set": "GVG",
        "name": "Malorne",
        "collectible": true,
        "flavor_text": "When Malorne isn't mauling hordes of demons, he enjoys attending parties, though he prefers to go stag.",
        "play_sound": "files/VO_GVG_035_Play_01.ogg",
        "attack_sound": "files/VO_GVG_035_Attack_02.ogg",
        "image": "files/GVG_035.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_035_premium.gif"
    },
    {
        "card_id": "EX1_563",
        "set": "CLASSIC",
        "name": "Malygos",
        "collectible": true,
        "flavor_text": "Malygos hates it when mortals use magic.  He gets so mad!",
        "play_sound": "files/VO_EX1_563_Play_01.ogg",
        "attack_sound": "files/VO_EX1_563_Attack_02.ogg",
        "image": "files/EX1_563.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_563_premium.gif"
    },
    {
        "card_id": "EX1_055",
        "set": "CLASSIC",
        "name": "Mana Addict",
        "collectible": true,
        "flavor_text": "She’s trying to kick the habit, but still takes some mana whenever she has a stressful day.",
        "play_sound": "files/VO_EX1_055_Play_01.ogg",
        "attack_sound": "files/VO_EX1_055_Attack_02.ogg",
        "image": "files/EX1_055.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_055_premium.gif"
    },
    {
        "card_id": "CFM_606",
        "set": "GANGS",
        "name": "Mana Geode",
        "collectible": true,
        "flavor_text": "Gadgetzan, where even the pet rocks have pet rocks.",
        "play_sound": "files/ManaGeode_CFM_606_Play.ogg",
        "attack_sound": "files/ManaGeode_CFM_606_Attack.ogg",
        "image": "files/CFM_606.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_606_premium.gif"
    },
    {
        "card_id": "EX1_575",
        "set": "CLASSIC",
        "name": "Mana Tide Totem",
        "collectible": true,
        "flavor_text": "It is said that some shaman can say \"Floatin' totem\" 10 times, fast.",
        "play_sound": "files/EX1_575_mana_tide_totem_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_575_Attack_00.ogg",
        "image": "files/EX1_575.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_575_premium.gif"
    },
    {
        "card_id": "UNG_111t1",
        "set": "UNGORO",
        "name": "Mana Treant",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/ManaTreant_UNG_111t1_Play.ogg",
        "attack_sound": "files/ManaTreant_UNG_111t1_Attack.ogg",
        "image": "files/UNG_111t1.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_111t1_premium.gif"
    },
    {
        "card_id": "EX1_616",
        "set": "CLASSIC",
        "name": "Mana Wraith",
        "collectible": true,
        "flavor_text": "They come out at night to eat leftover mana crystals. \"Mmmmmm,\" they say.",
        "play_sound": "files/EX1_616_Mana_Wraith_EnterPlay1.ogg",
        "attack_sound": "files/EX1_616_Mana_Wraith_Attack2.ogg",
        "image": "files/EX1_616.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_616_premium.gif"
    },
    {
        "card_id": "NEW1_012",
        "set": "CLASSIC",
        "name": "Mana Wyrm",
        "collectible": true,
        "flavor_text": "These wyrms feed on arcane energies, and while they are generally considered a nuisance rather than a real threat, you really shouldn't leave them alone with a bucket of mana.",
        "play_sound": "files/NEW1_012_Mana_Wyrm_EnterPlay1.ogg",
        "attack_sound": "files/NEW1_012_Mana_Wyrm_Attack2.ogg",
        "image": "files/NEW1_012.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_012_premium.gif"
    },
    {
        "card_id": "CFM_660",
        "set": "GANGS",
        "name": "Manic Soulcaster",
        "collectible": true,
        "flavor_text": "When casting a tournament, you really have to put your soul into it!",
        "play_sound": "files/VO_CFM_660_Female_BloodElf_Play_01.ogg",
        "attack_sound": "files/VO_CFM_660_Female_BloodElf_Attack_01.ogg",
        "image": "files/CFM_660.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_660_premium.gif"
    },
    {
        "card_id": "TU4a_005",
        "set": "MISSIONS",
        "name": "Massive Gnoll",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/GnollPissed2.ogg",
        "attack_sound": "files/GnollPissed2.ogg",
        "image": "files/TU4a_005.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/TU4a_005.png"
    },
    {
        "card_id": "AT_112",
        "set": "TGT",
        "name": "Master Jouster",
        "collectible": true,
        "flavor_text": "Needs just a few more ratings points to become Grandmaster Jouster.",
        "play_sound": "files/VO_AT_112_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_112_ATTACK_03.ogg",
        "image": "files/AT_112.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_112_premium.gif"
    },
    {
        "card_id": "NEW1_037",
        "set": "CLASSIC",
        "name": "Master Swordsmith",
        "collectible": true,
        "flavor_text": "He's currently trying to craft a \"flail-axe\", but all the other swordsmiths say it can't be done.",
        "play_sound": "files/VO_NEW1_037_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_037_Attack_02.ogg",
        "image": "files/NEW1_037.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_037_premium.gif"
    },
    {
        "card_id": "AT_117",
        "set": "TGT",
        "name": "Master of Ceremonies",
        "collectible": true,
        "flavor_text": "Goes by \"MC ElfyElf\".",
        "play_sound": "files/VO_AT_117_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_117_ATTACK_02.ogg",
        "image": "files/AT_117.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_117_premium.gif"
    },
    {
        "card_id": "NEW1_014",
        "set": "CLASSIC",
        "name": "Master of Disguise",
        "collectible": true,
        "flavor_text": "She's actually a male tauren.  People don't call him \"Master of Disguise\" for nothing.",
        "play_sound": "files/VO_NEW1_014_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_014_Attack_02.ogg",
        "image": "files/NEW1_014.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_014_premium.gif"
    },
    {
        "card_id": "OG_328",
        "set": "OG",
        "name": "Master of Evolution",
        "collectible": true,
        "flavor_text": "Will be really useful in the new \"Hearthémon\" game.",
        "play_sound": "files/OG_328_MasterOfEvolution_Play.ogg",
        "attack_sound": "files/OG_328_MasterOfEvolution_Attack.ogg",
        "image": "files/OG_328.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_328_premium.gif"
    },
    {
        "card_id": "OG_061t",
        "set": "OG",
        "name": "Mastiff",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/OG_061t_Mastiff_Play.ogg",
        "attack_sound": "files/OG_061t_Mastiff_Attack.ogg",
        "image": "files/OG_061t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_061t_premium.gif"
    },
    {
        "card_id": "CFM_670",
        "set": "GANGS",
        "name": "Mayor Noggenfogger",
        "collectible": true,
        "flavor_text": "This flavor text was randomly generated.  If it happens to form words and make sense, that is purely by chance.",
        "play_sound": "files/VO_CFM_670_Male_Goblin_Play_01.ogg",
        "attack_sound": "files/VO_CFM_670_Male_Goblin_Attack_01.ogg",
        "image": "files/CFM_670.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_670_premium.gif"
    },
    {
        "card_id": "CFM_759",
        "set": "GANGS",
        "name": "Meanstreet Marshal",
        "collectible": true,
        "flavor_text": "Remember, submit your bribes directly to the Marshal - it's the law!",
        "play_sound": "files/VO_CFM_759_Male_Tuskarr_Play_01.ogg",
        "attack_sound": "files/VO_CFM_759_Male_Tuskarr_Attack_01.ogg",
        "image": "files/CFM_759.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_759_premium.gif"
    },
    {
        "card_id": "ICC_812",
        "set": "ICECROWN",
        "name": "Meat Wagon",
        "collectible": true,
        "flavor_text": "Necromancers call it \"Meals on Wheels.\"",
        "play_sound": "files/MeatWagon_ICC_812_Play.ogg",
        "attack_sound": "files/MeatWagon_ICC_812_Attack.ogg",
        "image": "files/ICC_812.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_812_premium.gif"
    },
    {
        "card_id": "GVG_034",
        "set": "GVG",
        "name": "Mech-Bear-Cat",
        "collectible": true,
        "flavor_text": "Crushes buildings with his BEAR hands.",
        "play_sound": "files/SFX_GVG_034_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_034_Attack.ogg",
        "image": "files/GVG_034.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_034_premium.gif"
    },
    {
        "card_id": "EX1_025t",
        "set": "BASIC",
        "name": "Mechanical Dragonling",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_EX1_025t_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_025t_Attack.ogg",
        "image": "files/EX1_025t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_025t_premium.gif"
    },
    {
        "card_id": "LOEA07_25",
        "set": "LOE",
        "name": "Mechanical Parrot",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_LOEA07_25_Play.ogg",
        "attack_sound": "files/SFX_LOEA07_25_Attack.ogg",
        "image": "files/LOEA07_25.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA07_25.png"
    },
    {
        "card_id": "GVG_078",
        "set": "GVG",
        "name": "Mechanical Yeti",
        "collectible": true,
        "flavor_text": "The yetis of Chillwind Point are a source of both inspiration and savage beatings.",
        "play_sound": "files/SFX_GVG_078_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_078_Attack.ogg",
        "image": "files/GVG_078.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_078_premium.gif"
    },
    {
        "card_id": "GVG_006",
        "set": "GVG",
        "name": "Mechwarper",
        "collectible": true,
        "flavor_text": "Mechs that summon mechs? What's next? Donuts that summon donuts? Mmmmm.",
        "play_sound": "files/VO_GVG_006_Play_01.ogg",
        "attack_sound": "files/VO_GVG_006_Attack_02.ogg",
        "image": "files/GVG_006.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_006_premium.gif"
    },
    {
        "card_id": "KAR_092",
        "set": "KARA",
        "name": "Medivh's Valet",
        "collectible": true,
        "flavor_text": "\"Magus Medivh sir, I've brought the flaming balloons, as you requested.\"",
        "play_sound": "files/VO_KAR_092_Male_Human_Play_07.ogg",
        "attack_sound": "files/VO_KAR_092_Male_Human_Attack_01.ogg",
        "image": "files/KAR_092.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_092_premium.gif"
    },
    {
        "card_id": "KAR_097",
        "set": "KARA",
        "name": "Medivh, the Guardian",
        "collectible": true,
        "flavor_text": "If you think the party's great now, just wait 'til he invites the orcs over!",
        "play_sound": "files/VO_KAR_097_Male_Human_Play_01.ogg",
        "attack_sound": "files/VO_KAR_097_Male_Human_Attack_01.ogg",
        "image": "files/KAR_097.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_097_premium.gif"
    },
    {
        "card_id": "UNG_942t",
        "set": "UNGORO",
        "name": "Megafin",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_UNG_942t_Male_Murloc_Play_05.ogg",
        "attack_sound": "files/VO_UNG_942t_Male_Murloc_Attack_01.ogg",
        "image": "files/UNG_942t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_942t_premium.gif"
    },
    {
        "card_id": "GVG_116",
        "set": "GVG",
        "name": "Mekgineer Thermaplugg",
        "collectible": true,
        "flavor_text": "He was obsessed with explosives until he discovered knitting. Now he yells, “SWEATERS! MORE SWEATERS!”",
        "play_sound": "files/VO_GVG_116_Play_01.ogg",
        "attack_sound": "files/VO_GVG_116_Attack_02.ogg",
        "image": "files/GVG_116.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_116_premium.gif"
    },
    {
        "card_id": "KAR_702",
        "set": "KARA",
        "name": "Menagerie Magician",
        "collectible": true,
        "flavor_text": "Just between us, if things get tight the Menagerie Magician position will probably be the first to go.",
        "play_sound": "files/VO_KAR_702_Male_Goblin_Play_01.ogg",
        "attack_sound": "files/VO_KAR_702_Male_Goblin_Attack_01.ogg",
        "image": "files/KAR_702.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_702_premium.gif"
    },
    {
        "card_id": "KAR_065",
        "set": "KARA",
        "name": "Menagerie Warden",
        "collectible": true,
        "flavor_text": "Please? Can I keep him? I promise to clean his cage \u003ci\u003eevery day\u003c/i\u003e.",
        "play_sound": "files/VO_KAR_065_Female_NightElf_Play_01.ogg",
        "attack_sound": "files/VO_KAR_065_Female_NightElf_Attack_01.ogg",
        "image": "files/KAR_065.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_065_premium.gif"
    },
    {
        "card_id": "GVG_048",
        "set": "GVG",
        "name": "Metaltooth Leaper",
        "collectible": true,
        "flavor_text": "Don't leave them out in the rain. In Un'Goro Crater there is a whole colony of rust-tooth leapers.",
        "play_sound": "files/SFX_GVG_048_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_048_Attack.ogg",
        "image": "files/GVG_048.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_048_premium.gif"
    },
    {
        "card_id": "GVG_103",
        "set": "GVG",
        "name": "Micro Machine",
        "collectible": true,
        "flavor_text": "This card is the real thing.",
        "play_sound": "files/VO_GVG_103_Play_01.ogg",
        "attack_sound": "files/VO_GVG_103_Attack_02.ogg",
        "image": "files/GVG_103.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_103_premium.gif"
    },
    {
        "card_id": "OG_320",
        "set": "OG",
        "name": "Midnight Drake",
        "collectible": true,
        "flavor_text": "Still fearsome in the daytime.",
        "play_sound": "files/OG_320_MidnightDrake_Play.ogg",
        "attack_sound": "files/OG_320_MidnightDrake_Attack.ogg",
        "image": "files/OG_320.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_320_premium.gif"
    },
    {
        "card_id": "NEW1_029",
        "set": "CLASSIC",
        "name": "Millhouse Manastorm",
        "collectible": true,
        "flavor_text": "\"I'm gonna light you up, sweetcheeks!\"",
        "play_sound": "files/VO_NEW1_029_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_029_Attack_02.ogg",
        "image": "files/NEW1_029.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_029_premium.gif"
    },
    {
        "card_id": "GVG_111",
        "set": "GVG",
        "name": "Mimiron's Head",
        "collectible": true,
        "flavor_text": "Do not push the big red button!",
        "play_sound": "files/VO_GVG_111_Play_01.ogg",
        "attack_sound": "files/VO_GVG_111_Attack_02.ogg",
        "image": "files/GVG_111.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_111_premium.gif"
    },
    {
        "card_id": "EX1_085",
        "set": "CLASSIC",
        "name": "Mind Control Tech",
        "collectible": true,
        "flavor_text": "Mind Control technology is getting better, but that's not saying much.",
        "play_sound": "files/VO_EX1_085_Play_01.ogg",
        "attack_sound": "files/VO_EX1_085_Attack_02.ogg",
        "image": "files/EX1_085.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_085_premium.gif"
    },
    {
        "card_id": "ICC_902",
        "set": "ICECROWN",
        "name": "Mindbreaker",
        "collectible": true,
        "flavor_text": "He's a mind breaker, dream taker, ghoul trainer, don't you mess around with him.",
        "play_sound": "files/VO_ICC_902_Male_Undead_Play_01.ogg",
        "attack_sound": "files/VO_ICC_902_Male_Undead_Attack_02.ogg",
        "image": "files/ICC_902.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_902_premium.gif"
    },
    {
        "card_id": "GVG_109",
        "set": "GVG",
        "name": "Mini-Mage",
        "collectible": true,
        "flavor_text": "He is sometimes found hiding in the treasure chest in the Gurubashi Arena.",
        "play_sound": "files/VO_GVG_109_Play_01.ogg",
        "attack_sound": "files/VO_GVG_109_Attack_02.ogg",
        "image": "files/GVG_109.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_109_premium.gif"
    },
    {
        "card_id": "UNG_022",
        "set": "UNGORO",
        "name": "Mirage Caller",
        "collectible": true,
        "flavor_text": "Mirage is actually the name of its long-lost cat.",
        "play_sound": "files/VO_UNG_022_Male_Tolvir_Play_01.ogg",
        "attack_sound": "files/VO_UNG_022_Male_Tolvir_Attack_02.ogg",
        "image": "files/UNG_022.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_022_premium.gif"
    },
    {
        "card_id": "OG_202",
        "set": "OG",
        "name": "Mire Keeper",
        "collectible": true,
        "flavor_text": "\"Hey.... Is that Mire for sale?\" \n\"No.  I'm keeping it.\"",
        "play_sound": "files/VO_OG_202_Male_Keeper_Play_01.ogg",
        "attack_sound": "files/VO_OG_202_Male_Keeper_Attack_01.ogg",
        "image": "files/OG_202.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_202_premium.gif"
    },
    {
        "card_id": "CS2_mirror",
        "set": "BASIC",
        "name": "Mirror Image",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/CS2_mirror_EnterPlay.ogg",
        "attack_sound": "files/CS2_mirror_Attack.ogg",
        "image": "files/CS2_mirror.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_mirror_premium.gif"
    },
    {
        "card_id": "NEW1_032",
        "set": "BASIC",
        "name": "Misha",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_NEW1_032_EnterPlay.ogg",
        "attack_sound": "files/SFX_NEW1_032_Attack.ogg",
        "image": "files/NEW1_032.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_032_premium.gif"
    },
    {
        "card_id": "CFM_120",
        "set": "GANGS",
        "name": "Mistress of Mixtures",
        "collectible": true,
        "flavor_text": "Her favorite mixture is cola and lime.",
        "play_sound": "files/VO_CFM_120_Female_Undead_Play_01.ogg",
        "attack_sound": "files/VO_CFM_120_Female_Undead_Attack_01.ogg",
        "image": "files/CFM_120.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_120_premium.gif"
    },
    {
        "card_id": "GVG_018",
        "set": "GVG",
        "name": "Mistress of Pain",
        "collectible": true,
        "flavor_text": "Her sister is the Mistress of Pane who sells windows and shower doors.",
        "play_sound": "files/VO_GVG_018_Play_01.ogg",
        "attack_sound": "files/VO_GVG_018_Attack_02_Alt.ogg",
        "image": "files/GVG_018.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_018_premium.gif"
    },
    {
        "card_id": "KAR_041",
        "set": "KARA",
        "name": "Moat Lurker",
        "collectible": true,
        "flavor_text": "He really enjoys lurking and gets a lot of job satisfaction out of it.",
        "play_sound": "files/MoatLurker_KAR_041_Play.ogg",
        "attack_sound": "files/MoatLurker_KAR_041_Attack.ogg",
        "image": "files/KAR_041.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_041_premium.gif"
    },
    {
        "card_id": "GVG_112",
        "set": "GVG",
        "name": "Mogor the Ogre",
        "collectible": true,
        "flavor_text": "Mogor helped reopen the Dark Portal once. You know you're in trouble when you have to rely on an ogre.",
        "play_sound": "files/VO_GVG_112_Play_01.ogg",
        "attack_sound": "files/VO_GVG_112_Attack_02.ogg",
        "image": "files/GVG_112.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_112_premium.gif"
    },
    {
        "card_id": "AT_088",
        "set": "TGT",
        "name": "Mogor's Champion",
        "collectible": true,
        "flavor_text": "This champion has learned from the best.  Except for his target selection.",
        "play_sound": "files/VO_AT_088_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_088_ATTACK_03.ogg",
        "image": "files/AT_088.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_088_premium.gif"
    },
    {
        "card_id": "EX1_396",
        "set": "CLASSIC",
        "name": "Mogu'shan Warden",
        "collectible": true,
        "flavor_text": "All these guys ever do is talk about the Thunder King.   BOOOORRRINNG!",
        "play_sound": "files/VO_EX1_396_Play_01.ogg",
        "attack_sound": "files/VO_EX1_396_Attack_02.ogg",
        "image": "files/EX1_396.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_396_premium.gif"
    },
    {
        "card_id": "BRMC_87",
        "set": "TB",
        "name": "Moira Bronzebeard",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BRMC_87_Moira_Play.ogg",
        "attack_sound": "files/BRMC_87_Moira_Attack.ogg",
        "image": "files/BRMC_87.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMC_87.png"
    },
    {
        "card_id": "BRMA03_3",
        "set": "BRM",
        "name": "Moira Bronzebeard2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_BRMA03_3_Attack_01.ogg",
        "attack_sound": "files/VO_BRMA03_3_Attack_01.ogg",
        "image": "files/BRMA03_3.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA03_3.png"
    },
    {
        "card_id": "EX1_620",
        "set": "CLASSIC",
        "name": "Molten Giant",
        "collectible": true,
        "flavor_text": "He gets terrible heartburn.  BECAUSE HE IS FULL OF LAVA.",
        "play_sound": "files/EX1_620_Molten_Giant_EnterPlay2.ogg",
        "attack_sound": "files/EX1_620_Molten_Giant_Attack1.ogg",
        "image": "files/EX1_620.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_620_premium.gif"
    },
    {
        "card_id": "ICC_289",
        "set": "ICECROWN",
        "name": "Moorabi",
        "collectible": true,
        "flavor_text": "Most disturbing is how Moorabi covers all those frozen minions with flavored syrup.",
        "play_sound": "files/VO_ICC_289_Male_Troll_Play_02.ogg",
        "attack_sound": "files/VO_ICC_289_Male_Troll_Attack_01.ogg",
        "image": "files/ICC_289.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_289_premium.gif"
    },
    {
        "card_id": "KAR_044",
        "set": "KARA",
        "name": "Moroes",
        "collectible": true,
        "flavor_text": "Moroes runs an army of stewards, but still ends up inflating the balloons himself.",
        "play_sound": "files/VO_KAR_044_Male_Human_Play_01.ogg",
        "attack_sound": "files/VO_KAR_044_Male_Human_Attack_01.ogg",
        "image": "files/KAR_044.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_044_premium.gif"
    },
    {
        "card_id": "EX1_105",
        "set": "CLASSIC",
        "name": "Mountain Giant",
        "collectible": true,
        "flavor_text": "His mother said that he was just big boned.",
        "play_sound": "files/EX1_105_Mountain_Giant_EnterPlay3.ogg",
        "attack_sound": "files/EX1_105_Mountain_Giant_Attack1.ogg",
        "image": "files/EX1_105.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_105_premium.gif"
    },
    {
        "card_id": "ICC_062",
        "set": "ICECROWN",
        "name": "Mountainfire Armor",
        "collectible": true,
        "flavor_text": "Excuse me. Your mountain is on fire.",
        "play_sound": "files/VO_ICC_062_Male_Spirit_Play_02.ogg",
        "attack_sound": "files/VO_ICC_062_Male_Spirit_Attack_01.ogg",
        "image": "files/ICC_062.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_062_premium.gif"
    },
    {
        "card_id": "LOE_050",
        "set": "LOE",
        "name": "Mounted Raptor",
        "collectible": true,
        "flavor_text": "Clever girl!",
        "play_sound": "files/SFX_LOE_050_Play.ogg",
        "attack_sound": "files/SFX_LOE_050_Attack.ogg",
        "image": "files/LOE_050.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_050_premium.gif"
    },
    {
        "card_id": "NAX15_05",
        "set": "NAXX",
        "name": "Mr. Bigglesworth",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/NAX15_05 MrBigglesworth_Play.ogg",
        "attack_sound": "files/NAX15_05 MrBigglesworth_Attack.ogg",
        "image": "files/NAX15_05.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NAX15_05_premium.gif"
    },
    {
        "card_id": "TU4c_007",
        "set": "MISSIONS",
        "name": "Mukla's Big Brother",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_TUTORIAL_03_BRO_01_01.ogg",
        "attack_sound": "files/VO_TUTORIAL_03_BRO_01_01.ogg",
        "image": "files/TU4c_007.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/TU4c_007.png"
    },
    {
        "card_id": "AT_090",
        "set": "TGT",
        "name": "Mukla's Champion",
        "collectible": true,
        "flavor_text": "An elegant gorilla, for a more civilized age.",
        "play_sound": "files/VO_AT_090_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_090_ATTACK_02.ogg",
        "image": "files/AT_090.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_090_premium.gif"
    },
    {
        "card_id": "OG_122",
        "set": "OG",
        "name": "Mukla, Tyrant of the Vale",
        "collectible": true,
        "flavor_text": "Pro tip: DO NOT BOGART THE BANANAS.",
        "play_sound": "files/OG_122_Mukla_TotV_Play.ogg",
        "attack_sound": "files/OG_122_Mukla_TotV_Attack.ogg",
        "image": "files/OG_122.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_122_premium.gif"
    },
    {
        "card_id": "LOEA16_5t",
        "set": "LOE",
        "name": "Mummy Zombie",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/LOEA16_5t_MummyZombie_Play_1.ogg",
        "attack_sound": "files/LOEA16_5t_MummyZombie_Attack_1.ogg",
        "image": "files/LOEA16_5t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOEA16_5t_premium.gif"
    },
    {
        "card_id": "AT_076",
        "set": "TGT",
        "name": "Murloc Knight",
        "collectible": true,
        "flavor_text": "Hee hee!  Look at his cute little feet.",
        "play_sound": "files/AT_076_MurlocKnight_Play.ogg",
        "attack_sound": "files/AT_076_MurlocKnight_Attack.ogg",
        "image": "files/AT_076.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_076_premium.gif"
    },
    {
        "card_id": "CS2_168",
        "set": "BASIC",
        "name": "Murloc Raider",
        "collectible": true,
        "flavor_text": "Mrrraggglhlhghghlgh, mrgaaag blarrghlgaahahl mrgggg glhalhah a bghhll graggmgmg Garrosh mglhlhlh mrghlhlhl!!",
        "play_sound": "files/CS2_168_Murloc_Raider_EnterPlay1.ogg",
        "attack_sound": "files/CS2_168_Murloc_Raider_Attack1.ogg",
        "image": "files/CS2_168.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_168_premium.gif"
    },
    {
        "card_id": "CFM_310t",
        "set": "GANGS",
        "name": "Murloc Razorgill",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_CFM_310t_Male_Murloc_Play.ogg",
        "attack_sound": "files/VO_CFM_310t_Male_Murloc_Attack.ogg",
        "image": "files/CFM_310t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_310t_premium.gif"
    },
    {
        "card_id": "EX1_506a",
        "set": "BASIC",
        "name": "Murloc Scout",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/EX1_506a_Murloc_Tidehunter_EnterPlay1.ogg",
        "attack_sound": "files/EX1_506a_Murloc_Tidehunter_Attack1.ogg",
        "image": "files/EX1_506a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_506a_premium.gif"
    },
    {
        "card_id": "EX1_509",
        "set": "CLASSIC",
        "name": "Murloc Tidecaller",
        "collectible": true,
        "flavor_text": "This guy gets crazy strong at family reunions.",
        "play_sound": "files/EX1_509_Murloc_Tidecaller_EnterPlay1.ogg",
        "attack_sound": "files/EX1_509_Murloc_Tidecaller_Attack1.ogg",
        "image": "files/EX1_509.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_509_premium.gif"
    },
    {
        "card_id": "EX1_506",
        "set": "BASIC",
        "name": "Murloc Tidehunter",
        "collectible": true,
        "flavor_text": "\"Death will rise, from the tides!\"",
        "play_sound": "files/EX1_506_Murloc_Scout_EnterPlay1.ogg",
        "attack_sound": "files/EX1_506_Murloc_Scout_Attack2.ogg",
        "image": "files/EX1_506.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_506_premium.gif"
    },
    {
        "card_id": "LOEA10_3",
        "set": "LOE",
        "name": "Murloc Tinyfin",
        "collectible": true,
        "flavor_text": "High mortality rate, from often being hugged to death.",
        "play_sound": "files/LOEA10_3_BabyMurloc_Play.ogg",
        "attack_sound": "files/LOEA10_3_BabyMurloc_Attack.ogg",
        "image": "files/LOEA10_3.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOEA10_3_premium.gif"
    },
    {
        "card_id": "EX1_507",
        "set": "CLASSIC",
        "name": "Murloc Warleader",
        "collectible": true,
        "flavor_text": "Do Murlocs ever get tired of making the same old sound?  Nope!  Mrglglrglglglglglglgl!",
        "play_sound": "files/EX1_507_Murloc_Warleader_EnterPlay1.ogg",
        "attack_sound": "files/EX1_507_Murloc_Warleader_Attack1.ogg",
        "image": "files/EX1_507.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_507_premium.gif"
    },
    {
        "card_id": "LOE_006",
        "set": "LOE",
        "name": "Museum Curator",
        "collectible": true,
        "flavor_text": "He is forever cursing the kids who climb on the rails and the evil archeologists who animate the exhibits.",
        "play_sound": "files/VO_LOE_006_Play3_05.ogg",
        "attack_sound": "files/VO_LOE_006_Attack_02.ogg",
        "image": "files/LOE_006.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_006_premium.gif"
    },
    {
        "card_id": "AT_079",
        "set": "TGT",
        "name": "Mysterious Challenger",
        "collectible": true,
        "flavor_text": "He may sound surly and antisocial, but he's actually just really shy.",
        "play_sound": "files/VO_AT_079_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_079_ATTACK_02.ogg",
        "image": "files/AT_079.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_079_premium.gif"
    },
    {
        "card_id": "OG_312",
        "set": "OG",
        "name": "N'Zoth's First Mate",
        "collectible": true,
        "flavor_text": "Hates when N'Zoth yells \"Ahoy Matey!!\", but there's not really much he can do about it.",
        "play_sound": "files/VO_OG_312_Male_Qiraji_Play_02.ogg",
        "attack_sound": "files/VO_OG_312_Male_Qiraji_Attack_01.ogg",
        "image": "files/OG_312.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_312_premium.gif"
    },
    {
        "card_id": "OG_133",
        "set": "OG",
        "name": "N'Zoth, the Corruptor",
        "collectible": true,
        "flavor_text": "Has not been able to get \"Under the Sea\" out of his head for like FIVE THOUSAND YEARS.",
        "play_sound": "files/VO_OG_133_Male_OldGod_Play_01.ogg",
        "attack_sound": "files/VO_OG_133_Male_OldGod_Attack_01.ogg",
        "image": "files/OG_133.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_133_premium.gif"
    },
    {
        "card_id": "CFM_651",
        "set": "GANGS",
        "name": "Naga Corsair",
        "collectible": true,
        "flavor_text": "Hook-tails are nice and all but she keeps getting stuck on things.",
        "play_sound": "files/VO_CFM_651_Female_Naga_Play_01.ogg",
        "attack_sound": "files/VO_CFM_651_Female_Naga_Attack_01.ogg",
        "image": "files/CFM_651.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_651_premium.gif"
    },
    {
        "card_id": "TU4e_003",
        "set": "MISSIONS",
        "name": "Naga Myrmidon",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/TU4e_003_Play_NagaMyrmidon.ogg",
        "attack_sound": "files/TU4e_003_Attack_NagaMyrmidon.ogg",
        "image": "files/TU4e_003.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/TU4e_003.png"
    },
    {
        "card_id": "LOE_038",
        "set": "LOE",
        "name": "Naga Sea Witch",
        "collectible": true,
        "flavor_text": "If she had studied harder, she would have been a C+ witch.",
        "play_sound": "files/VO_LOE_038_Play_01.ogg",
        "attack_sound": "files/VO_LOE_038_Attack_02.ogg",
        "image": "files/LOE_038.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_038_premium.gif"
    },
    {
        "card_id": "EX1_557",
        "set": "CLASSIC",
        "name": "Nat Pagle",
        "collectible": true,
        "flavor_text": "Nat Pagle, Azeroth's premier fisherman!  He invented the Auto-Angler 3000, the Extendo-Pole 3000, and the Lure-o-matic 2099 (still in testing).",
        "play_sound": "files/VO_EX1_557_Play_01.ogg",
        "attack_sound": "files/VO_EX1_557_Attack_03.ogg",
        "image": "files/EX1_557.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_557_premium.gif"
    },
    {
        "card_id": "OG_338",
        "set": "OG",
        "name": "Nat, the Darkfisher",
        "collectible": true,
        "flavor_text": "You can take away his humanity, but you will never take away his fishing pole.",
        "play_sound": "files/VO_OG_338_Male_Human_Play_01.ogg",
        "attack_sound": "files/VO_OG_338_Male_Human_Attack_01.ogg",
        "image": "files/OG_338.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_338_premium.gif"
    },
    {
        "card_id": "NAXM_001",
        "set": "NAXX",
        "name": "Necroknight",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_NAXM_001_EnterPlay_01.ogg",
        "attack_sound": "files/VO_NAXM_001_Attack_02.ogg",
        "image": "files/NAXM_001.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAXM_001.png"
    },
    {
        "card_id": "ICC_900",
        "set": "ICECROWN",
        "name": "Necrotic Geist",
        "collectible": true,
        "flavor_text": "An eye for an eye, and a ghoul for a ghoul.",
        "play_sound": "files/VO_ICC_900_Male_Geist_Play_01.ogg",
        "attack_sound": "files/VO_ICC_900_Male_Geist_Attack_01.ogg",
        "image": "files/ICC_900.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_900_premium.gif"
    },
    {
        "card_id": "ICCA01_009",
        "set": "ICECROWN",
        "name": "Needy Hunter",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_ICCA01_009_Male_NightElf_Play_01.ogg",
        "attack_sound": "files/VO_ICCA01_009_Male_NightElf_Attack_01.ogg",
        "image": "files/ICCA01_009.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/ICCA01_009.png"
    },
    {
        "card_id": "BRM_030",
        "set": "BRM",
        "name": "Nefarian",
        "collectible": true,
        "flavor_text": "They call him \"Blackwing\" because he's a black dragon...... and he's got wings.",
        "play_sound": "files/VO_BRM_030_Attack_20.ogg",
        "attack_sound": "files/VO_BRM_030_Attack_20.ogg",
        "image": "files/BRM_030.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_030_premium.gif"
    },
    {
        "card_id": "GVG_042",
        "set": "GVG",
        "name": "Neptulon",
        "collectible": true,
        "flavor_text": "Neptulon is \"The Tidehunter\". He’s one of the four elemental lords. And he and Ragnaros get together and make really amazing saunas.",
        "play_sound": "files/VO_GVG_042_Play_01.ogg",
        "attack_sound": "files/VO_GVG_042_Attack_02.ogg",
        "image": "files/GVG_042.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_042_premium.gif"
    },
    {
        "card_id": "FP1_017",
        "set": "NAXX",
        "name": "Nerub'ar Weblord",
        "collectible": true,
        "flavor_text": "Weblords spend all day making giant trampoline parks.",
        "play_sound": "files/VO_FP1_017_EnterPlay_01.ogg",
        "attack_sound": "files/VO_FP1_017_Attack_02.ogg",
        "image": "files/FP1_017.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_017_premium.gif"
    },
    {
        "card_id": "FP1_007t",
        "set": "NAXX",
        "name": "Nerubian",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_FP1_007t_EnterPlay_01.ogg",
        "attack_sound": "files/VO_FP1_007t_Attack_02.ogg",
        "image": "files/FP1_007t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_007t_premium.gif"
    },
    {
        "card_id": "NAX1_03",
        "set": "NAXX",
        "name": "Nerubian2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_NAX1_03_EnterPlay.ogg",
        "attack_sound": "files/SFX_NAX1_03_Attack.ogg",
        "image": "files/NAX1_03.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX1_03.png"
    },
    {
        "card_id": "FP1_007",
        "set": "NAXX",
        "name": "Nerubian Egg",
        "collectible": true,
        "flavor_text": "Eggs are a good source of protein and Nerubians.",
        "play_sound": "files/SFX_FP1_007_EnterPlay.ogg",
        "attack_sound": "files/SFX_FP1_007_Attack.ogg",
        "image": "files/FP1_007.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_007_premium.gif"
    },
    {
        "card_id": "OG_138",
        "set": "OG",
        "name": "Nerubian Prophet",
        "collectible": true,
        "flavor_text": "It’s a self-reducing prophecy.",
        "play_sound": "files/OG_138_NerubianProphet_Play.ogg",
        "attack_sound": "files/OG_138_NerubianProphet_Attack.ogg",
        "image": "files/OG_138.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_138_premium.gif"
    },
    {
        "card_id": "ICC_706",
        "set": "ICECROWN",
        "name": "Nerubian Unraveler",
        "collectible": true,
        "flavor_text": "He loves a good yarn.",
        "play_sound": "files/VO_ICC_706_Male_Nerubian_Play_01.ogg",
        "attack_sound": "files/VO_ICC_706_Male_Nerubian_Attack_02.ogg",
        "image": "files/ICC_706.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_706_premium.gif"
    },
    {
        "card_id": "UNG_801",
        "set": "UNGORO",
        "name": "Nesting Roc",
        "collectible": true,
        "flavor_text": "Roc eggs are great in omelettes, sandwiches, and as bait to turn poachers into bird food.",
        "play_sound": "files/UNG_801_NestingRoc_Play.ogg",
        "attack_sound": "files/UNG_801_NestingRoc_Attack.ogg",
        "image": "files/UNG_801.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_801_premium.gif"
    },
    {
        "card_id": "UNG_829t3",
        "set": "UNGORO",
        "name": "Nether Imp",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/NetherImp_UNG_829t3_Play.ogg",
        "attack_sound": "files/NetherImp_UNG_829t3_Attack.ogg",
        "image": "files/UNG_829t3.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_829t3_premium.gif"
    },
    {
        "card_id": "UNG_829t2",
        "set": "UNGORO",
        "name": "Nether Portal",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/NetherPortal_UNG_829t2_Play.ogg",
        "attack_sound": "files/NetherPortal_UNG_829t2_Play.ogg",
        "image": "files/UNG_829t2.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_829t2_premium.gif"
    },
    {
        "card_id": "KAR_062",
        "set": "KARA",
        "name": "Netherspite Historian",
        "collectible": true,
        "flavor_text": "She can tell you all about the history of people not STANDING IN THE GREEN BEAM!",
        "play_sound": "files/VO_KAR_062_Female_Gnome_Play_01.ogg",
        "attack_sound": "files/VO_KAR_062_Female_Gnome_Attack_01.ogg",
        "image": "files/KAR_062.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_062_premium.gif"
    },
    {
        "card_id": "AT_127",
        "set": "TGT",
        "name": "Nexus-Champion Saraad",
        "collectible": true,
        "flavor_text": "The ethereals have their own jousting tournament, and Saraad is the reigning champion.  Also he won the ethereal hot dog eating contest.",
        "play_sound": "files/VO_AT_127_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_127_ATTACK_02.ogg",
        "image": "files/AT_127.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_127_premium.gif"
    },
    {
        "card_id": "KAR_010",
        "set": "KARA",
        "name": "Nightbane Templar",
        "collectible": true,
        "flavor_text": "Originally joined to be Arcanagos’ Templar, but has to admit that ordering pizza has become waaaay easier.",
        "play_sound": "files/VO_KAR_010_Female_BloodElf_Play_02.ogg",
        "attack_sound": "files/VO_KAR_010_Female_BloodElf_Attack_01.ogg",
        "image": "files/KAR_010.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_010_premium.gif"
    },
    {
        "card_id": "EX1_593",
        "set": "BASIC",
        "name": "Nightblade",
        "collectible": true,
        "flavor_text": "Your face is the place you'd probably least like a dagger, and where rogues are most likely to deliver them.",
        "play_sound": "files/VO_EX1_593_Play_01.ogg",
        "attack_sound": "files/VO_EX1_593_Attack_02.ogg",
        "image": "files/EX1_593.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_593_premium.gif"
    },
    {
        "card_id": "AT_103",
        "set": "TGT",
        "name": "North Sea Kraken",
        "collectible": true,
        "flavor_text": "You have no idea how tired this guy is of being released.",
        "play_sound": "files/SFX_AT_103_Play.ogg",
        "attack_sound": "files/SFX_AT_103_Attack.ogg",
        "image": "files/AT_103.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_103_premium.gif"
    },
    {
        "card_id": "CS2_235",
        "set": "BASIC",
        "name": "Northshire Cleric",
        "collectible": true,
        "flavor_text": "They help the downtrodden and distressed.  Also they sell cookies.",
        "play_sound": "files/VO_CS2_235_Play_01.ogg",
        "attack_sound": "files/VO_CS2_235_Attack_02.ogg",
        "image": "files/CS2_235.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_235_premium.gif"
    },
    {
        "card_id": "EX1_015",
        "set": "BASIC",
        "name": "Novice Engineer",
        "collectible": true,
        "flavor_text": "\"Half of this class will not graduate… since they'll have been turned to chickens.\" - Tinkmaster Overspark, teaching Gizmos 101.",
        "play_sound": "files/VO_EX1_015_Play_01.ogg",
        "attack_sound": "files/VO_EX1_015_Attack_02.ogg",
        "image": "files/EX1_015.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_015_premium.gif"
    },
    {
        "card_id": "EX1_560",
        "set": "CLASSIC",
        "name": "Nozdormu",
        "collectible": true,
        "flavor_text": "Time to write some flavor text.",
        "play_sound": "files/VO_EX1_560_Play_01.ogg",
        "attack_sound": "files/VO_EX1_560_Attack_02.ogg",
        "image": "files/EX1_560.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_560_premium.gif"
    },
    {
        "card_id": "CS2_119",
        "set": "BASIC",
        "name": "Oasis Snapjaw",
        "collectible": true,
        "flavor_text": "His dreams of flying and breathing fire like his idol will never be realized.",
        "play_sound": "files/CS2_119_Oasis_Snapjaw_EnterPlay2.ogg",
        "attack_sound": "files/CS2_119_Oasis_Snapjaw_Attack1.ogg",
        "image": "files/CS2_119.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_119_premium.gif"
    },
    {
        "card_id": "LOE_009",
        "set": "LOE",
        "name": "Obsidian Destroyer",
        "collectible": true,
        "flavor_text": "No obsidian is safe around the Obsidian Destroyer!",
        "play_sound": "files/SFX_LOE_009_Play.ogg",
        "attack_sound": "files/SFX_LOE_009_Attack.ogg",
        "image": "files/LOE_009.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_009_premium.gif"
    },
    {
        "card_id": "ICC_214",
        "set": "ICECROWN",
        "name": "Obsidian Statue",
        "collectible": true,
        "flavor_text": "The original artist spent many hours with a fine chisel perfecting the facial expression for maximum tauntiness.",
        "play_sound": "files/ObsidianStatue_ICC_214_Play.ogg",
        "attack_sound": "files/VO_ICC_214_Female_Human_Attack_01.ogg",
        "image": "files/ICC_214.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_214_premium.gif"
    },
    {
        "card_id": "GVG_065",
        "set": "GVG",
        "name": "Ogre Brute",
        "collectible": true,
        "flavor_text": "Ogres have really terrible short-term chocolate.",
        "play_sound": "files/VO_GVG_065_Play_01.ogg",
        "attack_sound": "files/VO_GVG_065_Attack_02.ogg",
        "image": "files/GVG_065.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_065_premium.gif"
    },
    {
        "card_id": "CS2_197",
        "set": "BASIC",
        "name": "Ogre Magi",
        "collectible": true,
        "flavor_text": "Training Ogres in the art of spellcasting is a questionable decision.",
        "play_sound": "files/VO_CS2_197_Play_01_MIX.ogg",
        "attack_sound": "files/VO_CS2_197_Attack_02_MIX.ogg",
        "image": "files/CS2_197.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_197_premium.gif"
    },
    {
        "card_id": "GVG_088",
        "set": "GVG",
        "name": "Ogre Ninja",
        "collectible": true,
        "flavor_text": "He didn't have the grades to get into ninja school, but his dad pulled some strings.",
        "play_sound": "files/VO_GVG_088_Play_01.ogg",
        "attack_sound": "files/VO_GVG_088_Attack_02.ogg",
        "image": "files/GVG_088.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_088_premium.gif"
    },
    {
        "card_id": "BRMA09_3t",
        "set": "BRM",
        "name": "Old Horde Orc",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_BRMA09_3t_Play_01.ogg",
        "attack_sound": "files/VO_BRMA09_3t_Attack_02.ogg",
        "image": "files/BRMA09_3t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA09_3t.png"
    },
    {
        "card_id": "EX1_062",
        "set": "HOF",
        "name": "Old Murk-Eye",
        "collectible": true,
        "flavor_text": "He's a legend among murlocs.  \"Mrghllghghllghg!\", they say.",
        "play_sound": "files/EX1_062_Old_Murk_Eye_EnterPlay1.ogg",
        "attack_sound": "files/EX1_062_Old_Murk_Eye_Attack1.ogg",
        "image": "files/EX1_062.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_062_premium.gif"
    },
    {
        "card_id": "GVG_025",
        "set": "GVG",
        "name": "One-eyed Cheat",
        "collectible": true,
        "flavor_text": "When pirates say there is no \"Eye\" in \"team,\" they are very literal about it.",
        "play_sound": "files/VO_GVG_025_Play_01.ogg",
        "attack_sound": "files/VO_GVG_025_Attack_02.ogg",
        "image": "files/GVG_025.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_025_premium.gif"
    },
    {
        "card_id": "KAR_204",
        "set": "KARA",
        "name": "Onyx Bishop",
        "collectible": true,
        "flavor_text": "B4 is a nice place to visit, but he wouldn't want to live there.",
        "play_sound": "files/VO_KAR_204_Male_ChessPiece_Play_01.ogg",
        "attack_sound": "files/VO_KAR_204_Male_ChessPiece_Attack_01.ogg",
        "image": "files/KAR_204.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_204_premium.gif"
    },
    {
        "card_id": "EX1_562",
        "set": "CLASSIC",
        "name": "Onyxia",
        "collectible": true,
        "flavor_text": "Onyxia long manipulated the Stormwind Court by disguising herself as Lady Katrana Prestor.   You would have thought that the giant wings and scales would have been a giveaway.",
        "play_sound": "files/VO_EX1_562_Play_01.ogg",
        "attack_sound": "files/VO_EX1_562_Attack_03.ogg",
        "image": "files/EX1_562.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_562_premium.gif"
    },
    {
        "card_id": "OG_156a",
        "set": "OG",
        "name": "Ooze",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/Slime_OG_156a_Play.ogg",
        "attack_sound": "files/Slime_OG_156a_Attack.ogg",
        "image": "files/OG_156a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_156a_premium.gif"
    },
    {
        "card_id": "KARA_13_03",
        "set": "KARA",
        "name": "Orc Warrior",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KARA_13_03_Female_Orc_Play_01.ogg",
        "attack_sound": "files/VO_KARA_13_03_Female_Orc_Attack_01.ogg",
        "image": "files/KARA_13_03.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KARA_13_03.png"
    },
    {
        "card_id": "AT_066",
        "set": "TGT",
        "name": "Orgrimmar Aspirant",
        "collectible": true,
        "flavor_text": "\"Four out of three orcs struggle with math.\" - Angry Zurge",
        "play_sound": "files/VO_AT_066_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_066_ATTACK_02.ogg",
        "image": "files/AT_066.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_066_premium.gif"
    },
    {
        "card_id": "UNG_925",
        "set": "UNGORO",
        "name": "Ornery Direhorn",
        "collectible": true,
        "flavor_text": "\"It's an herbivore.  How dangerous can it be?\"  - Famous last words",
        "play_sound": "files/UNG_925_OrneryDirehorn_Play.ogg",
        "attack_sound": "files/UNG_925_OrneryDirehorn_Attack.ogg",
        "image": "files/UNG_925.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_925_premium.gif"
    },
    {
        "card_id": "LOEA04_13bt",
        "set": "LOE",
        "name": "Orsis Guard",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_LOEA04_13bt_Play_01.ogg",
        "attack_sound": "files/VO_LOEA04_13bt_Attack_02.ogg",
        "image": "files/LOEA04_13bt.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA04_13bt.png"
    },
    {
        "card_id": "UNG_907",
        "set": "UNGORO",
        "name": "Ozruk",
        "collectible": true,
        "flavor_text": "Between you and me, Ozruk is a bit obsessed with his body.",
        "play_sound": "files/VO_UNG_907_Male_Elemental_Play_02.ogg",
        "attack_sound": "files/VO_UNG_907_Male_Elemental_Attack_01.ogg",
        "image": "files/UNG_907.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_907_premium.gif"
    },
    {
        "card_id": "TU4f_002",
        "set": "MISSIONS",
        "name": "Pandaren Scout",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_TU4f_002_Play_01.ogg",
        "attack_sound": "files/VO_TU4f_002_Play_01.ogg",
        "image": "files/TU4f_002.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/TU4f_002.png"
    },
    {
        "card_id": "EX1_160t",
        "set": "CLASSIC",
        "name": "Panther",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_EX1_160t_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_160t_Attack.ogg",
        "image": "files/EX1_160t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_160t_premium.gif"
    },
    {
        "card_id": "KAR_030a",
        "set": "KARA",
        "name": "Pantry Spider",
        "collectible": true,
        "flavor_text": "You have to admit, they make a cute couple.",
        "play_sound": "files/PantrySpiders_KAR_030a_Play.ogg",
        "attack_sound": "files/PantrySpiders_KAR_030a_Attack.ogg",
        "image": "files/KAR_030a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_030a_premium.gif"
    },
    {
        "card_id": "KARA_13_20",
        "set": "TB",
        "name": "Party Elemental",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/KARA_13_20_PartyElemental_Play.ogg",
        "attack_sound": "files/KARA_13_20_PartyElemental_Attack.ogg",
        "image": "files/KARA_13_20.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KARA_13_20.png"
    },
    {
        "card_id": "CFM_637",
        "set": "GANGS",
        "name": "Patches the Pirate",
        "collectible": true,
        "flavor_text": "What do sailors yell when Patches steals their treasure chest full of laws and other things being transported to parliament for a vote?  \"The Eyes have it!\"",
        "play_sound": "files/VO_CFM_637_Male_Beholder_Play_01.ogg",
        "attack_sound": "files/VO_CFM_637_Male_Beholder_Attack_02.ogg",
        "image": "files/CFM_637.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_637_premium.gif"
    },
    {
        "card_id": "EX1_522",
        "set": "CLASSIC",
        "name": "Patient Assassin",
        "collectible": true,
        "flavor_text": "He’s not really that patient. It just takes a while for someone to walk by that he can actually reach.",
        "play_sound": "files/VO_EX1_522_Play_01.ogg",
        "attack_sound": "files/VO_EX1_522_Attack_02.ogg",
        "image": "files/EX1_522.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_522_premium.gif"
    },
    {
        "card_id": "GVG_096",
        "set": "GVG",
        "name": "Piloted Shredder",
        "collectible": true,
        "flavor_text": "Once upon a time, only goblins piloted shredders. These days, everyone from Doomsayer to Lorewalker Cho seems to ride one.",
        "play_sound": "files/SFX_GVG_096_Play.ogg",
        "attack_sound": "files/SFX_GVG_096_Attack.ogg",
        "image": "files/GVG_096.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_096_premium.gif"
    },
    {
        "card_id": "GVG_105",
        "set": "GVG",
        "name": "Piloted Sky Golem",
        "collectible": true,
        "flavor_text": "The pinnacle of goblin engineering. Includes an espresso machine and foot massager.",
        "play_sound": "files/GVG_105_PilotedSkyGolem_EnterPlay.ogg",
        "attack_sound": "files/GVG_105_PilotedSkyGolem_Attack.ogg",
        "image": "files/GVG_105.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_105_premium.gif"
    },
    {
        "card_id": "EX1_076",
        "set": "CLASSIC",
        "name": "Pint-Sized Summoner",
        "collectible": true,
        "flavor_text": "She's quite jealous of the Gallon-Sized Summoner.",
        "play_sound": "files/VO_EX1_076_Play_01.ogg",
        "attack_sound": "files/VO_EX1_076_Attack_02.ogg",
        "image": "files/EX1_076.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_076_premium.gif"
    },
    {
        "card_id": "CFM_337t",
        "set": "GANGS",
        "name": "Piranha",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/Piranha_CFM_337t_Play.ogg",
        "attack_sound": "files/Piranha_CFM_337t_Attack.ogg",
        "image": "files/CFM_337t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_337t_premium.gif"
    },
    {
        "card_id": "AT_101",
        "set": "TGT",
        "name": "Pit Fighter",
        "collectible": true,
        "flavor_text": "What did the pits ever do to you?",
        "play_sound": "files/VO_AT_101_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_101_ATTACK_02.ogg",
        "image": "files/AT_101.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_101_premium.gif"
    },
    {
        "card_id": "EX1_313",
        "set": "CLASSIC",
        "name": "Pit Lord",
        "collectible": true,
        "flavor_text": "Mannoroth, Magtheridon, and Brutallus may be dead, but it turns out there are a LOT of pit lords.",
        "play_sound": "files/VO_EX1_313_Play_01.ogg",
        "attack_sound": "files/VO_EX1_313_Attack_02.ogg",
        "image": "files/EX1_313.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_313_premium.gif"
    },
    {
        "card_id": "LOE_010",
        "set": "LOE",
        "name": "Pit Snake",
        "collectible": true,
        "flavor_text": "It could be worse.  It could be a Snake Pit.",
        "play_sound": "files/SFX_LOE_010_Play.ogg",
        "attack_sound": "files/SFX_LOE_010_Attack.ogg",
        "image": "files/LOE_010.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_010_premium.gif"
    },
    {
        "card_id": "KAR_A02_06",
        "set": "KARA",
        "name": "Pitcher",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KAR_A02_06_Female_Pitcher_Play_01.ogg",
        "attack_sound": "files/VO_KAR_A02_06_Female_Pitcher_Attack_01.ogg",
        "image": "files/KAR_A02_06.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KAR_A02_06.png"
    },
    {
        "card_id": "ICC_809",
        "set": "ICECROWN",
        "name": "Plague Scientist",
        "collectible": true,
        "flavor_text": "The excruciating pain means it's working!",
        "play_sound": "files/VO_ICC_809_Male_Gnome_Play_01.ogg",
        "attack_sound": "files/VO_ICC_809_Male_Gnome_Attack_02.ogg",
        "image": "files/ICC_809.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_809_premium.gif"
    },
    {
        "card_id": "UNG_999t2t1",
        "set": "UNGORO",
        "name": "Plant",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/Plant_UNG_999t2t1_Play.ogg",
        "attack_sound": "files/Plant_UNG_999t2t1_Attack.ogg",
        "image": "files/UNG_999t2t1.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_999t2t1_premium.gif"
    },
    {
        "card_id": "KAR_A02_01",
        "set": "KARA",
        "name": "Plate",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KAR_A02_01_Female_Plate_Play_01.ogg",
        "attack_sound": "files/VO_KAR_A02_01_Female_Plate_Attack_01.ogg",
        "image": "files/KAR_A02_01.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KAR_A02_01.png"
    },
    {
        "card_id": "OG_323",
        "set": "OG",
        "name": "Polluted Hoarder",
        "collectible": true,
        "flavor_text": "Roll ‘greed’ OR THIS COULD HAPPEN TO YOU.",
        "play_sound": "files/VO_OG_323_Male_Gnome_Play_01.ogg",
        "attack_sound": "files/VO_OG_323_Male_Gnome_Attack_01.ogg",
        "image": "files/OG_323.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_323_premium.gif"
    },
    {
        "card_id": "KAR_011",
        "set": "KARA",
        "name": "Pompous Thespian",
        "collectible": true,
        "flavor_text": "Alas poor Annoy-o-Tron! A fellow of infinite jest, of most excellent fancy!",
        "play_sound": "files/VO_KAR_011_Male_NightElf_Play_01.ogg",
        "attack_sound": "files/VO_KAR_011_Male_NightElf_Attack_01.ogg",
        "image": "files/KAR_011.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_011_premium.gif"
    },
    {
        "card_id": "OG_241",
        "set": "OG",
        "name": "Possessed Villager",
        "collectible": true,
        "flavor_text": "It's like a pinata! A lame disgusting horrific pinata.",
        "play_sound": "files/VO_OG_241_Male_Human_Play_01.ogg",
        "attack_sound": "files/VO_OG_241_Male_Human_Attack_01.ogg",
        "image": "files/OG_241.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_241_premium.gif"
    },
    {
        "card_id": "Mekka4",
        "set": "HOF",
        "name": "Poultryizer",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_Mekka4_EnterPlay.ogg",
        "attack_sound": "files/SFX_Mekka4_Attack.ogg",
        "image": "files/Mekka4.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/Mekka4_premium.gif"
    },
    {
        "card_id": "KAR_035",
        "set": "KARA",
        "name": "Priest of the Feast",
        "collectible": true,
        "flavor_text": "Now that's a world champion cheesecake!",
        "play_sound": "files/VO_KAR_035_Male_Dwarf_Play_01.ogg",
        "attack_sound": "files/VO_KAR_035_Male_Dwarf_Attack_01.ogg",
        "image": "files/KAR_035.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_035_premium.gif"
    },
    {
        "card_id": "EX1_583",
        "set": "CLASSIC",
        "name": "Priestess of Elune",
        "collectible": true,
        "flavor_text": "If she threatens to \"moon\" you, it's not what you think.",
        "play_sound": "files/VO_EX1_583_Play_01.ogg",
        "attack_sound": "files/VO_EX1_583_Attack_02.ogg",
        "image": "files/EX1_583.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_583_premium.gif"
    },
    {
        "card_id": "UNG_201t",
        "set": "UNGORO",
        "name": "Primalfin",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_UNG_201t_Male_Murloc_Play_01.ogg",
        "attack_sound": "files/VO_UNG_201t_Male_Murloc_Attack_01.ogg",
        "image": "files/UNG_201t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_201t_premium.gif"
    },
    {
        "card_id": "UNG_953",
        "set": "UNGORO",
        "name": "Primalfin Champion",
        "collectible": true,
        "flavor_text": "Sure, he'll return your stuff.  OVER HIS DEAD BODY!",
        "play_sound": "files/VO_UNG_953_Male_Murloc_Play_01.ogg",
        "attack_sound": "files/VO_UNG_953_Male_Murloc_Attack_01.ogg",
        "image": "files/UNG_953.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_953_premium.gif"
    },
    {
        "card_id": "UNG_937",
        "set": "UNGORO",
        "name": "Primalfin Lookout",
        "collectible": true,
        "flavor_text": "Lookout is a self-appointed title that's mostly an excuse to beat things up.",
        "play_sound": "files/VO_UNG_937_Male_Murloc_Play_01.ogg",
        "attack_sound": "files/VO_UNG_937_Male_Murloc_Attack_01.ogg",
        "image": "files/UNG_937.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_937_premium.gif"
    },
    {
        "card_id": "UNG_201",
        "set": "UNGORO",
        "name": "Primalfin Totem",
        "collectible": true,
        "flavor_text": "Emits a sound only murlocs can hear, which is good because it’s REALLY annoying.",
        "play_sound": "files/PrimalfinTotem_UNG_201_Attack.ogg",
        "attack_sound": "files/PrimalfinTotem_UNG_201_Attack.ogg",
        "image": "files/UNG_201.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_201_premium.gif"
    },
    {
        "card_id": "UNG_848",
        "set": "UNGORO",
        "name": "Primordial Drake",
        "collectible": true,
        "flavor_text": "Before he became a rap artist.",
        "play_sound": "files/UNG_848_PrimordialDrake_Play.ogg",
        "attack_sound": "files/UNG_848_PrimordialDrake_Attack.ogg",
        "image": "files/UNG_848.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_848_premium.gif"
    },
    {
        "card_id": "ICC_851",
        "set": "ICECROWN",
        "name": "Prince Keleseth",
        "collectible": true,
        "flavor_text": "Three Princes stand before you. This one wants to buff his brothers.",
        "play_sound": "files/VO_ICC_851_Male_Vampire_Play_01.ogg",
        "attack_sound": "files/VO_ICC_851_Male_Vampire_Attack_01.ogg",
        "image": "files/ICC_851.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_851_premium.gif"
    },
    {
        "card_id": "KAR_096",
        "set": "KARA",
        "name": "Prince Malchezaar",
        "collectible": true,
        "flavor_text": "He was super excited to acquire Gorehowl at a garage sale!  Then super disappointed to find out it was a foam reproduction.",
        "play_sound": "files/VO_KAR_096_Male_Demon_Play_01.ogg",
        "attack_sound": "files/VO_KAR_096_Male_Demon_Attack_02.ogg",
        "image": "files/KAR_096.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_096_premium.gif"
    },
    {
        "card_id": "ICC_852",
        "set": "ICECROWN",
        "name": "Prince Taldaram",
        "collectible": true,
        "flavor_text": "Three Princes stand before you. This one wants to copy others.",
        "play_sound": "files/VO_ICC_852_Male_Vampire_Play_01.ogg",
        "attack_sound": "files/VO_ICC_852_Male_Vampire_Attack_02.ogg",
        "image": "files/ICC_852.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_852_premium.gif"
    },
    {
        "card_id": "ICC_853",
        "set": "ICECROWN",
        "name": "Prince Valanar",
        "collectible": true,
        "flavor_text": "Three Princes stand before you. This one devours one after another.",
        "play_sound": "files/VO_ICC_853_Male_Vampire_Play_01.ogg",
        "attack_sound": "files/VO_ICC_853_Male_Vampire_Attack_01.ogg",
        "image": "files/ICC_853.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_853_premium.gif"
    },
    {
        "card_id": "OG_309",
        "set": "OG",
        "name": "Princess Huhuran",
        "collectible": true,
        "flavor_text": "She flitters around Ahn'Qiraj dreaming of the day she will meet a sweet prince, whom she can lay thousands of eggs with.",
        "play_sound": "files/VO_OG_309_Female_Wasp_Play_01.ogg",
        "attack_sound": "files/VO_OG_309_Female_Wasp_Attack_01.ogg",
        "image": "files/OG_309.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_309_premium.gif"
    },
    {
        "card_id": "ICC_204",
        "set": "ICECROWN",
        "name": "Professor Putricide",
        "collectible": true,
        "flavor_text": "Among his more notable inventions: A tentacle-groomer, a plague that would wipe out all life on Azeroth, and a fidget spinner.",
        "play_sound": "files/VO_ICC_204_Male_Undead_Play_02.ogg",
        "attack_sound": "files/VO_ICC_204_Male_Undead_Attack_02.ogg",
        "image": "files/ICC_204.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_204_premium.gif"
    },
    {
        "card_id": "EX1_350",
        "set": "CLASSIC",
        "name": "Prophet Velen",
        "collectible": true,
        "flavor_text": "He's been exiled from his home, and all his brothers turned evil, but otherwise he doesn't have a lot to complain about.",
        "play_sound": "files/VO_EX1_350_Play_01.ogg",
        "attack_sound": "files/VO_EX1_350_Attack_02.ogg",
        "image": "files/EX1_350.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_350_premium.gif"
    },
    {
        "card_id": "OG_145",
        "set": "OG",
        "name": "Psych-o-Tron",
        "collectible": true,
        "flavor_text": "\"Annoyinger-o-Tron\" was just too unwieldy. And accurate.",
        "play_sound": "files/VO_OG_145_Male_Mech_Play_01.ogg",
        "attack_sound": "files/VO_OG_145_Male_Mech_Attack_01.ogg",
        "image": "files/OG_145.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_145_premium.gif"
    },
    {
        "card_id": "UNG_834t1",
        "set": "UNGORO",
        "name": "Pterrordax",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/UNG_834t1_Pterrordax_Play.ogg",
        "attack_sound": "files/UNG_834t1_Pterrordax_Attack.ogg",
        "image": "files/UNG_834t1.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_834t1_premium.gif"
    },
    {
        "card_id": "UNG_001",
        "set": "UNGORO",
        "name": "Pterrordax Hatchling",
        "collectible": true,
        "flavor_text": "Aww.  So cute.  Want to feed him another finger?",
        "play_sound": "files/UNG_001_PterrordaxHatchling_Play.ogg",
        "attack_sound": "files/UNG_001_PterrordaxHatchling_Attack.ogg",
        "image": "files/UNG_001.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_001_premium.gif"
    },
    {
        "card_id": "CFM_300",
        "set": "GANGS",
        "name": "Public Defender",
        "collectible": true,
        "flavor_text": "Happy to defend any public offender!",
        "play_sound": "files/VO_CFM_300_Male_Tauren_Play_01.ogg",
        "attack_sound": "files/VO_CFM_300_Male_Tauren_Attack_03.ogg",
        "image": "files/CFM_300.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_300_premium.gif"
    },
    {
        "card_id": "GVG_064",
        "set": "GVG",
        "name": "Puddlestomper",
        "collectible": true,
        "flavor_text": "He pays homage to Morgl, the great murloc oracle! (Who doesn't??)",
        "play_sound": "files/SFX_GVG_064_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_064_Attack.ogg",
        "image": "files/GVG_064.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_064_premium.gif"
    },
    {
        "card_id": "UNG_027",
        "set": "UNGORO",
        "name": "Pyros",
        "collectible": true,
        "flavor_text": "If you strike her down, she shall become more powerful than you can possibly… well, she'll become a 6/6 anyways.",
        "play_sound": "files/Pyros_UNG_027_Play.ogg",
        "attack_sound": "files/Pyros_UNG_027_Attack.ogg",
        "image": "files/UNG_027.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_027_premium.gif"
    },
    {
        "card_id": "UNG_027t2",
        "set": "UNGORO",
        "name": "Pyros2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/Pyros_UNG_027t2_Play.ogg",
        "attack_sound": "files/Pyros_UNG_027t2_Attack.ogg",
        "image": "files/UNG_027t2.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_027t2_premium.gif"
    },
    {
        "card_id": "UNG_027t4",
        "set": "UNGORO",
        "name": "Pyros3",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/Pyros_UNG_027t4_Play.ogg",
        "attack_sound": "files/Pyros_UNG_027t4_Attack.ogg",
        "image": "files/UNG_027t4.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_027t4_premium.gif"
    },
    {
        "card_id": "GVG_060",
        "set": "GVG",
        "name": "Quartermaster",
        "collectible": true,
        "flavor_text": "His specialty? Dividing things into four pieces.",
        "play_sound": "files/VO_GVG_060_Play_01.ogg",
        "attack_sound": "files/VO_GVG_060_Attack_02.ogg",
        "image": "files/GVG_060.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_060_premium.gif"
    },
    {
        "card_id": "UNG_920t1",
        "set": "UNGORO",
        "name": "Queen Carnassa",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/QueenCarnassa_UNG_920t1_Play.ogg",
        "attack_sound": "files/QueenCarnassa_UNG_920t1_Attack.ogg",
        "image": "files/UNG_920t1.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_920t1_premium.gif"
    },
    {
        "card_id": "EX1_044",
        "set": "CLASSIC",
        "name": "Questing Adventurer",
        "collectible": true,
        "flavor_text": "\"Does anyone have some extra Boar Pelts?\"",
        "play_sound": "files/VO_EX1_044_Play_01.ogg",
        "attack_sound": "files/VO_EX1_044_Attack_02.ogg",
        "image": "files/EX1_044.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_044_premium.gif"
    },
    {
        "card_id": "UNG_034",
        "set": "UNGORO",
        "name": "Radiant Elemental",
        "collectible": true,
        "flavor_text": "It's a literal lava lamp!",
        "play_sound": "files/RadiantElemental_UNG_034_Play.ogg",
        "attack_sound": "files/RadiantElemental_UNG_034_Attack.ogg",
        "image": "files/UNG_034.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_034_premium.gif"
    },
    {
        "card_id": "EX1_412",
        "set": "CLASSIC",
        "name": "Raging Worgen",
        "collectible": true,
        "flavor_text": "If he's raging now, just wait until he gets nerfed.",
        "play_sound": "files/SFX_EX1_412_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_412_Attack.ogg",
        "image": "files/EX1_412.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_412_premium.gif"
    },
    {
        "card_id": "EX1_298",
        "set": "HOF",
        "name": "Ragnaros the Firelord",
        "collectible": true,
        "flavor_text": "Ragnaros was summoned by the Dark Iron dwarves, who were eventually enslaved by the Firelord.  Summoning Ragnaros often doesn’t work out the way you want it to.",
        "play_sound": "files/VO_EX1_298_Play_01.ogg",
        "attack_sound": "files/VO_EX1_298_Attack_02.ogg",
        "image": "files/EX1_298.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_298_premium.gif"
    },
    {
        "card_id": "OG_229",
        "set": "OG",
        "name": "Ragnaros, Lightlord",
        "collectible": true,
        "flavor_text": "What happens when you try and corrupt a corrupted firelord? DOUBLE NEGATIVE, INSECT!",
        "play_sound": "files/VO_OG_229_Male_Demon_Play_01.ogg",
        "attack_sound": "files/VO_OG_229_Male_Demon_Attack_01.ogg",
        "image": "files/OG_229.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_229_premium.gif"
    },
    {
        "card_id": "CS2_122",
        "set": "BASIC",
        "name": "Raid Leader",
        "collectible": true,
        "flavor_text": "\"That's a 50 DKP minus!\"",
        "play_sound": "files/VO_CS2_122_Male_Orc_Play_01.ogg",
        "attack_sound": "files/VO_CS2_122_Male_Orc_Attack_02.ogg",
        "image": "files/CS2_122.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_122_premium.gif"
    },
    {
        "card_id": "AT_010",
        "set": "TGT",
        "name": "Ram Wrangler",
        "collectible": true,
        "flavor_text": "Not getting trampled is really the trick here.",
        "play_sound": "files/VO_AT_010_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_010_ATTACK_02.ogg",
        "image": "files/AT_010.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_010_premium.gif"
    },
    {
        "card_id": "UNG_076t1",
        "set": "UNGORO",
        "name": "Raptor",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/UNG_076t1_Raptor_Play.ogg",
        "attack_sound": "files/UNG_076t1_Raptor_Attack.ogg",
        "image": "files/UNG_076t1.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_076t1_premium.gif"
    },
    {
        "card_id": "UNG_914",
        "set": "UNGORO",
        "name": "Raptor Hatchling",
        "collectible": true,
        "flavor_text": "They’re just baby teeth. Lots and lots of baby teeth.",
        "play_sound": "files/UNG_914_RaptorHatchling_Play.ogg",
        "attack_sound": "files/UNG_914_RaptorHatchling_Attack.ogg",
        "image": "files/UNG_914.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_914_premium.gif"
    },
    {
        "card_id": "CFM_316t",
        "set": "GANGS",
        "name": "Rat",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/Rat_CFM_316t_Play.ogg",
        "attack_sound": "files/Rat_CFM_316t_Attack.ogg",
        "image": "files/CFM_316t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_316t_premium.gif"
    },
    {
        "card_id": "CFM_316",
        "set": "GANGS",
        "name": "Rat Pack",
        "collectible": true,
        "flavor_text": "He's gonna do it his way.",
        "play_sound": "files/VO_CFM_316_Male_Rat_Play.ogg",
        "attack_sound": "files/VO_CFM_316_Male_Rat_Attack.ogg",
        "image": "files/CFM_316.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_316_premium.gif"
    },
    {
        "card_id": "ICC_025",
        "set": "ICECROWN",
        "name": "Rattling Rascal",
        "collectible": true,
        "flavor_text": "Don't give up, skeleton!",
        "play_sound": "files/VO_ICC_025_Male_Skeleton_Play_01.ogg",
        "attack_sound": "files/VO_ICC_025_Male_Skeleton_Attack_01.ogg",
        "image": "files/ICC_025.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_025_premium.gif"
    },
    {
        "card_id": "OG_149",
        "set": "OG",
        "name": "Ravaging Ghoul",
        "collectible": true,
        "flavor_text": "But goes by \"Ravishing Ghoul\" when he hits the club.",
        "play_sound": "files/OG_149_RavagingGhoul_Play.ogg",
        "attack_sound": "files/OG_149_RavagingGhoul_Attack.ogg",
        "image": "files/OG_149.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_149_premium.gif"
    },
    {
        "card_id": "UNG_009",
        "set": "UNGORO",
        "name": "Ravasaur Runt",
        "collectible": true,
        "flavor_text": "Doesn't like to adapt unless others are watching. Some minions are such show-offs.",
        "play_sound": "files/RavasaurRunt_UNG_009_Play.ogg",
        "attack_sound": "files/RavasaurRunt_UNG_009_Attack.ogg",
        "image": "files/UNG_009.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_009_premium.gif"
    },
    {
        "card_id": "CS2_161",
        "set": "CLASSIC",
        "name": "Ravenholdt Assassin",
        "collectible": true,
        "flavor_text": "Just mail him a package with a name and 10,000 gold.  He'll take care of the rest.",
        "play_sound": "files/VO_CS2_161_Play_01.ogg",
        "attack_sound": "files/VO_CS2_161_Attack_02.ogg",
        "image": "files/CS2_161.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_161_premium.gif"
    },
    {
        "card_id": "UNG_047",
        "set": "UNGORO",
        "name": "Ravenous Pterrordax",
        "collectible": true,
        "flavor_text": "For better results, feed your pterrordax low-fat, high-fiber minions.",
        "play_sound": "files/UNG_047_RavenousPterrordax_Play.ogg",
        "attack_sound": "files/UNG_047_RavenousPterrordax_Attack.ogg",
        "image": "files/UNG_047.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_047_premium.gif"
    },
    {
        "card_id": "CFM_020",
        "set": "GANGS",
        "name": "Raza the Chained",
        "collectible": true,
        "flavor_text": "\"Could you do me a favor and get the keys from Kazakus?\"",
        "play_sound": "files/VO_CFM_020_Male_Ethereal_Play_01.ogg",
        "attack_sound": "files/VO_CFM_020_Male_Ethereal_Attack_01.ogg",
        "image": "files/CFM_020.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_020_premium.gif"
    },
    {
        "card_id": "CS2_196",
        "set": "BASIC",
        "name": "Razorfen Hunter",
        "collectible": true,
        "flavor_text": "Someone did mess with Tuskerr once.  ONCE.",
        "play_sound": "files/VO_CS2_196_Play_01.ogg",
        "attack_sound": "files/VO_CS2_196_Attack_02.ogg",
        "image": "files/CS2_196.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_196_premium.gif"
    },
    {
        "card_id": "UNG_058",
        "set": "UNGORO",
        "name": "Razorpetal Lasher",
        "collectible": true,
        "flavor_text": "The reason why there are no zombies in Un'goro.",
        "play_sound": "files/UNG_058_RazorpetalLasher_Play.ogg",
        "attack_sound": "files/UNG_058_RazorpetalLasher_Attack.ogg",
        "image": "files/UNG_058.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_058_premium.gif"
    },
    {
        "card_id": "CS2_213",
        "set": "BASIC",
        "name": "Reckless Rocketeer",
        "collectible": true,
        "flavor_text": "One Insane Rocketeer.   One Rocket full of Explosives.   Infinite Fun.",
        "play_sound": "files/VO_CS2_213_Play_01.ogg",
        "attack_sound": "files/VO_CS2_213_Attack_02.ogg",
        "image": "files/CS2_213.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_213_premium.gif"
    },
    {
        "card_id": "GVG_108",
        "set": "GVG",
        "name": "Recombobulator",
        "collectible": true,
        "flavor_text": "For when you didn’t combobulate quite right the first time around.",
        "play_sound": "files/VO_GVG_108_Play_01.ogg",
        "attack_sound": "files/VO_GVG_108_Attack_02.ogg",
        "image": "files/GVG_108.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_108_premium.gif"
    },
    {
        "card_id": "AT_113",
        "set": "TGT",
        "name": "Recruiter",
        "collectible": true,
        "flavor_text": "Join the Argent Crusade!  We have attractive tabards and you get to carry really nice swords!",
        "play_sound": "files/VO_AT_113_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_113_ATTACK_02.ogg",
        "image": "files/AT_113.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_113_premium.gif"
    },
    {
        "card_id": "AT_111",
        "set": "TGT",
        "name": "Refreshment Vendor",
        "collectible": true,
        "flavor_text": "Menu:  Funnel cakes, carrots, popcorn, jormungar steaks.  It's hard serving a diverse clientele.",
        "play_sound": "files/VO_AT_111_PLAY_ALT1_02.ogg",
        "attack_sound": "files/VO_AT_111_ATTACK_03.ogg",
        "image": "files/AT_111.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_111_premium.gif"
    },
    {
        "card_id": "LOE_116",
        "set": "LOE",
        "name": "Reliquary Seeker",
        "collectible": true,
        "flavor_text": "The Reliquary considers itself the equal of the League of Explorers.  The League of Explorers doesn't.",
        "play_sound": "files/VO_LOE_116_Play4_06.ogg",
        "attack_sound": "files/VO_LOE_116_Attack_02.ogg",
        "image": "files/LOE_116.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_116_premium.gif"
    },
    {
        "card_id": "LOE_011",
        "set": "LOE",
        "name": "Reno Jackson",
        "collectible": true,
        "flavor_text": "Reno is a four-time winner of the 'Best Accessorized Explorer' award.",
        "play_sound": "files/VO_LOE_011_Play_12.ogg",
        "attack_sound": "files/VO_LOE_011_Attack_10.ogg",
        "image": "files/LOE_011.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_011_premium.gif"
    },
    {
        "card_id": "Mekka2",
        "set": "HOF",
        "name": "Repair Bot",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_Mekka2_EnterPlay.ogg",
        "attack_sound": "files/SFX_Mekka2_Attack.ogg",
        "image": "files/Mekka2.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/Mekka2_premium.gif"
    },
    {
        "card_id": "AT_009",
        "set": "TGT",
        "name": "Rhonin",
        "collectible": true,
        "flavor_text": "A masterless shamurai.",
        "play_sound": "files/VO_AT_009_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_009_ATTACK_02.ogg",
        "image": "files/AT_009.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_009_premium.gif"
    },
    {
        "card_id": "CS2_120",
        "set": "BASIC",
        "name": "River Crocolisk",
        "collectible": true,
        "flavor_text": "Edward \"Lefty\" Smith tried to make luggage out of a river crocolisk once.",
        "play_sound": "files/SFX_CS2_120_EnterPlay.ogg",
        "attack_sound": "files/SFX_CS2_120_Attack.ogg",
        "image": "files/CS2_120.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_120_premium.gif"
    },
    {
        "card_id": "TU4a_002",
        "set": "MISSIONS",
        "name": "Riverpaw Gnoll",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/GnollReady1.ogg",
        "attack_sound": "files/GnollReady1.ogg",
        "image": "files/TU4a_002.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/TU4a_002.png"
    },
    {
        "card_id": "LOE_016t",
        "set": "LOE",
        "name": "Rock",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/LOE_016t_Rock_Play.ogg",
        "attack_sound": "files/LOE_016t_Rock_Attack.ogg",
        "image": "files/LOE_016t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOE_016t.png"
    },
    {
        "card_id": "UNG_073",
        "set": "UNGORO",
        "name": "Rockpool Hunter",
        "collectible": true,
        "flavor_text": "Loves crab meat. Fears crabs.",
        "play_sound": "files/VO_UNG_073_Male_Murloc_Play_01.ogg",
        "attack_sound": "files/VO_UNG_073_Male_Murloc_Attack_01.ogg",
        "image": "files/UNG_073.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_073_premium.gif"
    },
    {
        "card_id": "LOEA01_11",
        "set": "LOE",
        "name": "Rod of the Sun",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_LOEA01_11_Play.ogg",
        "attack_sound": "files/SFX_LOEA01_11_Attack.ogg",
        "image": "files/LOEA01_11.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA01_11.png"
    },
    {
        "card_id": "LOE_024t",
        "set": "LOE",
        "name": "Rolling Boulder",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/LOE_024t_RollingBoulder_Play.ogg",
        "attack_sound": "files/LOE_024t_RollingBoulder_Attack.ogg",
        "image": "files/LOE_024t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOE_024t.png"
    },
    {
        "card_id": "KARA_06_01",
        "set": "KARA",
        "name": "Romulo",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KARA_06_01_Male_Human_Play_01.ogg",
        "attack_sound": "files/VO_KARA_06_01_Male_Human_Attack_01.ogg",
        "image": "files/KARA_06_01.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KARA_06_01.png"
    },
    {
        "card_id": "ICC_405",
        "set": "ICECROWN",
        "name": "Rotface",
        "collectible": true,
        "flavor_text": "Daddy! I think I made a Legendary!",
        "play_sound": "files/VO_ICC_405_Male_Abomination_Play_01.ogg",
        "attack_sound": "files/VO_ICC_405_Male_Abomination_Attack_03.ogg",
        "image": "files/ICC_405.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_405_premium.gif"
    },
    {
        "card_id": "LOE_016",
        "set": "LOE",
        "name": "Rumbling Elemental",
        "collectible": true,
        "flavor_text": "He's a very hungry elemental.",
        "play_sound": "files/LOE_016_RumblingElemental_Play.ogg",
        "attack_sound": "files/LOE_016_RumblingElemental_Attack.ogg",
        "image": "files/LOE_016.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_016_premium.gif"
    },
    {
        "card_id": "ICC_240",
        "set": "ICECROWN",
        "name": "Runeforge Haunter",
        "collectible": true,
        "flavor_text": "Don't worry, he'll keep an eye on that for you.",
        "play_sound": "files/ICC_240_RuneforgeHaunter_Play.ogg",
        "attack_sound": "files/ICC_240_RuneforgeHaunter_Attack.ogg",
        "image": "files/ICC_240.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_240_premium.gif"
    },
    {
        "card_id": "KAR_029",
        "set": "KARA",
        "name": "Runic Egg",
        "collectible": true,
        "flavor_text": "Oh man! Runic omelettes are the best!",
        "play_sound": "files/KAR_029_RunicEgg_Play_01.ogg",
        "attack_sound": "files/KAR_029_RunicEgg_Attack_01.ogg",
        "image": "files/KAR_029.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_029_premium.gif"
    },
    {
        "card_id": "EX1_134",
        "set": "CLASSIC",
        "name": "SI:7 Agent",
        "collectible": true,
        "flavor_text": "The agents of SI:7 are responsible for Stormwind's covert activities.  Their duties include espionage, assassination, and throwing surprise birthday parties for the royal family.",
        "play_sound": "files/VO_EX1_134_Play_01.ogg",
        "attack_sound": "files/VO_EX1_134_Attack_02.ogg",
        "image": "files/EX1_134.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_134_premium.gif"
    },
    {
        "card_id": "AT_042t",
        "set": "TGT",
        "name": "Sabertooth Lion",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_AT_042t_EnterPlay.ogg",
        "attack_sound": "files/SFX_AT_042t_Attack.ogg",
        "image": "files/AT_042t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_042t_premium.gif"
    },
    {
        "card_id": "AT_042t2",
        "set": "TGT",
        "name": "Sabertooth Panther",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_AT_042t2_EnterPlay.ogg",
        "attack_sound": "files/SFX_AT_042t2_Attack.ogg",
        "image": "files/AT_042t2.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_042t2_premium.gif"
    },
    {
        "card_id": "OG_044c",
        "set": "TGT",
        "name": "Sabertooth Tiger",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/TigerForm_OG_044c_Play.ogg",
        "attack_sound": "files/TigerForm_OG_044c_Attack.ogg",
        "image": "files/OG_044c.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_044c_premium.gif"
    },
    {
        "card_id": "AT_086",
        "set": "TGT",
        "name": "Saboteur",
        "collectible": true,
        "flavor_text": "Listen all y'all it's a saboteur!",
        "play_sound": "files/VO_AT_086_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_086_ATTACK_02.ogg",
        "image": "files/AT_086.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_086_premium.gif"
    },
    {
        "card_id": "UNG_812",
        "set": "UNGORO",
        "name": "Sabretooth Stalker",
        "collectible": true,
        "flavor_text": "It's gotten a bit long in the tooth.",
        "play_sound": "files/SabretoothStalker_UNG_812_Play.ogg",
        "attack_sound": "files/SabretoothStalker_UNG_812_Attack.ogg",
        "image": "files/UNG_812.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_812_premium.gif"
    },
    {
        "card_id": "GVG_070",
        "set": "GVG",
        "name": "Salty Dog",
        "collectible": true,
        "flavor_text": "He's recently recovered from being a \"scurvy dog.\"",
        "play_sound": "files/VO_GVG_070_Play_01.ogg",
        "attack_sound": "files/VO_GVG_070_Attack_02.ogg",
        "image": "files/GVG_070.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_070_premium.gif"
    },
    {
        "card_id": "ICC_903",
        "set": "ICECROWN",
        "name": "Sanguine Reveler",
        "collectible": true,
        "flavor_text": "Have some! This drink is to die for!",
        "play_sound": "files/VO_ICC_903_Male_Sanlayn_Play_02.ogg",
        "attack_sound": "files/VO_ICC_903_Male_Sanlayn_Attack_01.ogg",
        "image": "files/ICC_903.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_903_premium.gif"
    },
    {
        "card_id": "AT_037t",
        "set": "TGT",
        "name": "Sapling",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_AT_037t_Play.ogg",
        "attack_sound": "files/SFX_AT_037t_Attack.ogg",
        "image": "files/AT_037t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_037t_premium.gif"
    },
    {
        "card_id": "ICC_466",
        "set": "ICECROWN",
        "name": "Saronite Chain Gang",
        "collectible": true,
        "flavor_text": "Desperately needs some alone time.",
        "play_sound": "files/VO_ICC_466_Male_Draenei_Play_01.ogg",
        "attack_sound": "files/VO_ICC_466_Male_Draenei_Attack_01.ogg",
        "image": "files/ICC_466.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_466_premium.gif"
    },
    {
        "card_id": "UNG_010",
        "set": "UNGORO",
        "name": "Sated Threshadon",
        "collectible": true,
        "flavor_text": "Bet you can't eat just one murloc!",
        "play_sound": "files/UNG_010_SatedThreshadon_Play.ogg",
        "attack_sound": "files/UNG_010_SatedThreshadon_Attack.ogg",
        "image": "files/UNG_010.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_010_premium.gif"
    },
    {
        "card_id": "AT_039",
        "set": "TGT",
        "name": "Savage Combatant",
        "collectible": true,
        "flavor_text": "Maybe if you whistle a tune it will soothe him.  Yeah...  Try that.",
        "play_sound": "files/VO_AT_039_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_039_ATTACK_03.ogg",
        "image": "files/AT_039.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_039_premium.gif"
    },
    {
        "card_id": "EX1_534",
        "set": "CLASSIC",
        "name": "Savannah Highmane",
        "collectible": true,
        "flavor_text": "In the jungle, the mighty jungle, the lion gets slowly consumed by hyenas.",
        "play_sound": "files/SFX_EX1_534_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_534_Attack.ogg",
        "image": "files/EX1_534.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_534_premium.gif"
    },
    {
        "card_id": "OG_271",
        "set": "OG",
        "name": "Scaled Nightmare",
        "collectible": true,
        "flavor_text": "I like it because it scales.",
        "play_sound": "files/OG_271_ScaledNightmare_Play.ogg",
        "attack_sound": "files/OG_271_ScaledNightmare_Attack.ogg",
        "image": "files/OG_271.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_271_premium.gif"
    },
    {
        "card_id": "LOE_009t",
        "set": "LOE",
        "name": "Scarab",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/LOE_009t_Scarab_Play.ogg",
        "attack_sound": "files/LOE_009t_Scarab_Attack.ogg",
        "image": "files/LOE_009t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_009t_premium.gif"
    },
    {
        "card_id": "ICC_832t4",
        "set": "ICECROWN",
        "name": "Scarab Beetle",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/ICC_832t4_ScarabBeetle_Play.ogg",
        "attack_sound": "files/ICC_832t4_ScarabBeetle_Attack.ogg",
        "image": "files/ICC_832t4.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_832t4_premium.gif"
    },
    {
        "card_id": "EX1_020",
        "set": "CLASSIC",
        "name": "Scarlet Crusader",
        "collectible": true,
        "flavor_text": "Never wash your whites with a Scarlet Crusader.",
        "play_sound": "files/VO_EX1_020_Play_01.ogg",
        "attack_sound": "files/VO_EX1_020_Attack_02.ogg",
        "image": "files/EX1_020.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_020_premium.gif"
    },
    {
        "card_id": "GVG_101",
        "set": "GVG",
        "name": "Scarlet Purifier",
        "collectible": true,
        "flavor_text": "The Scarlet Crusade is doing market research to find out if the \"Mauve Crusade\" would be better received.",
        "play_sound": "files/VO_GVG_101_Play_01.ogg",
        "attack_sound": "files/VO_GVG_101_Attack_02.ogg",
        "image": "files/GVG_101.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_101_premium.gif"
    },
    {
        "card_id": "EX1_531",
        "set": "CLASSIC",
        "name": "Scavenging Hyena",
        "collectible": true,
        "flavor_text": "Hyenas prefer the bones of kodos or windserpents, but they'll eat pretty much anything.  Even Brussels sprouts.",
        "play_sound": "files/SFX_EX1_531_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_531_Attack.ogg",
        "image": "files/EX1_531.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_531_premium.gif"
    },
    {
        "card_id": "GVG_055",
        "set": "GVG",
        "name": "Screwjank Clunker",
        "collectible": true,
        "flavor_text": "If it breaks, just kick it a couple of times while yelling \"Durn thing!\"",
        "play_sound": "files/VO_GVG_055_Play_01.ogg",
        "attack_sound": "files/VO_GVG_055_Attack_02.ogg",
        "image": "files/GVG_055.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_055_premium.gif"
    },
    {
        "card_id": "EX1_586",
        "set": "CLASSIC",
        "name": "Sea Giant",
        "collectible": true,
        "flavor_text": "See?  Giant.",
        "play_sound": "files/SFX_EX1_586_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_586_Attack.ogg",
        "image": "files/EX1_586.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_586_premium.gif"
    },
    {
        "card_id": "AT_130",
        "set": "TGT",
        "name": "Sea Reaver",
        "collectible": true,
        "flavor_text": "A little better than Sea Minus Reaver.",
        "play_sound": "files/VO_AT_130_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_130_ATTACK_02.ogg",
        "image": "files/AT_130.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_130_premium.gif"
    },
    {
        "card_id": "CFM_699",
        "set": "GANGS",
        "name": "Seadevil Stinger",
        "collectible": true,
        "flavor_text": "Pretty harmless unless you're a Seadevil.",
        "play_sound": "files/VO_CFM_699_Male_Murloc_Play_01.ogg",
        "attack_sound": "files/VO_CFM_699_Male_Murloc_Attack_01.ogg",
        "image": "files/CFM_699.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_699_premium.gif"
    },
    {
        "card_id": "CS2_050",
        "set": "BASIC",
        "name": "Searing Totem",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/CS2_050_Play_SearingTotem.ogg",
        "attack_sound": "files/SFX_CS2_050_Attack_00.ogg",
        "image": "files/CS2_050.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_050_premium.gif"
    },
    {
        "card_id": "CFM_652",
        "set": "GANGS",
        "name": "Second-Rate Bruiser",
        "collectible": true,
        "flavor_text": "He'll be a first-rate bruiser once he gets used to his contacts.",
        "play_sound": "files/VO_CFM_652_Male_Ogre_Play_02.ogg",
        "attack_sound": "files/VO_CFM_652_Male_Ogre_Attack_01.ogg",
        "image": "files/CFM_652.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_652_premium.gif"
    },
    {
        "card_id": "EX1_080",
        "set": "CLASSIC",
        "name": "Secretkeeper",
        "collectible": true,
        "flavor_text": "She promises not to tell anyone about that thing you did last night with that one person.",
        "play_sound": "files/VO_EX1_080_Play_01.ogg",
        "attack_sound": "files/VO_EX1_080_Attack_02.ogg",
        "image": "files/EX1_080.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_080_premium.gif"
    },
    {
        "card_id": "LOEA04_25",
        "set": "LOE",
        "name": "Seething Statue",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_LOEA04_25_Play.ogg",
        "attack_sound": "files/SFX_LOEA04_25_Attack.ogg",
        "image": "files/LOEA04_25.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA04_25.png"
    },
    {
        "card_id": "OG_221",
        "set": "OG",
        "name": "Selfless Hero",
        "collectible": true,
        "flavor_text": "\"Don't worry about me… I'll just be here... under these tentacles.\"",
        "play_sound": "files/VO_OG_221_Female_Draenai_Play_01.ogg",
        "attack_sound": "files/VO_OG_221_Female_Draenai_Attack_01.ogg",
        "image": "files/OG_221.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_221_premium.gif"
    },
    {
        "card_id": "CS2_179",
        "set": "BASIC",
        "name": "Sen'jin Shieldmasta",
        "collectible": true,
        "flavor_text": "Sen'jin Villiage is nice, if you like trolls and dust.",
        "play_sound": "files/VO_CS2_179_Play_01.ogg",
        "attack_sound": "files/VO_CS2_179_Attack_02.ogg",
        "image": "files/CS2_179.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_179_premium.gif"
    },
    {
        "card_id": "CFM_341",
        "set": "GANGS",
        "name": "Sergeant Sally",
        "collectible": true,
        "flavor_text": "\"Who is she?  Where did she come from?  We don't even have a police force here in Gadgetzan!!\" - Mayor Noggenfogger",
        "play_sound": "files/VO_CFM_341_Female_Gnome_Play_01.ogg",
        "attack_sound": "files/VO_CFM_341_Female_Gnome_Attack_01.ogg",
        "image": "files/CFM_341.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_341_premium.gif"
    },
    {
        "card_id": "UNG_816",
        "set": "UNGORO",
        "name": "Servant of Kalimos",
        "collectible": true,
        "flavor_text": "He's doing his best, but his mom thinks that if he had just applied himself in school Kalimos would be working for HIM.",
        "play_sound": "files/VO_UNG_816_Male_Elemental_Play_01.ogg",
        "attack_sound": "files/VO_UNG_816_Male_Elemental_Attack_01.ogg",
        "image": "files/UNG_816.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_816_premium.gif"
    },
    {
        "card_id": "OG_087",
        "set": "OG",
        "name": "Servant of Yogg-Saron",
        "collectible": true,
        "flavor_text": "Yogg-Saron always likes to complain about how he has too many servants and there are too many mouths to feed.",
        "play_sound": "files/OG_087_ServantOfYoggSaron_Play.ogg",
        "attack_sound": "files/OG_087_ServantOfYoggSaron_Attack.ogg",
        "image": "files/OG_087.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_087_premium.gif"
    },
    {
        "card_id": "FP1_005",
        "set": "NAXX",
        "name": "Shade of Naxxramas",
        "collectible": true,
        "flavor_text": "The Shades of Naxxramas \u003ci\u003ehate\u003c/i\u003e the living. They even have a slur they use to refer them: \u003ci\u003eLivers\u003c/i\u003e.",
        "play_sound": "files/VO_FP1_005_EnterPlay_01.ogg",
        "attack_sound": "files/VO_FP1_005_Attack_02.ogg",
        "image": "files/FP1_005.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_005_premium.gif"
    },
    {
        "card_id": "TU4f_003",
        "set": "MISSIONS",
        "name": "Shado-Pan Monk",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_TU4f_003_Play_01.ogg",
        "attack_sound": "files/VO_TU4f_003_Play_01.ogg",
        "image": "files/TU4f_003.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/TU4f_003.png"
    },
    {
        "card_id": "AT_028",
        "set": "TGT",
        "name": "Shado-Pan Rider",
        "collectible": true,
        "flavor_text": "He needed a break after that business in the Vale of Eternal Blossoms. Naturally, he chose to spend his vacation in an icy snowscape killing monsters.",
        "play_sound": "files/VO_AT_028_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_028_ATTACK_02.ogg",
        "image": "files/AT_028.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_028_premium.gif"
    },
    {
        "card_id": "ICC_210",
        "set": "ICECROWN",
        "name": "Shadow Ascendant",
        "collectible": true,
        "flavor_text": "When you're at the bottom, there's nowhere to ascend, but up.",
        "play_sound": "files/VO_ICC_210_Female_Undead_Play_01.ogg",
        "attack_sound": "files/VO_ICC_210_Female_Undead_Attack_01.ogg",
        "image": "files/ICC_210.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_210_premium.gif"
    },
    {
        "card_id": "CFM_636",
        "set": "GANGS",
        "name": "Shadow Rager",
        "collectible": true,
        "flavor_text": "WE WENT THERE!",
        "play_sound": "files/CFM_636_ShadowRager_Play.ogg",
        "attack_sound": "files/CFM_636_ShadowRager_Attack.ogg",
        "image": "files/CFM_636.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_636_premium.gif"
    },
    {
        "card_id": "CFM_694",
        "set": "GANGS",
        "name": "Shadow Sensei",
        "collectible": true,
        "flavor_text": "He used to be Aya's tutor, but she fired him for bugging her too much.",
        "play_sound": "files/VO_CFM_694_Male_Mantid_Play_01.ogg",
        "attack_sound": "files/VO_CFM_694_Male_Mantid_Attack_01.ogg",
        "image": "files/CFM_694.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_694_premium.gif"
    },
    {
        "card_id": "EX1_345t",
        "set": "CLASSIC",
        "name": "Shadow of Nothing",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/EX1_345t_ShadowOfNothing_Play.ogg",
        "attack_sound": "files/EX1_345t_ShadowOfNothing_Attack.ogg",
        "image": "files/EX1_345t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_345t_premium.gif"
    },
    {
        "card_id": "OG_241a",
        "set": "OG",
        "name": "Shadowbeast",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/Shadowbeast_OG_241a_Play.ogg",
        "attack_sound": "files/Shadowbeast_OG_241a_Attack.ogg",
        "image": "files/OG_241a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_241a_premium.gif"
    },
    {
        "card_id": "GVG_009",
        "set": "GVG",
        "name": "Shadowbomber",
        "collectible": true,
        "flavor_text": "Shadowbomber does her job, but she's kind of phoning it in at this point.",
        "play_sound": "files/VO_GVG_009_Play_01_ALT.ogg",
        "attack_sound": "files/VO_GVG_009_Attack_02.ogg",
        "image": "files/GVG_009.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_009_premium.gif"
    },
    {
        "card_id": "GVG_072",
        "set": "GVG",
        "name": "Shadowboxer",
        "collectible": true,
        "flavor_text": "Punching is its primary function. Also, its secondary function.",
        "play_sound": "files/VO_GVG_072_Play_01.ogg",
        "attack_sound": "files/VO_GVG_072_Attack_02.ogg",
        "image": "files/GVG_072.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_072_premium.gif"
    },
    {
        "card_id": "OG_291",
        "set": "OG",
        "name": "Shadowcaster",
        "collectible": true,
        "flavor_text": "I mean, it's not creepy if you ASK before you steal their shadow to make a small replica of them to keep on your shelf.",
        "play_sound": "files/VO_OG_291_Female_Goblin_Play_01.ogg",
        "attack_sound": "files/VO_OG_291_Female_Goblin_Attack_01.ogg",
        "image": "files/OG_291.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_291_premium.gif"
    },
    {
        "card_id": "AT_014",
        "set": "TGT",
        "name": "Shadowfiend",
        "collectible": true,
        "flavor_text": "Hopes to be promoted to \"Shadowfriend\" someday.",
        "play_sound": "files/SFX_AT_014_Play.ogg",
        "attack_sound": "files/SFX_AT_014_Attack.ogg",
        "image": "files/AT_014.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_014_premium.gif"
    },
    {
        "card_id": "AT_032",
        "set": "TGT",
        "name": "Shady Dealer",
        "collectible": true,
        "flavor_text": "I have great deal for you... for 4 damage to your face!",
        "play_sound": "files/VO_AT_032_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_032_ATTACK_02.ogg",
        "image": "files/AT_032.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_032_premium.gif"
    },
    {
        "card_id": "CFM_781",
        "set": "GANGS",
        "name": "Shaku, the Collector",
        "collectible": true,
        "flavor_text": "Aya even staged an intervention once, but Shaku still insists that he is not a hoarder.",
        "play_sound": "files/VO_CFM_781_Male_Sha_Play_01.ogg",
        "attack_sound": "files/VO_CFM_781_Male_Sha_Attack_01.ogg",
        "image": "files/CFM_781.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_781_premium.gif"
    },
    {
        "card_id": "CFM_336",
        "set": "GANGS",
        "name": "Shaky Zipgunner",
        "collectible": true,
        "flavor_text": "The Grimy Goons can get you any weapon you want but if you want it to not explode you gotta pay extra.",
        "play_sound": "files/VO_CFM_336_Male_Gnoll_Play_01.ogg",
        "attack_sound": "files/VO_CFM_336_Male_Gnoll_Attack_01.ogg",
        "image": "files/CFM_336.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_336_premium.gif"
    },
    {
        "card_id": "ICC_702",
        "set": "ICECROWN",
        "name": "Shallow Gravedigger",
        "collectible": true,
        "flavor_text": "It's hard to put them six feet under when you're three feet tall.",
        "play_sound": "files/VO_ICC_702_Female_Gnome_Play_01.ogg",
        "attack_sound": "files/VO_ICC_702_Female_Gnome_Attack_02.ogg",
        "image": "files/ICC_702.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_702_premium.gif"
    },
    {
        "card_id": "EX1_019",
        "set": "BASIC",
        "name": "Shattered Sun Cleric",
        "collectible": true,
        "flavor_text": "They always have a spare flask of Sunwell Energy Drink™!",
        "play_sound": "files/VO_EX1_019_Play_01.ogg",
        "attack_sound": "files/VO_EX1_019_Attack_02.ogg",
        "image": "files/EX1_019.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_019_premium.gif"
    },
    {
        "card_id": "CS2_tk1",
        "set": "BASIC",
        "name": "Sheep",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_CS2_tk1_EnterPlay.ogg",
        "attack_sound": "files/SFX_CS2_tk1_Attack.ogg",
        "image": "files/CS2_tk1.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_tk1_premium.gif"
    },
    {
        "card_id": "UNG_101",
        "set": "UNGORO",
        "name": "Shellshifter",
        "collectible": true,
        "flavor_text": "Master of the Three Shell Monte.",
        "play_sound": "files/VO_UNG_101_Male_Tortollan_Play_01.ogg",
        "attack_sound": "files/VO_UNG_101_Male_Tortollan_Attack_01.ogg",
        "image": "files/UNG_101.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_101_premium.gif"
    },
    {
        "card_id": "UNG_101t",
        "set": "UNGORO",
        "name": "Shellshifter2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/ShellshifterStealth_UNG_101t_Play.ogg",
        "attack_sound": "files/ShellshifterStealth_UNG_101t_Attack.ogg",
        "image": "files/UNG_101t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_101t_premium.gif"
    },
    {
        "card_id": "UNG_101t3",
        "set": "UNGORO",
        "name": "Shellshifter3",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/ShellshifterCombo_UNG_101t3_Play.ogg",
        "attack_sound": "files/ShellshifterCombo_UNG_101t3_Attack.ogg",
        "image": "files/UNG_101t3.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_101t3_premium.gif"
    },
    {
        "card_id": "UNG_065",
        "set": "UNGORO",
        "name": "Sherazin, Corpse Flower",
        "collectible": true,
        "flavor_text": "A Tortollan gardener's worst nightmare.",
        "play_sound": "files/SherazinCorpseFlower_UNG_065_Play.ogg",
        "attack_sound": "files/SherazinCorpseFlower_UNG_065_Attack.ogg",
        "image": "files/UNG_065.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_065_premium.gif"
    },
    {
        "card_id": "EX1_405",
        "set": "CLASSIC",
        "name": "Shieldbearer",
        "collectible": true,
        "flavor_text": "Have you seen the size of the shields in this game??  This is no easy job.",
        "play_sound": "files/VO_EX1_405_Play_01.ogg",
        "attack_sound": "files/VO_EX1_405_Attack_02.ogg",
        "image": "files/EX1_405.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_405_premium.gif"
    },
    {
        "card_id": "GVG_058",
        "set": "GVG",
        "name": "Shielded Minibot",
        "collectible": true,
        "flavor_text": "He chooses to believe what he is programmed to believe!",
        "play_sound": "files/VO_GVG_058_Play_01.ogg",
        "attack_sound": "files/VO_GVG_058_Attack_02.ogg",
        "image": "files/GVG_058.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_058_premium.gif"
    },
    {
        "card_id": "GVG_053",
        "set": "GVG",
        "name": "Shieldmaiden",
        "collectible": true,
        "flavor_text": "She has three shieldbearers in her party to supply her with back ups when she gets low on durability.",
        "play_sound": "files/VO_GVG_053_Play_01.ogg",
        "attack_sound": "files/VO_GVG_053_Attack_02.ogg",
        "image": "files/GVG_053.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_053_premium.gif"
    },
    {
        "card_id": "OG_123",
        "set": "OG",
        "name": "Shifter Zerus",
        "collectible": true,
        "flavor_text": "It's like being able to play with THREE angry chickens!",
        "play_sound": "files/ShifterZerus_OG_123_Play.ogg",
        "attack_sound": "files/ShifterZerus_OG_123_Attack.ogg",
        "image": "files/OG_123.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_123_premium.gif"
    },
    {
        "card_id": "OG_335",
        "set": "OG",
        "name": "Shifting Shade",
        "collectible": true,
        "flavor_text": "Yeah, it's cooler in the shade, but you're also more likely to get JACKED.",
        "play_sound": "files/VO_OG_335_Male_Shade_Play_02.ogg",
        "attack_sound": "files/VO_OG_335_Male_Shade_Attack_01.ogg",
        "image": "files/OG_335.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_335_premium.gif"
    },
    {
        "card_id": "UNG_846",
        "set": "UNGORO",
        "name": "Shimmering Tempest",
        "collectible": true,
        "flavor_text": "HATES being summoned for Kirin Tor party lighting.",
        "play_sound": "files/UNG_846_ShimmeringTempest_Play.ogg",
        "attack_sound": "files/UNG_846_ShimmeringTempest_Attack.ogg",
        "image": "files/UNG_846.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_846_premium.gif"
    },
    {
        "card_id": "GVG_075",
        "set": "GVG",
        "name": "Ship's Cannon",
        "collectible": true,
        "flavor_text": "If you hear someone yell, \"Cannonball!\" you're about to get wet. Or crushed.",
        "play_sound": "files/SFX_GVG_075_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_075_Attack.ogg",
        "image": "files/GVG_075.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_075_premium.gif"
    },
    {
        "card_id": "GVG_011",
        "set": "GVG",
        "name": "Shrinkmeister",
        "collectible": true,
        "flavor_text": "After the debacle of the Gnomish World Enlarger, gnomes are wary of size-changing inventions.",
        "play_sound": "files/VO_GVG_011_Play_01.ogg",
        "attack_sound": "files/VO_GVG_011_Attack_Alt_03.ogg",
        "image": "files/GVG_011.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_011_premium.gif"
    },
    {
        "card_id": "AT_098",
        "set": "TGT",
        "name": "Sideshow Spelleater",
        "collectible": true,
        "flavor_text": "Hey!  Let me try that...",
        "play_sound": "files/VO_AT_098_PLAY_ALT1_02.ogg",
        "attack_sound": "files/VO_AT_098_ATTACK_03.ogg",
        "image": "files/AT_098.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_098_premium.gif"
    },
    {
        "card_id": "GVG_086",
        "set": "GVG",
        "name": "Siege Engine",
        "collectible": true,
        "flavor_text": "Wintergrasp Keep's only weakness!",
        "play_sound": "files/GVG_086_SiegeEngine_EnterPlay.ogg",
        "attack_sound": "files/GVG_086_SiegeEngine_Attack.ogg",
        "image": "files/GVG_086.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_086_premium.gif"
    },
    {
        "card_id": "AT_095",
        "set": "TGT",
        "name": "Silent Knight",
        "collectible": true,
        "flavor_text": "He used to be a librarian.  Old habits die hard.",
        "play_sound": "files/VO_AT_095_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_095_ATTACK_02.ogg",
        "image": "files/AT_095.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_095_premium.gif"
    },
    {
        "card_id": "OG_034",
        "set": "OG",
        "name": "Silithid Swarmer",
        "collectible": true,
        "flavor_text": "If your hero doesn't attack, it's just \"Silithid Loner\".",
        "play_sound": "files/OG_034_SilithidSwarmer_Play.ogg",
        "attack_sound": "files/OG_034_SilithidSwarmer_Attack.ogg",
        "image": "files/OG_034.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_034_premium.gif"
    },
    {
        "card_id": "GVG_040",
        "set": "GVG",
        "name": "Siltfin Spiritwalker",
        "collectible": true,
        "flavor_text": "The elements respond to anyone who calls them for a worthy cause, even if you call them by yelling, \"MRGHRGLGLGL!\"",
        "play_sound": "files/GVG_040_SiltfinSpiritwalker_EnterPlay.ogg",
        "attack_sound": "files/GVG_040_SiltfinSpiritwalker_Attack.ogg",
        "image": "files/GVG_040.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_040_premium.gif"
    },
    {
        "card_id": "CS2_151",
        "set": "CLASSIC",
        "name": "Silver Hand Knight",
        "collectible": true,
        "flavor_text": "It's good to be a knight.   Less so to be one's squire.",
        "play_sound": "files/VO_CS2_151_Play_01.ogg",
        "attack_sound": "files/VO_CS2_151_Attack_02.ogg",
        "image": "files/CS2_151.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_151_premium.gif"
    },
    {
        "card_id": "OG_006a",
        "set": "OG",
        "name": "Silver Hand Murloc",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SilverHandMurloc_OG_006a_Play.ogg",
        "attack_sound": "files/SilverHandMurloc_OG_006a_Attack.ogg",
        "image": "files/OG_006a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_006a_premium.gif"
    },
    {
        "card_id": "CS2_101t",
        "set": "BASIC",
        "name": "Silver Hand Recruit",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_CS2_101t_Play_01.ogg",
        "attack_sound": "files/VO_CS2_101t_Attack_02.ogg",
        "image": "files/CS2_101t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_101t_premium.gif"
    },
    {
        "card_id": "AT_100",
        "set": "TGT",
        "name": "Silver Hand Regent",
        "collectible": true,
        "flavor_text": "The Silver Hand is the best paladin organization.  The Argent Crusaders are super jealous.",
        "play_sound": "files/VO_AT_100_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_100_ATTACK_ALT1_04.ogg",
        "image": "files/AT_100.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_100_premium.gif"
    },
    {
        "card_id": "CS2_127",
        "set": "BASIC",
        "name": "Silverback Patriarch",
        "collectible": true,
        "flavor_text": "He likes to act like he's in charge, but the silverback matriarch actually runs things.",
        "play_sound": "files/CS2_127_Silverback_Patriarch_EnterPlay1.ogg",
        "attack_sound": "files/CS2_127_Silverback_Patriarch_Attack3.ogg",
        "image": "files/CS2_127.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_127_premium.gif"
    },
    {
        "card_id": "EX1_023",
        "set": "CLASSIC",
        "name": "Silvermoon Guardian",
        "collectible": true,
        "flavor_text": "The first time they tried to guard Silvermoon against the scourge, it didn’t go so well…",
        "play_sound": "files/VO_EX1_023_Play_01.ogg",
        "attack_sound": "files/VO_EX1_023_Attack_02.ogg",
        "image": "files/EX1_023.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_023_premium.gif"
    },
    {
        "card_id": "KAR_205",
        "set": "KARA",
        "name": "Silverware Golem",
        "collectible": true,
        "flavor_text": "From the secret research labs of the Swiss Army.",
        "play_sound": "files/VO_KAR_205_Male_SilverwareGolem_Play_01.ogg",
        "attack_sound": "files/VO_KAR_205_Male_SilverwareGolem_Attack_01.ogg",
        "image": "files/KAR_205.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_205_premium.gif"
    },
    {
        "card_id": "ICC_838",
        "set": "ICECROWN",
        "name": "Sindragosa",
        "collectible": true,
        "flavor_text": "\"I recognize your effort but I think your magic still has room for improvement.\" - Sindragosa after taking a class on giving constructive feedback.",
        "play_sound": "files/VO_ICC_838_Female_Dragon_Play_03.ogg",
        "attack_sound": "files/VO_ICC_838_Female_Dragon_Attack_01.ogg",
        "image": "files/ICC_838.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_838_premium.gif"
    },
    {
        "card_id": "LOE_076",
        "set": "LOE",
        "name": "Sir Finley Mrrgglton",
        "collectible": true,
        "flavor_text": "In addition to fluent Common, he also speaks fourteen dialects of 'mrgl'.",
        "play_sound": "files/VO_LOE_076_Play_alt4_20.ogg",
        "attack_sound": "files/VO_LOE_076_Attack_13.ogg",
        "image": "files/LOE_076.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_076_premium.gif"
    },
    {
        "card_id": "NAX9_04",
        "set": "NAXX",
        "name": "Sir Zeliek",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_NAX9_04_Attack_02.ogg",
        "attack_sound": "files/VO_NAX9_04_Attack_02.ogg",
        "image": "files/NAX9_04.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX9_04.png"
    },
    {
        "card_id": "ICC_019",
        "set": "ICECROWN",
        "name": "Skelemancer",
        "collectible": true,
        "flavor_text": "What do you mean there's no such thing as \"Skelemancy?\" But \"Dinomancy\" is ok?",
        "play_sound": "files/VO_ICC_019_Female_BloodElf_Play_03.ogg",
        "attack_sound": "files/VO_ICC_019_Female_BloodElf_Attack_02.ogg",
        "image": "files/ICC_019.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_019_premium.gif"
    },
    {
        "card_id": "LOEA16_26",
        "set": "LOE",
        "name": "Skelesaurus Hex",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/LOEA16_26_SkelesaurusHex_Play.ogg",
        "attack_sound": "files/LOEA16_26_SkelesaurusHex_Attack.ogg",
        "image": "files/LOEA16_26.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA16_26.png"
    },
    {
        "card_id": "ICC_025t",
        "set": "ICECROWN",
        "name": "Skeletal Enforcer",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_ICC_025t_Male_Giant_Play_01.ogg",
        "attack_sound": "files/VO_ICC_025t_Male_Giant_Attack_01.ogg",
        "image": "files/ICC_025t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/ICC_025t.png"
    },
    {
        "card_id": "ICC_019t",
        "set": "ICECROWN",
        "name": "Skeletal Flayer",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/ICC_019t_SkeletalFlayer_Play.ogg",
        "attack_sound": "files/ICC_019t_SkeletalFlayer_Attack.ogg",
        "image": "files/ICC_019t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_019t_premium.gif"
    },
    {
        "card_id": "ICCA11_001",
        "set": "ICECROWN",
        "name": "Skeletal Knight",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_ICCA11_001_Male_Undead_Play_01.ogg",
        "attack_sound": "files/VO_ICCA11_001_Male_Undead_Attack_01.ogg",
        "image": "files/ICCA11_001.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/ICCA11_001.png"
    },
    {
        "card_id": "NAXM_002",
        "set": "NAXX",
        "name": "Skeletal Smith",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/NAXM_002_SkeletalSmith_EnterPlay.ogg",
        "attack_sound": "files/NAXM_002_SkeletalSmith_Attack.ogg",
        "image": "files/NAXM_002.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAXM_002.png"
    },
    {
        "card_id": "NAX4_03",
        "set": "NAXX",
        "name": "Skeleton",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/NAX4_03_Skeleton_EnterPlay.ogg",
        "attack_sound": "files/NAX4_03_Skeleton_Attack.ogg",
        "image": "files/NAX4_03.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX4_03.png"
    },
    {
        "card_id": "ICC_026t",
        "set": "ICECROWN",
        "name": "Skeleton2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/ICC_026t_Male_Skeleton_Play.ogg",
        "attack_sound": "files/ICC_026t_Male_Skeleton_Attack.ogg",
        "image": "files/ICC_026t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_026t_premium.gif"
    },
    {
        "card_id": "OG_339",
        "set": "OG",
        "name": "Skeram Cultist",
        "collectible": true,
        "flavor_text": "Just before he comes into play, there is an AWESOME training montage with C'Thun.",
        "play_sound": "files/VO_OG_339_Male_Qiraji_Play_02.ogg",
        "attack_sound": "files/VO_OG_339_Male_Qiraji_Attack_01.ogg",
        "image": "files/OG_339.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_339_premium.gif"
    },
    {
        "card_id": "ICC_701",
        "set": "ICECROWN",
        "name": "Skulking Geist",
        "collectible": true,
        "flavor_text": "It's as though a million Jade Idols cried out, and were suddenly silenced.",
        "play_sound": "files/VO_ICC_701_Male_Geist_Play_01.ogg",
        "attack_sound": "files/VO_ICC_701_Male_Geist_Attack_01.ogg",
        "image": "files/ICC_701.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_701_premium.gif"
    },
    {
        "card_id": "AT_070",
        "set": "TGT",
        "name": "Skycap'n Kragg",
        "collectible": true,
        "flavor_text": "What's more boss than riding a parrot with a jawbone for a shoulderpad while wielding a giant hook-lance-thing and wearing a pirate hat?  NOTHING.",
        "play_sound": "files/VO_AT_070_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_070_ATTACK_02.ogg",
        "image": "files/AT_070.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_070_premium.gif"
    },
    {
        "card_id": "ICCA05_003",
        "set": "ICECROWN",
        "name": "Sleeping Acolyte",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_ICCA05_003_Female_BloodElf_Attack_01.ogg",
        "attack_sound": "files/VO_ICCA05_003_Female_BloodElf_Attack_01.ogg",
        "image": "files/ICCA05_003.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/ICCA05_003.png"
    },
    {
        "card_id": "OG_202c",
        "set": "OG",
        "name": "Slime",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/Slime_OG_202c_Play.ogg",
        "attack_sound": "files/Slime_OG_202c_Attack.ogg",
        "image": "files/OG_202c.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_202c_premium.gif"
    },
    {
        "card_id": "OG_249a",
        "set": "OG",
        "name": "Slime2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/Slime_OG_249a_Play.ogg",
        "attack_sound": "files/Slime_OG_249a_Attack.ogg",
        "image": "files/OG_249a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_249a_premium.gif"
    },
    {
        "card_id": "OG_314b",
        "set": "OG",
        "name": "Slime3",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/Slime_OG_314b_Play.ogg",
        "attack_sound": "files/Slime_OG_314b_Attack.ogg",
        "image": "files/OG_314b.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_314b_premium.gif"
    },
    {
        "card_id": "FP1_012t",
        "set": "NAXX",
        "name": "Slime4",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_FP1_012t_EnterPlay.ogg",
        "attack_sound": "files/SFX_FP1_012t_Attack.ogg",
        "image": "files/FP1_012t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_012t_premium.gif"
    },
    {
        "card_id": "LOEA09_6",
        "set": "LOE",
        "name": "Slithering Archer",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_LOEA09_6_Play_01.ogg",
        "attack_sound": "files/VO_LOEA09_6_Attack_02.ogg",
        "image": "files/LOEA09_6.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA09_6.png"
    },
    {
        "card_id": "LOEA09_8",
        "set": "LOE",
        "name": "Slithering Guard",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/LOEA09_8_SlitherpearSiren_Play.ogg",
        "attack_sound": "files/LOEA09_8_SlitherpearSiren_Attack.ogg",
        "image": "files/LOEA09_8.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA09_8.png"
    },
    {
        "card_id": "FP1_012",
        "set": "NAXX",
        "name": "Sludge Belcher",
        "collectible": true,
        "flavor_text": "DO NOT GIVE HIM A ROOT BEER.",
        "play_sound": "files/VO_FP1_012_EnterPlay_01.ogg",
        "attack_sound": "files/VO_FP1_012_Attack_02.ogg",
        "image": "files/FP1_012.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_012_premium.gif"
    },
    {
        "card_id": "CFM_325",
        "set": "GANGS",
        "name": "Small-Time Buccaneer",
        "collectible": true,
        "flavor_text": "\"Oh, I'm not serious about it.  I only pirate on the weekends.\"",
        "play_sound": "files/VO_CFM_325_Male_Gnome_Play_01.ogg",
        "attack_sound": "files/VO_CFM_325_Male_Gnome_Attack_02.ogg",
        "image": "files/CFM_325.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_325_premium.gif"
    },
    {
        "card_id": "EX1_554t",
        "set": "CLASSIC",
        "name": "Snake",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/EX1_554t_Play_Snake_2.ogg",
        "attack_sound": "files/EX1_554t_Attack_Snake.ogg",
        "image": "files/EX1_554t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_554t_premium.gif"
    },
    {
        "card_id": "GVG_114",
        "set": "GVG",
        "name": "Sneed's Old Shredder",
        "collectible": true,
        "flavor_text": "When Sneed was defeated in the Deadmines, his shredder was sold at auction to an anonymous buyer. (Probably Hogger.)",
        "play_sound": "files/SFX_GVG_114_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_114_Attack.ogg",
        "image": "files/GVG_114.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_114_premium.gif"
    },
    {
        "card_id": "GVG_002",
        "set": "GVG",
        "name": "Snowchugger",
        "collectible": true,
        "flavor_text": "Do the slow chant when he waddles by: \"Chug! Chug! Chug!\"",
        "play_sound": "files/VO_GVG_002_Play_01.ogg",
        "attack_sound": "files/VO_GVG_002_Attack_02.ogg",
        "image": "files/GVG_002.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_002_premium.gif"
    },
    {
        "card_id": "ICC_023",
        "set": "ICECROWN",
        "name": "Snowflipper Penguin",
        "collectible": true,
        "flavor_text": "On land, a group of penguins is called a \"waddle.\"",
        "play_sound": "files/ICC_023_SnowFlipper_Play.ogg",
        "attack_sound": "files/ICC_023_SnowFlipper_Attack.ogg",
        "image": "files/ICC_023.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_023_premium.gif"
    },
    {
        "card_id": "ICC_090",
        "set": "ICECROWN",
        "name": "Snowfury Giant",
        "collectible": true,
        "flavor_text": "This minion goes all the way to 11!",
        "play_sound": "files/ICC_090_SnowfuryGiant_Play.ogg",
        "attack_sound": "files/ICC_090_SnowfuryGiant_Attack.ogg",
        "image": "files/ICC_090.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_090_premium.gif"
    },
    {
        "card_id": "OG_340",
        "set": "OG",
        "name": "Soggoth the Slitherer",
        "collectible": true,
        "flavor_text": "Don't tell Soggoth, but in the future he gets totally owned by the Master's Glaive and his skull becomes a tourist attraction.",
        "play_sound": "files/VO_OG_340_Male_Faceless_Play_01.ogg",
        "attack_sound": "files/VO_OG_340_Male_Faceless_Attack_01.ogg",
        "image": "files/OG_340.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_340_premium.gif"
    },
    {
        "card_id": "BRMA13_5",
        "set": "BRM",
        "name": "Son of the Flame",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BRMA13_5_SonOfTheFlame_EnterPlay_1.ogg",
        "attack_sound": "files/BRMA13_5_SonOfTheFlame_Attack_1.ogg",
        "image": "files/BRMA13_5.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA13_5.png"
    },
    {
        "card_id": "GVG_123",
        "set": "GVG",
        "name": "Soot Spewer",
        "collectible": true,
        "flavor_text": "The inventor of the goblin shredder is involved in several patent disputes with the inventor of the soot spewer.",
        "play_sound": "files/SFX_GVG_123_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_123_Attack.ogg",
        "image": "files/GVG_123.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_123_premium.gif"
    },
    {
        "card_id": "EX1_608",
        "set": "CLASSIC",
        "name": "Sorcerer's Apprentice",
        "collectible": true,
        "flavor_text": "Apprentices are great for bossing around.  \"Conjure me some mana buns! And a coffee!  Make that a mana coffee!\"",
        "play_sound": "files/VO_EX1_608_Play_01.ogg",
        "attack_sound": "files/VO_EX1_608_Attack_02.ogg",
        "image": "files/EX1_608.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_608_premium.gif"
    },
    {
        "card_id": "NEW1_027",
        "set": "CLASSIC",
        "name": "Southsea Captain",
        "collectible": true,
        "flavor_text": "When he saves enough plunder, he's going to commission an enormous captain's hat.  He has hat envy.",
        "play_sound": "files/VO_NEW1_027_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_027_Attack_02.ogg",
        "image": "files/NEW1_027.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_027_premium.gif"
    },
    {
        "card_id": "CS2_146",
        "set": "CLASSIC",
        "name": "Southsea Deckhand",
        "collectible": true,
        "flavor_text": "Pirates are into this new fad called \"Planking\".",
        "play_sound": "files/VO_CS2_146_Play_01.ogg",
        "attack_sound": "files/VO_CS2_146_Attack_02.ogg",
        "image": "files/CS2_146.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_146_premium.gif"
    },
    {
        "card_id": "OG_267",
        "set": "OG",
        "name": "Southsea Squidface",
        "collectible": true,
        "flavor_text": "Quick! Before I drown! Let me sharpen your sword for you.",
        "play_sound": "files/VO_OG_267_Female_Faceless_Play_01.ogg",
        "attack_sound": "files/VO_OG_267_Female_Faceless_Attack_01.ogg",
        "image": "files/OG_267.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_267_premium.gif"
    },
    {
        "card_id": "AT_069",
        "set": "TGT",
        "name": "Sparring Partner",
        "collectible": true,
        "flavor_text": "Come at me, bro.",
        "play_sound": "files/VO_AT_069_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_069_ATTACK_02.ogg",
        "image": "files/AT_069.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_069_premium.gif"
    },
    {
        "card_id": "OG_256",
        "set": "OG",
        "name": "Spawn of N'Zoth",
        "collectible": true,
        "flavor_text": "Who's a cute widdle N'Zoth? You are! Yes you are! Yes you're the cutest widdle N'Zoth in the whole world!!!",
        "play_sound": "files/SpawnOfNZoth_OG_256_Play.ogg",
        "attack_sound": "files/SpawnOfNZoth_OG_256_Attack.ogg",
        "image": "files/OG_256.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_256_premium.gif"
    },
    {
        "card_id": "AT_012",
        "set": "TGT",
        "name": "Spawn of Shadows",
        "collectible": true,
        "flavor_text": "What did you expect to happen?  He's a Spawn.  Of Shadows.",
        "play_sound": "files/VO_AT_012_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_012_ATTACK_02.ogg",
        "image": "files/AT_012.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_012_premium.gif"
    },
    {
        "card_id": "FP1_008",
        "set": "NAXX",
        "name": "Spectral Knight",
        "collectible": true,
        "flavor_text": "What do Faerie Dragons and Spectral Knights have in common?  They both love pasta!",
        "play_sound": "files/VO_FP1_008_EnterPlay_01.ogg",
        "attack_sound": "files/VO_FP1_008_Attack_02.ogg",
        "image": "files/FP1_008.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_008_premium.gif"
    },
    {
        "card_id": "ICC_910",
        "set": "ICECROWN",
        "name": "Spectral Pillager",
        "collectible": true,
        "flavor_text": "It turns out you CAN take it with you.",
        "play_sound": "files/VO_ICC_910_Female_Banshee_Play_03.ogg",
        "attack_sound": "files/VO_ICC_910_Female_Banshee_Attack_01.ogg",
        "image": "files/ICC_910.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_910_premium.gif"
    },
    {
        "card_id": "NAX8_05t",
        "set": "NAXX",
        "name": "Spectral Rider",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_NAX8_05t_EnterPlay_01.ogg",
        "attack_sound": "files/VO_NAX8_05t_Attack_02.ogg",
        "image": "files/NAX8_05t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX8_05t.png"
    },
    {
        "card_id": "FP1_002t",
        "set": "NAXX",
        "name": "Spectral Spider",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_FP1_002t_EnterPlay.ogg",
        "attack_sound": "files/SFX_FP1_002t_Attack.ogg",
        "image": "files/FP1_002t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_002t_premium.gif"
    },
    {
        "card_id": "NAX8_03t",
        "set": "NAXX",
        "name": "Spectral Trainee",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_NAX8_03t_EnterPlay_01.ogg",
        "attack_sound": "files/VO_NAX8_03t_Attack_02.ogg",
        "image": "files/NAX8_03t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX8_03t.png"
    },
    {
        "card_id": "NAX8_04t",
        "set": "NAXX",
        "name": "Spectral Warrior",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_NAX8_042t_EnterPlay_01.ogg",
        "attack_sound": "files/VO_NAX8_04t_Attack_02.ogg",
        "image": "files/NAX8_04t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX8_04t.png"
    },
    {
        "card_id": "tt_010a",
        "set": "CLASSIC",
        "name": "Spellbender",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_tt_010a_Play_01.ogg",
        "attack_sound": "files/VO_tt_010a_Attack_02.ogg",
        "image": "files/tt_010a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/tt_010a_premium.gif"
    },
    {
        "card_id": "EX1_048",
        "set": "CLASSIC",
        "name": "Spellbreaker",
        "collectible": true,
        "flavor_text": "Spellbreakers can rip enchantments from magic-wielders.  The process is painless and can be performed on an outpatient basis.",
        "play_sound": "files/VO_EX1_048_Play_01.ogg",
        "attack_sound": "files/VO_EX1_048_Attack_02.ogg",
        "image": "files/EX1_048.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_048_premium.gif"
    },
    {
        "card_id": "AT_007",
        "set": "TGT",
        "name": "Spellslinger",
        "collectible": true,
        "flavor_text": "Does he sling spells, or do his spells linger about.  Who can say?",
        "play_sound": "files/VO_AT_007_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_007_ATTACK_02.ogg",
        "image": "files/AT_007.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_007_premium.gif"
    },
    {
        "card_id": "OG_216a",
        "set": "OG",
        "name": "Spider",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/Spider_OG_216a_Play.ogg",
        "attack_sound": "files/Spider_OG_216a_Attack.ogg",
        "image": "files/OG_216a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_216a_premium.gif"
    },
    {
        "card_id": "GVG_044",
        "set": "GVG",
        "name": "Spider Tank",
        "collectible": true,
        "flavor_text": "\"What if we put guns on it?\" -Fizzblitz, staring at the spider-transportation-machine",
        "play_sound": "files/SFX_GVG_044_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_044_Attack.ogg",
        "image": "files/GVG_044.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_044_premium.gif"
    },
    {
        "card_id": "LOEA07_24",
        "set": "LOE",
        "name": "Spiked Decoy",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/LOEA07_24_SpikedDecoy_Play.ogg",
        "attack_sound": "files/LOEA07_24_SpikedDecoy_Attack.ogg",
        "image": "files/LOEA07_24.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA07_24.png"
    },
    {
        "card_id": "CFM_688",
        "set": "GANGS",
        "name": "Spiked Hogrider",
        "collectible": true,
        "flavor_text": "Did you know the Hogchoppers compete every year at the Mirage Raceway?  They do.  It's a real group.",
        "play_sound": "files/VO_CFM_688_Male_Quilboar_Play_01.ogg",
        "attack_sound": "files/VO_CFM_688_Male_Quilboar_Attack_01.ogg",
        "image": "files/CFM_688.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_688_premium.gif"
    },
    {
        "card_id": "EX1_tk11",
        "set": "CLASSIC",
        "name": "Spirit Wolf",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_EX1_tk11_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_tk11_Attack.ogg",
        "image": "files/EX1_tk11.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_tk11_premium.gif"
    },
    {
        "card_id": "UNG_900",
        "set": "UNGORO",
        "name": "Spiritsinger Umbra",
        "collectible": true,
        "flavor_text": "She sees the fate of anyone she meets, but it's always the same: dinosaur attack.",
        "play_sound": "files/VO_UNG_900_Female_Tortollan_Play_03.ogg",
        "attack_sound": "files/VO_UNG_900_Female_Tortollan_Attack_02.ogg",
        "image": "files/UNG_900.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_900_premium.gif"
    },
    {
        "card_id": "CS2_221",
        "set": "CLASSIC",
        "name": "Spiteful Smith",
        "collectible": true,
        "flavor_text": "She'll craft you a sword, but you'll need to bring her 5 Steel Ingots, 3 Motes of Earth, and the scalp of her last customer.",
        "play_sound": "files/VO_CS2_221_Play_01.ogg",
        "attack_sound": "files/VO_CS2_221_Attack_02.ogg",
        "image": "files/CS2_221.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_221_premium.gif"
    },
    {
        "card_id": "NAX6_03t",
        "set": "NAXX",
        "name": "Spore",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_NAX6_03t_EnterPlay.ogg",
        "attack_sound": "files/SFX_NAX6_03t_Attack.ogg",
        "image": "files/NAX6_03t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX6_03t.png"
    },
    {
        "card_id": "CS2_152",
        "set": "CLASSIC",
        "name": "Squire",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_CS2_152_Play_01.ogg",
        "attack_sound": "files/VO_CS2_152_Attack_02.ogg",
        "image": "files/CS2_152.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_152_premium.gif"
    },
    {
        "card_id": "OG_327",
        "set": "OG",
        "name": "Squirming Tentacle",
        "collectible": true,
        "flavor_text": "Yeah, I think we can agree that killing the squirming tentacle first is a good idea.",
        "play_sound": "files/SquirmingTentacle_OG_327_Play.ogg",
        "attack_sound": "files/SquirmingTentacle_OG_327_Attack.ogg",
        "image": "files/OG_327.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_327_premium.gif"
    },
    {
        "card_id": "EX1_tk28",
        "set": "CLASSIC",
        "name": "Squirrel",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_EX1_tk28_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_tk28_Attack.ogg",
        "image": "files/EX1_tk28.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_tk28_premium.gif"
    },
    {
        "card_id": "AT_057",
        "set": "TGT",
        "name": "Stablemaster",
        "collectible": true,
        "flavor_text": "Takes way better care of her pets than her brother, Unstablemaster.",
        "play_sound": "files/VO_AT_057_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_057_ATTACK_03.ogg",
        "image": "files/AT_057.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_057_premium.gif"
    },
    {
        "card_id": "FP1_014",
        "set": "NAXX",
        "name": "Stalagg",
        "collectible": true,
        "flavor_text": "Stalagg want to write own flavor text.  \"STALAGG AWESOME!\"",
        "play_sound": "files/VO_FP1_014_EnterPlay_01.ogg",
        "attack_sound": "files/VO_FP1_014_Attack_02.ogg",
        "image": "files/FP1_014.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_014_premium.gif"
    },
    {
        "card_id": "NEW1_041",
        "set": "CLASSIC",
        "name": "Stampeding Kodo",
        "collectible": true,
        "flavor_text": "This Kodo is so big that he can stampede by \u003ci\u003ehimself\u003c/i\u003e.",
        "play_sound": "files/KotoBeastReady1.ogg",
        "attack_sound": "files/KotoBeastYes1.ogg",
        "image": "files/NEW1_041.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_041_premium.gif"
    },
    {
        "card_id": "CS2_237",
        "set": "BASIC",
        "name": "Starving Buzzard",
        "collectible": true,
        "flavor_text": "If you feed him, he loses his whole \u003ci\u003eidentity\u003c/i\u003e.",
        "play_sound": "files/SFX_CS2_237_EnterPlay.ogg",
        "attack_sound": "files/SFX_CS2_237_Attack.ogg",
        "image": "files/CS2_237.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_237_premium.gif"
    },
    {
        "card_id": "UNG_021",
        "set": "UNGORO",
        "name": "Steam Surger",
        "collectible": true,
        "flavor_text": "Explorers nicknamed him the Teapot Elemental.",
        "play_sound": "files/UNG_021_SteamSurger_Play.ogg",
        "attack_sound": "files/UNG_021_SteamSurger_Attack.ogg",
        "image": "files/UNG_021.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_021_premium.gif"
    },
    {
        "card_id": "GVG_087",
        "set": "GVG",
        "name": "Steamwheedle Sniper",
        "collectible": true,
        "flavor_text": "Goblins seldom have the patience for sniping. Most prefer lobbing explosives.",
        "play_sound": "files/VO_GVG_087_Play_01.ogg",
        "attack_sound": "files/VO_GVG_087_Attack_02.ogg",
        "image": "files/GVG_087.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_087_premium.gif"
    },
    {
        "card_id": "UNG_810",
        "set": "UNGORO",
        "name": "Stegodon",
        "collectible": true,
        "flavor_text": "Level 40 Tortollan Paladins quest to tame a Stegodon.  There are no level 41 Tortollan Paladins.",
        "play_sound": "files/Stegodon_UNG_810_Play.ogg",
        "attack_sound": "files/Stegodon_UNG_810_Attack.ogg",
        "image": "files/UNG_810.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_810_premium.gif"
    },
    {
        "card_id": "OG_310",
        "set": "OG",
        "name": "Steward of Darkshire",
        "collectible": true,
        "flavor_text": "Turns out divine shields are way cheaper if you buy in bulk.",
        "play_sound": "files/VO_OG_310_Female_Human_Play_01.ogg",
        "attack_sound": "files/VO_OG_310_Female_Human_Attack_01.ogg",
        "image": "files/OG_310.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_310_premium.gif"
    },
    {
        "card_id": "ICC_415",
        "set": "ICECROWN",
        "name": "Stitched Tracker",
        "collectible": true,
        "flavor_text": "He's just exercising his right to bear arms.",
        "play_sound": "files/VO_ICC_415_Male_Orc_Play_01.ogg",
        "attack_sound": "files/VO_ICC_415_Male_Orc_Attack_01.ogg",
        "image": "files/ICC_415.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_415_premium.gif"
    },
    {
        "card_id": "UNG_211aa",
        "set": "UNGORO",
        "name": "Stone Elemental",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/StoneElemental_UNG_211aa_Play.ogg",
        "attack_sound": "files/StoneElemental_UNG_211aa_Attack.ogg",
        "image": "files/UNG_211aa.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_211aa_premium.gif"
    },
    {
        "card_id": "UNG_208",
        "set": "UNGORO",
        "name": "Stone Sentinel",
        "collectible": true,
        "flavor_text": "He and his friends just want to rock out.",
        "play_sound": "files/VO_UNG_208_Male_Tolvir_Play_02.ogg",
        "attack_sound": "files/VO_UNG_208_Male_Tolvir_Attack_03.ogg",
        "image": "files/UNG_208.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_208_premium.gif"
    },
    {
        "card_id": "CS2_051",
        "set": "BASIC",
        "name": "Stoneclaw Totem",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/CS2_051_Play_StoneclawTotem.ogg",
        "attack_sound": "files/SFX_CS2_051_Attack_00.ogg",
        "image": "files/CS2_051.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_051_premium.gif"
    },
    {
        "card_id": "FP1_027",
        "set": "NAXX",
        "name": "Stoneskin Gargoyle",
        "collectible": true,
        "flavor_text": "Stoneskin Gargoyles love freeze tag.",
        "play_sound": "files/SFX_FP1_027_EnterPlay.ogg",
        "attack_sound": "files/SFX_FP1_027_Attack.ogg",
        "image": "files/FP1_027.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_027_premium.gif"
    },
    {
        "card_id": "GVG_067",
        "set": "GVG",
        "name": "Stonesplinter Trogg",
        "collectible": true,
        "flavor_text": "The only thing worse than smelling troggs is listening to their poetry.",
        "play_sound": "files/VO_GVG_067_Play_01.ogg",
        "attack_sound": "files/VO_GVG_067_Attack_02.ogg",
        "image": "files/GVG_067.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_067_premium.gif"
    },
    {
        "card_id": "CS2_171",
        "set": "BASIC",
        "name": "Stonetusk Boar",
        "collectible": true,
        "flavor_text": "This card is boaring.",
        "play_sound": "files/SFX_CS2_171_EnterPlay.ogg",
        "attack_sound": "files/SFX_CS2_171_Attack.ogg",
        "image": "files/CS2_171.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_171_premium.gif"
    },
    {
        "card_id": "CS2_150",
        "set": "BASIC",
        "name": "Stormpike Commando",
        "collectible": true,
        "flavor_text": "The Stormpike Commandos are demolition experts.  They also bake a mean cupcake.",
        "play_sound": "files/VO_CS2_150_Play_01.ogg",
        "attack_sound": "files/VO_CS2_150_Attack_02.ogg",
        "image": "files/CS2_150.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_150_premium.gif"
    },
    {
        "card_id": "UNG_813",
        "set": "UNGORO",
        "name": "Stormwatcher",
        "collectible": true,
        "flavor_text": "Aspiring meteorologist!",
        "play_sound": "files/VO_UNG_813_Female_Elemental_Play_01.ogg",
        "attack_sound": "files/VO_UNG_813_Female_Elemental_Attack_01.ogg",
        "image": "files/UNG_813.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_813_premium.gif"
    },
    {
        "card_id": "CS2_222",
        "set": "BASIC",
        "name": "Stormwind Champion",
        "collectible": true,
        "flavor_text": "When Deathwing assaulted the capital, this soldier was the only member of his squad to survive. Now he's all bitter and stuff.",
        "play_sound": "files/VO_CS2_222_Play_01.ogg",
        "attack_sound": "files/VO_CS2_222_Attack_02.ogg",
        "image": "files/CS2_222.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_222_premium.gif"
    },
    {
        "card_id": "CS2_131",
        "set": "BASIC",
        "name": "Stormwind Knight",
        "collectible": true,
        "flavor_text": "They're still embarrassed about \"The Deathwing Incident\".",
        "play_sound": "files/VO_CS2_131_Play_01.ogg",
        "attack_sound": "files/VO_CS2_131_Attack_02.ogg",
        "image": "files/CS2_131.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_131_premium.gif"
    },
    {
        "card_id": "EX1_028",
        "set": "CLASSIC",
        "name": "Stranglethorn Tiger",
        "collectible": true,
        "flavor_text": "The wonderful thing about tigers is tigers are wonderful things!",
        "play_sound": "files/SFX_EX1_028_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_028_Attack.ogg",
        "image": "files/EX1_028.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_028_premium.gif"
    },
    {
        "card_id": "CFM_039",
        "set": "GANGS",
        "name": "Street Trickster",
        "collectible": true,
        "flavor_text": "His first trick: making your wallet disappear!",
        "play_sound": "files/VO_CFM_039_Male_Imp_Play_01.ogg",
        "attack_sound": "files/VO_CFM_039_Male_Imp_Attack_01.ogg",
        "image": "files/CFM_039.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_039_premium.gif"
    },
    {
        "card_id": "CFM_656",
        "set": "GANGS",
        "name": "Streetwise Investigator",
        "collectible": true,
        "flavor_text": "\"Hmmmm…  Call it a hunch, but I'm starting to think that there may be some kind of criminal activity going on in Gadgetzan.\"",
        "play_sound": "files/VO_CFM_656_Male_NightElf_Play_01.ogg",
        "attack_sound": "files/VO_CFM_656_Male_NightElf_Attack_01.ogg",
        "image": "files/CFM_656.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_656_premium.gif"
    },
    {
        "card_id": "ICC_807",
        "set": "ICECROWN",
        "name": "Strongshell Scavenger",
        "collectible": true,
        "flavor_text": "It isn't \"grave robbing\" when there's no grave. It's just scavenging…",
        "play_sound": "files/VO_ICC_807_Male_GiantBeetle_Play_02.ogg",
        "attack_sound": "files/VO_ICC_807_Male_GiantBeetle_Attack_01.ogg",
        "image": "files/ICC_807.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_807_premium.gif"
    },
    {
        "card_id": "UNG_808",
        "set": "UNGORO",
        "name": "Stubborn Gastropod",
        "collectible": true,
        "flavor_text": "Stubbornly pursuing its dream to become Azeroth's fastest animal!",
        "play_sound": "files/StubbornGastropod_UNG_808_Play.ogg",
        "attack_sound": "files/StubbornGastropod_UNG_808_Attack.ogg",
        "image": "files/UNG_808.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_808_premium.gif"
    },
    {
        "card_id": "EX1_306",
        "set": "BASIC",
        "name": "Succubus",
        "collectible": true,
        "flavor_text": "Warlocks have it pretty good.",
        "play_sound": "files/VO_EX1_306_Play_01.ogg",
        "attack_sound": "files/VO_EX1_306_Attack_02.ogg",
        "image": "files/EX1_306.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_306_premium.gif"
    },
    {
        "card_id": "EX1_315",
        "set": "CLASSIC",
        "name": "Summoning Portal",
        "collectible": true,
        "flavor_text": "NOT LESS THAN 1!  Don't get any ideas!",
        "play_sound": "files/SFX_EX1_315_EnterPlay_00.ogg",
        "attack_sound": "files/SFX_EX1_315_Attack_00.ogg",
        "image": "files/EX1_315.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_315_premium.gif"
    },
    {
        "card_id": "LOE_086",
        "set": "LOE",
        "name": "Summoning Stone",
        "collectible": true,
        "flavor_text": "Sometimes it feels like it's always the same slackers that are waiting for a summon.",
        "play_sound": "files/LOE_086_SummoningStone_Play.ogg",
        "attack_sound": "files/LOE_086_SummoningStone_Attack.ogg",
        "image": "files/LOE_086.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_086_premium.gif"
    },
    {
        "card_id": "ICC_028",
        "set": "ICECROWN",
        "name": "Sunborne Val'kyr",
        "collectible": true,
        "flavor_text": "Bring valor to Odyn's halls, Champion!",
        "play_sound": "files/VO_ICC_028_Female_ValKyr_Play_01.ogg",
        "attack_sound": "files/VO_ICC_028_Female_ValKyr_Attack_01.ogg",
        "image": "files/ICC_028.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_028_premium.gif"
    },
    {
        "card_id": "EX1_058",
        "set": "CLASSIC",
        "name": "Sunfury Protector",
        "collectible": true,
        "flavor_text": "She carries a shield, but only so she can give it to someone she can stand behind.",
        "play_sound": "files/VO_EX1_058_Play_01.ogg",
        "attack_sound": "files/VO_EX1_058_Attack_02.ogg",
        "image": "files/EX1_058.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_058_premium.gif"
    },
    {
        "card_id": "UNG_015",
        "set": "UNGORO",
        "name": "Sunkeeper Tarim",
        "collectible": true,
        "flavor_text": "Ironically, his favorite number is 4.",
        "play_sound": "files/VO_UNG_015_Male_Tolvir_Play_01.ogg",
        "attack_sound": "files/VO_UNG_015_Male_Tolvir_Attack_01.ogg",
        "image": "files/UNG_015.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_015_premium.gif"
    },
    {
        "card_id": "EX1_032",
        "set": "CLASSIC",
        "name": "Sunwalker",
        "collectible": true,
        "flavor_text": "She doesn’t ACTUALLY walk on the Sun.  It's just a name.  Don’t worry!",
        "play_sound": "files/VO_EX1_032_Play_01.ogg",
        "attack_sound": "files/VO_EX1_032_Attack_02.ogg",
        "image": "files/EX1_032.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_032_premium.gif"
    },
    {
        "card_id": "UNG_919",
        "set": "UNGORO",
        "name": "Swamp King Dred",
        "collectible": true,
        "flavor_text": "Swamp King Dred, more like Swamp King Dead, amiright?",
        "play_sound": "files/UNG_919_SwampKingDred_Play.ogg",
        "attack_sound": "files/UNG_919_SwampKingDred_Attack.ogg",
        "image": "files/UNG_919.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_919_premium.gif"
    },
    {
        "card_id": "EX1_016",
        "set": "HOF",
        "name": "Sylvanas Windrunner",
        "collectible": true,
        "flavor_text": "Sylvanas was turned into the Banshee Queen by Arthas, but he probably should have just killed her because it just pissed her off.",
        "play_sound": "files/VO_Sylvanas_01_Play_01.ogg",
        "attack_sound": "files/VO_Sylvanas_02_Attack_02.ogg",
        "image": "files/EX1_016.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_016_premium.gif"
    },
    {
        "card_id": "CFM_809",
        "set": "GANGS",
        "name": "Tanaris Hogchopper",
        "collectible": true,
        "flavor_text": "The Hogchoppers are well-known throughout Kalimdor for being a real, actual group.",
        "play_sound": "files/VO_CFM_809_Male_Quilboar_Play_01.ogg",
        "attack_sound": "files/VO_CFM_809_Male_Quilboar_Attack_01.ogg",
        "image": "files/CFM_809.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_809_premium.gif"
    },
    {
        "card_id": "UNG_928",
        "set": "UNGORO",
        "name": "Tar Creeper",
        "collectible": true,
        "flavor_text": "If you won't come to the tar pits, we'll bring them to you!",
        "play_sound": "files/VO_UNG_928_Male_Tortollan_Play_01.ogg",
        "attack_sound": "files/VO_UNG_928_Male_Tortollan_Attack_01.ogg",
        "image": "files/UNG_928.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_928_premium.gif"
    },
    {
        "card_id": "UNG_838",
        "set": "UNGORO",
        "name": "Tar Lord",
        "collectible": true,
        "flavor_text": "Tar Lord, man... legendary monster? Aw, forget it.",
        "play_sound": "files/TarLord_UNG_838_Play.ogg",
        "attack_sound": "files/TarLord_UNG_838_Attack.ogg",
        "image": "files/UNG_838.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_838_premium.gif"
    },
    {
        "card_id": "UNG_049",
        "set": "UNGORO",
        "name": "Tar Lurker",
        "collectible": true,
        "flavor_text": "Hi, Tar here. Long time lurking, first time taunting…",
        "play_sound": "files/TarLurker_UNG_049_Play.ogg",
        "attack_sound": "files/TarLurker_UNG_049_Attack.ogg",
        "image": "files/UNG_049.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_049_premium.gif"
    },
    {
        "card_id": "GVG_093",
        "set": "GVG",
        "name": "Target Dummy",
        "collectible": true,
        "flavor_text": "The engineering equivalent of a \"Kick Me\" sticker.",
        "play_sound": "files/GVG_093_TargetDummy_EnterPlay.ogg",
        "attack_sound": "files/GVG_093_TargetDummy_Attack.ogg",
        "image": "files/GVG_093.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_093_premium.gif"
    },
    {
        "card_id": "EX1_390",
        "set": "CLASSIC",
        "name": "Tauren Warrior",
        "collectible": true,
        "flavor_text": "Tauren Warrior: Champion of Mulgore, Slayer of Quilboar, Rider of Thunderbluff Elevators.",
        "play_sound": "files/VO_EX1_390_Play_01.ogg",
        "attack_sound": "files/VO_EX1_390_Attack_02.ogg",
        "image": "files/EX1_390.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_390_premium.gif"
    },
    {
        "card_id": "KAR_025c",
        "set": "KARA",
        "name": "Teapot",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/KAR_025c_Teapot_Play_01.ogg",
        "attack_sound": "files/KAR_025c_Teapot_Attack_01.ogg",
        "image": "files/KAR_025c.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_025c_premium.gif"
    },
    {
        "card_id": "EX1_623",
        "set": "CLASSIC",
        "name": "Temple Enforcer",
        "collectible": true,
        "flavor_text": "He also moonlights Thursday nights as a bouncer at the Pig and Whistle Tavern.",
        "play_sound": "files/EX1_623_Temple_Enforcer_EnterPlay_1.ogg",
        "attack_sound": "files/EX1_623_Temple_Enforcer_Attack_2.ogg",
        "image": "files/EX1_623.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_623_premium.gif"
    },
    {
        "card_id": "OG_151",
        "set": "OG",
        "name": "Tentacle of N'Zoth",
        "collectible": true,
        "flavor_text": "Because EVERYDAY is the Day of the Tentacle of N'zoth.",
        "play_sound": "files/TentacleOfNZoth_OG_151_Play.ogg",
        "attack_sound": "files/TentacleOfNZoth_OG_151_Attack.ogg",
        "image": "files/OG_151.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_151_premium.gif"
    },
    {
        "card_id": "ICCA01_008",
        "set": "ICECROWN",
        "name": "Terrible Tank",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_ICCA01_008_Male_Orc_Play_01.ogg",
        "attack_sound": "files/VO_ICCA01_008_Male_Orc_Attack_01.ogg",
        "image": "files/ICCA01_008.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/ICCA01_008.png"
    },
    {
        "card_id": "FP1_014t",
        "set": "NAXX",
        "name": "Thaddius",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_FP1_014t_EnterPlay_01.ogg",
        "attack_sound": "files/VO_NAX13_01_HP_Attack_02.ogg",
        "image": "files/FP1_014t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_014t_premium.gif"
    },
    {
        "card_id": "NAX9_03",
        "set": "NAXX",
        "name": "Thane Korth'azz",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_NAX9_03_Attack_02.ogg",
        "attack_sound": "files/VO_NAX9_03_Attack_02.ogg",
        "image": "files/NAX9_03.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX9_03.png"
    },
    {
        "card_id": "OG_173a",
        "set": "OG",
        "name": "The Ancient One",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_OG_173a_Androgynous _Monster_Play_01.ogg",
        "attack_sound": "files/VO_OG_173a_Androgynous _Monster_Attack_01.ogg",
        "image": "files/OG_173a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_173a_premium.gif"
    },
    {
        "card_id": "EX1_577",
        "set": "CLASSIC",
        "name": "The Beast",
        "collectible": true,
        "flavor_text": "He lives in Blackrock Mountain.  He eats Gnomes.  That's pretty much it.",
        "play_sound": "files/EX1_577_The_Beast_EnterPlay1.ogg",
        "attack_sound": "files/EX1_577_The_Beast_Attack2.ogg",
        "image": "files/EX1_577.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_577_premium.gif"
    },
    {
        "card_id": "EX1_002",
        "set": "CLASSIC",
        "name": "The Black Knight",
        "collectible": true,
        "flavor_text": "He was sent by the Lich King to disrupt the Argent Tournament.   We can pretty much mark that a failure.",
        "play_sound": "files/VO_EX1_002_Play_01.ogg",
        "attack_sound": "files/VO_EX1_002_Attack_02.ogg",
        "image": "files/EX1_002.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_002_premium.gif"
    },
    {
        "card_id": "OG_300",
        "set": "OG",
        "name": "The Boogeymonster",
        "collectible": true,
        "flavor_text": "Has 20 years of training in classical ballet, but ALLLLLL he ever gets asked to do is boogie.",
        "play_sound": "files/VO_OG_300_Male_Monster_Play_01.ogg",
        "attack_sound": "files/VO_OG_300_Male_Monster_Attack_01.ogg",
        "image": "files/OG_300.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_300_premium.gif"
    },
    {
        "card_id": "KAR_061",
        "set": "KARA",
        "name": "The Curator",
        "collectible": true,
        "flavor_text": "The Curator guards Azeroth’s deadliest creatures, but it’s secretly terrified of squirrels.",
        "play_sound": "files/VO_KAR_061_Male_ArcaneGolem_Play_01.ogg",
        "attack_sound": "files/VO_KAR_061_Male_ArcaneGolem_Attack_01.ogg",
        "image": "files/KAR_061.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_061_premium.gif"
    },
    {
        "card_id": "AT_054",
        "set": "TGT",
        "name": "The Mistcaller",
        "collectible": true,
        "flavor_text": "Calling the mist doesn't sound all that great.  \"Ooooh, it is slightly damp now!\"",
        "play_sound": "files/VO_AT_054_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_054_ATTACK_02.ogg",
        "image": "files/AT_054.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_054_premium.gif"
    },
    {
        "card_id": "AT_128",
        "set": "TGT",
        "name": "The Skeleton Knight",
        "collectible": true,
        "flavor_text": "Apparently it really was just a flesh wound.",
        "play_sound": "files/VO_AT_128_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_128_ATTACK_02.ogg",
        "image": "files/AT_128.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_128_premium.gif"
    },
    {
        "card_id": "CFM_324t",
        "set": "GANGS",
        "name": "The Storm Guardian",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_CFM_324t_Male_Pandaren_Play_01.ogg",
        "attack_sound": "files/VO_CFM_324t_Male_Pandaren_Attack_02.ogg",
        "image": "files/CFM_324t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_324t_premium.gif"
    },
    {
        "card_id": "UNG_843",
        "set": "UNGORO",
        "name": "The Voraxx",
        "collectible": true,
        "flavor_text": "I am the Voraxx.  I speak for the weeds.",
        "play_sound": "files/UNG_843_Phytos_Play.ogg",
        "attack_sound": "files/UNG_843_Phytos_Attack.ogg",
        "image": "files/UNG_843.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_843_premium.gif"
    },
    {
        "card_id": "OG_028",
        "set": "OG",
        "name": "Thing from Below",
        "collectible": true,
        "flavor_text": "Just can't resist the opportunity to hang around with a bunch of totems.",
        "play_sound": "files/ThingFromBelow_OG_028_Play.ogg",
        "attack_sound": "files/ThingFromBelow_OG_028_Attack.ogg",
        "image": "files/OG_028.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_028_premium.gif"
    },
    {
        "card_id": "ICC_829t3",
        "set": "ICECROWN",
        "name": "Thoras Trollbane",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_ICC_829t3_Male_Human_Play_01.ogg",
        "attack_sound": "files/VO_ICC_829t3_Male_Human_Attack_01.ogg",
        "image": "files/ICC_829t3.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_829t3_premium.gif"
    },
    {
        "card_id": "EX1_021",
        "set": "CLASSIC",
        "name": "Thrallmar Farseer",
        "collectible": true,
        "flavor_text": "He's stationed in the Hellfire Peninsula, but he's hoping for a reassignment closer to Orgrimmar, or really anywhere the ground is less on fire.",
        "play_sound": "files/VO_EX1_021_Play_01.ogg",
        "attack_sound": "files/VO_EX1_021_Attack_02.ogg",
        "image": "files/EX1_021.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_021_premium.gif"
    },
    {
        "card_id": "AT_049",
        "set": "TGT",
        "name": "Thunder Bluff Valiant",
        "collectible": true,
        "flavor_text": "Allowing totems to attack is not cheating.  I mean, there isn't anything in the rule books about it.",
        "play_sound": "files/VO_AT_049_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_049_ATTACK_02.ogg",
        "image": "files/AT_049.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_049_premium.gif"
    },
    {
        "card_id": "UNG_082",
        "set": "UNGORO",
        "name": "Thunder Lizard",
        "collectible": true,
        "flavor_text": "What? THUNDER LIZARD is adapting!",
        "play_sound": "files/UNG_082_ThunderLizard_Play.ogg",
        "attack_sound": "files/UNG_082_ThunderLizard_Attack.ogg",
        "image": "files/UNG_082.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_082_premium.gif"
    },
    {
        "card_id": "ICC_099",
        "set": "ICECROWN",
        "name": "Ticking Abomination",
        "collectible": true,
        "flavor_text": "Abomination. Emphasis on the second syllable.",
        "play_sound": "files/VO_ICC_099_Male_Abomination_Play_02.ogg",
        "attack_sound": "files/VO_ICC_099_Male_Abomination_Attack_02.ogg",
        "image": "files/ICC_099.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_099_premium.gif"
    },
    {
        "card_id": "DS1_175",
        "set": "BASIC",
        "name": "Timber Wolf",
        "collectible": true,
        "flavor_text": "Other beasts totally dig hanging out with timber wolves.",
        "play_sound": "files/SFX_DS1_175_EnterPlay.ogg",
        "attack_sound": "files/SFX_DS1_175_Attack.ogg",
        "image": "files/DS1_175.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/DS1_175_premium.gif"
    },
    {
        "card_id": "GVG_102",
        "set": "GVG",
        "name": "Tinkertown Technician",
        "collectible": true,
        "flavor_text": "Won't you take me to... Tinkertown?",
        "play_sound": "files/VO_GVG_102_Play_01.ogg",
        "attack_sound": "files/VO_GVG_102_Attack_02.ogg",
        "image": "files/GVG_102.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_102_premium.gif"
    },
    {
        "card_id": "EX1_083",
        "set": "CLASSIC",
        "name": "Tinkmaster Overspark",
        "collectible": true,
        "flavor_text": "Tinkmaster Overspark nearly lost his Tinker's license after the Great Ironforge Squirrel Stampede of '09.",
        "play_sound": "files/VO_EX1_083_Play_01.ogg",
        "attack_sound": "files/VO_EX1_083_Attack_02.ogg",
        "image": "files/EX1_083.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_083_premium.gif"
    },
    {
        "card_id": "AT_021",
        "set": "TGT",
        "name": "Tiny Knight of Evil",
        "collectible": true,
        "flavor_text": "\"No, no, no. I asked for a tiny JESTER of evil.\"",
        "play_sound": "files/VO_AT_021_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_021_ATTACK_02.ogg",
        "image": "files/AT_021.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_021_premium.gif"
    },
    {
        "card_id": "EX1_383",
        "set": "CLASSIC",
        "name": "Tirion Fordring",
        "collectible": true,
        "flavor_text": "If you haven't heard the Tirion Fordring theme song, it's because it doesn't exist.",
        "play_sound": "files/VO_EX1_383_Play_01.ogg",
        "attack_sound": "files/VO_EX1_383_Attack_02.ogg",
        "image": "files/EX1_383.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_383_premium.gif"
    },
    {
        "card_id": "LOEA01_12",
        "set": "LOE",
        "name": "Tol'vir Hoplite",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_LOEA01_12_Play_01.ogg",
        "attack_sound": "files/VO_LOEA01_12_Attack_02.ogg",
        "image": "files/LOEA01_12.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/LOEA01_12.png"
    },
    {
        "card_id": "UNG_070",
        "set": "UNGORO",
        "name": "Tol'vir Stoneshaper",
        "collectible": true,
        "flavor_text": "He spends a lot of time keeping himself in stoneshape.",
        "play_sound": "files/VO_UNG_070_Male_Elemental_Play_01.ogg",
        "attack_sound": "files/VO_UNG_070_Male_Elemental_Attack_01.ogg",
        "image": "files/UNG_070.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_070_premium.gif"
    },
    {
        "card_id": "UNG_913",
        "set": "UNGORO",
        "name": "Tol'vir Warden",
        "collectible": true,
        "flavor_text": "Ferocious in combat… and even more terrifying in pet battles.",
        "play_sound": "files/VO_UNG_913_Male_Tolvir_Play_01.ogg",
        "attack_sound": "files/VO_UNG_913_Male_Tolvir_Attack_02.ogg",
        "image": "files/UNG_913.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_913_premium.gif"
    },
    {
        "card_id": "ICC_098",
        "set": "ICECROWN",
        "name": "Tomb Lurker",
        "collectible": true,
        "flavor_text": "She hangs out in all the tombs, but she rarely posts.",
        "play_sound": "files/VO_ICC_098_Female_Geist_Play_01.ogg",
        "attack_sound": "files/VO_ICC_098_Female_Geist_Attack_01.ogg",
        "image": "files/ICC_098.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_098_premium.gif"
    },
    {
        "card_id": "LOE_012",
        "set": "LOE",
        "name": "Tomb Pillager",
        "collectible": true,
        "flavor_text": "After the guild broke up, he could no longer raid the tombs.",
        "play_sound": "files/VO_LOE_012_Play_01.ogg",
        "attack_sound": "files/VO_LOE_012_Attack_02.ogg",
        "image": "files/LOE_012.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_012_premium.gif"
    },
    {
        "card_id": "LOE_047",
        "set": "LOE",
        "name": "Tomb Spider",
        "collectible": true,
        "flavor_text": "Less serious than its cousin, the Grave Spider.",
        "play_sound": "files/SFX_LOE_047_Play.ogg",
        "attack_sound": "files/SFX_LOE_047_Attack.ogg",
        "image": "files/LOE_047.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_047_premium.gif"
    },
    {
        "card_id": "UNG_078",
        "set": "UNGORO",
        "name": "Tortollan Forager",
        "collectible": true,
        "flavor_text": "In the Tortollan tongue, Un’goro is known as the “Land of the Lost and Found.”",
        "play_sound": "files/VO_UNG_078_Female_Tortollan_Play_01.ogg",
        "attack_sound": "files/VO_UNG_078_Female_Tortollan_Attack_01.ogg",
        "image": "files/UNG_078.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_078_premium.gif"
    },
    {
        "card_id": "UNG_088",
        "set": "UNGORO",
        "name": "Tortollan Primalist",
        "collectible": true,
        "flavor_text": "I see pizza in my future.",
        "play_sound": "files/VO_UNG_088_Female_Tortollan_Play_01.ogg",
        "attack_sound": "files/VO_UNG_088_Female_Tortollan_Attack_01.ogg",
        "image": "files/UNG_088.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_088_premium.gif"
    },
    {
        "card_id": "UNG_037",
        "set": "UNGORO",
        "name": "Tortollan Shellraiser",
        "collectible": true,
        "flavor_text": "A hero... In a half-shell.",
        "play_sound": "files/VO_UNG_037_Female_Tortollan_Play_01.ogg",
        "attack_sound": "files/VO_UNG_037_Female_Tortollan_Attack_01.ogg",
        "image": "files/UNG_037.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_037_premium.gif"
    },
    {
        "card_id": "GVG_115",
        "set": "GVG",
        "name": "Toshley",
        "collectible": true,
        "flavor_text": "Something about power converters.",
        "play_sound": "files/VO_GVG_115_Play_01.ogg",
        "attack_sound": "files/VO_GVG_115_Attack_02.ogg",
        "image": "files/GVG_115.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_115_premium.gif"
    },
    {
        "card_id": "AT_052",
        "set": "TGT",
        "name": "Totem Golem",
        "collectible": true,
        "flavor_text": "What happens when you glue a buncha totems together.",
        "play_sound": "files/SFX_AT_052_Play.ogg",
        "attack_sound": "files/SFX_AT_052_Attack.ogg",
        "image": "files/AT_052.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_052_premium.gif"
    },
    {
        "card_id": "AT_097",
        "set": "TGT",
        "name": "Tournament Attendee",
        "collectible": true,
        "flavor_text": "He was so excited to get season tickets to this year's Grand Tournament.  He normally doesn't get them at first and has to buy them from Ogre scalpers.",
        "play_sound": "files/VO_AT_097_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_097_ATTACK_03.ogg",
        "image": "files/AT_097.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_097_premium.gif"
    },
    {
        "card_id": "AT_091",
        "set": "TGT",
        "name": "Tournament Medic",
        "collectible": true,
        "flavor_text": "The medic tournament is less entertaining than the Grand Tournament.",
        "play_sound": "files/VO_AT_091_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_091_ATTACK_02.ogg",
        "image": "files/AT_091.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_091_premium.gif"
    },
    {
        "card_id": "CFM_655",
        "set": "GANGS",
        "name": "Toxic Sewer Ooze",
        "collectible": true,
        "flavor_text": "When Sergeant Sally shows up unexpectedly, DO NOT FLUSH YOUR MANA CRYSTALS DOWN THE TOILET.",
        "play_sound": "files/ToxicSewerOoze_CFM_655_Play.ogg",
        "attack_sound": "files/ToxicSewerOoze_CFM_655_Attack.ogg",
        "image": "files/CFM_655.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_655_premium.gif"
    },
    {
        "card_id": "BRMA14_5",
        "set": "BRM",
        "name": "Toxitron",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_BRMA14_5_Play_01.ogg",
        "attack_sound": "files/VO_BRMA14_5_Attack_02.ogg",
        "image": "files/BRMA14_5.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA14_5.png"
    },
    {
        "card_id": "GVG_028",
        "set": "GVG",
        "name": "Trade Prince Gallywix",
        "collectible": true,
        "flavor_text": "Gallywix believes in supply and demand. He supplies the beatings and demands you pay up!",
        "play_sound": "files/VO_GVG_028_Play_01.ogg",
        "attack_sound": "files/VO_GVG_028_Attack_02.ogg",
        "image": "files/GVG_028.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_028_premium.gif"
    },
    {
        "card_id": "ICCA08_033",
        "set": "ICECROWN",
        "name": "Trapped Soul",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_ICCA08_033_Male_HumanGhost_Attack_01.ogg",
        "attack_sound": "files/VO_ICCA08_033_Male_HumanGhost_Attack_01.ogg",
        "image": "files/ICCA08_033.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/ICCA08_033.png"
    },
    {
        "card_id": "EX1_158t",
        "set": "CLASSIC",
        "name": "Treant",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/EX1_158t Treant_EnterPlay1.ogg",
        "attack_sound": "files/EX1_158t Treant_Attack2.ogg",
        "image": "files/EX1_158t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_158t_premium.gif"
    },
    {
        "card_id": "EX1_573t",
        "set": "CLASSIC",
        "name": "Treant2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/EX1_573t Treant_Attack2.ogg",
        "attack_sound": "files/EX1_573t Treant_Attack2.ogg",
        "image": "files/EX1_573t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_573t_premium.gif"
    },
    {
        "card_id": "EX1_tk9",
        "set": "CLASSIC",
        "name": "Treant3",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/EX1_tk9_Treant_EnterPlay1.ogg",
        "attack_sound": "files/EX1_tk9_Treant_Attack2.ogg",
        "image": "files/EX1_tk9.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_tk9_premium.gif"
    },
    {
        "card_id": "FP1_019t",
        "set": "NAXX",
        "name": "Treant4",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/EX1_573t Treant_Attack2.ogg",
        "attack_sound": "files/EX1_573t Treant_Attack2.ogg",
        "image": "files/FP1_019t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_019t_premium.gif"
    },
    {
        "card_id": "CFM_338",
        "set": "GANGS",
        "name": "Trogg Beastrager",
        "collectible": true,
        "flavor_text": "Still angry that the Gadgetzan Rager Club wouldn't accept him as a member.",
        "play_sound": "files/VO_CFM_338_Male_Trogg_Play_01.ogg",
        "attack_sound": "files/VO_CFM_338_Male_Trogg_Attack_01.ogg",
        "image": "files/CFM_338.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_338_premium.gif"
    },
    {
        "card_id": "GVG_118",
        "set": "GVG",
        "name": "Troggzor the Earthinator",
        "collectible": true,
        "flavor_text": "He keeps earthinating the countryside despite attempts to stop him.",
        "play_sound": "files/VO_GVG_118_Play_01.ogg",
        "attack_sound": "files/VO_GVG_118_Attack_02.ogg",
        "image": "files/GVG_118.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_118_premium.gif"
    },
    {
        "card_id": "DS1_178",
        "set": "BASIC",
        "name": "Tundra Rhino",
        "collectible": true,
        "flavor_text": "Tundra rhinos are often mistaken for kodos.  Or am I mistaken?",
        "play_sound": "files/SFX_DS1_178_EnterPlay.ogg",
        "attack_sound": "files/SFX_DS1_178_Attack.ogg",
        "image": "files/DS1_178.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/DS1_178_premium.gif"
    },
    {
        "card_id": "LOE_018",
        "set": "LOE",
        "name": "Tunnel Trogg",
        "collectible": true,
        "flavor_text": "Sure, they're ugly, but they live in tunnels.  You try your beauty routine without natural light.",
        "play_sound": "files/VO_LOE_018_Play_01.ogg",
        "attack_sound": "files/VO_LOE_018_Attack_02.ogg",
        "image": "files/LOE_018.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_018_premium.gif"
    },
    {
        "card_id": "ICC_093",
        "set": "ICECROWN",
        "name": "Tuskarr Fisherman",
        "collectible": true,
        "flavor_text": "If you bring him 500 fish, he'll give you this sweet Kalu'ak Fishing Pole.",
        "play_sound": "files/VO_ICC_093_Male_Tuskar_Play_01.ogg",
        "attack_sound": "files/VO_ICC_093_Male_Tuskar_Attack_01.ogg",
        "image": "files/ICC_093.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_093_premium.gif"
    },
    {
        "card_id": "AT_104",
        "set": "TGT",
        "name": "Tuskarr Jouster",
        "collectible": true,
        "flavor_text": "Just could not be talked out of using his turtle for the joust...",
        "play_sound": "files/VO_AT_104_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_104_ATTACK_02.ogg",
        "image": "files/AT_104.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_104_premium.gif"
    },
    {
        "card_id": "AT_046",
        "set": "TGT",
        "name": "Tuskarr Totemic",
        "collectible": true,
        "flavor_text": "Turns out the tuskarr aren't real choosy about their totems.",
        "play_sound": "files/VO_AT_046_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_046_ATTACK_02.ogg",
        "image": "files/AT_046.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_046_premium.gif"
    },
    {
        "card_id": "OG_096",
        "set": "OG",
        "name": "Twilight Darkmender",
        "collectible": true,
        "flavor_text": "First she separates them from the lights, washes them in cold water, and hang-dries.",
        "play_sound": "files/VO_OG_096_Female_Night Elf_Play_01.ogg",
        "attack_sound": "files/VO_OG_096_Female_Night Elf_Attack_01.ogg",
        "image": "files/OG_096.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_096_premium.gif"
    },
    {
        "card_id": "EX1_043",
        "set": "CLASSIC",
        "name": "Twilight Drake",
        "collectible": true,
        "flavor_text": "Twilight drakes feed on Mystical Energy.  And Tacos.",
        "play_sound": "files/WoW_EX1_043_TwilightDrake_EnterPlay.ogg",
        "attack_sound": "files/WoW_EX1_043_TwilightDrake_Attack.ogg",
        "image": "files/EX1_043.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_043_premium.gif"
    },
    {
        "card_id": "OG_286",
        "set": "OG",
        "name": "Twilight Elder",
        "collectible": true,
        "flavor_text": "Just doesn't understand those Twilight Youngsters any more - with their comic books and their rock music.",
        "play_sound": "files/VO_OG_286_Male_Gnome_Play_01.ogg",
        "attack_sound": "files/VO_OG_286_Male_Gnome_Attack_01.ogg",
        "image": "files/OG_286.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_286_premium.gif"
    },
    {
        "card_id": "OG_031a",
        "set": "OG",
        "name": "Twilight Elemental",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/TwilightElemental_OG_031a_Play.ogg",
        "attack_sound": "files/TwilightElemental_OG_031a_Attack.ogg",
        "image": "files/OG_031a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_031a_premium.gif"
    },
    {
        "card_id": "OG_083",
        "set": "OG",
        "name": "Twilight Flamecaller",
        "collectible": true,
        "flavor_text": "Make sure you summon a Twilight Marshmallowcaller too! Mmmm Mmm Mmm!!",
        "play_sound": "files/VO_OG_083_Male_Human_Play_01.ogg",
        "attack_sound": "files/VO_OG_083_Male_Human_Attack_01.ogg",
        "image": "files/OG_083.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_083_premium.gif"
    },
    {
        "card_id": "OG_284",
        "set": "OG",
        "name": "Twilight Geomancer",
        "collectible": true,
        "flavor_text": "\"Ok C'Thun, repeat after me: 'Your mother was a hamster.'\"",
        "play_sound": "files/VO_OG_284_Female_Orc_Play_01.ogg",
        "attack_sound": "files/VO_OG_284_Female_Orc_Attack_01.ogg",
        "image": "files/OG_284.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_284_premium.gif"
    },
    {
        "card_id": "AT_017",
        "set": "TGT",
        "name": "Twilight Guardian",
        "collectible": true,
        "flavor_text": "A result of magical experiments carried out by the Black Dragonflight, it's not his fault that he's a vicious killer.",
        "play_sound": "files/AT_017_TwilightGuardian_Play_1.ogg",
        "attack_sound": "files/AT_017_TwilightGuardian_Attack_1.ogg",
        "image": "files/AT_017.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_017_premium.gif"
    },
    {
        "card_id": "OG_272",
        "set": "OG",
        "name": "Twilight Summoner",
        "collectible": true,
        "flavor_text": "If you strike him down, he shall become more powerful than you can possibly imagine.",
        "play_sound": "files/VO_OG_272_Male_Troll_Play_01.ogg",
        "attack_sound": "files/VO_OG_272_Male_Troll_Attack_01.ogg",
        "image": "files/OG_272.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_272_premium.gif"
    },
    {
        "card_id": "BRM_004",
        "set": "BRM",
        "name": "Twilight Whelp",
        "collectible": true,
        "flavor_text": "The twilight whelps are basically magic-vampires. Despite this, they are not a reference to any popular series of novels.",
        "play_sound": "files/SFX_BRM_004_Twilight_Whelp_EnterPlay.ogg",
        "attack_sound": "files/SFX_BRM_004_Twilight_Whelp_Attack.ogg",
        "image": "files/BRM_004.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_004_premium.gif"
    },
    {
        "card_id": "OG_131",
        "set": "OG",
        "name": "Twin Emperor Vek'lor",
        "collectible": true,
        "flavor_text": "Do they make decisions based on age? \"I'm two minutes older therefore we burn this village.\"",
        "play_sound": "files/VO_OG_131_Male_Qiraji_Play_01.ogg",
        "attack_sound": "files/VO_OG_131_Male_Qiraji_Attack_01.ogg",
        "image": "files/OG_131.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_131_premium.gif"
    },
    {
        "card_id": "OG_319",
        "set": "OG",
        "name": "Twin Emperor Vek'nilash",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_OG_319_Male_Giant_Play_01.ogg",
        "attack_sound": "files/VO_OG_319_Male_Giant_Attack_01.ogg",
        "image": "files/OG_319.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_319_premium.gif"
    },
    {
        "card_id": "OG_247",
        "set": "OG",
        "name": "Twisted Worgen",
        "collectible": true,
        "flavor_text": "Sometimes the Old Gods' corruptions gives you power untold, sometimes you get +1 Attack. We can’t all be winners in the Eldritch lottery.",
        "play_sound": "files/VO_OG_247_Male_Worgen_Play_01.ogg",
        "attack_sound": "files/VO_OG_247_Male_Worgen_Attack_01.ogg",
        "image": "files/OG_247.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_247_premium.gif"
    },
    {
        "card_id": "UNG_852",
        "set": "UNGORO",
        "name": "Tyrantus",
        "collectible": true,
        "flavor_text": "Millennia of evolutionary pressures turned his species into the Faerie Dragons we know today.",
        "play_sound": "files/Tyrantus_UNG_852_Play.ogg",
        "attack_sound": "files/Tyrantus_UNG_852_Attack.ogg",
        "image": "files/UNG_852.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_852_premium.gif"
    },
    {
        "card_id": "UNG_806",
        "set": "UNGORO",
        "name": "Ultrasaur",
        "collectible": true,
        "flavor_text": "Evolved the really long neck to spy on its neighbors.",
        "play_sound": "files/UNG_806_Ultrasaur_Play.ogg",
        "attack_sound": "files/UNG_806_Ultrasaur_Attack.ogg",
        "image": "files/UNG_806.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_806_premium.gif"
    },
    {
        "card_id": "EX1_258",
        "set": "CLASSIC",
        "name": "Unbound Elemental",
        "collectible": true,
        "flavor_text": "Unlike bound elementals, Unbound ones really enjoy a night on the town.",
        "play_sound": "files/EX1_258_Unbound_Elemental_EnterPlay1.ogg",
        "attack_sound": "files/EX1_258_Unbound_Elemental_Attack3.ogg",
        "image": "files/EX1_258.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_258_premium.gif"
    },
    {
        "card_id": "OG_330",
        "set": "OG",
        "name": "Undercity Huckster",
        "collectible": true,
        "flavor_text": "Psst! Wanna buy a random class card (from your opponent's class)?",
        "play_sound": "files/VO_OG_330_Male_Undead_Play_01.ogg",
        "attack_sound": "files/VO_OG_330_Male_Undead_Attack_01.ogg",
        "image": "files/OG_330.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_330_premium.gif"
    },
    {
        "card_id": "AT_030",
        "set": "TGT",
        "name": "Undercity Valiant",
        "collectible": true,
        "flavor_text": "Almost went to play for Stormwind before signing with Undercity.",
        "play_sound": "files/VO_AT_030_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_030_ATTACK_02.ogg",
        "image": "files/AT_030.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_030_premium.gif"
    },
    {
        "card_id": "NAX7_02",
        "set": "NAXX",
        "name": "Understudy",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_NAX7_02_Attack_01.ogg",
        "attack_sound": "files/VO_NAX7_02_Attack_01.ogg",
        "image": "files/NAX7_02.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX7_02.png"
    },
    {
        "card_id": "FP1_028",
        "set": "NAXX",
        "name": "Undertaker",
        "collectible": true,
        "flavor_text": "In a world where you can run to a spirit healer and resurrect yourself, Undertakers do pretty light business.",
        "play_sound": "files/VO_FP1_028_EnterPlay_01.ogg",
        "attack_sound": "files/VO_FP1_028_Attack_02.ogg",
        "image": "files/FP1_028.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_028_premium.gif"
    },
    {
        "card_id": "LOE_019",
        "set": "LOE",
        "name": "Unearthed Raptor",
        "collectible": true,
        "flavor_text": "Still hunting for the ones who earthed him.",
        "play_sound": "files/LOE_019_UnearthedRaptor_Play.ogg",
        "attack_sound": "files/LOE_019_UnearthedRaptor_Attack.ogg",
        "image": "files/LOE_019.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_019_premium.gif"
    },
    {
        "card_id": "CFM_900",
        "set": "GANGS",
        "name": "Unlicensed Apothecary",
        "collectible": true,
        "flavor_text": "Get the ingredients wrong on ONE healing potion and they take your license. What a world!",
        "play_sound": "files/VO_CFM_900_Male_Imp_Play_01.ogg",
        "attack_sound": "files/VO_CFM_900_Male_Imp_Attack_01.ogg",
        "image": "files/CFM_900.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_900_premium.gif"
    },
    {
        "card_id": "NAX8_05",
        "set": "NAXX",
        "name": "Unrelenting Rider",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_NAX8_05_EnterPlay_01.ogg",
        "attack_sound": "files/VO_NAX8_05_Attack_02.ogg",
        "image": "files/NAX8_05.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX8_05.png"
    },
    {
        "card_id": "NAX8_03",
        "set": "NAXX",
        "name": "Unrelenting Trainee",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_NAX8_03_EnterPlay_01.ogg",
        "attack_sound": "files/VO_NAX8_03_Attack_02.ogg",
        "image": "files/NAX8_03.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX8_03.png"
    },
    {
        "card_id": "NAX8_04",
        "set": "NAXX",
        "name": "Unrelenting Warrior",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_NAX8_04_EnterPlay_01.ogg",
        "attack_sound": "files/VO_NAX8_04_Attack_02.ogg",
        "image": "files/NAX8_04.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX8_04.png"
    },
    {
        "card_id": "FP1_024",
        "set": "NAXX",
        "name": "Unstable Ghoul",
        "collectible": true,
        "flavor_text": "Filling your Ghouls with Rocket Fuel is all the rage at Necromancer school.",
        "play_sound": "files/SFX_FP1_024_EnterPlay.ogg",
        "attack_sound": "files/SFX_FP1_024_Attack.ogg",
        "image": "files/FP1_024.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_024_premium.gif"
    },
    {
        "card_id": "GVG_083",
        "set": "GVG",
        "name": "Upgraded Repair Bot",
        "collectible": true,
        "flavor_text": "It's the same as the previous generation but they slapped the word \"upgraded\" on it to sell it for double.",
        "play_sound": "files/VO_GVG_083_Play_01.ogg",
        "attack_sound": "files/VO_GVG_083_Attack_02.ogg",
        "image": "files/GVG_083.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_083_premium.gif"
    },
    {
        "card_id": "OG_302",
        "set": "OG",
        "name": "Usher of Souls",
        "collectible": true,
        "flavor_text": "Nothing unburdens your soul like a good ushing!",
        "play_sound": "files/VO_OG_302_Female_Gnome_Play_01.ogg",
        "attack_sound": "files/VO_OG_302_Female_Gnome_Attack_01.ogg",
        "image": "files/OG_302.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_302_premium.gif"
    },
    {
        "card_id": "GVG_111t",
        "set": "GVG",
        "name": "V-07-TR-0N",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_GVG_111t_Play_05.ogg",
        "attack_sound": "files/VO_GVG_111t_Attack_06.ogg",
        "image": "files/GVG_111t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_111t_premium.gif"
    },
    {
        "card_id": "BRMC_97",
        "set": "TB",
        "name": "Vaelastrasz",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BRMC_97_Vaelastrasz_Play_1.ogg",
        "attack_sound": "files/BRMC_97_Vaelastrasz_Attack_1.ogg",
        "image": "files/BRMC_97.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMC_97.png"
    },
    {
        "card_id": "ICCA08_017",
        "set": "ICECROWN",
        "name": "Val'kyr Shadowguard",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_ICCA08_017_Female_ValKyr_Play_02.ogg",
        "attack_sound": "files/VO_ICCA08_017_Female_ValKyr_Attack_01.ogg",
        "image": "files/ICCA08_017.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/ICCA08_017.png"
    },
    {
        "card_id": "ICC_408",
        "set": "ICECROWN",
        "name": "Val'kyr Soulclaimer",
        "collectible": true,
        "flavor_text": "My Ghoul friend is back and you're gonna be in trouble.",
        "play_sound": "files/VO_ICC_408_Female_ValKyr_Play_01.ogg",
        "attack_sound": "files/VO_ICC_408_Female_ValKyr_Attack_01.ogg",
        "image": "files/ICC_408.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_408_premium.gif"
    },
    {
        "card_id": "OG_200",
        "set": "OG",
        "name": "Validated Doomsayer",
        "collectible": true,
        "flavor_text": "Really feels good about himself and is in a much better place now. But… he sure does miss piloting those shredders.",
        "play_sound": "files/VO_OG_200_Male_BloodElf_Play_01.ogg",
        "attack_sound": "files/VO_OG_200_Male_BloodElf_Attack_01.ogg",
        "image": "files/OG_200.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_200_premium.gif"
    },
    {
        "card_id": "ICCA10_001",
        "set": "ICECROWN",
        "name": "Valithria Dreamwalker",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_ICCA10_001_Female_GreenDragon_Play_01.ogg",
        "attack_sound": "files/VO_ICCA10_001_Female_GreenDragon_Attack_02.ogg",
        "image": "files/ICCA10_001.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/ICCA10_001.png"
    },
    {
        "card_id": "AT_072",
        "set": "TGT",
        "name": "Varian Wrynn",
        "collectible": true,
        "flavor_text": "Leader of the Alliance!  Father of Anduin!  Also he likes to play Arena, and he averages 12 wins.",
        "play_sound": "files/VO_AT_072_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_072_ATTACK_03.ogg",
        "image": "files/AT_072.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_072_premium.gif"
    },
    {
        "card_id": "ICC_032",
        "set": "ICECROWN",
        "name": "Venomancer",
        "collectible": true,
        "flavor_text": "Eight times the death of regular-mancers.",
        "play_sound": "files/VO_ICC_032_Female_Nerubian_Play_01.ogg",
        "attack_sound": "files/VO_ICC_032_Female_Nerubian_Attack_01.ogg",
        "image": "files/ICC_032.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_032_premium.gif"
    },
    {
        "card_id": "CS2_227",
        "set": "CLASSIC",
        "name": "Venture Co. Mercenary",
        "collectible": true,
        "flavor_text": "No Job is too big.  No fee is too big.",
        "play_sound": "files/VO_CS2_227_Play_01.ogg",
        "attack_sound": "files/VO_CS2_227_Attack_02.ogg",
        "image": "files/CS2_227.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_227_premium.gif"
    },
    {
        "card_id": "UNG_100",
        "set": "UNGORO",
        "name": "Verdant Longneck",
        "collectible": true,
        "flavor_text": "Always sticking its neck into other people’s business.",
        "play_sound": "files/UNG_100_VerdantMegasaur_Play.ogg",
        "attack_sound": "files/UNG_100_VerdantMegasaur_Attack.ogg",
        "image": "files/UNG_100.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_100_premium.gif"
    },
    {
        "card_id": "UNG_075",
        "set": "UNGORO",
        "name": "Vicious Fledgling",
        "collectible": true,
        "flavor_text": "A youngster who is truly hungry for self-improvement.",
        "play_sound": "files/UNG_075_HungryFledgling_Play.ogg",
        "attack_sound": "files/UNG_075_HungryFledgling_Attack.ogg",
        "image": "files/UNG_075.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_075_premium.gif"
    },
    {
        "card_id": "OG_006",
        "set": "OG",
        "name": "Vilefin Inquisitor",
        "collectible": true,
        "flavor_text": "Nobody expects the Vilefin Inquisition!",
        "play_sound": "files/VilefinInquisitor_OG_006_Play.ogg",
        "attack_sound": "files/VilefinInquisitor_OG_006_Attack.ogg",
        "image": "files/OG_006.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_006_premium.gif"
    },
    {
        "card_id": "UNG_064",
        "set": "UNGORO",
        "name": "Vilespine Slayer",
        "collectible": true,
        "flavor_text": "'Cause slayers gonna slay, slay, slay, slay, slay.",
        "play_sound": "files/VilespineSlayer_UNG_064_Play.ogg",
        "attack_sound": "files/VilespineSlayer_UNG_064_Attack.ogg",
        "image": "files/UNG_064.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_064_premium.gif"
    },
    {
        "card_id": "NEW1_026t",
        "set": "CLASSIC",
        "name": "Violet Apprentice",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_NEW1_026t_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_026t_Attack_02.ogg",
        "image": "files/NEW1_026t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_026t_premium.gif"
    },
    {
        "card_id": "KAR_712",
        "set": "KARA",
        "name": "Violet Illusionist",
        "collectible": true,
        "flavor_text": "She’s much more cheerful after losing the ‘n’ in her name.",
        "play_sound": "files/VO_KAR_712_Female_Human_Play_01.ogg",
        "attack_sound": "files/VO_KAR_712_Female_Human_Attack_01.ogg",
        "image": "files/KAR_712.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_712_premium.gif"
    },
    {
        "card_id": "NEW1_026",
        "set": "CLASSIC",
        "name": "Violet Teacher",
        "collectible": true,
        "flavor_text": "If you don't pay attention, you may be turned into a pig.  And then you get your name on the board.",
        "play_sound": "files/VO_NEW1_026_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_026_Attack_02.ogg",
        "image": "files/NEW1_026.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_026_premium.gif"
    },
    {
        "card_id": "CFM_816",
        "set": "GANGS",
        "name": "Virmen Sensei",
        "collectible": true,
        "flavor_text": "There is no carrot.",
        "play_sound": "files/VO_CFM_816_Male_Vermin_Play_01.ogg",
        "attack_sound": "files/VO_CFM_816_Male_Vermin_Attack_01.ogg",
        "image": "files/CFM_816.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_816_premium.gif"
    },
    {
        "card_id": "GVG_039",
        "set": "GVG",
        "name": "Vitality Totem",
        "collectible": true,
        "flavor_text": "You can usually find these at the totemist's market on Saturdays.",
        "play_sound": "files/SFX_GVG_039_EnterPlay.ogg",
        "attack_sound": "files/SFX_GVG_039_Attack.ogg",
        "image": "files/GVG_039.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_039_premium.gif"
    },
    {
        "card_id": "AT_023",
        "set": "TGT",
        "name": "Void Crusher",
        "collectible": true,
        "flavor_text": "We like to call him \"Wesley\".",
        "play_sound": "files/VO_AT_023_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_023_ATTACK_02.ogg",
        "image": "files/AT_023.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_023_premium.gif"
    },
    {
        "card_id": "EX1_304",
        "set": "CLASSIC",
        "name": "Void Terror",
        "collectible": true,
        "flavor_text": "If you put this into your deck, you WILL lose the trust of your other minions.",
        "play_sound": "files/EX1_304_VoidTerror_Play.ogg",
        "attack_sound": "files/EX1_304_VoidTerror_Attack.ogg",
        "image": "files/EX1_304.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_304_premium.gif"
    },
    {
        "card_id": "FP1_022",
        "set": "NAXX",
        "name": "Voidcaller",
        "collectible": true,
        "flavor_text": "\"Void!  Here, void!  Here, buddy!\"",
        "play_sound": "files/VO_FP1_022_EnterPlay_01.ogg",
        "attack_sound": "files/VO_FP1_022_Attack_02.ogg",
        "image": "files/FP1_022.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_022_premium.gif"
    },
    {
        "card_id": "CS2_065",
        "set": "BASIC",
        "name": "Voidwalker",
        "collectible": true,
        "flavor_text": "No relation to \"The Voidsteppers\", the popular Void-based dance troupe.",
        "play_sound": "files/VO_CS2_065_Play_01.ogg",
        "attack_sound": "files/VO_CS2_065_Attack_02.ogg",
        "image": "files/CS2_065.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_065_premium.gif"
    },
    {
        "card_id": "GVG_014",
        "set": "GVG",
        "name": "Vol'jin",
        "collectible": true,
        "flavor_text": "Vol'jin is a shadow hunter, which is like a shadow priest except more voodoo.",
        "play_sound": "files/VO_GVG_014_Play_01.ogg",
        "attack_sound": "files/VO_GVG_014_Attack_02.ogg",
        "image": "files/GVG_014.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_014_premium.gif"
    },
    {
        "card_id": "UNG_818",
        "set": "UNGORO",
        "name": "Volatile Elemental",
        "collectible": true,
        "flavor_text": "Currently in an anger management class with Raging Worgen, Grommash Hellscream, and The Angry Chicken. It isn't helping.",
        "play_sound": "files/VO_UNG_818_Male_Elemental_Play_03.ogg",
        "attack_sound": "files/VO_UNG_818_Male_Elemental_Attack_02.ogg",
        "image": "files/UNG_818.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_818_premium.gif"
    },
    {
        "card_id": "BRM_025",
        "set": "BRM",
        "name": "Volcanic Drake",
        "collectible": true,
        "flavor_text": "Volcanic Drakes breathe lava instead of fire. The antacid vendor at Thorium Point does a brisk business with them.",
        "play_sound": "files/BRM_025_VolcanicDrake_EnterPlay_1.ogg",
        "attack_sound": "files/BRM_025_VolcanicDrake_Attack_1.ogg",
        "image": "files/BRM_025.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_025_premium.gif"
    },
    {
        "card_id": "BRM_009",
        "set": "BRM",
        "name": "Volcanic Lumberer",
        "collectible": true,
        "flavor_text": "The roots, the roots, the roots is on fire!",
        "play_sound": "files/BRM_009_VolcanicLumberer_Play_1.ogg",
        "attack_sound": "files/BRM_009_VolcanicLumberer_Attack_1.ogg",
        "image": "files/BRM_009.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/BRM_009_premium.gif"
    },
    {
        "card_id": "UNG_002",
        "set": "UNGORO",
        "name": "Volcanosaur",
        "collectible": true,
        "flavor_text": "Always fun to say out loud \"VOL-CA-NO-SAUUUR!\"",
        "play_sound": "files/UNG_002_Volcanosaur_Play.ogg",
        "attack_sound": "files/UNG_002_Volcanosaur_Attack.ogg",
        "image": "files/UNG_002.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/UNG_002_premium.gif"
    },
    {
        "card_id": "EX1_011",
        "set": "BASIC",
        "name": "Voodoo Doctor",
        "collectible": true,
        "flavor_text": "Voodoo is an oft-misunderstood art. But it \u003ci\u003eis\u003c/i\u003e art.",
        "play_sound": "files/VO_EX1_011_Play_01.ogg",
        "attack_sound": "files/VO_EX1_011_Attack_02.ogg",
        "image": "files/EX1_011.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_011_premium.gif"
    },
    {
        "card_id": "ICC_067",
        "set": "ICECROWN",
        "name": "Vryghoul",
        "collectible": true,
        "flavor_text": "It's pronounced VERY GHOUL. Don't let anyone tell you different.",
        "play_sound": "files/VO_ICC_067_Male_Vargul_Play_01.ogg",
        "attack_sound": "files/VO_ICC_067_Male_Vargul_Attack_01.ogg",
        "image": "files/ICC_067.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_067_premium.gif"
    },
    {
        "card_id": "FP1_016",
        "set": "NAXX",
        "name": "Wailing Soul",
        "collectible": true,
        "flavor_text": "This soul just \u003ci\u003ewails\u003c/i\u003e on you. Dang, soul, let up already.",
        "play_sound": "files/FP1_016_WailingSoul_EnterPlay.ogg",
        "attack_sound": "files/FP1_016_WailingSoul_Attack.ogg",
        "image": "files/FP1_016.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_016_premium.gif"
    },
    {
        "card_id": "CS2_186",
        "set": "BASIC",
        "name": "War Golem",
        "collectible": true,
        "flavor_text": "Golems are not afraid, but for some reason they still run when you cast Fear on them.  Instinct, maybe?  A desire to blend in?",
        "play_sound": "files/CS2_186_War_Golem_EnterPlay1.ogg",
        "attack_sound": "files/CS2_186_War_Golem_Attack3.ogg",
        "image": "files/CS2_186.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_186_premium.gif"
    },
    {
        "card_id": "AT_099t",
        "set": "TGT",
        "name": "War Kodo",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_AT_099t_Play.ogg",
        "attack_sound": "files/SFX_AT_099t_Attack.ogg",
        "image": "files/AT_099t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_099t_premium.gif"
    },
    {
        "card_id": "GVG_051",
        "set": "GVG",
        "name": "Warbot",
        "collectible": true,
        "flavor_text": "Mass production of warbots was halted when it was discovered that they were accidentally being produced at \"sample size.\"",
        "play_sound": "files/VO_GVG_051_Play_01.ogg",
        "attack_sound": "files/VO_GVG_051_Attack_02.ogg",
        "image": "files/GVG_051.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_051_premium.gif"
    },
    {
        "card_id": "AT_075",
        "set": "TGT",
        "name": "Warhorse Trainer",
        "collectible": true,
        "flavor_text": "He doesn't even get Sundays off.  Every day he's hostling.",
        "play_sound": "files/VO_AT_075_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_075_ATTACK_02.ogg",
        "image": "files/AT_075.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_075_premium.gif"
    },
    {
        "card_id": "ICCA01_011",
        "set": "ICECROWN",
        "name": "Warlock on Fire",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_ICCA01_011_Female_Troll_Play_01.ogg",
        "attack_sound": "files/VO_ICCA01_011_Female_Troll_Attack_01.ogg",
        "image": "files/ICCA01_011.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/ICCA01_011.png"
    },
    {
        "card_id": "EX1_084",
        "set": "BASIC",
        "name": "Warsong Commander",
        "collectible": true,
        "flavor_text": "The Warsong clan is \u003ci\u003esuch drama\u003c/i\u003e. It's really not worth it to become a commander.",
        "play_sound": "files/VO_EX1_084_Play_01.ogg",
        "attack_sound": "files/VO_EX1_084_Attack_02.ogg",
        "image": "files/EX1_084.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_084_premium.gif"
    },
    {
        "card_id": "CS2_033",
        "set": "BASIC",
        "name": "Water Elemental",
        "collectible": true,
        "flavor_text": "Don't summon a water elemental at a party.  It'll dampen the mood.",
        "play_sound": "files/CS2_033_Play_WaterElemental.ogg",
        "attack_sound": "files/CS2_033_Attack_WaterElemental.ogg",
        "image": "files/CS2_033.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_033_premium.gif"
    },
    {
        "card_id": "CFM_095",
        "set": "GANGS",
        "name": "Weasel Tunneler",
        "collectible": true,
        "flavor_text": "He's the reason the First Bank of Gadgetzan has steel floors.",
        "play_sound": "files/VO_CFM_095_Male_Weasel_Play.ogg",
        "attack_sound": "files/VO_CFM_095_Male_Weasel_Attack.ogg",
        "image": "files/CFM_095.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_095_premium.gif"
    },
    {
        "card_id": "FP1_011",
        "set": "NAXX",
        "name": "Webspinner",
        "collectible": true,
        "flavor_text": "Spider cocoons are like little piñatas!",
        "play_sound": "files/SFX_FP1_011_EnterPlay.ogg",
        "attack_sound": "files/SFX_FP1_011_Attack.ogg",
        "image": "files/FP1_011.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_011_premium.gif"
    },
    {
        "card_id": "GVG_122",
        "set": "GVG",
        "name": "Wee Spellstopper",
        "collectible": true,
        "flavor_text": "Bane of spellcasters and spelling bees everywhere.",
        "play_sound": "files/VO_GVG_122_Play_01.ogg",
        "attack_sound": "files/VO_GVG_122_Attack_02.ogg",
        "image": "files/GVG_122.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_122_premium.gif"
    },
    {
        "card_id": "ds1_whelptoken",
        "set": "CLASSIC",
        "name": "Whelp",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/ds1_whelptoken_Whelp_EnterPlay1.ogg",
        "attack_sound": "files/ds1_whelptoken_Whelp_Attack1.ogg",
        "image": "files/ds1_whelptoken.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ds1_whelptoken_premium.gif"
    },
    {
        "card_id": "KAR_010a",
        "set": "KARA",
        "name": "Whelp2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/Whelp_KAR_010a_Play.ogg",
        "attack_sound": "files/Whelp_KAR_010a_Attack.ogg",
        "image": "files/KAR_010a.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_010a_premium.gif"
    },
    {
        "card_id": "BRMA09_2t",
        "set": "BRM",
        "name": "Whelp3",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/SFX_BRM_022t_BlackWhelp_EnterPlay.ogg",
        "attack_sound": "files/SFX_BRM_022t_BlackWhelp_Attack.ogg",
        "image": "files/BRMA09_2t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA09_2t.png"
    },
    {
        "card_id": "BRMA13_7",
        "set": "BRM",
        "name": "Whirling Ash",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/BRMA13_7_WhirlingAsh_EnterPlay_1.ogg",
        "attack_sound": "files/BRMA13_7_WhirlingAsh_Attack_1.ogg",
        "image": "files/BRMA13_7.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/BRMA13_7.png"
    },
    {
        "card_id": "GVG_037",
        "set": "GVG",
        "name": "Whirling Zap-o-matic",
        "collectible": true,
        "flavor_text": "If you pay a little extra, you can get it in \"candy-apple red.\"",
        "play_sound": "files/VO_GVG_037_Play_01.ogg",
        "attack_sound": "files/VO_GVG_037_Attack_02.ogg",
        "image": "files/GVG_037.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/GVG_037_premium.gif"
    },
    {
        "card_id": "KAR_A10_05",
        "set": "KARA",
        "name": "White Bishop",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KAR_A10_05_Male_ChessPiece_Play_01.ogg",
        "attack_sound": "files/KAR_A10_05_WhiteKnight_Attack_01.ogg",
        "image": "files/KAR_A10_05.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KAR_A10_05.png"
    },
    {
        "card_id": "CFM_324",
        "set": "GANGS",
        "name": "White Eyes",
        "collectible": true,
        "flavor_text": "My life for Aya!",
        "play_sound": "files/VO_CFM_324_Male_Pandaren_Play_01.ogg",
        "attack_sound": "files/VO_CFM_324_Male_Pandaren_Attack_01.ogg",
        "image": "files/CFM_324.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_324_premium.gif"
    },
    {
        "card_id": "KAR_A10_02",
        "set": "KARA",
        "name": "White Pawn",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KAR_A10_02_Male_ChessPiece_Play_02.ogg",
        "attack_sound": "files/VO_KAR_A10_02_Male_ChessPiece_Attack_01.ogg",
        "image": "files/KAR_A10_02.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_A10_02_premium.gif"
    },
    {
        "card_id": "KAR_A10_09",
        "set": "KARA",
        "name": "White Queen",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_KAR_A10_09_Female_ChessPiece_Play_01.ogg",
        "attack_sound": "files/VO_KAR_A10_09_Female_ChessPiece_Attack_01.ogg",
        "image": "files/KAR_A10_09.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KAR_A10_09.png"
    },
    {
        "card_id": "KAR_A10_04",
        "set": "KARA",
        "name": "White Rook",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/Minion_SFX_WhiteRook_KAR_A10_04_Play_06.ogg",
        "attack_sound": "files/Minion_SFX_WhiteRook_KAR_A10_04_Play_06.ogg",
        "image": "files/KAR_A10_04.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/KAR_A10_04.png"
    },
    {
        "card_id": "ICC_904",
        "set": "ICECROWN",
        "name": "Wicked Skeleton",
        "collectible": true,
        "flavor_text": "It's minions like these that give normal, law-abiding skeletons a bad rap.",
        "play_sound": "files/VO_ICC_904_Female_Skeleton_Play_01.ogg",
        "attack_sound": "files/VO_ICC_904_Female_Skeleton_Attack_02.ogg",
        "image": "files/ICC_904.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_904_premium.gif"
    },
    {
        "card_id": "KAR_021",
        "set": "KARA",
        "name": "Wicked Witchdoctor",
        "collectible": true,
        "flavor_text": "You can easily defeat her by either dealing 4 damage, or dropping a house on her.",
        "play_sound": "files/VO_KAR_021_Female_Troll_Play_02.ogg",
        "attack_sound": "files/VO_KAR_021_Female_Troll_Attack_01.ogg",
        "image": "files/KAR_021.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_021_premium.gif"
    },
    {
        "card_id": "CFM_815",
        "set": "GANGS",
        "name": "Wickerflame Burnbristle",
        "collectible": true,
        "flavor_text": "Wickerflame spent years as a recruit for the Goons, never making the big-time because he always fired his chest-cannon too slowly.  \"Hey,\" he thought, \"maybe if I keep my beard lit on fire, I can do this faster.\"  BOOM, promoted.",
        "play_sound": "files/VO_CFM_815_Male_Dwarf_Play_02.ogg",
        "attack_sound": "files/VO_CFM_815_Male_Dwarf_Attack_01.ogg",
        "image": "files/CFM_815.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_815_premium.gif"
    },
    {
        "card_id": "NEW1_020",
        "set": "CLASSIC",
        "name": "Wild Pyromancer",
        "collectible": true,
        "flavor_text": "BOOM BABY BOOM!  BAD IS GOOD!  DOWN WITH GOVERNMENT!",
        "play_sound": "files/VO_NEW1_020_Play_01.ogg",
        "attack_sound": "files/VO_NEW1_020_Attack_02.ogg",
        "image": "files/NEW1_020.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/NEW1_020_premium.gif"
    },
    {
        "card_id": "AT_040",
        "set": "TGT",
        "name": "Wildwalker",
        "collectible": true,
        "flavor_text": "She was born to be something.  She is just not quite sure what yet...",
        "play_sound": "files/VO_AT_040_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_040_ATTACK_02.ogg",
        "image": "files/AT_040.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_040_premium.gif"
    },
    {
        "card_id": "AT_027",
        "set": "TGT",
        "name": "Wilfred Fizzlebang",
        "collectible": true,
        "flavor_text": "He can summon anything, even a FEARSOME DOOMGUARD*.\n\n*He's pretty sure this is going to work out.",
        "play_sound": "files/VO_AT_027_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_027_ATTACK_02.ogg",
        "image": "files/AT_027.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_027_premium.gif"
    },
    {
        "card_id": "CFM_025",
        "set": "GANGS",
        "name": "Wind-up Burglebot",
        "collectible": true,
        "flavor_text": "Don't blame the bot for his crimes...  Blame whoever keeps winding him up!",
        "play_sound": "files/VO_CFM_025_Male_Mech_Play_01.ogg",
        "attack_sound": "files/VO_CFM_025_Male_Mech_Attack_01.ogg",
        "image": "files/CFM_025.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_025_premium.gif"
    },
    {
        "card_id": "EX1_033",
        "set": "CLASSIC",
        "name": "Windfury Harpy",
        "collectible": true,
        "flavor_text": "Harpies are not pleasant sounding.  That's the nicest I can put it.",
        "play_sound": "files/SFX_EX1_033_EnterPlay.ogg",
        "attack_sound": "files/SFX_EX1_033_Attack.ogg",
        "image": "files/EX1_033.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_033_premium.gif"
    },
    {
        "card_id": "EX1_587",
        "set": "BASIC",
        "name": "Windspeaker",
        "collectible": true,
        "flavor_text": "Is there anything worse than a Windspeaker with halitosis?",
        "play_sound": "files/VO_EX1_587_Play_01.ogg",
        "attack_sound": "files/VO_EX1_587_Attack_02.ogg",
        "image": "files/EX1_587.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_587_premium.gif"
    },
    {
        "card_id": "CS2_231",
        "set": "CLASSIC",
        "name": "Wisp",
        "collectible": true,
        "flavor_text": "If you hit an Eredar Lord with enough Wisps, it will explode.   But why?",
        "play_sound": "files/CS2_231_Wisp_EnterPlay1.ogg",
        "attack_sound": "files/CS2_231_Wisp_Attack2.ogg",
        "image": "files/CS2_231.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_231_premium.gif"
    },
    {
        "card_id": "OG_195c",
        "set": "OG",
        "name": "Wisp2",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/OG_195c_EvilWisp_Play.ogg",
        "attack_sound": "files/OG_195c_EvilWisp_Attack.ogg",
        "image": "files/OG_195c.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_195c_premium.gif"
    },
    {
        "card_id": "LOE_089",
        "set": "LOE",
        "name": "Wobbling Runts",
        "collectible": true,
        "flavor_text": "The fourth one fell off in a tragic accident.  They don't talk about it.",
        "play_sound": "files/VO_LOE_089_Play2_06.ogg",
        "attack_sound": "files/VO_LOE_089_Attack_Trio.ogg",
        "image": "files/LOE_089.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/LOE_089_premium.gif"
    },
    {
        "card_id": "CS2_124",
        "set": "BASIC",
        "name": "Wolfrider",
        "collectible": true,
        "flavor_text": "Orcish raiders ride wolves because they are well adapted to harsh environments, and because they are soft and cuddly.",
        "play_sound": "files/SFX_CS2_124_Wolf_EnterPlay_00.ogg",
        "attack_sound": "files/SFX_CS2_124_Wolf_Attack_00.ogg",
        "image": "files/CS2_124.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_124_premium.gif"
    },
    {
        "card_id": "CFM_665",
        "set": "GANGS",
        "name": "Worgen Greaser",
        "collectible": true,
        "flavor_text": "Hair products are 79% of his monthly budget.",
        "play_sound": "files/VO_CFM_665_Male_Worgen_Play_01.ogg",
        "attack_sound": "files/VO_CFM_665_Male_Worgen_Attack_01.ogg",
        "image": "files/CFM_665.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_665_premium.gif"
    },
    {
        "card_id": "EX1_010",
        "set": "CLASSIC",
        "name": "Worgen Infiltrator",
        "collectible": true,
        "flavor_text": "If you want to stop a worgen from infiltrating, just yell, \"No! Bad boy!\"",
        "play_sound": "files/VO_EX1_010_Play_01.ogg",
        "attack_sound": "files/VO_EX1_010_Attack_02.ogg",
        "image": "files/EX1_010.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_010_premium.gif"
    },
    {
        "card_id": "NAX2_05",
        "set": "NAXX",
        "name": "Worshipper",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/VO_NAX2_05_EnterPlay_01.ogg",
        "attack_sound": "files/VO_NAX2_05_Attack_02.ogg",
        "image": "files/NAX2_05.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/NAX2_05.png"
    },
    {
        "card_id": "EX1_317t",
        "set": "CLASSIC",
        "name": "Worthless Imp",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/WoW_EX1_317t_Worthless_Imp_EnterPlay.ogg",
        "attack_sound": "files/WoW_EX1_317t_Worthless_Imp_Attack.ogg",
        "image": "files/EX1_317t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_317t_premium.gif"
    },
    {
        "card_id": "CS2_052",
        "set": "BASIC",
        "name": "Wrath of Air Totem",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/CS2_052_Play_WrathofAirTotem.ogg",
        "attack_sound": "files/SFX_CS2_052_Attack_00.ogg",
        "image": "files/CS2_052.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_052_premium.gif"
    },
    {
        "card_id": "AT_026",
        "set": "TGT",
        "name": "Wrathguard",
        "collectible": true,
        "flavor_text": "After playing against 5 Annoy-O-Trons, any normal guard will become a Wrathguard.",
        "play_sound": "files/VO_AT_026_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_026_ATTACK_02.ogg",
        "image": "files/AT_026.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_026_premium.gif"
    },
    {
        "card_id": "CFM_806",
        "set": "GANGS",
        "name": "Wrathion",
        "collectible": true,
        "flavor_text": "Wrathion, son of Deathwing, is a dragon.  Why isn't he tagged as a dragon, you ask?  WHAT, ARE YOU TRYING TO BLOW HIS COVER??",
        "play_sound": "files/VO_CFM_806_Male_Human_Play_02.ogg",
        "attack_sound": "files/VO_CFM_806_Male_Human_Attack_01.ogg",
        "image": "files/CFM_806.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CFM_806_premium.gif"
    },
    {
        "card_id": "ICC_468",
        "set": "ICECROWN",
        "name": "Wretched Tiller",
        "collectible": true,
        "flavor_text": "If you ever tried to plow permafrost, you’d be wretched, too.",
        "play_sound": "files/VO_ICC_468_Male_Undead_Play_01.ogg",
        "attack_sound": "files/VO_ICC_468_Male_Undead_Attack_01.ogg",
        "image": "files/ICC_468.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/ICC_468_premium.gif"
    },
    {
        "card_id": "AT_116",
        "set": "TGT",
        "name": "Wyrmrest Agent",
        "collectible": true,
        "flavor_text": "Keeping tabs on the Grand Tournament is priority #1 for the five mighty Dragonflights!",
        "play_sound": "files/VO_AT_116_PLAY_01.ogg",
        "attack_sound": "files/VO_AT_116_ATTACK_02.ogg",
        "image": "files/AT_116.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/AT_116_premium.gif"
    },
    {
        "card_id": "OG_080",
        "set": "OG",
        "name": "Xaril, Poisoned Mind",
        "collectible": true,
        "flavor_text": "It's basically your own fault if you go around drinking weird green potions handed out by creepy mantid dudes.",
        "play_sound": "files/VO_OG_080_Male_Klaxxi_Play_01.ogg",
        "attack_sound": "files/VO_OG_080_Male_Klaxxi_Attack_01.ogg",
        "image": "files/OG_080.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_080_premium.gif"
    },
    {
        "card_id": "OG_042",
        "set": "OG",
        "name": "Y'Shaarj, Rage Unbound",
        "collectible": true,
        "flavor_text": "When he's working out, he binds all that rage back into a ponytail.",
        "play_sound": "files/VO_OG_254_Androgynous _Faceless_Play_01.ogg",
        "attack_sound": "files/VO_OG_042_Male_OldGod_Attack_01.ogg",
        "image": "files/OG_042.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_042_premium.gif"
    },
    {
        "card_id": "OG_134",
        "set": "OG",
        "name": "Yogg-Saron, Hope's End",
        "collectible": true,
        "flavor_text": "I spell your doom... Y-O-U-R D-O-O-M!",
        "play_sound": "files/VO_OG_134_Male_OldGod_Play_01.ogg",
        "attack_sound": "files/VO_OG_134_Male_OldGod_Attack_01.ogg",
        "image": "files/OG_134.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_134_premium.gif"
    },
    {
        "card_id": "CS2_169",
        "set": "CLASSIC",
        "name": "Young Dragonhawk",
        "collectible": true,
        "flavor_text": "They were the inspiration for the championship Taurenball team: The Dragonhawks.",
        "play_sound": "files/CS2_169_Young_Dragonhawk_EnterPlay1.ogg",
        "attack_sound": "files/CS2_169_Young_Dragonhawk_Attack1.ogg",
        "image": "files/CS2_169.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/CS2_169_premium.gif"
    },
    {
        "card_id": "EX1_004",
        "set": "CLASSIC",
        "name": "Young Priestess",
        "collectible": true,
        "flavor_text": "She can't wait to learn Power Word: Fortitude Rank 2.",
        "play_sound": "files/VO_EX1_004_Play_01.ogg",
        "attack_sound": "files/VO_EX1_004_Attack_02.ogg",
        "image": "files/EX1_004.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_004_premium.gif"
    },
    {
        "card_id": "EX1_049",
        "set": "CLASSIC",
        "name": "Youthful Brewmaster",
        "collectible": true,
        "flavor_text": "His youthful enthusiasm doesn’t always equal excellence in his brews.   Don’t drink the Mogu Stout!",
        "play_sound": "files/VO_EX1_049_Play_01.ogg",
        "attack_sound": "files/VO_EX1_049_Attack_02.ogg",
        "image": "files/EX1_049.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_049_premium.gif"
    },
    {
        "card_id": "EX1_572",
        "set": "CLASSIC",
        "name": "Ysera",
        "collectible": true,
        "flavor_text": "Ysera rules the Emerald Dream.  Which is some kind of green-mirror-version of the real world, or something?",
        "play_sound": "files/VO_EX1_572_Play_01.ogg",
        "attack_sound": "files/VO_EX1_572_Attack_02.ogg",
        "image": "files/EX1_572.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/EX1_572_premium.gif"
    },
    {
        "card_id": "OG_158",
        "set": "OG",
        "name": "Zealous Initiate",
        "collectible": true,
        "flavor_text": "Ok, Initiate. You need to settle down and do your job. In this case, that means die so someone else can get a minor buff.",
        "play_sound": "files/VO_OG_158_Male_Faceless_Play_01.ogg",
        "attack_sound": "files/VO_OG_158_Male_Faceless_Attack_01.ogg",
        "image": "files/OG_158.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/OG_158_premium.gif"
    },
    {
        "card_id": "ICC_800h3t",
        "set": "ICECROWN",
        "name": "Zombeast",
        "collectible": false,
        "flavor_text": "",
        "play_sound": "files/Zombeast_ICC_800h3t_Play.ogg",
        "attack_sound": "files/Zombeast_ICC_800h3t_Attack.ogg",
        "image": "files/ICC_800h3t.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/ICC_800h3t.png"
    },
    {
        "card_id": "FP1_001",
        "set": "NAXX",
        "name": "Zombie Chow",
        "collectible": true,
        "flavor_text": "Zombie.  It's what's for dinner.",
        "play_sound": "files/VO_FP1_001_EnterPlay_01.ogg",
        "attack_sound": "files/VO_FP1_001_Attack_02.ogg",
        "image": "files/FP1_001.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/FP1_001_premium.gif"
    },
    {
        "card_id": "KAR_095",
        "set": "KARA",
        "name": "Zoobot",
        "collectible": true,
        "flavor_text": "The Murloc is taking the picture.",
        "play_sound": "files/KAR_095_Zoobot-201_Play_01.ogg",
        "attack_sound": "files/KAR_095_Zoobot-201_Attack_01.ogg",
        "image": "files/KAR_095.png",
        "gold_image": "http://media.services.zam.com/v1/media/byName/hs/cards/enus/animated/KAR_095_premium.gif"
    }
];


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 *  howler.js v2.0.4
 *  howlerjs.com
 *
 *  (c) 2013-2017, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function() {

  'use strict';

  /** Global Methods **/
  /***************************************************************************/

  /**
   * Create the global controller. All contained methods and properties apply
   * to all sounds that are currently playing or will be in the future.
   */
  var HowlerGlobal = function() {
    this.init();
  };
  HowlerGlobal.prototype = {
    /**
     * Initialize the global Howler object.
     * @return {Howler}
     */
    init: function() {
      var self = this || Howler;

      // Create a global ID counter.
      self._counter = 1000;

      // Internal properties.
      self._codecs = {};
      self._howls = [];
      self._muted = false;
      self._volume = 1;
      self._canPlayEvent = 'canplaythrough';
      self._navigator = (typeof window !== 'undefined' && window.navigator) ? window.navigator : null;

      // Public properties.
      self.masterGain = null;
      self.noAudio = false;
      self.usingWebAudio = true;
      self.autoSuspend = true;
      self.ctx = null;

      // Set to false to disable the auto iOS enabler.
      self.mobileAutoEnable = true;

      // Setup the various state values for global tracking.
      self._setup();

      return self;
    },

    /**
     * Get/set the global volume for all sounds.
     * @param  {Float} vol Volume from 0.0 to 1.0.
     * @return {Howler/Float}     Returns self or current volume.
     */
    volume: function(vol) {
      var self = this || Howler;
      vol = parseFloat(vol);

      // If we don't have an AudioContext created yet, run the setup.
      if (!self.ctx) {
        setupAudioContext();
      }

      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        self._volume = vol;

        // Don't update any of the nodes if we are muted.
        if (self._muted) {
          return self;
        }

        // When using Web Audio, we just need to adjust the master gain.
        if (self.usingWebAudio) {
          self.masterGain.gain.value = vol;
        }

        // Loop through and change volume for all HTML5 audio nodes.
        for (var i=0; i<self._howls.length; i++) {
          if (!self._howls[i]._webAudio) {
            // Get all of the sounds in this Howl group.
            var ids = self._howls[i]._getSoundIds();

            // Loop through all sounds and change the volumes.
            for (var j=0; j<ids.length; j++) {
              var sound = self._howls[i]._soundById(ids[j]);

              if (sound && sound._node) {
                sound._node.volume = sound._volume * vol;
              }
            }
          }
        }

        return self;
      }

      return self._volume;
    },

    /**
     * Handle muting and unmuting globally.
     * @param  {Boolean} muted Is muted or not.
     */
    mute: function(muted) {
      var self = this || Howler;

      // If we don't have an AudioContext created yet, run the setup.
      if (!self.ctx) {
        setupAudioContext();
      }

      self._muted = muted;

      // With Web Audio, we just need to mute the master gain.
      if (self.usingWebAudio) {
        self.masterGain.gain.value = muted ? 0 : self._volume;
      }

      // Loop through and mute all HTML5 Audio nodes.
      for (var i=0; i<self._howls.length; i++) {
        if (!self._howls[i]._webAudio) {
          // Get all of the sounds in this Howl group.
          var ids = self._howls[i]._getSoundIds();

          // Loop through all sounds and mark the audio node as muted.
          for (var j=0; j<ids.length; j++) {
            var sound = self._howls[i]._soundById(ids[j]);

            if (sound && sound._node) {
              sound._node.muted = (muted) ? true : sound._muted;
            }
          }
        }
      }

      return self;
    },

    /**
     * Unload and destroy all currently loaded Howl objects.
     * @return {Howler}
     */
    unload: function() {
      var self = this || Howler;

      for (var i=self._howls.length-1; i>=0; i--) {
        self._howls[i].unload();
      }

      // Create a new AudioContext to make sure it is fully reset.
      if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== 'undefined') {
        self.ctx.close();
        self.ctx = null;
        setupAudioContext();
      }

      return self;
    },

    /**
     * Check for codec support of specific extension.
     * @param  {String} ext Audio file extention.
     * @return {Boolean}
     */
    codecs: function(ext) {
      return (this || Howler)._codecs[ext.replace(/^x-/, '')];
    },

    /**
     * Setup various state values for global tracking.
     * @return {Howler}
     */
    _setup: function() {
      var self = this || Howler;

      // Keeps track of the suspend/resume state of the AudioContext.
      self.state = self.ctx ? self.ctx.state || 'running' : 'running';

      // Automatically begin the 30-second suspend process
      self._autoSuspend();

      // Check if audio is available.
      if (!self.usingWebAudio) {
        // No audio is available on this system if noAudio is set to true.
        if (typeof Audio !== 'undefined') {
          try {
            var test = new Audio();

            // Check if the canplaythrough event is available.
            if (typeof test.oncanplaythrough === 'undefined') {
              self._canPlayEvent = 'canplay';
            }
          } catch(e) {
            self.noAudio = true;
          }
        } else {
          self.noAudio = true;
        }
      }

      // Test to make sure audio isn't disabled in Internet Explorer.
      try {
        var test = new Audio();
        if (test.muted) {
          self.noAudio = true;
        }
      } catch (e) {}

      // Check for supported codecs.
      if (!self.noAudio) {
        self._setupCodecs();
      }

      return self;
    },

    /**
     * Check for browser support for various codecs and cache the results.
     * @return {Howler}
     */
    _setupCodecs: function() {
      var self = this || Howler;
      var audioTest = null;

      // Must wrap in a try/catch because IE11 in server mode throws an error.
      try {
        audioTest = (typeof Audio !== 'undefined') ? new Audio() : null;
      } catch (err) {
        return self;
      }

      if (!audioTest || typeof audioTest.canPlayType !== 'function') {
        return self;
      }

      var mpegTest = audioTest.canPlayType('audio/mpeg;').replace(/^no$/, '');

      // Opera version <33 has mixed MP3 support, so we need to check for and block it.
      var checkOpera = self._navigator && self._navigator.userAgent.match(/OPR\/([0-6].)/g);
      var isOldOpera = (checkOpera && parseInt(checkOpera[0].split('/')[1], 10) < 33);

      self._codecs = {
        mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType('audio/mp3;').replace(/^no$/, ''))),
        mpeg: !!mpegTest,
        opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
        ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''),
        aac: !!audioTest.canPlayType('audio/aac;').replace(/^no$/, ''),
        caf: !!audioTest.canPlayType('audio/x-caf;').replace(/^no$/, ''),
        m4a: !!(audioTest.canPlayType('audio/x-m4a;') || audioTest.canPlayType('audio/m4a;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        mp4: !!(audioTest.canPlayType('audio/x-mp4;') || audioTest.canPlayType('audio/mp4;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        weba: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
        webm: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
        dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ''),
        flac: !!(audioTest.canPlayType('audio/x-flac;') || audioTest.canPlayType('audio/flac;')).replace(/^no$/, '')
      };

      return self;
    },

    /**
     * Mobile browsers will only allow audio to be played after a user interaction.
     * Attempt to automatically unlock audio on the first user interaction.
     * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
     * @return {Howler}
     */
    _enableMobileAudio: function() {
      var self = this || Howler;

      // Only run this on mobile devices if audio isn't already eanbled.
      var isMobile = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(self._navigator && self._navigator.userAgent);
      var isTouch = !!(('ontouchend' in window) || (self._navigator && self._navigator.maxTouchPoints > 0) || (self._navigator && self._navigator.msMaxTouchPoints > 0));
      if (self._mobileEnabled || !self.ctx || (!isMobile && !isTouch)) {
        return;
      }

      self._mobileEnabled = false;

      // Some mobile devices/platforms have distortion issues when opening/closing tabs and/or web views.
      // Bugs in the browser (especially Mobile Safari) can cause the sampleRate to change from 44100 to 48000.
      // By calling Howler.unload(), we create a new AudioContext with the correct sampleRate.
      if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
        self._mobileUnloaded = true;
        self.unload();
      }

      // Scratch buffer for enabling iOS to dispose of web audio buffers correctly, as per:
      // http://stackoverflow.com/questions/24119684
      self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);

      // Call this method on touch start to create and play a buffer,
      // then check if the audio actually played to determine if
      // audio has now been unlocked on iOS, Android, etc.
      var unlock = function() {
        // Fix Android can not play in suspend state.
        Howler._autoResume();

        // Create an empty buffer.
        var source = self.ctx.createBufferSource();
        source.buffer = self._scratchBuffer;
        source.connect(self.ctx.destination);

        // Play the empty buffer.
        if (typeof source.start === 'undefined') {
          source.noteOn(0);
        } else {
          source.start(0);
        }

        // Calling resume() on a stack initiated by user gesture is what actually unlocks the audio on Android Chrome >= 55.
        if (typeof self.ctx.resume === 'function') {
          self.ctx.resume();
        }

        // Setup a timeout to check that we are unlocked on the next event loop.
        source.onended = function() {
          source.disconnect(0);

          // Update the unlocked state and prevent this check from happening again.
          self._mobileEnabled = true;
          self.mobileAutoEnable = false;

          // Remove the touch start listener.
          document.removeEventListener('touchend', unlock, true);
        };
      };

      // Setup a touch start listener to attempt an unlock in.
      document.addEventListener('touchend', unlock, true);

      return self;
    },

    /**
     * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
     * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
     * @return {Howler}
     */
    _autoSuspend: function() {
      var self = this;

      if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === 'undefined' || !Howler.usingWebAudio) {
        return;
      }

      // Check if any sounds are playing.
      for (var i=0; i<self._howls.length; i++) {
        if (self._howls[i]._webAudio) {
          for (var j=0; j<self._howls[i]._sounds.length; j++) {
            if (!self._howls[i]._sounds[j]._paused) {
              return self;
            }
          }
        }
      }

      if (self._suspendTimer) {
        clearTimeout(self._suspendTimer);
      }

      // If no sound has played after 30 seconds, suspend the context.
      self._suspendTimer = setTimeout(function() {
        if (!self.autoSuspend) {
          return;
        }

        self._suspendTimer = null;
        self.state = 'suspending';
        self.ctx.suspend().then(function() {
          self.state = 'suspended';

          if (self._resumeAfterSuspend) {
            delete self._resumeAfterSuspend;
            self._autoResume();
          }
        });
      }, 30000);

      return self;
    },

    /**
     * Automatically resume the Web Audio AudioContext when a new sound is played.
     * @return {Howler}
     */
    _autoResume: function() {
      var self = this;

      if (!self.ctx || typeof self.ctx.resume === 'undefined' || !Howler.usingWebAudio) {
        return;
      }

      if (self.state === 'running' && self._suspendTimer) {
        clearTimeout(self._suspendTimer);
        self._suspendTimer = null;
      } else if (self.state === 'suspended') {
        self.ctx.resume().then(function() {
          self.state = 'running';

          // Emit to all Howls that the audio has resumed.
          for (var i=0; i<self._howls.length; i++) {
            self._howls[i]._emit('resume');
          }
        });

        if (self._suspendTimer) {
          clearTimeout(self._suspendTimer);
          self._suspendTimer = null;
        }
      } else if (self.state === 'suspending') {
        self._resumeAfterSuspend = true;
      }

      return self;
    }
  };

  // Setup the global audio controller.
  var Howler = new HowlerGlobal();

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Create an audio group controller.
   * @param {Object} o Passed in properties for this group.
   */
  var Howl = function(o) {
    var self = this;

    // Throw an error if no source is provided.
    if (!o.src || o.src.length === 0) {
      console.error('An array of source files must be passed with any new Howl.');
      return;
    }

    self.init(o);
  };
  Howl.prototype = {
    /**
     * Initialize a new Howl group object.
     * @param  {Object} o Passed in properties for this group.
     * @return {Howl}
     */
    init: function(o) {
      var self = this;

      // If we don't have an AudioContext created yet, run the setup.
      if (!Howler.ctx) {
        setupAudioContext();
      }

      // Setup user-defined default properties.
      self._autoplay = o.autoplay || false;
      self._format = (typeof o.format !== 'string') ? o.format : [o.format];
      self._html5 = o.html5 || false;
      self._muted = o.mute || false;
      self._loop = o.loop || false;
      self._pool = o.pool || 5;
      self._preload = (typeof o.preload === 'boolean') ? o.preload : true;
      self._rate = o.rate || 1;
      self._sprite = o.sprite || {};
      self._src = (typeof o.src !== 'string') ? o.src : [o.src];
      self._volume = o.volume !== undefined ? o.volume : 1;

      // Setup all other default properties.
      self._duration = 0;
      self._state = 'unloaded';
      self._sounds = [];
      self._endTimers = {};
      self._queue = [];

      // Setup event listeners.
      self._onend = o.onend ? [{fn: o.onend}] : [];
      self._onfade = o.onfade ? [{fn: o.onfade}] : [];
      self._onload = o.onload ? [{fn: o.onload}] : [];
      self._onloaderror = o.onloaderror ? [{fn: o.onloaderror}] : [];
      self._onpause = o.onpause ? [{fn: o.onpause}] : [];
      self._onplay = o.onplay ? [{fn: o.onplay}] : [];
      self._onstop = o.onstop ? [{fn: o.onstop}] : [];
      self._onmute = o.onmute ? [{fn: o.onmute}] : [];
      self._onvolume = o.onvolume ? [{fn: o.onvolume}] : [];
      self._onrate = o.onrate ? [{fn: o.onrate}] : [];
      self._onseek = o.onseek ? [{fn: o.onseek}] : [];
      self._onresume = [];

      // Web Audio or HTML5 Audio?
      self._webAudio = Howler.usingWebAudio && !self._html5;

      // Automatically try to enable audio on iOS.
      if (typeof Howler.ctx !== 'undefined' && Howler.ctx && Howler.mobileAutoEnable) {
        Howler._enableMobileAudio();
      }

      // Keep track of this Howl group in the global controller.
      Howler._howls.push(self);

      // If they selected autoplay, add a play event to the load queue.
      if (self._autoplay) {
        self._queue.push({
          event: 'play',
          action: function() {
            self.play();
          }
        });
      }

      // Load the source file unless otherwise specified.
      if (self._preload) {
        self.load();
      }

      return self;
    },

    /**
     * Load the audio file.
     * @return {Howler}
     */
    load: function() {
      var self = this;
      var url = null;

      // If no audio is available, quit immediately.
      if (Howler.noAudio) {
        self._emit('loaderror', null, 'No audio support.');
        return;
      }

      // Make sure our source is in an array.
      if (typeof self._src === 'string') {
        self._src = [self._src];
      }

      // Loop through the sources and pick the first one that is compatible.
      for (var i=0; i<self._src.length; i++) {
        var ext, str;

        if (self._format && self._format[i]) {
          // If an extension was specified, use that instead.
          ext = self._format[i];
        } else {
          // Make sure the source is a string.
          str = self._src[i];
          if (typeof str !== 'string') {
            self._emit('loaderror', null, 'Non-string found in selected audio sources - ignoring.');
            continue;
          }

          // Extract the file extension from the URL or base64 data URI.
          ext = /^data:audio\/([^;,]+);/i.exec(str);
          if (!ext) {
            ext = /\.([^.]+)$/.exec(str.split('?', 1)[0]);
          }

          if (ext) {
            ext = ext[1].toLowerCase();
          }
        }

        // Log a warning if no extension was found.
        if (!ext) {
          console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
        }

        // Check if this extension is available.
        if (ext && Howler.codecs(ext)) {
          url = self._src[i];
          break;
        }
      }

      if (!url) {
        self._emit('loaderror', null, 'No codec support for selected audio sources.');
        return;
      }

      self._src = url;
      self._state = 'loading';

      // If the hosting page is HTTPS and the source isn't,
      // drop down to HTML5 Audio to avoid Mixed Content errors.
      if (window.location.protocol === 'https:' && url.slice(0, 5) === 'http:') {
        self._html5 = true;
        self._webAudio = false;
      }

      // Create a new sound object and add it to the pool.
      new Sound(self);

      // Load and decode the audio data for playback.
      if (self._webAudio) {
        loadBuffer(self);
      }

      return self;
    },

    /**
     * Play a sound or resume previous playback.
     * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
     * @param  {Boolean} internal Internal Use: true prevents event firing.
     * @return {Number}          Sound ID.
     */
    play: function(sprite, internal) {
      var self = this;
      var id = null;

      // Determine if a sprite, sound id or nothing was passed
      if (typeof sprite === 'number') {
        id = sprite;
        sprite = null;
      } else if (typeof sprite === 'string' && self._state === 'loaded' && !self._sprite[sprite]) {
        // If the passed sprite doesn't exist, do nothing.
        return null;
      } else if (typeof sprite === 'undefined') {
        // Use the default sound sprite (plays the full audio length).
        sprite = '__default';

        // Check if there is a single paused sound that isn't ended.
        // If there is, play that sound. If not, continue as usual.
        var num = 0;
        for (var i=0; i<self._sounds.length; i++) {
          if (self._sounds[i]._paused && !self._sounds[i]._ended) {
            num++;
            id = self._sounds[i]._id;
          }
        }

        if (num === 1) {
          sprite = null;
        } else {
          id = null;
        }
      }

      // Get the selected node, or get one from the pool.
      var sound = id ? self._soundById(id) : self._inactiveSound();

      // If the sound doesn't exist, do nothing.
      if (!sound) {
        return null;
      }

      // Select the sprite definition.
      if (id && !sprite) {
        sprite = sound._sprite || '__default';
      }

      // If the sound hasn't loaded, we must wait to get the audio's duration.
      // We also need to wait to make sure we don't run into race conditions with
      // the order of function calls.
      if (self._state !== 'loaded') {
        // Set the sprite value on this sound.
        sound._sprite = sprite;

        // Makr this sounded as not ended in case another sound is played before this one loads.
        sound._ended = false;

        // Add the sound to the queue to be played on load.
        var soundId = sound._id;
        self._queue.push({
          event: 'play',
          action: function() {
            self.play(soundId);
          }
        });

        return soundId;
      }

      // Don't play the sound if an id was passed and it is already playing.
      if (id && !sound._paused) {
        // Trigger the play event, in order to keep iterating through queue.
        if (!internal) {
          setTimeout(function() {
            self._emit('play', sound._id);
          }, 0);
        }

        return sound._id;
      }

      // Make sure the AudioContext isn't suspended, and resume it if it is.
      if (self._webAudio) {
        Howler._autoResume();
      }

      // Determine how long to play for and where to start playing.
      var seek = Math.max(0, sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1000);
      var duration = Math.max(0, ((self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000) - seek);
      var timeout = (duration * 1000) / Math.abs(sound._rate);

      // Update the parameters of the sound
      sound._paused = false;
      sound._ended = false;
      sound._sprite = sprite;
      sound._seek = seek;
      sound._start = self._sprite[sprite][0] / 1000;
      sound._stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000;
      sound._loop = !!(sound._loop || self._sprite[sprite][2]);

      // Begin the actual playback.
      var node = sound._node;
      if (self._webAudio) {
        // Fire this when the sound is ready to play to begin Web Audio playback.
        var playWebAudio = function() {
          self._refreshBuffer(sound);

          // Setup the playback params.
          var vol = (sound._muted || self._muted) ? 0 : sound._volume;
          node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
          sound._playStart = Howler.ctx.currentTime;

          // Play the sound using the supported method.
          if (typeof node.bufferSource.start === 'undefined') {
            sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
          } else {
            sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
          }

          // Start a new timer if none is present.
          if (timeout !== Infinity) {
            self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
          }

          if (!internal) {
            setTimeout(function() {
              self._emit('play', sound._id);
            }, 0);
          }
        };

        var isRunning = (Howler.state === 'running');
        if (self._state === 'loaded' && isRunning) {
          playWebAudio();
        } else {
          // Wait for the audio to load and then begin playback.
          var event = !isRunning && self._state === 'loaded' ? 'resume' : 'load';
          self.once(event, playWebAudio, isRunning ? sound._id : null);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      } else {
        // Fire this when the sound is ready to play to begin HTML5 Audio playback.
        var playHtml5 = function() {
          node.currentTime = seek;
          node.muted = sound._muted || self._muted || Howler._muted || node.muted;
          node.volume = sound._volume * Howler.volume();
          node.playbackRate = sound._rate;
          node.play();

          // Setup the new end timer.
          if (timeout !== Infinity) {
            self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
          }

          if (!internal) {
            self._emit('play', sound._id);
          }
        };

        // Play immediately if ready, or wait for the 'canplaythrough'e vent.
        var loadedNoReadyState = (self._state === 'loaded' && (window && window.ejecta || !node.readyState && Howler._navigator.isCocoonJS));
        if (node.readyState === 4 || loadedNoReadyState) {
          playHtml5();
        } else {
          var listener = function() {
            // Begin playback.
            playHtml5();

            // Clear this listener.
            node.removeEventListener(Howler._canPlayEvent, listener, false);
          };
          node.addEventListener(Howler._canPlayEvent, listener, false);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      }

      return sound._id;
    },

    /**
     * Pause playback and save current position.
     * @param  {Number} id The sound ID (empty to pause all in group).
     * @return {Howl}
     */
    pause: function(id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to pause when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'pause',
          action: function() {
            self.pause(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be paused.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound && !sound._paused) {
          // Reset the seek position.
          sound._seek = self.seek(ids[i]);
          sound._rateSeek = 0;
          sound._paused = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // Make sure the sound has been created.
              if (!sound._node.bufferSource) {
                continue;
              }

              if (typeof sound._node.bufferSource.stop === 'undefined') {
                sound._node.bufferSource.noteOff(0);
              } else {
                sound._node.bufferSource.stop(0);
              }

              // Clean up the buffer source.
              self._cleanBuffer(sound._node);
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.pause();
            }
          }
        }

        // Fire the pause event, unless `true` is passed as the 2nd argument.
        if (!arguments[1]) {
          self._emit('pause', sound ? sound._id : null);
        }
      }

      return self;
    },

    /**
     * Stop playback and reset to start.
     * @param  {Number} id The sound ID (empty to stop all in group).
     * @param  {Boolean} internal Internal Use: true prevents event firing.
     * @return {Howl}
     */
    stop: function(id, internal) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to stop when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'stop',
          action: function() {
            self.stop(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be stopped.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          // Reset the seek position.
          sound._seek = sound._start || 0;
          sound._rateSeek = 0;
          sound._paused = true;
          sound._ended = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // Make sure the sound's AudioBufferSourceNode has been created.
              if (sound._node.bufferSource) {
                if (typeof sound._node.bufferSource.stop === 'undefined') {
                  sound._node.bufferSource.noteOff(0);
                } else {
                  sound._node.bufferSource.stop(0);
                }

                // Clean up the buffer source.
                self._cleanBuffer(sound._node);
              }
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.currentTime = sound._start || 0;
              sound._node.pause();
            }
          }

          if (!internal) {
            self._emit('stop', sound._id);
          }
        }
      }

      return self;
    },

    /**
     * Mute/unmute a single sound or all sounds in this Howl group.
     * @param  {Boolean} muted Set to true to mute and false to unmute.
     * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
     * @return {Howl}
     */
    mute: function(muted, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to mute when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'mute',
          action: function() {
            self.mute(muted, id);
          }
        });

        return self;
      }

      // If applying mute/unmute to all sounds, update the group's value.
      if (typeof id === 'undefined') {
        if (typeof muted === 'boolean') {
          self._muted = muted;
        } else {
          return self._muted;
        }
      }

      // If no id is passed, get all ID's to be muted.
      var ids = self._getSoundIds(id);

      for (var i=0; i<ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          sound._muted = muted;

          if (self._webAudio && sound._node) {
            sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler.ctx.currentTime);
          } else if (sound._node) {
            sound._node.muted = Howler._muted ? true : muted;
          }

          self._emit('mute', sound._id);
        }
      }

      return self;
    },

    /**
     * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
     *   volume() -> Returns the group's volume value.
     *   volume(id) -> Returns the sound id's current volume.
     *   volume(vol) -> Sets the volume of all sounds in this Howl group.
     *   volume(vol, id) -> Sets the volume of passed sound id.
     * @return {Howl/Number} Returns self or current volume.
     */
    volume: function() {
      var self = this;
      var args = arguments;
      var vol, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // Return the value of the groups' volume.
        return self._volume;
      } else if (args.length === 1 || args.length === 2 && typeof args[1] === 'undefined') {
        // First check if this is an ID, and if not, assume it is a new volume.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          vol = parseFloat(args[0]);
        }
      } else if (args.length >= 2) {
        vol = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the volume or return the current volume.
      var sound;
      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        // If the sound hasn't loaded, add it to the load queue to change volume when capable.
        if (self._state !== 'loaded') {
          self._queue.push({
            event: 'volume',
            action: function() {
              self.volume.apply(self, args);
            }
          });

          return self;
        }

        // Set the group volume.
        if (typeof id === 'undefined') {
          self._volume = vol;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i=0; i<id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            sound._volume = vol;

            // Stop currently running fades.
            if (!args[2]) {
              self._stopFade(id[i]);
            }

            if (self._webAudio && sound._node && !sound._muted) {
              sound._node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
            } else if (sound._node && !sound._muted) {
              sound._node.volume = vol * Howler.volume();
            }

            self._emit('volume', sound._id);
          }
        }
      } else {
        sound = id ? self._soundById(id) : self._sounds[0];
        return sound ? sound._volume : 0;
      }

      return self;
    },

    /**
     * Fade a currently playing sound between two volumes (if no id is passsed, all sounds will fade).
     * @param  {Number} from The value to fade from (0.0 to 1.0).
     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
     * @param  {Number} len  Time in milliseconds to fade.
     * @param  {Number} id   The sound id (omit to fade all sounds).
     * @return {Howl}
     */
    fade: function(from, to, len, id) {
      var self = this;
      var diff = Math.abs(from - to);
      var dir = from > to ? 'out' : 'in';
      var steps = diff / 0.01;
      var stepLen = (steps > 0) ? len / steps : len;

      // Since browsers clamp timeouts to 4ms, we need to clamp our steps to that too.
      if (stepLen < 4) {
        steps = Math.ceil(steps / (4 / stepLen));
        stepLen = 4;
      }

      // If the sound hasn't loaded, add it to the load queue to fade when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'fade',
          action: function() {
            self.fade(from, to, len, id);
          }
        });

        return self;
      }

      // Set the volume to the start position.
      self.volume(from, id);

      // Fade the volume of one or all sounds.
      var ids = self._getSoundIds(id);
      for (var i=0; i<ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        // Create a linear fade or fall back to timeouts with HTML5 Audio.
        if (sound) {
          // Stop the previous fade if no sprite is being used (otherwise, volume handles this).
          if (!id) {
            self._stopFade(ids[i]);
          }

          // If we are using Web Audio, let the native methods do the actual fade.
          if (self._webAudio && !sound._muted) {
            var currentTime = Howler.ctx.currentTime;
            var end = currentTime + (len / 1000);
            sound._volume = from;
            sound._node.gain.setValueAtTime(from, currentTime);
            sound._node.gain.linearRampToValueAtTime(to, end);
          }

          var vol = from;
          sound._interval = setInterval(function(soundId, sound) {
            // Update the volume amount, but only if the volume should change.
            if (steps > 0) {
              vol += (dir === 'in' ? 0.01 : -0.01);
            }

            // Make sure the volume is in the right bounds.
            vol = Math.max(0, vol);
            vol = Math.min(1, vol);

            // Round to within 2 decimal points.
            vol = Math.round(vol * 100) / 100;

            // Change the volume.
            if (self._webAudio) {
              if (typeof id === 'undefined') {
                self._volume = vol;
              }

              sound._volume = vol;
            } else {
              self.volume(vol, soundId, true);
            }

            // When the fade is complete, stop it and fire event.
            if ((to < from && vol <= to) || (to > from && vol >= to)) {
              clearInterval(sound._interval);
              sound._interval = null;
              self.volume(to, soundId);
              self._emit('fade', soundId);
            }
          }.bind(self, ids[i], sound), stepLen);
        }
      }

      return self;
    },

    /**
     * Internal method that stops the currently playing fade when
     * a new fade starts, volume is changed or the sound is stopped.
     * @param  {Number} id The sound id.
     * @return {Howl}
     */
    _stopFade: function(id) {
      var self = this;
      var sound = self._soundById(id);

      if (sound && sound._interval) {
        if (self._webAudio) {
          sound._node.gain.cancelScheduledValues(Howler.ctx.currentTime);
        }

        clearInterval(sound._interval);
        sound._interval = null;
        self._emit('fade', id);
      }

      return self;
    },

    /**
     * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
     *   loop() -> Returns the group's loop value.
     *   loop(id) -> Returns the sound id's loop value.
     *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
     *   loop(loop, id) -> Sets the loop value of passed sound id.
     * @return {Howl/Boolean} Returns self or current loop value.
     */
    loop: function() {
      var self = this;
      var args = arguments;
      var loop, id, sound;

      // Determine the values for loop and id.
      if (args.length === 0) {
        // Return the grou's loop value.
        return self._loop;
      } else if (args.length === 1) {
        if (typeof args[0] === 'boolean') {
          loop = args[0];
          self._loop = loop;
        } else {
          // Return this sound's loop value.
          sound = self._soundById(parseInt(args[0], 10));
          return sound ? sound._loop : false;
        }
      } else if (args.length === 2) {
        loop = args[0];
        id = parseInt(args[1], 10);
      }

      // If no id is passed, get all ID's to be looped.
      var ids = self._getSoundIds(id);
      for (var i=0; i<ids.length; i++) {
        sound = self._soundById(ids[i]);

        if (sound) {
          sound._loop = loop;
          if (self._webAudio && sound._node && sound._node.bufferSource) {
            sound._node.bufferSource.loop = loop;
            if (loop) {
              sound._node.bufferSource.loopStart = sound._start || 0;
              sound._node.bufferSource.loopEnd = sound._stop;
            }
          }
        }
      }

      return self;
    },

    /**
     * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   rate() -> Returns the first sound node's current playback rate.
     *   rate(id) -> Returns the sound id's current playback rate.
     *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
     *   rate(rate, id) -> Sets the playback rate of passed sound id.
     * @return {Howl/Number} Returns self or the current playback rate.
     */
    rate: function() {
      var self = this;
      var args = arguments;
      var rate, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current rate of the first node.
        id = self._sounds[0]._id;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new rate value.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          rate = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        rate = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the playback rate or return the current value.
      var sound;
      if (typeof rate === 'number') {
        // If the sound hasn't loaded, add it to the load queue to change playback rate when capable.
        if (self._state !== 'loaded') {
          self._queue.push({
            event: 'rate',
            action: function() {
              self.rate.apply(self, args);
            }
          });

          return self;
        }

        // Set the group rate.
        if (typeof id === 'undefined') {
          self._rate = rate;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i=0; i<id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            // Keep track of our position when the rate changed and update the playback
            // start position so we can properly adjust the seek position for time elapsed.
            sound._rateSeek = self.seek(id[i]);
            sound._playStart = self._webAudio ? Howler.ctx.currentTime : sound._playStart;
            sound._rate = rate;

            // Change the playback rate.
            if (self._webAudio && sound._node && sound._node.bufferSource) {
              sound._node.bufferSource.playbackRate.value = rate;
            } else if (sound._node) {
              sound._node.playbackRate = rate;
            }

            // Reset the timers.
            var seek = self.seek(id[i]);
            var duration = ((self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1000) - seek;
            var timeout = (duration * 1000) / Math.abs(sound._rate);

            // Start a new end timer if sound is already playing.
            if (self._endTimers[id[i]] || !sound._paused) {
              self._clearTimer(id[i]);
              self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);
            }

            self._emit('rate', sound._id);
          }
        }
      } else {
        sound = self._soundById(id);
        return sound ? sound._rate : self._rate;
      }

      return self;
    },

    /**
     * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   seek() -> Returns the first sound node's current seek position.
     *   seek(id) -> Returns the sound id's current seek position.
     *   seek(seek) -> Sets the seek position of the first sound node.
     *   seek(seek, id) -> Sets the seek position of passed sound id.
     * @return {Howl/Number} Returns self or the current seek position.
     */
    seek: function() {
      var self = this;
      var args = arguments;
      var seek, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current position of the first node.
        id = self._sounds[0]._id;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new seek position.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          id = self._sounds[0]._id;
          seek = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        seek = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // If there is no ID, bail out.
      if (typeof id === 'undefined') {
        return self;
      }

      // If the sound hasn't loaded, add it to the load queue to seek when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'seek',
          action: function() {
            self.seek.apply(self, args);
          }
        });

        return self;
      }

      // Get the sound.
      var sound = self._soundById(id);

      if (sound) {
        if (typeof seek === 'number' && seek >= 0) {
          // Pause the sound and update position for restarting playback.
          var playing = self.playing(id);
          if (playing) {
            self.pause(id, true);
          }

          // Move the position of the track and cancel timer.
          sound._seek = seek;
          sound._ended = false;
          self._clearTimer(id);

          // Restart the playback if the sound was playing.
          if (playing) {
            self.play(id, true);
          }

          // Update the seek position for HTML5 Audio.
          if (!self._webAudio && sound._node) {
            sound._node.currentTime = seek;
          }

          self._emit('seek', id);
        } else {
          if (self._webAudio) {
            var realTime = self.playing(id) ? Howler.ctx.currentTime - sound._playStart : 0;
            var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
            return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
          } else {
            return sound._node.currentTime;
          }
        }
      }

      return self;
    },

    /**
     * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
     * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
     * @return {Boolean} True if playing and false if not.
     */
    playing: function(id) {
      var self = this;

      // Check the passed sound ID (if any).
      if (typeof id === 'number') {
        var sound = self._soundById(id);
        return sound ? !sound._paused : false;
      }

      // Otherwise, loop through all sounds and check if any are playing.
      for (var i=0; i<self._sounds.length; i++) {
        if (!self._sounds[i]._paused) {
          return true;
        }
      }

      return false;
    },

    /**
     * Get the duration of this sound. Passing a sound id will return the sprite duration.
     * @param  {Number} id The sound id to check. If none is passed, return full source duration.
     * @return {Number} Audio duration in seconds.
     */
    duration: function(id) {
      var self = this;
      var duration = self._duration;

      // If we pass an ID, get the sound and return the sprite length.
      var sound = self._soundById(id);
      if (sound) {
        duration = self._sprite[sound._sprite][1] / 1000;
      }

      return duration;
    },

    /**
     * Returns the current loaded state of this Howl.
     * @return {String} 'unloaded', 'loading', 'loaded'
     */
    state: function() {
      return this._state;
    },

    /**
     * Unload and destroy the current Howl object.
     * This will immediately stop all sound instances attached to this group.
     */
    unload: function() {
      var self = this;

      // Stop playing any active sounds.
      var sounds = self._sounds;
      for (var i=0; i<sounds.length; i++) {
        // Stop the sound if it is currently playing.
        if (!sounds[i]._paused) {
          self.stop(sounds[i]._id);
        }

        // Remove the source or disconnect.
        if (!self._webAudio) {
          // Set the source to 0-second silence to stop any downloading (except in IE).
          var checkIE = /MSIE |Trident\//.test(Howler._navigator && Howler._navigator.userAgent);
          if (!checkIE) {
            sounds[i]._node.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
          }

          // Remove any event listeners.
          sounds[i]._node.removeEventListener('error', sounds[i]._errorFn, false);
          sounds[i]._node.removeEventListener(Howler._canPlayEvent, sounds[i]._loadFn, false);
        }

        // Empty out all of the nodes.
        delete sounds[i]._node;

        // Make sure all timers are cleared out.
        self._clearTimer(sounds[i]._id);

        // Remove the references in the global Howler object.
        var index = Howler._howls.indexOf(self);
        if (index >= 0) {
          Howler._howls.splice(index, 1);
        }
      }

      // Delete this sound from the cache (if no other Howl is using it).
      var remCache = true;
      for (i=0; i<Howler._howls.length; i++) {
        if (Howler._howls[i]._src === self._src) {
          remCache = false;
          break;
        }
      }

      if (cache && remCache) {
        delete cache[self._src];
      }

      // Clear global errors.
      Howler.noAudio = false;

      // Clear out `self`.
      self._state = 'unloaded';
      self._sounds = [];
      self = null;

      return null;
    },

    /**
     * Listen to a custom event.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
     * @return {Howl}
     */
    on: function(event, fn, id, once) {
      var self = this;
      var events = self['_on' + event];

      if (typeof fn === 'function') {
        events.push(once ? {id: id, fn: fn, once: once} : {id: id, fn: fn});
      }

      return self;
    },

    /**
     * Remove a custom event. Call without parameters to remove all events.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to remove. Leave empty to remove all.
     * @param  {Number}   id    (optional) Only remove events for this sound.
     * @return {Howl}
     */
    off: function(event, fn, id) {
      var self = this;
      var events = self['_on' + event];
      var i = 0;

      // Allow passing just an event and ID.
      if (typeof fn === 'number') {
        id = fn;
        fn = null;
      }

      if (fn || id) {
        // Loop through event store and remove the passed function.
        for (i=0; i<events.length; i++) {
          var isId = (id === events[i].id);
          if (fn === events[i].fn && isId || !fn && isId) {
            events.splice(i, 1);
            break;
          }
        }
      } else if (event) {
        // Clear out all events of this type.
        self['_on' + event] = [];
      } else {
        // Clear out all events of every type.
        var keys = Object.keys(self);
        for (i=0; i<keys.length; i++) {
          if ((keys[i].indexOf('_on') === 0) && Array.isArray(self[keys[i]])) {
            self[keys[i]] = [];
          }
        }
      }

      return self;
    },

    /**
     * Listen to a custom event and remove it once fired.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @return {Howl}
     */
    once: function(event, fn, id) {
      var self = this;

      // Setup the event listener.
      self.on(event, fn, id, 1);

      return self;
    },

    /**
     * Emit all events of a specific type and pass the sound id.
     * @param  {String} event Event name.
     * @param  {Number} id    Sound ID.
     * @param  {Number} msg   Message to go with event.
     * @return {Howl}
     */
    _emit: function(event, id, msg) {
      var self = this;
      var events = self['_on' + event];

      // Loop through event store and fire all functions.
      for (var i=events.length-1; i>=0; i--) {
        if (!events[i].id || events[i].id === id || event === 'load') {
          setTimeout(function(fn) {
            fn.call(this, id, msg);
          }.bind(self, events[i].fn), 0);

          // If this event was setup with `once`, remove it.
          if (events[i].once) {
            self.off(event, events[i].fn, events[i].id);
          }
        }
      }

      return self;
    },

    /**
     * Queue of actions initiated before the sound has loaded.
     * These will be called in sequence, with the next only firing
     * after the previous has finished executing (even if async like play).
     * @return {Howl}
     */
    _loadQueue: function() {
      var self = this;

      if (self._queue.length > 0) {
        var task = self._queue[0];

        // don't move onto the next task until this one is done
        self.once(task.event, function() {
          self._queue.shift();
          self._loadQueue();
        });

        task.action();
      }

      return self;
    },

    /**
     * Fired when playback ends at the end of the duration.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _ended: function(sound) {
      var self = this;
      var sprite = sound._sprite;

      // If we are using IE and there was network latency we may be clipping
      // audio before it completes playing. Lets check the node to make sure it
      // believes it has completed, before ending the playback.
      if (!self._webAudio && self._node && !self._node.ended) {
        setTimeout(self._ended.bind(self, sound), 100);
        return self;
      }

      // Should this sound loop?
      var loop = !!(sound._loop || self._sprite[sprite][2]);

      // Fire the ended event.
      self._emit('end', sound._id);

      // Restart the playback for HTML5 Audio loop.
      if (!self._webAudio && loop) {
        self.stop(sound._id, true).play(sound._id);
      }

      // Restart this timer if on a Web Audio loop.
      if (self._webAudio && loop) {
        self._emit('play', sound._id);
        sound._seek = sound._start || 0;
        sound._rateSeek = 0;
        sound._playStart = Howler.ctx.currentTime;

        var timeout = ((sound._stop - sound._start) * 1000) / Math.abs(sound._rate);
        self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
      }

      // Mark the node as paused.
      if (self._webAudio && !loop) {
        sound._paused = true;
        sound._ended = true;
        sound._seek = sound._start || 0;
        sound._rateSeek = 0;
        self._clearTimer(sound._id);

        // Clean up the buffer source.
        self._cleanBuffer(sound._node);

        // Attempt to auto-suspend AudioContext if no sounds are still playing.
        Howler._autoSuspend();
      }

      // When using a sprite, end the track.
      if (!self._webAudio && !loop) {
        self.stop(sound._id);
      }

      return self;
    },

    /**
     * Clear the end timer for a sound playback.
     * @param  {Number} id The sound ID.
     * @return {Howl}
     */
    _clearTimer: function(id) {
      var self = this;

      if (self._endTimers[id]) {
        clearTimeout(self._endTimers[id]);
        delete self._endTimers[id];
      }

      return self;
    },

    /**
     * Return the sound identified by this ID, or return null.
     * @param  {Number} id Sound ID
     * @return {Object}    Sound object or null.
     */
    _soundById: function(id) {
      var self = this;

      // Loop through all sounds and find the one with this ID.
      for (var i=0; i<self._sounds.length; i++) {
        if (id === self._sounds[i]._id) {
          return self._sounds[i];
        }
      }

      return null;
    },

    /**
     * Return an inactive sound from the pool or create a new one.
     * @return {Sound} Sound playback object.
     */
    _inactiveSound: function() {
      var self = this;

      self._drain();

      // Find the first inactive node to recycle.
      for (var i=0; i<self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          return self._sounds[i].reset();
        }
      }

      // If no inactive node was found, create a new one.
      return new Sound(self);
    },

    /**
     * Drain excess inactive sounds from the pool.
     */
    _drain: function() {
      var self = this;
      var limit = self._pool;
      var cnt = 0;
      var i = 0;

      // If there are less sounds than the max pool size, we are done.
      if (self._sounds.length < limit) {
        return;
      }

      // Count the number of inactive sounds.
      for (i=0; i<self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          cnt++;
        }
      }

      // Remove excess inactive sounds, going in reverse order.
      for (i=self._sounds.length - 1; i>=0; i--) {
        if (cnt <= limit) {
          return;
        }

        if (self._sounds[i]._ended) {
          // Disconnect the audio source when using Web Audio.
          if (self._webAudio && self._sounds[i]._node) {
            self._sounds[i]._node.disconnect(0);
          }

          // Remove sounds until we have the pool size.
          self._sounds.splice(i, 1);
          cnt--;
        }
      }
    },

    /**
     * Get all ID's from the sounds pool.
     * @param  {Number} id Only return one ID if one is passed.
     * @return {Array}    Array of IDs.
     */
    _getSoundIds: function(id) {
      var self = this;

      if (typeof id === 'undefined') {
        var ids = [];
        for (var i=0; i<self._sounds.length; i++) {
          ids.push(self._sounds[i]._id);
        }

        return ids;
      } else {
        return [id];
      }
    },

    /**
     * Load the sound back into the buffer source.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _refreshBuffer: function(sound) {
      var self = this;

      // Setup the buffer source for playback.
      sound._node.bufferSource = Howler.ctx.createBufferSource();
      sound._node.bufferSource.buffer = cache[self._src];

      // Connect to the correct node.
      if (sound._panner) {
        sound._node.bufferSource.connect(sound._panner);
      } else {
        sound._node.bufferSource.connect(sound._node);
      }

      // Setup looping and playback rate.
      sound._node.bufferSource.loop = sound._loop;
      if (sound._loop) {
        sound._node.bufferSource.loopStart = sound._start || 0;
        sound._node.bufferSource.loopEnd = sound._stop;
      }
      sound._node.bufferSource.playbackRate.value = sound._rate;

      return self;
    },

    /**
     * Prevent memory leaks by cleaning up the buffer source after playback.
     * @param  {Object} node Sound's audio node containing the buffer source.
     * @return {Howl}
     */
    _cleanBuffer: function(node) {
      var self = this;

      if (self._scratchBuffer) {
        node.bufferSource.onended = null;
        node.bufferSource.disconnect(0);
        try { node.bufferSource.buffer = self._scratchBuffer; } catch(e) {}
      }
      node.bufferSource = null;

      return self;
    }
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Setup the sound object, which each node attached to a Howl group is contained in.
   * @param {Object} howl The Howl parent group.
   */
  var Sound = function(howl) {
    this._parent = howl;
    this.init();
  };
  Sound.prototype = {
    /**
     * Initialize a new Sound object.
     * @return {Sound}
     */
    init: function() {
      var self = this;
      var parent = self._parent;

      // Setup the default parameters.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._rate = parent._rate;
      self._seek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a unique ID for this sound.
      self._id = ++Howler._counter;

      // Add itself to the parent's pool.
      parent._sounds.push(self);

      // Create the new node.
      self.create();

      return self;
    },

    /**
     * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
     * @return {Sound}
     */
    create: function() {
      var self = this;
      var parent = self._parent;
      var volume = (Howler._muted || self._muted || self._parent._muted) ? 0 : self._volume;

      if (parent._webAudio) {
        // Create the gain node for controlling volume (the source will connect to this).
        self._node = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
        self._node.gain.setValueAtTime(volume, Howler.ctx.currentTime);
        self._node.paused = true;
        self._node.connect(Howler.masterGain);
      } else {
        self._node = new Audio();

        // Listen for errors (http://dev.w3.org/html5/spec-author-view/spec.html#mediaerror).
        self._errorFn = self._errorListener.bind(self);
        self._node.addEventListener('error', self._errorFn, false);

        // Listen for 'canplaythrough' event to let us know the sound is ready.
        self._loadFn = self._loadListener.bind(self);
        self._node.addEventListener(Howler._canPlayEvent, self._loadFn, false);

        // Setup the new audio node.
        self._node.src = parent._src;
        self._node.preload = 'auto';
        self._node.volume = volume * Howler.volume();

        // Begin loading the source.
        self._node.load();
      }

      return self;
    },

    /**
     * Reset the parameters of this sound to the original state (for recycle).
     * @return {Sound}
     */
    reset: function() {
      var self = this;
      var parent = self._parent;

      // Reset all of the parameters of this sound.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._rate = parent._rate;
      self._seek = 0;
      self._rateSeek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a new ID so that it isn't confused with the previous sound.
      self._id = ++Howler._counter;

      return self;
    },

    /**
     * HTML5 Audio error listener callback.
     */
    _errorListener: function() {
      var self = this;

      // Fire an error event and pass back the code.
      self._parent._emit('loaderror', self._id, self._node.error ? self._node.error.code : 0);

      // Clear the event listener.
      self._node.removeEventListener('error', self._errorFn, false);
    },

    /**
     * HTML5 Audio canplaythrough listener callback.
     */
    _loadListener: function() {
      var self = this;
      var parent = self._parent;

      // Round up the duration to account for the lower precision in HTML5 Audio.
      parent._duration = Math.ceil(self._node.duration * 10) / 10;

      // Setup a sprite if none is defined.
      if (Object.keys(parent._sprite).length === 0) {
        parent._sprite = {__default: [0, parent._duration * 1000]};
      }

      if (parent._state !== 'loaded') {
        parent._state = 'loaded';
        parent._emit('load');
        parent._loadQueue();
      }

      // Clear the event listener.
      self._node.removeEventListener(Howler._canPlayEvent, self._loadFn, false);
    }
  };

  /** Helper Methods **/
  /***************************************************************************/

  var cache = {};

  /**
   * Buffer a sound from URL, Data URI or cache and decode to audio source (Web Audio API).
   * @param  {Howl} self
   */
  var loadBuffer = function(self) {
    var url = self._src;

    // Check if the buffer has already been cached and use it instead.
    if (cache[url]) {
      // Set the duration from the cache.
      self._duration = cache[url].duration;

      // Load the sound into this Howl.
      loadSound(self);

      return;
    }

    if (/^data:[^;]+;base64,/.test(url)) {
      // Decode the base64 data URI without XHR, since some browsers don't support it.
      var data = atob(url.split(',')[1]);
      var dataView = new Uint8Array(data.length);
      for (var i=0; i<data.length; ++i) {
        dataView[i] = data.charCodeAt(i);
      }

      decodeAudioData(dataView.buffer, self);
    } else {
      // Load the buffer from the URL.
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function() {
        // Make sure we get a successful response back.
        var code = (xhr.status + '')[0];
        if (code !== '0' && code !== '2' && code !== '3') {
          self._emit('loaderror', null, 'Failed loading audio file with status: ' + xhr.status + '.');
          return;
        }

        decodeAudioData(xhr.response, self);
      };
      xhr.onerror = function() {
        // If there is an error, switch to HTML5 Audio.
        if (self._webAudio) {
          self._html5 = true;
          self._webAudio = false;
          self._sounds = [];
          delete cache[url];
          self.load();
        }
      };
      safeXhrSend(xhr);
    }
  };

  /**
   * Send the XHR request wrapped in a try/catch.
   * @param  {Object} xhr XHR to send.
   */
  var safeXhrSend = function(xhr) {
    try {
      xhr.send();
    } catch (e) {
      xhr.onerror();
    }
  };

  /**
   * Decode audio data from an array buffer.
   * @param  {ArrayBuffer} arraybuffer The audio data.
   * @param  {Howl}        self
   */
  var decodeAudioData = function(arraybuffer, self) {
    // Decode the buffer into an audio source.
    Howler.ctx.decodeAudioData(arraybuffer, function(buffer) {
      if (buffer && self._sounds.length > 0) {
        cache[self._src] = buffer;
        loadSound(self, buffer);
      }
    }, function() {
      self._emit('loaderror', null, 'Decoding audio data failed.');
    });
  };

  /**
   * Sound is now loaded, so finish setting everything up and fire the loaded event.
   * @param  {Howl} self
   * @param  {Object} buffer The decoded buffer sound source.
   */
  var loadSound = function(self, buffer) {
    // Set the duration.
    if (buffer && !self._duration) {
      self._duration = buffer.duration;
    }

    // Setup a sprite if none is defined.
    if (Object.keys(self._sprite).length === 0) {
      self._sprite = {__default: [0, self._duration * 1000]};
    }

    // Fire the loaded event.
    if (self._state !== 'loaded') {
      self._state = 'loaded';
      self._emit('load');
      self._loadQueue();
    }
  };

  /**
   * Setup the audio context when available, or switch to HTML5 Audio mode.
   */
  var setupAudioContext = function() {
    // Check if we are using Web Audio and setup the AudioContext if we are.
    try {
      if (typeof AudioContext !== 'undefined') {
        Howler.ctx = new AudioContext();
      } else if (typeof webkitAudioContext !== 'undefined') {
        Howler.ctx = new webkitAudioContext();
      } else {
        Howler.usingWebAudio = false;
      }
    } catch(e) {
      Howler.usingWebAudio = false;
    }

    // Check if a webview is being used on iOS8 or earlier (rather than the browser).
    // If it is, disable Web Audio as it causes crashing.
    var iOS = (/iP(hone|od|ad)/.test(Howler._navigator && Howler._navigator.platform));
    var appVersion = Howler._navigator && Howler._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    var version = appVersion ? parseInt(appVersion[1], 10) : null;
    if (iOS && version && version < 9) {
      var safari = /safari/.test(Howler._navigator && Howler._navigator.userAgent.toLowerCase());
      if (Howler._navigator && Howler._navigator.standalone && !safari || Howler._navigator && !Howler._navigator.standalone && !safari) {
        Howler.usingWebAudio = false;
      }
    }

    // Create and expose the master GainNode when using Web Audio (useful for plugins or advanced usage).
    if (Howler.usingWebAudio) {
      Howler.masterGain = (typeof Howler.ctx.createGain === 'undefined') ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
      Howler.masterGain.gain.value = Howler._muted ? 0 : 1;
      Howler.masterGain.connect(Howler.ctx.destination);
    }

    // Re-run the setup on Howler.
    Howler._setup();
  };

  // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function() {
      return {
        Howler: Howler,
        Howl: Howl
      };
    }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  }

  // Add support for CommonJS libraries such as browserify.
  if (true) {
    exports.Howler = Howler;
    exports.Howl = Howl;
  }

  // Define globally in case AMD is not available or unused.
  if (typeof window !== 'undefined') {
    window.HowlerGlobal = HowlerGlobal;
    window.Howler = Howler;
    window.Howl = Howl;
    window.Sound = Sound;
  } else if (typeof global !== 'undefined') { // Add to global in Node.js (for testing, etc).
    global.HowlerGlobal = HowlerGlobal;
    global.Howler = Howler;
    global.Howl = Howl;
    global.Sound = Sound;
  }
})();


/*!
 *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
 *  
 *  howler.js v2.0.4
 *  howlerjs.com
 *
 *  (c) 2013-2017, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function() {

  'use strict';

  // Setup default properties.
  HowlerGlobal.prototype._pos = [0, 0, 0];
  HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];
  
  /** Global Methods **/
  /***************************************************************************/

  /**
   * Helper method to update the stereo panning position of all current Howls.
   * Future Howls will not use this value unless explicitly set.
   * @param  {Number} pan A value of -1.0 is all the way left and 1.0 is all the way right.
   * @return {Howler/Number}     Self or current stereo panning value.
   */
  HowlerGlobal.prototype.stereo = function(pan) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Loop through all Howls and update their stereo panning.
    for (var i=self._howls.length-1; i>=0; i--) {
      self._howls[i].stereo(pan);
    }

    return self;
  };

  /**
   * Get/set the position of the listener in 3D cartesian space. Sounds using
   * 3D position will be relative to the listener's position.
   * @param  {Number} x The x-position of the listener.
   * @param  {Number} y The y-position of the listener.
   * @param  {Number} z The z-position of the listener.
   * @return {Howler/Array}   Self or current listener position.
   */
  HowlerGlobal.prototype.pos = function(x, y, z) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? self._pos[1] : y;
    z = (typeof z !== 'number') ? self._pos[2] : z;

    if (typeof x === 'number') {
      self._pos = [x, y, z];
      self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
    } else {
      return self._pos;
    }

    return self;
  };

  /**
   * Get/set the direction the listener is pointing in the 3D cartesian space.
   * A front and up vector must be provided. The front is the direction the
   * face of the listener is pointing, and up is the direction the top of the
   * listener is pointing. Thus, these values are expected to be at right angles
   * from each other.
   * @param  {Number} x   The x-orientation of the listener.
   * @param  {Number} y   The y-orientation of the listener.
   * @param  {Number} z   The z-orientation of the listener.
   * @param  {Number} xUp The x-orientation of the top of the listener.
   * @param  {Number} yUp The y-orientation of the top of the listener.
   * @param  {Number} zUp The z-orientation of the top of the listener.
   * @return {Howler/Array}     Returns self or the current orientation vectors.
   */
  HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    var or = self._orientation;
    y = (typeof y !== 'number') ? or[1] : y;
    z = (typeof z !== 'number') ? or[2] : z;
    xUp = (typeof xUp !== 'number') ? or[3] : xUp;
    yUp = (typeof yUp !== 'number') ? or[4] : yUp;
    zUp = (typeof zUp !== 'number') ? or[5] : zUp;

    if (typeof x === 'number') {
      self._orientation = [x, y, z, xUp, yUp, zUp];
      self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
    } else {
      return or;
    }

    return self;
  };

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Add new properties to the core init.
   * @param  {Function} _super Core init method.
   * @return {Howl}
   */
  Howl.prototype.init = (function(_super) {
    return function(o) {
      var self = this;

      // Setup user-defined default properties.
      self._orientation = o.orientation || [1, 0, 0];
      self._stereo = o.stereo || null;
      self._pos = o.pos || null;
      self._pannerAttr = {
        coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : 360,
        coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : 360,
        coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : 0,
        distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : 'inverse',
        maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : 10000,
        panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : 'HRTF',
        refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : 1,
        rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : 1
      };

      // Setup event listeners.
      self._onstereo = o.onstereo ? [{fn: o.onstereo}] : [];
      self._onpos = o.onpos ? [{fn: o.onpos}] : [];
      self._onorientation = o.onorientation ? [{fn: o.onorientation}] : [];

      // Complete initilization with howler.js core's init function.
      return _super.call(this, o);
    };
  })(Howl.prototype.init);

  /**
   * Get/set the stereo panning of the audio source for this sound or all in the group.
   * @param  {Number} pan  A value of -1.0 is all the way left and 1.0 is all the way right.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Number}    Returns self or the current stereo panning value.
   */
  Howl.prototype.stereo = function(pan, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change stereo pan when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'stereo',
        action: function() {
          self.stereo(pan, id);
        }
      });

      return self;
    }

    // Check for PannerStereoNode support and fallback to PannerNode if it doesn't exist.
    var pannerType = (typeof Howler.ctx.createStereoPanner === 'undefined') ? 'spatial' : 'stereo';

    // Setup the group's stereo panning if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's stereo panning if no parameters are passed.
      if (typeof pan === 'number') {
        self._stereo = pan;
        self._pos = [pan, 0, 0];
      } else {
        return self._stereo;
      }
    }

    // Change the streo panning of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof pan === 'number') {
          sound._stereo = pan;
          sound._pos = [pan, 0, 0];

          if (sound._node) {
            // If we are falling back, make sure the panningModel is equalpower.
            sound._pannerAttr.panningModel = 'equalpower';

            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner || !sound._panner.pan) {
              setupPanner(sound, pannerType);
            }

            if (pannerType === 'spatial') {
              sound._panner.setPosition(pan, 0, 0);
            } else {
              sound._panner.pan.value = pan;
            }
          }

          self._emit('stereo', sound._id);
        } else {
          return sound._stereo;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the 3D spatial position of the audio source for this sound or
   * all in the group. The most common usage is to set the 'x' position for
   * left/right panning. Setting any value higher than 1.0 will begin to
   * decrease the volume of the sound as it moves further away.
   * @param  {Number} x  The x-position of the audio from -1000.0 to 1000.0.
   * @param  {Number} y  The y-position of the audio from -1000.0 to 1000.0.
   * @param  {Number} z  The z-position of the audio from -1000.0 to 1000.0.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Array}    Returns self or the current 3D spatial position: [x, y, z].
   */
  Howl.prototype.pos = function(x, y, z, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change position when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'pos',
        action: function() {
          self.pos(x, y, z, id);
        }
      });

      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? 0 : y;
    z = (typeof z !== 'number') ? -0.5 : z;

    // Setup the group's spatial position if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's spatial position if no parameters are passed.
      if (typeof x === 'number') {
        self._pos = [x, y, z];
      } else {
        return self._pos;
      }
    }

    // Change the spatial position of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof x === 'number') {
          sound._pos = [x, y, z];

          if (sound._node) {
            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner || sound._panner.pan) {
              setupPanner(sound, 'spatial');
            }

            sound._panner.setPosition(x, y, z);
          }

          self._emit('pos', sound._id);
        } else {
          return sound._pos;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the direction the audio source is pointing in the 3D cartesian coordinate
   * space. Depending on how direction the sound is, based on the `cone` attributes,
   * a sound pointing away from the listener can be quiet or silent.
   * @param  {Number} x  The x-orientation of the source.
   * @param  {Number} y  The y-orientation of the source.
   * @param  {Number} z  The z-orientation of the source.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Array}    Returns self or the current 3D spatial orientation: [x, y, z].
   */
  Howl.prototype.orientation = function(x, y, z, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change orientation when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'orientation',
        action: function() {
          self.orientation(x, y, z, id);
        }
      });

      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = (typeof y !== 'number') ? self._orientation[1] : y;
    z = (typeof z !== 'number') ? self._orientation[2] : z;

    // Setup the group's spatial orientation if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's spatial orientation if no parameters are passed.
      if (typeof x === 'number') {
        self._orientation = [x, y, z];
      } else {
        return self._orientation;
      }
    }

    // Change the spatial orientation of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof x === 'number') {
          sound._orientation = [x, y, z];

          if (sound._node) {
            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner) {
              // Make sure we have a position to setup the node with.
              if (!sound._pos) {
                sound._pos = self._pos || [0, 0, -0.5];
              }

              setupPanner(sound, 'spatial');
            }

            sound._panner.setOrientation(x, y, z);
          }

          self._emit('orientation', sound._id);
        } else {
          return sound._orientation;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the panner node's attributes for a sound or group of sounds.
   * This method can optionall take 0, 1 or 2 arguments.
   *   pannerAttr() -> Returns the group's values.
   *   pannerAttr(id) -> Returns the sound id's values.
   *   pannerAttr(o) -> Set's the values of all sounds in this Howl group.
   *   pannerAttr(o, id) -> Set's the values of passed sound id.
   *
   *   Attributes:
   *     coneInnerAngle - (360 by default) There will be no volume reduction inside this angle.
   *     coneOuterAngle - (360 by default) The volume will be reduced to a constant value of
   *                      `coneOuterGain` outside this angle.
   *     coneOuterGain - (0 by default) The amount of volume reduction outside of `coneOuterAngle`.
   *     distanceModel - ('inverse' by default) Determines algorithm to use to reduce volume as audio moves
   *                      away from listener. Can be `linear`, `inverse` or `exponential`.
   *     maxDistance - (10000 by default) Volume won't reduce between source/listener beyond this distance.
   *     panningModel - ('HRTF' by default) Determines which spatialization algorithm is used to position audio.
   *                     Can be `HRTF` or `equalpower`.
   *     refDistance - (1 by default) A reference distance for reducing volume as the source
   *                    moves away from the listener.
   *     rolloffFactor - (1 by default) How quickly the volume reduces as source moves from listener.
   * 
   * @return {Howl/Object} Returns self or current panner attributes.
   */
  Howl.prototype.pannerAttr = function() {
    var self = this;
    var args = arguments;
    var o, id, sound;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // Determine the values based on arguments.
    if (args.length === 0) {
      // Return the group's panner attribute values.
      return self._pannerAttr;
    } else if (args.length === 1) {
      if (typeof args[0] === 'object') {
        o = args[0];

        // Set the grou's panner attribute values.
        if (typeof id === 'undefined') {
          self._pannerAttr = {
            coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : self._coneInnerAngle,
            coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : self._coneOuterAngle,
            coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : self._coneOuterGain,
            distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : self._distanceModel,
            maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : self._maxDistance,
            panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : self._panningModel,
            refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : self._refDistance,
            rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : self._rolloffFactor
          };
        }
      } else {
        // Return this sound's panner attribute values.
        sound = self._soundById(parseInt(args[0], 10));
        return sound ? sound._pannerAttr : self._pannerAttr;
      }
    } else if (args.length === 2) {
      o = args[0];
      id = parseInt(args[1], 10);
    }

    // Update the values of the specified sounds.
    var ids = self._getSoundIds(id);
    for (var i=0; i<ids.length; i++) {
      sound = self._soundById(ids[i]);

      if (sound) {
        // Merge the new values into the sound.
        var pa = sound._pannerAttr;
        pa = {
          coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : pa.coneInnerAngle,
          coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : pa.coneOuterAngle,
          coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : pa.coneOuterGain,
          distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : pa.distanceModel,
          maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : pa.maxDistance,
          panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : pa.panningModel,
          refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : pa.refDistance,
          rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : pa.rolloffFactor
        };

        // Update the panner values or create a new panner if none exists.
        var panner = sound._panner;
        if (panner) {
          panner.coneInnerAngle = pa.coneInnerAngle;
          panner.coneOuterAngle = pa.coneOuterAngle;
          panner.coneOuterGain = pa.coneOuterGain;
          panner.distanceModel = pa.distanceModel;
          panner.maxDistance = pa.maxDistance;
          panner.panningModel = pa.panningModel;
          panner.refDistance = pa.refDistance;
          panner.rolloffFactor = pa.rolloffFactor;
        } else {
          // Make sure we have a position to setup the node with.
          if (!sound._pos) {
            sound._pos = self._pos || [0, 0, -0.5];
          }

          // Create a new panner node.
          setupPanner(sound, 'spatial');
        }
      }
    }

    return self;
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Add new properties to the core Sound init.
   * @param  {Function} _super Core Sound init method.
   * @return {Sound}
   */
  Sound.prototype.init = (function(_super) {
    return function() {
      var self = this;
      var parent = self._parent;

      // Setup user-defined default properties.
      self._orientation = parent._orientation;
      self._stereo = parent._stereo;
      self._pos = parent._pos;
      self._pannerAttr = parent._pannerAttr;

      // Complete initilization with howler.js core Sound's init function.
      _super.call(this);

      // If a stereo or position was specified, set it up.
      if (self._stereo) {
        parent.stereo(self._stereo);
      } else if (self._pos) {
        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
      }
    };
  })(Sound.prototype.init);

  /**
   * Override the Sound.reset method to clean up properties from the spatial plugin.
   * @param  {Function} _super Sound reset method.
   * @return {Sound}
   */
  Sound.prototype.reset = (function(_super) {
    return function() {
      var self = this;
      var parent = self._parent;

      // Reset all spatial plugin properties on this sound.
      self._orientation = parent._orientation;
      self._pos = parent._pos;
      self._pannerAttr = parent._pannerAttr;

      // Complete resetting of the sound.
      return _super.call(this);
    };
  })(Sound.prototype.reset);

  /** Helper Methods **/
  /***************************************************************************/

  /**
   * Create a new panner node and save it on the sound.
   * @param  {Sound} sound Specific sound to setup panning on.
   * @param {String} type Type of panner to create: 'stereo' or 'spatial'.
   */
  var setupPanner = function(sound, type) {
    type = type || 'spatial';

    // Create the new panner node.
    if (type === 'spatial') {
      sound._panner = Howler.ctx.createPanner();
      sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
      sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
      sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
      sound._panner.distanceModel = sound._pannerAttr.distanceModel;
      sound._panner.maxDistance = sound._pannerAttr.maxDistance;
      sound._panner.panningModel = sound._pannerAttr.panningModel;
      sound._panner.refDistance = sound._pannerAttr.refDistance;
      sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
      sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
      sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
    } else {
      sound._panner = Howler.ctx.createStereoPanner();
      sound._panner.pan.value = sound._stereo;
    }

    sound._panner.connect(sound._node);

    // Update the connections.
    if (!sound._paused) {
      sound._parent.pause(sound._id, true).play(sound._id);
    }
  };
})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 6 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "subscribers", function() { return subscribers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getCurrentUrl", function() { return getCurrentUrl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "route", function() { return route; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Router", function() { return Router; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Route", function() { return Route; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Link", function() { return Link; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_preact__ = __webpack_require__(0);


var EMPTY$1 = {};

function assign(obj, props) {
	// eslint-disable-next-line guard-for-in
	for (var i in props) {
		obj[i] = props[i];
	}
	return obj;
}

function exec(url, route, opts) {
	if ( opts === void 0 ) opts=EMPTY$1;

	var reg = /(?:\?([^#]*))?(#.*)?$/,
		c = url.match(reg),
		matches = {},
		ret;
	if (c && c[1]) {
		var p = c[1].split('&');
		for (var i=0; i<p.length; i++) {
			var r = p[i].split('=');
			matches[decodeURIComponent(r[0])] = decodeURIComponent(r.slice(1).join('='));
		}
	}
	url = segmentize(url.replace(reg, ''));
	route = segmentize(route || '');
	var max = Math.max(url.length, route.length);
	for (var i$1=0; i$1<max; i$1++) {
		if (route[i$1] && route[i$1].charAt(0)===':') {
			var param = route[i$1].replace(/(^\:|[+*?]+$)/g, ''),
				flags = (route[i$1].match(/[+*?]+$/) || EMPTY$1)[0] || '',
				plus = ~flags.indexOf('+'),
				star = ~flags.indexOf('*'),
				val = url[i$1] || '';
			if (!val && !star && (flags.indexOf('?')<0 || plus)) {
				ret = false;
				break;
			}
			matches[param] = decodeURIComponent(val);
			if (plus || star) {
				matches[param] = url.slice(i$1).map(decodeURIComponent).join('/');
				break;
			}
		}
		else if (route[i$1]!==url[i$1]) {
			ret = false;
			break;
		}
	}
	if (opts.default!==true && ret===false) { return false; }
	return matches;
}

function pathRankSort(a, b) {
	var aAttr = a.attributes || EMPTY$1,
		bAttr = b.attributes || EMPTY$1;
	if (aAttr.default) { return 1; }
	if (bAttr.default) { return -1; }
	var diff = rank(aAttr.path) - rank(bAttr.path);
	return diff || (aAttr.path.length - bAttr.path.length);
}

function segmentize(url) {
	return strip(url).split('/');
}

function rank(url) {
	return (strip(url).match(/\/+/g) || '').length;
}

function strip(url) {
	return url.replace(/(^\/+|\/+$)/g, '');
}

var customHistory = null;

var ROUTERS = [];

var subscribers = [];

var EMPTY = {};

function isPreactElement(node) {
	return node.__preactattr_!=null || typeof Symbol!=='undefined' && node[Symbol.for('preactattr')]!=null;
}

function setUrl(url, type) {
	if ( type === void 0 ) type='push';

	if (customHistory && customHistory[type]) {
		customHistory[type](url);
	}
	else if (typeof history!=='undefined' && history[type+'State']) {
		history[type+'State'](null, null, url);
	}
}


function getCurrentUrl() {
	var url;
	if (customHistory && customHistory.location) {
		url = customHistory.location;
	}
	else if (customHistory && customHistory.getCurrentLocation) {
		url = customHistory.getCurrentLocation();
	}
	else {
		url = typeof location!=='undefined' ? location : EMPTY;
	}
	return ("" + (url.pathname || '') + (url.search || ''));
}



function route(url, replace) {
	if ( replace === void 0 ) replace=false;

	if (typeof url!=='string' && url.url) {
		replace = url.replace;
		url = url.url;
	}

	// only push URL into history if we can handle it
	if (canRoute(url)) {
		setUrl(url, replace ? 'replace' : 'push');
	}

	return routeTo(url);
}


/** Check if the given URL can be handled by any router instances. */
function canRoute(url) {
	for (var i=ROUTERS.length; i--; ) {
		if (ROUTERS[i].canRoute(url)) { return true; }
	}
	return false;
}


/** Tell all router instances to handle the given URL.  */
function routeTo(url) {
	var didRoute = false;
	for (var i=0; i<ROUTERS.length; i++) {
		if (ROUTERS[i].routeTo(url)===true) {
			didRoute = true;
		}
	}
	for (var i$1=subscribers.length; i$1--; ) {
		subscribers[i$1](url);
	}
	return didRoute;
}


function routeFromLink(node) {
	// only valid elements
	if (!node || !node.getAttribute) { return; }

	var href = node.getAttribute('href'),
		target = node.getAttribute('target');

	// ignore links with targets and non-path URLs
	if (!href || !href.match(/^\//g) || (target && !target.match(/^_?self$/i))) { return; }

	// attempt to route, if no match simply cede control to browser
	return route(href);
}


function handleLinkClick(e) {
	if (e.button==0) {
		routeFromLink(e.currentTarget || e.target || this);
		return prevent(e);
	}
}


function prevent(e) {
	if (e) {
		if (e.stopImmediatePropagation) { e.stopImmediatePropagation(); }
		if (e.stopPropagation) { e.stopPropagation(); }
		e.preventDefault();
	}
	return false;
}


function delegateLinkHandler(e) {
	// ignore events the browser takes care of already:
	if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || e.button!==0) { return; }

	var t = e.target;
	do {
		if (String(t.nodeName).toUpperCase()==='A' && t.getAttribute('href') && isPreactElement(t)) {
			if (t.hasAttribute('native')) { return; }
			// if link is handled by the router, prevent browser defaults
			if (routeFromLink(t)) {
				return prevent(e);
			}
		}
	} while ((t=t.parentNode));
}


var eventListenersInitialized = false;

function initEventListeners() {
	if (eventListenersInitialized){
		return;
	}

	if (typeof addEventListener==='function') {
		if (!customHistory) {
			addEventListener('popstate', function () { return routeTo(getCurrentUrl()); });
		}
		addEventListener('click', delegateLinkHandler);
	}
	eventListenersInitialized = true;
}


var Router = (function (Component$$1) {
	function Router(props) {
		Component$$1.call(this, props);
		if (props.history) {
			customHistory = props.history;
		}

		this.state = {
			url: props.url || getCurrentUrl()
		};

		initEventListeners();
	}

	if ( Component$$1 ) Router.__proto__ = Component$$1;
	Router.prototype = Object.create( Component$$1 && Component$$1.prototype );
	Router.prototype.constructor = Router;

	Router.prototype.shouldComponentUpdate = function shouldComponentUpdate (props) {
		if (props.static!==true) { return true; }
		return props.url!==this.props.url || props.onChange!==this.props.onChange;
	};

	/** Check if the given URL can be matched against any children */
	Router.prototype.canRoute = function canRoute (url) {
		return this.getMatchingChildren(this.props.children, url, false).length > 0;
	};

	/** Re-render children with a new URL to match against. */
	Router.prototype.routeTo = function routeTo (url) {
		this._didRoute = false;
		this.setState({ url: url });

		// if we're in the middle of an update, don't synchronously re-route.
		if (this.updating) { return this.canRoute(url); }

		this.forceUpdate();
		return this._didRoute;
	};

	Router.prototype.componentWillMount = function componentWillMount () {
		ROUTERS.push(this);
		this.updating = true;
	};

	Router.prototype.componentDidMount = function componentDidMount () {
		var this$1 = this;

		if (customHistory) {
			this.unlisten = customHistory.listen(function (location) {
				this$1.routeTo(("" + (location.pathname || '') + (location.search || '')));
			});
		}
		this.updating = false;
	};

	Router.prototype.componentWillUnmount = function componentWillUnmount () {
		if (typeof this.unlisten==='function') { this.unlisten(); }
		ROUTERS.splice(ROUTERS.indexOf(this), 1);
	};

	Router.prototype.componentWillUpdate = function componentWillUpdate () {
		this.updating = true;
	};

	Router.prototype.componentDidUpdate = function componentDidUpdate () {
		this.updating = false;
	};

	Router.prototype.getMatchingChildren = function getMatchingChildren (children, url, invoke) {
		return children.slice().sort(pathRankSort).map( function (vnode) {
			var attrs = vnode.attributes || {},
				path = attrs.path,
				matches = exec(url, path, attrs);
			if (matches) {
				if (invoke!==false) {
					var newProps = { url: url, matches: matches };
					assign(newProps, matches);
					return Object(__WEBPACK_IMPORTED_MODULE_0_preact__["cloneElement"])(vnode, newProps);
				}
				return vnode;
			}
			return false;
		}).filter(Boolean);
	};

	Router.prototype.render = function render (ref, ref$1) {
		var children = ref.children;
		var onChange = ref.onChange;
		var url = ref$1.url;

		var active = this.getMatchingChildren(children, url, true);

		var current = active[0] || null;
		this._didRoute = !!current;

		var previous = this.previousUrl;
		if (url!==previous) {
			this.previousUrl = url;
			if (typeof onChange==='function') {
				onChange({
					router: this,
					url: url,
					previous: previous,
					active: active,
					current: current
				});
			}
		}

		return current;
	};

	return Router;
}(__WEBPACK_IMPORTED_MODULE_0_preact__["Component"]));

var Link = function (props) { return (
	Object(__WEBPACK_IMPORTED_MODULE_0_preact__["h"])('a', assign({ onClick: handleLinkClick }, props))
); };

var Route = function (props) { return Object(__WEBPACK_IMPORTED_MODULE_0_preact__["h"])(props.component, props); };

Router.subscribers = subscribers;
Router.getCurrentUrl = getCurrentUrl;
Router.route = route;
Router.Router = Router;
Router.Route = Route;
Router.Link = Link;

/* harmony default export */ __webpack_exports__["default"] = (Router);
//# sourceMappingURL=preact-router.es.js.map


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
function dlv(obj, key, def, p) {
	p = 0;
	key = key.split ? key.split('.') : key;
	while (obj && p<key.length) { obj = obj[key[p++]]; }
	return obj===undefined ? def : obj;
}

/** Create an Event handler function that sets a given state property.
 *	@param {Component} component	The component whose state should be updated
 *	@param {string} key				A dot-notated key path to update in the component's state
 *	@param {string} eventPath		A dot-notated key path to the value that should be retrieved from the Event or component
 *	@returns {function} linkedStateHandler
 */
function linkState(component, key, eventPath) {
	var path = key.split('.');
	return function(e) {
		var t = e && e.target || this,
			state = {},
			obj = state,
			v = typeof eventPath==='string' ? dlv(e, eventPath) : t.nodeName ? (t.type.match(/^che|rad/) ? t.checked : t.value) : e,
			i = 0;
		for ( ; i<path.length-1; i++) {
			obj = obj[path[i]] || (obj[path[i]] = !i && component.state[path[i]] || {});
		}
		obj[path[i]] = v;
		component.setState(state);
	};
}

/* harmony default export */ __webpack_exports__["default"] = (linkState);
//# sourceMappingURL=linkstate.es.js.map


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map