package server

import (
	"log"
	"net/http"
	"os"
	"server/redisHelper"
	"time"

	"github.com/go-chi/chi"
	"github.com/redis/go-redis/v9"
)

type Server struct {
	server *http.Server
}

// Inicializamos el servidor y montamos los endpoints
func New(port string) (*Server, error) {
	r := chi.NewRouter()

	log.Printf("Conectando a redis en %s", os.Getenv("REDIS_ADDR"))
	appRouter := Router{rbd: redisHelper.NewRedisHelper(
		redis.NewClient(
			&redis.Options{
				Addr:     os.Getenv("REDIS_ADDR") + "6379",
				Password: os.Getenv("REDIS_PASSWORD"),
			},
		),
		"status")}

	r.Mount("/", appRouter.Routes())

	serv := &http.Server{
		Addr:              ":" + port,
		Handler:           r,
		ReadTimeout:       100 * time.Second,
		WriteTimeout:      100 * time.Second,
		TLSConfig:         nil,
		ReadHeaderTimeout: 100 * time.Second,
		IdleTimeout:       100 * time.Second,
		MaxHeaderBytes:    1000,
		TLSNextProto:      nil,
		ConnState:         nil,
		ErrorLog:          nil,
		BaseContext:       nil,
		ConnContext:       nil,
	}

	//Construimos un server inicializado con el que acabamos de crear
	server := Server{server: serv}
	return &server, nil
}

func (serv *Server) Start() {
	log.Printf("Servidor corriendo")
	log.Fatal(serv.server.ListenAndServe())
}
