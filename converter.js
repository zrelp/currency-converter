const Web3 = require('web3');
const { ethers } = require('ethers');

// Initialize Web3 provider for Ethereum
const ethereumProvider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/3e6d2754ca154446a211dfdaaf16cb79');
const ethereumWeb3 = new Web3(ethereumProvider);

// Initialize Web3 provider for Polygon
const polygonProvider = new Web3.providers.HttpProvider('https://polygon-rpc.com/');
const polygonWeb3 = new Web3(polygonProvider);

// Initialize USDT contract on Ethereum
const ethereumUsdtAddress = '0xdac17f958d2ee523a2206206994597c13d831ec7'; // Example USDT address on Ethereum
const ethereumUsdtAbi = [/* USDT ABI */];
const ethereumUsdtContract = new ethereumWeb3.eth.Contract(ethereumUsdtAbi, ethereumUsdtAddress);

// Initialize USDT contract on Polygon
const polygonUsdtAddress = '0xc2132d05d31c914a87c6611c10748aeb04b58e8f'; // Example USDT address on Polygon
const polygonUsdtAbi = [/* USDT ABI */];
const polygonUsdtContract = new polygonWeb3.eth.Contract(polygonUsdtAbi, polygonUsdtAddress);

async function convertToUsdt(amount, network) {
    let usdtContract, web3;
    if (network === 'ethereum') {
        usdtContract = ethereumUsdtContract;
        web3 = ethereumWeb3;
    } else if (network === 'polygon') {
        usdtContract = polygonUsdtContract;
        web3 = polygonWeb3;
    } else {
        throw new Error('Invalid network');
    }

    // Get current exchange rate for ETH/USDT or MATIC/USDT
    const [rateError, rate] = await handle(web3.eth.getRate());
    if (rateError) throw new Error('Failed to get exchange rate');

    // Convert amount to USDT
    const usdtAmount = amount * rate;

    return usdtAmount;
}

// Utility function to handle promise rejections
async function handle(promise) {
    try {
        const data = await promise;
        return [null, data];
    } catch (error) {
        return [error, null];
    }
}

module.exports = {
    convertToUsdt
};
