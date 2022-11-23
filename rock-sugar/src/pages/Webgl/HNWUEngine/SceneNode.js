class TRS {
    constructor(position = [0, 0, 0], rotation = [0, 0, 0, 1], scale = [1, 1, 1]) {
      this.position = position;
      this.rotation = rotation;
      this.scale = scale;
    }
    getMatrix(dst) {
      dst = dst || new Float32Array(16);
      HNWUEngine.compose(this.position, this.rotation, this.scale, dst);
      return dst;
    }
}


class Node {
    constructor(source, name) {
        this.name = name;
        this.source = source;
        this.parent = null;
        this.children = [];
        this.localMatrix = HNWUEngine.identity();
        this.worldMatrix = HNWUEngine.identity();
        this.drawables = [];
    }
    setParent(parent) {
        if (this.parent) {
            this.parent._removeChild(this);
            this.parent = null;
        }
        if (parent) {
            parent._addChild(this);
            this.parent = parent;
        }
    }
    updateWorldMatrix(parentWorldMatrix) {
        const source = this.source;
        if (source) {
            source.getMatrix(this.localMatrix);
        }

        if (parentWorldMatrix) {
            // 一个矩阵传入，所以做数学运算
            HNWUEngine.multiply3d(parentWorldMatrix, this.localMatrix, this.worldMatrix);
        } else {
            // 没有矩阵传入，所以只是拷贝局部矩阵到世界矩阵
            HNWUEngine.copy(this.localMatrix, this.worldMatrix);
        }

        // 现在处理所有子
        const worldMatrix = this.worldMatrix;
        for (const child of this.children) {
            child.updateWorldMatrix(worldMatrix);
        }
    }
    traverse(fn) {
        fn(this);
        for (const child of this.children) {
            child.traverse(fn);
        }
    }
    _addChild(child) {
        this.children.push(child);
    }
    _removeChild(child) {
        const ndx = this.children.indexOf(child);
        this.children.splice(ndx, 1);
    }
}

export {
    TRS,
    Node
}

