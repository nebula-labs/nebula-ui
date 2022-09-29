import { useState } from "react"
import Button from "../input/Button"
import Input from "../input/Input"
import { openLoadingNotification, openNotification } from "../ulti/Notification"
import { RocketFilled } from "@ant-design/icons"
import { DatePicker, Slider, TimePicker } from "antd"
import FlexRow from "../flex_box/FlexRow"
import { createIDO } from "../../libs/nebulaClient"
import { DateTime } from "luxon"
import { useRouter } from "next/router"
import { ibcData } from "../../data/ibcData"

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
        padding: "3em 2em",
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
    input: {
        marginBottom: "10px",
        color: "black",
        width: "100%"
    },
}

const CreateIDOForm = () => {
    const [txBody, setTxBody] = useState({
        projName: "",
        projInfor: "",
        allocationAmount: 0,
        allocationDenom: "",
        listingPrice: 0,
        listingDenom: "",
        allocationLimit: {
            min: 0,
            max: 0
        },
        startTime: {
            date: "",
            time: ""
        },
        gas: 200000,
        fee: 0,
        memo: ""
    })
    const [nameErr, setNameErr] = useState("")
    const [inforErr, setInforErr] = useState("")
    const [allocLimitErr, setAllocLimitErr] = useState("")
    const [timeErr, setTimeErr] = useState("")
    const router = useRouter()

    const handleCreateIDO = async () => {
        openLoadingNotification("open", "Creating IDO")
        try {
            const startTime = DateTime.fromISO(txBody.startTime.date + "T" + txBody.startTime.time).toJSDate()

            // convert denom to ibc format if existed
            if (txBody.allocationDenom in ibcData) {
                txBody.allocationDenom = ibcData[txBody.allocationDenom]
            }

            const res = await createIDO(
                txBody.projName,
                txBody.projInfor,
                txBody.allocationAmount,
                txBody.allocationDenom,
                txBody.listingPrice,
                txBody.listingDenom,
                txBody.allocationLimit,
                startTime
            )

            console.log(res)
            openLoadingNotification("close")
            openNotification("success", "Creating successfully")
            router.push('/app')
        } catch (e) {
            openLoadingNotification("close")
            openNotification("error", e.message)
        }
    }

    const handleKeyGroupChange = (e) => {
        if (e.target.name === "allocationAmount") {
            setTxBody({
                ...txBody,
                [e.target.name]: e.target.value
            })
        }
        else if (e.target.name === "listingPrice") {
            setTxBody({
                ...txBody,
                [e.target.name]: e.target.value
            })
        }
        else {
            setTxBody({
                ...txBody,
                [e.target.name]: e.target.value
            })
        }
    }

    const handleLimit = (value) => {
        setTxBody({
            ...txBody,
            allocationLimit: {
                min: value[0],
                max: value[1]
            }
        })
    }

    const handleKeyBlur = (e) => {
        console.log(e)
        if (e.target.name === "projName") {
            e.target.value === "" ? setNameErr("Must fill this form") : setNameErr("")
        }

        if (e.target.name === "projInfor") {
            e.target.value === "" ? setInforErr("Must fill this form") : setInforErr("")
        }
    }

    const handleChangeTime = (e, type) => {
        if (e) {
            if (type === "date") {
                const time = e.toDate()
                const date = time.toISOString().split("T")[0]
                setTxBody({
                    ...txBody,
                    startTime: {
                        ...txBody.startTime,
                        date: date
                    }
                })
            }
            else {
                const time = e.toDate()
                const hour = time.toISOString().split("T")[1]
                setTxBody({
                    ...txBody,
                    startTime: {
                        ...txBody.startTime,
                        time: hour
                    }
                })
            }
        }
    }

    return (
        <div
            style={style.container}
        >
            <p
                style={{
                    fontSize: '24px'
                }}
            >
                Create IDO Form
            </p>
            <p
                style={{
                    fontSize: '18px'
                }}
            >
                3..2..1! Launch! <br />
                Watch out! Astronaut! Once launched, cannot change
            </p>
            <div
                style={style.form}
            >
                <Input
                    label="Project name"
                    name="projName"
                    value={txBody.projName}
                    style={style.input}
                    error={nameErr}
                    placeholder="type in project name"
                    onChange={(e) => {
                        handleKeyGroupChange(e);
                    }}
                    onBlur={handleKeyBlur}
                />
                <Input
                    label="Project information"
                    name="projInfor"
                    value={txBody.projInfor}
                    style={style.input}
                    error={inforErr}
                    placeholder="type in project information"
                    onChange={(e) => {
                        handleKeyGroupChange(e);
                    }}
                    onBlur={handleKeyBlur}
                />
                <h4
                    style={{
                        marginBottom: 0
                    }}
                >
                    Allocation amount
                </h4>
                <FlexRow
                    components={[
                        <Input
                            name="allocationAmount"
                            style={{
                                ...style.input,
                                borderRadius: '10px',
                                width: "49%"
                            }}
                            placeholder="10000000000"
                            type="number"
                            onChange={(e) => {
                                handleKeyGroupChange(e);
                            }}
                            onBlur={handleKeyBlur}
                        />,
                        <Input
                            name="allocationDenom"
                            style={{
                                ...style.input,
                                borderRadius: '10px',
                                width: "49%",
                            }}
                            placeholder="unebula"
                            onChange={(e) => {
                                handleKeyGroupChange(e);
                            }}
                            onBlur={handleKeyBlur}
                        />
                    ]}
                    justifyContent="space-between"
                    style={{
                        marginBottom: '30px'
                    }}
                />
            <h4
                style={{
                    marginBottom: 0
                }}
            >
                Listing price
            </h4>
            <FlexRow
                components={[
                    <Input
                        name="listingPrice"
                        style={{
                            ...style.input,
                            width: '49%',
                            borderRadius: '10px',
                        }}
                        placeholder="10000000"
                        type="number"
                        onChange={(e) => {
                            handleKeyGroupChange(e);
                        }}
                        onBlur={handleKeyBlur}
                    />,
                    <Input
                        name="listingDenom"
                        style={{
                            ...style.input,
                            width: '49%',
                            borderRadius: '10px',
                        }}
                        placeholder="uusdt"
                        onChange={(e) => {
                            handleKeyGroupChange(e);
                        }}
                        onBlur={handleKeyBlur}
                    />,
                ]}
                justifyContent="space-between"
                style={{
                    marginBottom: '30px'
                }}
            />
            <h4
                style={{
                    marginBottom: 0
                }}
            >
                Allocation limit
            </h4>
            <Slider
                label="Allocation limit"
                name="allocationLimit"
                range
                min={0}
                step={100}
                max={txBody.allocationAmount}
                onChange={handleLimit}
            />
            <text
                style={{
                    color: 'red',
                    fontSize: '.6rem'
                }}
            >
                {allocLimitErr}
            </text>
            <h4
                style={{
                    marginBottom: 0
                }}
            >
                Start time
            </h4>
            <FlexRow
                components={[
                    <DatePicker
                        style={{
                            width: '49%',
                            padding: '.5em 1em',
                            borderRadius: '10px'
                        }}
                        size="large"
                        onChange={(e) => handleChangeTime(e, "date")}
                    />,
                    <TimePicker
                        style={{
                            width: '49%',
                            padding: '.5em 1em',
                            borderRadius: '10px'
                        }}
                        size="large"
                        onChange={(e) => handleChangeTime(e, "time")}
                    />
                ]}
                justifyContent="space-between"
                style={{
                    marginBottom: '30px'
                }}
            />
            <text
                style={{
                    color: 'red',
                    fontSize: '.6rem'
                }}
            >
                {timeErr}
            </text>
            <Button
                text={(
                    <div>
                        CREATE <RocketFilled />
                    </div>
                )}
                clickFunction={async () => handleCreateIDO()}
                style={{
                    backgroundColor: "black",
                    border: 0,
                    borderRadius: '10px',
                    fontSize: '18px',
                    fontWeight: 400,
                    padding: '.5em 1em',
                    width: '100%'
                }}
            />
        </div>
        </div >
    )
}

export default CreateIDOForm