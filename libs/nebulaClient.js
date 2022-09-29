import { nebula, getSigningNebulaClient } from "@nghuyenthevinh2000/nebulajs"
import { SigningStargateClient } from "@cosmjs/stargate";
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { chainData } from "../data/chainData";
import { getKey } from "./keplrClient"
import { coins, coin, parseCoins} from '@cosmjs/amino';
import axios from 'axios'

const {
    createProject,
    deleteProject,
    withdrawAllTokens
} = nebula.launchpad.MessageComposer.withTypeUrl

const {
    enableIDO,
    commitParticipation
} = nebula.ido.MessageComposer.withTypeUrl

const {
    AllocationLimit
} = nebula.ido

/**
 * 
 * @param {SigningStargateClient} client 
 * @param {string} chainId
 * @param {string} address
 * @param {any[]} msgs
 * @param {any} fee
 * @param {string} memo
 * @returns 
 */
const signAndBroadcast = async (
    client,
    chainId,
    address,
    msgs,
    fee,
    memo = ''
) => {
    const { accountNumber, sequence } = await client.getSequence(address);

    const txRaw = await client.sign(address, msgs, fee, memo, {
        accountNumber: accountNumber,
        sequence: sequence,
        chainId
    });
    const txBytes = TxRaw.encode(txRaw).finish();
    return await client.broadcastTx(txBytes);
};

// ============ TRANSACTION ============

export const createIDO = async(
    project_title,
    project_information,
    allocationAmount,
    allocationDenom,
    listingPrice,
    listingDenom,
    allocationLimit,
    startTime
) => {

    const offlineSigner = window.getOfflineSigner(
        chainData[0].chain_id
    );

    const signingClient = await getSigningNebulaClient({
        rpcEndpoint: chainData[0].rpc,
        signer: offlineSigner
    });

    const account = await getKey(chainData[0].chain_id)

    // phase 1: create project

    const msg_project = createProject({
        owner: account.bech32Address,
        projectTitle: project_title,
        projectInformation: project_information
    })

    const fee = {
        amount: coins(100, 'unebula'),
        gas: "200000"
    };

    let res = await signAndBroadcast(
        signingClient,
        chainData[0].chain_id,
        account.bech32Address,
        [msg_project],
        fee
    )

    // get project ID
    if (res.code != 0) {
        // return error
        throw new Error(res.rawLog)
    }

    const log = JSON.parse(res.rawLog)
    const projectId = log[0].events[1].attributes[0].value

    // phase 2: enable IDO

    const msg_ido = enableIDO({
        owner: account.bech32Address,
        projectId: projectId,
        tokenForDistribution: coins(allocationAmount, allocationDenom),
        tokenListingPrice: coins(listingPrice, listingDenom),
        allocationLimit: [AllocationLimit.fromPartial({
            denom: listingDenom,
            lowerLimit: coin(allocationLimit.min, listingDenom),
            upperLimit: coin(allocationLimit.max, listingDenom)
        })],
        startTime: startTime
    })

    console.log(msg_ido)

    res = await signAndBroadcast(
        signingClient,
        chainData[0].chain_id,
        account.bech32Address,
        [msg_ido],
        fee
    )

    if (res.code != 0) {
        // return error
        throw new Error(res.rawLog)
    }

    return res
}

export const participate = async (
    projectId,
    tokenCommit
) => {
    const offlineSigner = window.getOfflineSigner(
        chainData[0].chain_id
    );

    const signingClient = await getSigningNebulaClient({
        rpcEndpoint: chainData[0].rpc,
        signer: offlineSigner
    });

    const account = await getKey(chainData[0].chain_id)

    const fee = {
        amount: coins(100, 'unebula'),
        gas: "200000"
    };

    const msg = commitParticipation({
        participant: account.bech32Address,
        projectId: projectId,
        tokenCommit: parseCoins(tokenCommit)
    })

    const res = await signAndBroadcast(
        signingClient,
        chainData[0].chain_id,
        account.bech32Address,
        [msg],
        fee
    )

    if (res.code != 0) {
        // return error
        throw new Error(res.rawLog)
    }

    return res
}

export const deleteProj = async (
    projectId
) => {
    const offlineSigner = window.getOfflineSigner(
        chainData[0].chain_id
    );

    const signingClient = await getSigningNebulaClient({
        rpcEndpoint: chainData[0].rpc,
        signer: offlineSigner
    });

    const account = await getKey(chainData[0].chain_id)

    const fee = {
        amount: coins(100, 'unebula'),
        gas: "200000"
    };

    const msg = deleteProject({
        owner: account.bech32Address,
        projectId: projectId
    })

    const res = await signAndBroadcast(
        signingClient,
        chainData[0].chain_id,
        account.bech32Address,
        [msg],
        fee
    )

    if (res.code != 0) {
        // return error
        throw new Error(res.rawLog)
    }

    return res
}

export const withdraw = async (
    projectId
) => {
    const offlineSigner = window.getOfflineSigner(
        chainData[0].chain_id
    );

    const signingClient = await getSigningNebulaClient({
        rpcEndpoint: chainData[0].rpc,
        signer: offlineSigner
    });

    const account = await getKey(chainData[0].chain_id)

    const fee = {
        amount: coins(100, 'unebula'),
        gas: "200000"
    };

    const msg = withdrawAllTokens({
        owner: account.bech32Address,
        projectId: projectId
    })

    const res = await signAndBroadcast(
        signingClient,
        chainData[0].chain_id,
        account.bech32Address,
        [msg],
        fee
    )

    if (res.code != 0) {
        // return error
        throw new Error(res.rawLog)
    }

    return res
}

// ============ QUERY ============

export const queryProject = async (
    api,
    projectId
) => {
    try {
        const res = await axios.get(`${api}nebula/launchpad/project/${projectId}`)
        return res.data
    }
    catch (e) {
        throw e
    }
}

export const queryTotalIDO = async (
    api
) => {
    try {
        const res = await axios.get(`${api}nebula/ido/total-ido`)
        return res.data
    }
    catch (e) {
        throw e
    }
}

export const queryIDO = async (
    api,
    projectId
) => {
    try {
        const res = await axios.get(`${api}nebula/ido/ido/${projectId}`)
        return res.data
    }
    catch (e) {
        throw e
    }
}