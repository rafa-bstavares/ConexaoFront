import { Socket, io } from "socket.io-client";


interface ServerToClientEvents {
    serverMsg: (data: {msg: string, room: string}) => void,
    novaSala: (data: {newRoom: string, createdById: string, idProfissional: number}) => void,
    novaMensagem: (data: {novoHistorico: string}) => void,
    mudStatus: (data: {status: string, id: number}) => void,
    salaEncerrada: (data: {msg: string, idSala: string}) => void,
    precoTempoServMsg: (data: {preco: number, tempo: number}) => void,
    erroMsg: (data: {erroMsg: ""}) => void,
    clienteChamando: (data: {idProfissional: number, nomeCliente: string, idCliente: number}) => void,
    respostaAtendente: (data: {msg: string, idCliente: number, idProfissional: number}) => void
}

interface ClientToServerEvents {
    acionaMudStatus: (data: {status: string, id: number}) => void,
    clientMsg: (data: {msg: string, room: string}) => void,
    adicionarNaSala: (data: {room: string}) => void,
    tempoPreco: (data: {tempo: number, preco: number, room: string}) => void,
    chamarAtendente: (data: {idProfissional: number, nomeCliente: string, idCliente: number}) => void,
    respostaChamarAtendente: (data: {msg:  string, idCliente: number, idProfissional: number}) => {}
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://167.88.32.149:8080")