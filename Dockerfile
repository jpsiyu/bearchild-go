FROM golang:alpine 


# Fetch dependencies and install git.
RUN apk update && apk add --no-cache git

# Copy files
ENV ProjPath=${GOPATH}/github.com/jpsiyu/bearchild-go

WORKDIR ${ProjPath}
COPY ./server ${ProjPath}/server
COPY ./dist ${ProjPath}/dist

#WORKDIR /go/src/app
#COPY ./server ./server
#COPY ./dist ./dist

# Fetch dependencies using go get
WORKDIR ${ProjPath}/server
RUN go get -d -v

# Build go app
WORKDIR ${ProjPath}
RUN go build -o appstart ./server/

# Check files
RUN pwd && ls -l

EXPOSE 80

CMD ["./appstart"]