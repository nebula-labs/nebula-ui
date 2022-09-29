import { useEffect, useState } from "react"
import { Spin } from 'antd';
import Modal from "antd/lib/modal"
import FlexRow from "../flex_box/FlexRow";
import PercentageBar from "../ulti/PercentageBar";
import Button from "../input/Button";
import { openNotification, openLoadingNotification } from "../ulti/Notification";
import { useRouter } from 'next/router'
import { queryProject, queryIDO } from "../../libs/nebulaClient";
import CommitModal from "../CommitModal";
import { deleteProj, withdraw } from "../../libs/nebulaClient";
import { chainData } from "../../data/chainData";
import { getKey } from "../../libs/keplrClient";
import { coin } from '@cosmjs/amino';
import { getDenom } from "../../libs/stringConvert";

// const api = "https://bbe7-2402-800-6105-9fe0-7f7c-d155-4db1-fcac.ap.ngrok.io/"

const style = {
    container: {
        padding: "3em 2em",
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
    form: {
        padding: "2em 2em",
        textAlign: 'justify',
        backgroundColor: "rgb(255, 255, 255, 0.3)",
        width: "100%",
        borderRadius: "30px",
        position: "relative",
        fontSize: '24px',
        fontWeight: 'bold',
        boxShadow: "0px 0px 20px 2px rgba(0, 0, 0, 0.25)",
        color: 'white'
    },
}

const getTime = (timeString) => {
    const date = new Date(timeString)
    return date.getDate() + "/"
        + (date.getMonth() + 1) + "/"
        + date.getFullYear() + " "
        + date.getHours() + ":"
        + date.getMinutes() + ":"
        + date.getSeconds();
}

const IDOview = () => {
    const [ido, setIdo] = useState()
    const [project, setProject] = useState()
    const [show, setShow] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const [showWithdraw, setShowWithdraw] = useState(false)
    const router = useRouter()
    const { idoID } = router.query

    useEffect(() => {
        (async () => {
            try {
                if (!idoID) return
                const projRes = await queryProject(chainData[0].api, idoID)
                projRes.project && setProject(projRes.project)
                const idoRes = await queryIDO(chainData[0].api, idoID)

                if (idoRes.ido.total_distributed_amount[0].denom.includes("ibc/")) {
                    idoRes.ido.total_distributed_amount[0].denom = await getDenom(chainData[0].api, idoRes.ido.total_distributed_amount[0].denom)
                }

                // handling token_for_distribution is zero due to commited
                if (idoRes.ido.token_for_distribution.length == 0) {
                    const zeroDistribution = coin(0, idoRes.ido.total_distributed_amount[0].denom)
                    idoRes.ido.token_for_distribution.push(zeroDistribution)
                }else if (idoRes.ido.token_for_distribution[0].denom.includes("ibc/")) {
                    idoRes.ido.token_for_distribution[0].denom = await getDenom(chainData[0].api, idoRes.ido.token_for_distribution[0].denom)
                }
                idoRes.ido && setIdo(idoRes.ido)

                const account = await getKey(chainData[0].chain_id)

                if (idoRes.ido.ido_status == "0" && projRes.project.project_owner == account.bech32Address) {
                    setShowDelete(true)
                }

                if (idoRes.ido.ido_status == "2" && projRes.project.project_owner == account.bech32Address) {
                    setShowWithdraw(true)
                }
            }
            catch (e) {
                openNotification("error", "Fail to fetch")
            }
        })()
    }, [idoID])

    const getPercent = (value, sum) => {
        if (sum === 0) return 0
        const percent = parseFloat(value / sum)
        return percent
    }

    const getSum = () => {
        return ido.token_for_distribution &&
            ido.total_distributed_amount
            && ido.token_for_distribution.length > 0
            && ido.total_distributed_amount.length > 0 ?
            parseInt(ido.token_for_distribution[0].amount) + parseInt(ido.total_distributed_amount[0].amount) : 0
    }

    const showModal = () => {
        setShow(true)
    }

    const handleDelete = async () => {
        try {
            openLoadingNotification("open", "Deleting")

            const res = await deleteProj(ido.project_id)

            openLoadingNotification("close")
            router.push('/app')
        } catch (e) {
            openLoadingNotification("close")
            openNotification("error", e.message)
        }
    }

    const handleWithdraw = async () => {
        try {
            openLoadingNotification("open", "Withdrawing")

            const res = await withdraw(ido.project_id)

            openLoadingNotification("close")
            openNotification("success", "Withdraw successfully")
            router.push('/app')
        } catch (e) {
            openLoadingNotification("close")
            openNotification("error", e.message)
        }
    }

    const showStatus = (code) => {
        let status = "INITIAL"

        switch (code) {
            case "1":
                status = "ACTIVE"
                break
            case "2":
                status = "ENDED"
                break
        }

        return status
    }

    const handleClose = () => {
        setShow(false)
    }

    const disabled = () => {
        return !ido || ido.token_listing_price.length === 0 ? true : false
    }

    return (
        <div
            style={style.container}
        >
            {
                ido && project ? (
                    <div>
                        <p
                            style={{
                                fontSize: '24px',
                            }}
                        >
                            IDO {idoID}
                        </p>
                        <div
                            style={style.form}
                        >
                            <FlexRow
                                components={[
                                    <div
                                        style={{
                                            width: "25%",
                                            padding: ".5em 1em",
                                            backgroundColor: "black",
                                            borderRadius: "10px 0 0 10px",
                                            fontSize: "18px",
                                            textAlign: "center"
                                        }}
                                    >
                                        Project Name:
                                    </div>,
                                    <div
                                        style={{
                                            width: "75%",
                                            padding: ".5em 1em",
                                            backgroundColor: "white",
                                            borderRadius: "0 10px 10px 0",
                                            fontSize: "18px",
                                            textAlign: "left",
                                            color: "black",
                                            fontWeight: 400
                                        }}
                                    >
                                        {project.project_title}
                                    </div>
                                ]}
                                justifyContent="start"
                                style={{
                                    width: "100%",
                                    marginBottom: "20px"
                                }}
                            />
                            <FlexRow
                                components={[
                                    <div
                                        style={{
                                            width: "25%",
                                            padding: ".5em 1em",
                                            backgroundColor: "black",
                                            borderRadius: "10px 0 0 10px",
                                            fontSize: "18px",
                                            textAlign: "center"
                                        }}
                                    >
                                        Project Info:
                                    </div>,
                                    <div
                                        style={{
                                            width: "75%",
                                            padding: ".5em 1em",
                                            backgroundColor: "white",
                                            borderRadius: "0 10px 10px 0",
                                            fontSize: "18px",
                                            textAlign: "left",
                                            color: "black",
                                            fontWeight: 400
                                        }}
                                    >
                                        {project.project_information}
                                    </div>
                                ]}
                                justifyContent="start"
                                style={{
                                    width: "100%",
                                    marginBottom: "20px"
                                }}
                            />
                            <FlexRow
                                components={[
                                    <div
                                        style={{
                                            width: "25%",
                                            padding: ".5em 1em",
                                            backgroundColor: "black",
                                            borderRadius: "10px 0 0 10px",
                                            fontSize: "18px",
                                            textAlign: "center"
                                        }}
                                    >
                                        Status:
                                    </div>,
                                    <div
                                        style={{
                                            width: "75%",
                                            padding: ".5em 1em",
                                            backgroundColor: "white",
                                            borderRadius: "0 10px 10px 0",
                                            fontSize: "18px",
                                            textAlign: "left",
                                            color: "black",
                                            fontWeight: 400
                                        }}
                                    >
                                        {showStatus(ido.ido_status)}
                                    </div>
                                ]}
                                justifyContent="start"
                                style={{
                                    width: "100%",
                                    marginBottom: "20px"
                                }}
                            />
                            <FlexRow
                                components={[
                                    <div
                                        style={{
                                            width: "48%"
                                        }}
                                    >
                                        <h5
                                            style={{
                                                marginBottom: 0
                                            }}
                                        >
                                            Allocation ({ido.token_for_distribution[0].amount + ido.token_for_distribution[0].denom})
                                        </h5>
                                        <div
                                            style={{
                                                width: "100%",
                                                padding: "1em",
                                                backgroundColor: "rgb(255, 255, 255, 0.5)",
                                                borderRadius: "10px",
                                                fontSize: "18px",
                                                textAlign: "center",
                                                height: "100px",
                                                display: 'flex',
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                fontWeight: 400,
                                            }}
                                        >
                                            <PercentageBar
                                                percent={getPercent(parseInt(ido.token_for_distribution[0].amount), getSum())}
                                            />
                                        </div>
                                    </div>,
                                    <div
                                        style={{
                                            width: "48%"
                                        }}
                                    >
                                        <h5
                                            style={{
                                                marginBottom: 0
                                            }}
                                        >
                                            Distribution ({ido.total_distributed_amount[0].amount + ido.total_distributed_amount[0].denom})
                                        </h5>
                                        <div
                                            style={{
                                                width: "100%",
                                                padding: "1em",
                                                backgroundColor: "rgb(255, 255, 255, 0.5)",
                                                borderRadius: "10px",
                                                fontSize: "18px",
                                                textAlign: "center",
                                                height: "100px",
                                                display: 'flex',
                                                flexDirection: "column",
                                                justifyContent: "center",
                                                fontWeight: 400,
                                            }}
                                        >
                                            <PercentageBar
                                                percent={getPercent(parseInt(ido.total_distributed_amount[0].amount), getSum())}
                                            />
                                        </div>
                                    </div>
                                ]}
                                justifyContent="space-between"
                                style={{
                                    width: "100%",
                                    marginBottom: "20px"
                                }}
                            />
                            <FlexRow
                                components={[
                                    <div
                                        style={{
                                            width: "25%",
                                            padding: ".5em 1em",
                                            backgroundColor: "black",
                                            borderRadius: "10px 0 0 10px",
                                            fontSize: "18px",
                                            textAlign: "center"
                                        }}
                                    >
                                        Start Time:
                                    </div>,
                                    <div
                                        style={{
                                            width: "75%",
                                            padding: ".5em 1em",
                                            backgroundColor: "white",
                                            borderRadius: "0 10px 10px 0",
                                            fontSize: "18px",
                                            textAlign: "left",
                                            color: "black",
                                            fontWeight: 400
                                        }}
                                    >
                                        {getTime(ido.start_time)}
                                    </div>
                                ]}
                                justifyContent="start"
                                style={{
                                    width: "100%",
                                    marginBottom: "50px"
                                }}
                            />
                            <Button
                                text={(
                                    <div>
                                        Participate
                                    </div>
                                )}
                                clickFunction={showModal}
                                style={{
                                    backgroundImage: "linear-gradient(92.29deg, #005EB3 0%, #8F63CA 100%)",
                                    border: 0,
                                    borderRadius: '10px',
                                    fontSize: '18px',
                                    fontWeight: 400,
                                    padding: '.5em 1em',
                                    width: '100%',
                                    marginBottom: "50px"
                                }}
                                disable={disabled()}
                            />
                            {
                                showDelete ? (
                                    <Button
                                        text={(
                                            <div>
                                                Delete
                                            </div>
                                        )}
                                        clickFunction={handleDelete}
                                        style={{
                                            backgroundImage: "linear-gradient(92.29deg, #005EB3 0%, #8F63CA 100%)",
                                            border: 0,
                                            borderRadius: '10px',
                                            fontSize: '18px',
                                            fontWeight: 400,
                                            padding: '.5em 1em',
                                            width: '100%'
                                        }}
                                    />
                                ) : (
                                    <></>
                                )
                            }
                            {
                                showWithdraw ? (
                                    <Button
                                        text={(
                                            <div>
                                                Withdraw
                                            </div>
                                        )}
                                        clickFunction={handleWithdraw}
                                        style={{
                                            backgroundImage: "linear-gradient(92.29deg, #005EB3 0%, #8F63CA 100%)",
                                            border: 0,
                                            borderRadius: '10px',
                                            fontSize: '18px',
                                            fontWeight: 400,
                                            padding: '.5em 1em',
                                            width: '100%'
                                        }}
                                    />
                                ) : (
                                    <></>
                                )
                            }
                        </div>
                    </div>
                ) : (
                    <div
                        style={{
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center"
                        }}
                    >
                        <Spin
                            size="large"
                        />
                    </div>
                )

            }
            <Modal
                visible={show}
                footer={null}
                closable={false}
                onCancel={handleClose}
            >
                <div
                    style={{
                        backgroundColor: "#ffffff",
                        borderRadius: "10px",
                        padding: ".05em",
                    }}
                >
                    <CommitModal
                        denom={ido && ido.token_listing_price.length > 0 && ido.token_listing_price[0].denom}
                        idoID={idoID}
                    />
                </div>
            </Modal>
        </div>
    )
}

export default IDOview