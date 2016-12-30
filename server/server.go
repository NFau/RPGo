package main

import "net/http"
import "log"

import "./game"

func handlePing(w http.ResponseWriter, r *http.Request) {
    log.Println("[Request] Ping")
    w.Write([]byte("Pong"))
}

func main() {
    log.Println("Server started on 8080")

    gameManager := game.NewGameManager()
    hub := newHub(gameManager)

    go hub.run()

    http.HandleFunc("/ping", handlePing)
    http.HandleFunc("/ws", func (w http.ResponseWriter, r *http.Request) {
        handleWebsocket(hub, w, r)
    })

    err := http.ListenAndServe(":8080", nil)
    if err != nil {
        log.Fatal(err)
    }
}
