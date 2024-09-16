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
const arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

const tree = new Tree(arr);
insert(tree.root, 40);
prettyPrint(tree.root);

deleteItem(tree.root, 4);
prettyPrint(tree.root);
