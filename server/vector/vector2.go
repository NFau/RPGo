package vector

import "math"

type Vector2 struct {
	X float64
	Y float64
}

func New(x, y float64) Vector2 {
	return Vector2{x, y}
}

func Zero() Vector2 {
	return Vector2{0, 0}
}

func Unit() Vector2 {
	return Vector2{1, 1}
}

func (v Vector2) Add(v2 Vector2) Vector2 {
	return Vector2{v.X + v2.X, v.Y + v2.Y}
}

func (v Vector2) Subtract(v2 Vector2) Vector2 {
	return Vector2{v.X - v2.X, v.Y - v2.Y}
}

func (v Vector2) Multiply(v2 Vector2) Vector2 {
	return Vector2{v.X * v2.X, v.Y * v2.Y}
}

func (v Vector2) Divide(v2 Vector2) Vector2 {
	return Vector2{v.X / v2.X, v.Y / v2.Y}
}

func (v Vector2) MultiplyScalar(s float64) Vector2 {
	return Vector2{v.X * s, v.Y * s}
}

func (v Vector2) DivideScalar(s float64) Vector2 {
	return Vector2{v.X / s, v.Y / s}
}

func (v Vector2) Distance(v2 Vector2) float64 {
  return math.Sqrt(math.Pow(v2.X - v.X, 2) + math.Pow(v2.Y - v.Y, 2))
}

func (v Vector2) Magnitude() float64 {
  return math.Sqrt(math.Pow(v.X, 2) + math.Pow(v.Y, 2))
}

func (v Vector2) Normalize() Vector2 {
  return v.DivideScalar(v.Magnitude())
}

func (v Vector2) Equals(v2 Vector2) bool {
  return v.X == v2.X && v.Y == v2.Y
}
