package game

import (
  "log"
  "time"
  "math"

  "../vector"
)

type GameManager struct {
    players map[string]*Player
}

func NewGameManager() *GameManager {
    return &GameManager{
        players: map[string]*Player{},
    }
}


func (gm *GameManager) ProcessEvent(playerId string, event *Event) []*ResponseEvent {
    response := []*ResponseEvent{}

    switch event.Event {
        case "JOIN_GAME":
            response = gm.joinGame(playerId, event)
        case "SET_RELATIVE_POSITION":
            response = gm.setPlayerRelativePosition(playerId, event)
    }

    return response
}

func (gm *GameManager) UnregisterPlayer(clientId string) []*ResponseEvent {
    if _, ok := gm.players[clientId]; ok {
        delete(gm.players, clientId)
    }

    return []*ResponseEvent{
        &ResponseEvent {
            BroadcastType: BROADCAST_ALL,
            Event: &Event {
                Event: "PLAYER_LEFT",
                Data: map[string]interface{} {
                    "id": clientId,
                },
            },
        },
    }
}

func (gm *GameManager) setPlayerRelativePosition(playerId string, event *Event) []*ResponseEvent {
    if _, ok := gm.players[playerId]; !ok {
        log.Println(event.Event, "Unknown Player")
        return nil
    }
    relX, ok := event.getFloat("x");
    if !ok {
        log.Println(event.Event, "'X' param not provided")
        return nil
    }

    relY, ok := event.getFloat("y");
    if !ok {
        log.Println(event.Event, "'Y' param not provided")
        return nil
    }

    player := gm.players[playerId]

    x := player.x + relX
    y := player.y + relY

    // Move
    if player.anticheatMoveRefTime.IsZero() {
      player.anticheatMoveRefTime = time.Now().Add(-1 * time.Second)
    }
    elapsedTime := time.Since(player.anticheatMoveRefTime)
    distance := math.Sqrt((x - player.x) * (x - player.x) + (y - player.y) * (y - player.y))

    // Min is Speed / 6 because we client process input at 150ms interval
    allowedDistance := math.Min(float64(player.speed) / 6, float64(player.speed) * elapsedTime.Seconds())
    player.anticheatMoveRefTime = time.Now()

    tolerance := 1.01
    if distance > allowedDistance * tolerance {
        log.Printf(
          "[Warning] Illegal move detected ! (Incorrect Dist/S) [%s] %b > %b",
          player.username,
          distance,
          allowedDistance,
        )

        // Recalculate the correct position
        translation := vector.New(relX, relY).Normalize().MultiplyScalar(allowedDistance)
        // TODO: REMOVE ME: LATE CLIENT SIMULATION
        translation = translation.MultiplyScalar(1.2)

        position := vector.New(player.x, player.y).Add(translation)

        player.x = position.X
        player.y = position.Y

    } else {
      // Legal move :)
      player.x = x
      player.y = y
    }


    return []*ResponseEvent{
        &ResponseEvent {
            BroadcastType: BROADCAST_ALL,
            // ClientBroadcast: map[string]bool{
            //     playerId: true,
            // },
            Event: &Event {
                Event: "PLAYER_POSITION_UPDATE",
                Data: map[string]interface{} {
                    "playerId": player.id,
                    "x": player.x,
                    "y": player.y,
                },
            },
        },
    }
}

func (gm *GameManager) joinGame(playerId string, event *Event) []*ResponseEvent {
    // Param validation
    username, ok := event.getString("username")
    if !ok {
        log.Println(event.Event, "'username' param not provided")
        return nil
    }
    log.Println("New player:", username)

    // Ensure the player is not registered yet
    if _, ok := gm.players[playerId]; ok {
        return  nil
    }

    // Register user

    player := NewPlayer(playerId, username)
    player.SetPosition(200, 42)
    player.SetSpeed(200) // Default speed
    gm.players[playerId] = player

    playerData := player.Serialize(false)
    snapshot := gm.createSnapshot()

    // Response
    return []*ResponseEvent{
        &ResponseEvent {
            BroadcastType: BROADCAST_LIST,
            ClientBroadcast: map[string]bool{
                playerId: true,
            },
            Event: &Event {
                Event: "JOINED_GAME",
                Data: map[string]interface{} {
                    "playerId": player.id,
                    "snapshot": snapshot,
                },
            },
        },
        &ResponseEvent {
            BroadcastType: BROADCAST_ALL,
            ClientBroadcast: map[string]bool{
                playerId: false,
            },
            Event: &Event {
                Event: "NEW_PLAYER",
                Data: playerData,
            },
        },
    }
}

func (gm GameManager) createSnapshot() map[string]interface{} {
    serializedPlayers := []map[string]interface{} {}

    for _, player := range gm.players {
        serializedPlayers = append(
             serializedPlayers,
             player.Serialize(false),
        )
    }
    return map[string]interface{} {
        "players": serializedPlayers,
    }
}
