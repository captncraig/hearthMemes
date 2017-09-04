FROM golang:1.9 AS build-env
WORKDIR /go/src/github.com/captncraig/hearthMemes
ADD . .
RUN go install .

FROM ubuntu:xenial
COPY --from=build-env /go/bin/hearthMemes /usr/local/bin
RUN apt-get update
RUN apt-get install -y ca-certificates
EXPOSE 8080
CMD hearthMemes