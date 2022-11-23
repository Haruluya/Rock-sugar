export default class Skin {
    constructor(gl,joints, inverseBindMatrixData) {
      this.joints = joints;
      this.inverseBindMatrices = [];
      this.jointMatrices = [];
      // 为每个关节矩阵分配足够的空间
      this.jointData = new Float32Array(joints.length * 16);
      // 为每个关节和绑定逆矩阵创建视图
      for (let i = 0; i < joints.length; ++i) {
        this.inverseBindMatrices.push(new Float32Array(
            inverseBindMatrixData.buffer,
            inverseBindMatrixData.byteOffset + Float32Array.BYTES_PER_ELEMENT * 16 * i,
            16));
        this.jointMatrices.push(new Float32Array(
            this.jointData.buffer,
            Float32Array.BYTES_PER_ELEMENT * 16 * i,
            16));
      }
      // 创建存储关节矩阵的纹理
      this.jointTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, this.jointTexture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    }
    update(gl,node) {
      const globalWorldInverse = HNWUEngine.inverse(node.worldMatrix);
      // 遍历每个关节获得当前世界矩阵
      // 来计算绑定矩阵的逆 
      // 并在纹理中存储整个结果
      for (let j = 0; j < this.joints.length; ++j) {
        const joint = this.joints[j];
        const dst = this.jointMatrices[j];
        HNWUEngine.multiply3d(globalWorldInverse, joint.worldMatrix, dst);
        HNWUEngine.multiply3d(dst, this.inverseBindMatrices[j], dst);
      }
      gl.bindTexture(gl.TEXTURE_2D, this.jointTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 4, this.joints.length, 0,
                    gl.RGBA, gl.FLOAT, this.jointData);
    }
}