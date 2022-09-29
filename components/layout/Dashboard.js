import Button from "../input/Button"
import { ArrowRightOutlined } from "@ant-design/icons"
import { useEffect, useState } from "react"
import { Image } from "antd"
import { queryTotalIDO } from "../../libs/nebulaClient"
import { openNotification } from "../ulti/Notification"
import IDOListView from "../data_view/IDOListView"
import Link from 'next/link'
import { chainData } from "../../data/chainData"

// const api = "https://bbe7-2402-800-6105-9fe0-7f7c-d155-4db1-fcac.ap.ngrok.io/"

const style = {
    container: {
        padding: "3em 5em",
        textAlign: 'center',
        backgroundColor: "rgb(255, 255, 255, 0.5)",
        width: "100%",
        borderRadius: "30px",
        position: "relative",
        fontSize: '24px',
        fontWeight: 'bold',
        boxShadow: "0px 0px 20px 2px rgba(0, 0, 0, 0.25)",
        color: 'white'
    },
    row: {
        padding: "3em 5em",
        textAlign: 'center',
        backgroundColor: "rgb(255, 255, 255, 0.3)",
        borderRadius: "30px",
        fontSize: '16px',
        fontWeight: 'bold',
        aspectRatio: '1/1',
        color: 'white',
        width: '100%',
    }
}

const Dashboard = () => {
    const [idos, setIDOs] = useState([])

    useEffect(() => {
        (async () => {
            try {
                const res = await queryTotalIDO(chainData[0].api)
                res.idos && setIDOs([...res.idos])
            }
            catch (e) {
                openNotification('error', e.message)
            }
        })()
    }, [])

    const getIDOs = () => {
        const idosJSX = idos.map((ido, index) => {
            return (
                <Link
                    href={`/ido/${ido.project_id}`}
                    key={index}
                >
                    <div
                        style={style.row}
                    >
                        <IDOListView
                            id={ido.project_id}
                        />
                    </div>
                </Link>
            )
        })
        return idosJSX
    }

    return (
        <div>
            <div
                style={style.container}
            >
                <p
                    style={{
                        fontSize: '24px'
                    }}
                >
                    Create IDO
                </p>
                <p
                    style={{
                        fontSize: '18px'
                    }}
                >
                    Create your first Initial Dex Offerings with us
                </p>
                <Button
                    text={(
                        <div>
                            CREATE IDO <ArrowRightOutlined />
                        </div>
                    )}
                    type={'link'}
                    url={'/create-ido'}
                    style={{
                        backgroundColor: "transparent",
                        border: 0,
                        fontSize: '18px',
                        fontWeight: 400
                    }}
                />
            </div>
            <div
                style={{
                    ...style.container,
                    marginTop: '30px',
                    padding: '2em',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '20px'
                }}
            >
                {
                    idos.length > 0 && getIDOs()
                }
            </div>
        </div>
    )
}

export default Dashboard