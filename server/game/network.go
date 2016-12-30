package game

import "../vector"

const (
    BROADCAST_LIST  = 20
    BROADCAST_ALL   = 30
)

type ClientMessage struct {
	ClientId string
	Message []byte
}


type Event struct {
    Event string `json:"event"` // Type
    Data map[string]interface{} `json:"data"` // Data
}

type ResponseEvent struct {
    BroadcastType int
    ClientBroadcast map[string]bool
    Event *Event
}

func (e Event) getString(key string) (string, bool) {
    value, ok := e.Data[key].(string)
    return value, ok
}

func (e Event) getInt(key string) (int, bool) {
    if _, ok := e.Data[key]; !ok {
        return 0, false
    }
    value := int(e.Data[key].(float64))
    return value, true
}

func (e Event) getFloat(key string) (float64, bool) {
    if _, ok := e.Data[key]; !ok {
        return 0, false
    }
    value := e.Data[key].(float64)
    return value, true
}

func (e Event) getVector2(key string) (vector.Vector2, bool) {
  vec, ok := e.Data[key].(map[string]interface{})
  if !ok { return vector.Zero(), false }
  if _, ok := vec["x"]; !ok { return vector.Zero(), false}
  if _, ok := vec["y"]; !ok { return vector.Zero(), false}

  x := vec["x"].(float64)
  y := vec["y"].(float64)

  return vector.New(x, y), true
}

func NewClientMessage(clientId string, message []byte) *ClientMessage {
    return &ClientMessage{
        ClientId: clientId,
        Message: message,
    }
}
