FROM golang:alpine 

# Fetch dependencies and install git.
RUN apk update && apk add --no-cache git

# Copy files
WORKDIR /go/src/app
COPY ./server ./server
COPY ./dist ./dist

# Fetch dependencies using go get
WORKDIR /go/src/app/server
RUN go get -d -v

# Build go app
WORKDIR /go/src/app
RUN go build -o appstart server/main.go 

# Check files
RUN pwd && ls -l

EXPOSE 80

CMD ["./appstart"]