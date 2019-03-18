package db

type DBPlayer struct {
	Uid    int   `json:"uid"`
	Create int64 `json:"create"`
}

type DBPlayerCounter struct {
	Key   string `json:"key"`
	Count int    `json:"count"`
}

type DBRecord struct {
	Uid   int `json:"uid"`
	Lv    int `json:"lv"`
	Score int `json:"score"`
}
