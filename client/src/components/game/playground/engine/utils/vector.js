class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  equals (vecB) {
    return (this.x == vecB.x && this.y == vecB.y);
  }

  almostEquals (vecB, tolerance) {
    return (
      vecB.x > this.x - tolerance && vecB.x < this.x + tolerance
      && vecB.y > this.y - tolerance && vecB.y < this.y + tolerance
    );
  }

  add (vecB) {
    return new Vector2(this.x + vecB.x, this.y + vecB.y)
  }

  substract (vecB) {
    return new Vector2(this.x - vecB.x, this.y - vecB.y)
  }

  multiply (vecB) {
    return new Vector2(this.x * vecB.x, this.y * vecB.y)
  }

  divide (vecB) {
    return new Vector2(this.x / vecB.x, this.y / vecB.y)
  }

  multiply (vecB) {
    return new Vector2(this.x * vecB.x, this.y * vecB.y)
  }

  divideScalar (scalar) {
    return new Vector2(this.x / scalar, this.y / scalar)
  }

  multiplyScalar (scalar) {
    return new Vector2(this.x * scalar, this.y * scalar)
  }

  static distance (vecB) {
    return Math.sqrt(
      (vecB.x - this.x) * (vecB.x - this.x)
      + (vecB.y - this.y) * (vecB.y - this.y)
    );
  }

  magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalize () {
    const magn = this.magnitude()
    if (magn == 0 || magn == 1) { return this }
    return this.divideScalar(magn);
  }

  moveTo (dest, dist) {
    let direction = dest.substract(this).normalize()

    if (!direction.x && !direction.y) { return this; }

//    direction = direction.divideScalar(direction.x + direction.y)
    const translation = direction.multiplyScalar(dist);
    console.log(direction, direction.magnitude());
    const moved = this.add(translation);

    // Limit the move to the destination point to not go further
    if (this.x < dest.x && moved.x > dest.x) {
      moved.x = dest.x
    } else if (this.x > dest.x && moved.x < dest.x) {
      moved.x = dest.x
    }

    if (this.y < dest.y && moved.y > dest.y) {
      moved.y = dest.y
    } else if (this.y > dest.y && moved.y < dest.y) {
      moved.y = dest.y
    }

    return moved;
  }

  lerp (dist, percent) {
    if (percent == 0) { return this; }
    return this.add(dist.substract(this).multiplyScalar(percent));
  }

}

export default Vector2;
