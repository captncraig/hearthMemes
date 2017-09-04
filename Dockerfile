FROM golang:1.9 AS build-env
WORKDIR /go/src/github.com/captncraig/hearthMemes
ADD . .
RUN go build -o app
EXPOSE 8080
CMD ./app