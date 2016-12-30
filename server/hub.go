// Copyright 2013 The Gorilla WebSocket Authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package main

import "log"
import "encoding/json"

import "./game"

// hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan game.ClientMessage

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	gameManager *game.GameManager
}

func newHub(gm *game.GameManager) *Hub {
	return &Hub{
		broadcast:  	make(chan game.ClientMessage),
		register:  		make(chan *Client),
		unregister: 	make(chan *Client),
		clients:    	make(map[*Client]bool),
		gameManager: 	gm,
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			log.Println("New client")
			h.clients[client] = true
		case client := <-h.unregister:
			log.Println("Client disconnected")
			if _, ok := h.clients[client]; ok {
				h.disconnectClient(client)
			}
		case clientMessage := <-h.broadcast:
			playerId := clientMessage.ClientId

		    event := &game.Event{}
		    if err := json.Unmarshal(clientMessage.Message, &event); err != nil {
					log.Println("Unmarshal message", err)
					continue
				}

			responseEvents := h.gameManager.ProcessEvent(playerId, event)
			h.sendResponseEvent(responseEvents)
		}
	}
}

func (h *Hub) sendResponseEvent(responseEvents []*game.ResponseEvent) {
	for _, responseEvent := range responseEvents {
		message, err := json.Marshal(responseEvent.Event)
		if err != nil {
			log.Println("Marshal:", err)
		}
		for client := range h.clients {
			forwardMessage := false
			if broadcast, ok := responseEvent.ClientBroadcast[client.id]; ok {
				// If the clientId is specified in the ClientBroadcast map,
				// use the defined policy
				forwardMessage = broadcast
			} else {
				if responseEvent.BroadcastType == game.BROADCAST_ALL {
					forwardMessage = true
				}
			}

			if forwardMessage {
				select {
				case client.send <- message:
				default:
					h.disconnectClient(client)
				}
			}
		}
	}
}

func (h *Hub) disconnectClient(client *Client) {
	close(client.send)
	delete(h.clients, client)
	notifications := h.gameManager.UnregisterPlayer(client.id)
	h.sendResponseEvent(notifications)
}
