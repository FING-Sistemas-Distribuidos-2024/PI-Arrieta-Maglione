package server

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"server/models"
	"server/redisHelper"

	"github.com/go-chi/chi"
	"github.com/go-chi/cors"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Router struct {
	rbd *redisHelper.RedisHelper
}

func (rt *Router) AddVote(w http.ResponseWriter, r *http.Request) {
	team := chi.URLParam(r, "team")

	// Check if team already has a vote
	// If not, throw error

	_, err := rt.rbd.GetValue(team)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Increment the vote count for the team
	rt.rbd.IncreaseKey(team)

	redisMessage := models.Status{Team: team, Operation: "vote"}
	redisMessageJSON, err := json.Marshal(redisMessage)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	rt.rbd.Publish("status", string(redisMessageJSON))

	r.Header.Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
}

func (rt *Router) GetVotes(w http.ResponseWriter, r *http.Request) {
	// Get the number of votes for each team
	votes, err := rt.rbd.GetAllKeys("")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// Get the number of votes for each team
	teamVotes := make([]models.Vote, 0)
	for _, key := range votes {
		value, err := rt.rbd.GetValue(key)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		intValue, err := strconv.Atoi(value)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		teamVotes = append(teamVotes, models.Vote{Team: key, Votes: intValue})
	}

	// Return the number of votes for each team
	w.Header().Set("Content-Type", "application/json")
	votesJSON, err := json.Marshal(teamVotes)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(votesJSON)
}

func (rt *Router) CreateTeam(w http.ResponseWriter, r *http.Request) {
	team := chi.URLParam(r, "team")

	// Check if team already has a vote
	_, err := rt.rbd.GetValue(team)
	if err == nil {
		http.Error(w, "Team already exists", http.StatusBadRequest)
		return
	}

	// Create a new team
	rt.rbd.SetValue(team, 0)

	redisMessage := models.Status{Team: team, Operation: "create"}
	redisMessageJSON, err := json.Marshal(redisMessage)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	rt.rbd.Publish("status", string(redisMessageJSON))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
}

func (rt *Router) DeleteTeam(w http.ResponseWriter, r *http.Request) {
	team := chi.URLParam(r, "team")

	// Check if team already has a vote
	_, err := rt.rbd.GetValue(team)
	if err != nil {
		http.Error(w, "Team does not exist", http.StatusBadRequest)
		return
	}

	// Delete the team
	rt.rbd.DeleteKey(team)

	// Publis to channel
	redisMessage := models.Status{Team: team, Operation: "delete"}
	redisMessageJSON, err := json.Marshal(redisMessage)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	rt.rbd.Publish("status", string(redisMessageJSON))

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNoContent)
}

var clients = make([]*websocket.Conn, 0) // Slice to store all active connections

func (rt *Router) Status(w http.ResponseWriter, r *http.Request) {
	log.Println("Asking for status")
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Error upgrading WebSocket: %v", err)
		return
	}
	defer conn.Close()

	// Add the new connection to the list of clients
	clients = append(clients, conn)
	defer func() {
		// Remove the connection when it's closed
		clients = removeConn(clients, conn)
	}()

	ch := rt.rbd.Sub.Channel()
	for msg := range ch {
		broadcastMessage(clients, msg.Payload)
	}
}

func broadcastMessage(clients []*websocket.Conn, message string) {
	for _, conn := range clients {
		if err := conn.WriteMessage(websocket.TextMessage, []byte(message)); err != nil {
			log.Printf("Failed to send message: %v", err)
			// Remove the failed connection if necessary
		}
	}
}

func removeConn(clients []*websocket.Conn, conn *websocket.Conn) []*websocket.Conn {
	index := -1
	for i, c := range clients {
		if c == conn {
			index = i
			break
		}
	}
	if index != -1 {
		return append(clients[:index], clients[index+1:]...)
	}
	return clients
}
func (rt *Router) Routes() http.Handler {
	r := chi.NewRouter()

	// Basic CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:     []string{"https://*", "http://*"},
		AllowedMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:     []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:     []string{"Link"},
		AllowOriginFunc:    func(r *http.Request, origin string) bool { return true },
		AllowCredentials:   true,
		OptionsPassthrough: true,
		Debug:              true,
		MaxAge:             300,
	}))

	r.Get("/votes", rt.GetVotes)
	r.Get("/status", rt.Status)

	r.Post("/vote/{team}", rt.AddVote)
	r.Post("/team/{team}", rt.CreateTeam)

	r.Delete("/team/{team}", rt.DeleteTeam)

	return r
}
