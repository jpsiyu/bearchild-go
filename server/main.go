package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"

	"github.com/jpsiyu/bearchild-go/server/db"

	"github.com/gorilla/mux"
)

// init database
func initDatabase() error {
	if err := db.Connect(); err != nil {
		return errors.New(fmt.Sprintf("Database connection error: %s\n", err))
	}
	log.Println("Database connection created")

	if err := db.Ping(); err != nil {
		return errors.New(fmt.Sprintf("Ping database with error: %s\n", err))
	}
	log.Println("Ping database ok")
	return nil
}

func initGameMgr() error {
	playerCounter := db.DBPlayerCounter{}
	if err := db.GetPlayerCounter(&playerCounter); err != nil {
		return errors.New(fmt.Sprintf("Get player counter with error: %s\n", err))
	}

	gameCount := GameMgr.InitCount(playerCounter.Count)
	log.Println("Game mgr init with game count: ", gameCount)
	return nil
}

// game mgr
var GameMgr = ClassGameMgr{}

func main() {
	// set log config
	log.SetFlags(log.LstdFlags | log.Lshortfile)

	// set router
	r := mux.NewRouter()
	r.PathPrefix("/static/").Handler(http.StripPrefix("/static/", http.FileServer(http.Dir("dist/"))))
	r.HandleFunc("/uid/", HandlerGetUid).Methods("GET")
	r.HandleFunc("/rank/", HandlerGetRank).Methods("GET")
	r.HandleFunc("/updaterecord/", HandlerRecordUpdate).Methods("PUT")

	r.HandleFunc("/", HomeHandler)
	r.NotFoundHandler = http.HandlerFunc(HomeHandler)

	// init datase
	if err := initDatabase(); err != nil {
		log.Fatalln(err)
	}

	// init game mgr
	if err := initGameMgr(); err != nil {
		log.Fatalln(err)
	}

	port := 80
	log.Printf("Server listening on port %d\n", port)
	http.ListenAndServe(fmt.Sprintf(":%d", port), r)
}
