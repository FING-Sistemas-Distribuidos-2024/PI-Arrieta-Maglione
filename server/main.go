package main

import (
	"log"
	"os"
	"server/server"
)

func main() {
	// Initialize an http server
	server, err := server.New(os.Getenv("PORT"))
	if err != nil {
		log.Fatal(err)
	}

	// Start server
	server.Start()
}
