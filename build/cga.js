/**
*CGA Lib |赵耀圣 |alex Zhao | Zhao yaosheng
*@license free for all
*/
var cga = (function (exports) {
    'use strict';

    const gPrecision = 1e-4;
    function sign(value) {
      return value >= 0 ? 1 : -1;
    }
    function approximateEqual(v1, v2, precision = gPrecision) {
      return Math.abs(v1 - v2) < precision;
    }
    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }
    function lerp(x, y, t) {
      return (1 - t) * x + t * y;
    }
    function smoothstep(x, min, max) {
      if (x <= min) return 0;
      if (x >= max) return 1;
      x = (x - min) / (max - min);
      return x * x * (3 - 2 * x);
    }
    function smootherstep(x, min, max) {
      if (x <= min) return 0;
      if (x >= max) return 1;
      x = (x - min) / (max - min);
      return x * x * x * (x * (x * 6 - 15) + 10);
    } // Random integer from <low, high> interval

    function randInt(low, high) {
      return low + Math.floor(Math.random() * (high - low + 1));
    } // Random float from <low, high> interval

    /**
     * 生成一个low~high之间的浮点数
     * @param {*} low 
     * @param {*} high 
     */

    function randFloat(low, high) {
      return low + Math.random() * (high - low);
    }
    function isPowerOfTwo(value) {
      return (value & value - 1) === 0 && value !== 0;
    }
    function ceilPowerOfTwo(value) {
      return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
    }
    function floorPowerOfTwo(value) {
      return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
    }
    function degToRad(degrees) {
      return degrees * _Math.DEG2RAD;
    }
    function radToDeg(radians) {
      return radians * _Math.RAD2DEG;
    }
    /**
     * 数字或者向量固定位数
     * @param {Object} obj 数字或者向量
     * @param {*} fractionDigits 
     */

    function toFixed(obj, fractionDigits) {
      if (obj instanceof Number) return parseFloat(obj.toFixed(fractionDigits));else {
        if (obj.x !== undefined) obj.x = parseFloat(obj.x.toFixed(fractionDigits));
        if (obj.y !== undefined) obj.y = parseFloat(obj.y.toFixed(fractionDigits));
        if (obj.z !== undefined) obj.z = parseFloat(obj.z.toFixed(fractionDigits));
      }
      return obj;
    }

    class Vector2 {
      constructor(x, y) {
        this.x = x || 0;
        this.y = y || 0;
        this.isVector2 = true;
      }

      get width() {
        return this.x;
      }

      set width(value) {
        this.x = value;
      }

      get height() {
        return this.y;
      }

      set height(value) {
        this.y = value;
      }

      static get UnitX() {
        return new Vector2(1, 0);
      }

      static get UnitY() {
        return new Vector2(0, 1);
      }

      set(x, y) {
        this.x = x;
        this.y = y;
        return this;
      }

      setScalar(scalar) {
        this.x = scalar;
        this.y = scalar;
        return this;
      }

      setX(x) {
        this.x = x;
        return this;
      }

      setY(y) {
        this.y = y;
        return this;
      }

      setComponent(index, value) {
        switch (index) {
          case 0:
            this.x = value;
            break;

          case 1:
            this.y = value;
            break;

          default:
            throw new Error("index is out of range: " + index);
        }

        return this;
      }

      getComponent(index) {
        switch (index) {
          case 0:
            return this.x;

          case 1:
            return this.y;

          default:
            throw new Error("index is out of range: " + index);
        }
      }

      clone() {
        return new this.constructor(this.x, this.y);
      }

      copy(v) {
        this.x = v.x;
        this.y = v.y;
        return this;
      }

      add(v, w) {
        if (w !== undefined) {
          console.warn("Vector2: .add() now only accepts one argument. Use .addVectors( a, b ) instead.");
          return this.addVectors(v, w);
        }

        this.x += v.x;
        this.y += v.y;
        return this;
      }

      addScalar(s) {
        this.x += s;
        this.y += s;
        return this;
      }

      addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
      }

      addScaledVector(v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        return this;
      }

      sub(v, w) {
        if (w !== undefined) {
          console.warn("Vector2: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.");
          return this.subVectors(v, w);
        }

        this.x -= v.x;
        this.y -= v.y;
        return this;
      }

      subScalar(s) {
        this.x -= s;
        this.y -= s;
        return this;
      }

      subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
      }

      multiply(v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
      }

      multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
      }

      divide(v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
      }

      divideScalar(scalar) {
        return this.multiplyScalar(1 / scalar);
      }

      applyMatrix3(m) {
        var x = this.x,
            y = this.y;
        var e = m.elements;
        this.x = e[0] * x + e[3] * y + e[6];
        this.y = e[1] * x + e[4] * y + e[7];
        return this;
      }

      min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        return this;
      }

      max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        return this;
      }

      clamp(min, max) {
        // assumes min < max, componentwise
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        return this;
      }

      clampScalar(minVal, maxVal) {
        this.x = Math.max(minVal, Math.min(maxVal, this.x));
        this.y = Math.max(minVal, Math.min(maxVal, this.y));
        return this;
      }

      clampLength(min, max) {
        var length = this.length();
        return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
      }

      floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
      }

      ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
      }

      round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
      }

      roundToZero() {
        this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
        return this;
      }

      negate() {
        this.x = -this.x;
        this.y = -this.y;
        return this;
      }

      dot(v) {
        return this.x * v.x + this.y * v.y;
      }

      cross(v) {
        return this.x * v.y - this.y * v.x;
      }

      lengthSq() {
        return this.x * this.x + this.y * this.y;
      }

      length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
      }

      manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y);
      }

      normalize() {
        return this.divideScalar(this.length() || 1);
      }

      angle() {
        // computes the angle in radians with respect to the positive x-axis
        var angle = Math.atan2(this.y, this.x);
        if (angle < 0) angle += 2 * Math.PI;
        return angle;
      }

      distanceTo(v) {
        return Math.sqrt(this.distanceToSquared(v));
      }

      distanceToSquared(v) {
        var dx = this.x - v.x,
            dy = this.y - v.y;
        return dx * dx + dy * dy;
      }

      manhattanDistanceTo(v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
      }

      setLength(length) {
        return this.normalize().multiplyScalar(length);
      }

      lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        return this;
      }

      lerpVectors(v1, v2, alpha) {
        return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
      }

      equals(v) {
        return v.x === this.x && v.y === this.y;
      }

      fromArray(array, offset) {
        if (offset === undefined) offset = 0;
        this.x = array[offset];
        this.y = array[offset + 1];
        return this;
      }

      toArray(array, offset) {
        if (array === undefined) array = [];
        if (offset === undefined) offset = 0;
        array[offset] = this.x;
        array[offset + 1] = this.y;
        return array;
      }

      fromBufferAttribute(attribute, index, offset) {
        if (offset !== undefined) {
          console.warn("Vector2: offset has been removed from .fromBufferAttribute().");
        }

        this.x = attribute.getX(index);
        this.y = attribute.getY(index);
        return this;
      }

      rotateAround(center, angle) {
        var c = Math.cos(angle),
            s = Math.sin(angle);
        var x = this.x - center.x;
        var y = this.y - center.y;
        this.x = x * c - y * s + center.x;
        this.y = x * s + y * c + center.y;
        return this;
      }

    }
    function v2() {
      return new Vector2();
    }

    class Quaternion {
      constructor(x, y, z, w) {
        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
        this._w = w !== undefined ? w : 1;
        this.isQuaternion = true;
      }

      slerp(qa, qb, qm, t) {
        return qm.copy(qa).slerp(qb, t);
      }

      slerpFlat(dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {
        // fuzz-free, array-based Quaternion SLERP operation
        var x0 = src0[srcOffset0 + 0],
            y0 = src0[srcOffset0 + 1],
            z0 = src0[srcOffset0 + 2],
            w0 = src0[srcOffset0 + 3],
            x1 = src1[srcOffset1 + 0],
            y1 = src1[srcOffset1 + 1],
            z1 = src1[srcOffset1 + 2],
            w1 = src1[srcOffset1 + 3];

        if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
          var s = 1 - t,
              cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,
              dir = cos >= 0 ? 1 : -1,
              sqrSin = 1 - cos * cos; // Skip the Slerp for tiny steps to avoid numeric problems:

          if (sqrSin > Number.EPSILON) {
            var sin = Math.sqrt(sqrSin),
                len = Math.atan2(sin, cos * dir);
            s = Math.sin(s * len) / sin;
            t = Math.sin(t * len) / sin;
          }

          var tDir = t * dir;
          x0 = x0 * s + x1 * tDir;
          y0 = y0 * s + y1 * tDir;
          z0 = z0 * s + z1 * tDir;
          w0 = w0 * s + w1 * tDir; // Normalize in case we just did a lerp:

          if (s === 1 - t) {
            var f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);
            x0 *= f;
            y0 *= f;
            z0 *= f;
            w0 *= f;
          }
        }

        dst[dstOffset] = x0;
        dst[dstOffset + 1] = y0;
        dst[dstOffset + 2] = z0;
        dst[dstOffset + 3] = w0;
      }

      get x() {
        return this._x;
      }

      set x(value) {
        this._x = value;

        this._onChangeCallback();
      }

      get y() {
        return this._y;
      }

      set y(value) {
        this._y = value;

        this._onChangeCallback();
      }

      get z() {
        return this._z;
      }

      set z(value) {
        this._z = value;

        this._onChangeCallback();
      }

      get w() {
        return this._w;
      }

      set w(value) {
        this._w = value;

        this._onChangeCallback();
      }

      set(x, y, z, w) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._w = w;

        this._onChangeCallback();

        return this;
      }

      clone() {
        return new this.constructor(this._x, this._y, this._z, this._w);
      }

      copy(quaternion) {
        this._x = quaternion.x;
        this._y = quaternion.y;
        this._z = quaternion.z;
        this._w = quaternion.w;

        this._onChangeCallback();

        return this;
      }

      setFromEuler(euler, update) {
        if (!(euler && euler.isEuler)) {
          throw new Error("Quaternion: .setFromEuler() now expects an Euler rotation rather than a Vector3 and order.");
        }

        var x = euler._x,
            y = euler._y,
            z = euler._z,
            order = euler.order; // http://www.mathworks.com/matlabcentral/fileexchange/
        // 	20696-function-to-convert-between-dcm-euler-angles-quaternions-and-euler-vectors/
        //	content/SpinCalc.m

        var cos = Math.cos;
        var sin = Math.sin;
        var c1 = cos(x / 2);
        var c2 = cos(y / 2);
        var c3 = cos(z / 2);
        var s1 = sin(x / 2);
        var s2 = sin(y / 2);
        var s3 = sin(z / 2);

        if (order === "XYZ") {
          this._x = s1 * c2 * c3 + c1 * s2 * s3;
          this._y = c1 * s2 * c3 - s1 * c2 * s3;
          this._z = c1 * c2 * s3 + s1 * s2 * c3;
          this._w = c1 * c2 * c3 - s1 * s2 * s3;
        } else if (order === "YXZ") {
          this._x = s1 * c2 * c3 + c1 * s2 * s3;
          this._y = c1 * s2 * c3 - s1 * c2 * s3;
          this._z = c1 * c2 * s3 - s1 * s2 * c3;
          this._w = c1 * c2 * c3 + s1 * s2 * s3;
        } else if (order === "ZXY") {
          this._x = s1 * c2 * c3 - c1 * s2 * s3;
          this._y = c1 * s2 * c3 + s1 * c2 * s3;
          this._z = c1 * c2 * s3 + s1 * s2 * c3;
          this._w = c1 * c2 * c3 - s1 * s2 * s3;
        } else if (order === "ZYX") {
          this._x = s1 * c2 * c3 - c1 * s2 * s3;
          this._y = c1 * s2 * c3 + s1 * c2 * s3;
          this._z = c1 * c2 * s3 - s1 * s2 * c3;
          this._w = c1 * c2 * c3 + s1 * s2 * s3;
        } else if (order === "YZX") {
          this._x = s1 * c2 * c3 + c1 * s2 * s3;
          this._y = c1 * s2 * c3 + s1 * c2 * s3;
          this._z = c1 * c2 * s3 - s1 * s2 * c3;
          this._w = c1 * c2 * c3 - s1 * s2 * s3;
        } else if (order === "XZY") {
          this._x = s1 * c2 * c3 - c1 * s2 * s3;
          this._y = c1 * s2 * c3 - s1 * c2 * s3;
          this._z = c1 * c2 * s3 + s1 * s2 * c3;
          this._w = c1 * c2 * c3 + s1 * s2 * s3;
        }

        if (update !== false) this._onChangeCallback();
        return this;
      }

      setFromAxisAngle(axis, angle) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuaternion/index.htm
        // assumes axis is normalized
        var halfAngle = angle / 2,
            s = Math.sin(halfAngle);
        this._x = axis.x * s;
        this._y = axis.y * s;
        this._z = axis.z * s;
        this._w = Math.cos(halfAngle);

        this._onChangeCallback();

        return this;
      }

      setFromRotationMatrix(m) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuaternion/index.htm
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        var te = m.elements,
            m11 = te[0],
            m12 = te[4],
            m13 = te[8],
            m21 = te[1],
            m22 = te[5],
            m23 = te[9],
            m31 = te[2],
            m32 = te[6],
            m33 = te[10],
            trace = m11 + m22 + m33,
            s;

        if (trace > 0) {
          s = 0.5 / Math.sqrt(trace + 1.0);
          this._w = 0.25 / s;
          this._x = (m32 - m23) * s;
          this._y = (m13 - m31) * s;
          this._z = (m21 - m12) * s;
        } else if (m11 > m22 && m11 > m33) {
          s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
          this._w = (m32 - m23) / s;
          this._x = 0.25 * s;
          this._y = (m12 + m21) / s;
          this._z = (m13 + m31) / s;
        } else if (m22 > m33) {
          s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
          this._w = (m13 - m31) / s;
          this._x = (m12 + m21) / s;
          this._y = 0.25 * s;
          this._z = (m23 + m32) / s;
        } else {
          s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
          this._w = (m21 - m12) / s;
          this._x = (m13 + m31) / s;
          this._y = (m23 + m32) / s;
          this._z = 0.25 * s;
        }

        this._onChangeCallback();

        return this;
      }

      setFromUnitVectors(vFrom, vTo) {
        // assumes direction vectors vFrom and vTo are normalized
        var EPS = 0.000001;
        var r = vFrom.dot(vTo) + 1;

        if (r < EPS) {
          r = 0;

          if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
            this._x = -vFrom.y;
            this._y = vFrom.x;
            this._z = 0;
            this._w = r;
          } else {
            this._x = 0;
            this._y = -vFrom.z;
            this._z = vFrom.y;
            this._w = r;
          }
        } else {
          // crossVectors( vFrom, vTo ); // inlined to avoid cyclic dependency on Vector3
          this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
          this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
          this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
          this._w = r;
        }

        return this.normalize();
      }

      angleTo(q) {
        return 2 * Math.acos(Math.abs(clamp(this.dot(q), -1, 1)));
      }

      rotateTowards(q, step) {
        var angle = this.angleTo(q);
        if (angle === 0) return this;
        var t = Math.min(1, step / angle);
        this.slerp(q, t);
        return this;
      }

      inverse() {
        // quaternion is assumed to have unit length
        return this.conjugate();
      }

      conjugate() {
        this._x *= -1;
        this._y *= -1;
        this._z *= -1;

        this._onChangeCallback();

        return this;
      }

      dot(v) {
        return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
      }

      lengthSq() {
        return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
      }

      length() {
        return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
      }

      normalize() {
        var l = this.length();

        if (l === 0) {
          this._x = 0;
          this._y = 0;
          this._z = 0;
          this._w = 1;
        } else {
          l = 1 / l;
          this._x = this._x * l;
          this._y = this._y * l;
          this._z = this._z * l;
          this._w = this._w * l;
        }

        this._onChangeCallback();

        return this;
      }

      multiply(q, p) {
        if (p !== undefined) {
          console.warn("Quaternion: .multiply() now only accepts one argument. Use .multiplyQuaternions( a, b ) instead.");
          return this.multiplyQuaternions(q, p);
        }

        return this.multiplyQuaternions(this, q);
      }

      premultiply(q) {
        return this.multiplyQuaternions(q, this);
      }

      multiplyQuaternions(a, b) {
        // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/code/index.htm
        var qax = a._x,
            qay = a._y,
            qaz = a._z,
            qaw = a._w;
        var qbx = b._x,
            qby = b._y,
            qbz = b._z,
            qbw = b._w;
        this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
        this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
        this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
        this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

        this._onChangeCallback();

        return this;
      }

      slerp(qb, t) {
        if (t === 0) return this;
        if (t === 1) return this.copy(qb);
        var x = this._x,
            y = this._y,
            z = this._z,
            w = this._w; // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/

        var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

        if (cosHalfTheta < 0) {
          this._w = -qb._w;
          this._x = -qb._x;
          this._y = -qb._y;
          this._z = -qb._z;
          cosHalfTheta = -cosHalfTheta;
        } else {
          this.copy(qb);
        }

        if (cosHalfTheta >= 1.0) {
          this._w = w;
          this._x = x;
          this._y = y;
          this._z = z;
          return this;
        }

        var sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

        if (sqrSinHalfTheta <= Number.EPSILON) {
          var s = 1 - t;
          this._w = s * w + t * this._w;
          this._x = s * x + t * this._x;
          this._y = s * y + t * this._y;
          this._z = s * z + t * this._z;
          this.normalize();

          this._onChangeCallback();

          return this;
        }

        var sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
        var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
        var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
            ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
        this._w = w * ratioA + this._w * ratioB;
        this._x = x * ratioA + this._x * ratioB;
        this._y = y * ratioA + this._y * ratioB;
        this._z = z * ratioA + this._z * ratioB;

        this._onChangeCallback();

        return this;
      }

      equals(quaternion) {
        return quaternion._x === this._x && quaternion._y === this._y && quaternion._z === this._z && quaternion._w === this._w;
      }

      fromArray(array, offset) {
        if (offset === undefined) offset = 0;
        this._x = array[offset];
        this._y = array[offset + 1];
        this._z = array[offset + 2];
        this._w = array[offset + 3];

        this._onChangeCallback();

        return this;
      }

      toArray(array, offset) {
        if (array === undefined) array = [];
        if (offset === undefined) offset = 0;
        array[offset] = this._x;
        array[offset + 1] = this._y;
        array[offset + 2] = this._z;
        array[offset + 3] = this._w;
        return array;
      }

      _onChange(callback) {
        this._onChangeCallback = callback;
        return this;
      }

      _onChangeCallback() {}

    }
    function quat(x, y, z, w) {
      return new Quaternion(x, y, z, w);
    }

    class Vector3$1 {
      constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
      }

      get isVector3() {
        return true;
      }

      static get Up() {
        return new Vector3$1(0, 1, 0);
      }

      static get Down() {
        return new Vector3$1(0, 1, 0);
      }

      static get UnitX() {
        return new Vector3$1(1, 0, 0);
      }

      static get UnitY() {
        return new Vector3$1(0, 1, 0);
      }

      static get UnitZ() {
        return new Vector3$1(0, 0, 1);
      }

      set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        return this;
      }

      setScalar(scalar) {
        this.x = scalar;
        this.y = scalar;
        this.z = scalar;
        return this;
      }

      setX(x) {
        this.x = x;
        return this;
      }

      setY(y) {
        this.y = y;
        return this;
      }

      setZ(z) {
        this.z = z;
        return this;
      }

      setComponent(index, value) {
        switch (index) {
          case 0:
            this.x = value;
            break;

          case 1:
            this.y = value;
            break;

          case 2:
            this.z = value;
            break;

          default:
            throw new Error("index is out of range: " + index);
        }

        return this;
      }

      getComponent(index) {
        switch (index) {
          case 0:
            return this.x;

          case 1:
            return this.y;

          case 2:
            return this.z;

          default:
            throw new Error("index is out of range: " + index);
        }
      }

      clone() {
        return new this.constructor(this.x, this.y, this.z);
      }

      copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        return this;
      }

      add(v, w) {
        if (w !== undefined) {
          console.warn("Vector3: .add() now only accepts one argument. Use .addVectors( a, b ) instead.");
          return this.addVectors(v, w);
        }

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
      }

      addScalar(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        return this;
      }

      addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        return this;
      }

      addScaledVector(v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;
        return this;
      }

      sub(v, w) {
        if (w !== undefined) {
          console.warn("Vector3: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.");
          return this.subVectors(v, w);
        }

        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
      }

      subScalar(s) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
        return this;
      }

      subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        return this;
      }

      multiply(v, w) {
        if (w !== undefined) {
          console.warn("Vector3: .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.");
          return this.multiplyVectors(v, w);
        }

        this.x *= v.x;
        this.y *= v.y;
        this.z *= v.z;
        return this;
      }

      multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        return this;
      }

      multiplyVectors(a, b) {
        this.x = a.x * b.x;
        this.y = a.y * b.y;
        this.z = a.z * b.z;
        return this;
      }

      applyEuler(euler) {
        if (!(euler && euler.isEuler)) {
          console.error("Vector3: .applyEuler() now expects an Euler rotation rather than a Vector3 and order.");
        }

        return this.applyQuaternion(_quaternion.setFromEuler(euler));
      }

      applyAxisAngle(axis, angle) {
        return this.applyQuaternion(_quaternion.setFromAxisAngle(axis, angle));
      }

      applyMatrix3(m) {
        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;
        this.x = e[0] * x + e[3] * y + e[6] * z;
        this.y = e[1] * x + e[4] * y + e[7] * z;
        this.z = e[2] * x + e[5] * y + e[8] * z;
        return this;
      }

      applyMatrix4(m) {
        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;
        var w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
        this.x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
        this.y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
        this.z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
        return this;
      }

      applyQuaternion(q) {
        var x = this.x,
            y = this.y,
            z = this.z;
        var qx = q.x,
            qy = q.y,
            qz = q.z,
            qw = q.w; // calculate quat * vector

        var ix = qw * x + qy * z - qz * y;
        var iy = qw * y + qz * x - qx * z;
        var iz = qw * z + qx * y - qy * x;
        var iw = -qx * x - qy * y - qz * z; // calculate result * inverse quat

        this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
        this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
        this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
        return this;
      }

      project(camera) {
        return this.applyMatrix4(camera.matrixWorldInverse).applyMatrix4(camera.projectionMatrix);
      }

      unproject(camera) {
        return this.applyMatrix4(camera.projectionMatrixInverse).applyMatrix4(camera.matrixWorld);
      }

      transformDirection(m) {
        // input: Matrix4 affine matrix
        // vector interpreted as a direction
        var x = this.x,
            y = this.y,
            z = this.z;
        var e = m.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z;
        this.y = e[1] * x + e[5] * y + e[9] * z;
        this.z = e[2] * x + e[6] * y + e[10] * z;
        return this.normalize();
      }

      divide(v) {
        this.x /= v.x;
        this.y /= v.y;
        this.z /= v.z;
        return this;
      }

      divideScalar(scalar) {
        return this.multiplyScalar(1 / scalar);
      }

      min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);
        return this;
      }

      max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);
        return this;
      }

      clamp(min, max) {
        // assumes min < max, componentwise
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        this.z = Math.max(min.z, Math.min(max.z, this.z));
        return this;
      }

      clampScalar(minVal, maxVal) {
        this.x = Math.max(minVal, Math.min(maxVal, this.x));
        this.y = Math.max(minVal, Math.min(maxVal, this.y));
        this.z = Math.max(minVal, Math.min(maxVal, this.z));
        return this;
      }

      clampLength(min, max) {
        var length = this.length();
        return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
      }

      floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        return this;
      }

      ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        return this;
      }

      round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        return this;
      }

      roundToZero() {
        this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
        this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z);
        return this;
      }

      negate() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        return this;
      }

      dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
      } // TODO lengthSquared?


      lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z;
      }

      length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
      }

      manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
      }

      normalize(robust = false) {
        return this.divideScalar(this.length() || 1); // if (robust)
        // {
        //   var maxAbsComp = Math.abs(v[0]);
        //   for (var i = 1; i < N; ++i)
        //   {
        //     var absComp = Math.abs(v[i]);
        //     if (absComp > maxAbsComp)
        //     {
        //       maxAbsComp = absComp;
        //     }
        //   }
        //   var length;
        //   if (maxAbsComp > 0)
        //   {
        //     v /= maxAbsComp;
        //     length = Math.sqrt(Dot(v, v));
        //     v /= length;
        //     length *= maxAbsComp;
        //   }
        //   else
        //   {
        //     length = 0;
        //     for (var i = 0; i < N; ++i)
        //     {
        //       v[i] = 0;
        //     }
        //   }
        //   return length;
        // }
        // else
        // {
        //   var length = this.length();
        //   if (length > 0)
        //   {
        //     v /= length;
        //   }
        //   else
        //   {
        //     for (var i = 0; i < N; ++i)
        //     {
        //       v[i] = 0;
        //     }
        //   }
        // }
      }

      setLength(length) {
        return this.normalize().multiplyScalar(length);
      }

      lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        return this;
      }

      lerpVectors(v1, v2, alpha) {
        return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
      }

      cross(v, w) {
        if (w !== undefined) {
          console.warn("Vector3: .cross() now only accepts one argument. Use .crossVectors( a, b ) instead.");
          return this.crossVectors(v, w);
        }

        return this.crossVectors(this, v);
      }

      crossVectors(a, b) {
        var ax = a.x,
            ay = a.y,
            az = a.z;
        var bx = b.x,
            by = b.y,
            bz = b.z;
        this.x = ay * bz - az * by;
        this.y = az * bx - ax * bz;
        this.z = ax * by - ay * bx;
        return this;
      }

      projectOnVector(vector) {
        var scalar = vector.dot(this) / vector.lengthSq();
        return this.copy(vector).multiplyScalar(scalar);
      }

      projectOnPlane(planeNormal) {
        _vector.copy(this).projectOnVector(planeNormal);

        return this.sub(_vector);
      }

      reflect(normal) {
        // reflect incident vector off plane orthogonal to normal
        // normal is assumed to have unit length
        return this.sub(_vector.copy(normal).multiplyScalar(2 * this.dot(normal)));
      }

      angleTo(v) {
        var theta = this.dot(v) / Math.sqrt(this.lengthSq() * v.lengthSq()); // clamp, to handle numerical problems

        return Math.acos(clamp(theta, -1, 1));
      }

      distanceTo(v) {
        return Math.sqrt(this.distanceToSquared(v));
      }

      distanceToSquared(v) {
        var dx = this.x - v.x,
            dy = this.y - v.y,
            dz = this.z - v.z;
        return dx * dx + dy * dy + dz * dz;
      }

      manhattanDistanceTo(v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z);
      }

      setFromSpherical(s) {
        return this.setFromSphericalCoords(s.radius, s.phi, s.theta);
      }

      setFromSphericalCoords(radius, phi, theta) {
        var sinPhiRadius = Math.sin(phi) * radius;
        this.x = sinPhiRadius * Math.sin(theta);
        this.y = Math.cos(phi) * radius;
        this.z = sinPhiRadius * Math.cos(theta);
        return this;
      }

      setFromCylindrical(c) {
        return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
      }

      setFromCylindricalCoords(radius, theta, y) {
        this.x = radius * Math.sin(theta);
        this.y = y;
        this.z = radius * Math.cos(theta);
        return this;
      }

      setFromMatrixPosition(m) {
        var e = m.elements;
        this.x = e[12];
        this.y = e[13];
        this.z = e[14];
        return this;
      }

      setFromMatrixScale(m) {
        var sx = this.setFromMatrixColumn(m, 0).length();
        var sy = this.setFromMatrixColumn(m, 1).length();
        var sz = this.setFromMatrixColumn(m, 2).length();
        this.x = sx;
        this.y = sy;
        this.z = sz;
        return this;
      }

      setFromMatrixColumn(m, index) {
        return this.fromArray(m.elements, index * 4);
      }

      equals(v) {
        return v.x === this.x && v.y === this.y && v.z === this.z;
      }

      fromArray(array, offset) {
        if (offset === undefined) offset = 0;
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        return this;
      }

      toArray(array, offset) {
        if (array === undefined) array = [];
        if (offset === undefined) offset = 0;
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
        return array;
      }

      fromBufferAttribute(attribute, index, offset) {
        if (offset !== undefined) {
          console.warn("Vector3: offset has been removed from .fromBufferAttribute().");
        }

        this.x = attribute.getX(index);
        this.y = attribute.getY(index);
        this.z = attribute.getZ(index);
        return this;
      }

      toFixed(fractionDigits) {
        if (fractionDigits !== undefined) {
          this.x = parseFloat(this.x.toFixed(fractionDigits));
          this.y = parseFloat(this.y.toFixed(fractionDigits));
          this.z = parseFloat(this.z.toFixed(fractionDigits));
        }

        return this;
      }

    }

    const _vector = v3();

    const _quaternion = quat();

    function v3(x, y, z) {
      return new Vector3$1(x, y, z);
    }

    class Vector4 {
      constructor(x, y, z, w) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
        this.w = w !== undefined ? w : 1;
        this.isVector4 = true;
      }

      get width() {
        return this.z;
      }

      set width(value) {
        this.z = value;
      }

      get height() {
        return this.w;
      }

      set height(value) {
        this.w = value;
      }

      set(x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
      }

      setScalar(scalar) {
        this.x = scalar;
        this.y = scalar;
        this.z = scalar;
        this.w = scalar;
        return this;
      }

      setX(x) {
        this.x = x;
        return this;
      }

      setY(y) {
        this.y = y;
        return this;
      }

      setZ(z) {
        this.z = z;
        return this;
      }

      setW(w) {
        this.w = w;
        return this;
      }

      setComponent(index, value) {
        switch (index) {
          case 0:
            this.x = value;
            break;

          case 1:
            this.y = value;
            break;

          case 2:
            this.z = value;
            break;

          case 3:
            this.w = value;
            break;

          default:
            throw new Error("index is out of range: " + index);
        }

        return this;
      }

      getComponent(index) {
        switch (index) {
          case 0:
            return this.x;

          case 1:
            return this.y;

          case 2:
            return this.z;

          case 3:
            return this.w;

          default:
            throw new Error("index is out of range: " + index);
        }
      }

      clone() {
        return new this.constructor(this.x, this.y, this.z, this.w);
      }

      copy(v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w !== undefined ? v.w : 1;
        return this;
      }

      add(v, w) {
        if (w !== undefined) {
          console.warn("Vector4: .add() now only accepts one argument. Use .addVectors( a, b ) instead.");
          return this.addVectors(v, w);
        }

        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
        return this;
      }

      addScalar(s) {
        this.x += s;
        this.y += s;
        this.z += s;
        this.w += s;
        return this;
      }

      addVectors(a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        this.w = a.w + b.w;
        return this;
      }

      addScaledVector(v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;
        this.w += v.w * s;
        return this;
      }

      sub(v, w) {
        if (w !== undefined) {
          console.warn("Vector4: .sub() now only accepts one argument. Use .subVectors( a, b ) instead.");
          return this.subVectors(v, w);
        }

        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;
        return this;
      }

      subScalar(s) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
        this.w -= s;
        return this;
      }

      subVectors(a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        this.w = a.w - b.w;
        return this;
      }

      multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        this.w *= scalar;
        return this;
      }

      applyMatrix4(m) {
        var x = this.x,
            y = this.y,
            z = this.z,
            w = this.w;
        var e = m.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
        this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
        this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;
        return this;
      }

      divideScalar(scalar) {
        return this.multiplyScalar(1 / scalar);
      }

      setAxisAngleFromQuaternion(q) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/index.htm
        // q is assumed to be normalized
        this.w = 2 * Math.acos(q.w);
        var s = Math.sqrt(1 - q.w * q.w);

        if (s < 0.0001) {
          this.x = 1;
          this.y = 0;
          this.z = 0;
        } else {
          this.x = q.x / s;
          this.y = q.y / s;
          this.z = q.z / s;
        }

        return this;
      }

      setAxisAngleFromRotationMatrix(m) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        var angle,
            x,
            y,
            z,
            // variables for result
        epsilon = 0.01,
            // margin to allow for rounding errors
        epsilon2 = 0.1,
            // margin to distinguish between 0 and 180 degrees
        te = m.elements,
            m11 = te[0],
            m12 = te[4],
            m13 = te[8],
            m21 = te[1],
            m22 = te[5],
            m23 = te[9],
            m31 = te[2],
            m32 = te[6],
            m33 = te[10];

        if (Math.abs(m12 - m21) < epsilon && Math.abs(m13 - m31) < epsilon && Math.abs(m23 - m32) < epsilon) {
          // singularity found
          // first check for identity matrix which must have +1 for all terms
          // in leading diagonal and zero in other terms
          if (Math.abs(m12 + m21) < epsilon2 && Math.abs(m13 + m31) < epsilon2 && Math.abs(m23 + m32) < epsilon2 && Math.abs(m11 + m22 + m33 - 3) < epsilon2) {
            // this singularity is identity matrix so angle = 0
            this.set(1, 0, 0, 0);
            return this; // zero angle, arbitrary axis
          } // otherwise this singularity is angle = 180


          angle = Math.PI;
          var xx = (m11 + 1) / 2;
          var yy = (m22 + 1) / 2;
          var zz = (m33 + 1) / 2;
          var xy = (m12 + m21) / 4;
          var xz = (m13 + m31) / 4;
          var yz = (m23 + m32) / 4;

          if (xx > yy && xx > zz) {
            // m11 is the largest diagonal term
            if (xx < epsilon) {
              x = 0;
              y = 0.707106781;
              z = 0.707106781;
            } else {
              x = Math.sqrt(xx);
              y = xy / x;
              z = xz / x;
            }
          } else if (yy > zz) {
            // m22 is the largest diagonal term
            if (yy < epsilon) {
              x = 0.707106781;
              y = 0;
              z = 0.707106781;
            } else {
              y = Math.sqrt(yy);
              x = xy / y;
              z = yz / y;
            }
          } else {
            // m33 is the largest diagonal term so base result on this
            if (zz < epsilon) {
              x = 0.707106781;
              y = 0.707106781;
              z = 0;
            } else {
              z = Math.sqrt(zz);
              x = xz / z;
              y = yz / z;
            }
          }

          this.set(x, y, z, angle);
          return this; // return 180 deg rotation
        } // as we have reached here there are no singularities so we can handle normally


        var s = Math.sqrt((m32 - m23) * (m32 - m23) + (m13 - m31) * (m13 - m31) + (m21 - m12) * (m21 - m12)); // used to normalize

        if (Math.abs(s) < 0.001) s = 1; // prevent divide by zero, should not happen if matrix is orthogonal and should be
        // caught by singularity test above, but I've left it in just in case

        this.x = (m32 - m23) / s;
        this.y = (m13 - m31) / s;
        this.z = (m21 - m12) / s;
        this.w = Math.acos((m11 + m22 + m33 - 1) / 2);
        return this;
      }

      min(v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);
        this.w = Math.min(this.w, v.w);
        return this;
      }

      max(v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);
        this.w = Math.max(this.w, v.w);
        return this;
      }

      clamp(min, max) {
        // assumes min < max, componentwise
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        this.z = Math.max(min.z, Math.min(max.z, this.z));
        this.w = Math.max(min.w, Math.min(max.w, this.w));
        return this;
      }

      clampScalar(minVal, maxVal) {
        this.x = Math.max(minVal, Math.min(maxVal, this.x));
        this.y = Math.max(minVal, Math.min(maxVal, this.y));
        this.z = Math.max(minVal, Math.min(maxVal, this.z));
        this.w = Math.max(minVal, Math.min(maxVal, this.w));
        return this;
      }

      clampLength(min, max) {
        var length = this.length();
        return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
      }

      floor() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        this.w = Math.floor(this.w);
        return this;
      }

      ceil() {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        this.w = Math.ceil(this.w);
        return this;
      }

      round() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        this.w = Math.round(this.w);
        return this;
      }

      roundToZero() {
        this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
        this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z);
        this.w = this.w < 0 ? Math.ceil(this.w) : Math.floor(this.w);
        return this;
      }

      negate() {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        this.w = -this.w;
        return this;
      }

      dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
      }

      lengthSq() {
        return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
      }

      length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
      }

      manhattanLength() {
        return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
      }

      normalize() {
        return this.divideScalar(this.length() || 1);
      }

      setLength(length) {
        return this.normalize().multiplyScalar(length);
      }

      lerp(v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        this.w += (v.w - this.w) * alpha;
        return this;
      }

      lerpVectors(v1, v2, alpha) {
        return this.subVectors(v2, v1).multiplyScalar(alpha).add(v1);
      }

      equals(v) {
        return v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w;
      }

      fromArray(array, offset) {
        if (offset === undefined) offset = 0;
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        this.w = array[offset + 3];
        return this;
      }

      toArray(array, offset) {
        if (array === undefined) array = [];
        if (offset === undefined) offset = 0;
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
        array[offset + 3] = this.w;
        return array;
      }

      fromBufferAttribute(attribute, index, offset) {
        if (offset !== undefined) {
          console.warn("Vector4: offset has been removed from .fromBufferAttribute().");
        }

        this.x = attribute.getX(index);
        this.y = attribute.getY(index);
        this.z = attribute.getZ(index);
        this.w = attribute.getW(index);
        return this;
      }

    }
    function v4(x, y, z, w) {
      return Vector4(x, y, z, w);
    }

    var _vector$1 = v3();

    class Matrix3 {
      constructor() {
        this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1];

        if (arguments.length > 0) {
          console.error("Matrix3: the constructor no longer reads arguments. use .set() instead.");
        }

        this.isMatrix3 = true;
      }

      set(n11, n12, n13, n21, n22, n23, n31, n32, n33) {
        var te = this.elements;
        te[0] = n11;
        te[1] = n21;
        te[2] = n31;
        te[3] = n12;
        te[4] = n22;
        te[5] = n32;
        te[6] = n13;
        te[7] = n23;
        te[8] = n33;
        return this;
      }

      identity() {
        this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
        return this;
      }

      clone() {
        return new this.constructor().fromArray(this.elements);
      }

      copy(m) {
        var te = this.elements;
        var me = m.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        te[4] = me[4];
        te[5] = me[5];
        te[6] = me[6];
        te[7] = me[7];
        te[8] = me[8];
        return this;
      }

      setFromMatrix4(m) {
        var me = m.elements;
        this.set(me[0], me[4], me[8], me[1], me[5], me[9], me[2], me[6], me[10]);
        return this;
      }

      applyToBufferAttribute(attribute) {
        for (var i = 0, l = attribute.count; i < l; i++) {
          _vector$1.x = attribute.getX(i);
          _vector$1.y = attribute.getY(i);
          _vector$1.z = attribute.getZ(i);

          _vector$1.applyMatrix3(this);

          attribute.setXYZ(i, _vector$1.x, _vector$1.y, _vector$1.z);
        }

        return attribute;
      }

      multiply(m) {
        return this.multiplyMatrices(this, m);
      }

      premultiply(m) {
        return this.multiplyMatrices(m, this);
      }

      multiplyMatrices(a, b) {
        var ae = a.elements;
        var be = b.elements;
        var te = this.elements;
        var a11 = ae[0],
            a12 = ae[3],
            a13 = ae[6];
        var a21 = ae[1],
            a22 = ae[4],
            a23 = ae[7];
        var a31 = ae[2],
            a32 = ae[5],
            a33 = ae[8];
        var b11 = be[0],
            b12 = be[3],
            b13 = be[6];
        var b21 = be[1],
            b22 = be[4],
            b23 = be[7];
        var b31 = be[2],
            b32 = be[5],
            b33 = be[8];
        te[0] = a11 * b11 + a12 * b21 + a13 * b31;
        te[3] = a11 * b12 + a12 * b22 + a13 * b32;
        te[6] = a11 * b13 + a12 * b23 + a13 * b33;
        te[1] = a21 * b11 + a22 * b21 + a23 * b31;
        te[4] = a21 * b12 + a22 * b22 + a23 * b32;
        te[7] = a21 * b13 + a22 * b23 + a23 * b33;
        te[2] = a31 * b11 + a32 * b21 + a33 * b31;
        te[5] = a31 * b12 + a32 * b22 + a33 * b32;
        te[8] = a31 * b13 + a32 * b23 + a33 * b33;
        return this;
      }

      multiplyScalar(s) {
        var te = this.elements;
        te[0] *= s;
        te[3] *= s;
        te[6] *= s;
        te[1] *= s;
        te[4] *= s;
        te[7] *= s;
        te[2] *= s;
        te[5] *= s;
        te[8] *= s;
        return this;
      }

      determinant() {
        var te = this.elements;
        var a = te[0],
            b = te[1],
            c = te[2],
            d = te[3],
            e = te[4],
            f = te[5],
            g = te[6],
            h = te[7],
            i = te[8];
        return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
      }

      getInverse(matrix, throwOnDegenerate) {
        if (matrix && matrix.isMatrix4) {
          console.error("Matrix3: .getInverse() no longer takes a Matrix4 argument.");
        }

        var me = matrix.elements,
            te = this.elements,
            n11 = me[0],
            n21 = me[1],
            n31 = me[2],
            n12 = me[3],
            n22 = me[4],
            n32 = me[5],
            n13 = me[6],
            n23 = me[7],
            n33 = me[8],
            t11 = n33 * n22 - n32 * n23,
            t12 = n32 * n13 - n33 * n12,
            t13 = n23 * n12 - n22 * n13,
            det = n11 * t11 + n21 * t12 + n31 * t13;

        if (det === 0) {
          var msg = "Matrix3: .getInverse() can't invert matrix, determinant is 0";

          if (throwOnDegenerate === true) {
            throw new Error(msg);
          } else {
            console.warn(msg);
          }

          return this.identity();
        }

        var detInv = 1 / det;
        te[0] = t11 * detInv;
        te[1] = (n31 * n23 - n33 * n21) * detInv;
        te[2] = (n32 * n21 - n31 * n22) * detInv;
        te[3] = t12 * detInv;
        te[4] = (n33 * n11 - n31 * n13) * detInv;
        te[5] = (n31 * n12 - n32 * n11) * detInv;
        te[6] = t13 * detInv;
        te[7] = (n21 * n13 - n23 * n11) * detInv;
        te[8] = (n22 * n11 - n21 * n12) * detInv;
        return this;
      }

      transpose() {
        var tmp,
            m = this.elements;
        tmp = m[1];
        m[1] = m[3];
        m[3] = tmp;
        tmp = m[2];
        m[2] = m[6];
        m[6] = tmp;
        tmp = m[5];
        m[5] = m[7];
        m[7] = tmp;
        return this;
      }

      getNormalMatrix(matrix4) {
        return this.setFromMatrix4(matrix4).getInverse(this).transpose();
      }

      transposeIntoArray(r) {
        var m = this.elements;
        r[0] = m[0];
        r[1] = m[3];
        r[2] = m[6];
        r[3] = m[1];
        r[4] = m[4];
        r[5] = m[7];
        r[6] = m[2];
        r[7] = m[5];
        r[8] = m[8];
        return this;
      }

      setUvTransform(tx, ty, sx, sy, rotation, cx, cy) {
        var c = Math.cos(rotation);
        var s = Math.sin(rotation);
        this.set(sx * c, sx * s, -sx * (c * cx + s * cy) + cx + tx, -sy * s, sy * c, -sy * (-s * cx + c * cy) + cy + ty, 0, 0, 1);
      }

      scale(sx, sy) {
        var te = this.elements;
        te[0] *= sx;
        te[3] *= sx;
        te[6] *= sx;
        te[1] *= sy;
        te[4] *= sy;
        te[7] *= sy;
        return this;
      }

      rotate(theta) {
        var c = Math.cos(theta);
        var s = Math.sin(theta);
        var te = this.elements;
        var a11 = te[0],
            a12 = te[3],
            a13 = te[6];
        var a21 = te[1],
            a22 = te[4],
            a23 = te[7];
        te[0] = c * a11 + s * a21;
        te[3] = c * a12 + s * a22;
        te[6] = c * a13 + s * a23;
        te[1] = -s * a11 + c * a21;
        te[4] = -s * a12 + c * a22;
        te[7] = -s * a13 + c * a23;
        return this;
      }

      translate(tx, ty) {
        var te = this.elements;
        te[0] += tx * te[2];
        te[3] += tx * te[5];
        te[6] += tx * te[8];
        te[1] += ty * te[2];
        te[4] += ty * te[5];
        te[7] += ty * te[8];
        return this;
      }

      equals(matrix) {
        var te = this.elements;
        var me = matrix.elements;

        for (var i = 0; i < 9; i++) {
          if (te[i] !== me[i]) return false;
        }

        return true;
      }

      fromArray(array, offset) {
        if (offset === undefined) offset = 0;

        for (var i = 0; i < 9; i++) {
          this.elements[i] = array[i + offset];
        }

        return this;
      }

      toArray(array, offset) {
        if (array === undefined) array = [];
        if (offset === undefined) offset = 0;
        var te = this.elements;
        array[offset] = te[0];
        array[offset + 1] = te[1];
        array[offset + 2] = te[2];
        array[offset + 3] = te[3];
        array[offset + 4] = te[4];
        array[offset + 5] = te[5];
        array[offset + 6] = te[6];
        array[offset + 7] = te[7];
        array[offset + 8] = te[8];
        return array;
      }

    }
    function m3() {
      return new Matrix3();
    }

    class Matrix4 {
      constructor() {
        this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];

        if (arguments.length > 0) {
          console.error(" Matrix4: the constructor no longer reads arguments. use .set() instead.");
        }

        this.isMatrix4 = true;
      }

      set(n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
        var te = this.elements;
        te[0] = n11;
        te[4] = n12;
        te[8] = n13;
        te[12] = n14;
        te[1] = n21;
        te[5] = n22;
        te[9] = n23;
        te[13] = n24;
        te[2] = n31;
        te[6] = n32;
        te[10] = n33;
        te[14] = n34;
        te[3] = n41;
        te[7] = n42;
        te[11] = n43;
        te[15] = n44;
        return this;
      }

      static get Identity() {
        return new Matrix4();
      }

      identity() {
        this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        return this;
      }

      clone() {
        return new Matrix4().fromArray(this.elements);
      }

      copy(m) {
        var te = this.elements;
        var me = m.elements;
        te[0] = me[0];
        te[1] = me[1];
        te[2] = me[2];
        te[3] = me[3];
        te[4] = me[4];
        te[5] = me[5];
        te[6] = me[6];
        te[7] = me[7];
        te[8] = me[8];
        te[9] = me[9];
        te[10] = me[10];
        te[11] = me[11];
        te[12] = me[12];
        te[13] = me[13];
        te[14] = me[14];
        te[15] = me[15];
        return this;
      }

      copyPosition(m) {
        var te = this.elements,
            me = m.elements;
        te[12] = me[12];
        te[13] = me[13];
        te[14] = me[14];
        return this;
      }

      extractBasis(xAxis, yAxis, zAxis) {
        xAxis.setFromMatrixColumn(this, 0);
        yAxis.setFromMatrixColumn(this, 1);
        zAxis.setFromMatrixColumn(this, 2);
        return this;
      }

      makeBasis(xAxis, yAxis, zAxis) {
        this.set(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, 0, 0, 0, 1);
        return this;
      }

      extractRotation(m) {
        // this method does not support reflection matrices
        var te = this.elements;
        var me = m.elements;

        var scaleX = 1 / _v1.setFromMatrixColumn(m, 0).length();

        var scaleY = 1 / _v1.setFromMatrixColumn(m, 1).length();

        var scaleZ = 1 / _v1.setFromMatrixColumn(m, 2).length();

        te[0] = me[0] * scaleX;
        te[1] = me[1] * scaleX;
        te[2] = me[2] * scaleX;
        te[3] = 0;
        te[4] = me[4] * scaleY;
        te[5] = me[5] * scaleY;
        te[6] = me[6] * scaleY;
        te[7] = 0;
        te[8] = me[8] * scaleZ;
        te[9] = me[9] * scaleZ;
        te[10] = me[10] * scaleZ;
        te[11] = 0;
        te[12] = 0;
        te[13] = 0;
        te[14] = 0;
        te[15] = 1;
        return this;
      }

      makeRotationFromEuler(euler) {
        if (!(euler && euler.isEuler)) {
          console.error(" Matrix4: .makeRotationFromEuler() now expects a Euler rotation rather than a Vector3 and order.");
        }

        var te = this.elements;
        var x = euler.x,
            y = euler.y,
            z = euler.z;
        var a = Math.cos(x),
            b = Math.sin(x);
        var c = Math.cos(y),
            d = Math.sin(y);
        var e = Math.cos(z),
            f = Math.sin(z);

        if (euler.order === "XYZ") {
          var ae = a * e,
              af = a * f,
              be = b * e,
              bf = b * f;
          te[0] = c * e;
          te[4] = -c * f;
          te[8] = d;
          te[1] = af + be * d;
          te[5] = ae - bf * d;
          te[9] = -b * c;
          te[2] = bf - ae * d;
          te[6] = be + af * d;
          te[10] = a * c;
        } else if (euler.order === "YXZ") {
          var ce = c * e,
              cf = c * f,
              de = d * e,
              df = d * f;
          te[0] = ce + df * b;
          te[4] = de * b - cf;
          te[8] = a * d;
          te[1] = a * f;
          te[5] = a * e;
          te[9] = -b;
          te[2] = cf * b - de;
          te[6] = df + ce * b;
          te[10] = a * c;
        } else if (euler.order === "ZXY") {
          var ce = c * e,
              cf = c * f,
              de = d * e,
              df = d * f;
          te[0] = ce - df * b;
          te[4] = -a * f;
          te[8] = de + cf * b;
          te[1] = cf + de * b;
          te[5] = a * e;
          te[9] = df - ce * b;
          te[2] = -a * d;
          te[6] = b;
          te[10] = a * c;
        } else if (euler.order === "ZYX") {
          var ae = a * e,
              af = a * f,
              be = b * e,
              bf = b * f;
          te[0] = c * e;
          te[4] = be * d - af;
          te[8] = ae * d + bf;
          te[1] = c * f;
          te[5] = bf * d + ae;
          te[9] = af * d - be;
          te[2] = -d;
          te[6] = b * c;
          te[10] = a * c;
        } else if (euler.order === "YZX") {
          var ac = a * c,
              ad = a * d,
              bc = b * c,
              bd = b * d;
          te[0] = c * e;
          te[4] = bd - ac * f;
          te[8] = bc * f + ad;
          te[1] = f;
          te[5] = a * e;
          te[9] = -b * e;
          te[2] = -d * e;
          te[6] = ad * f + bc;
          te[10] = ac - bd * f;
        } else if (euler.order === "XZY") {
          var ac = a * c,
              ad = a * d,
              bc = b * c,
              bd = b * d;
          te[0] = c * e;
          te[4] = -f;
          te[8] = d * e;
          te[1] = ac * f + bd;
          te[5] = a * e;
          te[9] = ad * f - bc;
          te[2] = bc * f - ad;
          te[6] = b * e;
          te[10] = bd * f + ac;
        } // bottom row


        te[3] = 0;
        te[7] = 0;
        te[11] = 0; // last column

        te[12] = 0;
        te[13] = 0;
        te[14] = 0;
        te[15] = 1;
        return this;
      }

      makeRotationFromQuaternion(q) {
        return this.compose(_zero, q, _one);
      }

      lookAt(eye, target, up) {
        var te = this.elements;

        _z.subVectors(eye, target);

        if (_z.lengthSq() === 0) {
          // eye and target are in the same position
          _z.z = 1;
        }

        _z.normalize();

        _x.crossVectors(up, _z);

        if (_x.lengthSq() === 0) {
          // up and z are parallel
          if (Math.abs(up.z) === 1) {
            _z.x += 0.0001;
          } else {
            _z.z += 0.0001;
          }

          _z.normalize();

          _x.crossVectors(up, _z);
        }

        _x.normalize();

        _y.crossVectors(_z, _x);

        te[0] = _x.x;
        te[4] = _y.x;
        te[8] = _z.x;
        te[1] = _x.y;
        te[5] = _y.y;
        te[9] = _z.y;
        te[2] = _x.z;
        te[6] = _y.z;
        te[10] = _z.z;
        return this;
      }

      multiply(m, n) {
        if (n !== undefined) {
          console.warn(" Matrix4: .multiply() now only accepts one argument. Use .multiplyMatrices( a, b ) instead.");
          return this.multiplyMatrices(m, n);
        }

        return this.multiplyMatrices(this, m);
      }

      premultiply(m) {
        return this.multiplyMatrices(m, this);
      }

      multiplyMatrices(a, b) {
        var ae = a.elements;
        var be = b.elements;
        var te = this.elements;
        var a11 = ae[0],
            a12 = ae[4],
            a13 = ae[8],
            a14 = ae[12];
        var a21 = ae[1],
            a22 = ae[5],
            a23 = ae[9],
            a24 = ae[13];
        var a31 = ae[2],
            a32 = ae[6],
            a33 = ae[10],
            a34 = ae[14];
        var a41 = ae[3],
            a42 = ae[7],
            a43 = ae[11],
            a44 = ae[15];
        var b11 = be[0],
            b12 = be[4],
            b13 = be[8],
            b14 = be[12];
        var b21 = be[1],
            b22 = be[5],
            b23 = be[9],
            b24 = be[13];
        var b31 = be[2],
            b32 = be[6],
            b33 = be[10],
            b34 = be[14];
        var b41 = be[3],
            b42 = be[7],
            b43 = be[11],
            b44 = be[15];
        te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
        te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
        te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
        te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
        te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
        te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
        te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
        te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
        te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
        te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
        te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
        te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
        te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
        te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
        te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
        te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
        return this;
      }

      multiplyScalar(s) {
        var te = this.elements;
        te[0] *= s;
        te[4] *= s;
        te[8] *= s;
        te[12] *= s;
        te[1] *= s;
        te[5] *= s;
        te[9] *= s;
        te[13] *= s;
        te[2] *= s;
        te[6] *= s;
        te[10] *= s;
        te[14] *= s;
        te[3] *= s;
        te[7] *= s;
        te[11] *= s;
        te[15] *= s;
        return this;
      }

      applyToBufferAttribute(attribute) {
        for (var i = 0, l = attribute.count; i < l; i++) {
          _v1.x = attribute.getX(i);
          _v1.y = attribute.getY(i);
          _v1.z = attribute.getZ(i);

          _v1.applyMatrix4(this);

          attribute.setXYZ(i, _v1.x, _v1.y, _v1.z);
        }

        return attribute;
      }

      determinant() {
        var te = this.elements;
        var n11 = te[0],
            n12 = te[4],
            n13 = te[8],
            n14 = te[12];
        var n21 = te[1],
            n22 = te[5],
            n23 = te[9],
            n24 = te[13];
        var n31 = te[2],
            n32 = te[6],
            n33 = te[10],
            n34 = te[14];
        var n41 = te[3],
            n42 = te[7],
            n43 = te[11],
            n44 = te[15]; //TODO: make this more efficient
        //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

        return n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) + n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) + n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) + n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31);
      }

      transpose() {
        var te = this.elements;
        var tmp;
        tmp = te[1];
        te[1] = te[4];
        te[4] = tmp;
        tmp = te[2];
        te[2] = te[8];
        te[8] = tmp;
        tmp = te[6];
        te[6] = te[9];
        te[9] = tmp;
        tmp = te[3];
        te[3] = te[12];
        te[12] = tmp;
        tmp = te[7];
        te[7] = te[13];
        te[13] = tmp;
        tmp = te[11];
        te[11] = te[14];
        te[14] = tmp;
        return this;
      }

      setPosition(x, y, z) {
        var te = this.elements;

        if (x.isVector3) {
          te[12] = x.x;
          te[13] = x.y;
          te[14] = x.z;
        } else {
          te[12] = x;
          te[13] = y;
          te[14] = z;
        }

        return this;
      }

      getInverse(m, throwOnDegenerate) {
        // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
        var te = this.elements,
            me = m.elements,
            n11 = me[0],
            n21 = me[1],
            n31 = me[2],
            n41 = me[3],
            n12 = me[4],
            n22 = me[5],
            n32 = me[6],
            n42 = me[7],
            n13 = me[8],
            n23 = me[9],
            n33 = me[10],
            n43 = me[11],
            n14 = me[12],
            n24 = me[13],
            n34 = me[14],
            n44 = me[15],
            t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
            t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
            t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
            t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
        var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

        if (det === 0) {
          var msg = " Matrix4: .getInverse() can't invert matrix, determinant is 0";

          if (throwOnDegenerate === true) {
            throw new Error(msg);
          } else {
            console.warn(msg);
          }

          return this.identity();
        }

        var detInv = 1 / det;
        te[0] = t11 * detInv;
        te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
        te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
        te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
        te[4] = t12 * detInv;
        te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
        te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
        te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
        te[8] = t13 * detInv;
        te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
        te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
        te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
        te[12] = t14 * detInv;
        te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
        te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
        te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
        return this;
      }

      scale(v) {
        var te = this.elements;
        var x = v.x,
            y = v.y,
            z = v.z;
        te[0] *= x;
        te[4] *= y;
        te[8] *= z;
        te[1] *= x;
        te[5] *= y;
        te[9] *= z;
        te[2] *= x;
        te[6] *= y;
        te[10] *= z;
        te[3] *= x;
        te[7] *= y;
        te[11] *= z;
        return this;
      }

      getMaxScaleOnAxis() {
        var te = this.elements;
        var scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
        var scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
        var scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
        return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
      }

      makeTranslation(x, y, z) {
        this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
        return this;
      }

      makeRotationX(theta) {
        var c = Math.cos(theta),
            s = Math.sin(theta);
        this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);
        return this;
      }

      makeRotationY(theta) {
        var c = Math.cos(theta),
            s = Math.sin(theta);
        this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);
        return this;
      }

      makeRotationZ(theta) {
        var c = Math.cos(theta),
            s = Math.sin(theta);
        this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
        return this;
      }

      makeRotationAxis(axis, angle) {
        // Based on http://www.gamedev.net/reference/articles/article1199.asp
        var c = Math.cos(angle);
        var s = Math.sin(angle);
        var t = 1 - c;
        var x = axis.x,
            y = axis.y,
            z = axis.z;
        var tx = t * x,
            ty = t * y;
        this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
        return this;
      }

      makeScale(x, y, z) {
        this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
        return this;
      }

      makeShear(x, y, z) {
        this.set(1, y, z, 0, x, 1, z, 0, x, y, 1, 0, 0, 0, 0, 1);
        return this;
      }

      compose(position, quaternion, scale) {
        var te = this.elements;
        var x = quaternion._x,
            y = quaternion._y,
            z = quaternion._z,
            w = quaternion._w;
        var x2 = x + x,
            y2 = y + y,
            z2 = z + z;
        var xx = x * x2,
            xy = x * y2,
            xz = x * z2;
        var yy = y * y2,
            yz = y * z2,
            zz = z * z2;
        var wx = w * x2,
            wy = w * y2,
            wz = w * z2;
        var sx = scale.x,
            sy = scale.y,
            sz = scale.z;
        te[0] = (1 - (yy + zz)) * sx;
        te[1] = (xy + wz) * sx;
        te[2] = (xz - wy) * sx;
        te[3] = 0;
        te[4] = (xy - wz) * sy;
        te[5] = (1 - (xx + zz)) * sy;
        te[6] = (yz + wx) * sy;
        te[7] = 0;
        te[8] = (xz + wy) * sz;
        te[9] = (yz - wx) * sz;
        te[10] = (1 - (xx + yy)) * sz;
        te[11] = 0;
        te[12] = position.x;
        te[13] = position.y;
        te[14] = position.z;
        te[15] = 1;
        return this;
      }

      decompose(position, quaternion, scale) {
        var te = this.elements;

        var sx = _v1.set(te[0], te[1], te[2]).length();

        var sy = _v1.set(te[4], te[5], te[6]).length();

        var sz = _v1.set(te[8], te[9], te[10]).length(); // if determine is negative, we need to invert one scale


        var det = this.determinant();
        if (det < 0) sx = -sx;
        position.x = te[12];
        position.y = te[13];
        position.z = te[14]; // scale the rotation part

        _m1.copy(this);

        var invSX = 1 / sx;
        var invSY = 1 / sy;
        var invSZ = 1 / sz;
        _m1.elements[0] *= invSX;
        _m1.elements[1] *= invSX;
        _m1.elements[2] *= invSX;
        _m1.elements[4] *= invSY;
        _m1.elements[5] *= invSY;
        _m1.elements[6] *= invSY;
        _m1.elements[8] *= invSZ;
        _m1.elements[9] *= invSZ;
        _m1.elements[10] *= invSZ;
        quaternion.setFromRotationMatrix(_m1);
        scale.x = sx;
        scale.y = sy;
        scale.z = sz;
        return this;
      }

      makePerspective(left, right, top, bottom, near, far) {
        if (far === undefined) {
          console.warn(" Matrix4: .makePerspective() has been redefined and has a new signature. Please check the docs.");
        }

        var te = this.elements;
        var x = 2 * near / (right - left);
        var y = 2 * near / (top - bottom);
        var a = (right + left) / (right - left);
        var b = (top + bottom) / (top - bottom);
        var c = -(far + near) / (far - near);
        var d = -2 * far * near / (far - near);
        te[0] = x;
        te[4] = 0;
        te[8] = a;
        te[12] = 0;
        te[1] = 0;
        te[5] = y;
        te[9] = b;
        te[13] = 0;
        te[2] = 0;
        te[6] = 0;
        te[10] = c;
        te[14] = d;
        te[3] = 0;
        te[7] = 0;
        te[11] = -1;
        te[15] = 0;
        return this;
      }

      makeOrthographic(left, right, top, bottom, near, far) {
        var te = this.elements;
        var w = 1.0 / (right - left);
        var h = 1.0 / (top - bottom);
        var p = 1.0 / (far - near);
        var x = (right + left) * w;
        var y = (top + bottom) * h;
        var z = (far + near) * p;
        te[0] = 2 * w;
        te[4] = 0;
        te[8] = 0;
        te[12] = -x;
        te[1] = 0;
        te[5] = 2 * h;
        te[9] = 0;
        te[13] = -y;
        te[2] = 0;
        te[6] = 0;
        te[10] = -2 * p;
        te[14] = -z;
        te[3] = 0;
        te[7] = 0;
        te[11] = 0;
        te[15] = 1;
        return this;
      }

      equals(matrix) {
        var te = this.elements;
        var me = matrix.elements;

        for (var i = 0; i < 16; i++) {
          if (te[i] !== me[i]) return false;
        }

        return true;
      }

      fromArray(array, offset) {
        if (offset === undefined) offset = 0;

        for (var i = 0; i < 16; i++) {
          this.elements[i] = array[i + offset];
        }

        return this;
      }

      toArray(array, offset) {
        if (array === undefined) array = [];
        if (offset === undefined) offset = 0;
        var te = this.elements;
        array[offset] = te[0];
        array[offset + 1] = te[1];
        array[offset + 2] = te[2];
        array[offset + 3] = te[3];
        array[offset + 4] = te[4];
        array[offset + 5] = te[5];
        array[offset + 6] = te[6];
        array[offset + 7] = te[7];
        array[offset + 8] = te[8];
        array[offset + 9] = te[9];
        array[offset + 10] = te[10];
        array[offset + 11] = te[11];
        array[offset + 12] = te[12];
        array[offset + 13] = te[13];
        array[offset + 14] = te[14];
        array[offset + 15] = te[15];
        return array;
      }

    }

    const _v1 = v3();

    const _m1 = m4();

    const _zero = v3(0, 0, 0);

    const _one = v3(1, 1, 1);

    const _x = v3();

    const _y = v3();

    const _z = v3();

    function m4() {
      return new Matrix4();
    }

    var _matrix = m4();

    var _quaternion$1 = quat();
    class Euler {
      constructor(x, y, z, order) {
        this._x = x || 0;
        this._y = y || 0;
        this._z = z || 0;
        this._order = order || Euler.DefaultOrder;
        this.isEuler = true;
      }

      get x() {
        return this._x;
      }

      set x(value) {
        this._x = value;

        this._onChangeCallback();
      }

      get y() {
        return this._y;
      }

      set y(value) {
        this._y = value;

        this._onChangeCallback();
      }

      get z() {
        return this._z;
      }

      set z(value) {
        this._z = value;

        this._onChangeCallback();
      }

      get order() {
        return this._order;
      }

      set order(value) {
        this._order = value;

        this._onChangeCallback();
      }

      set(x, y, z, order) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._order = order || this._order;

        this._onChangeCallback();

        return this;
      }

      clone() {
        return new this.constructor(this._x, this._y, this._z, this._order);
      }

      copy(euler) {
        this._x = euler._x;
        this._y = euler._y;
        this._z = euler._z;
        this._order = euler._order;

        this._onChangeCallback();

        return this;
      }

      setFromRotationMatrix(m, order, update) {
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        var te = m.elements;
        var m11 = te[0],
            m12 = te[4],
            m13 = te[8];
        var m21 = te[1],
            m22 = te[5],
            m23 = te[9];
        var m31 = te[2],
            m32 = te[6],
            m33 = te[10];
        order = order || this._order;

        if (order === "XYZ") {
          this._y = Math.asin(clamp(m13, -1, 1));

          if (Math.abs(m13) < 0.9999999) {
            this._x = Math.atan2(-m23, m33);
            this._z = Math.atan2(-m12, m11);
          } else {
            this._x = Math.atan2(m32, m22);
            this._z = 0;
          }
        } else if (order === "YXZ") {
          this._x = Math.asin(-clamp(m23, -1, 1));

          if (Math.abs(m23) < 0.9999999) {
            this._y = Math.atan2(m13, m33);
            this._z = Math.atan2(m21, m22);
          } else {
            this._y = Math.atan2(-m31, m11);
            this._z = 0;
          }
        } else if (order === "ZXY") {
          this._x = Math.asin(clamp(m32, -1, 1));

          if (Math.abs(m32) < 0.9999999) {
            this._y = Math.atan2(-m31, m33);
            this._z = Math.atan2(-m12, m22);
          } else {
            this._y = 0;
            this._z = Math.atan2(m21, m11);
          }
        } else if (order === "ZYX") {
          this._y = Math.asin(-clamp(m31, -1, 1));

          if (Math.abs(m31) < 0.9999999) {
            this._x = Math.atan2(m32, m33);
            this._z = Math.atan2(m21, m11);
          } else {
            this._x = 0;
            this._z = Math.atan2(-m12, m22);
          }
        } else if (order === "YZX") {
          this._z = Math.asin(clamp(m21, -1, 1));

          if (Math.abs(m21) < 0.9999999) {
            this._x = Math.atan2(-m23, m22);
            this._y = Math.atan2(-m31, m11);
          } else {
            this._x = 0;
            this._y = Math.atan2(m13, m33);
          }
        } else if (order === "XZY") {
          this._z = Math.asin(-clamp(m12, -1, 1));

          if (Math.abs(m12) < 0.9999999) {
            this._x = Math.atan2(m32, m22);
            this._y = Math.atan2(m13, m11);
          } else {
            this._x = Math.atan2(-m23, m33);
            this._y = 0;
          }
        } else {
          console.warn("Euler: .setFromRotationMatrix() given unsupported order: " + order);
        }

        this._order = order;
        if (update !== false) this._onChangeCallback();
        return this;
      }

      setFromQuaternion(q, order, update) {
        _matrix.makeRotationFromQuaternion(q);

        return this.setFromRotationMatrix(_matrix, order, update);
      }

      setFromVector3(v, order) {
        return this.set(v.x, v.y, v.z, order || this._order);
      }

      reorder(newOrder) {
        // WARNING: this discards revolution information -bhouston
        _quaternion$1.setFromEuler(this);

        return this.setFromQuaternion(_quaternion$1, newOrder);
      }

      equals(euler) {
        return euler._x === this._x && euler._y === this._y && euler._z === this._z && euler._order === this._order;
      }

      fromArray(array) {
        this._x = array[0];
        this._y = array[1];
        this._z = array[2];
        if (array[3] !== undefined) this._order = array[3];

        this._onChangeCallback();

        return this;
      }

      toArray(array, offset) {
        if (array === undefined) array = [];
        if (offset === undefined) offset = 0;
        array[offset] = this._x;
        array[offset + 1] = this._y;
        array[offset + 2] = this._z;
        array[offset + 3] = this._order;
        return array;
      }

      toVector3(optionalResult) {
        if (optionalResult) {
          return optionalResult.set(this._x, this._y, this._z);
        } else {
          return v3(this._x, this._y, this._z);
        }
      }

      _onChange(callback) {
        this._onChangeCallback = callback;
        return this;
      }

      _onChangeCallback() {}

    }
    function euler(x, y, z) {
      return Euler(x, y, z);
    }

    const Orientation = {
      Common: 0,
      Positive: 1,
      Negative: 2,
      Intersect: 3
    };

    class Segment extends Array {
      /**
       * 线段
       * @param  {Point|Vector3} p0
       * @param  {Point|Vector3} p1
       */
      constructor(p0, p1) {
        super();
        this.push(p0 || v3(), p1 || v3());
        this.center = this.p0.clone().add(this.p1).multiplyScalar(0.5);
        this.lenDirection = this.p1.clone().sub(this.p0);
        this.lenSq = this.lenDirection.lengthSq();
        this.len = Math.sqrt(this.lenSq);
        this.direction = this.lenDirection.clone().normalize();
      }

      get p0() {
        return this[0];
      }

      set p0(value) {
        this[0] = value;
      }

      get p1() {
        return this[1];
      }

      set p1(value) {
        this[1] = value;
      }
      /**
       * @param  {Vector3} amount
       * @param  {Vector3 target
       */


      at(amount, target) {
        if (target === undefined) target = new Vector3();
        return target.subVectors(this.end, this.start).multiplyScalar(amount).add(this.start);
      }

      equals(segment) {
        return this.p0.equals(segment.p0) && this.p1.equals(segment.p1) || this.p1.equals(segment.p0) && this.p1.equals(segment.p0);
      }

      clone() {
        return new Segment(this.p0.clone(), this.p1.clone());
      } //---Distance---------------------------------------------

      /**
       * 点是否在线段上
       * @param  {Vector3} point
       */


      containPoint(point) {
        return point.inside(this);
      }
      /**
       * 点与线段的距离
       * @param  {Vector3} point
       */


      distancePoint(point) {
        return point.distanceSegment(this);
      }
      /**
       * 线段到线段的距离
       * @param  {Segment} segment
       */


      distanceSegment(segment) {
        var result = {
          parameters: [],
          closests: []
        };

        function GetClampedRoot(slope, h0, h1) {
          var r;

          if (h0 < 0) {
            if (h1 > 0) {
              r = -h0 / slope;

              if (r > 1) {
                r = 0.5;
              } // The slope is positive and -h0 is positive, so there is no
              // need to test for a negative value and clamp it.

            } else {
              r = 1;
            }
          } else {
            r = 0;
          }

          return r;
        }

        function ComputevarIntersection(sValue, classify, edge, end) {
          if (classify[0] < 0) {
            edge[0] = 0;
            end[0][0] = 0;
            end[0][1] = mF00 / mB;

            if (end[0][1] < 0 || end[0][1] > 1) {
              end[0][1] = 0.5;
            }

            if (classify[1] == 0) {
              edge[1] = 3;
              end[1][0] = sValue[1];
              end[1][1] = 1;
            } else // classify[1] > 0
              {
                edge[1] = 1;
                end[1][0] = 1;
                end[1][1] = mF10 / mB;

                if (end[1][1] < 0 || end[1][1] > 1) {
                  end[1][1] = 0.5;
                }
              }
          } else if (classify[0] == 0) {
            edge[0] = 2;
            end[0][0] = sValue[0];
            end[0][1] = 0;

            if (classify[1] < 0) {
              edge[1] = 0;
              end[1][0] = 0;
              end[1][1] = mF00 / mB;

              if (end[1][1] < 0 || end[1][1] > 1) {
                end[1][1] = 0.5;
              }
            } else if (classify[1] == 0) {
              edge[1] = 3;
              end[1][0] = sValue[1];
              end[1][1] = 1;
            } else {
              edge[1] = 1;
              end[1][0] = 1;
              end[1][1] = mF10 / mB;

              if (end[1][1] < 0 || end[1][1] > 1) {
                end[1][1] = 0.5;
              }
            }
          } else // classify[0] > 0
            {
              edge[0] = 1;
              end[0][0] = 1;
              end[0][1] = mF10 / mB;

              if (end[0][1] < 0 || end[0][1] > 1) {
                end[0][1] = 0.5;
              }

              if (classify[1] == 0) {
                edge[1] = 3;
                end[1][0] = sValue[1];
                end[1][1] = 1;
              } else {
                edge[1] = 0;
                end[1][0] = 0;
                end[1][1] = mF00 / mB;

                if (end[1][1] < 0 || end[1][1] > 1) {
                  end[1][1] = 0.5;
                }
              }
            }
        }

        function ComputeMinimumParameters(edge, end, parameters) {
          var delta = end[1][1] - end[0][1];
          var h0 = delta * (-mB * end[0][0] + mC * end[0][1] - mE);

          if (h0 >= 0) {
            if (edge[0] == 0) {
              parameters[0] = 0;
              parameters[1] = GetClampedRoot(mC, mG00, mG01);
            } else if (edge[0] == 1) {
              parameters[0] = 1;
              parameters[1] = GetClampedRoot(mC, mG10, mG11);
            } else {
              parameters[0] = end[0][0];
              parameters[1] = end[0][1];
            }
          } else {
            var h1 = delta * (-mB * end[1][0] + mC * end[1][1] - mE);

            if (h1 <= 0) {
              if (edge[1] == 0) {
                parameters[0] = 0;
                parameters[1] = GetClampedRoot(mC, mG00, mG01);
              } else if (edge[1] == 1) {
                parameters[0] = 1;
                parameters[1] = GetClampedRoot(mC, mG10, mG11);
              } else {
                parameters[0] = end[1][0];
                parameters[1] = end[1][1];
              }
            } else // h0 < 0 and h1 > 0
              {
                var z = Math.min(Math.max(h0 / (h0 - h1), 0), 1);
                var omz = 1 - z;
                parameters[0] = omz * end[0][0] + z * end[1][0];
                parameters[1] = omz * end[0][1] + z * end[1][1];
              }
          }
        }

        var seg0Dir = this.p1.clone().sub(this.p0);
        var seg1Dir = segment.p1.clone().sub(segment.p0);
        var segDiff = this.p0.clone().sub(segment.p0);
        var mA = seg0Dir.dot(seg0Dir);
        var mB = seg0Dir.dot(seg1Dir);
        var mC = seg1Dir.dot(seg1Dir);
        var mD = seg0Dir.dot(segDiff);
        var mE = seg1Dir.dot(segDiff);
        var mF00 = mD;
        var mF10 = mF00 + mA;
        var mF01 = mF00 - mB;
        var mF11 = mF10 - mB;
        var mG00 = -mE;
        var mG10 = mG00 - mB;
        var mG01 = mG00 + mC;
        var mG11 = mG10 + mC;

        if (mA > 0 && mC > 0) {
          var sValue = [];
          sValue[0] = GetClampedRoot(mA, mF00, mF10);
          sValue[1] = GetClampedRoot(mA, mF01, mF11);
          var classify = [];

          for (var i = 0; i < 2; ++i) {
            if (sValue[i] <= 0) {
              classify[i] = -1;
            } else if (sValue[i] >= 1) {
              classify[i] = +1;
            } else {
              classify[i] = 0;
            }
          }

          if (classify[0] == -1 && classify[1] == -1) {
            // The minimum must occur on s = 0 for 0 <= t <= 1.
            result.parameters[0] = 0;
            result.parameters[1] = GetClampedRoot(mC, mG00, mG01);
          } else if (classify[0] == +1 && classify[1] == +1) {
            // The minimum must occur on s = 1 for 0 <= t <= 1.
            result.parameters[0] = 1;
            result.parameters[1] = GetClampedRoot(mC, mG10, mG11);
          } else {
            // The line dR/ds = 0 varersects the domain [0,1]^2 in a
            // nondegenerate segment.  Compute the endpoints of that segment,
            // end[0] and end[1].  The edge[i] flag tells you on which domain
            // edge end[i] lives: 0 (s=0), 1 (s=1), 2 (t=0), 3 (t=1).
            var edge = [];
            var end = new Array(2);

            for (let i = 0; i < end.length; i++) end[i] = new Array(2);

            ComputevarIntersection(sValue, classify, edge, end); // The directional derivative of R along the segment of
            // varersection is
            //   H(z) = (end[1][1]-end[1][0])*dR/dt((1-z)*end[0] + z*end[1])
            // for z in [0,1].  The formula uses the fact that dR/ds = 0 on
            // the segment.  Compute the minimum of H on [0,1].

            ComputeMinimumParameters(edge, end, result.parameters);
          }
        } else {
          if (mA > 0) {
            // The Q-segment is degenerate ( segment.point0 and  segment.p0 are the same point) and
            // the quadratic is R(s,0) = a*s^2 + 2*d*s + f and has (half)
            // first derivative F(t) = a*s + d.  The closests P-point is
            // varerior to the P-segment when F(0) < 0 and F(1) > 0.
            result.parameters[0] = GetClampedRoot(mA, mF00, mF10);
            result.parameters[1] = 0;
          } else if (mC > 0) {
            // The P-segment is degenerate ( this.point0 and  this.p0 are the same point) and
            // the quadratic is R(0,t) = c*t^2 - 2*e*t + f and has (half)
            // first derivative G(t) = c*t - e.  The closests Q-point is
            // varerior to the Q-segment when G(0) < 0 and G(1) > 0.
            result.parameters[0] = 0;
            result.parameters[1] = GetClampedRoot(mC, mG00, mG01);
          } else {
            // P-segment and Q-segment are degenerate.
            result.parameters[0] = 0;
            result.parameters[1] = 0;
          }
        }

        result.closests[0] = this.p0.clone().multiplyScalar(1 - result.parameters[0]).add(this.p1.clone().multiplyScalar(result.parameters[0]));
        result.closests[1] = segment.p0.clone().multiplyScalar(1 - result.parameters[1]).add(segment.p1.clone().multiplyScalar(result.parameters[1]));
        var diff = result.closests[0].clone().sub(result.closests[1]);
        result.sqrDistance = diff.dot(diff);
        result.distance = Math.sqrt(result.sqrDistance);
        return result;
      }
      /**
       * 射线到射线的距离
       * @param  {Ray} ray
       */


      distanceRay(ray) {}
      /**
       * 线段到直线的距离
       * @param  {Ray} ray
       */


      distanceLine(line) {} //---Intersect---------------------------------------------------


      intersectSegment(segment) {
        const result = this.distanceSegment(segment);
        const resultLine = this.distanceLine(segment);
        result.interserct = false;

        if (!approximateEqual(this.normal.dot(segment.normal), 1, gPrecision)) {
          // 平行
          if (resultLine.distance >= gPrecision) ; else {
            //共线重叠
            if (this.equals(segment)) {
              //# 相等
              result.equals = true;
            } else if (result.parameters.every(o => o === 0 || o === 1)) ;
          }
        } else {
          if (result.distance > gPrecision) return result;
          result.interserct = true; //相交

          if (result.parameters.every(o => o === 0 || o === 1)) ; else if (result.parameters[0] === 0 || result.parameters[0] === 1) {
            // this线段 在端点上
            result.splitSegs = [[this], [new Segment(segment.p0, result.closests[1]), new Segment(result.closests[1], segment.p1)]];
          } else if (result.parameters[1] === 0 || result.parameters[1] === 1) {
            //segment线段在端点上
            result.splitSegs = [[new Segment(this.p0, result.closests[0]), new Segment(result.closests[0], this.p1)], segment];
          } else {
            // 两个都不在端点上
            result.splitSegs = [[new Segment(this.p0, result.closests[0]), new Segment(result.closests[0], this.p1)], [new Segment(segment.p0, result.closests[1]), new Segment(result.closests[1], segment.p1)]];
          }
        }

        return result;
      } //---Offset------------------------------------------------------

      /**
       * 线段偏移
       * @param {Vector3} binormal  偏移平面法线
       * @param {Vector3} direction 偏移方向
       * @param {Number} distance 偏移距离
       */


      offset(binormal, direction, distance) {
        binormal = binormal || new Vector3(0, 1, 0);
        var direction = p1.clone().sub(p0).normalize();
        var tandir = direction.clone().cross(binormal).normalize();
        var result = {};
        result.arr = [tandir.clone().multiplyScalar(distance).add(p0), tandir.clone().multiplyScalar(distance).add(p1)];
        result.direction = direction;
        result.tandir = tandir;
        return result;
      } //---方位---------------------


      orientationPoint(point, normal = Vector3.UnitY) {
        var binormal = this.direction.clone().cross(normal);
        if (this.distanceLine(point).distance < gPrecision) return Orientation.Common;
        return point.clone().sub(this.origin).dot(binormal) > 0 ? Orientation.Positive : Orientation.Negative;
      }

      orientationSegment(segment, normal = Vector3.UnitY) {
        var or0 = this.orientationPoint(segment.p0, normal);
        var or1 = this.orientationPoint(segment.p1, normal);
        return or0 | or1;
      }

    }
    function segment$1(p0, p1) {
      return new Segment(p0, p1);
    }

    class Line {
      constructor(origin, end) {
        this.origin = origin !== undefined ? origin : v3();
        this.end = end !== undefined ? end : v3();
        this.direction = this.end.clone().sub(this.origin).normalize();
      }

      distancePoint(point) {
        return point.distanceLine(this);
      } //---距离-------------

      /**
       * 直线到直线的距离
       * 参数与最近点顺序一致
       * @param  {Line} line
       */


      distanceLine(line) {
        var result = {
          parameters: [],
          closests: []
        };
        var diff = this.origin.clone().sub(line.origin);
        var a01 = -this.direction.dot(line.direction);
        var b0 = diff.dot(this.direction);
        var s0, s1;

        if (Math.abs(a01) < 1) {
          var det = 1 - a01 * a01;
          var b1 = -diff.dot(line.direction);
          s0 = (a01 * b1 - b0) / det;
          s1 = (a01 * b0 - b1) / det;
        } else {
          s0 = -b0;
          s1 = 0;
        }

        result.parameters[0] = s0;
        result.parameters[1] = s1;
        result.closests[0] = this.direction.clone().multiplyScalar(s0).add(this.origin);
        result.closests[1] = line.direction.clone().multiplyScalar(s1).add(line.origin);
        diff = result.closests[0].clone().sub(result.closests[1]);
        result.sqrDistance = diff.dot(diff);
        result.distance = Math.sqrt(result.sqrDistance);
        return result;
      }
      /**
       * 直线与射线的距离
       * @param {Ray} ray 
       */


      distanceRay(ray) {
        const result = {
          parameters: [],
          closests: [],
          sqrDistance: 0,
          distance: 0
        };
        var diff = this.origin.clone().sub(ray.origin);
        var a01 = -this.direction.dot(ray.direction);
        var b0 = diff.dot(this.direction);
        var s0, s1;

        if (Math.abs(a01) < 1) {
          var b1 = -diff.dot(ray.direction);
          s1 = a01 * b0 - b1;

          if (s1 >= 0) {
            //在最近点在射线上，相当于直线与直线最短距离
            var det = 1 - a01 * a01;
            s0 = (a01 * b1 - b0) / det;
            s1 /= det;
          } else {
            // 射线的起始点是离直线的最近点
            s0 = -b0;
            s1 = 0;
          }
        } else {
          s0 = -b0;
          s1 = 0;
        }

        result.parameters[0] = s0;
        result.parameters[1] = s1;
        result.closests[0] = this.direction.clone().multiplyScalar(s0).add(this.origin);
        result.closests[1] = ray.direction.clone().multiplyScalar(s1).add(ray.origin);
        diff = result.closests[0].clone().sub(result.closests[1]);
        result.sqrDistance = diff.dot(diff);
        result.distance = Math.sqrt(result.sqrDistance);
        return result;
      }
      /**
       * 直线与线段的距离
       * @param  {Segment} segment
       */


      distanceSegment(segment) {
        var result = {
          parameters: [],
          closests: []
        };
        var segCenter = segment.center;
        var segDirection = segment.direction;
        var segExtent = segment.len * 0.5;
        var diff = this.origin.clone().sub(segCenter);
        var a01 = -this.direction.dot(segDirection);
        var b0 = diff.dot(this.direction);
        var s0, s1;

        if (Math.abs(a01) < 1) {
          // 判断是否平行
          var det = 1 - a01 * a01;
          var extDet = segExtent * det;
          var b1 = -diff.dot(segDirection);
          s1 = a01 * b0 - b1;

          if (s1 >= -extDet) {
            if (s1 <= extDet) {
              // Two interior points are closest, one on the this
              // and one on the segment.
              s0 = (a01 * b1 - b0) / det;
              s1 /= det;
            } else {
              // The endpoint e1 of the segment and an interior
              // point of the this are closest.
              s1 = segExtent;
              s0 = -(a01 * s1 + b0);
            }
          } else {
            // The endpoint e0 of the segment and an interior point
            // of the this are closest.
            s1 = -segExtent;
            s0 = -(a01 * s1 + b0);
          }
        } else {
          // The this and segment are parallel.  Choose the closest pair
          // so that one point is at segment origin.
          s1 = 0;
          s0 = -b0;
        }

        result.parameters[0] = s0;
        result.parameters[1] = s1;
        result.closests[0] = this.direction.clone().multiplyScalar(s0).add(this.origin);
        result.closests[1] = segDirection.clone().multiplyScalar(s1).add(segCenter);
        diff = result.closests[0].clone().sub(result.closests[1]);
        result.sqrDistance = diff.dot(diff);
        result.distance = Math.sqrt(result.sqrDistance);
        return result;
      }

      distancePlane(plane) {}

      distanceTriangle(triangle) {
        function Orthonormalize(numInputs, v, robust = false) {
          if (v && 1 <= numInputs && numInputs <= 3) {
            var minLength = v[0].length();
            v[0].normalize();

            for (var i = 1; i < numInputs; ++i) {
              for (var j = 0; j < i; ++j) {
                var dot = v[i].dot(v[j]);
                v[i].sub(v[j].clone().multiplyScalar(dot));
              }

              var length = v[i].length();
              v[i].normalize();

              if (length < minLength) {
                minLength = length;
              }
            }

            return minLength;
          }

          return 0;
        }

        function ComputeOrthogonalComplement(numInputs, v, robust = false) {
          if (numInputs === 1) {
            if (Math.abs(v[0][0]) > Math.abs(v[0][1])) {
              v[1] = v3(-v[0].z, 0, +v[0].x);
            } else {
              v[1] = v3(0, +v[0].z, -v[0].y);
            }
            numInputs = 2;
          }

          if (numInputs == 2) {
            v[2] = v[0].clone().cross(v[1]);
            return Orthonormalize(3, v, robust);
          }

          return 0;
        }

        const result = {
          closests: [],
          parameters: [],
          triangleParameter: []
        }; // Test if line intersects triangle.  If so, the squared distance
        // is zero. 

        var edge0 = triangle.p1.clone().sub(triangle.p0);
        var edge1 = triangle.p2.clone().sub(triangle.p0);
        var normal = edge0.clone().cross(edge1).normalize();
        var NdD = normal.dot(this.direction);

        if (Math.abs(NdD) >= gPrecision) {
          // The line and triangle are not parallel, so the line
          // intersects/ the plane of the triangle.
          var diff = this.origin.clone().sub(triangle.p0);
          var basis = new Array(3); // {D, U, V}

          basis[0] = this.direction;
          ComputeOrthogonalComplement(1, basis);
          var UdE0 = basis[1].dot(edge0);
          var UdE1 = basis[1].dot(edge1);
          var UdDiff = basis[1].dot(diff);
          var VdE0 = basis[2].dot(edge0);
          var VdE1 = basis[2].dot(edge1);
          var VdDiff = basis[2].dot(diff);
          var invDet = 1 / (UdE0 * VdE1 - UdE1 * VdE0); // Barycentric coordinates for the point of intersection.

          var b1 = (VdE1 * UdDiff - UdE1 * VdDiff) * invDet;
          var b2 = (UdE0 * VdDiff - VdE0 * UdDiff) * invDet;
          var b0 = 1 - b1 - b2;

          if (b0 >= 0 && b1 >= 0 && b2 >= 0) {
            // Line parameter for the point of intersection.
            var DdE0 = this.direction.dot(edge0);
            var DdE1 = this.direction.dot(edge1);
            var DdDiff = this.direction.dot(diff);
            result.lineParameter = b1 * DdE0 + b2 * DdE1 - DdDiff; // Barycentric coordinates for the point of intersection.

            result.triangleParameter[0] = b0;
            result.triangleParameter[1] = b1;
            result.triangleParameter[2] = b2; // The intersection point is inside or on the triangle.

            result.closests[0] = this.direction.clone().multiplyScalar(result.lineParameter).add(this.origin);
            result.closests[1] = edge0.multiplyScalar(b1).add(edge1.multiplyScalar(b2)).add(triangle.p0);
            result.distance = 0;
            result.sqrDistance = 0;
            return result;
          }
        } // Either (1) the line is not parallel to the triangle and the
        // point of intersection of the line and the plane of the triangle
        // is outside the triangle or (2) the line and triangle are
        // parallel.  Regardless, the closest point on the triangle is on
        // an edge of the triangle.  Compare the line to all three edges
        // of the triangle.


        result.distance = +Infinity;
        result.sqrDistance = +Infinity;

        for (var i0 = 2, i1 = 0; i1 < 3; i0 = i1++) {
          var segCenter = triangle[i0].clone().add(triangle[i1]).multiplyScalar(0.5);
          var segDirection = triangle[i1].clone().sub(triangle[i0]);
          var segExtent = 0.5 * segDirection.length();
          segDirection.normalize();
          var segment = new Segment(triangle[i0], triangle[i1]);
          var lsResult = this.distanceSegment(segment);

          if (lsResult.sqrDistance < result.sqrDistance) {
            result.sqrDistance = lsResult.sqrDistance;
            result.distance = lsResult.distance;
            result.lineParameter = lsResult.parameters[0];
            result.triangleParameter[i0] = 0.5 * (1 - lsResult.parameters[0] / segExtent);
            result.triangleParameter[i1] = 1 - result.triangleParameter[i0];
            result.triangleParameter[3 - i0 - i1] = 0;
            result.closests[0] = lsResult.closests[0];
            result.closests[1] = lsResult.closests[1];
          }
        }

        return result;
      } //---相交-------------


      intersectLine(line) {} //---平行-------------


      parallelLine(line) {} //---方位---------------------


      orientationPoint(point, normal = Vector3$1.UnitY) {
        var binormal = this.direction.clone().cross(normal);
        if (this.distancePoint(point).distance < gPrecision) return Orientation.Common;
        return point.clone().sub(this.origin).dot(binormal) > 0 ? Orientation.Positive : Orientation.Negative;
      }

      orientationSegment(segment, normal = Vector3$1.UnitY) {
        var or0 = this.orientationPoint(segment.p0, normal);
        var or1 = this.orientationPoint(segment.p1, normal);
        return or0 | or1;
      }

    }
    function line(start, end) {
      return new Line(start, end);
    }

    class Point extends Vector3$1 {
      constructor(x, y, z) {
        super(x, y, z);
      } //---距离 Distance-----------------------------------------------------------

      /**
      * 
      * @param {Point} point
      */


      distancePoint(point) {
        var result = {
          closests: [this, point]
        };
        result.distanceSqr = this.clone().sub(point).lengthSq();
        result.distance = Math.sqrt(result.distanceSqr);
        return result;
      }
      /**
       * Test success
       * 到直线的距离
       * @param  {Line} line
       * @returns {Object} lineParameter 最近点的参数  lineClosest 最近点  distanceSqr 到最近点距离的平方  distance 到最近点距离
       */


      distanceLine(line) {
        var result = {
          parameters: [],
          closests: []
        };
        var diff = this.clone().sub(line.origin);
        var lineParameter = line.direction.dot(diff);
        var lineClosest = line.direction.clone().multiplyScalar(lineParameter).add(line.origin);
        result.parameters.push(0, lineParameter);
        result.closests.push(this, lineClosest);
        diff = result.closests[0].clone().sub(result.closests[1]);
        result.distanceSqr = diff.dot(diff);
        result.distance = Math.sqrt(result.distanceSqr);
        return result;
      }
      /**
       * 返回一个纯粹的距离值
       * @param {Line} line 
       */


      distanceLinePureSq(line) {
        var diff = this.clone().sub(line.origin);
        var lineParameter = line.direction.dot(diff);
        var lineClosest = line.direction.clone().multiplyScalar(lineParameter).add(line.origin);
        return this.distanceToSquared(lineClosest);
      }
      /**
      * 返回一个纯粹的距离值
      * @param {Line} line 
      */


      distanceLinePure(line) {
        var diff = this.clone().sub(line.origin);
        var lineParameter = line.direction.dot(diff);
        var lineClosest = line.direction.clone().multiplyScalar(lineParameter).add(line.origin);
        return this.distanceTo(lineClosest);
      }
      /**
       * Test success
       * 到射线的距离
       * @param  {Line} line
       * @returns {Object} lineParameter 最近点的参数  lineClosest 最近点  distanceSqr 到最近点距离的平方  distance 到最近点距离
       */


      distanceRay(ray) {
        var result = {
          parameters: [],
          closests: []
        };
        var diff = this.clone().sub(ray.origin);
        result.rayParameter = ray.direction.dot(diff);

        if (result.rayParameter > 0) {
          result.rayClosest = ray.direction.clone().multiplyScalar(result.rayParameter).add(ray.origin);
        } else {
          result.rayClosest = ray.origin.clone();
        }

        result.parameters.push(0, result.rayParameter);
        result.closests.push(this, result.rayClosest);
        diff = this.clone().sub(result.rayClosest);
        result.distanceSqr = diff.dot(diff);
        result.distance = Math.sqrt(result.distanceSqr);
        return result;
      }
      /**
       * Test success
       * 到线段的距离
       * @param  {Line} line
       * @returns {Object} lineParameter 最近点的参数  lineClosest 最近点  distanceSqr 到最近点距离的平方  distance 到最近点距离
       */


      distanceSegment(segment) {
        const result = {
          parameters: [],
          closests: []
        };
        var diff = this.clone().sub(segment.p1);
        var t = segment.lenDirection.dot(diff);

        if (t >= 0) {
          result.segmentParameter = 1;
          result.segmentClosest = segment.p1;
        } else {
          diff = this.clone().sub(segment.p0);
          t = segment.lenDirection.dot(diff);

          if (t <= 0) {
            result.segmentParameter = 0;
            result.segmentClosest = segment.p0;
          } else {
            var sqrLength = segment.lenSq;
            if (sqrLength <= 0) sqrLength = 0;
            t /= sqrLength;
            result.segmentParameter = t;
            result.segmentClosest = segment.lenDirection.clone().multiplyScalar(t).add(segment.p0);
          }
        }

        result.parameters.push(0, result.segmentParameter);
        result.closests.push(this, result.segmentClosest);
        diff = this.clone().sub(result.segmentClosest);
        result.distanceSqr = diff.dot(diff);
        result.distance = Math.sqrt(result.distanceSqr);
        return result;
      }
      /**
       * 点与折线的距离 测试排除法，平均比线性检索(暴力法)要快两倍以上
       * @param {Polygon} polyline  折线
       */


      distancePolyline(polyline) {
        var u = +Infinity;
        var ipos = -1;
        var tempResult = null;
        var result = null;

        for (let i = 0; i < polyline.length - 1; i++) {
          const pti = polyline[i];
          const ptj = polyline[i + 1];
          if (Math.abs(pti.x - this.x) > u && Math.abs(ptj.x - this.x) > u && (pti.x - this.x) * (ptj.x - this.x) > 0) continue;
          if (Math.abs(pti.y - this.y) > u && Math.abs(ptj.y - this.y) > u && (pti.y - this.y) * (ptj.y - this.y) > 0) continue;
          if (Math.abs(pti.z - this.z) > u && Math.abs(ptj.z - this.z) > u && (pti.z - this.z) * (ptj.z - this.z) > 0) continue;
          tempResult = this.distanceSegment(new Segment(pti, ptj));

          if (tempResult.distance < u) {
            u = tempResult.distance;
            result = tempResult;
            ipos = i;
          }
        }

        result.segmentIndex = ipos;
        return result;
      }

      distancePolyline1(polyline) {
        var u = +Infinity;
        var ipos = -1;
        var tempResult = null;
        var result = null;

        for (let i = 0; i < polyline.length - 1; i++) {
          const pti = polyline[i];
          const ptj = polyline[i + 1];
          tempResult = this.distanceSegment(new Segment(pti, ptj));

          if (u > tempResult.distance) {
            u = tempResult.distance;
            result = tempResult;
            ipos = i;
          }
        }

        result.segmentIndex = ipos;
        return result;
      }

      distancePlane(plane) {
        // this.clone().sub(plane.origin).dot(plane.normal);
        const result = {
          parameters: [],
          closests: [],
          signedDistance: 0,
          distance: 0,
          planeClosestPoint: null
        };
        result.signedDistance = this.clone().dot(plane.normal) - plane.w;
        result.distance = Math.abs(result.signedDistance);
        result.planeClosestPoint = this.clone().sub(plane.normal.clone().multiplyScalar(result.signedDistance));
        result.closests.push(this, result.planeClosestPoint);
        return result;
      }
      /**
       * 点与圆圈的距离
       * @param {*} circle 
       * @param {*} disk 
       * @returns {} result
       */


      distanceCircle(circle) {
        var result = {
          parameters: [],
          closests: [],
          equidistant: false //是否等距

        }; // Projection of P-C onto plane is Q-C = P-C - Dot(N,P-C)*N.

        var PmC = this.clone().sub(circle.center);
        var QmC = PmC.clone().sub(circle.normal.clone().multiplyScalar(circle.normal.dot(PmC)));
        var lengthQmC = QmC.length();

        if (lengthQmC > gPrecision) {
          result.circleClosest = QmC.clone().multiplyScalar(circle.radius / lengthQmC).add(circle.center);
          result.equidistant = false;
        } else {
          var offsetPoint = circle.center.clone().add(10, 10, 10);
          var CP = offsetPoint.sub(circle.center);
          var CQ = CP.clone().sub(circle.normal.clone().multiplyScalar(circle.normal.dot(CP))).normalize(); //在圆圈圆心的法线上，到圆圈上的没一点都相同 

          result.circleClosest = CQ.clone().multiplyScalar(circle.radius).add(circle.center);
          result.equidistant = true;
        }

        result.closests.push(this, result.circleClosest);
        var diff = this.clone().sub(result.circleClosest);
        result.sqrDistance = diff.dot(diff);
        result.distance = Math.sqrt(result.sqrDistance);
        return result;
      }
      /**
      * 点与圆盘的距离
      * @param {*} circle 
      * @param {*} disk 
      * @returns {} result
      */


      distanceDisk(disk) {
        var result = {
          parameters: [],
          closests: [],
          signed: 1,
          sqrDistance: 0,
          distance: 0,
          diskClosest: null
        };
        var PmC = this.clone().sub(disk.center);
        var QmC = PmC.clone().sub(disk.normal.clone().multiplyScalar(disk.normal.dot(PmC)));
        var lengthQmC = QmC.length();
        result.signed = sign(this.clone().dot(disk.normal) - disk.w);

        if (lengthQmC > disk.radius) {
          result.diskClosest = QmC.clone().multiplyScalar(disk.radius / lengthQmC).add(disk.center);
        } else {
          var signedDistance = this.clone().dot(disk.normal) - disk.w;
          result.diskClosest = this.clone().sub(disk.normal.clone().multiplyScalar(signedDistance));
        }

        result.closests.push(this, result.diskClosest);
        var diff = this.clone().sub(result.diskClosest);
        result.sqrDistance = diff.dot(diff);
        result.distance = Math.sqrt(result.sqrDistance);
        return result;
      }
      /**
       * 
       * @param {Capsule} capsule 
       */


      distanceCapsule(capsule) {
        var result = this.distanceSegment(capsule);
        result.distance = result.distance - capsule.radius;
        result.closest = this.clone().sub(result.segmentClosest).normalize().multiplyScalar(capsule.radius);
        result.interior = result.distance < 0;
        result.closests = [this, result.closest];
        return result;
      }

      distanceTriangle(triangle) {
        function GetMinEdge02(a11, b1, p) {
          p[0] = 0;

          if (b1 >= 0) {
            p[1] = 0;
          } else if (a11 + b1 <= 0) {
            p[1] = 1;
          } else {
            p[1] = -b1 / a11;
          }
        }

        function GetMinEdge12(a01, a11, b1, f10, f01, p) {
          var h0 = a01 + b1 - f10;

          if (h0 >= 0) {
            p[1] = 0;
          } else {
            var h1 = a11 + b1 - f01;

            if (h1 <= 0) {
              p[1] = 1;
            } else {
              p[1] = h0 / (h0 - h1);
            }
          }

          p[0] = 1 - p[1];
        }

        function GetMinInterior(p0, h0, p1, h1, p) {
          var z = h0 / (h0 - h1);
          p[0] = (1 - z) * p0[0] + z * p1[0];
          p[1] = (1 - z) * p0[1] + z * p1[1];
        }

        var diff = this.clone().sub(triangle.p0);
        var edge0 = triangle.p1.clone().sub(triangle.p0);
        var edge1 = triangle.p2.clone().sub(triangle.p0);
        var a00 = edge0.dot(edge0);
        var a01 = edge0.dot(edge1);
        var a11 = edge1.dot(edge1);
        var b0 = -diff.dot(edge0);
        var b1 = -diff.dot(edge1);
        var f00 = b0;
        var f10 = b0 + a00;
        var f01 = b0 + a01;
        var p0 = [0, 0],
            p1 = [0, 0],
            p = [0, 0];
        var dt1, h0, h1;

        if (f00 >= 0) {
          if (f01 >= 0) {
            // (1) p0 = (0,0), p1 = (0,1), H(z) = G(L(z))
            GetMinEdge02(a11, b1, p);
          } else {
            // (2) p0 = (0,t10), p1 = (t01,1-t01),
            // H(z) = (t11 - t10)*G(L(z))
            p0[0] = 0;
            p0[1] = f00 / (f00 - f01);
            p1[0] = f01 / (f01 - f10);
            p1[1] = 1 - p1[0];
            dt1 = p1[1] - p0[1];
            h0 = dt1 * (a11 * p0[1] + b1);

            if (h0 >= 0) {
              GetMinEdge02(a11, b1, p);
            } else {
              h1 = dt1 * (a01 * p1[0] + a11 * p1[1] + b1);

              if (h1 <= 0) {
                GetMinEdge12(a01, a11, b1, f10, f01, p);
              } else {
                GetMinInterior(p0, h0, p1, h1, p);
              }
            }
          }
        } else if (f01 <= 0) {
          if (f10 <= 0) {
            // (3) p0 = (1,0), p1 = (0,1),
            // H(z) = G(L(z)) - F(L(z))
            GetMinEdge12(a01, a11, b1, f10, f01, p);
          } else {
            // (4) p0 = (t00,0), p1 = (t01,1-t01), H(z) = t11*G(L(z))
            p0[0] = f00 / (f00 - f10);
            p0[1] = 0;
            p1[0] = f01 / (f01 - f10);
            p1[1] = 1 - p1[0];
            h0 = p1[1] * (a01 * p0[0] + b1);

            if (h0 >= 0) {
              p = p0; // GetMinEdge01
            } else {
              h1 = p1[1] * (a01 * p1[0] + a11 * p1[1] + b1);

              if (h1 <= 0) {
                GetMinEdge12(a01, a11, b1, f10, f01, p);
              } else {
                GetMinInterior(p0, h0, p1, h1, p);
              }
            }
          }
        } else if (f10 <= 0) {
          // (5) p0 = (0,t10), p1 = (t01,1-t01),
          // H(z) = (t11 - t10)*G(L(z))
          p0[0] = 0;
          p0[1] = f00 / (f00 - f01);
          p1[0] = f01 / (f01 - f10);
          p1[1] = 1 - p1[0];
          dt1 = p1[1] - p0[1];
          h0 = dt1 * (a11 * p0[1] + b1);

          if (h0 >= 0) {
            GetMinEdge02(a11, b1, p);
          } else {
            h1 = dt1 * (a01 * p1[0] + a11 * p1[1] + b1);

            if (h1 <= 0) {
              GetMinEdge12(a01, a11, b1, f10, f01, p);
            } else {
              GetMinInterior(p0, h0, p1, h1, p);
            }
          }
        } else {
          // (6) p0 = (t00,0), p1 = (0,t11), H(z) = t11*G(L(z))
          p0[0] = f00 / (f00 - f10);
          p0[1] = 0;
          p1[0] = 0;
          p1[1] = f00 / (f00 - f01);
          h0 = p1[1] * (a01 * p0[0] + b1);

          if (h0 >= 0) {
            p = p0; // GetMinEdge01
          } else {
            h1 = p1[1] * (a11 * p1[1] + b1);

            if (h1 <= 0) {
              GetMinEdge02(a11, b1, p);
            } else {
              GetMinInterior(p0, h0, p1, h1, p);
            }
          }
        }

        var result = {
          parameter: [],
          parameters: [],
          closests: []
        };
        result.parameter[0] = 1 - p[0] - p[1];
        result.parameter[1] = p[0];
        result.parameter[2] = p[1];
        result.closest = triangle.p0.clone().add(edge0.multiplyScalar(p[0])).add(edge1.multiplyScalar(p[1]));
        result.parameters.push(0, result.rayParameter);
        result.closests.push(this, result.closest);
        diff = this.clone().sub(result.closest);
        result.sqrDistance = diff.dot(diff);
        result.distance = Math.sqrt(result.sqrDistance);
        return result;
      }
      /**
       * 点到矩形的距离
       * @param  {Rectangle} rectangle
       */


      distanceRectangle(rectangle) {
        var result = {
          rectangleParameter: [],
          parameters: [],
          closests: []
        };
        diff = rectangle.center - point;
        var b0 = diff.dot(rectangle.axis[0]);
        var b1 = diff.dot(rectangle.axis[1]);
        var s0 = -b0,
            s1 = -b1;
        result.sqrDistance = diff.dot(diff);

        if (s0 < -rectangle.extent[0]) {
          s0 = -rectangle.extent[0];
        } else if (s0 > rectangle.extent[0]) {
          s0 = rectangle.extent[0];
        }

        result.sqrDistance += s0 * (s0 + 2 * b0);

        if (s1 < -rectangle.extent[1]) {
          s1 = -rectangle.extent[1];
        } else if (s1 > rectangle.extent[1]) {
          s1 = rectangle.extent[1];
        }

        result.sqrDistance += s1 * (s1 + 2 * b1); // Account for numerical round-off error.

        if (result.sqrDistance < 0) {
          result.sqrDistance = 0;
        }

        result.distance = Math.sqrt(result.sqrDistance);
        result.rectangleParameter[0] = s0;
        result.rectangleParameter[1] = s1;
        result.rectangleClosestPoint = rectangle.center;

        for (var i = 0; i < 2; ++i) {
          result.rectangleClosestPoint.add(rectangle.axis[i].clone().multiplyScalar(result.rectangleParameter[i]));
        }

        result.closests.push(this, result.rectangleClosestPoint);
        return result;
      }

      distancePolygon(Triangle) {}

      distanceSphere(sphere) {
        const result = {
          parameters: [],
          closests: []
        };
        result.distance = this.distanceTo(sphere.center) - sphere.radius;
        result.closest = this.point.clone().sub(sphere.center).normalize().multiplyScalar(sphere.radius);
        result.closests.push(this, result.closest);
        return result;
      } //---包含---------------------------------------------------------------


      insideLine() {}

      insideRay() {}

      insideSegment() {}

      insidePlane() {} //方位


      orientationLine(lineormal = Vector3$1.UnitY) {}

      orientationPlane() {}

      orientationCircle() {}

    }

    /**
     * 判断多边是否共线:
     * 考虑情况点之间的距离应该大于最小容忍值
     * @param  {...Point} ps 
     * @returns {boolean} 
     */

    function pointsCollinear(...ps) {
      ps.sort(XYZSort);
      var sedir = ps[ps.length - 1].clone().sub(ps[0]);
      var selen = ps[ps.length - 1].distanceTo(ps[0]);

      for (let i = 1; i < ps.length - 1; i++) {
        var ilens = ps[i].distanceTo(ps[0]);
        var ilene = ps[i].distanceTo(ps[ps.length - 1]);

        if (ilens < ilene) {
          if (Math.abs(ps[i].clone().sub(ps[0]).dot(sedir) - selen * ilens) > gPrecision) return false;
        } else {
          if (Math.abs(ps[i].clone().sub(ps[ps.length - 1]).dot(sedir) - selen * ilene) > gPrecision) return false;
        }
      }

      return true;
    }

    class Circle {
      /**
       * 圆圈
       * @param  {Vector3} center 中心点
       * @param  {Vector3} normal 法线
       * @param  {Number} radius 半径
       */
      constructor(center, normal, radius) {
        this.center = center || new Vector3$1();
        this.normal = normal.normalize();
        this.radius = radius || 0;
      }

      area() {
        return Math.PI * this.radius * this.radius;
      }

    }
    /**
      * 圆圈生成方法
      * @param  {Vector3} center 中心点
      * @param  {Vector3} normal 法线
      * @param  {Number} radius 半径
      * @returns {Circle} circle 返回一个圆
      */

    function circle(center, normal, radius) {
      return new Circle(center, normal, radius);
    }
    /**
     * 三点计算圆 --low --debugging
     * @param {Point} p0 点1
     * @param {Point} p1 点2
     * @param {Point} p2 点3
     * @returns {Circle} circle 返回一个圆
     */

    function calcCircleFromThreePoint(p0, p1, p2) {
      if (pointsCollinear(p1, p2, p3)) {
        alert("calcCircleFromThreePoint：三点共线或者距离太近");
      }

      var d1 = p1.clone().sub(p0);
      var d2 = p2.clone().sub(p0);
      var d1center = p1.clone().add(p0).multiplyScalar(0.5);
      var d2center = p2.clone().add(p0).multiplyScalar(0.5);
      var normal = d1.clone().cross(d2).normalize();
      d1.applyAxisAngle(normal, Math.PI / 2);
      d2.applyAxisAngle(normal, Math.PI / 2);
      var line1 = new Line(d1center, d1center.clone().add(d1));
      var line2 = new Line(d2center, d2center.clone().add(d2));
      var center = line1.distanceLine(line2).closestPoint[0];
      var radius = d1.distanceTo(center);
      return circle(center, radius);
    } // vertical
    // horizontal

    class Disk {
      constructor(center, normal, radius) {
        this.center = center || v3();
        this.normal = normal;
        this.radius = radius || 0;
        this.w = this.normal.dot(center);
      }

      area() {
        return Math.PI * this.radius * this.radius;
      }

    }
    function disk(center, radius) {
      return new Disk(center, radius);
    }

    class Plane {
      constructor(normal = Vector3$1.UnitZ, w = 0) {
        this.normal = normal;
        this.w = w;
        this.origin = this.normal.clone().multiplyScalar(w); // this.w = this.normal.dot(this.origin)
      }

      setFromThreePoint(p0, p1, p2) {
        this.normal = p1.clone().sub(p0).cross(p2.clone().sub(p0)).normalize();
        this.w = p0.dot(this.normal);
      }

      negate() {
        this.normal.negate();
        this.w = -this.w;
      }
      /**
       * 判断一个点在平面的正面或者反面
       * @param  {Vector3} point
       * @returns {Number} -1 or 1 or z
       */


      frontback(point) {
        let value = this.normal.dot(point);
        if (approximateEqual(value, 0)) return 0;
        return sign(this.normal.dot(point));
      }

      distancePoint(point) {
        return this.normal.dot(point) - this.w;
      }

      distanceRay(ray) {}

      distanceLine(line) {}

      distanceSegment(segment) {}

      distancePlane(plane) {} //---Split-----------------------------------------

      /**
       * 切割线段
       * @param {Segment} segment 
       */


      splitSegment(segment) {
        const result = {
          splits: [],
          orientation: false
        };
        let orientation0 = this.orientationPoint(segment.p0);
        let orientation1 = this.orientationPoint(segment.p1);
        let orientation = orientation0 | orientation1;
        result.orientation = orientation;

        switch (orientation) {
          case Orientation.Negative:
            result.splits.push(null, segment.clone());
            break;

          case Orientation.Positive:
            result.splits.push(segment.clone(), null);
            break;

          case Orientation.Intersect:
            this.distanceSegment();
            break;
        }

        return result;
      }

      splitTriangle(triangle) {
        const result = {
          splits: [],
          orientation: false
        };
        let orientation0 = this.orientationPoint(segment.p0);
        let orientation1 = this.orientationPoint(segment.p1);
        let orientation = orientation0 | orientation1;
        result.orientation = orientation;

        switch (orientation) {
          case Orientation.Negative:
            result.splits.push(null, segment.clone());
            break;

          case Orientation.Positive:
            result.splits.push(segment.clone(), null);
            break;

          case Orientation.Intersect:
            this.distanceSegment();
            break;
        }

        return result;
      } //---orientation------------------------------

      /**
       * 点在平面的位置判断
       * @param {Point} point 
       * @returns {Orientation} 方位
       */


      orientationPoint(point) {
        let signDistance = this.normal.clone().dot(point) - this.w;
        if (Math.abs(signDistance) < gPrecision) return Orientation.Intersect;else if (signDistance < 0) return Orientation.Negative;else if (signDistance > 0) return Orientation.Positive;
      }

    }

    class ArrayEx extends Array {
      constructor(...args) {
        super(...args);
      }

      get lastElement() {
        return this.get(-1);
      }

      get(index) {
        if (index < 0) index = this.length + index;
        return this[index];
      }
      /**
       * 深度优先遍历
       * @param {*} method 
       */


      forall(method) {
        for (let i = 0; i < this.length; i++) {
          method(this[i]);
          if (this[i] instanceof Array) this[i].forall(method);
        }
      }
      /**
      
      clone() {
          var result = new ArrayEx()
          for (let i = 0; i < this.length; i++)
          {
              var ele = this[i];
              if (ele instanceof Number || ele instanceof String)
                  result[i] = ele;
              else if (ele.clone)
              {
                  result[i] = ele.clone();
              }
              else
                  throw ("数组有元素不能clone")
          }
          return result;
      }
      /**
       * 分类
       * example:
       *      var arry = [1,2,3,4,5,6]
       *      var result = classify(this,(a)={return a%2===0}) 
       * 
       * @param {Function} classifyMethod  分类方法
       */


      classify(classifyMethod) {
        var result = [];

        for (let i = 0; i < this.length; i++) {
          for (let j = 0; j < result.length; j++) {
            if (classifyMethod(this[i], result[j][0], result[j])) {
              result[j].push(this[i]);
            } else {
              result.push([this[i]]);
            }
          }
        }

        return result;
      }
      /**
       * 去掉重复元素 
       * @param {Function} uniqueMethod  去重复
       * @param {Function} sortMethod 排序
       */


      unique(uniqueMethod, sortMethod) {
        if (sortMethod) {
          this.sort(sortMethod);

          for (let i = 0; i < this.length; i++) {
            for (let j = i + 1; j < this.length; j++) {
              if (uniqueMethod(this[i], this[j]) === true) {
                this.splice(j, 1);
                j--;
              } else break;
            }
          }

          return this;
        }

        for (let i = 0; i < this.length; i++) {
          for (let j = i + 1; j < this.length; j++) {
            if (uniqueMethod(this[i], this[j]) === true) {
              this.splice(j, 1);
              j--;
            }
          }
        }

        return this;
      }

    }

    /**
     *  线段正反原则：右手坐标系中，所在平面为XZ平面，把指向方向看着负Z轴，x正为正方向，x负为负方向
     */

    class Polyline extends ArrayEx {
      constructor(vs, normal = v3(0, 1, 0)) {
        super();
        this.push(...vs);
        this.isCoPlanar = true;
        this.normal = normal;
      }
      /**
       * 偏移
       * @param {Number} distance  偏移距离  
       * @param {Vector3} normal  折线所在平面法线
       */


      offset(distance, normal = this.normal) {
        var offsetSign = sign(distance) > 0 ? Orientation.Positive : Orientation.Negative;
        var direction = new Vector3$1();
        var segments = []; //偏移过后的线段

        for (let i = 0; i < this.length - 1; i++) {
          const point = this[i];
          const pointNext = this[i + 1];
          var binormal = direction.sub(pointNext, point).normalize().cross(this.normal).normalize();
          var offsetVector = binormal.clone().multiplyScalar(distance);
          segments.push([offsetVector.clone().add(point), offsetVector.add(pointNext)]);
        } //线段两两相交


        for (let i = 0; i < segments.length; i++) {
          const segi = segments[i];

          for (let j = 0; j < segments.length; j++) {
            if (i === j) continue;
            const segj = segments[j];
            var orien0 = segi.orientationSegment(segj.p0, normal);
            var orien1 = segi.orientationSegment(segj.fixedPoint1, normal);
            var orienInfo = orien0 | orien1;
            var disRes = segi.distanceSegment(segj);

            if (disRes.distance > gPrecision) {
              if (orienInfo !== offsetSign) {
                segments.splice(j, 1);
                j--;
              }
            } else {
              // 出现相交  那么就会有切割
              var intersectPoit = disRes.closests[0]; //删除不要的部分
            }
          }
        }

        return new Polyline(this);
      }
      /**
       * 圆角   将折线拐点圆角化
       * @param {Number} useDistance 圆角段距离 
       * @param {Number} segments 分切割段数
       */


      corner(useDistance, segments = 3, normal = this.normal, threshold = 0.1) {
        var polyline = new Polyline();

        for (let i = 0; i < this.length - 2; i++) {
          polyline.push(p0);
          const p0 = this[i];
          const p1 = this[i + 1];
          const p2 = this[i + 2];
          var fixedPoint0 = p0.distanceTo(p1).length() <= useDistance * 2 ? p0.clone().add(p1).multiplyScalar(0.5) : p0.clone().sub(p1).normalize().multiplyScalar(useDistance).add(p1);
          var fixedPoint1 = p2.distanceTo(p1).length() <= useDistance * 2 ? p2.clone().add(p1).multiplyScalar(0.5) : p2.clone().sub(p1).normalize().multiplyScalar(useDistance).add(p1);
          polyline.push(fixedPoint0);
          var binormal0 = p1.clone().sub(p0).applyAxisAngle(normal, Math.PI / 2);
          var binormal1 = p1.clone().sub(p0).applyAxisAngle(normal, Math.PI / 2); //计算圆弧点

          var line0 = new Line(fixedPoint0, binormal0.add(fixedPoint0));
          var line1 = new Line(fixedPoint1, binormal1.add(fixedPoint1));
          var center = line0.distanceLine(line1).closests[0]; //圆心

          polyline.push(fixedPoint1);
        }

        return polyline;
      }

    }

    /**
     * 数组深度复制
     * @param {Array} array 
     */

    function clone(array) {
      var result = new Array();

      for (let i = 0; i < array.length; i++) {
        var ele = array[i];
        if (ele instanceof Number || ele instanceof String) result[i] = ele;else if (ele.clone) {
          result[i] = ele.clone();
        } else if (ele instanceof Array) result[i] = clone(ele);else throw "数组有元素不能clone";
      }

      return result;
    }
    /**
     * 遍历多级数组中所有对象
     * @param {Array} array 
     * @param {Function} method 
     */

    function forall(array, method) {
      for (let i = 0; i < array.length; i++) {
        const ele = array[i];
        method(ele);
        if (Array.isArray(ele)) forall(ele, method);
      }
    }
    /**
     * 分类
     * example:
     *      var arry = [1,2,3,4,5,6]
     *      var result = classify(array,(a)={return a%2===0})
     * 
     * @param {Array} array 
     * @param {Function} classifyMethod  分类方法
     */

    function classify(array, classifyMethod) {
      var result = [];

      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < result.length; j++) {
          if (classifyMethod(array[i], result[j][0], result[j])) {
            result[j].push(array[i]);
          } else {
            result.push([array[i]]);
          }
        }
      }

      return result;
    }
    /**
     * 去掉重复元素
     * @param {Array} array 
     * @param {Function} uniqueMethod  去重复
     * @param {Function} sortMethod 排序
     */

    function unique(array, uniqueMethod, sortMethod) {
      if (sortMethod) {
        array.sort(sortMethod);

        for (let i = 0; i < array.length; i++) {
          for (let j = i + 1; j < array.length; j++) {
            if (uniqueMethod(array[i], array[j]) === true) {
              array.splice(j, 1);
              j--;
            } else break;
          }
        }

        return array;
      }

      for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
          if (uniqueMethod(array[i], array[j]) === true) {
            array.splice(j, 1);
            j--;
          }
        }
      }

      return array;
    }

    /**
     * 点排序函数
     * @param {Vector*} a 
     * @param {Vector*} b
     */


    function vectorCompare(a, b) {
      if (a.x === b.x) {
        if (a.z !== undefined && a.y === b.y) return a.z - b.z;else return a.y - b.y;
      } else return a.x - b.x;
    }
    /**
     * 将向量拆解为数字
     * @param {Array} points 
     * @param {String} feature 
     * @returns {Array<Number>} 数字数组
     */

    function verctorToNumbers(points, feature = "xyz") {
      if (!(points instanceof Array)) {
        console.error("传入参数必须是数组");
        return;
      }

      var numbers = [];

      if (points[0].x !== undefined && points[0].y !== undefined && points[0].z !== undefined) {
        for (var i = 0; i < points.length; i++) {
          for (let j = 0; j < feature.length; j++) {
            numbers.push(points[i][feature[j]]);
          }
        }
      } else if (points[0].x !== undefined && points[0].y !== undefined) for (var i = 0; i < points.length; i++) {
        numbers.push(points[i].x);
        numbers.push(points[i].y);
      } else if (points[0] instanceof Array) {
        for (var i = 0; i < points.length; i++) {
          numbers = numbers.concat(verctorToNumbers(points[i]));
        }
      } else {
        console.error("数组内部的元素不是向量");
      }

      return numbers;
    }
    /**
     * 计算包围盒
     * @param {*} points  点集
     * @returns {Array[min,max]} 返回最小最大值
     */

    function boundingBox(points) {
      this.min = new Vector3$1(+Infinity, +Infinity, +Infinity);
      this.max = new Vector3$1(-Infinity, -Infinity, -Infinity);

      for (let i = 0; i < points.length; i++) {
        this.min.min(points[i]);
        this.max.max(points[i]);
      }

      return [min, max];
    }
    /**
     * 
     * @param {*} points 
     * @param {*} quaternion 
     * @param {Boolean} ref 是否是引用
     */

    function applyQuaternion(points, quaternion, ref = true) {
      if (ref) {
        points.flat(Infinity).forEach(point => {
          point.applyQuaternion(quaternion);
        });
        return points;
      }

      return applyQuaternion(clone(points));
    }
    /**
     * 平移
     * @param {*} points 
     * @param {*} distance 
     * @param {*} ref 
     */

    function translate(points, distance, ref = true) {
      if (ref) {
        points.flat(Infinity).forEach(point => {
          point.add(distance);
        });
        return points;
      }

      return translate(clone(points));
    }
    /**
     * 旋转
     * @param {*} points 
     * @param {*} axis 
     * @param {*} angle 
     * @param {*} ref 
     */

    function rotate(points, axis, angle, ref = true) {
      return applyQuaternion(points, new Quaternion().setFromAxisAngle(axis, angle), ref);
    }
    /**
     * 两个向量之间存在的旋转量来旋转点集
     * @param {*} points 
     * @param {*} axis 
     * @param {*} angle 
     * @param {*} ref 
     */

    function rotateByUnitVectors(points, vFrom, vTo, ref = true) {
      return applyQuaternion(points, new Quaternion().setFromUnitVectors(vFrom, vTo), ref);
    }
    /**
     * 缩放
     * @param {*} points 
     * @param {*} axis 
     * @param {*} angle 
     * @param {*} ref 
     */

    function scale(points, scale, ref = true) {
      if (ref) {
        points.flat(Infinity).forEach(point => {
          point.scale.multiply(scale);
        });
        return points;
      }

      return scale(clone(points));
    }
    /**
     * 响应矩阵
     * @param {*} points 
     * @param {*} axis 
     * @param {*} angle 
     * @param {*} ref 
     */

    function applyMatrix4(points, matrix, ref = true) {
      if (ref) {
        points.flat(Infinity).forEach(point => {
          point.applyMatrix4(matrix);
        });
        return points;
      }

      return applyMatrix4(clone(points));
    }
    /**
     * 简化点集数组，折线，路径
     * @param {*} points 点集数组，折线，路径 ,继承Array
     * @param {*} maxDistance  简化最大距离
     * @param {*} maxAngle  简化最大角度
     */

    function simplifyPointList(points, maxDistance = 0.1, maxAngle = Math.PI / 180 * 5) {
      for (let i = 0; i < points.length; i++) {
        // 删除小距离
        const P = points[i];
        const nextP = points[i + 1];

        if (P.distanceTo(nextP) < maxDistance) {
          if (i === 0) points.remove(i + 1, 1);else if (i === points.length - 2) points.splice(i, 1);else {
            points.splice(i, 2, P.clone().add(nextP).multiplyScalar(0.5));
          }
          i--;
        }
      }

      for (let i = 1; i < points.length - 1; i++) {
        // 删除小小角度
        const preP = points[i - 1];
        const P = points[i];
        const nextP = points[i + 1];

        if (Math.acos(P.clone().sub(preP).normalize().dot(nextP.clone().sub(P).normalize())) < maxAngle) {
          points.splice(i, 1);
          i--;
        }
      }

      return points;
    }
    /**
     * 以某个平面生成对称镜像
     * @param {*} points  点集
     * @param {*} plane 对称镜像平面
     */

    function reverseOnPlane(points, plane) {}
    /**
     * 投影到平面
     * @param {*} points 点集
     * @param {*} plane  投影平面
     * @param {*} projectDirect  默认是法线的方向
     */

    function projectOnPlane(points, plane, projectDirect) {
      return points;
    }
    /**
     * 计算共面点集所在的平面
     * @param {Array<Vector3|Point>} points 
     */

    function recognitionPlane(points) {
      points.sort(vectorCompare);
      var line = new Line(points[0], points.get(-1));
      var maxDistance = -Infinity;
      var ipos = -1;

      for (let i = 1; i < points.length - 1; i++) {
        const pt = points[i];
        var distance = line.distancePoint(pt).distance;

        if (distance > maxDistance) {
          maxDistance = distance;
          ipos = i;
        }
      }

      var plane = new Plane();
      plane.setFromThreePoint(points[0], points.get(-1), points[ipos]);
      return plane;
    }
    /** 
     * 判断所有点是否在同一个平面
     * @param {Array<Vector3|Point>} points 
     * @param {*} precision 
     * @returns {Boolean|Plane} 如果在同一个平面返回所在平面，否则返回false 
     */

    function isInOnePlane(points, precision = gPrecision) {
      var plane = recognitionPlane(points);

      for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        if (plane.distancePoint(pt) >= precision) return false;
      }

      return plane;
    } // export function

    class Polygon extends Polyline {
      constructor() {
        super();
      }

      offset() {}

    }
    /**
     * robust 识别出点集或者多边形的法线
     * @param {Polygon|Array<Point|Vector3>} points 
     * @returns {Vector3} 法线
     */

    function recognitionPolygonNormal(points) {
      var len = points.length;
      var minV = +Infinity;
      var minVIndex = -1;

      for (let i = 0; i < len + 2; i++) {
        var p0 = points[i % len];
        var p1 = points[(i + 1) % len];
        var p2 = points[(i + 2) % len];
        var dotv = Math.abs(p1.clone().sub(p0).normalize().dot(p2.clone().sub(p1).normalize()));

        if (minV > dotv) {
          dotv = minV;
          minVIndex = i;
        }
      }

      var p0 = points[(minVIndex - 1 + len) % len];
      var p1 = points[minVIndex % len];
      var p2 = points[(minVIndex + 1) % len];
      return p1.clone().sub(p0).cross(p2.clone().sub(p1)).normalize(); //
      // const newPoints = [...points];
      // newPoints.sort(vectorCompare);
      // var line = new Line(newPoints[0], newPoints.get(-1));
      // var point = new Point();
      // var maxDistance = -Infinity;
      // var maxDistanceP = null;
      // for (let i = 0; i < len; i++)
      // {
      //     point.copy(points[i]);
      //     var distance = point.distanceLinePureSq(line);
      //     if (distance > maxDistance)
      //     {
      //         maxDistance = distance;
      //         maxDistanceP = points[i];
      //     }
      // }
      // var d1 = maxDistanceP.clone().sub(newPoints[0])
      // var d2 = maxDistanceP.clone().sub(newPoints.get(-1))
      // var normal = d1.cross(d2);
    }

    class Ray {
      constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction.normalize();
      }
      /**
       * 射线到射线的距离
       * @param  {Ray} ray
       */


      distanceRay(ray) {
        var result = {
          parameters: [],
          closests: [],
          sqrDistance: 0,
          distance: 0
        };
        var diff = this.origin.clone().sub(ray.origin);
        var a01 = -this.direction.dot(ray.direction);
        var b0 = diff.dot(this.direction),
            b1;
        var s0, s1;

        if (Math.abs(a01) < 1) {
          // 射线不平行
          b1 = -diff.dot(ray.direction);
          s0 = a01 * b1 - b0;
          s1 = a01 * b0 - b1;

          if (s0 >= 0) {
            if (s1 >= 0) // region 0 (interior)
              {
                // Minimum at two interior points of rays.
                var det = 1 - a01 * a01;
                s0 /= det;
                s1 /= det;
              } else // region 3 (side)
              {
                s1 = 0;

                if (b0 >= 0) {
                  s0 = 0;
                } else {
                  s0 = -b0;
                }
              }
          } else {
            if (s1 >= 0) // region 1 (side)
              {
                s0 = 0;

                if (b1 >= 0) {
                  s1 = 0;
                } else {
                  s1 = -b1;
                }
              } else // region 2 (corner)
              {
                if (b0 < 0) {
                  s0 = -b0;
                  s1 = 0;
                } else {
                  s0 = 0;

                  if (b1 >= 0) {
                    s1 = 0;
                  } else {
                    s1 = -b1;
                  }
                }
              }
          }
        } else {
          // Rays are parallel.
          if (a01 > 0) {
            // Opposite direction vectors.
            s1 = 0;

            if (b0 >= 0) {
              s0 = 0;
            } else {
              s0 = -b0;
            }
          } else {
            // Same direction vectors.
            if (b0 >= 0) {
              b1 = -diff.dot(ray.direction);
              s0 = 0;
              s1 = -b1;
            } else {
              s0 = -b0;
              s1 = 0;
            }
          }
        }

        result.parameters[0] = s0;
        result.parameters[1] = s1;
        result.closests[0] = this.direction.clone().multiplyScalar(s0).add(this.origin);
        result.closests[1] = ray.direction.clone().multiplyScalar(s1).add(ray.origin);
        diff = result.closests[0].clone().sub(result.closests[1]);
        result.sqrDistance = diff.dot(diff);
        result.distance = Math.sqrt(result.sqrDistance);
        return result;
      }
      /**
       * 射线与线段的距离
       * @param {Segment} segment 
       */


      distanceSegment(segment) {
        const result = {
          parameters: [],
          closests: [],
          sqrDistance: 0,
          distance: 0
        }; // segment.GetCenteredForm(segCenter, segDirection, segExtent);

        var segCenter = segment.center;
        var segDirection = segment.direction;
        var segExtent = segment.len * 0.5;
        var diff = this.origin.clone().sub(segCenter);
        var a01 = -this.direction.dot(segDirection);
        var b0 = diff.dot(this.direction);
        var s0, s1;

        if (Math.abs(a01) < 1) {
          // The ray and segment are not parallel.
          var det = 1 - a01 * a01;
          var extDet = segExtent * det;
          var b1 = -diff.dot(segDirection);
          s0 = a01 * b1 - b0;
          s1 = a01 * b0 - b1;

          if (s0 >= 0) {
            if (s1 >= -extDet) {
              if (s1 <= extDet) // region 0
                {
                  // Minimum at interior points of ray and segment.
                  s0 /= det;
                  s1 /= det;
                } else // region 1
                {
                  s1 = segExtent;
                  s0 = Math.max(-(a01 * s1 + b0), 0);
                }
            } else // region 5
              {
                s1 = -segExtent;
                s0 = Math.max(-(a01 * s1 + b0), 0);
              }
          } else {
            if (s1 <= -extDet) // region 4
              {
                s0 = -(-a01 * segExtent + b0);

                if (s0 > 0) {
                  s1 = -segExtent;
                } else {
                  s0 = 0;
                  s1 = -b1;

                  if (s1 < -segExtent) {
                    s1 = -segExtent;
                  } else if (s1 > segExtent) {
                    s1 = segExtent;
                  }
                }
              } else if (s1 <= extDet) // region 3
              {
                s0 = 0;
                s1 = -b1;

                if (s1 < -segExtent) {
                  s1 = -segExtent;
                } else if (s1 > segExtent) {
                  s1 = segExtent;
                }
              } else // region 2
              {
                s0 = -(a01 * segExtent + b0);

                if (s0 > 0) {
                  s1 = segExtent;
                } else {
                  s0 = 0;
                  s1 = -b1;

                  if (s1 < -segExtent) {
                    s1 = -segExtent;
                  } else if (s1 > segExtent) {
                    s1 = segExtent;
                  }
                }
              }
          }
        } else {
          // Ray and segment are parallel.
          if (a01 > 0) {
            // Opposite direction vectors.
            s1 = -segExtent;
          } else {
            // Same direction vectors.
            s1 = segExtent;
          }

          s0 = Math.max(-(a01 * s1 + b0), 0);
        }

        result.parameters[0] = s0;
        result.parameters[1] = s1;
        result.closests[0] = this.direction.clone().multiplyScalar(s0).add(this.origin);
        result.closests[1] = segDirection.clone().multiplyScalar(s1).add(segCenter);
        diff = result.closests[0].clone().sub(result.closests[1]);
        result.sqrDistance = diff.dot(diff);
        result.distance = Math.sqrt(result.sqrDistance);
        return result;
      }

      distanceTriangle(triangle) {
        const result = {
          parameters: [],
          closests: [],
          triangleParameter: [],
          sqrDistance: 0,
          distance: 0
        };
        var line = new Line(this.origin, this.origin.clone().add(this.direction)); // DCPQuery < Real, Line3 < Real >, Triangle3 < Real >> ltQuery;

        var ltResult = line.distanceTriangle(triangle);

        if (ltResult.lineParameter >= 0) {
          //最近点在直线前半部分部分，涉嫌方向
          result.distance = ltResult.distance;
          result.sqrDistance = ltResult.sqrDistance;
          result.rayParameter = ltResult.lineParameter;
          result.triangleParameter[0] = ltResult.triangleParameter[0];
          result.triangleParameter[1] = ltResult.triangleParameter[1];
          result.triangleParameter[2] = ltResult.triangleParameter[2];
          result.closests[0] = ltResult.closests[0];
          result.closests[1] = ltResult.closests[1];
        } else {
          var ptResult = new Point().copy(this.origin).distanceTriangle(triangle);
          result.distance = ptResult.distance;
          result.sqrDistance = ptResult.sqrDistance;
          result.rayParameter = 0;
          result.triangleParameter[0] = ptResult.parameter[0];
          result.triangleParameter[1] = ptResult.parameter[1];
          result.triangleParameter[2] = ptResult.parameter[2];
          result.closests[0] = this.origin;
          result.closests[1] = ptResult.closest;
        }

        return result;
      }
      /**
       * 直线到直线的距离
       * @param  {Ray} ray
       */


      distanceLine(line) {}

    }

    function fromTwoPoint(orgin, point) {
      return new Ray(orgin, point.sub(orgin));
    }

    function ray(orgin, direction) {
      return new Ray(orgin, direction);
    }

    class Sphere {
      constructor(center, radius) {
        this.center = center;
        this.radius = radius;
      }

    }

    class Triangle extends ArrayEx {
      constructor(v0, v1, v2) {
        super();
        this.push(v0, v1, v2);
      }

      get p0() {
        return this[0];
      }

      get p1() {
        return this[1];
      }

      get p2() {
        return this[2];
      }

      distancePoint(point) {}

      distanceLine(line) {}

      distanceRay(ray) {}

      distanceSegment(segment) {}

    }

    class Path extends Polyline {
      constructor(vs = []) {
        super(vs);
        this.init();
      }

      init() {
        if (this.length === 0) return;
        this[0].len = 0;
        this[0].tlen = 0;
        this[0].direction = this[1].clone().sub(this[0]).normalize();

        for (let i = 1; i < this.length; i++) {
          const e = this[i];
          e.len = this[i].distanceTo(this[i - 1]);
          e.tlen = this[i - 1].tlen + e.len;
          this[i].direction = this[i].clone().sub(this[i - 1]).normalize();
        }
      }

      get tlen() {
        if (this.length === 0) return 0;
        return Math.max(this.get(-1).tlen, this[0].tlen);
      }
      /**
       * 截取一段从from到to的path
       * @param {Number} from 
       * @param {Number} to
       */


      splitByFromToDistance(from = 0, to = 0) {
        if (to <= from) return null;
        var newPath = new Path([]);

        for (let i = 0; i < this.length - 1; i++) {
          const pt = this[i];
          const ptnext = this[i + 1];

          if (pt.tlen <= from && ptnext.tlen >= from) {
            var v3 = new Vector3().lerpVectors(pt, ptnext, (from - pt.tlen) / (ptnext.tlen - pt.tlen));
            newPath.add(v3);
          }

          if (pt.tlen > from && pt.tlen < to) {
            newPath.add(pt.clone());
            return data;
          }

          if (pt.tlen <= to && ptnext.tlen >= to) {
            var v3 = new Vector3().lerpVectors(pt, ptnext, (to - pt.tlen) / (ptnext.tlen - pt.tlen));
            newPath.add(v3);
            return newPath;
          }
        }

        return newPath;
      }
      /**
       * 从起点出发到距离等于distance位置  的坐标 二分查找
       * @param {Number} distance
       */


      getPointByDistance(arg_distance) {
        const distance = clamp(arg_distance, 0, this.get(-1).tlen);
        if (distance !== arg_distance) return null;

        if (right - left === 1) {
          return {
            position: left,
            isNode: false,
            //是否在节点上
            point: new Vector3().lerpVectors(this[left], this[right], (distance - this[left].tlen) / this[right].len)
          };
        }

        var mid = left + right >> 1;
        if (this[mid].tlen > distance) return this.getPointByDistanceEx(distance, left, mid);else if (this[mid].tlen < distance) return this.getPointByDistanceEx(distance, mid, right);else return {
          position: mid,
          isNode: true,
          //是否在节点上
          point: new Vector3().lerpVectors(this[left], this[right], (distance - this[left].tlen) / this[right].len)
        };
      }
      /**
       * 从起点出发到距离等于distance位置  的坐标 二分查找
       * @param {Number} distance 
       */


      getPointByDistancePure(arg_distance) {
        const distance = clamp(arg_distance, 0, this.get(-1).tlen);
        if (distance !== arg_distance) return null;
        if (right - left === 1) return new Vector3().lerpVectors(this[left], this[right], (distance - this[left].tlen) / this[right].len);
        var mid = left + right >> 1;
        if (this[mid].tlen > distance) return this.getPointByDistanceEx(distance, left, mid);else if (this[mid].tlen < distance) return this.getPointByDistanceEx(distance, mid, right);else return this[mid].clone();
      }
      /**
       * 平均切割为 splitCount 段
       * @param {Number} splitCount 
       * @returns {Path} 新的path
       */


      splitAverage(splitCount) {
        var tlen = this.lastElement.tlen;
        var res = [];

        return Path(res);
      }
      /**
       * 
       * @param  {...any} ps 
       */


      add(...ps) {
        for (let i = 0; i < ps.length; i++) {
          const pt = ps[i];
          this.push(pt);
          pt.len = pt.distanceTo(this.get(-1));
          pt.tlen = this.get(-1).tlen + pt.len;
          pt.direction = pt.clone().sub(this.get(-1).normalize());
          this.get(-1).direction.copy(pt.direction);
        }
      }

    }

    function indexable(obj, refIndexInfo = {
      index: 0
    }, force = false) {
      if (obj instanceof Array) {
        for (var i = 0; i < obj.length; i++) indexable(obj[i], refIndexInfo);
      } else if (obj instanceof Object) {
        if (obj.index === undefined) obj.index = refIndexInfo.index++;else if (force) obj.index = refIndexInfo.index++;
      }
    }
    function triangListToBuffer(vertices, triangleList) {
      indexable(triangleList);
      var indices = [];
      triangleList.forall(v => {
        indices.push(v.index);
      });
      return toBuffer(vertices, indices);
    }
    /**
     * 
     * @param {Array<Verctor3|Number>} vertices 
     * @param {Array<Number>} indices
     * @param {Array<Verctor2|Number>} uvs
     */

    function toBuffer(inVertices, indices, inUvs = []) {
      var vertices = [];

      if (inVertices[0] instanceof Vector3$1) {
        for (let i = 0; i < inVertices.length; i++) {
          const v = inVertices[i];
          vertices.push(v.x, v.y, v.z);
        }
      } else {
        vertices = inVertices;
      }

      var uvs = [];

      if (inUvs.length > 0 && inUvs[0] instanceof Vector2) {
        for (let i = 0; i < inUvs.length; i++) {
          const uv = inVertices[i];
          uvs.push(uv.x, uv.y);
        }
      } else {
        uvs = inUvs;
      }

      var verticesBuffer = new Float32Array(vertices);
      var uvsBuffer = new Float32Array(uvs.length === 0 ? vertices.length / 3 * 2 : uvs);
      var indicesBuffer = new (verticesBuffer.length / 3 > 65535 ? Uint32Array : Uint16Array)(indices);
      return {
        verticesBuffer,
        uvsBuffer,
        indicesBuffer
      };
    }

    var earcut_1 = earcut;
    var default_1 = earcut;

    function earcut(data, holeIndices, dim) {

        dim = dim || 2;

        var hasHoles = holeIndices && holeIndices.length,
            outerLen = hasHoles ? holeIndices[0] * dim : data.length,
            outerNode = linkedList(data, 0, outerLen, dim, true),
            triangles = [];

        if (!outerNode || outerNode.next === outerNode.prev) return triangles;

        var minX, minY, maxX, maxY, x, y, invSize;

        if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

        // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
        if (data.length > 80 * dim) {
            minX = maxX = data[0];
            minY = maxY = data[1];

            for (var i = dim; i < outerLen; i += dim) {
                x = data[i];
                y = data[i + 1];
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
            }

            // minX, minY and invSize are later used to transform coords into integers for z-order calculation
            invSize = Math.max(maxX - minX, maxY - minY);
            invSize = invSize !== 0 ? 1 / invSize : 0;
        }

        earcutLinked(outerNode, triangles, dim, minX, minY, invSize);

        return triangles;
    }

    // create a circular doubly linked list from polygon points in the specified winding order
    function linkedList(data, start, end, dim, clockwise) {
        var i, last;

        if (clockwise === (signedArea(data, start, end, dim) > 0)) {
            for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
        } else {
            for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
        }

        if (last && equals(last, last.next)) {
            removeNode(last);
            last = last.next;
        }

        return last;
    }

    // eliminate colinear or duplicate points
    function filterPoints(start, end) {
        if (!start) return start;
        if (!end) end = start;

        var p = start,
            again;
        do {
            again = false;

            if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
                removeNode(p);
                p = end = p.prev;
                if (p === p.next) break;
                again = true;

            } else {
                p = p.next;
            }
        } while (again || p !== end);

        return end;
    }

    // main ear slicing loop which triangulates a polygon (given as a linked list)
    function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
        if (!ear) return;

        // interlink polygon nodes in z-order
        if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

        var stop = ear,
            prev, next;

        // iterate through ears, slicing them one by one
        while (ear.prev !== ear.next) {
            prev = ear.prev;
            next = ear.next;

            if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
                // cut off the triangle
                triangles.push(prev.i / dim);
                triangles.push(ear.i / dim);
                triangles.push(next.i / dim);

                removeNode(ear);

                // skipping the next vertex leads to less sliver triangles
                ear = next.next;
                stop = next.next;

                continue;
            }

            ear = next;

            // if we looped through the whole remaining polygon and can't find any more ears
            if (ear === stop) {
                // try filtering points and slicing again
                if (!pass) {
                    earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

                // if this didn't work, try curing all small self-intersections locally
                } else if (pass === 1) {
                    ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
                    earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

                // as a last resort, try splitting the remaining polygon into two
                } else if (pass === 2) {
                    splitEarcut(ear, triangles, dim, minX, minY, invSize);
                }

                break;
            }
        }
    }

    // check whether a polygon node forms a valid ear with adjacent nodes
    function isEar(ear) {
        var a = ear.prev,
            b = ear,
            c = ear.next;

        if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

        // now make sure we don't have other points inside the potential ear
        var p = ear.next.next;

        while (p !== ear.prev) {
            if (pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area(p.prev, p, p.next) >= 0) return false;
            p = p.next;
        }

        return true;
    }

    function isEarHashed(ear, minX, minY, invSize) {
        var a = ear.prev,
            b = ear,
            c = ear.next;

        if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

        // triangle bbox; min & max are calculated like this for speed
        var minTX = a.x < b.x ? (a.x < c.x ? a.x : c.x) : (b.x < c.x ? b.x : c.x),
            minTY = a.y < b.y ? (a.y < c.y ? a.y : c.y) : (b.y < c.y ? b.y : c.y),
            maxTX = a.x > b.x ? (a.x > c.x ? a.x : c.x) : (b.x > c.x ? b.x : c.x),
            maxTY = a.y > b.y ? (a.y > c.y ? a.y : c.y) : (b.y > c.y ? b.y : c.y);

        // z-order range for the current triangle bbox;
        var minZ = zOrder(minTX, minTY, minX, minY, invSize),
            maxZ = zOrder(maxTX, maxTY, minX, minY, invSize);

        var p = ear.prevZ,
            n = ear.nextZ;

        // look for points inside the triangle in both directions
        while (p && p.z >= minZ && n && n.z <= maxZ) {
            if (p !== ear.prev && p !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;

            if (n !== ear.prev && n !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
                area(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
        }

        // look for remaining points in decreasing z-order
        while (p && p.z >= minZ) {
            if (p !== ear.prev && p !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) &&
                area(p.prev, p, p.next) >= 0) return false;
            p = p.prevZ;
        }

        // look for remaining points in increasing z-order
        while (n && n.z <= maxZ) {
            if (n !== ear.prev && n !== ear.next &&
                pointInTriangle(a.x, a.y, b.x, b.y, c.x, c.y, n.x, n.y) &&
                area(n.prev, n, n.next) >= 0) return false;
            n = n.nextZ;
        }

        return true;
    }

    // go through all polygon nodes and cure small local self-intersections
    function cureLocalIntersections(start, triangles, dim) {
        var p = start;
        do {
            var a = p.prev,
                b = p.next.next;

            if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

                triangles.push(a.i / dim);
                triangles.push(p.i / dim);
                triangles.push(b.i / dim);

                // remove two nodes involved
                removeNode(p);
                removeNode(p.next);

                p = start = b;
            }
            p = p.next;
        } while (p !== start);

        return filterPoints(p);
    }

    // try splitting polygon into two and triangulate them independently
    function splitEarcut(start, triangles, dim, minX, minY, invSize) {
        // look for a valid diagonal that divides the polygon into two
        var a = start;
        do {
            var b = a.next.next;
            while (b !== a.prev) {
                if (a.i !== b.i && isValidDiagonal(a, b)) {
                    // split the polygon in two by the diagonal
                    var c = splitPolygon(a, b);

                    // filter colinear points around the cuts
                    a = filterPoints(a, a.next);
                    c = filterPoints(c, c.next);

                    // run earcut on each half
                    earcutLinked(a, triangles, dim, minX, minY, invSize);
                    earcutLinked(c, triangles, dim, minX, minY, invSize);
                    return;
                }
                b = b.next;
            }
            a = a.next;
        } while (a !== start);
    }

    // link every hole into the outer loop, producing a single-ring polygon without holes
    function eliminateHoles(data, holeIndices, outerNode, dim) {
        var queue = [],
            i, len, start, end, list;

        for (i = 0, len = holeIndices.length; i < len; i++) {
            start = holeIndices[i] * dim;
            end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
            list = linkedList(data, start, end, dim, false);
            if (list === list.next) list.steiner = true;
            queue.push(getLeftmost(list));
        }

        queue.sort(compareX);

        // process holes from left to right
        for (i = 0; i < queue.length; i++) {
            eliminateHole(queue[i], outerNode);
            outerNode = filterPoints(outerNode, outerNode.next);
        }

        return outerNode;
    }

    function compareX(a, b) {
        return a.x - b.x;
    }

    // find a bridge between vertices that connects hole with an outer ring and and link it
    function eliminateHole(hole, outerNode) {
        outerNode = findHoleBridge(hole, outerNode);
        if (outerNode) {
            var b = splitPolygon(outerNode, hole);
            filterPoints(b, b.next);
        }
    }

    // David Eberly's algorithm for finding a bridge between hole and outer polygon
    function findHoleBridge(hole, outerNode) {
        var p = outerNode,
            hx = hole.x,
            hy = hole.y,
            qx = -Infinity,
            m;

        // find a segment intersected by a ray from the hole's leftmost point to the left;
        // segment's endpoint with lesser x will be potential connection point
        do {
            if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
                var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
                if (x <= hx && x > qx) {
                    qx = x;
                    if (x === hx) {
                        if (hy === p.y) return p;
                        if (hy === p.next.y) return p.next;
                    }
                    m = p.x < p.next.x ? p : p.next;
                }
            }
            p = p.next;
        } while (p !== outerNode);

        if (!m) return null;

        if (hx === qx) return m; // hole touches outer segment; pick leftmost endpoint

        // look for points inside the triangle of hole point, segment intersection and endpoint;
        // if there are no points found, we have a valid connection;
        // otherwise choose the point of the minimum angle with the ray as connection point

        var stop = m,
            mx = m.x,
            my = m.y,
            tanMin = Infinity,
            tan;

        p = m;

        do {
            if (hx >= p.x && p.x >= mx && hx !== p.x &&
                    pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

                tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

                if (locallyInside(p, hole) &&
                    (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
                    m = p;
                    tanMin = tan;
                }
            }

            p = p.next;
        } while (p !== stop);

        return m;
    }

    // whether sector in vertex m contains sector in vertex p in the same coordinates
    function sectorContainsSector(m, p) {
        return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
    }

    // interlink polygon nodes in z-order
    function indexCurve(start, minX, minY, invSize) {
        var p = start;
        do {
            if (p.z === null) p.z = zOrder(p.x, p.y, minX, minY, invSize);
            p.prevZ = p.prev;
            p.nextZ = p.next;
            p = p.next;
        } while (p !== start);

        p.prevZ.nextZ = null;
        p.prevZ = null;

        sortLinked(p);
    }

    // Simon Tatham's linked list merge sort algorithm
    // http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
    function sortLinked(list) {
        var i, p, q, e, tail, numMerges, pSize, qSize,
            inSize = 1;

        do {
            p = list;
            list = null;
            tail = null;
            numMerges = 0;

            while (p) {
                numMerges++;
                q = p;
                pSize = 0;
                for (i = 0; i < inSize; i++) {
                    pSize++;
                    q = q.nextZ;
                    if (!q) break;
                }
                qSize = inSize;

                while (pSize > 0 || (qSize > 0 && q)) {

                    if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
                        e = p;
                        p = p.nextZ;
                        pSize--;
                    } else {
                        e = q;
                        q = q.nextZ;
                        qSize--;
                    }

                    if (tail) tail.nextZ = e;
                    else list = e;

                    e.prevZ = tail;
                    tail = e;
                }

                p = q;
            }

            tail.nextZ = null;
            inSize *= 2;

        } while (numMerges > 1);

        return list;
    }

    // z-order of a point given coords and inverse of the longer side of data bbox
    function zOrder(x, y, minX, minY, invSize) {
        // coords are transformed into non-negative 15-bit integer range
        x = 32767 * (x - minX) * invSize;
        y = 32767 * (y - minY) * invSize;

        x = (x | (x << 8)) & 0x00FF00FF;
        x = (x | (x << 4)) & 0x0F0F0F0F;
        x = (x | (x << 2)) & 0x33333333;
        x = (x | (x << 1)) & 0x55555555;

        y = (y | (y << 8)) & 0x00FF00FF;
        y = (y | (y << 4)) & 0x0F0F0F0F;
        y = (y | (y << 2)) & 0x33333333;
        y = (y | (y << 1)) & 0x55555555;

        return x | (y << 1);
    }

    // find the leftmost node of a polygon ring
    function getLeftmost(start) {
        var p = start,
            leftmost = start;
        do {
            if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
            p = p.next;
        } while (p !== start);

        return leftmost;
    }

    // check if a point lies within a convex triangle
    function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
        return (cx - px) * (ay - py) - (ax - px) * (cy - py) >= 0 &&
               (ax - px) * (by - py) - (bx - px) * (ay - py) >= 0 &&
               (bx - px) * (cy - py) - (cx - px) * (by - py) >= 0;
    }

    // check if a diagonal between two polygon nodes is valid (lies in polygon interior)
    function isValidDiagonal(a, b) {
        return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
               (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
                (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
                equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
    }

    // signed area of a triangle
    function area(p, q, r) {
        return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
    }

    // check if two points are equal
    function equals(p1, p2) {
        return p1.x === p2.x && p1.y === p2.y;
    }

    // check if two segments intersect
    function intersects(p1, q1, p2, q2) {
        var o1 = sign$1(area(p1, q1, p2));
        var o2 = sign$1(area(p1, q1, q2));
        var o3 = sign$1(area(p2, q2, p1));
        var o4 = sign$1(area(p2, q2, q1));

        if (o1 !== o2 && o3 !== o4) return true; // general case

        if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
        if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
        if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
        if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

        return false;
    }

    // for collinear points p, q, r, check if point q lies on segment pr
    function onSegment(p, q, r) {
        return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
    }

    function sign$1(num) {
        return num > 0 ? 1 : num < 0 ? -1 : 0;
    }

    // check if a polygon diagonal intersects any polygon segments
    function intersectsPolygon(a, b) {
        var p = a;
        do {
            if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
                    intersects(p, p.next, a, b)) return true;
            p = p.next;
        } while (p !== a);

        return false;
    }

    // check if a polygon diagonal is locally inside the polygon
    function locallyInside(a, b) {
        return area(a.prev, a, a.next) < 0 ?
            area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
            area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
    }

    // check if the middle point of a polygon diagonal is inside the polygon
    function middleInside(a, b) {
        var p = a,
            inside = false,
            px = (a.x + b.x) / 2,
            py = (a.y + b.y) / 2;
        do {
            if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
                    (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
                inside = !inside;
            p = p.next;
        } while (p !== a);

        return inside;
    }

    // link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
    // if one belongs to the outer ring and another to a hole, it merges it into a single ring
    function splitPolygon(a, b) {
        var a2 = new Node(a.i, a.x, a.y),
            b2 = new Node(b.i, b.x, b.y),
            an = a.next,
            bp = b.prev;

        a.next = b;
        b.prev = a;

        a2.next = an;
        an.prev = a2;

        b2.next = a2;
        a2.prev = b2;

        bp.next = b2;
        b2.prev = bp;

        return b2;
    }

    // create a node and optionally link it with previous one (in a circular doubly linked list)
    function insertNode(i, x, y, last) {
        var p = new Node(i, x, y);

        if (!last) {
            p.prev = p;
            p.next = p;

        } else {
            p.next = last.next;
            p.prev = last;
            last.next.prev = p;
            last.next = p;
        }
        return p;
    }

    function removeNode(p) {
        p.next.prev = p.prev;
        p.prev.next = p.next;

        if (p.prevZ) p.prevZ.nextZ = p.nextZ;
        if (p.nextZ) p.nextZ.prevZ = p.prevZ;
    }

    function Node(i, x, y) {
        // vertex index in coordinates array
        this.i = i;

        // vertex coordinates
        this.x = x;
        this.y = y;

        // previous and next vertex nodes in a polygon ring
        this.prev = null;
        this.next = null;

        // z-order curve value
        this.z = null;

        // previous and next nodes in z-order
        this.prevZ = null;
        this.nextZ = null;

        // indicates whether this is a steiner point
        this.steiner = false;
    }

    // return a percentage difference between the polygon area and its triangulation area;
    // used to verify correctness of triangulation
    earcut.deviation = function (data, holeIndices, dim, triangles) {
        var hasHoles = holeIndices && holeIndices.length;
        var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

        var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
        if (hasHoles) {
            for (var i = 0, len = holeIndices.length; i < len; i++) {
                var start = holeIndices[i] * dim;
                var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
                polygonArea -= Math.abs(signedArea(data, start, end, dim));
            }
        }

        var trianglesArea = 0;
        for (i = 0; i < triangles.length; i += 3) {
            var a = triangles[i] * dim;
            var b = triangles[i + 1] * dim;
            var c = triangles[i + 2] * dim;
            trianglesArea += Math.abs(
                (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
                (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
        }

        return polygonArea === 0 && trianglesArea === 0 ? 0 :
            Math.abs((trianglesArea - polygonArea) / polygonArea);
    };

    function signedArea(data, start, end, dim) {
        var sum = 0;
        for (var i = start, j = end - dim; i < end; i += dim) {
            sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
            j = i;
        }
        return sum;
    }

    // turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
    earcut.flatten = function (data) {
        var dim = data[0][0].length,
            result = {vertices: [], holes: [], dimensions: dim},
            holeIndex = 0;

        for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].length; j++) {
                for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
            }
            if (i > 0) {
                holeIndex += data[i - 1].length;
                result.holes.push(holeIndex);
            }
        }
        return result;
    };
    earcut_1.default = default_1;

    /** 
     * 三角剖分  earcut.js
     * @param {Array} boundary 边界
     * @param {Array<Array>} holes 洞的数组
     * @param {options:{feature,dim,normal}} feature 选择平平面 
     * @returns {Array<Number>} 三角形索引数组
     */

    function trianglation(inboundary, holes = [], options = {}) {
      options = {
        feature: "xyz",
        dim: 3,
        ...options
      };
      let boundary = null;
      let feature = options.feature;
      let dim = options.dim;
      let normal = options.normal || recognitionPolygonNormal(inboundary);

      if (normal.dot(Vector3$1.UnitZ) < 1 - gPrecision) {
        boundary = clone(inboundary);
        rotateByUnitVectors(boundary, normal, Vector3$1.UnitZ);
      } else {
        boundary = inboundary;
      }

      var allV = [...boundary, ...holes.flat(2)];
      var vertextNumbers = verctorToNumbers(allV, feature);
      var holesIndex = [];
      var baseIndex = boundary.length;

      for (let i = -1; i < holes.length - 1; i++) {
        holesIndex.push(baseIndex);
        const hole = holes[i + 1];
        holesIndex.push(baseIndex + hole.length);
      }

      var result = earcut_1(vertextNumbers, holesIndex, dim);
      return result;
    }

    /**
     *  常用shape几何操作
     */

    /**
     * 缝合两个边
     * @param {Array} side0 
     * @param {Array} side1 
     * @param {Boolean} isClosed 
     * @returns {Array<Vector3>} 三角形数组，每三个为一个三角形 
     */

    function linkSide(side0, side1, isClosed = false) {
      if (side0.length !== side1.length) throw "拉伸两边的点数量不一致  linkSide";
      if (side0.length < 2 || side1.length < 2) return [];
      var sidelength = side0.length;
      var orgLen = side0.length;
      var length = isClosed ? side0.length : side0.length - 1;
      var triangles = new ArrayEx();

      if (side0[0] instanceof Number) {
        //索引三角形
        for (var i = 0; i < length; i++) {
          var v00 = side0[i];
          var v01 = side0[(i + 1) % orgLen];
          var v10 = side1[i];
          var v11 = side1[(i + 1) % orgLen];
          triangles.push(v00);
          triangles.push(v10);
          triangles.push(v11);
          triangles.push(v00);
          triangles.push(v11);
          triangles.push(v01);
        }
      } else {
        if (side0[0].index !== undefined) {
          //含索引的顶点
          for (var i = 0; i < length; i++) {
            var v00 = side0[i];
            var v01 = side0[(i + 1) % orgLen];
            var v10 = side1[i];
            var v11 = side1[(i + 1) % orgLen];
            triangles.push(v00.index);
            triangles.push(v10.index);
            triangles.push(v11.index);
            triangles.push(v00.index);
            triangles.push(v11.index);
            triangles.push(v01.index);
          }
        } else {
          //三角形顶点
          for (var i = 0; i < length; i++) {
            var v00 = side0[i];
            var v01 = side0[(i + 1) % orgLen];
            var v10 = side1[i];
            var v11 = side1[(i + 1) % orgLen];
            triangles.push(v00);
            triangles.push(v10);
            triangles.push(v11);
            triangles.push(v00);
            triangles.push(v01);
            triangles.push(v11);
          }
        }
      }

      return triangles;
    }
    /**
     * 缝合shape集合
     * @param {Array<Array<Point|Vector3>} shapes  路基 点集的集合， 每个shape的点数量一致
     * @param {Boolean} isClosed 每一个shape是否是封闭的圈 默认false
     * @returns {Array} 返回三角形集合 如果有所用范围索引，否则返回顶点
     */

    function linkSides(shapes, isClosed = false, isClosed2 = false) {
      var length = isClosed2 ? shapes.length : shapes.length - 1;
      var triangles = new ArrayEx();

      for (var i = 0; i < length; i++) {
        triangles.push(...linkSide(shapes[i], shapes[(i + 1) % shapes.length], isClosed));
      }

      return triangles;
    }
    /**
     * 缝合shape 折线集合
     * @param {Array} polylines  路基 点集的集合， 
     * @returns {Array} 返回三角形集合 如果有所用范围索引，否则返回顶点
     */

    function linkPolyline(polylines) {
      return linkSides(polylines, false);
    }
    /**
     * 缝合shape 多边形集合
     * @param {Array} polygon
     * @returns {Array} 返回三角形集合 如果有所用范围索引，否则返回顶点
     */

    function linkPloygon(polygon) {
      return linkSides(polygon, false);
    }
    /**
     * 挤压
     * @param {Polygon|Array<Point|Vector3> }  shape   多边形或顶点数组
     * @param {Path|Array<Point|Vector3> } path  路径或者或顶点数组
     * @param {Object} options {  
     *      isClosed: false,闭合为多边形
     *      isClosed2: false, 闭合为圈
     *      textureEnable: true, 计算纹理坐标
     *      textureScale: new Vector2(1, 1),纹理坐标缩放
     *      smoothAngle: Math.PI / 180 * 30,大于这个角度则不平滑
     *      sealStart: true, 是否密封开始面
     *      sealEnd: true,是否密封结束面}
     */

    function extrude(shape, arg_path, options = {}) {
      options = {
        isClosed: false,
        isClosed2: false,
        textureEnable: true,
        textureScale: new Vector2(1, 1),
        smoothAngle: Math.PI / 180 * 30,
        sealStart: true,
        sealEnd: true,
        ...options
      };
      var normal = options.normal || recognitionPolygonNormal(shape);
      var startSeal = clone(shape);
      var shapepath = new Path(shape);
      var insertNum = 0;

      for (let i = 1; i < shapepath.length - 1; i++) {
        //大角度插入点
        if (Math.acos(shapepath[i].direction.dot(shapepath[i + 1].direction)) > options.smoothAngle) shape.splice(i + insertNum++, 0, shapepath[i].clone());
      }

      if (options.isClosed) {
        //大角度插入点
        var dir1 = shapepath.get(-1).clone().sub(shapepath.get(-2)).normalize();
        var dir2 = shapepath[0].clone().sub(shapepath.get(-1)).normalize();
        if (Math.acos(dir1.dot(dir2)) > options.smoothAngle) ;
        shape.push(shape.get(-1).clone()); //新加起始点纹理拉伸

        shape.unshift(shape[0].clone());
      }

      let path = arg_path;
      if (!(path instanceof Path) && path instanceof Array) path = new Path(arg_path);
      const shapeArray = [];

      for (let i = 0; i < path.length; i++) {
        const node = path[i];
        var dir = node.direction;
        var newShape = clone(shape);
        rotateByUnitVectors(newShape, normal, dir);
        translate(newShape, node);
        shapeArray.push(newShape);
      }

      const index = {
        index: 0
      };
      var vertices = shapeArray.flat(2);
      indexable(vertices, index);
      var triangles = linkSides(shapeArray, options.isClosed, options.isClosed2);
      shapepath = new Path(shape);
      var uvs = [];

      for (let i = 0; i < path.length; i++) {
        for (let j = 0; j < shapepath.length; j++) {
          uvs.push(shapepath[j].tlen * options.textureScale.x, path[i].tlen * options.textureScale.y);
        }
      }

      var sealUv = clone(startSeal);
      if (normal.dot(Vector3$1.UnitZ) < 1 - 1e-4) rotateByUnitVectors(sealUv, normal, v3(0, 0, 1));
      var endSeal = clone(startSeal);
      rotateByUnitVectors(startSeal, normal, path[0].direction);
      translate(startSeal, path[0]);
      rotateByUnitVectors(endSeal, normal, path.get(-1).direction);
      translate(endSeal, path.get(-1));
      var sealStartTris = trianglation(sealUv, [], {
        normal
      });
      if (options.sealStart) indexable(startSeal, index);
      if (options.sealEnd) indexable(endSeal, index);
      var sealEndTris = [];
      var hasVLen = vertices.length;
      if (options.sealStart) for (let i = 0; i < sealStartTris.length; i++) {
        sealStartTris[i] += hasVLen;
      }
      if (options.sealEnd && !options.sealStart) for (let i = 0; i < sealStartTris.length; i++) {
        sealEndTris[i] = sealStartTris[i] + hasVLen;
      }
      if (options.sealEnd && options.sealStart) for (let i = 0; i < sealStartTris.length; i++) {
        sealEndTris[i] = sealStartTris[i] + startSeal.length;
      }

      if (options.sealStart) {
        vertices.push(...startSeal);
        triangles.push(...sealStartTris);

        for (let i = 0; i < sealUv.length; i++) uvs.push(sealUv[i].x, sealUv[i].y);
      }

      if (options.sealEnd) {
        vertices.push(...endSeal);
        triangles.push(...sealEndTris);

        for (let i = 0; i < sealUv.length; i++) uvs.push(sealUv[i].x, sealUv[i].y);
      }

      return {
        vertices,
        triangles,
        uvs
      };
    }

    class ConvexHull {
      /**
       * 
       * @param {Array<Points>} points  点集
       * @param {} options  {planeNormal,method}
       */
      constructor(points, options = {
        planeNormal: null,
        method: 'quick'
      }) {
        if (points.length < 3) {
          throw Error('cannot build a simplex out of <3 points');
        }

        this._hull = [];
        this.originPoints = points;
        var newpoints = clone(points);
        indexable(newpoints);
        var planeNormal = options.planeNormal;

        if (!planeNormal) {
          var plane = isInOnePlane(newpoints);
          if (plane) planeNormal = plane.normal;
        }

        this.normal = Vector3$1.UnitZ;

        if (planeNormal) {
          //在一个平面  2D ConvexHull 
          if (this.normal.dot(planeNormal) < 0) planeNormal.negate();
          rotateByUnitVectors(newpoints, planeNormal, this.normal);
          newpoints.forEach(pt => pt.z = 0); //找出一段在某个轴距离最远点

          var [minPt, maxPt] = this.getMinMax(newpoints);
          var line0 = new Line(minPt, maxPt);
          var line1 = new Line(maxPt, minPt);
          this.addBoundSeg(line0, newpoints);
          this.addBoundSeg(line1, newpoints);
        }
      }

      getMinMax(points) {
        var maxXp = points[0];
        var minXp = points[0];

        for (let i = 1; i < points.length; i++) {
          var point = points[i];
          if (maxXp.x < point.x) maxXp = point;else if (minXp.x > point.x) minXp = point;
        }

        return [minXp, maxXp];
      }

      outerPoints(line, points) {
        var outerPoint = [];

        for (let i = 0; i < points.length; i++) {
          const point = points[i];
          if (line.orientationPoint(point, this.normal) === Orientation.Positive) outerPoint.push(point);
        }

        return outerPoint;
      }

      distalPoints(line, points) {
        var distalPoint = null;
        var maxDistance = -Infinity;

        for (let i = 0; i < points.length; i++) {
          const point = points[i];
          var distance = line.distancePoint(point).distance;

          if (distance > maxDistance) {
            distalPoint = point;
            maxDistance = distance;
          }
        }

        return distalPoint;
      }

      addBoundSeg(line, points) {
        var subPoints = this.outerPoints(line, points);
        if (subPoints.length === 0) return this._hull.push(line.origin);
        var distalPt = this.distalPoints(line, subPoints);
        this.addBoundSeg(new Line(line.origin, distalPt), subPoints);
        this.addBoundSeg(new Line(distalPt, line.end), subPoints);
      }

      get hull() {
        if (!this.__hull) {
          this.__hull = [];
          debugger;

          for (let i = 0; i < this._hull.length; i++) {
            const point = this._hull[i];

            this.__hull.push(this.originPoints[point.index]);
          }
        }

        return this.__hull;
      }

    }
    function quickHull(points) {
      var ch = new ConvexHull(points);
      return ch.hull;
    }

    if (!Array.prototype.get) Array.prototype.get = function (index) {
      if (index < 0) index = this.length + index;
      return this[index];
    };
    /**
     * 深度优先遍历
     * @param {*} method 
     */

    if (!Array.prototype.forall) Array.prototype.forall = function (method) {
      for (let i = 0; i < this.length; i++) {
        method(this[i]);
        if (this[i] instanceof Array) this[i].forall(method);
      }
    };
    /**
     * 分类
     * example:
     *      var arry = [1,2,3,4,5,6]
     *      var result = classify(this,(a)={return a%2===0}) 
     * 
     * @param {Function} classifyMethod  分类方法
     */

    if (!Array.prototype.forall) Array.prototype.classify = function (classifyMethod) {
      var result = [];

      for (let i = 0; i < this.length; i++) {
        for (let j = 0; j < result.length; j++) {
          if (classifyMethod(this[i], result[j][0], result[j])) {
            result[j].push(this[i]);
          } else {
            result.push([this[i]]);
          }
        }
      }

      return result;
    };
    /**
     * 去掉重复元素 
     * @param {Function} uniqueMethod  去重复
     * @param {Function} sortMethod 排序
     */

    if (!Array.prototype.unique) Array.prototype.unique = function (uniqueMethod, sortMethod) {
      if (sortMethod) {
        this.sort(sortMethod);

        for (let i = 0; i < this.length; i++) {
          for (let j = i + 1; j < this.length; j++) {
            if (uniqueMethod(this[i], this[j]) === true) {
              this.splice(j, 1);
              j--;
            } else break;
          }
        }

        return this;
      }

      for (let i = 0; i < this.length; i++) {
        for (let j = i + 1; j < this.length; j++) {
          if (uniqueMethod(this[i], this[j]) === true) {
            this.splice(j, 1);
            j--;
          }
        }
      }

      return this;
    };

    exports.ArrayEx = ArrayEx;
    exports.Circle = Circle;
    exports.ConvexHull = ConvexHull;
    exports.Disk = Disk;
    exports.Euler = Euler;
    exports.Line = Line;
    exports.Matrix3 = Matrix3;
    exports.Matrix4 = Matrix4;
    exports.Path = Path;
    exports.Plane = Plane;
    exports.Point = Point;
    exports.Polygon = Polygon;
    exports.Polyline = Polyline;
    exports.Quaternion = Quaternion;
    exports.Ray = Ray;
    exports.Segment = Segment;
    exports.Sphere = Sphere;
    exports.Triangle = Triangle;
    exports.Vector2 = Vector2;
    exports.Vector3 = Vector3$1;
    exports.Vector4 = Vector4;
    exports.applyMatrix4 = applyMatrix4;
    exports.applyQuaternion = applyQuaternion;
    exports.approximateEqual = approximateEqual;
    exports.boundingBox = boundingBox;
    exports.calcCircleFromThreePoint = calcCircleFromThreePoint;
    exports.ceilPowerOfTwo = ceilPowerOfTwo;
    exports.circle = circle;
    exports.clamp = clamp;
    exports.classify = classify;
    exports.clone = clone;
    exports.degToRad = degToRad;
    exports.disk = disk;
    exports.euler = euler;
    exports.extrude = extrude;
    exports.floorPowerOfTwo = floorPowerOfTwo;
    exports.forall = forall;
    exports.fromTwoPoint = fromTwoPoint;
    exports.gPrecision = gPrecision;
    exports.indexable = indexable;
    exports.isInOnePlane = isInOnePlane;
    exports.isPowerOfTwo = isPowerOfTwo;
    exports.lerp = lerp;
    exports.line = line;
    exports.linkPloygon = linkPloygon;
    exports.linkPolyline = linkPolyline;
    exports.linkSide = linkSide;
    exports.linkSides = linkSides;
    exports.m3 = m3;
    exports.m4 = m4;
    exports.projectOnPlane = projectOnPlane;
    exports.quat = quat;
    exports.quickHull = quickHull;
    exports.radToDeg = radToDeg;
    exports.randFloat = randFloat;
    exports.randInt = randInt;
    exports.ray = ray;
    exports.recognitionPlane = recognitionPlane;
    exports.recognitionPolygonNormal = recognitionPolygonNormal;
    exports.reverseOnPlane = reverseOnPlane;
    exports.rotate = rotate;
    exports.rotateByUnitVectors = rotateByUnitVectors;
    exports.scale = scale;
    exports.segment = segment$1;
    exports.sign = sign;
    exports.simplifyPointList = simplifyPointList;
    exports.smootherstep = smootherstep;
    exports.smoothstep = smoothstep;
    exports.toBuffer = toBuffer;
    exports.toFixed = toFixed;
    exports.translate = translate;
    exports.triangListToBuffer = triangListToBuffer;
    exports.trianglation = trianglation;
    exports.unique = unique;
    exports.v2 = v2;
    exports.v3 = v3;
    exports.v4 = v4;
    exports.vectorCompare = vectorCompare;
    exports.verctorToNumbers = verctorToNumbers;

    return exports;

}({}));
