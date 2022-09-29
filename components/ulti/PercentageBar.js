const PercentageBar = ({ percent }) => {
    return (
        <div
            style={{
                height: '20px',
                width: "100%",
                backgroundColor: "#525252",
                display: "block",
            }}
        >
            <div
                style={{
                    height: '20px',
                    width: `${percent * 100}%`,
                    backgroundImage: "linear-gradient(92.29deg, #005EB3 0%, #8F63CA 100%)",
                    display: "block",
                    fontSize: "10pxs",
                    overflow: "hidden"
                }}
            >
                <text
                    style={{
                        position: "relative",
                        top: "-5px"
                    }}
                >
                    {
                        `${(percent * 100 ).toFixed(2)} %`
                    }
                </text>
            </div>
        </div>
    )
}

export default PercentageBar