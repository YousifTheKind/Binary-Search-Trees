#!/usr/bin/env node
class Node {
    constructor(d) {
        this.data = d;
        this.left = null;
        this.right = null;
    }
}

class Tree {
    constructor(arr) {
        this.root = buildTree(arr);
    }
    find(value) {
        let curr = this.root;
        while (curr !== null && curr.data !== value) {
            if (value > curr.data) curr = curr.right;
            else if (value < curr.data) curr = curr.left;
        }
        if (curr == null) {
            return false;
        } else {
            return curr;
        }
    }
}

function buildTree(array) {
    array = [...new Set(array)].sort(function (a, b) {
        return a - b;
    });

    const treeBuilder = (arr, start, end) => {
        if (start > end || arr[start] == undefined) return null;

        let mid = Math.floor((start + end) / 2);

        let root = new Node(arr[mid]);

        root.right = treeBuilder(arr, mid + 1, end);
        root.left = treeBuilder(arr, start, mid - 1);

        return root;
    };

    return treeBuilder(array, 0, array.length);
}

const prettyPrint = (root, prefix = "", isLeft = true) => {
    if (root === null) {
        return;
    }
    if (root.right !== null) {
        prettyPrint(root.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${root.data}`);
    if (root.left !== null) {
        prettyPrint(root.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
};
function insert(root, value) {
    if (root == null || root == undefined) return new Node(value);
    if (root.data === value) return root;

    if (value < root.data) root.left = insert(root.left, value);
    else if (value > root.data) root.right = insert(root.right, value);
    return root;
}

function deleteItem(root, value) {
    let curr = root;
    let prev = null;

    while (curr !== null && curr.data !== value) {
        prev = curr;
        if (value > curr.data) curr = curr.right;
        else if (value < curr.data) curr = curr.left;
    }
    if (curr == null) {
        console.log("value is not here!");
        return root;
    }

    // if node to be deleted has one child
    if (curr.left === null || curr.right == null) {
        let newCurr = curr.right === null ? curr.left : curr.right;

        // if it's root node
        if (prev === null) {
            return newCurr;
        }
        if (prev.right === curr) prev.right = newCurr;
        else prev.left = newCurr;
    } else {
        // if node to be deleted has two children
        let prevNextBiggest = null;
        let nextBiggest = curr.right;
        // get the nextBiggest
        while (nextBiggest.left !== null) {
            prevNextBiggest = nextBiggest;
            nextBiggest = nextBiggest.left;
        }

        if (prevNextBiggest === null) {
            // if it's the root node and the nextBiggest is the first node to the right
            // then delete the node to the right
            curr.right = nextBiggest.right;
        } else {
            // if it's not the root node
            // then delete the next biggest
            prevNextBiggest.left = nextBiggest.right;
        }
        // replace the node to be deleted value with nextBiggest value
        curr.data = nextBiggest.data;
    }
    return root;
}

function levelOrderIteration(callback, root) {
    if (typeof callback !== "function") {
        throw new Error("Callback function is not provided");
    }
    const Q = [];
    Q.push(root);
    while (Q.length !== 0) {
        const currentNode = Q[0];
        callback(currentNode);
        if (currentNode.right !== null) {
            Q.push(currentNode.right);
        }
        if (currentNode.left !== null) {
            Q.push(currentNode.left);
        }
        Q.shift();
    }
}

function levelOrderRecursion(callback, root) {
    if (typeof callback !== "function") {
        throw new Error("Callback function is not provided");
    }
    const Q = [];
    Q.push(root);
    function recursive(node) {
        if (Q.length == 0) {
            return;
        }
        callback(Q[0]);
        if (node.right !== null) {
            Q.push(node.right);
        }
        if (node.left !== null) {
            Q.push(node.left);
        }
        Q.shift();
        recursive(Q[0]);
    }
    recursive(root);
}
function inOrder(callback, root) {
    if (typeof callback !== "function") {
        throw new Error("Callback function is not provided");
    }
    function recursive(node) {
        if (node === null) {
            return;
        }
        recursive(node.left);
        callback(node);
        recursive(node.right);
    }
    recursive(root);
}
function preOrder(callback, root) {
    if (typeof callback !== "function") {
        throw new Error("Callback function is not provided");
    }
    function recursive(node) {
        if (node === null) {
            return;
        }
        callback(node);
        recursive(node.left);
        recursive(node.right);
    }
    recursive(root);
}
function postOrder(callback, root) {
    if (typeof callback !== "function") {
        throw new Error("Callback function is not provided");
    }
    function recursive(node) {
        if (node === null) {
            return;
        }
        recursive(node.left);
        recursive(node.right);

        callback(node);
    }
    recursive(root);
}
function height(node) {
    if (node === null) {
        return -1;
    }
    const leftHeight = height(node.left);
    const rightHeight = height(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
}

function depth(node, root) {
    let curr = root;
    const value = node.data;
    let counter = 0;
    while (curr !== null && curr.data !== value) {
        counter++;
        if (value > curr.data) curr = curr.right;
        else if (value < curr.data) curr = curr.left;
    }
    return counter;
}

function isBalanced(root) {
    const Q = [];
    Q.push(root);
    while (Q.length !== 0) {
        const currentNode = Q[0];
        const heightLeft = height(currentNode.left);
        const heightRight = height(currentNode.right);
        const difference = Math.abs(heightLeft - heightRight);
        // console.log("diff: " + difference);
        // console.log(currentNode.data);
        if (difference > 1) return false;
        else {
            if (currentNode.right !== null) {
                Q.push(currentNode.right);
            }
            if (currentNode.left !== null) {
                Q.push(currentNode.left);
            }
            Q.shift();
        }
    }
    return true;
}
function rebalance(tree) {
    const root = tree.root;
    const newArr = [];
    inOrder((node) => {
        newArr.push(node.data);
    }, root);
    const newRoot = buildTree(newArr);
    tree.root = newRoot;
    return tree;
}
function randomArr() {
    return Array.from(Array(100), () => Math.floor(Math.random() * 100 + 1));
}
const arr = randomArr();
const tree = new Tree(arr);
const test = (x) => {
    console.log(x.data);
};
// TESTING
// console.log(isBalanced(tree.root));
// prettyPrint(tree.root);
// console.log("LEVEL ORDER IT");
// console.log(levelOrderIteration(test, tree.root));
// console.log(
//     "-----------------------------------------------------------------------------"
// );
// console.log("LEVEL ORDER REC");
// console.log(levelOrderRecursion(test, tree.root));
// console.log(
//     "-----------------------------------------------------------------------------"
// );
// console.log("PRE-ORDER");
// console.log(preOrder(test, tree.root));
// console.log(
//     "-----------------------------------------------------------------------------"
// );
// console.log("IN-ORDER");
// console.log(inOrder(test, tree.root));
// console.log(
//     "-----------------------------------------------------------------------------"
// );
// console.log("POST-ORDER");
// console.log(postOrder(test, tree.root));
// console.log(
//     "-----------------------------------------------------------------------------"
// );
// insert(tree.root, 101);
// insert(tree.root, 102);
// insert(tree.root, 103);
// insert(tree.root, 104);
// insert(tree.root, 105);
// console.log(isBalanced(tree.root));
// prettyPrint(tree.root);
// rebalance(tree);
// console.log(isBalanced(tree.root));
// prettyPrint(tree.root);
// console.log("LEVEL ORDER IT");
// console.log(levelOrderIteration(test, tree.root));
// console.log(
//     "-----------------------------------------------------------------------------"
// );
// console.log("LEVEL ORDER REC");
// console.log(levelOrderRecursion(test, tree.root));
// console.log(
//     "-----------------------------------------------------------------------------"
// );
// console.log("PRE-ORDER");
// console.log(preOrder(test, tree.root));
// console.log(
//     "-----------------------------------------------------------------------------"
// );
// console.log("IN-ORDER");
// console.log(inOrder(test, tree.root));
// console.log(
//     "-----------------------------------------------------------------------------"
// );
// console.log("POST-ORDER");
// console.log(postOrder(test, tree.root));
// console.log(
//     "-----------------------------------------------------------------------------"
// );
