export default function Card({data, findUserById}) {
    return (
        <div className="card">
            <div className="top-line">
                {data?.id}
                <div className="pr">
                    {findUserById(data?.userId)?.name.split(' ').map(item => item[0])}
                    <div className="available-icon" style={{backgroundColor: 'rgb(236, 194, 56)'}}></div>
                </div>
            </div>
            <div className="mid-line">
                <p>{data?.title}</p>
            </div>
            <div className="tag">
            <span>{data?.tag[0]}</span>
            </div>
        </div>
    )
}