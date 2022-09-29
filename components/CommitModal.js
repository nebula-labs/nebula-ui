import { useState } from "react"
import { useRouter } from "next/router"
import Button from "./input/Button"
import Input from "./input/Input"
import { openLoadingNotification, openNotification } from "./ulti/Notification"
import { participate } from "../libs/nebulaClient"

const CommitModal = ({idoID, denom}) => {
    const [commitAmount, setCommitAmount] = useState(0)

    const router = useRouter()

    const handleChange = (e) => {
        setCommitAmount(e.target.value)
    }

    const handleParticipate = async () => {
        openLoadingNotification("open", "Participating")
        try{
            await participate(idoID, `${commitAmount}${denom}`)
            openLoadingNotification("close")
            openNotification("success", "Participate successfully")
            router.reload()
        }
        catch (e) {
            openLoadingNotification("close")
            openNotification("error", e.message)
        }
    }

    const disabled = () => {
        return commitAmount === 0 || !commitAmount ? true : false
    }

    return (
        <div>
            <h3>
                Commit token ({denom})
            </h3>
            <Input
                name="commit"
                style={{
                    width: '100%',
                    borderRadius: '10px',
                }}
                placeholder="10000000"
                type="number"
                onChange={handleChange}
            />
            <Button
                text={(
                    <div>
                        Proceed
                    </div>
                )}
                clickFunction={async () => handleParticipate()}
                style={{
                    backgroundColor: "black",
                    border: 0,
                    borderRadius: "10px",
                    fontSize: "18px",
                    fontWeight: 400,
                    padding: ".5em 1em",
                    width: "100%",
                    color: "white",
                    marginTop: "30px"
                }}
                disable={disabled()}
            />
        </div>
    )
}

export default CommitModal