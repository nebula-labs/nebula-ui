export const keplrData = [
    {
        chainId: "nebula-1",
        chainName: "nebula",
        rpc: "http://localhost:26657/",
        rest: "http://localhost:1317/",
        bip44: {
            coinType: 118,
        },
        bech32Config: {
            bech32PrefixAccAddr: "nebula",
            bech32PrefixAccPub: "nebula" + "pub",
            bech32PrefixValAddr: "nebula" + "valoper",
            bech32PrefixValPub: "nebula" + "valoperpub",
            bech32PrefixConsAddr: "nebula" + "valcons",
            bech32PrefixConsPub: "nebula" + "valconspub",
        },
        currencies: [ 
            { 
                coinDenom: "NEBULA", 
                coinMinimalDenom: "unebula", 
                coinDecimals: 6, 
                coinGeckoId: "nebula", 
            }, 
        ],
        feeCurrencies: [
            {
                coinDenom: "NEBULA",
                coinMinimalDenom: "unebula",
                coinDecimals: 6,
                coinGeckoId: "nebula",
            },
        ],
        stakeCurrency: {
            coinDenom: "NEBULA",
            coinMinimalDenom: "unebula",
            coinDecimals: 6,
            coinGeckoId: "nebula",
        },
        gasPriceStep: {
            low: 0.01,
            average: 0.025,
            high: 0.03,
        },
    }
]