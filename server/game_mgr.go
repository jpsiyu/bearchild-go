package main

import (
	"log"

	"github.com/jpsiyu/bearchild-go/server/db"
)

type ClassGameMgr struct {
	playerCount int
	ranking     []db.DBRecord
}

var origin int = 1000
var rankLimit int = 5

func (mgr *ClassGameMgr) GenPlayerId() (int, int64, error) {
	uid, create, err := db.GenPlayer(mgr.getCount() + 1)
	if err != nil {
		log.Println(err)
		return 0, 0, err
	}
	if err := db.UpdatePlayerCounter(mgr.playerCount + 1); err != nil {
		log.Println(err)
		return 0, 0, err
	}

	mgr.playerCount++
	return uid, create, nil
}

func (mgr *ClassGameMgr) GetDBCount() int {
	return mgr.playerCount
}

func (mgr *ClassGameMgr) InitCount(dbCount int) int {
	mgr.playerCount = dbCount
	return mgr.getCount()
}

func (mgr *ClassGameMgr) getCount() int {
	return origin + mgr.playerCount
}

func (mgr *ClassGameMgr) AddRecord2Rank(record *db.DBRecord) {
	newRanking := []db.DBRecord{}
	inserted := false
	exist := false
	for _, r := range mgr.ranking {
		if len(newRanking) >= rankLimit {
			break
		}
		if inserted == true {
			if r.Uid != record.Uid {
				newRanking = append(newRanking, r)
			}
			continue
		}

		if r.Uid == record.Uid {
			exist = true
			if r.Score < record.Score {
				newRanking = append(newRanking, *record)
				inserted = true
			} else {
				newRanking = append(newRanking, r)
			}
			continue
		}
		if r.Score < record.Score {
			newRanking = append(newRanking, *record, r)

			inserted = true
			continue
		}
		newRanking = append(newRanking, r)
	}
	if inserted == false && exist == false && len(newRanking) < rankLimit {
		log.Println("has places")
		newRanking = append(newRanking, *record)
		log.Println(newRanking)
	}
	mgr.ranking = newRanking
}

func (mgr *ClassGameMgr) GetRank() *[]db.DBRecord {
	return &mgr.ranking
}
