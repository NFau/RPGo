package game

import "time"

type Player struct {
    // Unique player identifier
    id string

    // Player username
    username string

    // Position of the player on x axis

    x float64

    // Position of the player on x axis
    y float64

    speed int

    anticheatMoveRefTime time.Time
    anticheatMoveDistance float64
}

func NewPlayer(id string, username string) *Player {
    return &Player{
        id: id,
        username: username,
    }
}

func (p *Player) SetPosition(x float64, y float64) {
    p.x = x
    p.y = y
}

func (p *Player) SetSpeed(speed int) {
  p.speed = speed
}

func (p Player) Serialize(withPrivateData bool) map[string]interface{} {
  data := map[string]interface{} {
      "id": p.id,
      "username": p.username,
      "x": p.x,
      "y": p.y,
      "speed": p.speed,
  }
  if withPrivateData {
    data["private"] = "FakePrivate"
  }
  return data
}
