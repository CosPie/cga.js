import { ArrayEx } from "../data/ArrayEx";

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

    distancePoint(point) {

    }

    distanceLine(line) {

    }

    distanceRay(ray) {

    }

    distanceSegment(segment) {

    }

    //
    containPoint(point) {

    }
}

export { Triangle };