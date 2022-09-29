import { StargateClient } from "@cosmjs/stargate";
import axios from "axios";
import { keplrData } from "../data/keplrData";

export const getKeplrAccount = async (chainId) => {
    if (!window.getOfflineSigner || !window.keplr) {
        alert("Keplr Wallet not detected, please install extension");
        return {
            accounts: null
        }
    } else {
        await window.keplr.experimentalSuggestChain(keplrData[0])
        await window.keplr.enable(chainId)
        const offlineSigner = window.keplr.getOfflineSigner(chainId);
        const accounts = await offlineSigner.getAccounts();
        return {
            accounts,
            offlineSigner,
        };
    }
}

export const getKey = async (chainId) => {
    if (!window.getOfflineSigner || !window.keplr) {
        alert("Keplr Wallet not detected, please install extension");
        return null
    } else {
        console.log(keplrData[0])
        await window.keplr.experimentalSuggestChain(keplrData[0])
        await window.keplr.enable(chainId)
        const account = await window.keplr.getKey(chainId);
        return account
    }
}

export const getPubkey = async (rpc, address) => {
    const client = await StargateClient.connect(rpc);
    const accountOnChain = await client.getAccount(address);
    if (!accountOnChain || !accountOnChain.pubkey) {
        throw new Error(
            "Account has no pubkey on chain, this address will need to send a transaction to appear on chain."
        );
    }
    return accountOnChain.pubkey.value;
};

export const getBalance = async (rpc, address) => {
    const client = await StargateClient.connect(rpc);
    const res = await client.getAllBalances(address)
    console.log(res)
    return res;
}

export const getBalances = async (api, address) => {
    const { data } = await axios.get(`${api}cosmos/bank/v1beta1/balances/${address}`)
    const balances = data.balances ? data.balances : []
    return balances
}

export const getAccount = async (rpc, address) => {
    const client = await StargateClient.connect(rpc);
    try {
        let account = await client.getAccount(address);

        if (!account) {
            throw new Error(
                "Account has no pubkey on chain, this address will need to send a transaction to appear on chain. (If it is newly made address please make sure to send some token to this address )"
            );
        }

        return account;
    }
    catch (e) {
        throw new Error(e.message)
    }
}

export const getSequence = async (api, address) => {
    try {
        let { data } = await axios.get(`${api}cosmos/auth/v1beta1/accounts/${address}`, {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache',
            'Expires': '0',
          })

        if (!data.account) {
            throw new Error(
                "Account has no pubkey on chain, this address will need to send a transaction to appear on chain. (If it is newly made address please make sure to send some token to this address )"
            );
        }
        return data.account;
    }
    catch (e) {
        throw new Error(e.message)
    }
}