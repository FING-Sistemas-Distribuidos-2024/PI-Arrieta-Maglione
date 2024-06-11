package main

import (
	"log"
	"server/server"
)

func main() {
	// Initialize an http server
	server, err := server.New("8080")
	if err != nil {
		log.Fatal(err)
	}

	// Start server
	server.Start()
}
