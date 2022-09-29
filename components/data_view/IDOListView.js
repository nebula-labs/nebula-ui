import { useEffect, useState } from "react"
import { queryProject } from "../../libs/nebulaClient"
import { openNotification } from "../ulti/Notification"
import { Spin, Image } from "antd"
import { chainData } from "../../data/chainData"

// const api = "https://bbe7-2402-800-6105-9fe0-7f7c-d155-4db1-fcac.ap.ngrok.io/"
const api = chainData[0].api

const IDOListView = ({ id }) => {
    const [project, setProject] = useState()

    useEffect(() => {
        (async () => {
            try {
                const res = await queryProject(api, id)
                res.project && setProject(res.project)
            }
            catch (e) {
                openNotification("error", "Fail to fetch")
            }
        })()
    }, [id])

    return (
        <div>
            {
                project ? (
                    <>
                        <Image
                            src={'/images/ido_icon.png'}
                            preview={false}
                            width={'50%'}
                            style={{
                                marginBottom: '20px'
                            }}
                        />
                        <p
                            style={{
                                fontSize: "24px",
                                fontWeight: "bold"
                            }}
                        >
                            IDO {id}
                        </p>
                        <p>
                            {project.project_title}
                        </p>
                        <p>
                            {project.project_information}
                        </p>
                    </>
                ) : (
                    <div>
                        <Spin
                            size="large"
                        />
                    </div>
                )
            }
        </div>
    )
}

export default IDOListView