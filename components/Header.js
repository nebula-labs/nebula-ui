import FlexRow from "./flex_box/FlexRow"
import Account from "./layout/Account"
import '../styles/Header.module.css'
import Link from "next/link"
import { chainData } from "../data/chainData"

const logo = (
    <Link
        href={'/app'}
        style={{
            cursor: 'pointer'
        }}
    >
        <div
            style={{
                position: 'relative',
                margin: 'auto 0'
            }}
        >
        </div>
    </Link>
)

const Header = () => {
    const chain = chainData[0]

    return (
        <div
            className="header"
            style={{
                backgroundColor: 'transparent',
                color: '#ffffff',
                padding: '1em 10em',
                position: 'fixed',
                height: '80px',
                width: '100%',
                zIndex: 5
            }}
        >
            <FlexRow
                components={[
                    logo,
                    <FlexRow
                        components={[
                            <Account
                                chainId={chain.chain_id}
                                chainName={chain.name}
                            />
                        ]}
                        justifyContent={'space-between'}
                    />,
                ]}
                justifyContent={'space-between'}
            />
        </div>
    )
}

export default Header