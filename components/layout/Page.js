import Header from "../Header"

const Page = ({ children }) => {

    return (
        <div
            className="page-container"
        >
            <Header/>
            <div
                style={{
                    backgroundImage: `url(/images/background.jpeg)`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    minHeight: '100vh',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'column'
                }}
            >
                {
                    children
                }
            </div>

            {/* global css */}
            <style jsx global>{`
                ::-webkit-scrollbar {
                    width: 10px;
                    height: 5px;
                }
                
                /* Track */
                ::-webkit-scrollbar-track {
                    display: none;
                    background: transparent
                }
                
                /* Handle */
                ::-webkit-scrollbar-thumb {
                    background: #8f8f8f; 
                    border-radius: 10px;
                }
                
                .hover-nav-button:hover {
                    font-size: 1.5em;
                }

                .ant-modal-content {
                    border-radius: 20px;
                    /* background: red; */
                  }

                .anticon-copy {
                    color: white;
                }

                .black-placeholder::placeholder {
                    color: #333333;
                    opacity: 0.5
                }
            `}</style>
        </div>
    )
}

export default Page