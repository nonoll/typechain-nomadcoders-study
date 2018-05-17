import * as CryptoJS from "crypto-js";

class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    constructor(index: number, hash: string, previousHash: string, data: string, timestamp: number) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }

    static calculateBlockHash = (index: number, previousHash: string, timestamp: number, data: string): string => {
        return CryptoJS.SHA256(index + previousHash + timestamp + data).toString();
    }

    static validateStructure = (aBlock: Block): boolean => {
        return (
                'number' === typeof aBlock.index &&
                'string' === typeof aBlock.hash &&
                'string' === typeof aBlock.previousHash &&
                'string' === typeof aBlock.data &&
                'number' === typeof aBlock.timestamp
        );
    }
}

const genesisBlock: Block = new Block(0, '20202020', '', 'genesisBlock', Math.round(+new Date() / 1000));

let blockchain: [Block] = [genesisBlock];

const getBlockchain = (): Block[] => blockchain;
const getLatestBlock = (): Block => blockchain[blockchain.length - 1];
const getNewTimeStamp = (): number => Math.round(+new Date() / 1000);

const createNewBlock = (data: string): Block => {
    const previousBlock: Block = getLatestBlock();
    const newIndex: number = previousBlock.index + 1;
    const newTimeStamp: number = getNewTimeStamp();
    const nextHash: string = Block.calculateBlockHash(newIndex, previousBlock.hash, newTimeStamp, data);
    const newBlock: Block = new Block(newIndex, nextHash, previousBlock.hash, data, newTimeStamp);
    
    addBlock(newBlock);

    return newBlock;
};

const getHashForBlock = (aBlock: Block) => {
    return Block.calculateBlockHash(aBlock.index, aBlock.previousHash, aBlock.timestamp, aBlock.data);
};

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
    if (!Block.validateStructure(previousBlock)) {
        return false;
    }

    if (!Block.validateStructure(candidateBlock)) {
        return false;
    } else if (candidateBlock.index !== previousBlock.index + 1) {
        return false;
    } else if (candidateBlock.previousHash !== previousBlock.hash) {
        return false;
    } else if (getHashForBlock(candidateBlock) !== candidateBlock.hash) {
        return false;
    }

    return true;
};

const addBlock = (candidateBlock: Block): void => {
    if (isBlockValid(candidateBlock, getLatestBlock())) {
        blockchain.push(candidateBlock);
    }
}

console.log(`BlockChains :  ${blockchain}`);
console.log(`getBlockchain :  ${getBlockchain()}`);
console.log(`getLatestBlock :  ${getLatestBlock()}`);
console.log(`getNewTimeStamp :  ${getNewTimeStamp()}`);

let first = createNewBlock('first');
let second = createNewBlock('second');

console.log(isBlockValid(first, genesisBlock));
console.log(isBlockValid(second, first));
console.log(blockchain);

export {}