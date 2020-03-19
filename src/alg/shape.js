import { Vector3, v3 } from "../math/Vector3";
import { Path } from "../struct/3d/Path";
import { rotateByUnitVectors, translate } from "./points";
import { clone } from "../utils/array";
import { ArrayEx } from "../struct/data/ArrayEx";
import { indexable } from "./mesh";
import { Vector2 } from "../math/Vector2";
import { triangulation } from "./triangulation";
import { recognitionPolygonNormal } from "../struct/3d/Polygon";
import { Point } from "../struct/3d/Point";

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
export function linkSide(side0, side1, isClosed = false) {
    if (side0.length !== side1.length)
        throw ("拉伸两边的点数量不一致  linkSide");

    if (side0.length < 2 || side1.length < 2)
        return [];

    var sidelength = side0.length;

    var orgLen = side0.length;
    var length = isClosed ? side0.length : side0.length - 1;

    var triangles = new ArrayEx();

    if (side0[0] instanceof Number)
    {
        //索引三角形
        for (var i = 0; i < length; i++)
        {
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
    } else
    {
        if (side0[0].index !== undefined)
        {
            //含索引的顶点
            for (var i = 0; i < length; i++)
            {
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
        } else
        {
            //三角形顶点
            for (var i = 0; i < length; i++)
            {
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
export function linkSides(shapes, isClosed = false, isClosed2 = false) {
    var length = isClosed2 ? shapes.length : shapes.length - 1;
    var triangles = new ArrayEx();
    for (var i = 0; i < length; i++)
    {
        triangles.push(...linkSide(shapes[i], shapes[(i + 1) % shapes.length], isClosed));
    }

    return triangles;
}

/**
 * 缝合shape 折线集合
 * @param {Array} polylines  路基 点集的集合， 
 * @returns {Array} 返回三角形集合 如果有所用范围索引，否则返回顶点
 */
export function linkPolyline(polylines) {
    return linkSides(polylines, false);
}

/**
 * 缝合shape 多边形集合
 * @param {Array} polygon
 * @returns {Array} 返回三角形集合 如果有所用范围索引，否则返回顶点
 */
export function linkPloygon(polygon) {
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
export function extrude(shape, arg_path, options = {}) {
    options = {
        isClosed: false,
        isClosed2: false,
        textureEnable: true,
        textureScale: new Vector2(1, 1),
        smoothAngle: Math.PI / 180 * 30,
        sealStart: false,
        sealEnd: false,
        ...options
    }
    var normal = options.normal || recognitionPolygonNormal(shape);

    var startSeal = clone(shape);

    var shapepath = new Path(shape);
    var insertNum = 0;
    for (let i = 1; i < shapepath.length - 1; i++)
    { //大角度插入点
        if (Math.acos(shapepath[i].direction.dot(shapepath[i + 1].direction)) > options.smoothAngle)
            shape.splice(i + insertNum++, 0, shapepath[i].clone());
    }

    if (options.isClosed)
    {   //大角度插入点
        var dir1 = shapepath.get(-1).clone().sub(shapepath.get(-2)).normalize();
        var dir2 = shapepath[0].clone().sub(shapepath.get(-1)).normalize();
        if (Math.acos(dir1.dot(dir2)) > options.smoothAngle);
        shape.push(shape.get(-1).clone());

        //新加起始点纹理拉伸
        shape.unshift(shape[0].clone());
    }


    let path = arg_path;
    if (!(path instanceof Path) && path instanceof Array)
        path = new Path(arg_path);

    const shapeArray = [];


    for (let i = 0; i < path.length; i++)
    {
        const node = path[i];
        var dir = node.direction;
        var newShape = clone(shape);
        rotateByUnitVectors(newShape, normal, dir);
        translate(newShape, node);
        shapeArray.push(newShape);
    }

    const index = { index: 0 };
    var vertices = shapeArray.flat(2);
    indexable(vertices, index);
    var triangles = linkSides(shapeArray, options.isClosed, options.isClosed2);
    shapepath = new Path(shape);
    var uvs = [];

    for (let i = 0; i < path.length; i++)
    {
        for (let j = 0; j < shapepath.length; j++)
        {
            uvs.push(shapepath[j].tlen * options.textureScale.x, path[i].tlen * options.textureScale.y);
        }
    }


    var sealUv = clone(startSeal);
    if (normal.dot(Vector3.UnitZ) < 1 - 1e-4)
        rotateByUnitVectors(sealUv, normal, v3(0, 0, 1))

    var endSeal = clone(startSeal);
    rotateByUnitVectors(startSeal, normal, path[0].direction);
    translate(startSeal, path[0])
    rotateByUnitVectors(endSeal, normal, path.get(-1).direction);
    translate(endSeal, path.get(-1));

    var sealStartTris = triangulation(sealUv, [], { normal })
    if (options.sealStart)
        indexable(startSeal, index);
    if (options.sealEnd)
        indexable(endSeal, index);
    var sealEndTris = []
    var hasVLen = vertices.length;
    if (options.sealStart)
        for (let i = 0; i < sealStartTris.length; i++)
        {
            sealStartTris[i] += hasVLen;
        }
    if (options.sealEnd && !options.sealStart)
        for (let i = 0; i < sealStartTris.length; i++)
        {
            sealEndTris[i] = sealStartTris[i] + hasVLen;
        }
    if (options.sealEnd && options.sealStart)
        for (let i = 0; i < sealStartTris.length; i++)
        {
            sealEndTris[i] = sealStartTris[i] + startSeal.length;
        }

    if (options.sealStart)
    {
        vertices.push(...startSeal);
        triangles.push(...sealStartTris);
        for (let i = 0; i < sealUv.length; i++)
            uvs.push(sealUv[i].x, sealUv[i].y);
    }

    if (options.sealEnd)
    {
        vertices.push(...endSeal);
        triangles.push(...sealEndTris);
        for (let i = 0; i < sealUv.length; i++)
            uvs.push(sealUv[i].x, sealUv[i].y);
    }

    return {
        vertices,
        triangles,
        uvs
    };

}

