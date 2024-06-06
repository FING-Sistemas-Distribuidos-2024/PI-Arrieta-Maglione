package models

type Vote struct {
	Team  string `json:"team"`
	Votes int    `json:"votes"`
}
