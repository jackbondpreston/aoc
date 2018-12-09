const fs = require("fs");

function mod(n: number, m: number): number {
    return ((n % m) + m) % m;
}

interface BoardNode<T> {
    prev: BoardNode<T> | null,
    data?: T,
    next: BoardNode<T> | null
}

// doubly linked "board"
class Board<T> {
    private head: BoardNode<T>;
    private tail: BoardNode<T>;

    private current: BoardNode<T> | null;

    constructor() {
        this.head = {
            prev: null,
            next: this.tail
        };
        this.tail = {
            prev: this.head,
            next: null
        }

        this.current = null;
    }

    isEmpty(): boolean {
        return this.head.next == this.tail;
    }

    insertAfter(data: T): Board<T> {
        let next: BoardNode<T>;
        let prev: BoardNode<T>;

        if (this.current == null) {
            next = this.tail;
            prev = this.head;
        }
        else {
            next = this.current.next;
            prev = this.current;
        }

        this.current = {
            prev: prev,
            data: data,
            next: next
        };
        this.current.prev.next = this.current;
        this.current.next.prev = this.current;

        return this;
    }

    removeCurrent(): T {
        let data: T = this.current.data;

        this.current.prev.next = this.current.next;
        this.current.next.prev = this.current.prev;

        if (this.isEmpty()) this.current = null;
        else this.next();

        return data;
    }

    next(): Board<T> {
        if (this.current == null) return this;

        this.current = this.current.next;
        if (this.current == this.tail) this.current = this.head.next;

        return this;
    }

    prev(): Board<T> {
        if (this.current == null) return this;

        this.current = this.current.prev;
        if (this.current == this.head) this.current = this.tail.prev;

        return this;
    }

    moveBy(amount: number): Board<T> {
        if (amount > 0) {
            for (let i = 0; i < amount; i++) {
                this.next();
            }
        }
        if (amount < 0) {
            amount = Math.abs(amount);
            for (let i = 0; i < amount; i++) {
                this.prev();
            }
        }

        return this;
    }

    toString(): string {
        let output: string = "[ ";

        if (this.current != null) {
            let node: BoardNode<T> = this.head;

            while (node.next != this.tail) {
                node = node.next;

                if (node == this.current) {
                    output += "(" + node.data + "), ";
                }
                else {
                    output += node.data + ", ";
                }
            }
            output = output.slice(0, -2);
        }
    
        output += " ]";
    
        return output;
    }
}

interface Players {
    scores: Array<number>;
    currentPlayer: number;
}

class Game {
    private board: Board<number>;
    private roundNo: number;
    private players: Players;

    constructor(numPlayers: number) {
        this.players = {
            scores: Array(numPlayers).fill(0),
            currentPlayer: 0
        }

        this.board = new Board<number>();
        this.roundNo = 0;
    }

    private nextTurn(): void {
        let points: number = 0;

        if (this.roundNo % 23 === 0 && this.roundNo > 0) {
            points = this.roundNo + this.board.moveBy(-7).removeCurrent();
        }
        else {
            this.board.next().insertAfter(this.roundNo);
        }

        this.roundNo++;

        this.players.scores[this.players.currentPlayer] += points;
        this.players.currentPlayer = (this.players.currentPlayer + 1) % this.players.scores.length;
    }

    runUntil(round: number): Game {
        while (this.roundNo <= round) {
            this.nextTurn();
        }

        return this;
    }

    getHighScore(): number {
        return Math.max(... this.players.scores);
    }
}

let input: string = fs.readFileSync("inputs.txt", "utf8");
let numPlayers: number = Number(input.split(' ')[0]);
let lastRound: number = Number(input.split(' ')[6]);

let game: Game = new Game(numPlayers);

console.log(game.runUntil(lastRound).getHighScore());
console.log(game.runUntil(lastRound * 100).getHighScore());